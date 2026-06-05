# Lyrics English Supabase接続版

## ログイン
- ID: kazuki / shun
- PW: 12345

## セットアップ
1. Supabaseで新規プロジェクト作成
2. SQL Editorで `supabase_schema.sql` を実行
3. Project Settings > API から Project URL と anon public key を取得
4. `config.js` に貼り付け
5. `index.html` を開く、またはVercel/Netlify等へ配置

## 実装済み
- Supabaseへ曲データ保存
- Kazuki/Shunで共有ライブラリ閲覧
- 曲追加・編集・削除
- 歌詞全文貼り付け
- AI分析風の自動解説
- アーティストプロフィール
- 単語帳保存
- A4 PDF用表示
- Supabase Realtimeによる更新反映

## 注意
現在のログインは簡易ログインです。
本番運用ではSupabase Authに移行し、RLSポリシーをユーザー単位に強化してください。
