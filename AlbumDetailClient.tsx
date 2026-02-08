"use client";

import Image from "next/image";
import { Album, Track } from "@/lib/albums";
import { useMemo } from "react";
import { useAlbumEdits } from "@/lib/useAlbumEdits";

function trackKey(no: number) {
  return String(no).padStart(2, "0");
}

export default function AlbumDetailClient({ album }: { album: Album }) {
  const { edits, setAlbumNotes, setTrackNotes, setTrackRating, resetEdits } = useAlbumEdits(album);

  const merged = useMemo(() => {
    const albumNotes = edits.albumNotes ?? album.notes ?? "";
    const tracks = album.tracks.map((t) => {
      const e = edits.tracks?.[t.no] ?? {};
      return {
        ...t,
        notes: (typeof e.notes === "string") ? e.notes : (t.notes ?? ""),
        rating: (typeof e.rating === "number") ? e.rating : t.rating
      } as Track;
    });
    return { albumNotes, tracks };
  }, [album, edits]);

  return (
    <>
      <div className="sectionTitle">Covers</div>
      <div className="coversRow">
        {(album.covers?.length ? album.covers : ["/covers/placeholder.png"]).map((src, idx) => (
          <div key={idx} className="card coverCard">
            <Image
              src={src}
              alt={`${album.title} cover ${idx + 1}`}
              width={900}
              height={900}
              style={{ width: "100%", height: 320, objectFit: "cover" }}
            />
          </div>
        ))}
      </div>

      <div className="sectionTitle">Album Note (빠른 기록)</div>
      <textarea
        className="textarea"
        placeholder="앨범 전체 감상/구매처/컨디션/메모…"
        value={merged.albumNotes}
        onChange={(e) => setAlbumNotes(e.target.value)}
      />
      <div className="row">
        <button className="btn" onClick={resetEdits}>이 앨범 기록 초기화</button>
        <div className="small">저장은 자동(브라우저 로컬 저장)입니다.</div>
      </div>

      <div className="sectionTitle">Tracks</div>
      <div className="small" style={{ marginBottom: 8 }}>
        트랙별로 별점/메모를 바로 적어두세요. (자동 저장)
      </div>

      <div className="tracks">
        {merged.tracks.map((t) => (
          <div key={t.no} className="trackRow" id={`track-${trackKey(t.no)}`}>
            <div className="trackHeader">
              <div className="trackTitle">
                <span className="badge">#{t.no}</span>
                <strong>{t.title}</strong>
                <span className="small" style={{ marginLeft: 8 }}>{t.duration ?? ""}</span>
              </div>

              <div className="ratingBox" aria-label="rating">
                {[1,2,3,4,5].map((r) => (
                  <button
                    key={r}
                    className={"starBtn " + ((t.rating ?? 0) >= r ? "on" : "")}
                    onClick={() => setTrackRating(t.no, r)}
                    title={`${r}점`}
                    type="button"
                  >
                    ★
                  </button>
                ))}
                <button className="btn tiny" onClick={() => setTrackRating(t.no, 0)} type="button">지우기</button>
              </div>
            </div>

            <textarea
              className="textarea trackTextarea"
              placeholder="이 트랙에서 기억할 포인트(사운드/가사/느낌/장면)…"
              value={t.notes ?? ""}
              onChange={(e) => setTrackNotes(t.no, e.target.value)}
            />
          </div>
        ))}
      </div>
    </>
  );
}
