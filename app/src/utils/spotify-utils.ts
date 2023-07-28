import { Artist } from "../types/spotify";

export const getArtistNames = (artists: Artist[], limit = 3) => {
    if (!artists) return [];

    const names: string[] = [];
    artists.forEach((artist, i) => {
        if (i <= limit) names.push(artist.name);
    });

    return names;
};
