import classNames from "classnames";
import { Track } from "../../types/spotify";
import { getArtistNames } from "../../utils/spotify-utils";

interface TrackProps {
    track: Track;
    reversed?: boolean;
}

const TrackCard = ({ track, reversed }: TrackProps) => {

    const { name, duration_ms, album, artists } = track;
    const durationDate = new Date(duration_ms);

    return (
        <div className={
            classNames("flex w-screen md:w-[420px] items-center mb-2 border-b-2 border-violet-200 transition-all duration-300 hover:opacity-60 hover:border-violet-400 cursor-pointer",
                {
                    'md:flex-row-reverse': reversed
                })
        } title={`${name} - ${durationDate.getMinutes()}:${durationDate.getSeconds()}`}>
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
    )
}

export default TrackCard