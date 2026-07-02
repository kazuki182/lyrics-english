import { getVerb } from "@/lib/data";
import InstantTest from "@/components/InstantTest";
import VerbAccessGuard from "@/components/VerbAccessGuard";


export default async function BasicVerbTestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const verb = getVerb(id);
  return (
    <VerbAccessGuard rank={verb.rank} verbWord={verb.word}>
    <InstantTest
      verbId={verb.id}
      section="basic"
      title={`${verb.word} 基本テスト`}
      description="基本を、すぐ英語で出せるか確認します。"
      finishHref={`/verbs/${verb.id}/phrasal`}
      finishLabel="句動詞へ進む"
    />
    </VerbAccessGuard>
  );
}
