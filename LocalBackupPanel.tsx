"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LOCAL_KEY_PREFIX } from "@/lib/useAlbumEdits";

type BackupItem = {
  key: string;
  value: unknown;
};

function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function LocalBackupPanel() {
  const [items, setItems] = useState<BackupItem[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const out: BackupItem[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      if (!k.startsWith(LOCAL_KEY_PREFIX)) continue;
      try {
        const raw = localStorage.getItem(k);
        if (!raw) continue;
        out.push({ key: k, value: JSON.parse(raw) });
      } catch {
        // ignore
      }
    }
    out.sort((a, b) => a.key.localeCompare(b.key));
    setItems(out);
  }, []);

  const exportPayload = useMemo(() => {
    const payload: Record<string, unknown> = {};
    for (const it of items) payload[it.key] = it.value;
    return payload;
  }, [items]);

  return (
    <div className="card" style={{ padding: 12 }}>
      <div className="small" style={{ marginBottom: 10 }}>
        지금까지 적은 “앨범/트랙 메모”는 브라우저에 저장됩니다. 아래 버튼으로 백업하세요.
      </div>
      <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
        <button className="btn" onClick={() => downloadJson("my-archive-backup.json", exportPayload)}>
          내보내기(JSON)
        </button>
        <button className="btn" onClick={() => fileRef.current?.click()}>
          가져오기(JSON)
        </button>
        <button
          className="btn"
          onClick={() => {
            if (!confirm("정말로 모든 로컬 기록을 삭제할까요?")) return;
            for (const it of items) localStorage.removeItem(it.key);
            setItems([]);
          }}
        >
          로컬 기록 전체 삭제
        </button>
        <div className="small">저장된 앨범 수: {items.length}</div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="application/json"
        style={{ display: "none" }}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          try {
            const text = await file.text();
            const data = JSON.parse(text) as Record<string, unknown>;
            const keys = Object.keys(data).filter((k) => k.startsWith(LOCAL_KEY_PREFIX));
            for (const k of keys) {
              localStorage.setItem(k, JSON.stringify(data[k]));
            }
            alert("가져오기 완료! 페이지를 새로고침하면 반영됩니다.");
          } catch {
            alert("가져오기에 실패했어요. JSON 파일을 확인해줘.");
          } finally {
            e.target.value = "";
          }
        }}
      />
    </div>
  );
}
