let supabaseClient;
let currentUser = null;
let songs = [];
let vocab = [];
let logs = [];
let currentAnalysis = [];
let selectedWordContext = null;
let realtimeStarted = false;

const WORD_DICTIONARY = {
  lover: ["恋人", "名詞", "love から派生した単語。歌詞では恋愛相手を表します。"],
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

const KNOWN_YOUTUBE = {
  JGwWNGJdvx8: {
    title: "Shape of You",
    artist: "Ed Sheeran",
    genre: "Pop",
    profile: "Ed Sheeranはイギリス出身のシンガーソングライター。アコースティックなサウンドとポップなメロディ、恋愛や日常をテーマにした分かりやすい歌詞が特徴。英語学習では、自然な会話表現や前置詞の使い方を学びやすいアーティストです。"
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
  if ((id === "kazuki" || id === "shun") && pw === "12345") {
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
  qs("#userLabel").textContent = id === "kazuki" ? "Kazuki / 管理ユーザー" : "Shun / 共有ユーザー";
  startApp();
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
  if (stats) stats.textContent = `登録曲: ${songs.length}曲 / Kazuki追加: ${songs.filter(s => s.created_by === "kazuki").length}曲 / Shun追加: ${songs.filter(s => s.created_by === "shun").length}曲`;
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
          <p>${esc(s.artist_profile || "プロフィール未登録")}</p>
          <div class="actions">
            ${s.youtube_url ? `<a class="btn" href="${escAttr(s.youtube_url)}" target="_blank" rel="noopener">YouTube</a>` : `<button class="btn secondary" disabled>YouTube未登録</button>`}
            ${s.apple_music_url ? `<a class="btn secondary" href="${escAttr(s.apple_music_url)}" target="_blank" rel="noopener">Apple Music</a>` : `<button class="btn secondary" disabled>Apple Music未登録</button>`}
            <button class="btn blue" data-action="speak" data-text="${escAttr(lines.map(l => l.lyric).join(". "))}">読み上げ</button>
          </div>
        </div>
      </div>
    </div>
    <div class="card">
      <h3 class="section-title">アーティスト情報</h3>
      <div id="artistInfo" class="mini">アーティスト情報を取得中...</div>
    </div>
    <div class="card"><h3 class="section-title">歌詞解説</h3>${lines.map(l => lineHtml(l, s.id, s.title, s.artist_name)).join("") || "<p class='mini'>歌詞がありません。</p>"}</div>`;
  showScreen("detail");
  enrichSongDetail(s, youtubeThumb);
}

async function enrichSongDetail(song, youtubeThumb) {
  const [artistInfo, coverUrl] = await Promise.all([
    fetchArtistInfo(song.artist_name),
    fetchCoverArt(song.title, song.artist_name)
  ]);
  renderArtistInfo(artistInfo);
  const cover = qs("#coverImage");
  if (cover) {
    cover.src = coverUrl || youtubeThumb || placeholderImage();
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
  const grammar = normalizeGrammar(line.grammar);
  return `<div class="lyrics-line">
    <div class="en">${wordify(line.lyric, songId, line.line_no, songTitle, artistName)}</div>
    <div class="jp">自然な和訳: ${esc(line.translation || translateLine(line.lyric))}</div>
    <details open><summary>文構造・文法ポイント</summary>${grammar}</details>
    <details><summary>単語</summary><p class="mini">${nl(line.vocabulary || vocabularyText(line.lyric))}</p></details>
    <details><summary>前置詞</summary><p class="mini">${nl(line.preposition || prepositionText(line.lyric))}</p></details>
    <div class="actions" style="margin-top:12px">
      <button class="btn secondary" data-action="speak" data-text="${escAttr(line.lyric)}">読み上げ</button>
      <button class="btn green" type="button">単語をタップ</button>
    </div>
  </div>`;
}

function wordify(text, songId, lineNo, songTitle, artistName) {
  return tokenizePreservingSpace(text).map(part => {
    if (/^[A-Za-z][A-Za-z']*$/.test(part)) {
      const clean = normalizeWord(part);
      return `<span class="word" tabindex="0" data-word="${escAttr(clean)}" data-song-id="${escAttr(songId)}" data-line-no="${lineNo}" data-song-title="${escAttr(songTitle || "")}" data-artist-name="${escAttr(artistName || "")}">${esc(part)}</span>`;
    }
    return esc(part);
  }).join("");
}

function tokenizePreservingSpace(text) {
  return String(text || "").match(/[A-Za-z][A-Za-z']*|[^A-Za-z]+/g) || [];
}

async function autoFillFromYoutube() {
  const url = qs("#youtubeUrl").value.trim();
  if (!url) { toast("YouTube URLを入力してください"); return; }
  const videoId = extractYoutubeId(url);
  let titleText = "";
  let channelText = "";
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
  const guess = titleText ? parseYoutubeTitle(titleText, channelText) : (KNOWN_YOUTUBE[videoId] || { title: "Unknown Song", artist: "Artist Name", genre: "Pop", profile: "" });
  applySongGuess(guess);
  const artistInfo = await fetchArtistInfo(guess.artist);
  if (artistInfo?.extract) qs("#artistProfile").value = artistInfo.extract;
  else if (guess.profile) qs("#artistProfile").value = guess.profile;
  toast("曲名・アーティスト名を自動入力しました");
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
  if (artist === "Ed Sheeran") return KNOWN_YOUTUBE.JGwWNGJdvx8.profile;
  return `${artist}は、洋楽を通じて英語表現を学ぶのに適したアーティストです。歌詞には日常的な単語、感情表現、前置詞、動詞表現が含まれるため、和訳だけでなく文法や語感も合わせて学べます。`;
}

async function fetchArtistInfo(artistName) {
  const name = (artistName || "").trim();
  if (!name) return null;
  for (const lang of ["en", "ja"]) {
    try {
      const res = await fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`);
      if (!res.ok) continue;
      const json = await res.json();
      if (json.type === "disambiguation" || !json.extract) continue;
      return {
        name: json.title || name,
        extract: json.extract,
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

function analyzeLyrics() {
  const raw = qs("#lyricsRaw").value.trim();
  if (!raw) { toast("歌詞を貼り付けてください"); return; }
  currentAnalysis = raw.split(/\n+/).map((line, i) => makeLine(line.trim(), i + 1)).filter(l => l.lyric);
  qs("#analysisPreview").innerHTML = currentAnalysis.map(l => lineHtml(l, "preview", "", "")).join("");
  toast("AI分析風の詳細文法解説を作成しました");
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

function grammarObject(line) {
  const words = getWords(line);
  const lower = line.toLowerCase();
  const subject = guessSubject(words);
  const verb = guessVerb(words);
  const object = guessObject(words, verb);
  const complement = guessComplement(line);
  const modifiers = guessModifiers(line);
  const points = [];
  if (/\b(am|is|are|was|were|isn't|aren't|wasn't|weren't|i'm|you're|we're|they're|it's|he's|she's)\b/i.test(line)) points.push("be動詞");
  if (verb && !["am","is","are","was","were"].includes(verb.toLowerCase())) points.push("一般動詞");
  if (/\b(will|would|can|could|should|must|may|might)\b/i.test(line)) points.push("助動詞");
  if (/\b(not|isn't|aren't|don't|doesn't|didn't|won't|can't|never|no)\b/i.test(line)) points.push("否定文");
  if (/\bto\s+[a-zA-Z']+\b/.test(lower)) points.push("不定詞");
  if (/\b[a-zA-Z]+ing\b/.test(lower)) points.push("動名詞 / 現在分詞");
  if (/\b[a-zA-Z]+ed\b/.test(lower)) points.push("過去分詞の可能性");
  if (/\b(best|better|more|most|less|least)\b/i.test(line)) points.push("比較");
  if (/\b(who|which|that|where|when)\b/i.test(line)) points.push("関係代名詞 / 関係副詞");
  if (/\b(in|on|at|for|to|with|from|of|by|about|into|over|under)\b/i.test(line)) points.push("前置詞");
  return {
    translation: translateLine(line),
    structure: { subject, verb, object, complement, modifiers },
    points,
    why: explainWhy(line, points),
    junior: juniorExplanation(line, subject, verb),
    examples: similarExamples(line),
    native: nativeSense(line)
  };
}

function normalizeGrammar(grammar) {
  if (grammar && typeof grammar === "object") return grammarHtml(grammar);
  if (typeof grammar === "string" && grammar.trim()) return `<p class="mini">${nl(grammar)}</p>`;
  return grammarHtml(grammarObject(""));
}

function grammarHtml(g) {
  const s = g.structure || {};
  return `
    <div class="mini">
      <b>1. 自然な和訳</b><br>${esc(g.translation || "")}
      <br><br><b>2. 文構造</b>
      <ul class="grammar-list">
        <li>主語: ${esc(s.subject || "文脈から判断")}</li>
        <li>動詞: ${esc(s.verb || "文脈から判断")}</li>
        <li>目的語: ${esc(s.object || "なし / 省略")}</li>
        <li>補語: ${esc(s.complement || "なし / 文脈から判断")}</li>
        <li>修飾語: ${esc(s.modifiers || "なし / 文脈から判断")}</li>
      </ul>
      <b>3. 文法ポイント</b><br>${esc((g.points || []).join(" / ") || "語順と文脈を確認")}
      <br><br><b>4. なぜその文法になるのか</b><br>${esc(g.why || "")}
      <br><br><b>5. 中学生でも分かる説明</b><br>${esc(g.junior || "")}
      <br><br><b>6. 類似例文</b><br>${nl((g.examples || []).join("\n"))}
      <br><br><b>7. ネイティブ感覚</b><br>${esc(g.native || "")}
    </div>`;
}

function translateLine(line) {
  const exact = {
    "The club isn't the best place to find a lover": "クラブは恋人探しに一番いい場所ではない",
    "So the bar is where I go": "だから僕はバーへ行く",
    "I found a love for me": "僕は自分にぴったりの愛を見つけた",
    "We are dancing in the dark": "僕たちは暗闇の中で踊っている"
  };
  if (exact[line]) return exact[line];
  let t = line;
  const dict = [
    ["isn't", "ではない"], ["aren't", "ではない"], ["don't", "しない"], ["doesn't", "しない"], ["can't", "できない"],
    ["love", "愛"], ["lover", "恋人"], ["best", "最も良い"], ["place", "場所"], ["find", "見つける"], ["club", "クラブ"], ["bar", "バー"], ["go", "行く"], ["dancing", "踊っている"], ["dark", "暗闇"]
  ];
  dict.forEach(([en, ja]) => { t = t.replace(new RegExp(`\\b${en}\\b`, "ig"), ja); });
  return t === line ? "この行は、前後の文脈に合わせて自然な日本語に訳してください。" : t;
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
  if (/to\s+[a-z]/i.test(line)) return ["This is the best way to learn English. / これは英語を学ぶ一番良い方法です。", "I need a place to study. / 勉強する場所が必要です。"];
  if (/\bisn't\b/i.test(line)) return ["This isn't easy. / これは簡単ではありません。", "He isn't my brother. / 彼は私の兄弟ではありません。"];
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
  const words = [...new Set(getWords(line).map(normalizeWord).filter(w => w.length >= 3))].slice(0, 8);
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
  if (!title || !raw) { toast("曲名と歌詞は必須です"); return; }
  const existing = songs.find(s => s.id === id);
  const lines = currentAnalysis.length ? currentAnalysis : raw.split(/\n+/).map((line, i) => makeLine(line.trim(), i + 1)).filter(l => l.lyric);
  const payload = {
    id,
    title,
    artist_name: qs("#artistName").value.trim(),
    youtube_url: qs("#youtubeUrl").value.trim(),
    apple_music_url: qs("#appleUrl").value.trim(),
    genre: qs("#genre").value.trim(),
    difficulty: qs("#difficulty").value,
    artist_profile: qs("#artistProfile").value.trim(),
    lyrics_raw: raw,
    lyric_lines: lines,
    created_by: existing?.created_by || currentUser,
    updated_by: currentUser,
    updated_at: new Date().toISOString()
  };
  const { error } = await supabaseClient.from("songs").upsert(payload);
  if (error) { toast("保存失敗: " + error.message); return; }
  await addLog(`${currentUser} が「${title}」を保存しました`);
  clearForm();
  await fetchSongs();
  renderSongs();
  await fetchLogs();
  renderLog();
  showScreen("home");
  toast("保存しました");
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
  qs("#genre").value = s.genre || "";
  qs("#difficulty").value = s.difficulty || "初級";
  qs("#artistProfile").value = s.artist_profile || "";
  qs("#lyricsRaw").value = s.lyrics_raw || "";
  currentAnalysis = Array.isArray(s.lyric_lines) ? s.lyric_lines : [];
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
  ["editId", "youtubeUrl", "songTitle", "artistName", "appleUrl", "genre", "artistProfile", "lyricsRaw"].forEach(id => qs("#" + id).value = "");
  qs("#difficulty").value = "初級";
  qs("#formTitle").textContent = "曲を追加";
  qs("#analysisPreview").innerHTML = "<p class='mini'>歌詞を貼り付けて「AI分析風に解説」を押してください。</p>";
  currentAnalysis = [];
}

function openWordModal(word, songId, lineNo, songTitle, artistName) {
  if (songId === "preview") { toast("保存後に単語を追加できます"); return; }
  const clean = normalizeWord(word);
  const info = getWordInfo(clean);
  const song = songs.find(s => s.id === songId);
  const line = (song?.lyric_lines || []).find(l => Number(l.line_no) === Number(lineNo));
  selectedWordContext = { word: clean, songId, lineNo, songTitle, artistName, example: line?.lyric || "" };
  qs("#modalWord").textContent = clean;
  qs("#modalInfo").textContent = `${songTitle} / ${artistName}`;
  qs("#modalMeaning").value = info.meaning;
  qs("#modalPos").value = info.pos;
  qs("#modalMemo").value = info.memo + (line?.lyric ? `\n例: ${line.lyric}` : "");
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
