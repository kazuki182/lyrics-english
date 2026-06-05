let supabaseClient;
let currentUser = null;
let songs = [];
let vocab = [];
let logs = [];
let currentAnalysis = [];
let selectedWordContext = null;

document.addEventListener("DOMContentLoaded", () => {
  qs("#loginBtn").addEventListener("click", login);
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
  document.querySelectorAll("[data-screen]").forEach(el => el.addEventListener("click", () => showScreen(el.dataset.screen)));
  const savedUser=localStorage.getItem("currentUser");
  if(savedUser){
    currentUser=savedUser;
    qs("#login").classList.add("hidden");
    qs("#main").classList.remove("hidden");
    qs("#userLabel").textContent=savedUser==="kazuki"?"Kazuki / 管理者":"Shun / 一般ユーザー";
    startApp();
  }
});

function qs(s){return document.querySelector(s)}
function toast(msg){const t=qs("#toast");t.textContent=msg;t.style.display="block";setTimeout(()=>t.style.display="none",2600)}
function login(){
  const id=qs("#loginId").value.trim().toLowerCase();
  const pw=qs("#loginPw").value.trim();
  if((id==="kazuki"||id==="shun") && pw==="12345"){
    currentUser=id;
    localStorage.setItem("currentUser",id);
    qs("#login").classList.add("hidden");
    qs("#main").classList.remove("hidden");
    qs("#userLabel").textContent=id==="kazuki"?"Kazuki / 管理者":"Shun / 一般ユーザー";
    startApp();
  }else toast("ユーザーIDまたはパスワードが違います");
}
function logout(){localStorage.removeItem("currentUser");location.reload()}
function initSupabase(){
  if(!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY || window.SUPABASE_URL.includes("YOUR_PROJECT")){
    setStatus("Supabase未設定：config.jsを確認してください");
    return false;
  }
  supabaseClient=supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
  setStatus("Supabase接続設定OK");
  return true;
}
function setStatus(msg){const el=qs("#connectionStatus"); if(el)el.textContent=msg}
async function startApp(){
  if(!initSupabase())return;
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
  supabaseClient.channel("lyrics-english-realtime")
  .on("postgres_changes",{event:"*",schema:"public",table:"songs"},async()=>{await fetchSongs();renderSongs();setStatus("曲データが更新されました / "+new Date().toLocaleTimeString())})
  .on("postgres_changes",{event:"*",schema:"public",table:"vocabulary"},async()=>{await fetchVocab();renderVocab();setStatus("単語帳が更新されました / "+new Date().toLocaleTimeString())})
  .on("postgres_changes",{event:"*",schema:"public",table:"activity_logs"},async()=>{await fetchLogs();renderLog()})
  .subscribe();
}
async function addLog(message){await supabaseClient.from("activity_logs").insert({user_id:currentUser,message})}
function showScreen(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  qs("#"+id).classList.add("active");
  document.querySelectorAll(".tabbar button").forEach(b=>b.classList.toggle("active",b.dataset.screen===id));
  if(id==="songs")renderSongs();
  if(id==="vocab")renderVocab();
}
function renderSongs(){
  const q=(qs("#search")?.value||"").toLowerCase();
  const filtered=songs.filter(s=>(s.title+s.artist_name+(s.genre||"")).toLowerCase().includes(q));
  const stats=qs("#libraryStats");
  if(stats){
    stats.textContent=`登録曲：${songs.length}曲 / Kazuki追加：${songs.filter(s=>s.created_by==="kazuki").length}曲 / Shun追加：${songs.filter(s=>s.created_by==="shun").length}曲`;
  }
  const html=filtered.length?filtered.map(s=>`
    <div class="song-item">
      <div style="flex:1" onclick="openSong('${s.id}')">
        <h4>${esc(s.title)}</h4>
        <div class="muted">${esc(s.artist_name||"")}</div>
        <span class="tag">${esc(s.genre||"Pop")}</span><span class="tag">${esc(s.difficulty||"初級")}</span><span class="tag">追加:${esc(s.created_by||"")}</span>
        <div class="mini">最終更新：${fmt(s.updated_at)} / ${esc(s.updated_by||"")}</div>
      </div>
      <div class="actions"><button class="btn secondary" onclick="event.stopPropagation();editSong('${s.id}')">編集</button><button class="btn red" onclick="event.stopPropagation();deleteSong('${s.id}')">削除</button></div>
    </div>`).join(""):`<p class="mini">曲がありません。</p>`;
  qs("#songList").innerHTML=html;
  qs("#songList2").innerHTML=html;
}
function openSong(id){
  const s=songs.find(x=>x.id===id); if(!s)return;
  const lines=s.lyric_lines||[];
  qs("#songDetail").innerHTML=`
    <div class="card">
      <h3>${esc(s.title)}</h3>
      <p class="muted">${esc(s.artist_name||"")} ｜ 追加：${esc(s.created_by||"")} ｜ 更新：${esc(s.updated_by||"")}</p>
      <p>${esc(s.artist_profile||"プロフィール未登録")}</p>
      <div class="actions">
        ${s.youtube_url ? `<a class="btn" href="${esc(s.youtube_url)}" target="_blank" rel="noopener">YouTube</a>` : `<button class="btn secondary" disabled>YouTube未登録</button>`}
        ${s.apple_music_url ? `<a class="btn secondary" href="${esc(s.apple_music_url)}" target="_blank" rel="noopener">Apple Music</a>` : `<button class="btn secondary" disabled>Apple Music未登録</button>`}
        <button class="btn blue" onclick="speakText('${escAttr(lines.map(l=>l.lyric).join('. '))}')">読み上げ</button>
      </div>
    </div>
    <div class="card"><h3>歌詞解説</h3>${lines.map(l=>lineHtml(l,s.id,s.title,s.artist_name)).join("")||"<p class='mini'>歌詞がありません。</p>"}</div>`;
  showScreen("detail");
}
function lineHtml(l,songId,songTitle,artistName){
  return `<div class="lyrics-line">
    <div class="en">${wordify(l.lyric,songId,l.line_no,songTitle,artistName)}</div>
    <div class="jp">和訳：${esc(l.translation || translateLine(l.lyric))}</div>
    <details open><summary>文法</summary><p class="mini">${nl(l.grammar)}</p></details>
    <details><summary>単語</summary><p class="mini">${nl(l.vocabulary)}</p></details>
    <details><summary>前置詞</summary><p class="mini">${nl(l.preposition)}</p></details>
    <div class="actions" style="margin-top:12px"><button class="btn secondary" onclick="speakText('${escAttr(l.lyric)}')">▶ 読み上げ</button><button class="btn green" onclick="toast('単語をタップして単語帳に追加できます')">単語をタップ</button></div>
  </div>`
}
function wordify(text,songId,lineNo,songTitle,artistName){
  return esc(text).split(/(\\s+)/).map(part=>{
    if(/^[A-Za-z][A-Za-z']*$/.test(part)){
      const clean=part.replace(/'/g,"&#039;");
      return `<span class="word" onclick="openWordModal('${escAttr(part)}','${songId}',${lineNo},'${escAttr(songTitle||"")}','${escAttr(artistName||"")}')">${clean}</span>`;
    }
    return part;
  }).join("");
}
async function autoFillFromYoutube(){
  const url=qs("#youtubeUrl").value.trim();
  if(!url){toast("YouTube URLを入力してください");return}
  const videoId=extractYoutubeId(url);
  let titleText="", channelText="";
  try{
    if(window.YOUTUBE_API_KEY && window.YOUTUBE_API_KEY.length>10){
      const res=await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${window.YOUTUBE_API_KEY}`);
      const json=await res.json();
      const item=json.items?.[0];
      if(item){titleText=item.snippet.title||""; channelText=item.snippet.channelTitle||""}
    }
  }catch(e){console.warn(e)}
  if(!titleText){
    const known={"JGwWNGJdvx8":{title:"Shape of You",artist:"Ed Sheeran",genre:"Pop",profile:makeArtistProfile("Ed Sheeran")}};
    if(known[videoId]){applySongGuess(known[videoId]);toast("曲名・アーティストを自動入力しました");return}
    titleText=videoId||"Unknown Song";channelText="Artist Name";
  }
  applySongGuess(parseYoutubeTitle(titleText,channelText));
  toast("YouTube情報から曲名・アーティストを推定しました");
}
function extractYoutubeId(url){
  try{const u=new URL(url); if(u.hostname.includes("youtu.be"))return u.pathname.split("/").filter(Boolean)[0]||""; return u.searchParams.get("v")||u.pathname.split("/").filter(Boolean).pop()||""}catch(e){return url}
}
function parseYoutubeTitle(title,channel){
  let clean=title.replace(/\\[[^\\]]*\\]/g," ").replace(/\\([^\\)]*(official|lyrics?|audio|video|mv|hd|4k)[^\\)]*\\)/ig," ").replace(/\\bOfficial\\b|\\bMusic Video\\b|\\bLyric Video\\b|\\bLyrics\\b|\\bAudio\\b/ig," ").replace(/\\s+/g," ").trim();
  let artist=(channel||"").replace(/ - Topic$/i,"").replace(/VEVO$/i,"").trim(), song=clean;
  for(const sp of [" - "," – "," — "]){
    if(clean.includes(sp)){const parts=clean.split(sp).map(x=>x.trim()).filter(Boolean); if(parts.length>=2){artist=parts[0]; song=parts.slice(1).join(" - "); break}}
  }
  return {title:song||clean||"Unknown Song",artist:artist||"Artist Name",genre:"Pop",profile:makeArtistProfile(artist||channel||"このアーティスト")};
}
function makeArtistProfile(artist){
  const profiles={
    "Ed Sheeran":"Ed Sheeranはイギリス出身のシンガーソングライター。アコースティックなサウンドとポップなメロディ、恋愛や日常をテーマにした分かりやすい歌詞が特徴。英語学習では、自然な会話表現や前置詞の使い方を学びやすいアーティストです。",
    "Taylor Swift":"Taylor Swiftはアメリカ出身のシンガーソングライター。恋愛、人生、感情の変化を物語のように描く歌詞が特徴。日常英語、比喩表現、時制の使い分けを学びやすいアーティストです。",
    "Coldplay":"Coldplayはイギリスのロックバンド。壮大なメロディと感情的な歌詞が特徴。シンプルな単語で深い意味を表す表現が多く、英語学習にも向いています。"
  };
  return profiles[artist]||`${artist}は、洋楽を通じて英語表現を学ぶのに適したアーティストです。歌詞には日常的な単語、感情表現、前置詞、動詞表現が含まれるため、和訳だけでなく文法や語感も合わせて学べます。プロフィールは後から編集できます。`;
}
function applySongGuess(g){qs("#songTitle").value=g.title||"";qs("#artistName").value=g.artist||"";qs("#genre").value=g.genre||"Pop";qs("#artistProfile").value=g.profile||makeArtistProfile(g.artist||"このアーティスト")}
function analyzeLyrics(){
  const raw=qs("#lyricsRaw").value.trim();
  if(!raw){toast("歌詞を貼り付けてください");return}
  currentAnalysis=raw.split(/\\n+/).map((line,i)=>makeLine(line.trim(),i+1)).filter(l=>l.lyric);
  qs("#analysisPreview").innerHTML=currentAnalysis.map(l=>lineHtml(l,"preview","","")).join("");
  toast("AI分析風の解説を生成しました");
}
function translateLine(line){
  const exact={
    "The club isn't the best place to find a lover":"クラブは恋人を見つけるのに一番良い場所ではない",
    "So the bar is where I go":"だから僕はバーへ行く",
    "I found a love for me":"僕は自分にぴったりの愛を見つけた",
    "We are dancing in the dark":"僕たちは暗闇の中で踊っている"
  };
  if(exact[line]) return exact[line];
  let t=line;
  const dict=[
    ["isn't","〜ではない"],["aren't","〜ではない"],["don't","〜しない"],["doesn't","〜しない"],["can't","〜できない"],
    ["love","愛"],["lover","恋人"],["best","一番良い"],["place","場所"],["find","見つける"],["club","クラブ"],["bar","バー"],["go","行く"],["dancing","踊っている"],["dark","暗闇"],["with","〜と一緒に"],["for","〜のために"],["to","〜へ / 〜するために"],["in","〜の中で"],["on","〜の上で"]
  ];
  dict.forEach(([en,ja])=>{t=t.replace(new RegExp("\\\\b"+en.trim()+"\\\\b","ig"),ja)});
  return t===line ? "この行は、前後の文脈に合わせて自然な日本語に訳します。" : t;
}
function makeLine(line,no){
  const words=line.replace(/[^\\w\\s']/g,"").split(/\\s+/).filter(Boolean);
  const prep=(line.match(/\\b(in|on|at|for|to|with|from|of|by|about|into|over|under|up|out|off|through|around)\\b/gi)||[]);
  const grammarParts=[];
  const subjectGuess=words[0]||"";
  const be=line.match(/\\b(am|is|are|was|were|isn't|aren't|wasn't|weren't|I'm|you're|we're|they're|it's|he's|she's)\\b/i);
  const aux=line.match(/\\b(do|does|did|don't|doesn't|didn't|will|would|can|could|should|must|have|has|had)\\b/i);
  const toInf=line.match(/\\bto\\s+[a-zA-Z']+\\b/g);
  const ing=line.match(/\\b[a-zA-Z]+ing\\b/g);
  const comp=line.match(/\\b(best|better|more|most|less|least)\\b/i);
  const neg=line.match(/\\b(not|isn't|aren't|don't|doesn't|didn't|won't|can't|never|no)\\b/i);
  grammarParts.push(`【文構造】文の先頭「${subjectGuess}」が主語候補です。英語は基本的に「主語 → 動詞 → 補足情報」の順で意味を作ります。`);
  if(be)grammarParts.push(`【be動詞】「${be[0]}」があります。be動詞は「A = B」の関係や状態を表します。否定形なら「AはBではない」という意味になります。`);
  if(aux)grammarParts.push(`【助動詞・時制】「${aux[0]}」に注目します。助動詞は後ろの動詞に、可能・意志・過去・否定などの意味を加えます。`);
  if(toInf)grammarParts.push(`【不定詞】「${toInf.join(" / ")}」があります。to + 動詞の原形は「〜すること」「〜するために」「〜するための」と訳せます。前の名詞を説明する場合は、名詞を後ろから説明します。`);
  if(ing)grammarParts.push(`【-ing形】「${ing.join(" / ")}」があります。進行形なら「〜している」、動名詞なら「〜すること」、形容詞的なら「〜している状態の」という意味になります。`);
  if(comp)grammarParts.push(`【比較表現】「${comp[0]}」が含まれています。best / better / more などは比較の表現で、「より〜」「最も〜」という意味を作ります。`);
  if(neg)grammarParts.push(`【否定】「${neg[0]}」が含まれています。短縮形 isn't は is not、don't は do not です。どの動詞を否定しているかを確認します。`);
  grammarParts.push("【自然な理解】歌詞では省略・口語・比喩が多いため、直訳だけでなく「この一文で何を伝えたいか」を考えると理解しやすくなります。");
  const vocabCandidates=[...new Set(words.filter(w=>w.length>=4).slice(0,8))];
  const vocabText=vocabCandidates.length?vocabCandidates.map(w=>`・${w}：重要語候補。意味・品詞・歌詞内での使われ方を確認しましょう。`).join("\\n"):"重要語候補は少なめです。";
  const notes={in:"in：空間・期間・状態の「中にいる」イメージ。",on:"on：何かに接している・乗っているイメージ。",at:"at：一点・場所・時刻を示すイメージ。",for:"for：目的・対象・期間。「〜のために」「〜にとって」。",to:"to：方向・到達点。to + 動詞なら不定詞。",with:"with：一緒・道具・関係。",from:"from：起点。「〜から」。",of:"of：所属・一部・関係。「〜の」。",by:"by：手段・作者・期限。「〜によって」。",about:"about：話題。「〜について」。"};
  const prepText=prep.length?[...new Set(prep.map(p=>p.toLowerCase()))].map(p=>notes[p]||`${p}：前後の単語をつなぎ、場所・方向・関係・目的などを表します。`).join("\\n"):"この行では目立つ前置詞はありません。";
  return {line_no:no,lyric:line,translation:translateLine(line),grammar:grammarParts.join("\\n\\n"),vocabulary:vocabText,preposition:prepText}
}
async function saveSong(){
  const id=qs("#editId").value||crypto.randomUUID();
  const raw=qs("#lyricsRaw").value.trim();
  const title=qs("#songTitle").value.trim();
  if(!title||!raw){toast("曲名と歌詞は必須です");return}
  const existing=songs.find(s=>s.id===id);
  const lines=currentAnalysis.length?currentAnalysis:raw.split(/\\n+/).map((line,i)=>makeLine(line.trim(),i+1)).filter(l=>l.lyric);
  const payload={id,title,artist_name:qs("#artistName").value.trim(),youtube_url:qs("#youtubeUrl").value.trim(),apple_music_url:qs("#appleUrl").value.trim(),genre:qs("#genre").value.trim(),difficulty:qs("#difficulty").value,artist_profile:qs("#artistProfile").value.trim(),lyrics_raw:raw,lyric_lines:lines,created_by:existing?.created_by||currentUser,updated_by:currentUser,updated_at:new Date().toISOString()};
  const {error}=await supabaseClient.from("songs").upsert(payload);
  if(error){toast("保存失敗: "+error.message);return}
  await addLog(`${currentUser} が「${title}」を保存しました`);
  clearForm(); await fetchSongs(); renderSongs(); await fetchLogs(); renderLog(); showScreen("home"); toast("保存しました");
}
function editSong(id){
  const s=songs.find(x=>x.id===id); if(!s)return;
  qs("#formTitle").textContent="曲を編集"; qs("#editId").value=s.id; qs("#youtubeUrl").value=s.youtube_url||""; qs("#songTitle").value=s.title||""; qs("#artistName").value=s.artist_name||""; qs("#appleUrl").value=s.apple_music_url||""; qs("#genre").value=s.genre||""; qs("#difficulty").value=s.difficulty||"初級"; qs("#artistProfile").value=s.artist_profile||""; qs("#lyricsRaw").value=s.lyrics_raw||""; currentAnalysis=s.lyric_lines||[]; qs("#analysisPreview").innerHTML=currentAnalysis.map(l=>lineHtml(l,s.id,s.title,s.artist_name)).join(""); showScreen("add");
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
  ["editId","youtubeUrl","songTitle","artistName","appleUrl","genre","artistProfile","lyricsRaw"].forEach(id=>qs("#"+id).value="");
  qs("#difficulty").value="初級"; qs("#formTitle").textContent="曲を追加"; qs("#analysisPreview").innerHTML="<p class='mini'>歌詞を貼り付けて「AI分析する」を押してください。</p>"; currentAnalysis=[];
}
function openWordModal(word,songId,lineNo,songTitle,artistName){
  if(songId==="preview"){toast("保存後に単語を追加できます");return}
  const clean=word.replace(/[^A-Za-z']/g,"").toLowerCase();
  const info=getWordInfo(clean);
  selectedWordContext={word:clean,songId,lineNo,songTitle,artistName};
  qs("#modalWord").textContent=clean;
  qs("#modalInfo").textContent=`${songTitle} / ${artistName}`;
  qs("#modalMeaning").value=info.meaning;
  qs("#modalPos").value=info.pos;
  qs("#modalMemo").value=info.memo;
  qs("#wordModal").style.display="flex";
}
function closeWordModal(){qs("#wordModal").style.display="none";selectedWordContext=null}
function getWordInfo(word){
  const d={
    club:["クラブ、社交場","名詞","場所を表す単語。歌詞では出会いの場として使われています。"],
    lover:["恋人、愛する人","名詞","loveから派生した単語。人を表します。"],
    best:["最も良い","形容詞","goodの最上級です。"],
    place:["場所","名詞","to不定詞で後ろから説明されやすい単語です。"],
    find:["見つける","動詞","目的語を取る一般動詞です。"],
    dancing:["踊っている、踊ること","動詞/動名詞","danceの-ing形です。"],
    dark:["暗闇、暗い","名詞/形容詞","in the darkで「暗闇の中で」。"],
    love:["愛、愛する","名詞/動詞","名詞にも動詞にもなります。"]
  };
  const v=d[word]||["意味を入力してください","品詞を入力してください","この単語が歌詞の中でどう使われているかメモしてください。"];
  return {meaning:v[0],pos:v[1],memo:v[2]};
}
async function addSelectedWordToVocab(){
  if(!selectedWordContext)return;
  const {word,songId,songTitle,artistName}=selectedWordContext;
  const {error}=await supabaseClient.from("vocabulary").insert({
    user_id:currentUser,
    song_id:songId,
    word,
    meaning:qs("#modalMeaning").value,
    part_of_speech:qs("#modalPos").value,
    memo:qs("#modalMemo").value,
    song_title:songTitle,
    artist_name:artistName,
    status:"復習中"
  });
  if(error){toast("単語追加失敗: "+error.message);return}
  await addLog(`${currentUser} が単語「${word}」を追加しました`);
  await fetchVocab(); renderVocab(); closeWordModal(); toast("単語帳に追加しました");
}
function renderVocab(){
  qs("#vocabView").innerHTML=vocab.length?`<h3>保存単語</h3>`+vocab.map(x=>`<div class="song-item"><div><h4>${esc(x.word)}</h4><div>${esc(x.meaning)}</div><div class="mini">${esc(x.part_of_speech||"")} / ${esc(x.song_title||"")} / ${esc(x.artist_name||"")} / ${fmt(x.created_at)}</div><div class="mini">${esc(x.memo||"")}</div></div><button class="btn red no-print" onclick="deleteVocab('${x.id}')">削除</button></div>`).join(""):`<p class="mini">単語はまだありません。</p>`;
}
async function deleteVocab(id){const {error}=await supabaseClient.from("vocabulary").delete().eq("id",id); if(error){toast("削除失敗: "+error.message);return} await fetchVocab(); renderVocab()}
function showPrintVocab(){qs("#vocabView").innerHTML=`<div class="print-area"><h2>Lyrics English 単語帳</h2><p>作成日：${new Date().toLocaleDateString()}</p>${vocab.map(x=>`<div class="vocab-row"><b>${esc(x.word)}</b>：${esc(x.meaning)}<br><small>${esc(x.part_of_speech||"")} / ${esc(x.song_title||"")} / ${esc(x.artist_name||"")}</small></div>`).join("")||"単語はまだありません。"}</div>`}
function renderLog(){qs("#realtimeLog").innerHTML=(logs||[]).map(x=>`・${esc(x.message)}<br><span class="mini">${fmt(x.created_at)}</span>`).join("<br>")||"変更待機中..."}
function speakText(text){
  if(!("speechSynthesis" in window)){toast("このブラウザは読み上げ非対応です");return}
  try{
    window.speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text);
    u.lang="en-US"; u.rate=0.9; u.pitch=1;
    const voices=window.speechSynthesis.getVoices();
    const en=voices.find(v=>v.lang && v.lang.toLowerCase().startsWith("en"));
    if(en)u.voice=en;
    window.speechSynthesis.speak(u);
  }catch(e){toast("読み上げを開始できませんでした")}
}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\\"":"&quot;","'":"&#039;"}[m]))}
function nl(s){return esc(s).replace(/\\n/g,"<br>")}
function escAttr(s){return esc(s).replace(/\\n/g," ").replace(/&#039;/g,"\\\\'")}
function fmt(s){return s?new Date(s).toLocaleString():""}
