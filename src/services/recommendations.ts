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
    // console.log("Delayed for 3 seconds.");
    // await new Promise(r => setTimeout(r, 3000));

    const topTracks = await getUserTopTracks(term, 5);
    console.debug('topTracks', topTracks);
    const gptQuery = topTracksToGptQuery(topTracks.items, 5);
    console.debug('gptQuery', gptQuery)
    const gptResponse = await queryOpenAIChat(gptQuery);
    console.debug('gptResponse', gptResponse);
    const gptSongs = parseGptSongResponse(gptResponse!)
    console.debug('gptSongs', gptSongs)
    const searchResponse = await spotifySearchTrack(gptSongs[0])
    console.debug('searchResponse', searchResponse);

    // TODO Search spotify for each track

    return [
        {
            id: '11',
            name: 'Who Told You (feat. Drake)',
            images: [
                { url: 'https://allmusicmagazine.com/wp-content/uploads/2023/07/unnamed-12.jpeg', height: 1, width: 1 }
            ],
            duration_ms: 210000,
            artists: [
                {
                    name: 'J Hus'
                },
                {
                    name: 'Drake'
                }
            ],
            album: {
                name: 'Beautiful and Brutal Yard'
            }
        } as any,
        {
            id: '22',
            name: 'Rich Flex',
            images: [
                { url: 'https://upload.wikimedia.org/wikipedia/en/a/a5/Her_Loss.jpeg', height: 1, width: 1 }
            ],
            duration_ms: 210000,
            artists: [
                {
                    name: 'Drake'
                },
                {
                    name: '21 Savage'
                }
            ],
            album: {
                name: 'Her Loss'
            }
        } as any
    ];
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
    if (searchResults.tracks.items >= 1) return searchResults;

    // Looks like cgpt mixes up tracks with different artists ocassionally..
    // so we'll do a more generic search if the first one has no results
    const trackQuery = `track:${gptSong.song}`
    return await spotifySearch(`${encodeURIComponent(trackQuery)}&type=track&market=GB&limit=1`);
}

const spotifySearch = async (query: string) => {
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
        jsonString = `[${response.split('[')[1]}`
    }
    const songs = JSON.parse(jsonString);
    console.debug('songsJson', songs);
    return songs.map((song: GptSong) => ({
        song: song.song.split('-')[0].trim(),
        artist: song.artist.trim()
    }))
}