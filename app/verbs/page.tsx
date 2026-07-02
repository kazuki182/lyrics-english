import { verbs } from "@/lib/data";
import VerbSearchList from "@/components/VerbSearchList";

export default function VerbsPage() {
  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-3xl font-bold">動詞一覧</h1>
        <p className="mt-2 text-muted">番号・検索・進捗を確認しながら、基本動詞を学習できます。</p>
      </header>
      <VerbSearchList verbs={verbs} />
    </div>
  );
}
