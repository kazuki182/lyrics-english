# Lyrics English

洋楽の歌詞から英語を学ぶ、kazuki / shun 共有用Webアプリです。

## ログイン

- kazuki / 12345
- shun / 12345

## 今回の変更

- 曲詳細にアーティスト情報セクションを追加しました。
- Wikimedia REST APIを使い、英語版Wikipedia、取得できない場合は日本語版Wikipediaから概要、画像、ページURLを取得します。
- MusicBrainz APIとCover Art ArchiveからCDジャケット画像を取得します。
- ジャケットが見つからない場合はYouTubeサムネイル、さらに見つからない場合はプレースホルダー画像を表示します。
- 歌詞中の英単語をタップできるようにし、タップした単語だけを単語帳に保存します。
- 簡易英和辞書を `app.js` に追加し、意味・品詞・使われ方を自動入力します。
- 辞書にない単語は「意味を確認してください」と表示します。
- 単語モーダルと単語帳にWeblio確認リンクを表示します。
- HTMLの `onclick` 依存をやめ、JavaScriptの `addEventListener` とイベント委譲で操作を登録しています。
- iPhone幅でボタン、歌詞カード、下部シート、下部メニューが使いやすいように調整しました。

## 外部API

### YouTube Data API

`config.js` の `window.YOUTUBE_API_KEY` にAPIキーを設定すると、YouTube動画タイトルとチャンネル名から曲名・アーティスト名を推定します。

APIキーが空の場合は、まずYouTube oEmbedでタイトルとチャンネル名の取得を試します。取得できない場合でも、以下の主要曲は手動マッピングで動作します。

- `https://www.youtube.com/watch?v=JGwWNGJdvx8`
  - Shape of You
  - Ed Sheeran
- `https://youtu.be/kXYiU_JCYtU`
  - Numb
  - Linkin Park

### Wikimedia REST API

Wikipediaをスクレイピングせず、以下のREST APIを使います。

- `https://en.wikipedia.org/api/rest_v1/page/summary/{artistName}`
- `https://ja.wikipedia.org/api/rest_v1/page/summary/{artistName}`

取得できない場合もアプリは落ちず、「アーティスト情報を取得できませんでした」と表示します。

### MusicBrainz / Cover Art Archive

曲名 + アーティスト名でMusicBrainzを検索し、最初の候補のリリースIDからCover Art Archiveの画像URLを表示します。

ブラウザから直接取得するため、環境によってCORS、API制限、画像なしリリースの影響を受けることがあります。その場合はYouTubeサムネイルにフォールバックします。安定運用する場合は、Vercel Functionsなどでサーバー側プロキシを用意し、MusicBrainzへのリクエストに適切なUser-Agentを付ける構成がおすすめです。

## Supabase

既存の `songs` / `vocabulary` / `activity_logs` テーブルを使います。

今回の実装では、既存データを壊さないため、アーティスト画像URLやジャケットURLは保存必須にしていません。曲詳細表示時に外部APIから取得して表示します。

`vocabulary` には以下を保存します。

- user_id
- song_id
- word
- meaning
- part_of_speech
- example
- memo
- song_title
- artist_name
- status
- created_at
- updated_at

## 任意の追加SQL

外部APIで取得した情報も `songs` に保存したい場合は、以下のカラム追加を検討してください。

```sql
alter table public.songs
add column if not exists artist_wikipedia_url text,
add column if not exists artist_image_url text,
add column if not exists cover_art_url text,
add column if not exists youtube_thumbnail_url text;
```

`vocabulary` に `example` や `updated_at` がない場合は追加してください。

```sql
alter table public.vocabulary
add column if not exists example text,
add column if not exists updated_at timestamptz default now();
```

## 更新方法

ZIPを解凍し、GitHubの `lyrics-english` リポジトリに中身を上書きアップロードしてください。Vercel連携済みの場合は、GitHubへ反映すると自動デプロイされます。
