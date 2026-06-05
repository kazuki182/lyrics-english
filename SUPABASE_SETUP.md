# Supabase接続手順

## 1. Supabaseプロジェクト作成
Supabaseにログインし、新規プロジェクトを作成します。

## 2. DB作成
SQL Editorを開き、`supabase_schema.sql` の内容を貼り付けて実行します。

## 3. APIキー設定
Project Settings > API から以下をコピーします。

- Project URL
- anon public key

`config.js` に貼り付けます。

## 4. 動作確認
`index.html` を開きます。

ログイン：
- kazuki / 12345
- shun / 12345

Kazuki側で曲を追加し、Shun側で再読み込みまたは別端末で開くと同じ曲が表示されます。
Realtime購読により、曲・単語帳・更新履歴も反映されます。

## 5. iPhone利用
SafariでURLを開き、共有ボタンから「ホーム画面に追加」します。
