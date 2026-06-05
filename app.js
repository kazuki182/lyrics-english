let supabaseClient;
let currentUser = null;
let songs = [];
let vocab = [];
let logs = [];
let currentAnalysis = [];

function initSupabase(){
  if(!window.SUPABASE_URL || window.SUPABASE_URL.includes("YOUR_PROJECT")){
    setStatus("Supabase未設定：config.jsを編集してください");
    return false;
  }
  supabaseClient = supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
  setStatus("Supabase接続設定OK");
  return true;
}
function setStatus(msg){const el=document.getElementById("connectionStatus"); if(el)el.textContent=msg}
function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.style.display="block";setTimeout(()=>t.style.display="none",2300)}

function login(){
  const id=document.getElementById("loginId").value.trim().toLowerCase();
  const pw=document.getElementById("loginPw").value.trim();
  if((id==="kazuki"||id==="shun") && pw==="12345"){
    currentUser=id; localStorage.setItem("currentUser",id);
    document.getElementById("login").classList.add("hidden");
    document.getElementById("main").classList.remove("hidden");
    document.getElementById("userLabel").textContent=id==="kazuki"?"Kazuki / 管理者":"Shun / 一般ユーザー";
    startApp();
  }else toast("ユーザーIDまたはパスワードが違います");
}
function logout(){localStorage.removeItem("currentUser");location.reload()}

async function startApp(){
  const ok=initSupabase();
  if(!ok)return;
  await Promise.all([fetchSongs(), fetchVocab(), fetchLogs()]);
  subscribeRealtime();
  renderSongs(); renderVocab(); renderLog();
}
async function fetchSongs(){
  const {data,error}=await supabaseClient.from("songs").select("*").order("updated_at",{ascending:false});
  if(error){toast("曲の取得に失敗: "+error.message);return}
  songs=data||[];
}
async function fetchVocab(){
  const {data,error}=await supabaseClient.from("vocabulary").select("*").order("created_at",{ascending:false});
  if(error){toast("単語帳の取得に失敗: "+error.message);return}
  vocab=data||[];
}
async function fetchLogs(){
  const {data,error}=await supabaseClient.from("activity_logs").select("*").order("created_at",{ascending:false}).limit(10);
  if(!error)logs=data||[];
}
function subscribeRealtime(){
  supabaseClient
    .channel("lyrics-english-realtime")
    .on("postgres_changes",{event:"*",schema:"public",table:"songs"}, async payload=>{
      await fetchSongs(); renderSongs(); addRealtimeNotice("曲データが更新されました");
    })
    .on("postgres_changes",{event:"*",schema:"public",table:"vocabulary"}, async payload=>{
      await fetchVocab(); renderVocab(); addRealtimeNotice("単語帳が更新されました");
    })
    .on("postgres_changes",{event:"*",schema:"public",table:"activity_logs"}, async payload=>{
      await fetchLogs(); renderLog();
    })
    .subscribe();
}
function addRealtimeNotice(msg){setStatus(msg+" / "+new Date().toLocaleTimeString())}
async function addLog(message){
  await supabaseClient.from("activity_logs").insert({user_id:currentUser,message});
}

function showScreen(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  document.querySelectorAll(".tabbar button").forEach(b=>b.classList.remove("active"));
  const tab=document.getElementById("tab-"+id); if(tab)tab.classList.add("active");
  if(id==="songs")renderSongs();
  if(id==="vocab")renderVocab();
}
function renderSongs(){
  const q=(document.getElementById("search")?.value||"").toLowerCase();
  const filtered=songs.filter(s=>(s.title+s.artist_name+(s.genre||"")).toLowerCase().includes(q));
  const stats=document.getElementById("libraryStats");
  if(stats){
    const kc=songs.filter(s=>s.created_by==="kazuki").length;
    const sc=songs.filter(s=>s.created_by==="shun").length;
    stats.textContent=`登録曲：${songs.length}曲 / Kazuki追加：${kc}曲 / Shun追加：${sc}曲`;
  }
  const html=filtered.length?filtered.map(s=>`
    <div class="song-item">
      <div onclick="openSong('${s.id}')" style="flex:1">
        <h4>${esc(s.title)}</h4>
        <div class="muted">${esc(s.artist_name)}</div>
        <span class="tag">${esc(s.genre||"Pop")}</span><span class="tag">${esc(s.difficulty||"初級")}</span><span class="tag">追加:${esc(s.created_by||"")}</span>
        <div class="mini">最終更新：${fmt(s.updated_at)} / ${esc(s.updated_by||"")}</div>
      </div>
      <div class="actions">
        <button class="btn secondary" onclick="editSong('${s.id}')">編集</button>
        <button class="btn red" onclick="deleteSong('${s.id}')">削除</button>
      </div>
    </div>`).join(""):`<div class="card"><p class="mini">曲がありません。</p></div>`;
  document.getElementById("songList").innerHTML=html;
  document.getElementById("songList2").innerHTML=html;
}
function openSong(id){
  const s=songs.find(x=>x.id===id); if(!s)return;
  const lines=s.lyric_lines||[];
  document.getElementById("songDetail").innerHTML=`
    <div class="card">
      <h3>${esc(s.title)}</h3>
      <p class="muted">${esc(s.artist_name)} ｜ 追加：${esc(s.created_by||"")} ｜ 更新：${esc(s.updated_by||"")}</p>
      <p>${esc(s.artist_profile||"プロフィール未登録")}</p>
      <div class="actions">
        <a class="btn" href="${esc(s.youtube_url||"#")}" target="_blank">YouTube</a>
        <a class="btn secondary" href="${esc(s.apple_music_url||"#")}" target="_blank">Apple Music</a>
        <button class="btn blue" onclick="speak('${escAttr(lines.map(l=>l.lyric).join(". "))}')">読み上げ</button>
      </div>
    </div>
    <div class="card"><h3>歌詞解説</h3>${lines.map(l=>lineHtml(l,s.id)).join("")||"<p class='mini'>歌詞がありません。</p>"}</div>`;
  showScreen("detail");
}
function lineHtml(l,songId){
  return `<div class="lyrics-line">
    <div class="en">${esc(l.lyric)}</div>
    <div class="jp">${esc(l.translation)}</div>
    <details open><summary>文法</summary><p class="mini">${esc(l.grammar)}</p></details>
    <details><summary>単語</summary><p class="mini">${esc(l.vocabulary)}</p></details>
    <details><summary>前置詞</summary><p class="mini">${esc(l.preposition)}</p></details>
    <div class="actions" style="margin-top:12px">
      <button class="btn secondary" onclick="speak('${escAttr(l.lyric)}')">▶ 読み上げ</button>
      <button class="btn" onclick="addVocabFromLine('${songId}',${l.line_no})">単語帳に追加</button>
    </div>
  </div>`
}
function autoFillFromYoutube(){
  const url=document.getElementById("youtubeUrl").value.trim();
  if(!url){toast("YouTube URLを入力してください");return}
  let guessed="Unknown Song";
  try{const u=new URL(url); guessed=(u.searchParams.get("v")||u.pathname.split("/").filter(Boolean).pop()||"Sample Song").replaceAll("-"," ")}catch(e){}
  document.getElementById("songTitle").value ||= guessed;
  document.getElementById("artistName").value ||= "Artist Name";
  document.getElementById("artistProfile").value ||= "このアーティストは、印象的なメロディと日常で使える英語表現を含む楽曲が特徴。プロフィールは後から編集できます。";
  toast("曲情報を推定しました");
}
function analyzeLyrics(){
  const raw=document.getElementById("lyricsRaw").value.trim();
  if(!raw){toast("歌詞を貼り付けてください");return}
  currentAnalysis=raw.split(/\n+/).map((line,i)=>makeLine(line.trim(),i+1)).filter(l=>l.lyric);
  document.getElementById("analysisPreview").innerHTML=currentAnalysis.map(l=>lineHtml(l,"preview")).join("");
  toast("AI分析風の解説を生成しました");
}
function makeLine(line,no){
  const words=line.replace(/[^\w\s']/g,"").split(/\s+/).filter(Boolean);
  const prep=(line.match(/\b(in|on|at|for|to|with|from|of|by|about|into|over|under)\b/gi)||[]);
  return {
    line_no:no, lyric:line,
    translation:"自然な和訳：" + line + "（保存後に手動修正できます）",
    grammar:"主語・動詞・目的語、時制、助動詞、動詞の形に注目して意味を確認します。",
    vocabulary:"重要語候補：" + (words.slice(0,4).join(" / ") || "なし"),
    preposition: prep.length ? "前置詞：" + [...new Set(prep.map(p=>p.toLowerCase()))].join(", ") + "。前後の語との関係を作っています。" : "目立つ前置詞はありません。"
  }
}
async function saveSong(){
  const id=document.getElementById("editId").value || crypto.randomUUID();
  const raw=document.getElementById("lyricsRaw").value.trim();
  const title=document.getElementById("songTitle").value.trim();
  if(!title||!raw){toast("曲名と歌詞は必須です");return}
  const existing=songs.find(s=>s.id===id);
  const lines=currentAnalysis.length?currentAnalysis:raw.split(/\n+/).map((line,i)=>makeLine(line.trim(),i+1)).filter(l=>l.lyric);
  const payload={
    id,title,
    artist_name:document.getElementById("artistName").value.trim(),
    youtube_url:document.getElementById("youtubeUrl").value.trim(),
    apple_music_url:document.getElementById("appleUrl").value.trim(),
    genre:document.getElementById("genre").value.trim(),
    difficulty:document.getElementById("difficulty").value,
    artist_profile:document.getElementById("artistProfile").value.trim(),
    lyrics_raw:raw,
    lyric_lines:lines,
    created_by:existing?.created_by||currentUser,
    updated_by:currentUser,
    updated_at:new Date().toISOString()
  };
  const {error}=await supabaseClient.from("songs").upsert(payload);
  if(error){toast("保存失敗: "+error.message);return}
  await addLog(`${currentUser} が「${title}」を保存しました`);
  clearForm(); await fetchSongs(); renderSongs(); renderLog(); showScreen("home"); toast("保存しました");
}
function editSong(id){
  const s=songs.find(x=>x.id===id); if(!s)return;
  document.getElementById("formTitle").textContent="曲を編集";
  document.getElementById("editId").value=s.id;
  document.getElementById("youtubeUrl").value=s.youtube_url||"";
  document.getElementById("songTitle").value=s.title||"";
  document.getElementById("artistName").value=s.artist_name||"";
  document.getElementById("appleUrl").value=s.apple_music_url||"";
  document.getElementById("genre").value=s.genre||"";
  document.getElementById("difficulty").value=s.difficulty||"初級";
  document.getElementById("artistProfile").value=s.artist_profile||"";
  document.getElementById("lyricsRaw").value=s.lyrics_raw||"";
  currentAnalysis=s.lyric_lines||[];
  document.getElementById("analysisPreview").innerHTML=currentAnalysis.map(l=>lineHtml(l,s.id)).join("");
  showScreen("add");
}
async function deleteSong(id){
  if(!confirm("削除しますか？"))return;
  const title=songs.find(s=>s.id===id)?.title||"曲";
  const {error}=await supabaseClient.from("songs").delete().eq("id",id);
  if(error){toast("削除失敗: "+error.message);return}
  await addLog(`${currentUser} が「${title}」を削除しました`);
  await fetchSongs(); renderSongs(); showScreen("home"); toast("削除しました");
}
function clearForm(){
  ["editId","youtubeUrl","songTitle","artistName","appleUrl","genre","artistProfile","lyricsRaw"].forEach(id=>document.getElementById(id).value="");
  document.getElementById("difficulty").value="初級"; document.getElementById("formTitle").textContent="曲を追加";
  document.getElementById("analysisPreview").innerHTML="<p class='mini'>歌詞を貼り付けて「AI分析する」を押してください。</p>"; currentAnalysis=[];
}
async function addVocabFromLine(songId,lineNo){
  if(songId==="preview"){toast("保存後に単語帳へ追加できます");return}
  const s=songs.find(x=>x.id===songId); const l=s?.lyric_lines?.find(x=>x.line_no===lineNo); if(!l)return;
  const word=(l.lyric.replace(/[^\w\s']/g,"").split(/\s+/).filter(Boolean)[0]||"word");
  const {error}=await supabaseClient.from("vocabulary").insert({user_id:currentUser,song_id:songId,word,meaning:"意味を編集してください",song_title:s.title,artist_name:s.artist_name,status:"復習中"});
  if(error){toast("単語追加失敗: "+error.message);return}
  await addLog(`${currentUser} が単語「${word}」を追加しました`);
  toast("単語帳に追加しました");
}
function renderVocab(){
  const html=vocab.length?`<h3>保存単語</h3>`+vocab.map(x=>`
    <div class="song-item">
      <div><h4>${esc(x.word)}</h4><div>${esc(x.meaning)}</div><div class="mini">${esc(x.song_title||"")} / ${esc(x.artist_name||"")} / ${fmt(x.created_at)}</div></div>
      <button class="btn red no-print" onclick="deleteVocab('${x.id}')">削除</button>
    </div>`).join(""):`<p class="mini">単語はまだありません。</p>`;
  document.getElementById("vocabView").innerHTML=html;
}
async function deleteVocab(id){
  const {error}=await supabaseClient.from("vocabulary").delete().eq("id",id);
  if(error){toast("削除失敗: "+error.message);return}
  await fetchVocab(); renderVocab();
}
function showPrintVocab(){
  document.getElementById("vocabView").innerHTML=`<div class="print-area"><h2>Lyrics English 単語帳</h2><p>作成日：${new Date().toLocaleDateString()}</p>${vocab.map(x=>`<div class="vocab-row"><b>${esc(x.word)}</b>：${esc(x.meaning)}<br><small>${esc(x.song_title||"")} / ${esc(x.artist_name||"")}</small></div>`).join("")||"単語はまだありません。"}</div>`;
}
function renderLog(){
  document.getElementById("realtimeLog").innerHTML=(logs||[]).map(x=>`・${esc(x.message)}<br><span class="mini">${fmt(x.created_at)}</span>`).join("<br>")||"変更待機中...";
}
function speak(text){
  if(!("speechSynthesis" in window)){toast("読み上げ非対応です");return}
  speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text); u.lang="en-US"; u.rate=.85; speechSynthesis.speak(u);
}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]))}
function escAttr(s){return esc(s).replace(/\n/g," ")}
function fmt(s){return s?new Date(s).toLocaleString():""}
const savedUser=localStorage.getItem("currentUser");
if(savedUser){
  currentUser=savedUser;
  document.getElementById("login").classList.add("hidden");
  document.getElementById("main").classList.remove("hidden");
  document.getElementById("userLabel").textContent=savedUser==="kazuki"?"Kazuki / 管理者":"Shun / 一般ユーザー";
  startApp();
}
