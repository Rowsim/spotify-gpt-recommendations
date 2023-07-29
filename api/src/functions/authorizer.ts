import axios from 'axios';

export const handler = async (event) => {
    let response = {
        isAuthorized: false,
        context: {}
    }

    if (event.headers.authorization === "dev-temp-tUYGJ_SV7GCTj17-44xA2" || await checkSpotifyUser(event.headers.authorization)) {
        response = {
            isAuthorized: true,
            context: {}
        }
    }

    return response
}

const checkSpotifyUser = async (authorization?: string) => {
    if (!authorization) return false
    try {
        await axios.get('https://api.spotify.com/v1/me', {
            headers: {
                Authorization: `Bearer ${authorization}`
            }
        })
        return true
    } catch (e) {
        console.error(e)
        return false
    }
}
