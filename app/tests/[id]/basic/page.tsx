import { getVerb } from "@/lib/data";
import InstantTest from "@/components/InstantTest";


export default async function BasicVerbTestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const verb = getVerb(id);
  return (
    <InstantTest
      verbId={verb.id}
      section="basic"
      title={`${verb.word} 基本動詞テスト`}
      description="動詞単体の使い方を、すぐ英語で出せるか確認します。"
      finishHref={`/verbs/${verb.id}/idioms`}
      finishLabel="熟語へ進む"
    />
  );
}
