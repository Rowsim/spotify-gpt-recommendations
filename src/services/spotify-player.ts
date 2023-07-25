import { checkSpotifyTokenAndRefresh } from "./spotify-auth";

const SPOTIFY_API_URL = "https://api.spotify.com/v1/me/player";

export const playTrack = async (trackIds: string[]) => {
  const spotifyToken = await checkSpotifyTokenAndRefresh();

  await fetch(`${SPOTIFY_API_URL}/play`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${spotifyToken}`,
    },
    body: JSON.stringify({ uris: trackIds.map(id => `spotify:track:${id}`) }),
  });
};

export const play = async () => {
  const spotifyToken = await checkSpotifyTokenAndRefresh();

  fetch(`${SPOTIFY_API_URL}/play`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${spotifyToken}`,
    },
  });
};

export const pause = async () => {
  const spotifyToken = await checkSpotifyTokenAndRefresh();

  fetch(`${SPOTIFY_API_URL}/pause`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${spotifyToken}`,
    },
  });
};

export const setActivePlayer = async (playerId: string, play = false) => {
  const spotifyToken = await checkSpotifyTokenAndRefresh();

  await fetch(SPOTIFY_API_URL, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${spotifyToken}`,
    },
    body: JSON.stringify({ device_ids: [playerId], play }),
  });
};
