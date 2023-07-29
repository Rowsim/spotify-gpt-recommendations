import { Track } from "../types/spotify"
import { Configuration, OpenAIApi } from "openai";
import { getArtistNames } from "./spotify";
import { GptSong } from "../types/openai";

const openaiClient = new OpenAIApi(new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
}));

export const topTracksToGptQuery = (tracks: Track[], limit = 10) => {
    let trackQuery = 'I like these songs '

    tracks.forEach(track => {
        trackQuery += `"${track.name} - ${getArtistNames(track.artists, 5).join(',')}", `
    })

    trackQuery += `can you suggest ${limit} songs like these, list them in a json array [{song: string, artist: string}]`
    return trackQuery;
}

export const queryOpenAIChat = async (prompt: string) => {
    const completion = await openaiClient.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
    });
    return completion.data.choices[0].message?.content
}

export const parseGptSongResponse = (response: string): GptSong[] => {
    let jsonString;
    if (response.includes('```json')) {
        jsonString = response.split('json\n')[1].replace(/(\r\n|\n|\r)/gm, "").split('```')[0]
    } else {
        jsonString = `[${response.split('[')[1].split(']')[0]}]`
    }
    const songs = JSON.parse(jsonString);
    return songs.map((song: GptSong) => ({
        song: song.song.split('-')[0].trim(),
        artist: song.artist.trim()
    }))
}
