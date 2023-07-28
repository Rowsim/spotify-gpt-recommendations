// @ts-nocheck
import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../AppContext";
import { checkSpotifyTokenAndRefresh } from "../../services/spotify-auth";
import { setActivePlayer } from "../../services/spotify-player";
import { SpotifyPlayerState } from "../../services/spotify-types";
import { Player } from "./player";

const PlayerContainer = () => {
    const { setSpotifyPlayerState } = useContext(AppContext);
    const [playerWebSDKConnected, setPlayerWebSDKConnected] = useState(false);

    useEffect(() => {
        if (playerWebSDKConnected) return;
        const spotifyScript = loadSpotifySDKScript();
        window.onSpotifyWebPlaybackSDKReady = () => {
            const token = checkSpotifyTokenAndRefresh();
            const player = new Spotify.Player({
                name: "Spotify Recommendations Web Player",
                getOAuthToken: (cb) => {
                    cb(token);
                },
            });

            player.addListener("initialization_error", ({ message }) => {
                console.error(message);
            });
            player.addListener("authentication_error", ({ message }) => {
                console.error(message);
            });
            player.addListener("account_error", ({ message }) => {
                console.error(message);
            });
            player.addListener("playback_error", ({ message }) => {
                console.error(message);
            });

            player.addListener(
                "player_state_changed",
                (state: SpotifyPlayerState) => {
                    setSpotifyPlayerState(state);
                }
            );

            player.addListener("ready", ({ device_id }) => {
                console.log("Ready with Device ID", device_id);
                setActivePlayer(device_id);
                player.setVolume(0.4);
            });

            player.addListener("not_ready", ({ device_id }) => {
                console.log("Device ID has gone offline", device_id);
            });

            player.connect().then((success) => {
                if (success) {
                    setTimeout(() => setPlayerWebSDKConnected(true), 2000);
                    console.log("Spotify Player Web SDK succesfully connected!");
                } else {
                    setPlayerWebSDKConnected(false);
                    console.error("Spotify Player Web SDK failed to connect.");
                }
            });
        };

        return () => {
            document.body.removeChild(spotifyScript);
        };
    }, []);

    if (playerWebSDKConnected) return <Player />;
    else return null;
};

const loadSpotifySDKScript = () => {
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://sdk.scdn.co/spotify-player.js";
    document.body.appendChild(script);
    return script;
};

export default PlayerContainer;
