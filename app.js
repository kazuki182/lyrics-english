(function () {
  if (window.__LYRICS_ENGLISH_APP_LOADED__) {
    console.warn("Lyrics English app.js was loaded more than once. Skipping duplicate execution.");
    return;
  }
  window.__LYRICS_ENGLISH_APP_LOADED__ = true;

let supabaseClient;
let currentUser = null;
let songs = [];
let vocab = [];
let logs = [];
let currentAnalysis = [];
let selectedWordContext = null;
let realtimeStarted = false;
let currentUtterance = null;
let currentSpeechText = "";
let currentSpeechRate = 1;
let speechPaused = false;
const APP_PATCH_VERSION = "v33-translation-first-collapse";

const ALLOWED_USERS = ["kazuki", "shun", "izumihara", "yoshino", "odaka", "shion", "guest"];
const COMMON_PASSWORD = "12345";
const STOP_WORDS = new Set(["the", "a", "an", "is", "are", "am", "was", "were", "be", "been", "being", "to", "of", "in", "on", "at", "for", "and", "but", "or", "i", "you", "he", "she", "it", "we", "they", "me", "my", "your", "his", "her", "our", "their", "this", "that", "these", "those", "with", "from", "by", "as", "do", "does", "did", "not", "no", "so", "if", "then", "than", "too", "very", "just", "can", "could", "will", "would", "should", "must", "may", "might", "isnt", "dont", "cant", "wont", "im", "ive", "id", "ill", "youre", "youd", "youll"]);
const LEARNING_WORDS = new Set([
  // 英検準2級以上を目安に、歌詞学習で優先したい単語だけを表示・登録対象にします。
  "ocean", "promise", "pain", "wolves", "throne", "scar", "wound", "shape", "build", "broke", "broken", "forgive", "reason", "fight",
  "remember", "memory", "memories", "moment", "alone", "hurt", "break", "swim", "thrown", "infinity", "erase", "storm",
  "leader", "whole", "pack", "beat", "sticks", "stones", "river", "lost", "open", "dark", "lover", "dancing"
]);


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
  not: ["ではない", "副詞", "動詞や文全体を否定します。"],
  said: ["言った", "動詞", "say の過去形。誰かが発言した内容を表します。"],
  say: ["言う", "動詞", "say + 内容で「〜と言う」。"],
  like: ["〜のような・好き", "前置詞 / 動詞", "like + 名詞で「〜のような」、動詞なら「好き」。"],
  open: ["開いた・広い", "形容詞 / 動詞", "open ocean では「広い海」のようなイメージです。"],
  ocean: ["海・大洋", "名詞", "広さや深さの比喩として歌詞でよく使われます。"],
  memories: ["思い出・記憶", "名詞", "memory の複数形。過去の記憶を表します。"],
  memory: ["思い出・記憶", "名詞", "過去の出来事や覚えている内容を表します。"],
  moment: ["瞬間・時", "名詞", "特定の短い時間や大切な場面を表します。"],
  alone: ["ひとりで・孤独な", "副詞 / 形容詞", "feel alone で「孤独を感じる」。"],
  broke: ["壊した・破った", "動詞", "break の過去形。promise を目的語にすると「約束を破る」。"],
  promise: ["約束", "名詞 / 動詞", "make a promise で「約束する」。"],
  ever: ["これまでに・一度でも", "副詞", "強調として使われることが多い単語です。"],
  made: ["作った・した", "動詞", "make の過去形。make a promise で「約束する」。"],
  lost: ["失った・迷った", "形容詞 / 動詞", "lost in ... で「〜の中で迷った・見失った」。"],
  pain: ["痛み・苦しみ", "名詞", "身体的・感情的な苦しみの両方に使います。"],
  away: ["離れて・遠くへ", "副詞", "take away で「取り去る」。"],
  throw: ["投げる・放り込む", "動詞", "throw A to B で「AをBへ投げる」。"],
  wolves: ["狼たち", "名詞", "wolf の複数形。危険な相手や群れの比喩にもなります。"],
  tomorrow: ["明日", "名詞 / 副詞", "未来や戻ってくる時を表します。"],
  come: ["来る", "動詞", "come back で「戻ってくる」。"],
  back: ["戻って・後ろに", "副詞", "come back で「戻る」。"],
  leader: ["リーダー・率いる人", "名詞", "leader of ... で「〜のリーダー」。"],
  whole: ["全体の・まるごとの", "形容詞", "the whole pack で「群れ全体」。"],
  pack: ["群れ・集団", "名詞", "wolves など動物の群れに使います。"],
  beat: ["打つ・打ち負かす", "動詞", "beat me で「私を打つ・打ち負かす」。"],
  black: ["黒い", "形容詞", "色や暗さのイメージを表します。"],
  blue: ["青い・憂うつな", "形容詞", "feel blue で「落ち込む」。"],
  wound: ["傷", "名詞", "心や体の傷を表します。"],
  shape: ["形作る", "動詞", "経験が人を変える・形作るという意味で使います。"],
  scar: ["傷跡", "名詞", "過去の痛みや経験の比喩として使います。"],
  build: ["築く・作り上げる", "動詞", "build my throne で「自分の王座を築く」。"],
  throne: ["王座", "名詞", "力・地位・自分の居場所の比喩として使われます。"],
  sticks: ["棒・枝", "名詞", "sticks and stones は決まり文句として使われます。"],
  stones: ["石", "名詞", "sticks and stones で「棒や石」。攻撃や批判の比喩にもなります。"],
  river: ["川", "名詞", "涙や流れの比喩として歌詞で使われます。"],
  forgive: ["許す", "動詞", "forgive + 人で「人を許す」。"],
  reason: ["理由", "名詞", "the reason で「その理由」。"],
  still: ["まだ・それでも", "副詞", "継続や逆境の中でも続く感じを表します。"],
  fight: ["戦う", "動詞 / 名詞", "困難に立ち向かう意味でも使います。"],
  remember: ["覚えている・思い出す", "動詞", "remember + 名詞 / remember that... で「〜を覚えている」。"],
  left: ["去った・残された", "動詞 / 形容詞", "leave の過去形。you left me alone で「君が僕をひとりにした」。"],
  hurt: ["傷つける・痛む", "動詞", "hurt me で「私を傷つける」。"],
  break: ["壊す・破る", "動詞", "break a promise で「約束を破る」。"],
  broken: ["壊れた・破られた", "形容詞", "broken promise で「破られた約束」。"],
  swim: ["泳ぐ", "動詞", "swim in ... で「〜の中を泳ぐ」。比喩にも使います。"],
  thrown: ["投げ込まれた", "過去分詞", "throw の過去分詞。be thrown in で「投げ込まれる」。"],
  infinity: ["無限・永遠", "名詞", "to infinity で「無限へ・果てしなく」。"],
  erase: ["消す・消し去る", "動詞", "erase memories で「記憶を消す」。"],
  only: ["ただ〜だけ", "副詞", "only memories で「思い出だけ」。"],
  memories: ["思い出・記憶", "名詞", "memory の複数形。過去の記憶を表します。"],
  ocean: ["海・大洋", "名詞", "広さや深さの比喩として歌詞でよく使われます。"],
  storm: ["嵐・困難", "名詞", "感情の荒れや困難の比喩として使われます。"],
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
  window.LYRICS_ENGLISH_VERSION = "v34-duplicate-guard-savefix";
  console.log("Lyrics English v34-duplicate-guard-savefix loaded");
  bindStaticEvents();
  document.body.dataset.lyricsEnglishVersion = window.LYRICS_ENGLISH_VERSION;
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
  qs("#normalizeLyricsBtn")?.addEventListener("click", normalizeLyricsInput);
  qs("#makePromptBtn")?.addEventListener("click", makeChatGPTPrompt);
  qs("#copyPromptBtn")?.addEventListener("click", copyChatGPTPrompt);
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
    if (name === "speak") speakText(action.dataset.text || "", Number(action.dataset.rate) || currentSpeechRate);
    if (name === "speech-pause") pauseOrResumeSpeech();
    if (name === "speech-stop") stopSpeech();
    if (name === "speech-rate") setSpeechRate(Number(action.dataset.rate) || 1, action.dataset.text || currentSpeechText);
    if (name === "refresh-metadata") refreshSongMetadata(id);
    if (name === "refresh-analysis") refreshSongAnalysis(id);
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
  const names = { kazuki: "Kazuki", shun: "Shun", izumihara: "Izumihara", yoshino: "Yoshino", odaka: "Odaka", shion: "Shion", guest: "Guest" };
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
  const latestBox = qs("#latestSongList");
  if (latestBox) latestBox.innerHTML = latestSongsHtml(songs);
  const listHtml = filtered.length ? filtered.map(songListItem).join("") : `<p class="mini">曲がありません。</p>`;
  qs("#songList").innerHTML = filtered.length ? artistGroupHtml(filtered) : `<p class="mini">曲がありません。</p>`;
  qs("#songList2").innerHTML = listHtml;
}

function latestSongsHtml(items) {
  const latest = [...(items || [])]
    .sort((a, b) => new Date(b.created_at || b.updated_at || 0) - new Date(a.created_at || a.updated_at || 0))
    .slice(0, 5);

  if (!latest.length) return `<p class="mini">まだ曲が追加されていません。</p>`;

  return latest.map(s => {
    const vocabCount = vocab.filter(v => v.song_id === s.id).length;
    const addedAt = s.created_at || s.updated_at;
    return `
      <button class="latest-song" data-action="open-song" data-id="${escAttr(s.id)}">
        <div class="latest-song-main">
          <h4>${esc(s.title || "Untitled")}</h4>
          <div class="muted">${esc(s.artist_name || "アーティスト未設定")}</div>
          <div>
            ${s.genre ? `<span class="tag">${esc(s.genre)}</span>` : ""}
            ${s.difficulty ? `<span class="tag">${esc(s.difficulty)}</span>` : ""}
            ${vocabCount ? `<span class="tag">保存単語 ${vocabCount}語</span>` : ""}
          </div>
          <div class="mini">追加: ${esc(userDisplayName(s.created_by || ""))} / ${fmt(addedAt)}</div>
        </div>
        <span class="latest-open">開く</span>
      </button>`;
  }).join("");
}

function artistGroupHtml(items) {
  const groups = items.reduce((acc, song) => {
    const artist = (song.artist_name || "アーティスト未設定").trim() || "アーティスト未設定";
    if (!acc[artist]) acc[artist] = [];
    acc[artist].push(song);
    return acc;
  }, {});
  return Object.keys(groups).sort((a, b) => a.localeCompare(b)).map((artist, index) => `
    <details class="artist-group" ${index === 0 ? "open" : ""}>
      <summary><span>${esc(artist)}</span><span class="tag">${groups[artist].length}曲</span></summary>
      <div class="artist-songs">${groups[artist].map(songListItem).join("")}</div>
    </details>`).join("");
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
  const manualDetailLines = parseManualAnalysis(s.manual_analysis || "");
  const lines = manualDetailLines.length
    ? manualDetailLines
    : Array.isArray(s.lyric_lines) ? s.lyric_lines.map((line, i) => normalizeAIAnalysisLine(line, i)) : [];
  const youtubeThumb = getYoutubeThumbnail(s.youtube_url);
  const spotifyUrl = resolveSpotifyUrl(s);
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
          <div class="song-meta-tags">
            <span class="tag">ジャンル: ${esc(s.genre || "未設定")}</span>
            <span class="tag">難易度: ${esc(s.difficulty || "初級")}</span>
          </div>
          <p>${esc(getDisplayArtistProfile(s))}</p>
          <div class="actions media-actions">
            ${s.youtube_url ? `<a class="btn" href="${escAttr(s.youtube_url)}" target="_blank" rel="noopener">YouTube</a>` : `<button class="btn secondary" disabled>YouTube未登録</button>`}
            ${s.apple_music_url ? `<a class="btn secondary" href="${escAttr(s.apple_music_url)}" target="_blank" rel="noopener">Apple Music</a>` : `<button class="btn secondary" disabled>Apple Music未登録</button>`}
            ${spotifyUrl ? `<a class="btn secondary" href="${escAttr(spotifyUrl)}" target="_blank" rel="noopener">Spotify</a>` : `<button class="btn secondary" disabled>Spotify未登録</button>`}
            <button class="btn secondary" data-action="refresh-metadata" data-id="${escAttr(s.id)}" type="button">曲情報を更新</button>
            <button class="btn green" data-action="refresh-analysis" data-id="${escAttr(s.id)}" type="button">分析レビューを更新</button>
          </div>
          <div class="speech-panel">
            <div class="speech-title">読み上げ</div>
            <div class="actions speech-actions">
              <button class="btn blue" data-action="speak" data-rate="1" data-text="${escAttr(lines.map(l => l.lyric).join(". "))}">再生</button>
              <button class="btn secondary" data-action="speech-pause" type="button">一時停止 / 再開</button>
              <button class="btn red" data-action="speech-stop" type="button">停止</button>
              <button class="btn secondary" data-action="speech-rate" data-rate="1" data-text="${escAttr(lines.map(l => l.lyric).join(". "))}" type="button">1.0倍</button>
              <button class="btn secondary" data-action="speech-rate" data-rate="0.5" data-text="${escAttr(lines.map(l => l.lyric).join(". "))}" type="button">0.5倍</button>
              <button class="btn secondary" data-action="speech-rate" data-rate="0.35" data-text="${escAttr(lines.map(l => l.lyric).join(". "))}" type="button">0.35倍</button>
            </div>
            <p class="mini">英語が速い場合は0.5倍、かなりゆっくり確認したい場合は0.35倍を使ってください。</p>
          </div>
        </div>
      </div>
    </div>
    <div class="card">
      <h3 class="section-title">歌詞を探す</h3>
      <div class="actions">
        <a class="btn secondary" href="${escAttr(lyricLinks.geniusDirect)}" target="_blank" rel="noopener">Genius歌詞ページ候補</a>
        <a class="btn secondary" href="${escAttr(lyricLinks.genius)}" target="_blank" rel="noopener">Genius検索</a>
        <a class="btn secondary" href="${escAttr(lyricLinks.google)}" target="_blank" rel="noopener">Googleで歌詞を探す</a>
        <a class="btn secondary" href="${escAttr(lyricLinks.youtube)}" target="_blank" rel="noopener">YouTubeで歌詞動画を探す</a>
      </div>
      <p class="mini">歌詞本文は自動取得せず、リンク先で確認してから手入力してください。</p>
    </div>
    <div class="card">
      <h3 class="section-title">アーティスト情報</h3>
      <div id="artistInfo" class="mini">アーティスト情報を取得中...</div>
    </div>
    <div class="card"><h3 class="section-title">歌詞解説</h3><p class="mini">まず通常の歌詞解説を表示します。単語に触れると意味・使い方・例文が出ます。クリックすると単語帳追加画面が開きます。</p><div class="actions" style="margin:12px 0 16px"><button class="btn green" data-action="refresh-analysis" data-id="${escAttr(s.id)}" type="button">この曲の分析レビューを更新</button></div>${lines.map(l => lineHtml(l, s.id, s.title, s.artist_name)).join("") || "<p class='mini'>歌詞がありません。</p>"}</div>
    ${s.manual_analysis ? `<div class="card"><details class="manual-analysis-toggle"><summary>ChatGPT解析結果を開く</summary><p class="mini">ChatGPTで作成した解析結果です。必要なときだけ開いて確認できます。</p><div class="manual-analysis">${nl(s.manual_analysis)}</div></details></div>` : ""}`;
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
  const genreText = info.genre ? `<p class="mini"><b>ジャンル候補：</b>${esc(info.genre)}${info.genreSource ? ` / ${esc(info.genreSource)}` : ""}</p>` : "";
  box.innerHTML = `
    <div class="artist-card">
      ${info.image ? `<img class="artist-img" src="${escAttr(info.image)}" alt="${escAttr(info.name)}">` : ""}
      <div>
        <h4 style="margin:0 0 8px">${esc(info.name)}</h4>
        <p>${esc(info.extract)}</p>
        ${genreText}
        ${info.url ? `<a class="dict-link" href="${escAttr(info.url)}" target="_blank" rel="noopener">Wikipediaで見る</a>` : ""}
      </div>
    </div>`;
}


function mergeLineWords(lyric, manualWords = []) {
  const map = new Map();

  (Array.isArray(manualWords) ? manualWords : []).forEach(item => {
    const word = normalizeWord(item?.word || "");
    if (!word || STOP_WORDS.has(word)) return;
    map.set(word, {
      word,
      meaning: item.meaning || getWordInfo(word).meaning,
      usage: item.usage || getWordUsage(word).usage,
      example: item.example || getWordUsage(word).example,
      example_ja: item.example_ja || item.ja || getWordUsage(word).ja
    });
  });

  getWords(lyric)
    .map(normalizeWord)
    .filter(w => w && w.length >= 3 && !STOP_WORDS.has(w) && isLearningVocabularyWord(w))
    .forEach(word => {
      if (map.has(word)) return;
      const info = getWordInfo(word);
      const usage = getWordUsage(word);
      map.set(word, {
        word,
        meaning: info.meaning,
        usage: usage.usage || info.memo || "",
        example: usage.example || "",
        example_ja: usage.ja || ""
      });
    });

  return [...map.values()].filter(w => w.word && w.meaning && isLearningVocabularyWord(w.word));
}

function isLearningVocabularyWord(word) {
  const key = normalizeWord(word).replace(/'/g, "");
  return LEARNING_WORDS.has(key);
}

function lineHtml(line, songId, songTitle, artistName) {
  const lyric = String(line?.lyric || "").trim();
  const g = normalizeAnalysisLine(line);
  const translation = g.translation || translateLine(lyric);
  const notes = (g.notes && g.notes.length ? g.notes : grammarNotes(lyric, g.points || [])).slice(0, 5);
  const words = mergeLineWords(lyric, g.words).slice(0, 10);
  const examples = (g.examples && g.examples.length ? g.examples : similarExamples(lyric)).slice(0, 3);
  return `<div class="lyrics-line lyrics-line-simple">
    <div class="en">${wordify(lyric, songId, line.line_no, songTitle, artistName, words)}</div>
    <div class="jp"><b>自然な和訳：</b>${esc(translation)}</div>
    <details class="line-extra">
      <summary>文法ポイントを表示</summary>
      <div class="mini compact-analysis">
        <b>文法ポイント（要約）</b>
        <ul class="grammar-list">
          ${(notes.length ? notes : ["重要な語順や表現だけを確認します。"]).map(note => `<li>${esc(note)}</li>`).join("")}
        </ul>
        <b>例文</b><br>${nl(formatExamples(examples))}
      </div>
    </details>
    <div class="actions" style="margin-top:12px">
      <button class="btn secondary" data-action="speak" data-rate="1" data-text="${escAttr(lyric)}">再生</button>
      <button class="btn secondary" data-action="speech-pause" type="button">一時停止 / 再開</button>
      <button class="btn red" data-action="speech-stop" type="button">停止</button>
      <button class="btn secondary" data-action="speech-rate" data-rate="0.5" data-text="${escAttr(lyric)}" type="button">0.5倍</button>
      <button class="btn secondary" data-action="speech-rate" data-rate="0.35" data-text="${escAttr(lyric)}" type="button">0.35倍</button>
      <button class="btn green" type="button">単語をクリックして単語帳へ</button>
    </div>
  </div>`;
}

function wordify(text, songId, lineNo, songTitle, artistName, wordItems = []) {
  const wordMap = new Map((wordItems || []).map(item => [normalizeWord(item.word || ""), item]));
  return tokenizePreservingSpace(text).map(part => {
    if (/^[A-Za-z][A-Za-z'’]*$/.test(part)) {
      const clean = normalizeWord(part);
      const item = wordMap.get(clean) || {};
      if (!isLearningVocabularyWord(clean)) {
        return `<span class="word plain-word">${esc(part)}</span>`;
      }
      return `<span class="word" tabindex="0" data-word="${escAttr(clean)}" data-song-id="${escAttr(songId)}" data-line-no="${lineNo}" data-song-title="${escAttr(songTitle || "")}" data-artist-name="${escAttr(artistName || "")}" data-meaning="${escAttr(item.meaning || "")}" data-usage="${escAttr(item.usage || "")}" data-example="${escAttr(item.example || "")}" data-example-ja="${escAttr(item.example_ja || item.ja || "")}">${esc(part)}</span>`;
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
  qs("#artistProfile").value = getJapaneseArtistProfile(guess.artist, artistInfo?.extract || guess.profile || "");
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
  qs("#artistProfile").value = getJapaneseArtistProfile(g.artist || "このアーティスト", g.profile || "");
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

function getJapaneseArtistProfile(artistName, rawProfile = "") {
  const artist = (artistName || "このアーティスト").trim();
  const profile = String(rawProfile || "").trim();

  // 日本語プロフィールが既に入っている場合だけ、そのまま使います。
  if (profile && hasJapaneseText(profile) && !looksEnglishProfile(profile)) {
    return profile;
  }

  // 英語Wikipediaの本文や英語テキストは画面に出さず、
  // アプリ内の日本語紹介文に必ず置き換えます。
  return makeArtistProfile(artist);
}

function getDisplayArtistProfile(song) {
  return getJapaneseArtistProfile(song?.artist_name || "このアーティスト", song?.artist_profile || "");
}

async function fetchArtistInfo(artistName) {
  const rawName = (artistName || "").trim();
  if (!rawName) return null;
  const candidates = uniqueTextValues([
    rawName,
    titleCaseArtist(rawName),
    rawName.replace(/\s+-\s+Topic$/i, ""),
    rawName.replace(/VEVO$/i, "")
  ]);

  for (const lang of ["ja", "en"]) {
    for (const candidate of candidates) {
      const summary = await fetchWikipediaSummary(candidate, lang);
      if (!summary) continue;
      const genreInfo = await fetchGenreInfo(summary.title || candidate, summary.extract || "");
      const isJapanese = lang === "ja" || hasJapaneseText(summary.extract || "");
      return {
        name: summary.title || candidate,
        extract: isJapanese ? summary.extract : getJapaneseArtistProfile(summary.title || candidate, summary.extract),
        image: summary.thumbnail?.source || summary.originalimage?.source || "",
        url: summary.content_urls?.desktop?.page || summary.content_urls?.mobile?.page || "",
        genre: genreInfo.genre || inferGenreFromText(summary.extract || ""),
        genreSource: genreInfo.source || (inferGenreFromText(summary.extract || "") ? "Wikipedia概要から推定" : "")
      };
    }
  }
  return null;
}

async function fetchWikipediaSummary(name, lang = "ja") {
  const title = String(name || "").trim();
  if (!title) return null;
  const direct = await fetchWikipediaSummaryByTitle(title, lang);
  if (direct) return direct;
  try {
    const searchUrl = `https://${lang}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(title)}&format=json&origin=*`;
    const searchRes = await fetch(searchUrl);
    if (!searchRes.ok) return null;
    const searchJson = await searchRes.json();
    const best = (searchJson.query?.search || []).find(x => /band|artist|singer|musician|グループ|バンド|歌手|音楽/i.test(`${x.title} ${stripHtml(x.snippet || "")}`)) || searchJson.query?.search?.[0];
    if (!best?.title) return null;
    return await fetchWikipediaSummaryByTitle(best.title, lang);
  } catch (e) {
    console.warn("Wikipedia search failed", e);
    return null;
  }
}

async function fetchWikipediaSummaryByTitle(title, lang = "ja") {
  try {
    const res = await fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
    if (!res.ok) return null;
    const json = await res.json();
    if (json.type === "disambiguation" || !json.extract) return null;
    return json;
  } catch (e) {
    console.warn("Wikimedia summary failed", e);
    return null;
  }
}

async function fetchGenreInfo(artistName, fallbackText = "") {
  const fallbackGenre = inferGenreFromText(fallbackText);
  try {
    const searchUrl = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(artistName)}&language=en&format=json&origin=*`;
    const searchRes = await fetch(searchUrl);
    if (!searchRes.ok) return { genre: fallbackGenre, source: fallbackGenre ? "Wikipedia概要から推定" : "" };
    const searchJson = await searchRes.json();
    const entityId = searchJson.search?.[0]?.id;
    if (!entityId) return { genre: fallbackGenre, source: fallbackGenre ? "Wikipedia概要から推定" : "" };
    const entityUrl = `https://www.wikidata.org/wiki/Special:EntityData/${encodeURIComponent(entityId)}.json`;
    const entityRes = await fetch(entityUrl);
    if (!entityRes.ok) return { genre: fallbackGenre, source: fallbackGenre ? "Wikipedia概要から推定" : "" };
    const entityJson = await entityRes.json();
    const claims = entityJson.entities?.[entityId]?.claims?.P136 || [];
    const labels = claims.map(claim => {
      const id = claim.mainsnak?.datavalue?.value?.id;
      if (!id) return "";
      const entity = entityJson.entities?.[id];
      return entity?.labels?.ja?.value || entity?.labels?.en?.value || "";
    }).filter(Boolean);
    if (labels.length) return { genre: labels.slice(0, 4).join(" / "), source: "Wikidata" };
  } catch (e) {
    console.warn("Wikidata genre lookup failed", e);
  }
  return { genre: fallbackGenre, source: fallbackGenre ? "Wikipedia概要から推定" : "" };
}

function inferGenreFromText(text = "") {
  const value = String(text || "").toLowerCase();
  const genres = [];
  const rules = [
    ["post-hardcore", "Post-hardcore"],
    ["metalcore", "Metalcore"],
    ["alternative rock", "Alternative rock"],
    ["emo", "Emo"],
    ["hard rock", "Hard rock"],
    ["rock band", "Rock"],
    ["pop punk", "Pop punk"],
    ["punk rock", "Punk rock"],
    ["nu metal", "Nu metal"],
    ["hip hop", "Hip hop"],
    ["r&b", "R&B"],
    ["pop", "Pop"],
    ["electronic", "Electronic"]
  ];
  rules.forEach(([needle, label]) => { if (value.includes(needle) && !genres.includes(label)) genres.push(label); });
  return genres.slice(0, 4).join(" / ");
}

function titleCaseArtist(name) {
  return String(name || "").toLowerCase().replace(/\b[a-z]/g, c => c.toUpperCase());
}

function uniqueTextValues(values) {
  const seen = new Set();
  return values.map(v => String(v || "").trim()).filter(v => {
    const key = v.toLowerCase();
    if (!v || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function stripHtml(value) {
  return String(value || "").replace(/<[^>]*>/g, " ");
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

function normalizeMusicSearchText(value, kind = "") {
  let text = String(value || "")
    .replace(/[’‘´`]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\[[^\]]*]/g, " ")
    .replace(/\([^)]*(official|lyrics?|audio|video|mv|hd|4k|visualizer|live|remaster|remastered)[^)]*\)/ig, " ")
    .replace(/\b(official|music video|lyric video|lyrics|audio|visualizer|hd|4k|remaster|remastered)\b/ig, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (kind === "artist") {
    text = text
      .replace(/\s*-\s*Topic$/i, "")
      .replace(/VEVO$/i, "")
      .trim();

    // Spotify検索では全部大文字のアーティスト名より、通常の表記の方が拾いやすいことがあります。
    if (/^[A-Z0-9 &'’.-]+$/.test(text) && /[A-Z]/.test(text)) {
      text = text.toLowerCase().replace(/\b([a-z])/g, m => m.toUpperCase());
    }
  }

  return text;
}

function makeSpotifySearchUrl(title, artist) {
  const cleanTitle = normalizeMusicSearchText(title, "title");
  const cleanArtist = normalizeMusicSearchText(artist, "artist");

  if (cleanTitle && cleanArtist) {
    const filteredQuery = `track:"${cleanTitle}" artist:"${cleanArtist}"`;
    return `https://open.spotify.com/search/${encodeURIComponent(filteredQuery)}`;
  }

  const fallbackQuery = [cleanTitle, cleanArtist].filter(Boolean).join(" ").trim();
  return fallbackQuery ? `https://open.spotify.com/search/${encodeURIComponent(fallbackQuery)}` : "";
}

function isSpotifyDirectUrl(url) {
  return /^https?:\/\/open\.spotify\.com\/(track|album|artist|playlist)\//i.test(String(url || "").trim());
}

function resolveSpotifyUrl(song) {
  const saved = String(song?.spotify_url || "").trim();

  // 直接曲URLなどが保存されている場合は、それを優先します。
  if (isSpotifyDirectUrl(saved)) return saved;

  // 古い検索URLが保存されている場合は、より精度の高い検索URLを作り直します。
  return makeSpotifySearchUrl(song?.title || "", song?.artist_name || "") || saved;
}

function makeLyricsSearchLinks(title, artist) {
  const q = [artist, title].filter(Boolean).join(" ").trim();
  const enc = encodeURIComponent(q);
  const plus = encodeURIComponent(`${q} lyrics`);
  const geniusDirect = makeGeniusLyricsUrl(title, artist);
  return {
    google: q ? `https://www.google.com/search?q=${plus}` : "",
    geniusDirect,
    genius: q ? `https://genius.com/search?q=${enc}` : "",
    youtube: q ? `https://www.youtube.com/results?search_query=${plus}` : ""
  };
}

function makeGeniusLyricsUrl(title, artist) {
  const cleanTitle = cleanSongTitleForGenius(title);
  const cleanArtist = cleanArtistForGenius(artist);
  if (!cleanTitle || !cleanArtist) return "";
  return `https://genius.com/${toGeniusSlug(`${cleanArtist} ${cleanTitle}`)}-lyrics`;
}

function cleanSongTitleForGenius(title) {
  return String(title || "")
    .replace(/\([^)]*(official|lyrics?|audio|video|mv|hd|4k)[^)]*\)/ig, " ")
    .replace(/\[[^\]]*(official|lyrics?|audio|video|mv|hd|4k)[^\]]*\]/ig, " ")
    .replace(/Official|Music Video|Lyric Video|Lyrics|Audio/ig, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanArtistForGenius(artist) {
  return String(artist || "")
    .replace(/\s*VEVO$/i, "")
    .replace(/\s*-\s*Topic$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function toGeniusSlug(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[’']/g, "")
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeLyricsLinks(value) {
  if (typeof value === "string") {
    try { return normalizeLyricsLinks(JSON.parse(value)); } catch { return makeLyricsSearchLinks("", ""); }
  }
  const fallbackDirect = value?.geniusDirect || value?.genius_url || "";
  return {
    google: value?.google || "",
    geniusDirect: fallbackDirect,
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
      <a class="btn secondary" href="${escAttr(links.geniusDirect)}" target="_blank" rel="noopener">Genius歌詞ページ候補</a>
      <a class="btn secondary" href="${escAttr(links.genius)}" target="_blank" rel="noopener">Genius検索</a>
      <a class="btn secondary" href="${escAttr(links.google)}" target="_blank" rel="noopener">Googleで歌詞を探す</a>
      <a class="btn secondary" href="${escAttr(links.youtube)}" target="_blank" rel="noopener">YouTubeで歌詞動画を探す</a>`;
  }
  if (showToast) toast("歌詞確認リンクを作成しました");
  return links;
}

function buildChatGPTPrompt(title, artist, lyrics) {
  return `あなたは日本人向けの洋楽英語学習アプリ「Lyrics English」の英語教師です。

以下の洋楽歌詞を、英語学習用に解析してください。

目的：
・自然な日本語訳を作る
・使われている文法を短く説明する
・各英文ごとに、英検準2級以上を目安に学習価値の高い重要単語だけを1〜5個選び、意味、使い方、例文を必ず出す
・初心者にもわかるようにする
・説明は長すぎず、アプリに表示しやすい形にする

曲名：
${title || "未入力"}

アーティスト：
${artist || "未入力"}

歌詞：
${lyrics || "未入力"}

出力ルール：
1行ごとに解析してください。
説明は以下の形式にしてください。

【英文】
原文の1行

【自然な和訳】
自然な日本語訳

【文法ポイント】
・文法名：短い説明
・文法名：短い説明

【単語の意味】
・単語：意味
　使い方：よく使う形
　例文：英語例文
　訳：日本語訳

【単語データ】
word: 単語
meaning: 日本語の意味
usage: よく使う形・文法的な使い方
example: 英語例文
example_ja: 例文の日本語訳

【例文】
・英語例文 / 日本語訳

注意：
・文構造を細かく分解しすぎないでください
・主語、動詞、目的語のような説明は必要な場合だけにしてください
・不定詞、動名詞、現在分詞、前置詞、熟語など、実際に使われている文法を優先してください
・直訳ではなく、歌詞として自然な日本語にしてください
・【単語の意味】は英検準2級以上を目安に、学習価値の高い単語だけを書いてください。the / you / said / like / I などの基本語は原則除外してください
・【単語データ】は必ず word / meaning / usage / example / example_ja の5項目で書いてください。基本語ではなく、英検準2級以上を目安にした重要単語だけにしてください
・アプリは【単語データ】を優先して読み取るため、単語ごとに必ず1セットずつ出してください
・出力はそのままアプリに貼れるように、見やすく整理してください`;
}

function makeChatGPTPrompt() {
  const title = qs("#songTitle")?.value?.trim() || "";
  const artist = qs("#artistName")?.value?.trim() || "";
  const lyrics = normalizeLyricsText(qs("#lyricsRaw")?.value?.trim() || "");
  if (!title || !artist || !lyrics) {
    toast("曲名・アーティスト名・歌詞を入れてから作成してください");
  }
  if (lyrics && qs("#lyricsRaw")?.value?.trim() !== lyrics) qs("#lyricsRaw").value = lyrics;
  qs("#chatgptPrompt").value = buildChatGPTPrompt(title, artist, lyrics);
  toast("ChatGPT用プロンプトを作成しました");
}

async function copyChatGPTPrompt() {
  const promptBox = qs("#chatgptPrompt");
  if (!promptBox.value.trim()) makeChatGPTPrompt();
  try {
    await navigator.clipboard.writeText(promptBox.value);
    toast("プロンプトをコピーしました。ChatGPTに貼り付けてください");
  } catch (_) {
    promptBox.select();
    document.execCommand("copy");
    toast("プロンプトをコピーしました");
  }
}

function normalizeLyricsInput() {
  const box = qs("#lyricsRaw");
  if (!box) return;
  const original = box.value.trim();
  if (!original) { toast("歌詞を貼り付けてください"); return; }
  const normalized = normalizeLyricsText(original);
  box.value = normalized;
  const count = splitLyricsLines(normalized).length;
  toast(`歌詞を${count}行に補正しました`);
}

function normalizeLyricsText(raw) {
  const text = String(raw || "")
    .replace(/\r/g, "")
    .replace(/[’‘´`]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\u00a0/g, " ")
    .trim();
  if (!text) return "";

  const existingLines = text.split(/\n+/).map(cleanLyricLine).filter(Boolean);
  if (existingLines.length >= 2) return existingLines.join("\n");

  return splitCollapsedLyrics(text).join("\n");
}

function cleanLyricLine(line) {
  return String(line || "")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.!?;:])/g, "$1")
    .trim();
}

function splitLyricsLines(text) {
  return normalizeLyricsText(text).split(/\n+/).map(cleanLyricLine).filter(Boolean);
}

function splitCollapsedLyrics(text) {
  let t = cleanLyricLine(text);
  if (!t) return [];

  // 文末記号がある場合は、まずそこで自然に分けます。
  t = t.replace(/([.!?])\s+(?=[A-Z0-9])/g, "$1\n");

  // 歌詞でよくある「大文字で始まる次のフレーズ」を行頭にします。
  const starters = [
    "Remember", "Broke", "Nothin'", "Nothing", "Tomorrow", "Beat", "Every",
    "The sticks", "The stones", "Built", "So you", "To cry", "You are",
    "I will", "I was", "I am", "I'm", "Cause", "'cause", "Because"
  ];
  starters.forEach(starter => {
    const escaped = starter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`\\s+(${escaped}\\b)`, "g");
    t = t.replace(re, "\n$1");
  });

  let lines = t.split(/\n+/).map(cleanLyricLine).filter(Boolean);

  // まだ長すぎる行は、カンマ・接続語・繰り返しフレーズで追加分割します。
  lines = lines.flatMap(line => splitLongLyricLine(line));

  // 極端に短い記号だけの行を除外し、行番号付き解析しやすい形に整えます。
  return lines.map(cleanLyricLine).filter(line => /[A-Za-z0-9]/.test(line));
}

function splitLongLyricLine(line) {
  const maxLen = 92;
  if (line.length <= maxLen) return [line];

  let t = line
    .replace(/,\s+(?=(?:and|but|so|cause|because|tomorrow|every|the|you|i)\b)/ig, ",\n")
    .replace(/\s+(?=(?:So you|Tomorrow|Every wound|Every scar|Beat me|The sticks|Built me|You are|To cry)\b)/g, "\n");

  let parts = t.split(/\n+/).map(cleanLyricLine).filter(Boolean);
  if (parts.every(p => p.length <= maxLen)) return parts;

  const result = [];
  parts.forEach(part => {
    if (part.length <= maxLen) {
      result.push(part);
      return;
    }
    const words = part.split(/\s+/);
    let current = "";
    words.forEach(word => {
      const next = current ? `${current} ${word}` : word;
      if (next.length > maxLen && current) {
        result.push(current);
        current = word;
      } else {
        current = next;
      }
    });
    if (current) result.push(current);
  });
  return result;
}

async function analyzeLyrics() {
  const originalRaw = qs("#lyricsRaw").value.trim();
  if (!originalRaw) { toast("歌詞を貼り付けてください"); return; }

  const raw = normalizeLyricsText(originalRaw);
  if (raw !== originalRaw) {
    qs("#lyricsRaw").value = raw;
    toast("歌詞を1行ずつに補正しました");
  }

  qs("#lyricsLinksPreview").style.display = "none";
  qs("#lyricsLinksBox").innerHTML = "";

  const manualText = qs("#manualAnalysis")?.value?.trim() || "";
  const manualLines = parseManualAnalysis(manualText);
  if (manualLines.length) {
    currentAnalysis = manualLines;
    qs("#analysisPreview").innerHTML = currentAnalysis.map(l => lineHtml(l, "preview", "", "")).join("");
    toast("ChatGPT解析結果を分析レビューに反映しました");
    return;
  }

  qs("#analysisPreview").innerHTML = "<p class='mini'>AI解析中です。歌詞を1行ずつ解析しています...</p>";
  const title = qs("#songTitle")?.value?.trim() || "";
  const artist = qs("#artistName")?.value?.trim() || "";
  try {
    currentAnalysis = await analyzeLyricsWithAI(raw, title, artist);
    qs("#analysisPreview").innerHTML = currentAnalysis.map(l => lineHtml(l, "preview", "", "")).join("");
    toast("AI解析が完了しました");
  } catch (error) {
    console.error("AI analysis failed", error);
    currentAnalysis = splitLyricsLines(raw).map((line, i) => makeLine(line, i + 1)).filter(l => l.lyric);
    qs("#analysisPreview").innerHTML = currentAnalysis.map(l => lineHtml(l, "preview", "", "")).join("");
    toast("AI解析に失敗しました。1行ずつの簡易解析で表示します: " + (error.message || "不明なエラー"));
  }
}

async function analyzeLyricsWithAI(raw, title = "", artist = "") {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lyrics: raw, title, artist })
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.error || json.message || "AI API error");
  }
  const lines = Array.isArray(json.lines) ? json.lines : [];
  if (!lines.length) throw new Error("AI解析結果が空でした");
  return lines.map((line, index) => normalizeAIAnalysisLine(line, index)).filter(l => l.lyric);
}

function parseManualAnalysis(text) {
  const raw = String(text || "").trim();
  if (!raw) return [];

  const normalized = raw.replace(/\r\n/g, "\n");
  const blocks = normalized
    .split(/(?=【(?:英文|英語|原文)】)/g)
    .map(b => b.trim())
    .filter(b => /【(?:英文|英語|原文)】/.test(b));

  const lines = [];
  blocks.forEach((block, index) => {
    const lyric = extractManualSection(block, "英文").split(/\n/).map(x => x.trim()).filter(Boolean)[0] || "";
    if (!lyric) return;
    const translation = extractManualSection(block, "自然な和訳").split(/\n/).map(x => x.trim()).filter(Boolean)[0] || "";
    const grammarText = extractManualSection(block, "文法ポイント");
    const wordsText = extractManualSection(block, "単語データ") || extractManualSection(block, "単語の意味") || extractLikelyWordLines(block);
    const examplesText = extractManualSection(block, "例文");

    const notes = parseBulletLines(grammarText).map(item => item.replace(/^・\s*/, "").trim()).filter(Boolean);
    const wordItems = parseManualWords(wordsText);
    const examples = parseBulletLines(examplesText).map(item => item.replace(/^・\s*/, "").trim()).filter(Boolean);
    const fixedTranslation = cleanTranslation(translation, lyric) || translateLine(lyric);

    lines.push({
      line_no: index + 1,
      lyric,
      translation: fixedTranslation,
      grammar: {
        translation: fixedTranslation,
        points: notes.map(note => note.split(/[：:]/)[0].trim()).filter(Boolean),
        notes: notes.length ? notes : grammarNotesFromManualWords(wordItems, lyric),
        words: wordItems.length ? wordItems : vocabularyItems(lyric).slice(0, 6),
        examples: examples.length ? examples : similarExamples(lyric)
      },
      vocabulary: wordItems.map(w => `・${w.word}: ${w.meaning}`).join("\n"),
      preposition: "ChatGPT手動解析"
    });
  });

  return lines;
}

function manualSectionAliases(label) {
  const map = {
    "英文": ["英文", "英語", "原文"],
    "自然な和訳": ["自然な和訳", "和訳", "日本語訳", "自然な日本語訳"],
    "文法ポイント": ["文法ポイント", "使われている文法", "文法", "文法解説"],
    "単語の意味": ["単語の意味", "重要単語", "単語", "語彙"],
    "単語データ": ["単語データ", "word data", "vocabulary data"],
    "例文": ["例文", "類似例文"]
  };
  return map[label] || [label];
}

function extractManualSection(block, label) {
  const allLabels = [
    "英文", "英語", "原文",
    "自然な和訳", "和訳", "日本語訳", "自然な日本語訳",
    "文法ポイント", "使われている文法", "文法", "文法解説",
    "単語の意味", "重要単語", "単語", "語彙", "単語データ", "word data", "vocabulary data",
    "例文", "類似例文"
  ];
  const aliases = manualSectionAliases(label);
  let start = -1;
  let used = "";
  for (const alias of aliases) {
    const pos = block.indexOf(`【${alias}】`);
    if (pos >= 0 && (start < 0 || pos < start)) {
      start = pos;
      used = alias;
    }
  }
  if (start < 0) return "";
  const bodyStart = start + `【${used}】`.length;
  let end = block.length;
  allLabels.forEach(other => {
    if (other === used) return;
    const pos = block.indexOf(`【${other}】`, bodyStart);
    if (pos >= 0 && pos < end) end = pos;
  });
  return block.slice(bodyStart, end).trim();
}

function parseBulletLines(text) {
  return String(text || "")
    .split(/\n+/)
    .map(line => line.trim())
    .filter(Boolean)
    .filter(line => !/^使い方[:：]|^例文[:：]|^訳[:：]/.test(line));
}


function extractLikelyWordLines(block) {
  return String(block || "")
    .split(/\n+/)
    .map(line => line.trim())
    .filter(line => /^[-・*]?\s*[A-Za-z][A-Za-z'’\-]*\s*[：:\-–—]\s*[^A-Za-z]+/.test(line))
    .join("\n");
}

function parseManualWords(text) {
  const rows = String(text || "")
    .replace(/\r\n/g, "\n")
    .split(/\n+/)
    .map(line => line.trim())
    .filter(Boolean);

  const words = [];
  let current = null;

  function pushCurrent() {
    if (!current) return;
    current.word = normalizeWord(current.word || "");
    current.meaning = String(current.meaning || "").trim();
    current.usage = String(current.usage || "").trim();
    current.example = String(current.example || "").trim();
    current.example_ja = String(current.example_ja || current.ja || "").trim();
    if (current.word && current.meaning) words.push(current);
  }

  rows.forEach(row => {
    const cleaned = row
      .replace(/^[-・*]\s*/, "")
      .replace(/^【.+?】\s*/, "")
      .replace(/^\d+[.)、]\s*/, "")
      .trim();

    if (!cleaned) return;

    // 専用フォーマット: word / meaning / usage / example / example_ja
    const kv = /^(word|単語|meaning|意味|usage|使い方|用法|example|例文|example_ja|訳|日本語訳|例文訳)\s*[：:]\s*(.+)$/i.exec(cleaned);
    if (kv) {
      const key = kv[1].toLowerCase();
      const value = kv[2].trim();
      if (key === "word" || key === "単語") {
        pushCurrent();
        current = { word: value, meaning: "", usage: "", example: "", example_ja: "" };
        return;
      }
      if (!current) current = { word: "", meaning: "", usage: "", example: "", example_ja: "" };
      if (key === "meaning" || key === "意味") current.meaning = value;
      else if (key === "usage" || key === "使い方" || key === "用法") current.usage = value;
      else if (key === "example" || key === "例文") current.example = value;
      else if (key === "example_ja" || key === "訳" || key === "日本語訳" || key === "例文訳") current.example_ja = value;
      return;
    }

    // 既存フォーマット: tired：疲れた
    const colon = /^([A-Za-z][A-Za-z'’\-]*)\s*[：:]\s*(.+)$/.exec(cleaned);
    if (colon) {
      pushCurrent();
      current = {
        word: colon[1],
        meaning: colon[2].trim(),
        usage: "",
        example: "",
        example_ja: ""
      };
      return;
    }

    const dash = /^([A-Za-z][A-Za-z'’\-]*)\s+[-–—]\s+(.+)$/.exec(cleaned);
    if (dash) {
      pushCurrent();
      current = {
        word: dash[1],
        meaning: dash[2].trim(),
        usage: "",
        example: "",
        example_ja: ""
      };
      return;
    }

    const space = /^([A-Za-z][A-Za-z'’\-]*)\s+([^A-Za-z].+)$/.exec(cleaned);
    if (space && !/^(I|You|He|She|It|We|They)$/i.test(space[1])) {
      pushCurrent();
      current = {
        word: space[1],
        meaning: space[2].trim(),
        usage: "",
        example: "",
        example_ja: ""
      };
      return;
    }

    // 直前の単語に対する補足行として扱う
    if (current && !current.usage && /使/.test(cleaned)) current.usage = cleaned;
  });

  pushCurrent();

  const seen = new Set();
  return words
    .map(w => ({ ...w, word: normalizeWord(w.word) }))
    .filter(w => {
      if (!w.word || !w.meaning || STOP_WORDS.has(w.word) || seen.has(w.word) || !isLearningVocabularyWord(w.word)) return false;
      seen.add(w.word);
      return true;
    });
}

function grammarNotesFromManualWords(words, lyric) {
  const base = grammarObject(lyric).notes || [];
  if (base.length) return base;
  return words.slice(0, 3).map(w => `${w.word}: ${w.usage || w.meaning}`);
}

function normalizeAIAnalysisLine(line, index = 0) {
  const lyric = String(line?.lyric || "").trim();
  const grammarItems = Array.isArray(line?.grammar) ? line.grammar : [];
  const wordItems = Array.isArray(line?.words) ? line.words : [];
  const exampleItems = Array.isArray(line?.examples) ? line.examples : [];
  return {
    line_no: Number(line?.line_no) || index + 1,
    lyric,
    translation: cleanTranslation(line?.translation, lyric) || translateLine(lyric),
    grammar: {
      translation: cleanTranslation(line?.translation, lyric) || translateLine(lyric),
      points: grammarItems.map(g => g.name || g.title || "文法").filter(Boolean),
      notes: grammarItems.map(g => `${g.name || "文法"}: ${g.explanation || "この文で使われています。"}`).filter(Boolean),
      words: wordItems.map(w => ({
        word: normalizeWord(w.word || ""),
        meaning: w.meaning || "意味を確認してください",
        usage: w.usage || "",
        example: w.example || "",
        example_ja: w.example_ja || ""
      })).filter(w => w.word),
      examples: exampleItems.map(ex => `${ex.en || ""} / ${ex.ja || ""}`.trim()).filter(Boolean)
    },
    vocabulary: wordItems.map(w => `・${w.word}: ${w.meaning}`).join("\n"),
    preposition: "AI解析済み"
  };
}

function normalizeAnalysisLine(line) {
  const lyric = String(line?.lyric || "").trim();
  if (line?.grammar && typeof line.grammar === "object") {
    const g = line.grammar;
    return {
      translation: cleanTranslation(line.translation || g.translation, lyric) || translateLine(lyric),
      points: Array.isArray(g.points) ? g.points : [],
      notes: Array.isArray(g.notes) ? g.notes : [],
      words: Array.isArray(g.words) ? g.words : [],
      examples: Array.isArray(g.examples) ? g.examples : []
    };
  }
  return grammarObject(lyric);
}

function formatExamples(examples) {
  return (examples || []).map(ex => {
    if (typeof ex === "string") return ex;
    return `${ex.en || ""} / ${ex.ja || ""}`.trim();
  }).filter(Boolean).join("\n");
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
  return `
    <div class="mini compact-analysis">
      <b>自然な和訳</b><br>${esc(g.translation || "和訳を作成できませんでした")}
      <details class="line-extra">
        <summary>文法ポイントを表示</summary>
        <div class="mini compact-analysis">
          <b>文法ポイント（要約）</b>
          <ul class="grammar-list">
            ${(notes.length ? notes : ["この行は、語順と前後の文脈で意味をつかみます。"]).map(note => `<li>${esc(note)}</li>`).join("")}
          </ul>
          <b>例文</b><br>${nl((g.examples || []).slice(0, 2).join("\n"))}
        </div>
      </details>
    </div>`;
}

function normalizeLyricLine(line) {
  // v11: 歌詞サイトやコピペで「I ’ m」のように分かれたアポストロフィーも正規化する。
  return String(line || "")
    .replace(/[’‘´`]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s*'\s*/g, "'")
    .replace(/\bI\s*m\b/gi, "I'm")
    .replace(/\bI\s+am\b/gi, "I am")
    .replace(/\bYou\s*re\b/gi, "you're")
    .replace(/\bWe\s*re\b/gi, "we're")
    .replace(/\bThey\s*re\b/gi, "they're")
    .replace(/\bHe\s*s\b/gi, "he's")
    .replace(/\bShe\s*s\b/gi, "she's")
    .replace(/\bIt\s*s\b/gi, "it's")
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
    "I am tired of being what you want me to be": "あなたが望むような自分でいることに、もう疲れた。",
    "You said I'm like an open ocean": "君は、僕が広い海みたいだと言った。",
    "You said I am like an open ocean": "君は、僕が広い海みたいだと言った。",
    "You said I was like an open ocean": "君は、僕が広い海みたいだと言った。"
  };
  if (exact[normalized]) return exact[normalized];

  if (/^i[' ]?m tired of being what you want me to be$/i.test(normalized) || /tired of being what you want me to be/i.test(normalized)) {
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
  const words = [...new Set(getWords(line).map(normalizeWord).filter(w => w.length >= 3 && !STOP_WORDS.has(w) && isLearningVocabularyWord(w)))].slice(0, 6);
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
  const words = [...new Set(getWords(line).map(normalizeWord).filter(w => w.length >= 3 && !STOP_WORDS.has(w) && isLearningVocabularyWord(w)))].slice(0, 6);
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


function normalizeSongIdentity(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[’‘`´]/g, "'")
    .replace(/\b(?:official|music\s*video|audio|lyrics?|hd|4k|mv)\b/gi, "")
    .replace(/\s*\([^)]*(?:official|music\s*video|audio|lyrics?|hd|4k|mv)[^)]*\)\s*/gi, " ")
    .replace(/\s*\[[^\]]*(?:official|music\s*video|audio|lyrics?|hd|4k|mv)[^\]]*\]\s*/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findDuplicateSongByTitleArtist(title, artistName, ignoreId = "") {
  const titleKey = normalizeSongIdentity(title);
  const artistKey = normalizeSongIdentity(artistName);
  if (!titleKey || !artistKey) return null;

  return (songs || []).find(song => {
    if (!song || String(song.id || "") === String(ignoreId || "")) return false;
    return normalizeSongIdentity(song.title) === titleKey && normalizeSongIdentity(song.artist_name) === artistKey;
  }) || null;
}

async function saveSong() {
  const editId = qs("#editId").value || "";
  const raw = normalizeLyricsText(qs("#lyricsRaw").value.trim());
  qs("#lyricsRaw").value = raw;
  const title = qs("#songTitle").value.trim();
  const artistName = qs("#artistName").value.trim();

  if (!title || !raw) {
    toast("曲名と歌詞は必須です");
    return;
  }

  const duplicate = findDuplicateSongByTitleArtist(title, artistName, editId);
  const existing = editId
    ? (songs || []).find(s => String(s.id) === String(editId))
    : duplicate;
  const id = existing?.id || editId || crypto.randomUUID();

  if (!editId && duplicate) {
    toast("同じ曲が既にあるため、新規追加ではなく既存曲を更新します");
  }
  const manualText = qs("#manualAnalysis")?.value?.trim() || "";
  const manualLines = parseManualAnalysis(manualText);
  if (manualLines.length) {
    currentAnalysis = manualLines;
    qs("#analysisPreview").innerHTML = currentAnalysis.map(l => lineHtml(l, "preview", "", "")).join("");
  }
  const sourceLines = manualLines.length
    ? manualLines
    : currentAnalysis.length
      ? currentAnalysis
      : raw.split(/\n+/).map((line, i) => makeLine(line.trim(), i + 1)).filter(l => l.lyric);

  // AI解析済みデータがある場合はそれを保存する。未解析または古い仮文だけの場合は簡易解析で補完する。
  const lines = sourceLines.map((line, i) => {
    const lyric = String(line?.lyric || line || "").trim();
    if (line?.grammar && typeof line.grammar === "object" && !isPlaceholderTranslation(line?.translation)) {
      return normalizeAIAnalysisLine(line, i);
    }
    return refreshLineAnalysis({ lyric, line_no: Number(line?.line_no) || i + 1 }, i);
  }).filter(l => l.lyric);

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
    artist_profile: getJapaneseArtistProfile(artistName, qs("#artistProfile").value.trim()),
    manual_analysis: qs("#manualAnalysis")?.value?.trim() || "",
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
    manual_analysis: draftBackup.manual_analysis,
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
    "manual_analysis",
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
    manual_analysis: originalPayload.manual_analysis,
    genre: originalPayload.genre,
    difficulty: originalPayload.difficulty,
    updated_by: originalPayload.updated_by,
    created_by: originalPayload.created_by,
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
  qs("#spotifyUrl").value = resolveSpotifyUrl(s);
  qs("#coverArtUrl").value = s.cover_art_url || "";
  createLyricsLinksFromForm(false);
  qs("#genre").value = s.genre || "";
  qs("#difficulty").value = s.difficulty || "初級";
  qs("#artistProfile").value = getJapaneseArtistProfile(s.artist_name || "このアーティスト", s.artist_profile || "");
  qs("#manualAnalysis").value = s.manual_analysis || "";
  qs("#chatgptPrompt").value = buildChatGPTPrompt(s.title || "", s.artist_name || "", s.lyrics_raw || "");
  qs("#lyricsRaw").value = s.lyrics_raw || "";
  const manualLines = parseManualAnalysis(s.manual_analysis || "");
  currentAnalysis = manualLines.length
    ? manualLines
    : Array.isArray(s.lyric_lines) ? s.lyric_lines.map((line, i) => normalizeAIAnalysisLine(line, i)) : [];
  qs("#lyricsLinksPreview").style.display = "none";
  qs("#lyricsLinksBox").innerHTML = "";
  qs("#analysisPreview").innerHTML = currentAnalysis.map(l => lineHtml(l, s.id, s.title, s.artist_name)).join("");
  showScreen("add");
}

async function refreshSongAnalysis(id) {
  const song = songs.find(x => x.id === id);
  if (!song) return;

  const originalRaw = song.lyrics_raw || (Array.isArray(song.lyric_lines) ? song.lyric_lines.map(l => l.lyric).filter(Boolean).join("\n") : "");
  const raw = normalizeLyricsText(originalRaw || "");
  if (!raw.trim()) {
    toast("更新できる歌詞本文がありません。編集画面で歌詞を入力してください");
    return;
  }

  toast("分析レビューを更新中です...");
  let lines = [];
  let usedManual = false;
  let usedAI = true;
  const manualLines = parseManualAnalysis(song.manual_analysis || "");
  if (manualLines.length) {
    lines = manualLines;
    usedManual = true;
    usedAI = false;
  } else {
    try {
      lines = await analyzeLyricsWithAI(raw, song.title || "", song.artist_name || "");
    } catch (error) {
      usedAI = false;
      console.warn("AI analysis refresh failed. Fallback analysis will be saved.", error);
      lines = splitLyricsLines(raw).map((line, i) => refreshLineAnalysis({ lyric: line, line_no: i + 1 }, i)).filter(l => l.lyric);
    }
  }

  const payload = {
    lyrics_raw: raw,
    lyric_lines: lines,
    updated_by: currentUser,
    updated_at: new Date().toISOString()
  };

  const { error } = await supabaseClient.from("songs").update(payload).eq("id", id);
  if (error) {
    console.error("Analysis refresh save failed", error);
    toast("分析レビュー更新の保存に失敗: " + error.message);
    return;
  }

  await addLog(`${currentUser} が「${song.title}」の分析レビューを更新しました`);
  await fetchSongs();
  renderSongs();
  const updated = songs.find(x => x.id === id);
  if (updated) openSong(id);
  toast(usedManual ? "ChatGPT手動解析を分析レビューに反映しました" : usedAI ? "分析レビューを更新しました" : "AI解析に失敗したため、簡易解析で分析レビューを更新しました");
}

async function refreshSongMetadata(id) {
  const song = songs.find(x => x.id === id);
  if (!song) return;
  toast("曲情報を更新中です...");
  const [artistInfo, coverUrl] = await Promise.all([
    fetchArtistInfo(song.artist_name),
    fetchCoverArt(song.title, song.artist_name)
  ]);
  const patch = {
    id: song.id,
    title: song.title,
    artist_name: song.artist_name,
    artist_profile: artistInfo?.extract || getDisplayArtistProfile(song),
    genre: artistInfo?.genre || song.genre || "",
    cover_art_url: song.cover_art_url || coverUrl || "",
    updated_by: currentUser,
    updated_at: new Date().toISOString()
  };
  const result = await upsertSongSafely({ ...song, ...patch });
  if (!result.ok) {
    toast("曲情報の更新に失敗: " + (result.error?.message || "不明なエラー"));
    return;
  }
  await addLog(`${currentUser} が「${song.title}」の曲情報を更新しました`);
  await fetchSongs();
  renderSongs();
  openSong(id);
  toast("曲情報を更新しました");
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
  ["editId", "youtubeUrl", "songTitle", "artistName", "appleUrl", "spotifyUrl", "coverArtUrl", "genre", "artistProfile", "lyricsRaw", "chatgptPrompt", "manualAnalysis"].forEach(id => { const el = qs("#" + id); if (el) el.value = ""; });
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
  const meaning = el?.dataset?.meaning || info.meaning;
  const usageText = el?.dataset?.usage || usage.usage;
  const example = el?.dataset?.example || usage.example;
  const exampleJa = el?.dataset?.exampleJa || usage.ja;
  tip.innerHTML = `
    <div class="tip-title">${esc(word)}</div>
    <div class="tip-section"><b>意味：</b><br>${esc(meaning || "意味を確認してください")}</div>
    <div class="tip-section"><b>使い方：</b><br>${esc(usageText || "文脈の中で使い方を確認します。")}</div>
    <div class="tip-section"><b>例文：</b><br>${esc(example || `Check the word "${normalizeWord(word)}" in context.`)}<br>${esc(exampleJa || `「${normalizeWord(word)}」を文脈の中で確認しましょう。`)}</div>
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
  if (STOP_WORDS.has(clean) || !isLearningVocabularyWord(clean)) { toast("英検準2級以上を目安にした重要単語だけを単語帳に追加できます"); return; }
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
  const value = WORD_DICTIONARY[key] || WORD_DICTIONARY[normalizeWord(word)] || ["意味を確認してください", "品詞を確認してください", "英検準2級以上を目安にした重要単語として、文脈の中で意味を確認してください。"];
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

function speakText(text, rate = currentSpeechRate) {
  if (!("speechSynthesis" in window)) { toast("このブラウザは読み上げ非対応です"); return; }
  const value = String(text || "").trim();
  if (!value) { toast("読み上げる英文がありません"); return; }
  try {
    window.speechSynthesis.cancel();
    currentSpeechText = value;
    currentSpeechRate = clampSpeechRate(rate);
    speechPaused = false;
    currentUtterance = new SpeechSynthesisUtterance(value);
    currentUtterance.lang = "en-US";
    currentUtterance.rate = currentSpeechRate;
    currentUtterance.pitch = 1;
    const voice = window.speechSynthesis.getVoices().find(v => v.lang?.toLowerCase().startsWith("en"));
    if (voice) currentUtterance.voice = voice;
    currentUtterance.onend = () => { speechPaused = false; currentUtterance = null; };
    currentUtterance.onerror = () => { speechPaused = false; currentUtterance = null; };
    window.speechSynthesis.speak(currentUtterance);
    toast(currentSpeechRate < 1 ? `${currentSpeechRate}倍で読み上げます` : "読み上げを開始しました");
  } catch {
    toast("読み上げを開始できませんでした");
  }
}

function pauseOrResumeSpeech() {
  if (!("speechSynthesis" in window)) { toast("このブラウザは読み上げ非対応です"); return; }
  if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
    window.speechSynthesis.pause();
    speechPaused = true;
    toast("読み上げを一時停止しました");
    return;
  }
  if (window.speechSynthesis.paused || speechPaused) {
    window.speechSynthesis.resume();
    speechPaused = false;
    toast("読み上げを再開しました");
    return;
  }
  toast("再生中の読み上げがありません");
}

function stopSpeech() {
  if (!("speechSynthesis" in window)) { toast("このブラウザは読み上げ非対応です"); return; }
  window.speechSynthesis.cancel();
  speechPaused = false;
  currentUtterance = null;
  toast("読み上げを停止しました");
}

function setSpeechRate(rate, text = currentSpeechText) {
  currentSpeechRate = clampSpeechRate(rate);
  const label = currentSpeechRate <= 0.4 ? "かなりゆっくり" : currentSpeechRate <= 0.6 ? "ゆっくり" : "標準";
  const value = String(text || currentSpeechText || "").trim();

  if (value) {
    speakText(value, currentSpeechRate);
    return;
  }

  toast(`読み上げ速度を${label}にしました`);
}

function clampSpeechRate(rate) {
  const value = Number(rate) || 1;
  return Math.max(0.35, Math.min(1.25, value));
}

function normalizeWord(word) { return String(word || "").replace(/[^A-Za-z']/g, "").toLowerCase(); }
function dictionaryUrl(word) { return `https://ejje.weblio.jp/content/${encodeURIComponent(normalizeWord(word))}`; }
function esc(s) { return String(s ?? "").replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m])); }
function nl(s) { return esc(s).replace(/\n/g, "<br>"); }
function escAttr(s) { return esc(s).replace(/\n/g, " "); }
function fmt(s) { return s ? new Date(s).toLocaleString() : ""; }


// v31: ChatGPT手動解析を詳細表示・保存データへ安定反映するための上書き関数。
// 既存機能は触らず、手動解析テキストの読み取りだけを強化する。
function parseManualAnalysis(text) {
  const raw = String(text || "").trim();
  if (!raw) return [];

  const normalized = raw.replace(/\r\n/g, "\n");
  const globalWords = parseManualWords(
    extractManualSectionFromText(normalized, ["単語データ", "word data", "vocabulary data"]) ||
    extractManualSectionFromText(normalized, ["単語の意味", "重要単語", "単語", "語彙"])
  );
  const globalExamples = parseBulletLines(
    extractManualSectionFromText(normalized, ["例文", "類似例文"])
  ).map(x => x.replace(/^・\s*/, "").trim()).filter(Boolean);

  const blocks = normalized
    .split(/(?=【(?:英文|英語|原文)】)/g)
    .map(b => b.trim())
    .filter(b => /【(?:英文|英語|原文)】/.test(b));

  let lines = [];

  if (blocks.length) {
    blocks.forEach((block, index) => {
      const lyric = firstMeaningfulLine(extractManualSectionFromText(block, ["英文", "英語", "原文"]));
      if (!lyric) return;
      const translation = firstMeaningfulLine(extractManualSectionFromText(block, ["自然な和訳", "和訳", "日本語訳", "自然な日本語訳"]));
      const grammarText = extractManualSectionFromText(block, ["文法ポイント", "使われている文法", "文法", "文法解説"]);
      const localWordsText = extractManualSectionFromText(block, ["単語データ", "word data", "vocabulary data"]) ||
        extractManualSectionFromText(block, ["単語の意味", "重要単語", "単語", "語彙"]);
      const localWords = parseManualWords(localWordsText);
      const wordItems = localWords.length ? localWords : wordsForLyricFromManual(lyric, globalWords);
      const notes = parseBulletLines(grammarText).map(item => item.replace(/^・\s*/, "").trim()).filter(Boolean);
      const examples = parseBulletLines(extractManualSectionFromText(block, ["例文", "類似例文"]))
        .map(item => item.replace(/^・\s*/, "").trim())
        .filter(Boolean);
      lines.push(buildManualLine(index + 1, lyric, translation, notes, wordItems, examples.length ? examples : examplesForLyricFromManual(lyric, globalExamples)));
    });
  }

  // ChatGPTの回答が「【英文】」ブロックで分かれていない場合の保険。
  // 歌詞欄の行と、回答内の和訳欄を上から順番に対応させる。
  if (!lines.length) {
    const lyrics = getCurrentLyricsLinesForManualParse();
    const translations = extractRepeatedSectionValues(normalized, ["自然な和訳", "和訳", "日本語訳", "自然な日本語訳"]);
    const grammarValues = extractRepeatedSectionValues(normalized, ["文法ポイント", "使われている文法", "文法", "文法解説"]);
    if (lyrics.length) {
      lines = lyrics.map((lyric, index) => {
        const wordItems = wordsForLyricFromManual(lyric, globalWords);
        const notes = grammarValues[index] ? parseBulletLines(grammarValues[index]).map(x => x.replace(/^・\s*/, "").trim()).filter(Boolean) : [];
        return buildManualLine(index + 1, lyric, translations[index] || "", notes, wordItems, examplesForLyricFromManual(lyric, globalExamples));
      });
    }
  }

  // 単語データが全体末尾にだけある場合、各行へ該当単語を補完する。
  return lines.map((line, index) => {
    const lyric = String(line.lyric || "");
    const currentWords = Array.isArray(line.grammar?.words) ? line.grammar.words : [];
    const mergedWords = mergeManualWordLists(currentWords, wordsForLyricFromManual(lyric, globalWords));
    return buildManualLine(
      Number(line.line_no) || index + 1,
      lyric,
      line.translation,
      Array.isArray(line.grammar?.notes) ? line.grammar.notes : [],
      mergedWords,
      Array.isArray(line.grammar?.examples) ? line.grammar.examples : []
    );
  }).filter(l => l.lyric);
}

function buildManualLine(lineNo, lyric, translation, notes, words, examples) {
  const fixedTranslation = cleanTranslation(translation, lyric) || translateLine(lyric);
  const wordItems = Array.isArray(words) && words.length ? words : vocabularyItems(lyric).slice(0, 6);
  const grammarNotesValue = Array.isArray(notes) && notes.length ? notes : grammarNotesFromManualWords(wordItems, lyric);
  const examplesValue = Array.isArray(examples) && examples.length ? examples : similarExamples(lyric);
  return {
    line_no: lineNo,
    lyric,
    translation: fixedTranslation,
    grammar: {
      translation: fixedTranslation,
      points: grammarNotesValue.map(note => String(note).split(/[：:]/)[0].trim()).filter(Boolean),
      notes: grammarNotesValue,
      words: wordItems,
      examples: examplesValue
    },
    vocabulary: wordItems.map(w => `・${w.word}: ${w.meaning}`).join("\n"),
    preposition: "ChatGPT手動解析"
  };
}

function extractManualSectionFromText(text, labels) {
  const source = String(text || "");
  const all = [
    "英文", "英語", "原文",
    "自然な和訳", "和訳", "日本語訳", "自然な日本語訳",
    "文法ポイント", "使われている文法", "文法", "文法解説",
    "単語の意味", "重要単語", "単語", "語彙", "単語データ", "word data", "vocabulary data",
    "例文", "類似例文"
  ];
  let start = -1;
  let used = "";
  for (const label of labels) {
    const re = new RegExp(`【${escapeRegExp(label)}】`, "i");
    const match = re.exec(source);
    if (match && (start < 0 || match.index < start)) {
      start = match.index;
      used = match[0];
    }
  }
  if (start < 0) return "";
  const bodyStart = start + used.length;
  let end = source.length;
  for (const other of all) {
    const re = new RegExp(`【${escapeRegExp(other)}】`, "ig");
    let m;
    while ((m = re.exec(source))) {
      if (m.index > bodyStart && m.index < end) end = m.index;
    }
  }
  return source.slice(bodyStart, end).trim();
}

function extractRepeatedSectionValues(text, labels) {
  const source = String(text || "");
  const values = [];
  for (const label of labels) {
    const re = new RegExp(`【${escapeRegExp(label)}】([\\s\\S]*?)(?=【(?:英文|英語|原文|自然な和訳|和訳|日本語訳|自然な日本語訳|文法ポイント|使われている文法|文法|文法解説|単語の意味|重要単語|単語|語彙|単語データ|word data|vocabulary data|例文|類似例文)】|$)`, "gi");
    let m;
    while ((m = re.exec(source))) {
      const value = String(m[1] || "").trim();
      if (value) values.push(value);
    }
    if (values.length) break;
  }
  return values;
}

function firstMeaningfulLine(text) {
  return String(text || "")
    .split(/\n+/)
    .map(x => x.replace(/^[-・*]\s*/, "").trim())
    .filter(Boolean)[0] || "";
}

function getCurrentLyricsLinesForManualParse() {
  const raw = (typeof qs === "function" && qs("#lyricsRaw")) ? qs("#lyricsRaw").value : "";
  return splitLyricsLines(normalizeLyricsText(raw || "")).map(x => x.trim()).filter(Boolean);
}

function wordsForLyricFromManual(lyric, words) {
  const set = new Set(getWords(lyric).map(normalizeWord));
  return (words || []).filter(w => set.has(normalizeWord(w.word)) && isLearningVocabularyWord(normalizeWord(w.word)));
}

function examplesForLyricFromManual(lyric, examples) {
  const keyWords = new Set(getWords(lyric).map(normalizeWord).filter(w => w.length > 3));
  return (examples || []).filter(ex => getWords(ex).some(w => keyWords.has(normalizeWord(w)))).slice(0, 3);
}

function mergeManualWordLists(a, b) {
  const map = new Map();
  [...(a || []), ...(b || [])].forEach(item => {
    const word = normalizeWord(item.word || "");
    if (!word || !isLearningVocabularyWord(word)) return;
    if (!map.has(word)) map.set(word, { ...item, word });
    else {
      const existing = map.get(word);
      map.set(word, {
        ...existing,
        meaning: existing.meaning || item.meaning || "",
        usage: existing.usage || item.usage || "",
        example: existing.example || item.example || "",
        example_ja: existing.example_ja || item.example_ja || item.ja || ""
      });
    }
  });
  return [...map.values()].filter(w => w.word && w.meaning);
}

function escapeRegExp(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

})();
