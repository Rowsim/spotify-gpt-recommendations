import { UserTopTimeRange } from '../types/spotify';

export const GetRecommendations = async (event) => {
    console.debug('event', event)
    const { headers, queryStringParameters } = event

    if (!queryStringParameters.timeRange || !Object.values(UserTopTimeRange).includes(queryStringParameters.timeRange)) throw Error('Bad request');


    return `Hello from lambda`
}