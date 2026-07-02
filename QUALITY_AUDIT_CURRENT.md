# QUALITY_AUDIT_CURRENT

## Version
Ver.118 THINK / KNOW / FEEL 追加版

## 対象動詞
今回追加対象は THINK / KNOW / FEEL の3語。途中変更なし。

## 維持した修正
- 画像保存・復元対策を維持
- 目標日保存・復元対策を維持
- 下部バー余白修正を維持
- カテゴリUIは「基本」「句動詞」の2系統を維持
- 旧保存データ互換用の idioms は基本へ読み替え

## 動詞品質
- THINK: 意見、検討、思いつく、必要性判断、考え抜く、先を考える用途を整理
- KNOW: 事実、情報、人物、やり方、未確定情報、let me know を整理
- FEEL: 気持ち・印象、feel that / feel about / feel like / feel free to を整理

## 確認
- npx tsc --noEmit: Exit code 0
- npm run build: Exit code 0 / Compiled successfully / Finished TypeScript / static pages生成 / route一覧表示まで確認
- row.collocationsOk / row.collocationCount / row.idiomTestTotal / row.idiomsOk / row.idiomCount の参照なし
- package-lock.json / .npmrc に内部OpenAI/caas URLなし
- ZIP除外: node_modules, .next, tsconfig.tsbuildinfo, patch_*.py, make_*.py, append_*.js
