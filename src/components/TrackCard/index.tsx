import { Artist, Track } from "../../types/spotify";

interface TrackProps {
    track: Track;
}

const TrackCard = ({ track }: TrackProps) => {

    const { name, duration_ms, images, album, artists } = track;
    const durationDate = new Date(duration_ms);

    return (
        <div className="flex items-center mb-2 border-b-2 border-violet-200 transition-all duration-300 hover:opacity-60 hover:border-violet-400 cursor-pointer" title={`${name} - ${durationDate.getMinutes()}:${durationDate.getSeconds()}`}>
            <img className="h-24 w-24 mr-2" src={images[0]?.url} alt={`${album.name}-cover`} />
            <div className="text-sm md:text-base lg:text-lg">
                <p className="text-base md:text-lg lg:text-xl font-bold">{name}</p>
                <p>{album.name}</p>
                <p className="text-xs md:text-sm lg:text-base">{artists?.length > 1 ? getTrackArtistNames(artists).join(', ') : artists[0].name}</p>
            </div>
        </div>
    )
}

const getTrackArtistNames = (artists: Artist[], limit = 3) => {
    if (!artists) return [];

    const names: string[] = [];
    artists.forEach((artist, i) => {
        if (i <= limit) names.push(artist.name);
    });

    return names;
};

export default TrackCard