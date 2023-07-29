import axios from "axios";
import { Track, UserTopTimeRange } from "../types/spotify";
import { GptSong } from '../types/openai'

const SPOTIFY_API_URL = "https://api.spotify.com/v1";

const getUserTopTracks = async (
    timeRange: UserTopTimeRange,
    spotifyToken: string,
    limit?: number
): Promise<{ items: Track[] }> => {
    return (await axios.get(`${SPOTIFY_API_URL}/me/top/tracks?time_range=${timeRange}${limit ? `&limit=${limit}` : ""}`, {
        headers: {
            Authorization: `Bearer ${spotifyToken}`
        }
    })).data
}


interface SpotifyRecommendationsResponse {
    tracks: Track[]
}
const getSpotifyRecommendations = async (tracks: Track[], spotifyToken: string): Promise<SpotifyRecommendationsResponse> => {
    const seedArtists = [...tracks.flatMap(track => track.artists).map(artist => artist.id)].slice(0, 3).join(',')
    const seedTracks = [...tracks.map(track => track.id)].slice(0, 2).join(',')

    return (await axios.get(`${SPOTIFY_API_URL}/recommendations?limit=10&market=GB&seed_artists=${encodeURIComponent(seedArtists)}&seed_tracks=${encodeURIComponent(seedTracks)}`, {
        headers: {
            Authorization: `Bearer ${spotifyToken}`,
        }
    })).data
}

interface SpotifySearchTracksResponse {
    tracks: {
        items: Track[]
    }
}
const spotifySearch = async (query: string, spotifyToken: string): Promise<SpotifySearchTracksResponse> => {
    return (await axios.get(`${SPOTIFY_API_URL}/search?q=${query}`, {
        headers: {
            Authorization: `Bearer ${spotifyToken}`,
        }
    })).data
}

const spotifySearchGPTSong = async (gptSong: GptSong, spotifyToken: string) => {
    const trackQuerySongAndArtist = `track:${gptSong.song} artist:${gptSong.artist}`
    const searchResults = await spotifySearch(`${encodeURIComponent(trackQuerySongAndArtist)}&type=track&market=GB&limit=1`, spotifyToken);
    if (searchResults.tracks.items.length >= 1) return searchResults;

    const trackQuery = `track:${gptSong.song}`
    return await spotifySearch(`${encodeURIComponent(trackQuery)}&type=track&market=GB&limit=1`, spotifyToken);
}