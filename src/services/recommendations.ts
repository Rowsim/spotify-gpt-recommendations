import { checkSpotifyTokenAndRefresh } from "./spotify-auth";
import { Track } from '../types/spotify';
import { getArtistNames } from "../utils/spotify-utils";
import { Configuration, OpenAIApi } from "openai";

// TODO Move most of this logic server side after testing

const SPOTIFY_API_URL = "https://api.spotify.com/v1";

const openaiClient = new OpenAIApi(new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
}));

export const getRecommendations = async (term: string) => {
    const topTracks = await getUserTopTracks(term, 10);
    console.debug('topTracks', topTracks);
    const gptQuery = topTracksToGptQuery(topTracks.items, 10);
    console.debug('gptQuery', gptQuery)
    const gptResponse = await queryOpenAIChat(gptQuery);
    console.debug('gptResponse', gptResponse);
    const gptSongs = parseGptSongResponse(gptResponse!)
    console.debug('gptSongs', gptSongs)

    const tracksFromSearch = await Promise.allSettled(gptSongs.map(spotifySearchTrack))
    console.debug('tracksFromSearch', tracksFromSearch);
    const tracksResult: Track[] = [];
    tracksFromSearch.forEach(result => {
        if (result.status === 'fulfilled') {
            tracksResult.push(...result.value.tracks.items)
        } else {
            console.info(result.status, result.reason)
        }
    })

    // const tracksResult: Track[] = [];
    // for (const song of gptSongs) {
    //     const searchResult = await spotifySearchTrack(song)
    //     console.debug('gptSong, searchResult', song, searchResult)
    //     tracksResult.push(...searchResult.tracks.items)
    //     await new Promise(r => setTimeout(r, 250));
    // }
    console.debug('tracksResult', tracksResult)
    return tracksResult;
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