import classNames from "classnames";
import { Track } from "../../types/spotify";
import { getArtistNames } from "../../utils/spotify-utils";
import { useContext, useMemo, useState } from "react";
import { AppContext } from "../../AppContext";
import { DropdownButton } from "../DropdownButton";
import { addTrackToUserSpotifyPlaylist } from "../../services/recommendations";
import { playTrack } from "../../services/spotify-player";

interface TrackProps {
    track: Track;
    reversed?: boolean;
}

const TrackCard = ({ track, reversed }: TrackProps) => {
    const { id, name, duration_ms, album, artists } = track;
    const durationDate = new Date(duration_ms);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { userPlaylists, setToastWithExpiry, spotifyPlayerState } = useContext(AppContext);

    const isTrackPlaying = useMemo(() => !spotifyPlayerState?.paused && spotifyPlayerState?.track_window.current_track.id === id
        ,[spotifyPlayerState?.paused, spotifyPlayerState?.track_window?.current_track?.id])

    const handleAddToPlaylist = async (playlistId?: string, playlistName?: string) => {
        try {
            await addTrackToUserSpotifyPlaylist(playlistId!, id)
            setToastWithExpiry({
                message: `Added to ${playlistName}`,
                ttlMs: 4000
            })
        } catch {
            setToastWithExpiry({
                message: `Failed to add to playlist`,
                ttlMs: 4000,
                error: true
            })
        }
    }

    const handlePlayTrack = async () => {
        await playTrack([id]).catch(() => {
            setToastWithExpiry({
                message: `Failed to play ${name}`,
                ttlMs: 4000,
                error: true
            })
        });
    }

    return (
        <div className={
            classNames("flex relative justify-between w-screen md:w-[460px] items-center mb-2 border-b-2 border-violet-200 hover:border-violet-300 transition-all duration-300",
                {
                    'md:flex-row-reverse': reversed,
                    'border-violet-400': isTrackPlaying
                })
        }>
            <div onClick={handlePlayTrack} className={classNames('flex hover:opacity-60 cursor-pointer group', {
                'md:flex-row-reverse': reversed,
                'pointer-events-none': isTrackPlaying
            })} title={`${name} - ${durationDate.getMinutes()}:${durationDate.getSeconds()}`}>
                <div className={classNames('h-20 w-20 relative mr-2', {
                    'md:ml-2 md:mr-0': reversed
                })}>
                    <img width={80} height={80} src={album.images[0]?.url} alt={`${album.name}-cover`} />
                    <div className="top-0 left-0 absolute w-full h-full flex items-center justify-center">
                        <svg version="1.1" className={classNames("h-6 w-6 fill-white opacity-50 group-hover:opacity-90 group-active:opacity-90 group-hover:fill-violet-400 group-active:fill-violet-500 group-focus:fill-violet-500", {
                            'fill-violet-400 animate-pulse opacity-80': isTrackPlaying
                        })} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                            width="163.861px" height="163.861px" viewBox="0 0 163.861 163.861">
                            <path d="M34.857,3.613C20.084-4.861,8.107,2.081,8.107,19.106v125.637c0,17.042,11.977,23.975,26.75,15.509L144.67,97.275
                                    c14.778-8.477,14.778-22.211,0-30.686L34.857,3.613z"/>
                        </svg>
                    </div>
                </div>
                <div className={classNames("text-xs md:text-sm lg:text-base whitespace-nowrap md:max-w-[320px]", {
                    'md:text-right': reversed
                })}>
                    <p className={classNames("text-base md:text-lg lg:text-xl font-bold text-ellipsis overflow-hidden", {
                        'text-violet-500': isTrackPlaying
                    })}>{name}</p>
                    <p className="text-ellipsis overflow-hidden">{album.name}</p>
                    <p className="text-ellipsis overflow-hidden">{artists?.length > 1 ? getArtistNames(artists).join(', ') : artists[0].name}</p>
                </div>
            </div>

            <DropdownButton
                dropdownOpen={dropdownOpen}
                setDropdownOpen={setDropdownOpen}
                items={userPlaylists?.map(playlist => ({
                    label: playlist.name,
                    value: playlist.id
                }))}
                dropdownItemsClass={`${reversed ? 'sm:right-0 md:left-0' : 'right-0'}`}
                onItemClick={(playlistId, playlistName) => handleAddToPlaylist(playlistId, playlistName)}
            />
        </div>
    )
}

export default TrackCard