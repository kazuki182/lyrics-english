let supabaseClient;
let currentUser = null;
let songs = [];
let vocab = [];
let logs = [];
let currentAnalysis = [];
let selectedWordContext = null;
let realtimeStarted = false;

const ALLOWED_USERS = ["kazuki", "shun", "izumihara", "yoshino", "odaka"];
const COMMON_PASSWORD = "12345";
const STOP_WORDS = new Set(["the", "a", "an", "is", "are", "am", "was", "were", "be", "been", "being", "to", "of", "in", "on", "at", "for", "and", "but", "or", "i", "you", "he", "she", "it", "we", "they", "me", "my", "your", "his", "her", "our", "their", "this", "that", "these", "those", "with", "from", "by", "as", "do", "does", "did", "not", "no", "so", "if", "then", "than", "too", "very", "just", "can", "could", "will", "would", "should", "must", "may", "might", "isnt", "dont", "cant", "wont"]);

const WORD_DICTIONARY = {
  lover: ["恋人", "名詞", "love から派生した単語。歌詞では恋愛相手を表します。"],
  tired: ["疲れた・うんざりした", "形容詞", "be tired of -ing で「〜することに疲れている」。"],
  want: ["望む・してほしい", "動詞", "want + 人 + to do で「人に〜してほしい」。"],
  being: ["〜でいること", "動名詞", "be の ing 形。状態が続くことを表します。"],
  club: ["クラブ・ナイトクラブ", "名詞", "人が集まる場所。歌詞では出会いの場として使われています。"],
  place: ["場所", "名詞", "to find a lover が後ろから place を説明しています。"],
  find: ["見つける", "動詞", "探していたものや人を見つける一般動詞です。"],
  best: ["最も良い", "形容詞", "good の最上級。the best place で「一番良い場所」。"],
  the: ["その・例の", "冠詞", "名詞の前に置き、聞き手にも分かるものとして示します。"],
  bar: ["バー", "名詞", "お酒を飲む場所。where I go とつながり、行き先を表します。"],
  where: ["どこ・場所", "関係副詞", "場所を説明する時に使います。"],
  love: ["愛・愛する", "名詞 / 動詞", "名詞なら感情、動詞なら「愛する」。文脈で判断します。"],
  dancing: ["踊っている・踊ること", "現在分詞 / 動名詞", "dance の ing 形。進行中の動きや行為を表します。"],
  dark: ["暗闇・暗い", "名詞 / 形容詞", "in the dark で「暗闇の中で」。"],
  go: ["行く", "動詞", "移動先へ向かう基本動詞です。"],
  with: ["一緒に・伴って", "前置詞", "誰かや何かと一緒であることを表します。"],
  for: ["のために・に向けて", "前置詞", "目的や対象を表します。"],
  to: ["へ・するために", "前置詞 / 不定詞", "方向、または to + 動詞で目的や説明を表します。"],
  in: ["中で・中に", "前置詞", "空間や状態の内側にいるイメージです。"],
  is: ["である・いる", "be動詞", "主語の状態や説明をつなぎます。"],
  isnt: ["ではない", "be動詞 + not", "is not の短縮形 isn't。否定文を作ります。"],
  not: ["ではない", "副詞", "動詞や文全体を否定します。"]
};

const WORD_USAGE = {
  tired: { usage: "be tired of + 名詞 / 動名詞", meaning: "〜に疲れている、〜にうんざりしている", example: "I'm tired of waiting.", ja: "待つことに疲れた。" },
  want: { usage: "want + 人 + to do", example: "I want you to stay.", ja: "あなたに残ってほしい。" },
  being: { usage: "be の -ing形。状態を名詞のように使う", example: "Being honest is important.", ja: "正直でいることは大切です。" },
  lover: { usage: "a lover / my lover の形で使う", example: "She is waiting for her lover.", ja: "彼女は恋人を待っている。" },
  club: { usage: "go to the club / at the club", example: "We met at the club.", ja: "私たちはクラブで出会った。" },
  place: { usage: "a place to + 動詞", example: "I need a place to study.", ja: "勉強する場所が必要です。" },
  find: { usage: "find + 名詞", example: "I found my keys.", ja: "鍵を見つけた。" },
  best: { usage: "the best + 名詞", example: "This is the best way.", ja: "これが一番良い方法です。" },
  love: { usage: "love + 人 / 物、または名詞で「愛」", example: "I love this song.", ja: "この曲が大好きです。" },
  dancing: { usage: "be dancing / enjoy dancing", example: "They are dancing together.", ja: "彼らは一緒に踊っています。" },
  dark: { usage: "in the dark", example: "We walked in the dark.", ja: "私たちは暗闇の中を歩いた。" },
  go: { usage: "go to + 場所", example: "I go to school.", ja: "私は学校へ行きます。" }
};

const KNOWN_YOUTUBE = {
  JGwWNGJdvx8: {
    title: "Shape of You",
    artist: "Ed Sheeran",
    genre: "Pop",
    profile: "Ed Sheeranはイギリス出身のシンガーソングライター。アコースティックなサウンドとポップなメロディ、恋愛や日常をテーマにした分かりやすい歌詞が特徴。英語学習では、自然な会話表現や前置詞の使い方を学びやすいアーティストです。"
  },
  kXYiU_JCYtU: {
    title: "Numb",
    artist: "Linkin Park",
    genre: "Rock",
    profile: "Linkin Parkはアメリカ出身のロックバンド。ロック、ヒップホップ、エレクトロニック要素を組み合わせたサウンドと、孤独、不安、葛藤を率直に表す歌詞が特徴です。英語学習では、感情表現、比喩、短く強いフレーズの使い方を学びやすいアーティストです。"
  }
};

document.addEventListener("DOMContentLoaded", () => {
  bindStaticEvents();
  const savedUser = localStorage.getItem("currentUser");
  if (savedUser) enterApp(savedUser);
});

function bindStaticEvents() {
  qs("#loginBtn").addEventListener("click", login);
  qs("#loginPw").addEventListener("keydown", e => { if (e.key === "Enter") login(); });
  qs("#logoutBtn").addEventListener("click", logout);
  qs("#youtubeBtn").addEventListener("click", autoFillFromYoutube);
  qs("#musicLinksBtn").addEventListener("click", autoFillMusicLinks);
  qs("#lyricsLinksBtn").addEventListener("click", createLyricsLinksFromForm);
  qs("#analyzeBtn").addEventListener("click", analyzeLyrics);
  qs("#saveBtn").addEventListener("click", saveSong);
  qs("#clearBtn").addEventListener("click", clearForm);
  qs("#search").addEventListener("input", renderSongs);
  qs("#printViewBtn").addEventListener("click", showPrintVocab);
  qs("#printBtn").addEventListener("click", () => window.print());
  qs("#modalCloseBtn").addEventListener("click", closeWordModal);
  qs("#modalAddBtn").addEventListener("click", addSelectedWordToVocab);
  qs("#wordModal").addEventListener("click", e => { if (e.target.id === "wordModal") closeWordModal(); });
  document.addEventListener("click", handleDelegatedClick);
  document.addEventListener("mouseover", handleWordHover);
  document.addEventListener("focusin", handleWordHover);
  document.addEventListener("mouseout", handleWordHoverEnd);
  document.addEventListener("focusout", handleWordHoverEnd);
}

function handleDelegatedClick(e) {
  const screenButton = e.target.closest("[data-screen]");
  if (screenButton) {
    showScreen(screenButton.dataset.screen);
    return;
  }
  const action = e.target.closest("[data-action]");
  if (action) {
    const { action: name, id } = action.dataset;
    if (name === "open-song") openSong(id);
    if (name === "edit-song") editSong(id);
    if (name === "delete-song") deleteSong(id);
    if (name === "speak") speakText(action.dataset.text || "");
    if (name === "delete-vocab") deleteVocab(id);
    return;
  }
  const word = e.target.closest("[data-word]");
  if (word) {
    openWordModal(word.dataset.word, word.dataset.songId, Number(word.dataset.lineNo), word.dataset.songTitle, word.dataset.artistName);
  }
}

function qs(selector) { return document.querySelector(selector); }
function toast(message) {
  const t = qs("#toast");
  t.textContent = message;
  t.style.display = "block";
  setTimeout(() => { t.style.display = "none"; }, 2600);
}
function setStatus(message) { const el = qs("#connectionStatus"); if (el) el.textContent = message; }

function login() {
  const id = qs("#loginId").value.trim().toLowerCase();
  const pw = qs("#loginPw").value.trim();
  if (ALLOWED_USERS.includes(id) && pw === COMMON_PASSWORD) {
    localStorage.setItem("currentUser", id);
    enterApp(id);
    return;
  }
  toast("ユーザーIDまたはパスワードが違います");
}

function enterApp(id) {
  currentUser = id;
  qs("#login").classList.add("hidden");
  qs("#main").classList.remove("hidden");
  qs("#userLabel").textContent = userDisplayName(id) + " / 共有ユーザー";
  startApp();
}


function userDisplayName(id) {
  const names = { kazuki: "Kazuki", shun: "Shun", izumihara: "Izumihara", yoshino: "Yoshino", odaka: "Odaka" };
  return names[String(id || "").toLowerCase()] || id || "User";
}

function logout() {
  localStorage.removeItem("currentUser");
  location.reload();
}

function initSupabase() {
  if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY || window.SUPABASE_URL.includes("YOUR_PROJECT")) {
    setStatus("Supabase未設定: config.jsを確認してください");
    return false;
  }
  supabaseClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
  setStatus("Supabase接続設定OK");
  return true;
}

async function startApp() {
  if (!initSupabase()) return;
  await Promise.all([fetchSongs(), fetchVocab(), fetchLogs()]);
  subscribeRealtime();
  renderSongs();
  renderVocab();
  renderLog();
}

async function fetchSongs() {
  const { data, error } = await supabaseClient.from("songs").select("*").order("updated_at", { ascending: false });
  if (error) { toast("曲の取得に失敗: " + error.message); return; }
  songs = data || [];
}

async function fetchVocab() {
  const { data, error } = await supabaseClient.from("vocabulary").select("*").order("created_at", { ascending: false });
  if (error) { toast("単語帳の取得に失敗: " + error.message); return; }
  vocab = data || [];
}

async function fetchLogs() {
  const { data, error } = await supabaseClient.from("activity_logs").select("*").order("created_at", { ascending: false }).limit(10);
  if (!error) logs = data || [];
}

function subscribeRealtime() {
  if (realtimeStarted) return;
  realtimeStarted = true;
  supabaseClient.channel("lyrics-english-realtime")
    .on("postgres_changes", { event: "*", schema: "public", table: "songs" }, async () => {
      await fetchSongs(); renderSongs(); setStatus("曲データが更新されました / " + new Date().toLocaleTimeString());
    })
    .on("postgres_changes", { event: "*", schema: "public", table: "vocabulary" }, async () => {
      await fetchVocab(); renderVocab(); setStatus("単語帳が更新されました / " + new Date().toLocaleTimeString());
    })
    .on("postgres_changes", { event: "*", schema: "public", table: "activity_logs" }, async () => {
      await fetchLogs(); renderLog();
    })
    .subscribe();
}

async function addLog(message) {
  if (!supabaseClient) return;
  await supabaseClient.from("activity_logs").insert({ user_id: currentUser, message });
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  qs("#" + id).classList.add("active");
  document.querySelectorAll(".tabbar button").forEach(b => b.classList.toggle("active", b.dataset.screen === id));
  if (id === "songs") renderSongs();
  if (id === "vocab") renderVocab();
}

function renderSongs() {
  const q = (qs("#search")?.value || "").toLowerCase();
  const filtered = songs.filter(s => `${s.title || ""} ${s.artist_name || ""} ${s.genre || ""}`.toLowerCase().includes(q));
  const stats = qs("#libraryStats");
  if (stats) stats.textContent = `登録曲: ${songs.length}曲 / 参加ユーザー: ${ALLOWED_USERS.map(userDisplayName).join("・")}`;
  const html = filtered.length ? filtered.map(songListItem).join("") : `<p class="mini">曲がありません。</p>`;
  qs("#songList").innerHTML = html;
  qs("#songList2").innerHTML = html;
}

function songListItem(s) {
  return `
    <div class="song-item">
      <button class="song-main" data-action="open-song" data-id="${escAttr(s.id)}">
        <h4>${esc(s.title)}</h4>
        <div class="muted">${esc(s.artist_name || "")}</div>
        <span class="tag">${esc(s.genre || "Pop")}</span><span class="tag">${esc(s.difficulty || "初級")}</span><span class="tag">追加: ${esc(s.created_by || "")}</span>
        <div class="mini">最終更新: ${fmt(s.updated_at)} / ${esc(s.updated_by || "")}</div>
      </button>
      <div class="actions">
        <button class="btn secondary" data-action="edit-song" data-id="${escAttr(s.id)}">編集</button>
        <button class="btn red" data-action="delete-song" data-id="${escAttr(s.id)}">削除</button>
      </div>
    </div>`;
}

function openSong(id) {
  const s = songs.find(x => x.id === id);
  if (!s) return;
  const lines = Array.isArray(s.lyric_lines) ? s.lyric_lines : [];
  const youtubeThumb = getYoutubeThumbnail(s.youtube_url);
  const spotifyUrl = s.spotify_url || makeSpotifySearchUrl(s.title, s.artist_name);
  const lyricLinks = normalizeLyricsLinks(s.lyrics_links || makeLyricsSearchLinks(s.title, s.artist_name));
  const savedCover = s.cover_art_url || "";
  qs("#songDetail").innerHTML = `
    <div class="card">
      <div class="media-grid">
        <div>
          <img class="cover" id="coverImage" alt="ジャケット画像" src="${placeholderImage()}" />
          ${youtubeThumb ? `<img class="youtube-thumb" src="${escAttr(youtubeThumb)}" alt="YouTubeサムネイル">` : ""}
        </div>
        <div>
          <h3 class="section-title">${esc(s.title)}</h3>
          <p class="muted">${esc(s.artist_name || "")} / 追加: ${esc(s.created_by || "")} / 更新: ${esc(s.updated_by || "")}</p>
          <p>${esc(getDisplayArtistProfile(s))}</p>
          <div class="actions">
            ${s.youtube_url ? `<a class="btn" href="${escAttr(s.youtube_url)}" target="_blank" rel="noopener">YouTube</a>` : `<button class="btn secondary" disabled>YouTube未登録</button>`}
            ${s.apple_music_url ? `<a class="btn secondary" href="${escAttr(s.apple_music_url)}" target="_blank" rel="noopener">Apple Music</a>` : `<button class="btn secondary" disabled>Apple Music未登録</button>`}
            ${spotifyUrl ? `<a class="btn secondary" href="${escAttr(spotifyUrl)}" target="_blank" rel="noopener">Spotify</a>` : `<button class="btn secondary" disabled>Spotify未登録</button>`}
            <button class="btn blue" data-action="speak" data-text="${escAttr(lines.map(l => l.lyric).join(". "))}">読み上げ</button>
          </div>
        </div>
      </div>
    </div>
    <div class="card">
      <h3 class="section-title">歌詞を探す</h3>
      <div class="actions">
        <a class="btn secondary" href="${escAttr(lyricLinks.google)}" target="_blank" rel="noopener">Googleで歌詞を探す</a>
        <a class="btn secondary" href="${escAttr(lyricLinks.genius)}" target="_blank" rel="noopener">Geniusで探す</a>
        <a class="btn secondary" href="${escAttr(lyricLinks.youtube)}" target="_blank" rel="noopener">YouTubeで歌詞動画を探す</a>
      </div>
      <p class="mini">歌詞本文は自動取得せず、リンク先で確認してから手入力してください。</p>
    </div>
    <div class="card">
      <h3 class="section-title">アーティスト情報</h3>
      <div id="artistInfo" class="mini">アーティスト情報を取得中...</div>
    </div>
    <div class="card"><h3 class="section-title">歌詞解説</h3>${lines.map(l => lineHtml(l, s.id, s.title, s.artist_name)).join("") || "<p class='mini'>歌詞がありません。</p>"}</div>`;
  showScreen("detail");
  enrichSongDetail(s, youtubeThumb, savedCover);
}

async function enrichSongDetail(song, youtubeThumb, savedCover = "") {
  const [artistInfo, coverUrl] = await Promise.all([
    fetchArtistInfo(song.artist_name),
    fetchCoverArt(song.title, song.artist_name)
  ]);
  renderArtistInfo(artistInfo);
  const cover = qs("#coverImage");
  if (cover) {
    cover.src = savedCover || coverUrl || youtubeThumb || placeholderImage();
    cover.onerror = () => {
      if (youtubeThumb && cover.src !== youtubeThumb) cover.src = youtubeThumb;
      else cover.src = placeholderImage();
    };
  }
}

function renderArtistInfo(info) {
  const box = qs("#artistInfo");
  if (!box) return;
  if (!info) {
    box.innerHTML = `<p>アーティスト情報を取得できませんでした。</p>`;
    return;
  }
  box.innerHTML = `
    <div class="artist-card">
      ${info.image ? `<img class="artist-img" src="${escAttr(info.image)}" alt="${escAttr(info.name)}">` : ""}
      <div>
        <h4 style="margin:0 0 8px">${esc(info.name)}</h4>
        <p>${esc(info.extract)}</p>
        ${info.url ? `<a class="dict-link" href="${escAttr(info.url)}" target="_blank" rel="noopener">Wikipediaで見る</a>` : ""}
      </div>
    </div>`;
}

function lineHtml(line, songId, songTitle, artistName) {
  const g = normalizeGrammarObject(line.grammar, line.lyric);
  const translation = cleanTranslation(line.translation, line.lyric) || cleanTranslation(g.translation, line.lyric) || translateLine(line.lyric);
  const notes = (g.notes && g.notes.length ? g.notes : grammarNotes(line.lyric, g.points || [])).slice(0, 4);
  const words = (g.words && g.words.length ? g.words : vocabularyItems(line.lyric)).slice(0, 6);
  const examples = (g.examples && g.examples.length ? g.examples : similarExamples(line.lyric)).slice(0, 2);
  return `<div class="lyrics-line">
    <div class="en">${wordify(line.lyric, songId, line.line_no, songTitle, artistName)}</div>
    <div class="jp"><b>自然な和訳：</b>${esc(translation)}</div>
    <div class="mini compact-analysis">
      <b>文法ポイント（要約）</b>
      <ul class="grammar-list">
        ${(notes.length ? notes : ["重要な単語と語順から意味をつかみます。"]).map(note => `<li>${esc(note)}</li>`).join("")}
      </ul>
      <b>単語の意味</b>
      <ul class="grammar-list">
        ${(words.length ? words : [{ word: "重要単語", meaning: "少なめです" }]).map(w => `<li><b>${esc(w.word)}</b>: ${esc(w.meaning)}</li>`).join("")}
      </ul>
      <b>例文</b><br>${nl(examples.join("\n"))}
    </div>
    <div class="actions" style="margin-top:12px">
      <button class="btn secondary" data-action="speak" data-text="${escAttr(line.lyric)}">読み上げ</button>
      <button class="btn green" type="button">単語をタップ</button>
    </div>
  </div>`;
}

function wordify(text, songId, lineNo, songTitle, artistName) {
  return tokenizePreservingSpace(text).map(part => {
    if (/^[A-Za-z][A-Za-z'’]*$/.test(part)) {
      const clean = normalizeWord(part);
      return `<span class="word" tabindex="0" data-word="${escAttr(clean)}" data-song-id="${escAttr(songId)}" data-line-no="${lineNo}" data-song-title="${escAttr(songTitle || "")}" data-artist-name="${escAttr(artistName || "")}">${esc(part)}</span>`;
    }
    return esc(part);
  }).join("");
}

function tokenizePreservingSpace(text) {
  return String(text || "").match(/[A-Za-z][A-Za-z'’]*|[^A-Za-z]+/g) || [];
}

async function autoFillFromYoutube() {
  const url = qs("#youtubeUrl").value.trim();
  if (!url) { toast("YouTube URLを入力してください"); return; }
  const videoId = extractYoutubeId(url);
  let titleText = "";
  let channelText = "";
  let youtubeThumbFromEmbed = "";
  const known = KNOWN_YOUTUBE[videoId];
  try {
    if (window.YOUTUBE_API_KEY && window.YOUTUBE_API_KEY.length > 10) {
      const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${encodeURIComponent(videoId)}&key=${encodeURIComponent(window.YOUTUBE_API_KEY)}`);
      const json = await res.json();
      const item = json.items?.[0];
      if (item) {
        titleText = item.snippet.title || "";
        channelText = item.snippet.channelTitle || "";
      }
    }
  } catch (e) {
    console.warn("YouTube Data API failed", e);
  }
  if (!titleText) {
    const embed = await fetchYoutubeOEmbed(url);
    titleText = embed.title;
    channelText = embed.author;
    youtubeThumbFromEmbed = embed.thumbnail || "";
  }
  const guess = known ? { ...known } : (titleText ? parseYoutubeTitle(titleText, channelText) : { title: "Unknown Song", artist: "Artist Name", genre: "Pop", profile: "" });
  applySongGuess(guess);
  if (youtubeThumbFromEmbed && !qs("#coverArtUrl").value) qs("#coverArtUrl").value = youtubeThumbFromEmbed;
  createLyricsLinksFromForm(false);
  const artistInfo = await fetchArtistInfo(guess.artist);
  if (artistInfo?.extract) qs("#artistProfile").value = artistInfo.extract;
  else if (guess.profile) qs("#artistProfile").value = guess.profile;
  toast("曲名・アーティスト名を自動入力しました");
}

async function fetchYoutubeOEmbed(url) {
  // ブラウザからYouTube oEmbedを直接読むとCORSで失敗することがあるため、
  // Vercel Serverless Function /api/youtube を優先して使います。
  try {
    const res = await fetch(`/api/youtube?url=${encodeURIComponent(url)}`);
    if (res.ok) {
      const json = await res.json();
      return {
        title: json.title || "",
        author: json.author_name || json.author || "",
        thumbnail: json.thumbnail_url || json.thumbnail || ""
      };
    }
    console.warn("Local YouTube API failed", res.status);
  } catch (e) {
    console.warn("Local YouTube API failed", e);
  }

  // ローカル環境など /api/youtube がない場合の予備処理です。
  try {
    const res = await fetch(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`);
    if (!res.ok) return { title: "", author: "", thumbnail: "" };
    const json = await res.json();
    return { title: json.title || "", author: json.author_name || "", thumbnail: json.thumbnail_url || "" };
  } catch (e) {
    console.warn("YouTube oEmbed failed", e);
    return { title: "", author: "", thumbnail: "" };
  }
}

function extractYoutubeId(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.split("/").filter(Boolean)[0] || "";
    return u.searchParams.get("v") || u.pathname.split("/").filter(Boolean).pop() || "";
  } catch {
    return url;
  }
}

function parseYoutubeTitle(title, channel) {
  let clean = title
    .replace(/\[[^\]]*]/g, " ")
    .replace(/\([^)]*(official|lyrics?|audio|video|mv|hd|4k)[^)]*\)/ig, " ")
    .replace(/\bOfficial\b|\bMusic Video\b|\bLyric Video\b|\bLyrics\b|\bAudio\b/ig, " ")
    .replace(/\s+/g, " ")
    .trim();
  let artist = (channel || "").replace(/ - Topic$/i, "").replace(/VEVO$/i, "").trim();
  let song = clean;
  for (const sep of [" - ", " – ", " — "]) {
    if (clean.includes(sep)) {
      const parts = clean.split(sep).map(x => x.trim()).filter(Boolean);
      if (parts.length >= 2) {
        artist = parts[0];
        song = parts.slice(1).join(" - ");
        break;
      }
    }
  }
  return { title: song || clean || "Unknown Song", artist: artist || "Artist Name", genre: "Pop", profile: makeArtistProfile(artist || channel || "このアーティスト") };
}

function applySongGuess(g) {
  qs("#songTitle").value = g.title || "";
  qs("#artistName").value = g.artist || "";
  qs("#genre").value = g.genre || "Pop";
  qs("#artistProfile").value = g.profile || makeArtistProfile(g.artist || "このアーティスト");
}

function makeArtistProfile(artist) {
  const name = (artist || "このアーティスト").trim();
  const key = name.toLowerCase();
  const profiles = {
    "ed sheeran": KNOWN_YOUTUBE.JGwWNGJdvx8.profile,
    "linkin park": "Linkin Parkはアメリカ出身のロックバンドです。ロック、ヒップホップ、エレクトロニックな音を組み合わせた力強いサウンドで知られています。歌詞には不安、葛藤、孤独、前に進もうとする気持ちが多く表れ、感情表現を学ぶのに向いています。",
    "eminem": "Eminemはアメリカ出身のラッパー、ソングライター、音楽プロデューサーです。速いラップ、強い感情表現、物語性のある歌詞で知られています。英語学習では、口語表現、韻の踏み方、感情を強く伝える単語を学びやすいアーティストです。",
    "rihanna": "Rihannaはバルバドス出身のシンガー、ビジネスウーマンです。ポップ、R&B、ダンスミュージックを中心に、印象的なメロディと感情表現で知られています。歌詞からは恋愛表現や日常で使いやすい英語表現を学べます。",
    "bruno mars": "Bruno Marsはアメリカ出身のシンガーソングライターです。ポップ、R&B、ファンクなどを取り入れた明るい楽曲で知られています。歌詞には恋愛、楽しさ、自信を表す表現が多く、自然な会話表現を学びやすいアーティストです。",
    "taylor swift": "Taylor Swiftはアメリカ出身のシンガーソングライターです。恋愛、成長、人間関係を物語のように描く歌詞で知られています。英語学習では、感情表現、比喩、日常会話に近いフレーズを学びやすいアーティストです。",
    "coldplay": "Coldplayはイギリス出身のロックバンドです。美しいメロディと、希望、孤独、愛をテーマにした歌詞で知られています。比較的聞き取りやすい発音の曲も多く、英語学習にも取り入れやすいアーティストです。"
  };
  if (profiles[key]) return profiles[key];
  return `${name}は、洋楽を通じて英語表現を学ぶのに適したアーティストです。歌詞には日常的な単語、感情表現、前置詞、動詞表現が含まれるため、和訳だけでなく文法や語感も合わせて学べます。`;
}

function hasJapaneseText(text) {
  return /[ぁ-んァ-ン一-龥]/.test(text || "");
}

function looksEnglishProfile(text) {
  const value = (text || "").trim();
  if (!value) return false;
  if (hasJapaneseText(value)) return false;
  return /\b(is|are|was|were|born|formed|singer|rapper|band|songwriter|producer|American|British|rock|pop)\b/i.test(value);
}

function getDisplayArtistProfile(song) {
  const profile = (song?.artist_profile || "").trim();
  if (!profile) return makeArtistProfile(song?.artist_name || "このアーティスト");
  if (looksEnglishProfile(profile)) return makeArtistProfile(song?.artist_name || "このアーティスト");
  return profile;
}

async function fetchArtistInfo(artistName) {
  const name = (artistName || "").trim();
  if (!name) return null;
  for (const lang of ["ja", "en"]) {
    try {
      const res = await fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`);
      if (!res.ok) continue;
      const json = await res.json();
      if (json.type === "disambiguation" || !json.extract) continue;
      const isJapanese = lang === "ja" || hasJapaneseText(json.extract || "");
      return {
        name: json.title || name,
        extract: isJapanese ? json.extract : makeArtistProfile(name),
        image: json.thumbnail?.source || json.originalimage?.source || "",
        url: json.content_urls?.desktop?.page || json.content_urls?.mobile?.page || ""
      };
    } catch (e) {
      console.warn("Wikimedia lookup failed", e);
    }
  }
  return null;
}

async function fetchCoverArt(title, artist) {
  if (!title || !artist) return "";
  try {
    const query = `release:"${title}" AND artist:"${artist}"`;
    const url = `https://musicbrainz.org/ws/2/release/?query=${encodeURIComponent(query)}&fmt=json&limit=1`;
    const res = await fetch(url);
    if (!res.ok) return "";
    const json = await res.json();
    const releaseId = json.releases?.[0]?.id;
    if (!releaseId) return "";
    return `https://coverartarchive.org/release/${releaseId}/front-500`;
  } catch (e) {
    console.warn("MusicBrainz/Cover Art Archive lookup failed", e);
    return "";
  }
}

function getYoutubeThumbnail(url) {
  const id = extractYoutubeId(url || "");
  return id ? `https://img.youtube.com/vi/${encodeURIComponent(id)}/hqdefault.jpg` : "";
}

function placeholderImage() {
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="#0b1220"/><circle cx="200" cy="200" r="118" fill="#15233a" stroke="#e6c374" stroke-width="10"/><circle cx="200" cy="200" r="30" fill="#71b7ff"/><text x="200" y="342" fill="#e6c374" text-anchor="middle" font-family="Arial" font-size="28" font-weight="700">Lyrics English</text></svg>`);
}

async function autoFillMusicLinks() {
  const title = qs("#songTitle").value.trim();
  const artist = qs("#artistName").value.trim();
  if (!title || !artist) { toast("曲名とアーティスト名を先に入力してください"); return; }
  const spotifyUrl = makeSpotifySearchUrl(title, artist);
  qs("#spotifyUrl").value = spotifyUrl;
  try {
    const apple = await fetchAppleMusicInfo(title, artist);
    if (apple?.url) qs("#appleUrl").value = apple.url;
    if (apple?.artwork) qs("#coverArtUrl").value = apple.artwork;
    toast(apple?.url ? "Apple Music / Spotifyリンクを入力しました" : "Spotifyリンクを入力しました。Apple Musicは見つかりませんでした");
  } catch (e) {
    console.warn("Music link lookup failed", e);
    toast("Spotifyリンクを入力しました。Apple Music取得は失敗しました");
  }
  createLyricsLinksFromForm(false);
}

async function fetchAppleMusicInfo(title, artist) {
  const term = `${title} ${artist}`.trim();
  const params = new URLSearchParams({ term, media: "music", entity: "song", country: "JP", limit: "1" });
  let res = await fetch(`https://itunes.apple.com/search?${params.toString()}`);
  let json = await res.json();
  let item = json.results?.[0];
  if (!item) {
    params.set("country", "US");
    res = await fetch(`https://itunes.apple.com/search?${params.toString()}`);
    json = await res.json();
    item = json.results?.[0];
  }
  if (!item) return null;
  return {
    url: item.trackViewUrl || "",
    artwork: highResAppleArtwork(item.artworkUrl100 || ""),
    trackName: item.trackName || "",
    artistName: item.artistName || "",
    collectionName: item.collectionName || ""
  };
}

function highResAppleArtwork(url) {
  return String(url || "").replace(/\/\d+x\d+bb\.(jpg|png)$/i, "/600x600bb.$1");
}

function makeSpotifySearchUrl(title, artist) {
  const q = [title, artist].filter(Boolean).join(" ").trim();
  return q ? `https://open.spotify.com/search/${encodeURIComponent(q)}` : "";
}

function makeLyricsSearchLinks(title, artist) {
  const q = [artist, title].filter(Boolean).join(" ").trim();
  const enc = encodeURIComponent(q);
  const plus = encodeURIComponent(`${q} lyrics`);
  return {
    google: q ? `https://www.google.com/search?q=${plus}` : "",
    genius: q ? `https://genius.com/search?q=${enc}` : "",
    youtube: q ? `https://www.youtube.com/results?search_query=${plus}` : ""
  };
}

function normalizeLyricsLinks(value) {
  if (typeof value === "string") {
    try { return normalizeLyricsLinks(JSON.parse(value)); } catch { return makeLyricsSearchLinks("", ""); }
  }
  return {
    google: value?.google || "",
    genius: value?.genius || "",
    youtube: value?.youtube || ""
  };
}

function createLyricsLinksFromForm(showToast = true) {
  const title = qs("#songTitle").value.trim();
  const artist = qs("#artistName").value.trim();
  if (!title || !artist) { if (showToast) toast("曲名とアーティスト名を先に入力してください"); return null; }
  const links = makeLyricsSearchLinks(title, artist);
  const preview = qs("#lyricsLinksPreview");
  const box = qs("#lyricsLinksBox");
  if (preview && box) {
    preview.style.display = "block";
    box.innerHTML = `
      <a class="btn secondary" href="${escAttr(links.google)}" target="_blank" rel="noopener">Googleで歌詞を探す</a>
      <a class="btn secondary" href="${escAttr(links.genius)}" target="_blank" rel="noopener">Geniusで探す</a>
      <a class="btn secondary" href="${escAttr(links.youtube)}" target="_blank" rel="noopener">YouTubeで歌詞動画を探す</a>`;
  }
  if (showToast) toast("歌詞確認リンクを作成しました");
  return links;
}

function analyzeLyrics() {
  const raw = qs("#lyricsRaw").value.trim();
  if (!raw) { toast("歌詞を貼り付けてください"); return; }
  currentAnalysis = raw.split(/\n+/).map((line, i) => makeLine(line.trim(), i + 1)).filter(l => l.lyric);
  qs("#lyricsLinksPreview").style.display = "none";
  qs("#lyricsLinksBox").innerHTML = "";
  qs("#analysisPreview").innerHTML = currentAnalysis.map(l => lineHtml(l, "preview", "", "")).join("");
  toast("和訳・文法・単語の簡潔な解説を作成しました");
}

function makeLine(line, no) {
  return {
    line_no: no,
    lyric: line,
    translation: translateLine(line),
    grammar: grammarObject(line),
    vocabulary: vocabularyText(line),
    preposition: prepositionText(line)
  };
}

function isPlaceholderTranslation(value) {
  const text = String(value || "").trim();
  if (!text) return true;
  return /自然な日本語に訳してください|前後の文脈|和訳を作成できませんでした|和訳を自動作成できませんでした/.test(text);
}

function cleanTranslation(value, lyric) {
  if (isPlaceholderTranslation(value)) return "";
  const text = String(value || "").trim();
  if (!text) return "";
  if (text === String(lyric || "").trim()) return "";
  return text;
}

function refreshLineAnalysis(line, index = 0) {
  const lyric = String(line?.lyric || line || "").trim();
  return {
    line_no: Number(line?.line_no) || index + 1,
    lyric,
    translation: translateLine(lyric),
    grammar: grammarObject(lyric),
    vocabulary: vocabularyText(lyric),
    preposition: prepositionText(lyric)
  };
}

function grammarObject(line) {
  const normalized = normalizeLyricLine(line);
  const lower = normalized.toLowerCase();
  const points = [];

  if (/\b(i'm|you're|we're|they're|it's|he's|she's|am|is|are|was|were|isn't|aren't|wasn't|weren't)\b/i.test(normalized)) points.push("be動詞");
  if (/\btired\s+of\s+[a-zA-Z']+ing\b/i.test(normalized)) points.push("be tired of -ing");
  if (/\b[a-zA-Z']+ing\b/.test(lower)) points.push("動名詞 / 現在分詞");
  if (/\b(want|wants|wanted)\s+\w+\s+to\s+\w+/i.test(normalized)) points.push("want + 人 + to do");
  if (/\bto\s+[a-zA-Z']+\b/.test(lower)) points.push("to不定詞");
  if (/\bwhat\b/i.test(normalized)) points.push("what節");
  if (/\b(will|would|can|could|should|must|may|might)\b/i.test(normalized)) points.push("助動詞");
  if (/\b(not|isn't|aren't|don't|doesn't|didn't|won't|can't|never|no)\b/i.test(normalized)) points.push("否定");
  if (/\b(best|better|more|most|less|least)\b/i.test(normalized)) points.push("比較");
  if (/\b(in|on|at|for|to|with|from|of|by|about|into|over|under)\b/i.test(normalized)) points.push("前置詞");

  return {
    translation: translateLine(line),
    points: [...new Set(points)],
    notes: grammarNotes(line, points),
    words: vocabularyItems(line).slice(0, 6),
    examples: similarExamples(line)
  };
}


function normalizeGrammarObject(grammar, lyric) {
  if (grammar && typeof grammar === "object") {
    return {
      translation: grammar.translation || translateLine(lyric),
      points: grammar.points || [],
      notes: grammar.notes || grammarNotes(lyric, grammar.points || []),
      words: grammar.words || vocabularyItems(lyric),
      examples: grammar.examples || similarExamples(lyric)
    };
  }
  return grammarObject(lyric || "");
}

function normalizeGrammar(grammar) {
  if (grammar && typeof grammar === "object") return grammarHtml(grammar);
  if (typeof grammar === "string" && grammar.trim()) return `<p class="mini">${nl(grammar)}</p>`;
  return grammarHtml(grammarObject(""));
}

function grammarHtml(g) {
  const notes = g.notes || [];
  const words = g.words || [];
  return `
    <div class="mini compact-analysis">
      <b>自然な和訳</b><br>${esc(g.translation || "和訳を作成できませんでした")}

      <br><br><b>文法ポイント（要約）</b>
      <ul class="grammar-list">
        ${(notes.length ? notes : ["この行は、語順と前後の文脈で意味をつかみます。"]).map(note => `<li>${esc(note)}</li>`).join("")}
      </ul>

      <b>単語の意味</b>
      <ul class="grammar-list">
        ${(words.length ? words : [{ word: "重要単語", meaning: "少なめです" }]).map(w => `<li><b>${esc(w.word)}</b>: ${esc(w.meaning)}</li>`).join("")}
      </ul>

      <b>例文</b><br>${nl((g.examples || []).slice(0, 2).join("\n"))}
    </div>`;
}

function normalizeLyricLine(line) {
  return String(line || "")
    .replace(/[’‘´`]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s*'\s*/g, "'")
    .replace(/I\s*m/gi, "I'm")
    .replace(/You\s*re/gi, "you're")
    .replace(/We\s*re/gi, "we're")
    .replace(/They\s*re/gi, "they're")
    .replace(/\s+/g, " ")
    .trim();
}

function translateLine(line) {
  const normalized = normalizeLyricLine(line);
  const exact = {
    "The club isn't the best place to find a lover": "クラブは恋人を見つけるのに一番いい場所ではない。",
    "So the bar is where I go": "だから僕はバーへ行く。",
    "I found a love for me": "僕は自分にぴったりの愛を見つけた。",
    "We are dancing in the dark": "僕たちは暗闇の中で踊っている。",
    "I'm tired of being what you want me to be": "あなたが望むような自分でいることに、もう疲れた。",
    "I am tired of being what you want me to be": "あなたが望むような自分でいることに、もう疲れた。"
  };
  if (exact[normalized]) return exact[normalized];

  if (/^i[' ]?m tired of being what you want me to be$/i.test(normalized)) {
    return "あなたが望むような自分でいることに、もう疲れた。";
  }
  if (/^i[' ]?m tired of waiting\.?$/i.test(normalized)) return "待つことに疲れた。";
  if (/^i[' ]?m tired of studying\.?$/i.test(normalized)) return "勉強することに疲れた。";
  if (/^i[' ]?m tired of working\.?$/i.test(normalized)) return "働くことに疲れた。";
  if (/^i[' ]?m tired of (.+)$/i.test(normalized)) {
    const target = normalized.replace(/^i[' ]?m tired of /i, "").replace(/[.!?]$/g, "");
    return "私は「" + target + "」に疲れている。";
  }

  let t = normalized;
  const dict = [
    ["I'm", "私は"], ["I am", "私は"], ["isn't", "ではない"], ["aren't", "ではない"], ["don't", "しない"], ["doesn't", "しない"], ["can't", "できない"],
    ["tired", "疲れた"], ["being", "でいること"], ["what", "こと"], ["want", "望む"], ["love", "愛"], ["lover", "恋人"], ["best", "最も良い"], ["place", "場所"], ["find", "見つける"], ["club", "クラブ"], ["bar", "バー"], ["go", "行く"], ["dancing", "踊っている"], ["dark", "暗闇"]
  ];
  dict.forEach(([en, ja]) => {
    const safe = en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    t = t.replace(new RegExp(`\\b${safe}\\b`, "ig"), ja);
  });
  return t === normalized ? "和訳を自動作成できませんでした。前後の歌詞を見ながら日本語訳を入力してください。" : t;
}

function grammarNotes(line, points) {
  const normalized = normalizeLyricLine(line);
  const unique = [...new Set(points || [])];
  const notes = [];
  const lower = normalized.toLowerCase();

  if (/i'm tired of being what you want me to be/i.test(normalized)) {
    return [
      "be tired of + 名詞 / 動名詞: 「〜に疲れている、〜にうんざりしている」。",
      "being: be の -ing形。ここでは動名詞で「〜でいること」。",
      "what you want me to be: what節で「あなたが私に望む姿」。",
      "want + 人 + to do: to不定詞を使い「人に〜してほしい」。"
    ];
  }

  unique.forEach(point => {
    if (point === "be動詞") notes.push("be動詞: 「〜です」「〜でいる」など状態を表します。");
    if (point === "be tired of -ing") notes.push("be tired of + 名詞 / 動名詞: 「〜に疲れている、〜にうんざりしている」。");
    if (point === "動名詞 / 現在分詞") notes.push("-ing形: 動名詞なら「〜すること」、現在分詞なら「〜している」。");
    if (point === "what節") notes.push("what節: 「〜すること・もの」という名詞のまとまり。");
    if (point === "want + 人 + to do") notes.push("want + 人 + to do: 「人に〜してほしい」。");
    if (point === "to不定詞") notes.push("to不定詞: 「〜すること」「〜するために」を作ります。");
    if (point === "否定") notes.push("否定: not / n't で「〜ではない」「〜しない」。");
    if (point === "比較") notes.push("比較: best / better / more などで比べる意味。");
    if (point === "前置詞") notes.push("前置詞: of / to / in などで単語同士の関係をつなぎます。");
    if (point === "助動詞") notes.push("助動詞: can / will / should などで可能・未来・気持ちを足します。");
  });

  if (!notes.length && lower) notes.push("この行は、重要な単語の意味と前後の文脈から読むのがポイントです。");
  return notes.slice(0, 4);
}

function vocabularyItems(line) {
  const words = [...new Set(getWords(line).map(normalizeWord).filter(w => w.length >= 3 && !STOP_WORDS.has(w)))].slice(0, 8);
  return words.map(word => ({ word, ...getWordInfo(word) }));
}

function explainWhy(line, points) {
  if (/the club isn't the best place to find a lover/i.test(line)) {
    return "The club が主語、isn't が be動詞の否定、the best place が補語です。to find a lover は不定詞で、place を後ろから説明しています。";
  }
  return points?.length ? `この行では ${points.join("、")} が意味の骨組みを作っています。英語は主語から始まり、動詞で動きや状態を決め、その後ろで目的語・補語・修飾語を足します。` : "語順と前後の文脈から意味を組み立てます。";
}

function juniorExplanation(line, subject, verb) {
  return `${subject || "主語"} が「だれ・何」、${verb || "動詞"} が「どうする・どんな状態」を表します。まずこの2つを見つけると、歌詞の意味がかなり読みやすくなります。`;
}

function similarExamples(line) {
  const normalized = normalizeLyricLine(line);
  if (/i'm tired of being what you want me to be/i.test(normalized)) {
    return [
      "I'm tired of waiting. / 待つことに疲れた。",
      "I want you to stay. / あなたに残ってほしい。"
    ];
  }
  if (/tired\s+of/i.test(normalized)) return ["I'm tired of studying. / 勉強することに疲れた。", "She is tired of working late. / 彼女は遅くまで働くことに疲れている。"];
  if (/want.+to/i.test(normalized)) return ["I want you to listen. / あなたに聞いてほしい。", "They want me to help. / 彼らは私に手伝ってほしいと思っている。"];
  if (/to\s+[a-z]/i.test(normalized)) return ["This is the best way to learn English. / これは英語を学ぶ一番良い方法です。", "I need a place to study. / 勉強する場所が必要です。"];
  if (/\bisn't\b/i.test(normalized)) return ["This isn't easy. / これは簡単ではありません。", "He isn't my brother. / 彼は私の兄弟ではありません。"];
  return ["I go to the station. / 私は駅へ行きます。", "She loves music. / 彼女は音楽が好きです。"];
}

function nativeSense(line) {
  if (/best place/i.test(line)) return "best place は会話でもよく使う自然なまとまりです。to find... を後ろに置くと「何をするための場所か」がすっきり伝わります。";
  return "ネイティブは一語ずつ直訳するより、主語・動詞・まとまり表現で意味をつかみます。歌詞では省略や比喩も多いので、文法と気持ちを合わせて読むのが大切です。";
}

function getWords(line) { return String(line || "").replace(/[^\w\s']/g, " ").split(/\s+/).filter(Boolean); }
function guessSubject(words) { return words.slice(0, Math.min(2, words.length)).join(" ") || ""; }
function guessVerb(words) { return words.find(w => /\b(am|is|are|was|were|isn't|aren't|go|goes|went|find|found|love|loves|dance|dancing)\b/i.test(w)) || words[1] || ""; }
function guessObject(words, verb) { const i = words.findIndex(w => w.toLowerCase() === String(verb).toLowerCase()); return i >= 0 ? words.slice(i + 1, i + 4).join(" ") : ""; }
function guessComplement(line) { const m = line.match(/\b(?:is|are|was|were|isn't|aren't)\s+(.+?)(?:\s+to\s+|$)/i); return m ? m[1].trim() : ""; }
function guessModifiers(line) { const matches = line.match(/\b(?:to\s+[a-zA-Z']+(?:\s+[a-zA-Z']+)?|in\s+the\s+[a-zA-Z']+|for\s+[a-zA-Z']+|with\s+[a-zA-Z']+)\b/gi); return matches ? matches.join(" / ") : ""; }

function vocabularyText(line) {
  const words = [...new Set(getWords(line).map(normalizeWord).filter(w => w.length >= 3 && !STOP_WORDS.has(w)))].slice(0, 8);
  return words.length ? words.map(w => {
    const info = getWordInfo(w);
    return `・${w}: ${info.meaning} / ${info.pos}`;
  }).join("\n") : "重要単語は少なめです。";
}

function prepositionText(line) {
  const notes = {
    in: "in: 空間・期間・状態の中にいるイメージ。",
    on: "on: 何かに接している、乗っているイメージ。",
    at: "at: 一点の場所・時刻を指すイメージ。",
    for: "for: 目的・対象。「のために」「にとって」。",
    to: "to: 方向・到達点。to + 動詞なら不定詞。",
    with: "with: 一緒・道具・関係。",
    from: "from: 起点。「から」。",
    of: "of: 所属・一部・関係。",
    by: "by: 手段・作者・期限。",
    about: "about: 話題。「について」。"
  };
  const prep = [...new Set((line.match(/\b(in|on|at|for|to|with|from|of|by|about|into|over|under)\b/gi) || []).map(p => p.toLowerCase()))];
  return prep.length ? prep.map(p => notes[p] || `${p}: 前後の単語をつなぎ、場所・方向・関係などを表します。`).join("\n") : "この行では目立つ前置詞はありません。";
}

async function saveSong() {
  const id = qs("#editId").value || crypto.randomUUID();
  const raw = qs("#lyricsRaw").value.trim();
  const title = qs("#songTitle").value.trim();
  const artistName = qs("#artistName").value.trim();

  if (!title || !raw) {
    toast("曲名と歌詞は必須です");
    return;
  }

  const existing = songs.find(s => s.id === id);
  const sourceLines = currentAnalysis.length
    ? currentAnalysis
    : raw.split(/\n+/).map((line, i) => makeLine(line.trim(), i + 1)).filter(l => l.lyric);

  // 古い保存データに「自然な日本語に訳してください」などの仮文が残っていても、
  // 保存時に必ず現在のロジックで再分析してからSupabaseへ入れる。
  const lines = sourceLines.map((line, i) => refreshLineAnalysis(line, i)).filter(l => l.lyric);

  // まず画面上の入力をバックアップする。Supabase保存で失敗しても歌詞が消えないようにする。
  const draftBackup = {
    id,
    title,
    artist_name: artistName,
    youtube_url: qs("#youtubeUrl").value.trim(),
    apple_music_url: qs("#appleUrl").value.trim(),
    spotify_url: qs("#spotifyUrl").value.trim(),
    cover_art_url: qs("#coverArtUrl").value.trim(),
    genre: qs("#genre").value.trim(),
    difficulty: qs("#difficulty").value,
    artist_profile: qs("#artistProfile").value.trim(),
    lyrics_raw: raw,
    lyric_lines: lines,
    updated_at: new Date().toISOString()
  };
  try {
    localStorage.setItem("lyrics_english_last_song_draft", JSON.stringify(draftBackup));
  } catch (_) {}

  const payload = {
    id,
    title,
    artist_name: artistName,
    youtube_url: draftBackup.youtube_url,
    apple_music_url: draftBackup.apple_music_url,
    spotify_url: draftBackup.spotify_url,
    cover_art_url: draftBackup.cover_art_url,
    lyrics_links: makeLyricsSearchLinks(title, artistName),
    genre: draftBackup.genre,
    difficulty: draftBackup.difficulty,
    artist_profile: draftBackup.artist_profile,
    lyrics_raw: raw,
    lyric_lines: lines,
    created_by: existing?.created_by || currentUser,
    updated_by: currentUser,
    updated_at: new Date().toISOString()
  };

  const result = await upsertSongSafely(payload);

  if (!result.ok) {
    console.error("Song save failed", result.error);
    toast("保存失敗: " + (result.error?.message || "不明なエラー") + "。入力内容はこのブラウザに一時保存しました");
    return;
  }

  if (result.removedColumns.length) {
    console.warn("Saved without columns:", result.removedColumns);
    toast("保存しました。一部の追加項目はSupabaseに未追加のため保存対象から外しました");
  } else {
    toast("保存しました");
  }

  await addLog(`${currentUser} が「${title}」を保存しました`);
  clearForm();
  await fetchSongs();
  renderSongs();
  await fetchLogs();
  renderLog();
  showScreen("home");
}

function extractMissingColumnName(message = "") {
  const patterns = [
    /Could not find the '([^']+)' column/i,
    /column "([^"]+)" of relation/i,
    /column ([a-zA-Z0-9_]+) does not exist/i,
    /'([a-zA-Z0-9_]+)' column/i
  ];
  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match?.[1]) return match[1];
  }
  return "";
}

async function upsertSongSafely(originalPayload) {
  const removedColumns = [];
  const optionalOrder = [
    "spotify_url",
    "cover_art_url",
    "lyrics_links",
    "youtube_thumbnail_url",
    "artist_wikipedia_url",
    "artist_image_url",
    "apple_music_url",
    "artist_profile",
    "genre",
    "difficulty",
    "updated_by",
    "created_by",
    "updated_at"
  ];

  let payload = { ...originalPayload };
  let lastError = null;

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const { error } = await supabaseClient.from("songs").upsert(payload);
    if (!error) return { ok: true, removedColumns, error: null };

    lastError = error;
    const message = error.message || "";
    const missingColumn = extractMissingColumnName(message);

    let columnToRemove = "";
    if (missingColumn && Object.prototype.hasOwnProperty.call(payload, missingColumn)) {
      columnToRemove = missingColumn;
    } else if (/schema cache|column|Could not find/i.test(message)) {
      columnToRemove = optionalOrder.find(col => Object.prototype.hasOwnProperty.call(payload, col));
    }

    if (!columnToRemove) break;

    delete payload[columnToRemove];
    if (!removedColumns.includes(columnToRemove)) removedColumns.push(columnToRemove);
  }

  // 最後の保険。歌詞保存に必要な項目を最優先して、外部リンクやプロフィールをすべて外して保存する。
  const minimalPayload = {
    id: originalPayload.id,
    title: originalPayload.title,
    artist_name: originalPayload.artist_name,
    youtube_url: originalPayload.youtube_url,
    lyrics_raw: originalPayload.lyrics_raw,
    lyric_lines: originalPayload.lyric_lines,
    updated_at: originalPayload.updated_at
  };

  let minimal = { ...minimalPayload };
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const { error } = await supabaseClient.from("songs").upsert(minimal);
    if (!error) return { ok: true, removedColumns: [...new Set([...removedColumns, "minimal_save"])], error: null };

    lastError = error;
    const missingColumn = extractMissingColumnName(error.message || "");
    if (missingColumn && Object.prototype.hasOwnProperty.call(minimal, missingColumn)) {
      // title/id以外は、テーブルに存在しない場合だけ外す。
      if (missingColumn === "id" || missingColumn === "title") break;
      delete minimal[missingColumn];
      removedColumns.push(missingColumn);
      continue;
    }
    break;
  }

  return { ok: false, removedColumns, error: lastError };
}

function editSong(id) {
  const s = songs.find(x => x.id === id);
  if (!s) return;
  qs("#formTitle").textContent = "曲を編集";
  qs("#editId").value = s.id;
  qs("#youtubeUrl").value = s.youtube_url || "";
  qs("#songTitle").value = s.title || "";
  qs("#artistName").value = s.artist_name || "";
  qs("#appleUrl").value = s.apple_music_url || "";
  qs("#spotifyUrl").value = s.spotify_url || makeSpotifySearchUrl(s.title, s.artist_name);
  qs("#coverArtUrl").value = s.cover_art_url || "";
  createLyricsLinksFromForm(false);
  qs("#genre").value = s.genre || "";
  qs("#difficulty").value = s.difficulty || "初級";
  qs("#artistProfile").value = s.artist_profile || "";
  qs("#lyricsRaw").value = s.lyrics_raw || "";
  currentAnalysis = Array.isArray(s.lyric_lines) ? s.lyric_lines.map((line, i) => refreshLineAnalysis(line, i)) : [];
  qs("#lyricsLinksPreview").style.display = "none";
  qs("#lyricsLinksBox").innerHTML = "";
  qs("#analysisPreview").innerHTML = currentAnalysis.map(l => lineHtml(l, s.id, s.title, s.artist_name)).join("");
  showScreen("add");
}

async function deleteSong(id) {
  if (!confirm("削除しますか？")) return;
  const title = songs.find(s => s.id === id)?.title || "曲";
  const { error } = await supabaseClient.from("songs").delete().eq("id", id);
  if (error) { toast("削除失敗: " + error.message); return; }
  await addLog(`${currentUser} が「${title}」を削除しました`);
  await fetchSongs();
  renderSongs();
  showScreen("home");
  toast("削除しました");
}

function clearForm() {
  ["editId", "youtubeUrl", "songTitle", "artistName", "appleUrl", "spotifyUrl", "coverArtUrl", "genre", "artistProfile", "lyricsRaw"].forEach(id => qs("#" + id).value = "");
  qs("#difficulty").value = "初級";
  qs("#formTitle").textContent = "曲を追加";
  qs("#lyricsLinksPreview").style.display = "none";
  qs("#lyricsLinksBox").innerHTML = "";
  qs("#analysisPreview").innerHTML = "<p class='mini'>歌詞を貼り付けて「AI分析風に解説」を押してください。</p>";
  currentAnalysis = [];
}

function handleWordHover(e) {
  const el = e.target.closest && e.target.closest("[data-word]");
  if (!el) return;
  const clean = normalizeWord(el.dataset.word);
  if (!clean || STOP_WORDS.has(clean)) return;
  showWordTooltip(el, clean);
}

function handleWordHoverEnd(e) {
  const el = e.target.closest && e.target.closest("[data-word]");
  if (!el) return;
  hideWordTooltip();
}

function showWordTooltip(el, word) {
  const tip = qs("#wordTooltip");
  if (!tip) return;
  const info = getWordInfo(word);
  const usage = getWordUsage(word);
  tip.innerHTML = `
    <div class="tip-title">${esc(word)}</div>
    <div class="tip-section"><b>意味：</b><br>${esc(info.meaning)}</div>
    <div class="tip-section"><b>使い方：</b><br>${esc(usage.usage)}<br>${esc(usage.meaning || "")}</div>
    <div class="tip-section"><b>例文：</b><br>${esc(usage.example)}<br>${esc(usage.ja)}</div>
  `;
  tip.style.display = "block";
  const rect = el.getBoundingClientRect();
  const pad = 12;
  const tipRect = tip.getBoundingClientRect();
  let left = rect.left + rect.width / 2 - tipRect.width / 2;
  left = Math.max(pad, Math.min(left, window.innerWidth - tipRect.width - pad));
  let top = rect.top - tipRect.height - 10;
  if (top < pad) top = rect.bottom + 10;
  tip.style.left = `${left}px`;
  tip.style.top = `${top}px`;
}

function hideWordTooltip() {
  const tip = qs("#wordTooltip");
  if (tip) tip.style.display = "none";
}

function getWordUsage(word) {
  const key = normalizeWord(word).replace(/'/g, "");
  const usage = WORD_USAGE[key];
  if (usage) return { meaning: usage.meaning || "", ...usage };
  return {
    usage: "歌詞の前後を見て、名詞・動詞・形容詞のどれかを確認します。",
    meaning: "文脈の中で意味を確認します。",
    example: `Check the word "${normalizeWord(word)}" in context.`,
    ja: `「${normalizeWord(word)}」を文脈の中で確認しましょう。`
  };
}

function openWordModal(word, songId, lineNo, songTitle, artistName) {
  if (songId === "preview") { toast("保存後に単語を追加できます"); return; }
  const clean = normalizeWord(word);
  if (STOP_WORDS.has(clean)) { toast("学習優先度が低い単語なので除外しています"); return; }
  const info = getWordInfo(clean);
  const song = songs.find(s => s.id === songId);
  const line = (song?.lyric_lines || []).find(l => Number(l.line_no) === Number(lineNo));
  selectedWordContext = { word: clean, songId, lineNo, songTitle, artistName, example: line?.lyric || "" };
  qs("#modalWord").textContent = clean;
  qs("#modalInfo").textContent = `${songTitle} / ${artistName}`;
  qs("#modalMeaning").value = info.meaning;
  qs("#modalPos").value = info.pos;
  const usage = getWordUsage(clean);
  qs("#modalMemo").value = `${info.memo}\n使い方: ${usage.usage}\n例文: ${usage.example}\n訳: ${usage.ja}` + (line?.lyric ? `\n歌詞: ${line.lyric}` : "");
  qs("#modalDictLink").href = dictionaryUrl(clean);
  qs("#wordModal").style.display = "flex";
}

function closeWordModal() {
  qs("#wordModal").style.display = "none";
  selectedWordContext = null;
}

function getWordInfo(word) {
  const key = normalizeWord(word).replace(/'/g, "");
  const value = WORD_DICTIONARY[key] || WORD_DICTIONARY[normalizeWord(word)] || ["意味を確認してください", "品詞を確認してください", "この単語が歌詞の中でどう使われているかメモしてください。"];
  return { meaning: value[0], pos: value[1], memo: value[2] };
}

async function addSelectedWordToVocab() {
  if (!selectedWordContext) return;
  const { word, songId, songTitle, artistName, example } = selectedWordContext;
  const now = new Date().toISOString();
  const { error } = await supabaseClient.from("vocabulary").insert({
    user_id: currentUser,
    song_id: songId,
    word,
    meaning: qs("#modalMeaning").value,
    part_of_speech: qs("#modalPos").value,
    example,
    memo: qs("#modalMemo").value,
    song_title: songTitle,
    artist_name: artistName,
    status: "復習中",
    created_at: now,
    updated_at: now
  });
  if (error) { toast("単語追加失敗: " + error.message); return; }
  await addLog(`${currentUser} が単語「${word}」を追加しました`);
  await fetchVocab();
  renderVocab();
  closeWordModal();
  toast("単語帳に追加しました");
}

function renderVocab() {
  qs("#vocabView").innerHTML = vocab.length ? `<h3 class="section-title">保存単語</h3>` + vocab.map(x => `
    <div class="song-item">
      <div>
        <h4>${esc(x.word)}</h4>
        <div>${esc(x.meaning)}</div>
        <a class="dict-link" href="${escAttr(dictionaryUrl(x.word))}" target="_blank" rel="noopener">Weblioで確認</a>
        <div class="mini">${esc(x.part_of_speech || "")} / ${esc(x.song_title || "")} / ${esc(x.artist_name || "")} / ${fmt(x.created_at)}</div>
        <div class="mini">${esc(x.example || x.memo || "")}</div>
      </div>
      <button class="btn red no-print" data-action="delete-vocab" data-id="${escAttr(x.id)}">削除</button>
    </div>`).join("") : `<p class="mini">単語はまだありません。</p>`;
}

async function deleteVocab(id) {
  const { error } = await supabaseClient.from("vocabulary").delete().eq("id", id);
  if (error) { toast("削除失敗: " + error.message); return; }
  await fetchVocab();
  renderVocab();
}

function showPrintVocab() {
  qs("#vocabView").innerHTML = `<div class="print-area"><h2>Lyrics English 単語帳</h2><p>作成日: ${new Date().toLocaleDateString()}</p>${vocab.map(x => `<div class="vocab-row"><b>${esc(x.word)}</b>: ${esc(x.meaning)}<br><small>${esc(x.part_of_speech || "")} / ${esc(x.song_title || "")} / ${esc(x.artist_name || "")}</small></div>`).join("") || "単語はまだありません。"}</div>`;
}

function renderLog() {
  qs("#realtimeLog").innerHTML = (logs || []).map(x => `・${esc(x.message)}<br><span class="mini">${fmt(x.created_at)}</span>`).join("<br>") || "変更待機中...";
}

function speakText(text) {
  if (!("speechSynthesis" in window)) { toast("このブラウザは読み上げ非対応です"); return; }
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    const voice = window.speechSynthesis.getVoices().find(v => v.lang?.toLowerCase().startsWith("en"));
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  } catch {
    toast("読み上げを開始できませんでした");
  }
}

function normalizeWord(word) { return String(word || "").replace(/[^A-Za-z']/g, "").toLowerCase(); }
function dictionaryUrl(word) { return `https://ejje.weblio.jp/content/${encodeURIComponent(normalizeWord(word))}`; }
function esc(s) { return String(s ?? "").replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m])); }
function nl(s) { return esc(s).replace(/\n/g, "<br>"); }
function escAttr(s) { return esc(s).replace(/\n/g, " "); }
function fmt(s) { return s ? new Date(s).toLocaleString() : ""; }