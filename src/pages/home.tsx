import { useContext, useEffect } from "react";
import { SpotifyConnect } from "../components/SpotifyConnect";
import { getWithExpiry } from "../utils/local-storage";
import Recommendations from "../components/Recommendations";
import { AppContext } from "../AppContext";

const Home = () => {
    const { hasSpotifyToken, setHasSpotifyToken } = useContext(AppContext)

    useEffect(() => {
        setHasSpotifyToken(getWithExpiry("spotifyToken") != null)
    }, []);

    return (
        <div className="bg-indigo-50 font-montserrat h-full w-full overflow-y-auto">
            <div className='flex justify-center items-center h-full w-full'>
                {
                    hasSpotifyToken ? <Recommendations /> : <SpotifyConnect />
                }
            </div>
        </div>
    )
}

export default Home;