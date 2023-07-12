import SpotifyLogo from "../../assets/images/spotify.svg";

export const SpotifyConnect = () => (
  <button className="group bg-spotify-black h-12 flex items-center hover:opacity-50 active:opacity-70 focus:outline-none focus:ring focus:ring-violet-300 px-5 py-2 text-sm leading-5 rounded-full text-spotify-green">
    <p className="mr-2 font-bold text-lg group-hover:text-violet-100 group-focus:text-violet-100">
      Connect Spotify
    </p>
    <img src={SpotifyLogo} alt="spotify logo" className="h-6" />
  </button>
);
