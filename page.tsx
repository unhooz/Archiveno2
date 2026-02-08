import Link from "next/link";
import Image from "next/image";
import AlbumCarousel from "@/components/AlbumCarousel";
import { getAlbums } from "@/lib/albums";
import LocalBackupPanel from "@/components/LocalBackupPanel";

export default function MusicPage() {
  const albums = getAlbums();
  const featured = [...albums].sort((a, b) => b.release_year - a.release_year).slice(0, 10);

  return (
    <main>
      <div className="toprow">
        <div>
          <h1 className="h1">Music</h1>
          <p className="small">앨범 단위 기록 → 앨범 클릭 시 트랙 단위 기록 가능</p>
        </div>
        <Link className="pill" href="/">Home</Link>
      </div>

      <AlbumCarousel albums={featured} />

      <div className="sectionTitle">Backup</div>
      <LocalBackupPanel />

      <div className="sectionTitle">All Albums</div>
      <div className="grid">
        {albums.map((a) => (
          <Link key={a.slug} href={`/music/${a.slug}`} className="card">
            <Image
              src={a.covers?.[0] ?? "/covers/placeholder.png"}
              alt={`${a.title} cover`}
              width={500}
              height={500}
              style={{ width: "100%", height: 170, objectFit: "cover" }}
            />
            <div className="meta">
              <div className="title">{a.title}</div>
              <div className="small">{a.artist}</div>
              <div className="metaRow">
                <span className="badge">{a.format}</span>
                <span className="badge">{a.release_year}</span>
                {typeof a.rating === "number" && <span className="badge">★ {a.rating}</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
