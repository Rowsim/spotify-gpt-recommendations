import classNames from "classnames";
import { Track } from "../../types/spotify";
import { getArtistNames } from "../../utils/spotify-utils";
import { useContext, useState } from "react";
import { AppContext } from "../../AppContext";

interface TrackProps {
    track: Track;
    reversed?: boolean;
}

const TrackCard = ({ track, reversed }: TrackProps) => {
    const { name, duration_ms, album, artists } = track;
    const durationDate = new Date(duration_ms);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { userPlaylists } = useContext(AppContext);

    return (
        <div className={
            classNames("flex relative justify-between w-screen md:w-[420px] items-center mb-2 border-b-2 border-violet-200 transition-all duration-300",
                {
                    'md:flex-row-reverse': reversed
                })
        }>
            <div className={classNames('flex hover:opacity-60 hover:border-violet-400 cursor-pointer', {
                'md:flex-row-reverse': reversed
            })} title={`${name} - ${durationDate.getMinutes()}:${durationDate.getSeconds()}`}>
                <img className={classNames("h-20 w-20 mr-2", {
                    'md:ml-2 md:mr-0': reversed
                })} src={album.images[0]?.url} alt={`${album.name}-cover`} />
                <div className={classNames("text-xs md:text-sm lg:text-base whitespace-nowrap max-w-xs", {
                    'md:text-right': reversed
                })}>
                    <p className="text-base md:text-lg lg:text-xl font-bold text-ellipsis overflow-hidden">{name}</p>
                    <p className="text-ellipsis overflow-hidden">{album.name}</p>
                    <p className="text-ellipsis overflow-hidden">{artists?.length > 1 ? getArtistNames(artists).join(', ') : artists[0].name}</p>
                </div>
            </div>

            {/* TODO
Move dropdown into it's own component
Deal with ... button margin
Make each button option 100% width and deal with hover opacity
*/}
            <button onBlur={() => setDropdownOpen(false)} onClick={() => { setDropdownOpen(!dropdownOpen); console.debug('dropdown click', dropdownOpen) }} className="inline-flex items-center p-2 text-sm font-medium text-center text-zinc-700 bg-none rounded-lg hover:opacity-50 focus:ring-2 focus:outline-none focus:ring-violet-300" type="button">
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15">
                    <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                </svg>
            </button>

            <div
                className={`${dropdownOpen ? `top-full opacity-100 visible` : 'top-[110%] invisible opacity-0'} ${reversed ? 'sm:right-0 md:left-0' : 'right-0'} absolute z-40 w-72 max-h-[460px] scroll overflow-y-auto rounded bg-zinc-700 py-2 transition-all`}>
                {userPlaylists?.map(playlist => (
                    <button
                        key={playlist.id}
                        className="block py-2 px-5 sm:text-sm md:text-base text-white hover:bg-opacity-50 hover:text-spotify-green"
                        onClick={() => console.debug(playlist.id)}
                    >
                        {playlist.name}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default TrackCard