"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import { Album } from "@/lib/albums";
import { useCallback, useEffect, useState } from "react";

export default function AlbumCarousel({ albums }: { albums: Album[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section>
      <div className="sectionTitle">Cover Slide</div>
      <div className="carouselFrame">
        <div ref={emblaRef} className="embla">
          <div className="emblaContainer">
            {albums.map((a) => (
              <div className="emblaSlide" key={a.slug}>
                <Link className="card" href={`/music/${a.slug}`}>
                  <div className="coverBox">
                    <Image
                      src={a.covers?.[0] ?? "/covers/placeholder.png"}
                      alt={`${a.title} cover`}
                      fill
                      sizes="(max-width: 768px) 85vw, 720px"
                      style={{ objectFit: "cover" }}
                      priority={false}
                    />
                  </div>
                  <div className="meta">
                    <div className="title">{a.title}</div>
                    <div className="small">{a.artist} · {a.format} · {a.release_year}</div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="carouselControls">
          <button className="btn" onClick={() => emblaApi?.scrollPrev()}>←</button>
          <div className="small">{selected + 1} / {albums.length}</div>
          <button className="btn" onClick={() => emblaApi?.scrollNext()}>→</button>
        </div>
      </div>
    </section>
  );
}
