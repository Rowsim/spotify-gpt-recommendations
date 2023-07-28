import { Dispatch, SetStateAction, createContext, useState } from "react";
import { Playlist, SpotifyPlayerState } from "./types/spotify";

interface Toast {
  message: string,
  ttlMs: number,
  error?: boolean
}
interface AppContextType {
  hasSpotifyToken: boolean;
  setHasSpotifyToken: Function;
  userPlaylists: Playlist[] | undefined;
  setUserPlaylists: Function;
  toast: Toast | undefined
  setToastWithExpiry: Function;
  spotifyPlayerState: SpotifyPlayerState | undefined;
  setSpotifyPlayerState: Dispatch<SetStateAction<SpotifyPlayerState | undefined>>;
}

export const AppContext = createContext<AppContextType>({
  hasSpotifyToken: false,
  setHasSpotifyToken: () => { },
  userPlaylists: [],
  setUserPlaylists: () => { },
  toast: undefined,
  setToastWithExpiry: () => { },
  setSpotifyPlayerState: () => { },
  spotifyPlayerState: undefined
});

export const AppProvider = ({ children }: any) => {
  const [hasSpotifyToken, setHasSpotifyToken] = useState(false);
  const [userPlaylists, setUserPlaylists] = useState<Playlist[] | undefined>();
  const [toast, setToast] = useState<Toast | undefined>();
  const [spotifyPlayerState, setSpotifyPlayerState] = useState<SpotifyPlayerState | undefined>();

  const setToastWithExpiry = (toast: Toast) => {
    setToast(toast)
    setTimeout(() => {
      setToast(undefined)
    }, toast.ttlMs)
  }

  return (
    <AppContext.Provider
      value={{
        hasSpotifyToken,
        setHasSpotifyToken,
        userPlaylists,
        setUserPlaylists,
        toast,
        setToastWithExpiry,
        spotifyPlayerState,
        setSpotifyPlayerState
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
