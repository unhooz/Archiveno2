"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Album } from "@/lib/albums";

export const LOCAL_KEY_PREFIX = "my-archive:album:";

type TrackEdit = {
  notes?: string;
  rating?: number;
};

type AlbumEdits = {
  albumNotes?: string;
  tracks?: Record<number, TrackEdit>;
};

function keyFor(slug: string) {
  return `${LOCAL_KEY_PREFIX}${slug}`;
}

export function useAlbumEdits(album: Album) {
  const storageKey = useMemo(() => keyFor(album.slug), [album.slug]);
  const [edits, setEdits] = useState<AlbumEdits>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      setEdits(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, [storageKey]);

  const persist = useCallback((next: AlbumEdits) => {
    setEdits(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, [storageKey]);

  const setAlbumNotes = useCallback((value: string) => {
    persist({ ...edits, albumNotes: value });
  }, [edits, persist]);

  const setTrackNotes = useCallback((trackNo: number, value: string) => {
    const tracks = { ...(edits.tracks ?? {}) };
    tracks[trackNo] = { ...(tracks[trackNo] ?? {}), notes: value };
    persist({ ...edits, tracks });
  }, [edits, persist]);

  const setTrackRating = useCallback((trackNo: number, rating: number) => {
    const tracks = { ...(edits.tracks ?? {}) };
    const nextRating = rating === 0 ? undefined : rating;
    tracks[trackNo] = { ...(tracks[trackNo] ?? {}), rating: nextRating };
    persist({ ...edits, tracks });
  }, [edits, persist]);

  const resetEdits = useCallback(() => {
    persist({});
  }, [persist]);

  return { edits, setAlbumNotes, setTrackNotes, setTrackRating, resetEdits };
}
