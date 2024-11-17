import { lazy, useContext, useEffect } from "react";
import { getWithExpiry } from "../utils/local-storage";
import { AppContext } from "../AppContext";
import styles from '../app.module.css';

const SpotifyPlayer = lazy(() => import("../components/SpotifyPlayer"));
const Recommendations = lazy(() => import("../components/Recommendations"));
const SpotifyConnect = lazy(() => import("../components/SpotifyConnect"));
const Toast = lazy(() => import("../components/Toast"));

const Home = () => {
    const { hasSpotifyToken, setHasSpotifyToken } = useContext(AppContext)

    useEffect(() => {
        setHasSpotifyToken(getWithExpiry("spotifyToken") != null)
    }, [setHasSpotifyToken]);

    return (
        <div className={`${styles.app} bg-indigo-50 font-montserrat h-full w-full overflow-y-auto overflow-x-hidden`}>
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