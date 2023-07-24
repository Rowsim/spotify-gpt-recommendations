import { useContext } from "react"
import { AppContext } from "../../AppContext"


export const Player = () => {
    const { spotifyPlayerState } = useContext(AppContext)
    return (
        <div className="absolute right-4 top-2 bg-violet-800 bg-opacity-50">
            <p>track:: {spotifyPlayerState?.track_window.current_track.name}</p>
        </div>
    )
}
