import Link from "next/link";

export default function Nav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-slate-700 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto grid max-w-xl grid-cols-5 text-center text-sm text-slate-200">
        <Link className="py-3" href="/">ホーム</Link>
        <Link className="py-3" href="/verbs">動詞</Link>
        <Link className="py-3" href="/tests">テスト</Link>
        <Link className="py-3" href="/review">復習</Link>
        <Link className="py-3" href="/profile">進捗</Link>
      </div>
    </nav>
  );
}
