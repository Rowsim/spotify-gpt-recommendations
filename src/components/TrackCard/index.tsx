import classNames from "classnames";
import { Track } from "../../types/spotify";
import { getArtistNames } from "../../utils/spotify-utils";
import { useContext, useState } from "react";
import { AppContext } from "../../AppContext";
import { DropdownButton } from "../DropdownButton";
import { addTrackToUserSpotifyPlaylist } from "../../services/recommendations";

interface TrackProps {
    track: Track;
    reversed?: boolean;
}

const TrackCard = ({ track, reversed }: TrackProps) => {
    const { id, name, duration_ms, album, artists } = track;
    const durationDate = new Date(duration_ms);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { userPlaylists, setToastWithExpiry } = useContext(AppContext);

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

    return (
        <div className={
            classNames("flex relative justify-between w-screen md:w-[460px] items-center mb-2 border-b-2 border-violet-200 hover:border-violet-300 transition-all duration-300",
                {
                    'md:flex-row-reverse': reversed
                })
        }>
            <div className={classNames('flex hover:opacity-60 cursor-pointer', {
                'md:flex-row-reverse': reversed
            })} title={`${name} - ${durationDate.getMinutes()}:${durationDate.getSeconds()}`}>
                <img className={classNames("h-20 w-20 mr-2", {
                    'md:ml-2 md:mr-0': reversed
                })} src={album.images[0]?.url} alt={`${album.name}-cover`} />
                <div className={classNames("text-xs md:text-sm lg:text-base whitespace-nowrap md:max-w-[320px]", {
                    'md:text-right': reversed
                })}>
                    <p className="text-base md:text-lg lg:text-xl font-bold text-ellipsis overflow-hidden">{name}</p>
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