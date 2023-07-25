import { useContext } from "react"
import { AppContext } from "../../AppContext"
import { pause, play } from "../../services/spotify-player"

export const Player = () => {
    const { spotifyPlayerState } = useContext(AppContext)
    return (
        <div className="absolute right-4 top-2">
            <div className="flex items-center group">
                <p className="mr-2 text-base md:text-lg font-semibold underline underline-offset-3 decoration-2 decoration-spotify-green group-hover:decoration-violet-300 group-active:decoration-violet-400">{spotifyPlayerState?.track_window.current_track.name}</p>
                {spotifyPlayerState?.paused ?
                    <button onClick={() => play()}>
                        <svg version="1.1" className="h-6 w-6 fill-spotify-green hover:opacity-60 hover:fill-violet-300 active:fill-violet-400 focus:fill-violet-400" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                            width="163.861px" height="163.861px" viewBox="0 0 163.861 163.861">
                            <path d="M34.857,3.613C20.084-4.861,8.107,2.081,8.107,19.106v125.637c0,17.042,11.977,23.975,26.75,15.509L144.67,97.275
                                    c14.778-8.477,14.778-22.211,0-30.686L34.857,3.613z"/>
                        </svg>
                    </button>
                    :
                    <button onClick={() => pause()}>
                        <svg version="1.1" className="h-6 w-6 fill-spotify-green hover:fill-violet-300 active:fill-violet-400 focus:fill-violet-400 animate-pulse" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                            viewBox="0 0 512 512">
                            <path d="M256,0C114.615,0,0,114.615,0,256s114.615,256,256,256s256-114.615,256-256S397.385,0,256,0z M230.4,358.4
			c0,14.138-11.462,25.6-25.6,25.6h-25.6c-14.138,0-25.6-11.461-25.6-25.6V153.6c0-14.139,11.461-25.6,25.6-25.6h25.6
			c14.138,0,25.6,11.461,25.6,25.6V358.4z M358.4,358.4c0,14.138-11.462,25.6-25.6,25.6h-25.6c-14.138,0-25.6-11.461-25.6-25.6
			V153.6c0-14.139,11.461-25.6,25.6-25.6h25.6c14.138,0,25.6,11.461,25.6,25.6V358.4z"/>
                        </svg>
                    </button>
                }
            </div>
        </div>
    )
}
