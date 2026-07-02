# QUALITY_AUDIT_CURRENT

## Version
Ver.119 WORK / USE / START 追加版

## 対象動詞
- GET / TAKE / MAKE
- GIVE / HAVE / GO
- COME / PUT / KEEP
- FIND / SEE / LOOK
- WATCH / HEAR / LISTEN
- THINK / KNOW / FEEL
- WORK / USE / START

## 今回の追加
- WORK: 働く・取り組む・機能する・うまくいくを「目的に向かって動く」イメージで整理
- USE: 道具・情報・時間・方法を目的のために活用するイメージで整理
- START: 止まっているものが動き出す・始めるイメージで整理

## 表示カテゴリ
- 基本
- 句動詞

画面上に「熟語」「コロケーション」「文型」「よく使うフレーズ」などの別カテゴリを出さない方針を維持。

## 保存・UI修正の維持
- プロフィール画像の保存・復元対策を維持
- 目標日の保存・復元対策を維持
- 下部バー余白バランス修正を維持

## ビルド確認
- npx tsc --noEmit: Exit code 0
- npm run build: Exit code 0
- Compiled successfully
- Finished TypeScript
- static pages生成完了
- route一覧表示確認

## 旧エラー参照チェック
以下の参照が残っていないことを確認。
- row.collocationsOk
- row.collocationCount
- row.idiomTestTotal
- row.idiomsOk
- row.idiomCount

## ZIP除外確認
- node_modules なし
- .next なし
- tsconfig.tsbuildinfo なし
- patch_*.py / make_*.py / append_*.js なし
- root直下 data.ts / display.ts / paymentConfig.ts なし
- 古い QUALITY_AUDIT_Vxx / VERSION_Vxx / README_Vxx なし
- package-lock.json / .npmrc に内部URLなし
