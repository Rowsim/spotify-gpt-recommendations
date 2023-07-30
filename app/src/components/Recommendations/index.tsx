import { useContext, useEffect, useState } from "react";
import { getRecommendations, getRecommendationsFromLambda, getUserSpotifyPlaylists } from "../../services/recommendations";
import { Button } from "../Button"
import { Track, UserTopTimeRange } from "../../types/spotify";
import classNames from "classnames";
import TrackCard from "../TrackCard";
import SpotifyLogo from '../../assets/images/spotify.svg'
import ChatGptLogo from '../../assets/images/chatgpt.png'
import { AppContext } from "../../AppContext";

const GET_RECOMMENDATIONS_SERVER_SIDE = true;

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
    }, [setUserPlaylists, userPlaylists])

    const handleGetRecommendationsClick = async (term: UserTopTimeRange) => {
        setIsLoading(true);
        try {
            const { gptRecommendations, spotifyRecommendations } = GET_RECOMMENDATIONS_SERVER_SIDE 
            ? await getRecommendationsFromLambda(term) : await getRecommendations(term);
            setSelectedTimeRange(term);
            setGptRecommendedTracks(gptRecommendations);
            setSpotifyRecommendedTracks(spotifyRecommendations);
        } catch (e) {
            console.error(e);
            setToastWithExpiry({ message: 'Failed to generate suggestions', error: true, ttlMs: 4000 })
        }
        setIsLoading(false);
    }

    return (
        <div className="flex-row justify-center mt-8 md:mt-24 max-h-[100vh] text-zinc-700">
            {
                isLoading ? (
                    <div className="flex items-center">
                        <h1 className="animate-pulse mr-2 text-xl font-extrabold leading-none tracking-tight md:text-2xl lg:text-3xl"><span className="underline underline-offset-3 decoration-4 decoration-spotify-green">Generating</span> suggestions!</h1>
                        <svg className="h-6 w-6 ml-2 fill-spotify-green opacity-70 animate-spin" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 12v-2l-4 3 4 3v-2h2.997A6.006 6.006 0 0 0 16 8h-2a4 4 0 0 1-3.996 4H7zM9 2H6.003A6.006 6.006 0 0 0 0 8h2a4 4 0 0 1 3.996-4H9v2l4-3-4-3v2z" />
                        </svg>
                    </div>
                ) :
                    (gptRecommendedTracks || spotifyRecommendedTracks) ? <section>
                        <div className="flex justify-center items-center mb-4">
                            <Button text='Month'
                                onClick={() => handleGetRecommendationsClick(UserTopTimeRange.SHORT)}
                                outlineDotted
                                customClass={classNames('mr-4 h-8 px-4 hover:outline-violet-500',
                                    {
                                        'outline-violet-300': selectedTimeRange === UserTopTimeRange.SHORT
                                    })}
                                textClass="group-hover:animate-pulse group-focus:animate-pulse text-zinc-700"
                                showRefresh={selectedTimeRange === UserTopTimeRange.SHORT}
                            />
                            <Button text='Year'
                                onClick={() => handleGetRecommendationsClick(UserTopTimeRange.MEDIUM)}
                                outlineDotted
                                customClass={classNames('mr-4 h-8 px-4 hover:outline-violet-500',
                                    {
                                        'outline-violet-300': selectedTimeRange === UserTopTimeRange.MEDIUM
                                    })}
                                textClass="group-hover:animate-pulse group-focus:animate-pulse text-zinc-700"
                                showRefresh={selectedTimeRange === UserTopTimeRange.MEDIUM}
                            />
                            <Button text='All Time' onClick={() => handleGetRecommendationsClick(UserTopTimeRange.LONG)}
                                outlineDotted
                                customClass={classNames('mr-4 h-8 px-4 hover:outline-violet-500',
                                    {
                                        'outline-violet-400': selectedTimeRange === UserTopTimeRange.LONG
                                    })}
                                textClass="group-hover:animate-pulse group-focus:animate-pulse text-zinc-700"
                                showRefresh={selectedTimeRange === UserTopTimeRange.LONG}
                            />
                        </div>

                        <div className="relative flex py-5 items-center mb-4">
                            <div className="flex-grow border-t border-zinc-400"></div>
                            <h2 className="mx-4 text-xl text-center font-extrabold leading-none tracking-tight md:text-2xl lg:text-3xl"><span className="underline underline-offset-3 decoration-4 decoration-spotify-green">{(gptRecommendedTracks?.length ?? 0) + (spotifyRecommendedTracks?.length ?? 0)}</span> recommendations for you</h2>
                            <div className="flex-grow border-t border-zinc-400"></div>
                        </div>

                        <div className="sm:flex-row md:flex px-2 mb-3 w-full justify-around">
                            <div className="hidden md:flex justify-center">
                                <div className="flex items-center justify-center px-2 text-white bg-zinc-800 rounded">
                                    <p className="text-bold text-lg md:text-xl lg:text-2xl">Chat GPT</p>
                                    <img className="w-6 h-6 ml-2 rounded-full" src={ChatGptLogo} alt='chat-gpt-logo' />
                                </div>
                            </div>

                            <div className="hidden md:flex justify-center">
                                <div className="flex items-center justify-center px-4 text-white bg-zinc-800 rounded">
                                    <p className="text-bold text-lg md:text-xl lg:text-2xl">Spotify</p>
                                    <img className="w-6 h-6 ml-2" src={SpotifyLogo} alt='spotify-logo' />
                                </div>
                            </div>
                        </div>

                        <div className="sm:flex-row md:flex overflow-y-auto overflow-x-hidden max-h-[68vh] px-2">
                            <div className="mb-8 md:mr-16">
                                <div className="md:hidden mb-4 flex justify-center">
                                    <div className="flex items-center justify-center px-2 text-white bg-zinc-800 rounded">
                                        <p className="text-bold text-lg md:text-xl lg:text-2xl">Chat GPT</p>
                                        <img className="w-6 h-6 ml-2 rounded-full" src={ChatGptLogo} alt='chat-gpt-logo' />
                                    </div>
                                </div>
                                {gptRecommendedTracks?.map((track, i) => <TrackCard key={`${track.id}-${i}-gpt`} track={track} />)}
                            </div>

                            <div>
                                <div className="md:hidden mb-4 flex justify-center">
                                    <div className="flex items-center justify-center px-4 text-white bg-zinc-800 rounded">
                                        <p className="text-bold text-lg md:text-xl lg:text-2xl">Spotify</p>
                                        <img className="w-6 h-6 ml-2" src={SpotifyLogo} alt='spotify-logo' />
                                    </div>
                                </div>
                                {spotifyRecommendedTracks?.map((track, i) => <TrackCard key={`${track.id}-${i}-spotify`} track={track} reversed />)}
                            </div>
                        </div>
                    </section> :
                        <section className="flex-row justify-center items-center">
                            <h1 className="mb-2 text-2xl font-extrabold leading-none tracking-tight md:text-3xl lg:text-4xl">Generate <mark className="px-2 text-white bg-spotify-green rounded">recommendations</mark></h1>
                            <p className="mb-6 font-bold text-xs md:text-sm lg:text-base text-center">based on your Spotify usage from the last:</p>
                            <div className="flex justify-center items-center">
                                <Button text='Month' onClick={() => handleGetRecommendationsClick(UserTopTimeRange.SHORT)} outlineDotted customClass="mr-6 h-10 hover:outline-violet-500" textClass="group-hover:animate-pulse group-focus:animate-pulse text-zinc-700" />
                                <Button text='Year' onClick={() => handleGetRecommendationsClick(UserTopTimeRange.MEDIUM)} outlineDotted customClass="mr-6 h-10 hover:outline-violet-500" textClass="group-hover:animate-pulse group-focus:animate-pulse text-zinc-700" />
                                <Button text='All Time' onClick={() => handleGetRecommendationsClick(UserTopTimeRange.LONG)} outlineDotted customClass="h-10 hover:outline-violet-500" textClass="group-hover:animate-pulse group-focus:animate-pulse text-zinc-700" />
                            </div>
                        </section>
            }
        </div>
    )
}

export default Recommendations;