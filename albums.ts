import albums from "@/data/albums.json";

export type Track = {
  no: number;
  title: string;
  duration?: string;
  rating?: number;
  notes?: string;
};

export type Album = {
  slug: string;
  title: string;
  artist: string;
  format: "CD" | "LP" | string;
  release_year: number;
  tags: string[];
  rating?: number;
  notes?: string;
  covers: string[];
  tracks: Track[];
};

export function getAlbums(): Album[] {
  return albums as Album[];
}

export function getAlbum(slug: string): Album | undefined {
  return getAlbums().find((a) => a.slug === slug);
}
