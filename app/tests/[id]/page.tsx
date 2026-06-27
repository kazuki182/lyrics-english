import { getVerb } from "@/lib/data";
import InstantTest from "@/components/InstantTest";


export default async function VerbTestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const verb = getVerb(id);
  return (
    <InstantTest
      verbId={verb.id}
      section="all"
      title={`${verb.word} 総合テスト`}
      description="基本動詞・熟語・句動詞をまとめて確認します。満点でMASTER扱いになります。"
      finishHref="/verbs"
      finishLabel="動詞一覧へ戻る"
    />
  );
}
