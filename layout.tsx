import "@/styles/globals.css";
import Link from "next/link";

export const metadata = {
  title: "My Archive",
  description: "Personal archive for music, books, films."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <div className="container">
          <header className="header">
            <Link href="/" className="brand">My Archive</Link>
            <nav className="nav">
              <Link href="/music">Music</Link>
            </nav>
          </header>
          {children}
          <footer className="footer small">
            로컬 저장(브라우저)로 기록이 저장돼요. 내보내기/가져오기로 백업 가능.
          </footer>
        </div>
      </body>
    </html>
  );
}
