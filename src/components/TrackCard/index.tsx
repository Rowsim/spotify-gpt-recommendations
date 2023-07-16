import { Track } from "../../types/spotify";
import { getArtistNames } from "../../utils/spotify-utils";

interface TrackProps {
    track: Track;
}

const TrackCard = ({ track }: TrackProps) => {

    const { name, duration_ms, album, artists } = track;
    const durationDate = new Date(duration_ms);

    return (
        <div className="flex items-center mb-2 border-b-2 border-violet-200 transition-all duration-300 hover:opacity-60 hover:border-violet-400 cursor-pointer" title={`${name} - ${durationDate.getMinutes()}:${durationDate.getSeconds()}`}>
            <img className="h-20 w-20 mr-2" src={album.images[0]?.url} alt={`${album.name}-cover`} />
            <div className="text-xs md:text-sm lg:text-base whitespace-nowrap max-w-xs">
                <p className="text-base md:text-lg lg:text-xl font-bold text-ellipsis overflow-hidden">{name}</p>
                <p className="text-ellipsis overflow-hidden">{album.name}</p>
                <p className="text-ellipsis overflow-hidden">{artists?.length > 1 ? getArtistNames(artists).join(', ') : artists[0].name}</p>
            </div>
        </div>
    )
}

export default TrackCard