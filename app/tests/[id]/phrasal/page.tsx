import { getVerb, verbs } from "@/lib/data";
import InstantTest from "@/components/InstantTest";

export function generateStaticParams() {
  return verbs.map((verb) => ({ id: verb.id }));
}

export default async function PhrasalTestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const verb = getVerb(id);
  return (
    <InstantTest
      verbId={verb.id}
      section="phrasal"
      title={`${verb.word} 句動詞テスト`}
      description="句動詞をまとめて確認します。ゆっくり音声も使えます。"
      finishHref={`/tests/${verb.id}`}
      finishLabel="総合テストへ進む"
    />
  );
}
