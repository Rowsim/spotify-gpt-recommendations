import { createContext, useState } from "react";
import { Playlist } from "./types/spotify";

interface AppContextType {
  hasSpotifyToken: boolean;
  setHasSpotifyToken: Function;
  userPlaylists: Playlist[] | undefined;
  setUserPlaylists: Function;
}

export const AppContext = createContext<AppContextType>({
  hasSpotifyToken: false,
  setHasSpotifyToken: () => { },
  userPlaylists: [],
  setUserPlaylists: () => { }
});

export const AppProvider = ({ children }: any) => {
  const [hasSpotifyToken, setHasSpotifyToken] = useState(false);
  const [userPlaylists, setUserPlaylists] = useState();

  return (
    <AppContext.Provider
      value={{
        hasSpotifyToken,
        setHasSpotifyToken,
        userPlaylists,
        setUserPlaylists
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
