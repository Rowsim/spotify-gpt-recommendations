import { useEffect, useState } from "react";
import SpotifyLogo from "../../assets/images/spotify.svg";
import { Button } from "../Button";
import { getSpotifyAuthRequestUri } from "../../services/spotify-auth";

export const SpotifyConnect = () => {
  const [authRequestUri, setRequestAuthUri] = useState("");

  useEffect(() => {
    getSpotifyAuthRequestUri().then(setRequestAuthUri);
  }, []);

  return (
    <a href={authRequestUri}>
      <Button text="Connect Spotify" solid iconRight={SpotifyLogo} iconRightClass="ml-2 h-6 group-hover:animate-bounce group-focus:animate-bounce" textClass="group-hover:text-violet-100 group-focus:text-violet-100" />
    </a>
  )
};
