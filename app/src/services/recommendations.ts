import { checkSpotifyTokenAndRefresh } from "./spotify-auth";
import { Playlist, Track, UserTopTimeRange } from '../types/spotify';
import { getArtistNames } from "../utils/spotify-utils";
import { Configuration, OpenAIApi } from "openai";

// TODO Move most of this logic server side after testing

const SPOTIFY_API_URL = "https://api.spotify.com/v1";

const openaiClient = new OpenAIApi(new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
}));

interface Recommendations {
    gptRecommendations: Track[]
    spotifyRecommendations: Track[]
}
export const getRecommendationsFromLambda = async (term: UserTopTimeRange): Promise<Recommendations> => {
    const spotifyToken = await checkSpotifyTokenAndRefresh();
    if (!spotifyToken) return Promise.reject('Invalid spotify token')
    return (await fetch(
        `https://pubzxxtvt9.execute-api.eu-west-2.amazonaws.com/recommendations?timeRange=${term}`,
        {
            method: "GET",
            headers: {
                Authorization: `${spotifyToken}`,
            },
        }
    )).json()
}

export const getRecommendations = async (term: string): Promise<Recommendations> => {
    const topTracks = await getUserTopTracks(term, 10);
    console.debug('topTracks', topTracks);
    const spotifyRecommendations = (await getSpotifyRecommendations(topTracks.items)).tracks;
    console.debug('spotifyRecommendations', spotifyRecommendations);

    const gptQuery = topTracksToGptQuery(topTracks.items, 10);
    console.debug('gptQuery', gptQuery)
    const gptResponse = await queryOpenAIChat(gptQuery);
    console.debug('gptResponse', gptResponse);
    const gptSongs = parseGptSongResponse(gptResponse!)
    console.debug('gptSongs', gptSongs)

    const tracksFromSearch = await Promise.allSettled(gptSongs.map(spotifySearchTrack))
    console.debug('tracksFromSearch', tracksFromSearch);
    const gptRecommendations: Track[] = [];
    tracksFromSearch.forEach(result => {
        if (result.status === 'fulfilled') {
            gptRecommendations.push(...result.value.tracks.items)
        } else {
            console.info(result.status, result.reason)
        }
    })
    console.debug('gptRecommendations', gptRecommendations)

    // const tracksResult: Track[] = [];
    // for (const song of gptSongs) {
    //     const searchResult = await spotifySearchTrack(song)
    //     console.debug('gptSong, searchResult', song, searchResult)
    //     tracksResult.push(...searchResult.tracks.items)
    //     await new Promise(r => setTimeout(r, 250));
    // }
    return { gptRecommendations, spotifyRecommendations };
}

const getUserTopTracks = async (
    timeRange: string,
    limit?: number
): Promise<{ items: Track[] }> => {
    const spotifyToken = await checkSpotifyTokenAndRefresh();
    if (spotifyToken) {
        console.log(`GET ${SPOTIFY_API_URL}/me/top/tracks`);
        const userTopTracksResponse = await fetch(
            `${SPOTIFY_API_URL}/me/top/tracks?time_range=${timeRange}${limit ? `&limit=${limit}` : ""
            }`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${spotifyToken}`,
                },
            }
        );

        return userTopTracksResponse.json();
    }

    return Promise.reject("Invalid spotify auth token :(");
};

interface SpotifyRecommendationsResponse {
    tracks: Track[]
}
const getSpotifyRecommendations = async (tracks: Track[]): Promise<SpotifyRecommendationsResponse> => {
    const spotifyToken = await checkSpotifyTokenAndRefresh();
    if (!spotifyToken) return Promise.reject("Missing spotify token");

    console.log(`GET ${SPOTIFY_API_URL}/recommendations`);
    const seedArtists = [...tracks.flatMap(track => track.artists).map(artist => artist.id)].slice(0, 3).join(',')
    const seedTracks = [...tracks.map(track => track.id)].slice(0, 2).join(',')
    const recommendationsResponse = await fetch(
        `${SPOTIFY_API_URL}/recommendations?limit=10&market=GB&seed_artists=${encodeURIComponent(seedArtists)}&seed_tracks=${encodeURIComponent(seedTracks)}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${spotifyToken}`,
            },
        }
    );

    return await recommendationsResponse.json();
}

const spotifySearchTrack = async (gptSong: GptSong) => {
    console.log(`GET ${SPOTIFY_API_URL}/search`);
    const trackQuerySongAndArtist = `track:${gptSong.song} artist:${gptSong.artist}`
    const searchResults = await spotifySearch(`${encodeURIComponent(trackQuerySongAndArtist)}&type=track&market=GB&limit=1`);
    if (searchResults.tracks.items.length >= 1) return searchResults;

    const trackQuery = `track:${gptSong.song}`
    return await spotifySearch(`${encodeURIComponent(trackQuery)}&type=track&market=GB&limit=1`);
}


interface SpotifySearchTracksResponse {
    tracks: {
        items: Track[]
    }
}
const spotifySearch = async (query: string): Promise<SpotifySearchTracksResponse> => {
    const spotifyToken = await checkSpotifyTokenAndRefresh();
    console.log(`GET ${SPOTIFY_API_URL}/search`);
    if (!spotifyToken) return Promise.reject("Missing spotify auth token");
    const searchResponse = await fetch(
        `${SPOTIFY_API_URL}/search?q=${query}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${spotifyToken}`,
            },
        }
    );

    return await searchResponse.json()
}

const topTracksToGptQuery = (tracks: Track[], limit = 10) => {
    let trackQuery = 'I like these songs '

    tracks.forEach(track => {
        trackQuery += `"${track.name} - ${getArtistNames(track.artists).join(',')}", `
    })

    trackQuery += `can you suggest ${limit} songs like these, list them in a json array [{song: string, artist: string}]`
    return trackQuery;
}

// Around 200-250 tokens per request... about 5 requests per $0.002 - 50 req 0.02 - 500 req 0.2 - 5000 - $2
const queryOpenAIChat = async (prompt: string) => {
    const completion = await openaiClient.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
    });
    return completion.data.choices[0].message?.content
}

interface GptSong {
    song: string,
    artist: string
}
const parseGptSongResponse = (response: string): GptSong[] => {
    let jsonString;
    if (response.includes('```json')) {
        jsonString = response.split('json\n')[1].replace(/(\r\n|\n|\r)/gm, "").split('```')[0]
    } else {
        jsonString = `[${response.split('[')[1].split(']')[0]}]`
    }
    const songs = JSON.parse(jsonString);
    console.debug('songsJson', songs);
    return songs.map((song: GptSong) => ({
        song: song.song.split('-')[0].trim(),
        artist: song.artist.trim()
    }))
}


interface SpotifyPlaylistsResponse {
    items: Playlist[]
}
export const getUserSpotifyPlaylists = async (): Promise<SpotifyPlaylistsResponse> => {
    const spotifyToken = await checkSpotifyTokenAndRefresh();
    if (!spotifyToken) return Promise.reject("Missing spotify token");

    console.log(`GET ${SPOTIFY_API_URL}/me/playlists`);
    const playlistsResponse = await fetch(
        `${SPOTIFY_API_URL}/me/playlists?limit=50`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${spotifyToken}`,
            },
        }
    );

    return await playlistsResponse.json();
}

export const addTrackToUserSpotifyPlaylist = async (playlistId: string, trackId: string) => {
    const spotifyToken = await checkSpotifyTokenAndRefresh();
    if (!spotifyToken) return Promise.reject("Missing spotify token");

    console.log(`POST ${SPOTIFY_API_URL}/playlists/${playlistId}/tracks`);
    await fetch(
        `${SPOTIFY_API_URL}/playlists/${playlistId}/tracks`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${spotifyToken}`,
            },
            body: JSON.stringify({
                uris: [`spotify:track:${trackId}`]
            })
        }
    );
}