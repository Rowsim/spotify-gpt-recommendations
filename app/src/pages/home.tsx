import { useContext, useEffect } from "react";
import { SpotifyConnect } from "../components/SpotifyConnect";
import { getWithExpiry } from "../utils/local-storage";
import Recommendations from "../components/Recommendations";
import { AppContext } from "../AppContext";
import { Toast } from "../components/Toast";
import SpotifyPlayer from "../components/SpotifyPlayer";

const Home = () => {
    const { hasSpotifyToken, setHasSpotifyToken } = useContext(AppContext)

    useEffect(() => {
        setHasSpotifyToken(getWithExpiry("spotifyToken") != null)
    }, [setHasSpotifyToken]);

    return (
        <div className="bg-indigo-50 font-montserrat h-full w-full overflow-y-auto overflow-x-hidden">
            <div className='flex justify-center items-center h-full w-full'>
                {
                    hasSpotifyToken ? <>
                        <SpotifyPlayer />
                        <Recommendations />
                    </> : < SpotifyConnect />
                }
            </div>

            <Toast />
        </div>
    )
}

export default Home;