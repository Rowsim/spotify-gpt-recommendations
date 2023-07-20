import { useContext, useEffect, useState } from "react";
import { getRecommendations, getUserSpotifyPlaylists } from "../../services/recommendations";
import { Button } from "../Button"
import { Track, UserTopTimeRange } from "../../types/spotify";
import classNames from "classnames";
import TrackCard from "../TrackCard";
import SpotifyLogo from '../../assets/images/spotify.svg'
import ChatGptLogo from '../../assets/images/chatgpt.png'
import { AppContext } from "../../AppContext";

const Recommendations = () => {
    const { userPlaylists, setUserPlaylists, setToastWithExpiry } = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTimeRange, setSelectedTimeRange] = useState<undefined | UserTopTimeRange>();
    const [gptRecommendedTracks, setGptRecommendedTracks] = useState<Track[]>();
    const [spotifyRecommendedTracks, setSpotifyRecommendedTracks] = useState<Track[]>();

    useEffect(() => {
        if (!userPlaylists) {
            (async () => setUserPlaylists((await getUserSpotifyPlaylists()).items))()
        }
    }, [])

    const handleGetRecommendationsClick = async (term: UserTopTimeRange) => {
        if (term === selectedTimeRange) return;
        setSelectedTimeRange(term);
        setIsLoading(true);
        try {
            const { gptRecommendations, spotifyRecommendations } = await getRecommendations(term);
            setGptRecommendedTracks(gptRecommendations);
            setSpotifyRecommendedTracks(spotifyRecommendations);
        } catch (e) {
            console.error(e);
            setToastWithExpiry({ message: 'Failed to generate suggestions', error: true, ttlMs: 4000 })
        }
        setIsLoading(false);
    }

    return (
        <div className="flex-row justify-center items-center mt-16 max-h-[100vh] text-zinc-700">
            {
                isLoading ? (
                    <div className="flex items-center">
                        <h1 className="animate-pulse mr-2 text-xl font-extrabold leading-none tracking-tight md:text-2xl lg:text-3xl"><span className="underline underline-offset-3 decoration-4 decoration-spotify-green">Generating</span> suggestions!</h1>
                        <svg aria-hidden="true" className="inline opacity-60 w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-spotify-green" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                    </div>
                ) :
                    (gptRecommendedTracks || spotifyRecommendedTracks) ? <section>
                        <div className="flex justify-center items-center mb-4">
                            <Button text='Month' onClick={() => handleGetRecommendationsClick(UserTopTimeRange.SHORT)} outlineDotted customClass={classNames('mr-4 h-8 px-4',
                                {
                                    'outline-violet-300': selectedTimeRange === UserTopTimeRange.SHORT
                                })} textClass="group-hover:animate-pulse group-focus:animate-pulse text-zinc-700" disabled={selectedTimeRange === UserTopTimeRange.SHORT} />
                            <Button text='Year' onClick={() => handleGetRecommendationsClick(UserTopTimeRange.MEDIUM)} outlineDotted customClass={classNames('mr-4 h-8 px-4',
                                {
                                    'outline-violet-300': selectedTimeRange === UserTopTimeRange.MEDIUM
                                })} textClass="group-hover:animate-pulse group-focus:animate-pulse text-zinc-700" disabled={selectedTimeRange === UserTopTimeRange.MEDIUM} />
                            <Button text='All Time' onClick={() => handleGetRecommendationsClick(UserTopTimeRange.LONG)} outlineDotted customClass={classNames('mr-4 h-8 px-4',
                                {
                                    'outline-violet-400': selectedTimeRange === UserTopTimeRange.LONG
                                })} textClass="group-hover:animate-pulse group-focus:animate-pulse text-zinc-700" disabled={selectedTimeRange === UserTopTimeRange.LONG} />
                        </div>

                        <div className="relative flex py-5 items-center mb-4">
                            <div className="flex-grow border-t border-zinc-400"></div>
                            <h2 className="mx-4 text-xl text-center font-extrabold leading-none tracking-tight md:text-2xl lg:text-3xl"><span className="underline underline-offset-3 decoration-4 decoration-spotify-green">{(gptRecommendedTracks?.length ?? 0) + (spotifyRecommendedTracks?.length ?? 0)}</span> recommendations for you</h2>
                            <div className="flex-grow border-t border-zinc-400"></div>
                        </div>
                        <div className="sm:flex-row md:flex">
                            <div className="mb-8 md:mr-16">
                                <div className="mb-4 flex justify-center">
                                    <div className="flex items-center justify-center px-2 text-white bg-zinc-800 rounded">
                                        <p className="text-bold text-lg md:text-xl lg:text-2xl">Chat GPT</p>
                                        <img className="w-6 h-6 ml-2 rounded-full" src={ChatGptLogo} alt='chat-gpt-logo' />
                                    </div>
                                </div>
                                {gptRecommendedTracks?.map((track) => <TrackCard key={track.id} track={track} />)}
                            </div>

                            <div>
                                <div className="mb-4 flex justify-center">
                                    <div className="flex items-center justify-center px-4 text-white bg-zinc-800 rounded">
                                        <p className="text-bold text-lg md:text-xl lg:text-2xl">Spotify</p>
                                        <img className="w-6 h-6 ml-2" src={SpotifyLogo} alt='spotify-logo' />
                                    </div>
                                </div>
                                {spotifyRecommendedTracks?.map((track) => <TrackCard key={track.id} track={track} reversed />)}
                            </div>
                        </div>
                    </section> :
                        <section className="flex-row justify-center items-center">
                            <h1 className="mb-2 text-2xl font-extrabold leading-none tracking-tight md:text-3xl lg:text-4xl">Generate <mark className="px-2 text-white bg-spotify-green rounded">recommendations</mark></h1>
                            <p className="mb-6 font-bold text-xs md:text-sm lg:text-base text-center">based on your Spotify usage from the last:</p>
                            <div className="flex justify-center items-center">
                                <Button text='Month' onClick={() => handleGetRecommendationsClick(UserTopTimeRange.SHORT)} outlineDotted customClass="mr-6 h-10" textClass="group-hover:animate-pulse group-focus:animate-pulse text-zinc-700" />
                                <Button text='Year' onClick={() => handleGetRecommendationsClick(UserTopTimeRange.MEDIUM)} outlineDotted customClass="mr-6 h-10" textClass="group-hover:animate-pulse group-focus:animate-pulse text-zinc-700" />
                                <Button text='All Time' onClick={() => handleGetRecommendationsClick(UserTopTimeRange.LONG)} outlineDotted customClass="h-10" textClass="group-hover:animate-pulse group-focus:animate-pulse text-zinc-700" />
                            </div>
                        </section>
            }
        </div>
    )
}

export default Recommendations;