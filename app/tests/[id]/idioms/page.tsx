import { getVerb, verbs } from "@/lib/data";
import InstantTest from "@/components/InstantTest";

export function generateStaticParams() {
  return verbs.map((verb) => ({ id: verb.id }));
}

export default async function IdiomsTestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const verb = getVerb(id);
  return (
    <InstantTest
      verbId={verb.id}
      section="idioms"
      title={`${verb.word} 熟語テスト`}
      description="熟語をまとめて確認します。間違えた問題は復習に回ります。"
      finishHref={`/verbs/${verb.id}/phrasal`}
      finishLabel="句動詞へ進む"
    />
  );
}
