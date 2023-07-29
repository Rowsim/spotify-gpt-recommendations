import { parseGptSongResponse, queryOpenAIChat, topTracksToGptQuery as topTracksToGptRecommendationQuery } from '../lib/openai';
import { getSpotifyRecommendations, getUserTopTracks, spotifySearchGPTSong } from '../lib/spotify';
import { Track, UserTopTimeRange } from '../types/spotify';

const USER_TOP_TRACKS_LIMIT = 20;
const SUGGESTIONS_LIMIT = 20;

export const GetRecommendations = async (event) => {
    const { headers: { authorization }, queryStringParameters: { timeRange } } = event

    if (!timeRange || !Object.values(UserTopTimeRange).includes(timeRange)) throw Error('Bad request');

    const topTracks = await getUserTopTracks(timeRange, authorization, USER_TOP_TRACKS_LIMIT)

    const [getSpotifyReccomendationsResult, gptQueryResponse] = await Promise.allSettled(
        [
            getSpotifyRecommendations(topTracks, authorization, SUGGESTIONS_LIMIT),
            queryOpenAIChat(topTracksToGptRecommendationQuery(topTracks, SUGGESTIONS_LIMIT))
        ])

    const spotifyRecommendations = getSpotifyReccomendationsResult.status === 'fulfilled' ? getSpotifyReccomendationsResult.value : []
    let gptRecommendations: Track[] = []
    if (gptQueryResponse.status === 'fulfilled' && gptQueryResponse.value) {
        const gptSongs = parseGptSongResponse(gptQueryResponse.value)

        const tracksFromSearch = await Promise.allSettled(gptSongs.map((song) => spotifySearchGPTSong(song, authorization)))
        tracksFromSearch.forEach(result => {
            if (result.status === 'fulfilled') {
                gptRecommendations.push(...result.value.tracks.items)
            } else {
                console.error(result.status, result.reason)
            }
        })
    }

    return JSON.stringify({
        spotifyRecommendations,
        gptRecommendations
    })
}