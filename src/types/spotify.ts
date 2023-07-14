export enum UserTopTimeRange {
  SHORT = "short_term",
  MEDIUM = "medium_term",
  LONG = "long_term",
}

export interface Artist {
  id: string;
  uri: string;
  href: string;
  name: string;
  popularity: number;
  followers: followers;
  genres: Array<string>;
  images: Array<Image>;
}

export interface Track {
  id: string;
  uri: string;
  href: string;
  name: string;
  release_date: string;
  explicit: boolean;
  duration_ms: number;
  popularity: number;
  images: Array<Image>;
  artists: Array<Artist>;
  album: Album;
}

export interface Album {
  id: string;
  uri: string;
  href: string;
  name: string;
  release_date: string;
  album_type: string;
  popularity: number;
  genres: Array<string>;
  artists: Array<Artist>;
  images: Array<Image>;
}

export interface UserProfile {
  display_name: string;
  external_urls: { spotify: string };
  followers: { total: number };
  images: Array<Image>;
}

interface Image {
  url: string;
  height: number;
  width: number;
}

interface followers {
  total: number;
}