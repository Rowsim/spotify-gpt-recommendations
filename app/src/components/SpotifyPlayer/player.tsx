import { useContext, useEffect, useMemo, useRef, useState } from "react"
import { AppContext } from "../../AppContext"
import { pause, play, seek } from "../../services/spotify-player"

export const Player = () => {
    const { spotifyPlayerState } = useContext(AppContext)
    const [durationSeekerValue, setDurationSeekerValue] = useState(0)

    useEffect(() => {
        setDurationSeekerValue(spotifyPlayerState!.position)
        let durationSeekerInterval: string | number | NodeJS.Timeout | undefined;

        if (!spotifyPlayerState?.paused) {
            durationSeekerInterval = setInterval(() => {
                setDurationSeekerValue(prevValue => prevValue + 1000)
            }, 1000)
        } else {
            clearInterval(durationSeekerInterval)
        }

        return () => {
            clearInterval(durationSeekerInterval)
        }
    }, [spotifyPlayerState?.position, spotifyPlayerState?.paused, spotifyPlayerState?.track_window?.current_track?.id])

    const handleSeek = async (event: any) => {
        await seek(event.target.value)
    }

    const handleTogglePlay = async () => {
        if (spotifyPlayerState?.paused) await play()
        else await pause()
    }

    if (!spotifyPlayerState?.track_window?.current_track?.id) return null
    return (
        <div className="absolute left-0 top-4 w-full px-4 md:px-0">
            <div className="w-full flex flex-col justify-center items-center">
                <button className="flex items-center mb-3 group" onClick={handleTogglePlay}>
                    <p className="mr-2 text-base md:text-2xl font-semibold underline underline-offset-3 decoration-2 decoration-spotify-green group-hover:decoration-violet-300 group-active:decoration-violet-400">{spotifyPlayerState?.track_window?.current_track?.name}</p>
                    {spotifyPlayerState?.paused ?
                        <svg version="1.1" className="h-7 w-7 fill-spotify-green group-hover:fill-violet-300 group-active:fill-violet-400 group-focus:fill-violet-400" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                            width="163.861px" height="163.861px" viewBox="0 0 163.861 163.861">
                            <path d="M34.857,3.613C20.084-4.861,8.107,2.081,8.107,19.106v125.637c0,17.042,11.977,23.975,26.75,15.509L144.67,97.275
                                    c14.778-8.477,14.778-22.211,0-30.686L34.857,3.613z"/>
                        </svg>
                        :
                        <svg version="1.1" className="h-7 w-7 fill-spotify-green group-hover:fill-violet-300 group-active:fill-violet-400 group-focus:fill-violet-400 animate-pulse" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                            viewBox="0 0 512 512">
                            <path d="M256,0C114.615,0,0,114.615,0,256s114.615,256,256,256s256-114.615,256-256S397.385,0,256,0z M230.4,358.4
			c0,14.138-11.462,25.6-25.6,25.6h-25.6c-14.138,0-25.6-11.461-25.6-25.6V153.6c0-14.139,11.461-25.6,25.6-25.6h25.6
			c14.138,0,25.6,11.461,25.6,25.6V358.4z M358.4,358.4c0,14.138-11.462,25.6-25.6,25.6h-25.6c-14.138,0-25.6-11.461-25.6-25.6
			V153.6c0-14.139,11.461-25.6,25.6-25.6h25.6c14.138,0,25.6,11.461,25.6,25.6V358.4z"/>
                        </svg>
                    }
                </button>
                <input
                    className={`h-1 w-full md:w-72 bg-gray-300 rounded-lg appearance-none cursor-pointer range-sm accent-spotify-green [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-spotify-green [&::-webkit-slider-thumb]:rounded-sm [&::-webkit-slider-thumb]:h-[10px] [&::-webkit-slider-thumb]:w-[10px] hover:[&::-webkit-slider-thumb]:bg-violet-300 active:[&::-webkit-slider-thumb]:bg-violet-300 disabled:cursor-default`}
                    type="range"
                    min={0}
                    max={spotifyPlayerState?.duration}
                    step={0.001}
                    value={durationSeekerValue}
                    onChange={handleSeek}
                />
            </div>
        </div>
    )
}
