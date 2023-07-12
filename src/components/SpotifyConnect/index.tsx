import SpotifyLogo from "../../assets/images/spotify.svg";
import { Button } from "../Button";

export const SpotifyConnect = () => (
  <Button text="Connect Spotify" solid iconRight={SpotifyLogo} iconRightClass="ml-2 h-6 group-hover:animate-bounce group-focus:animate-bounce" textClass="group-hover:text-violet-100 group-focus:text-violet-100" />
);
