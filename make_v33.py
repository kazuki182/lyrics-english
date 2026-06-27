import json, re
from pathlib import Path
p=Path('/mnt/data/v33work/lib/data.ts')
s=p.read_text()

def ex(en, ja, focus, obj=None, jaFocus=None):
    d={'en':en,'ja':ja,'focus':focus}
    if obj: d['object']=obj
    if jaFocus: d['jaFocus']=jaFocus
    return d

def meaning(i,id,title,pattern,trans,struct,image,point,examples,daily):
    return {'id':id,'title':f'{i} {title}','pattern':pattern,'transitivity':trans,'structure':struct,'image':image,'point':point,'examples':examples,'dailyExamples':daily}

def phrase(phrase, ja, image, pattern, examples, daily):
    return {'phrase':phrase,'ja':ja,'image':image,'pattern':pattern,'examples':examples,'dailyExamples':daily}

def make_run():
    v='run'
    return {
    'id':'run','rank':29,'word':'RUN','ipa':'/rʌn/','kana':'ラン','syllable':'run','transitivity':'自動詞・他動詞','importance':'★★★★★ 超重要',
    'core':'人・物・仕組みが止まらず動き続ける','coreDetail':'RUNは「走る」だけでなく、会議・事業・システム・予定が動き続ける感覚で使います。仕事では運営する、実行する、時間が流れる、問題が発生するなどに広がります。','coreVisual':{'from':['🏃 動く','⚙️ 稼働','📊 運営','⏱️ 時間','💻 実行'],'to':'前へ進む流れ','label':'止まらず動く'},
    'meanings':[
      meaning(1,'operate','運営する・動かす','RUN + 名詞','他動詞','S + V + O','会社・会議・仕組みを動かす。','run a meeting / run a business のように、仕事では「運営する」で非常によく使う。',[
        ex('She runs the sales meeting every Monday.','彼女は毎週月曜日に営業会議を運営しています。','runs','the sales meeting','運営しています'),ex('Our team runs the new project.','私たちのチームが新しい案件を進めています。','runs','the new project','進めています'),ex('He runs a small company in Tokyo.','彼は東京で小さな会社を経営しています。','runs','a small company','経営しています')],[ex('I run a small study group.','小さな勉強会を運営しています。','run','a small study group','運営しています'),ex('She runs a blog about music.','彼女は音楽ブログを運営しています。','runs','a blog','運営しています')]),
      meaning(2,'execute','実行する','RUN + プログラム / テスト','他動詞','S + V + O','作業やプログラムを実行する。','ITや業務確認では run a test / run the system が自然。',[ex('Please run the test before release.','リリース前にテストを実行してください。','run','the test','実行してください'),ex('We ran the report this morning.','今朝レポートを出力しました。','ran','the report','出力しました'),ex('The system runs automatically every night.','そのシステムは毎晩自動で稼働します。','runs',None,'稼働します')],[ex('I ran the app on my phone.','スマホでアプリを起動しました。','ran','the app','起動しました'),ex('This game runs smoothly.','このゲームはスムーズに動きます。','runs',None,'動きます')]),
      meaning(3,'continue','続く・継続する','RUN + 副詞 / 時間表現','自動詞','S + V','流れや状態が続く。','meeting runs late のように予定が長引く場合にも使う。',[ex('The meeting ran longer than expected.','会議は予定より長引きました。','ran',None,'長引きました'),ex('The campaign runs until the end of this month.','キャンペーンは今月末まで続きます。','runs',None,'続きます'),ex('This contract runs for one year.','この契約は1年間有効です。','runs',None,'有効です')],[ex('The event runs all weekend.','イベントは週末中続きます。','runs',None,'続きます'),ex('The movie runs for two hours.','その映画は2時間あります。','runs',None,'あります')]),
      meaning(4,'manage','担当する・管理する','RUN + 業務 / チーム','他動詞','S + V + O','チームや業務を回す。','manageよりカジュアルに「回す」「担当する」感覚で使える。',[ex('I run the customer support team.','私はカスタマーサポートチームを担当しています。','run','the customer support team','担当しています'),ex('Who runs this account?','この取引先は誰が担当していますか？','runs','this account','担当しています'),ex('She runs daily operations.','彼女は日々の業務を管理しています。','runs','daily operations','管理しています')],[ex('My brother runs the family schedule.','兄が家族の予定を管理しています。','runs','the family schedule','管理しています'),ex('I run most of the errands on weekends.','週末はたいてい私が用事を済ませます。','run','most of the errands','済ませます')]),
      meaning(5,'move-fast','走る・急いで行く','RUN','自動詞','S + V','人が素早く移動する。','基本の「走る」。仕事では急いで行くニュアンスでも使う。',[ex('I ran to the station after the meeting.','会議後、駅まで走りました。','ran',None,'走りました'),ex('He ran to the office because he was late.','彼は遅れそうだったのでオフィスへ走りました。','ran',None,'走りました'),ex('I have to run to the next meeting.','次の会議に急いで行かないといけません。','run',None,'急いで行かない')],[ex('I run every morning.','毎朝走っています。','run',None,'走っています'),ex('The kids ran to the park.','子どもたちは公園まで走りました。','ran',None,'走りました')]),
      meaning(6,'cost','費用がかかる','RUN + 金額','自動詞に近い表現','S + V + 金額','費用がその金額まで達する。','The cost runs to... はやや硬め。見積や費用説明で使える。',[ex('The repair cost may run to 500 dollars.','修理費は500ドルに達する可能性があります。','run',None,'達する'),ex('The total cost ran higher than expected.','総費用は想定より高くなりました。','ran',None,'高くなりました'),ex('The project expenses could run over budget.','案件費用が予算を超える可能性があります。','run',None,'超える')],[ex('The trip may run over our budget.','旅行費用が予算を超えるかもしれません。','run',None,'超える'),ex('The dinner bill ran higher than I expected.','夕食代は思ったより高くなりました。','ran',None,'高くなりました')]),
      meaning(7,'be-available','運行する・営業する','RUN','自動詞','S + V','電車・サービスが動いている。','電車やサービスの運行に使う。',[ex('The trains are running normally today.','今日は電車が通常通り運行しています。','running',None,'運行しています'),ex('The shuttle bus runs every 20 minutes.','シャトルバスは20分ごとに運行しています。','runs',None,'運行しています'),ex('The service runs from Monday to Friday.','そのサービスは月曜から金曜まで利用できます。','runs',None,'利用できます')],[ex('The buses run late at night.','バスは夜遅くまで運行しています。','run',None,'運行しています'),ex('This shop runs until nine.','この店は9時まで営業しています。','runs',None,'営業しています')]),
      meaning(8,'run-into','遭遇する','RUN INTO + 人 / 問題','句動詞的用法','S + V + 前置詞句','人や問題に偶然ぶつかる。','run into a problem は仕事で非常に便利。',[ex('We ran into a problem during testing.','テスト中に問題に直面しました。','ran into','a problem','直面しました'),ex('I ran into an issue with the data.','データで問題が発生しました。','ran into','an issue','発生しました'),ex('We may run into delays next week.','来週遅れが発生するかもしれません。','run into','delays','発生する')],[ex('I ran into an old friend yesterday.','昨日、昔の友人に偶然会いました。','ran into','an old friend','偶然会いました'),ex('We ran into heavy traffic.','ひどい渋滞に遭いました。','ran into','heavy traffic','遭いました')]),
      meaning(9,'run-out','なくなる','RUN OUT OF + 名詞','句動詞的用法','S + V + 前置詞句','手持ちのものが尽きる。','時間・在庫・予算がなくなる時に便利。',[ex('We are running out of time.','時間がなくなってきています。','running out of','time','なくなって'),ex('We ran out of stock last week.','先週在庫がなくなりました。','ran out of','stock','なくなりました'),ex('The team is running out of options.','チームの選択肢が少なくなっています。','running out of','options','少なくなっています')],[ex('I ran out of coffee this morning.','今朝コーヒーを切らしました。','ran out of','coffee','切らしました'),ex('My phone is running out of battery.','スマホの電池がなくなりそうです。','running out of','battery','なくなりそう')]),
      meaning(10,'run-by','確認する','RUN + 物 + BY + 人','他動詞','S + V + O + 前置詞句','相手に確認を通す。','run it by someone は「念のため確認する」。仕事でかなり自然。',[ex('Can I run this idea by you?','このアイデアをあなたに確認してもいいですか？','run','this idea','確認して'),ex('I will run the proposal by my manager.','提案書を上司に確認します。','run','the proposal','確認します'),ex('Please run the final draft by the client.','最終案をクライアントに確認してください。','run','the final draft','確認してください')],[ex('Let me run this plan by my family.','この計画を家族に確認させてください。','run','this plan','確認させて'),ex('I ran the idea by my friend.','そのアイデアを友人に相談しました。','ran','the idea','相談しました')])
    ],
    'collocations':[], 'phrasalVerbs':[]}

def simple_verb(id, rank, word, ipa, kana, core, detail, meaningspec, collocs, phrasals):
    return {'id':id,'rank':rank,'word':word,'ipa':ipa,'kana':kana,'syllable':id,'transitivity':'他動詞・自動詞','importance':'★★★★☆ 重要','core':core,'coreDetail':detail,'coreVisual':{'from':['📄 資料','📅 予定','👥 チーム','💬 連絡','✅ 判断'],'to':'仕事の流れ','label':'コアイメージ'},'meanings':meaningspec,'collocations':collocs,'phrasalVerbs':phrasals}

def make_meanings(verb, specs):
    arr=[]
    for i,spec in enumerate(specs,1):
        if len(spec)==6:
            mid,title,pat,img,point,exs=spec
        else:
            mid,title,pat,_unused,img,point,exs=spec
        arr.append(meaning(i,mid,title,pat,'他動詞・自動詞','S + V + O',img,point,exs,[ex(f'I {verb} this on weekends.',f'週末にこれを{title}ことがあります。',verb,'this',title),ex(f'It is useful to {verb} this in daily life.',f'日常生活でこれを{title}と便利です。',verb,'this',title)]))
    return arr

def make_phrases(v, items, kind='colloc'):
    arr=[]
    for ph,ja in items:
        f=ph
        arr.append(phrase(ph,ja,f'{ph} は仕事で「{ja}」場面に使いやすい表現。',ph.upper()+' + ...',[ex(f'I will {ph} this today.',f'今日これを{ja}します。',ph,'this',ja),ex(f'We need to {ph} the project.',f'その案件を{ja}する必要があります。',ph,'the project',ja),ex(f'Please {ph} it before the meeting.',f'会議前にそれを{ja}してください。',ph,'it',ja)],[ex(f'I often {ph} at home.',f'家でよく{ja}します。',ph,None,ja),ex(f'It helps to {ph} in daily life.',f'日常生活で{ja}できると役立ちます。',ph,None,ja)]))
    return arr

move = simple_verb('move',30,'MOVE','/muːv/','ムーヴ','位置・予定・状況を動かす','MOVEは物理的に動く・動かすだけでなく、予定を変更する、案件を前に進める、気持ちを動かす感覚で使います。',make_meanings('move',[
('change-schedule','予定を動かす','MOVE + 日程','予定を別の日や時間へ移す。','move the meeting は仕事でよく使う。',[ex('Can we move the meeting to Friday?','会議を金曜日に変更できますか？','move','the meeting','変更できますか'),ex('We moved the deadline to next week.','締切を来週に変更しました。','moved','the deadline','変更しました'),ex('Please move the call to the afternoon.','電話を午後に変更してください。','move','the call','変更してください')]),
('progress','進める','MOVE + 案件 / 仕事','仕事を前に進める。','move forward は「前に進める」。',[ex('We need to move this project forward.','この案件を前に進める必要があります。','move','this project','前に進める'),ex('Let us move the discussion forward.','議論を前に進めましょう。','move','the discussion','前に進めましょう'),ex('The team moved the plan forward.','チームは計画を前進させました。','moved','the plan','前進させました')]),
('transfer','移す・移動させる','MOVE + 名詞 + to 場所','物やデータを別の場所へ移す。','ファイルや在庫移動にも使える。',[ex('Please move the file to the shared folder.','ファイルを共有フォルダへ移してください。','move','the file','移してください'),ex('We moved the stock to another warehouse.','在庫を別の倉庫へ移しました。','moved','the stock','移しました'),ex('Can you move the data to the new system?','データを新システムへ移せますか？','move','the data','移せますか')]),
('relocate','引っ越す・移転する','MOVE to + 場所','人や会社が場所を変える。','office移転にも使う。',[ex('Our office moved to a new building.','弊社オフィスは新しいビルへ移転しました。','moved',None,'移転しました'),ex('The team moved to a larger room.','チームはより広い部屋へ移動しました。','moved',None,'移動しました'),ex('The branch will move next month.','支店は来月移転します。','move',None,'移転します')]),
('affect','心を動かす','MOVE + 人','人の感情を動かす。','受け身 be moved も多い。',[ex('His presentation moved the audience.','彼のプレゼンは聴衆の心を動かしました。','moved','the audience','心を動かしました'),ex('I was moved by her message.','彼女のメッセージに心を動かされました。','moved',None,'心を動かされました'),ex('The story moved many employees.','その話は多くの社員の心を動かしました。','moved','many employees','心を動かしました')]),
('act','行動する','MOVE quickly','自動詞','素早く行動する。','ビジネスで move quickly は「早く動く」。',[ex('We need to move quickly on this issue.','この件は早く動く必要があります。','move',None,'早く動く'),ex('The market is moving fast.','市場は速く動いています。','moving',None,'動いています'),ex('Let us move before the deadline.','締切前に動きましょう。','move',None,'動きましょう')]),
('convince','説得する・動かす','MOVE + 人 + to 動詞','人に行動を促す。','やや硬めだが使える。',[ex('The data moved the client to approve the plan.','データがクライアントに計画承認を促しました。','moved','the client','促しました'),ex('His explanation moved us to reconsider.','彼の説明で再検討する気になりました。','moved','us','気になりました'),ex('The result moved management to act.','その結果を受けて経営陣が動きました。','moved','management','動きました')]),
('change-topic','話題を移す','MOVE to + 議題','次の話題へ移る。','会議進行で便利。',[ex('Let us move to the next topic.','次の議題に移りましょう。','move',None,'移りましょう'),ex('Can we move to pricing now?','次に価格の話に移れますか？','move',None,'移れますか'),ex('We moved to the budget discussion.','予算の議論に移りました。','moved',None,'移りました')]),
('sell','売れる・動く','MOVE + 商品','商品が売れる。','在庫や売れ行きで使う。',[ex('This product moves well in summer.','この商品は夏によく売れます。','moves',None,'売れます'),ex('The new model moved faster than expected.','新モデルは想定より早く売れました。','moved',None,'売れました'),ex('Slow-moving items need a new strategy.','動きの遅い商品には新しい戦略が必要です。','moving',None,'動きの遅い')]),
('make-progress','進展する','MOVE ahead / along','自動詞','物事が進展する。','案件の進捗説明に使える。',[ex('The project is moving ahead smoothly.','案件は順調に進んでいます。','moving',None,'進んでいます'),ex('Everything is moving along as planned.','すべて予定通り進んでいます。','moving',None,'進んでいます'),ex('The negotiation moved slowly.','交渉はゆっくり進みました。','moved',None,'進みました')])]),make_phrases('move',[('move forward','前に進める'),('move ahead','進展する'),('move fast','素早く動く'),('move slowly','ゆっくり進む'),('move the deadline','締切を動かす'),('move the meeting','会議を変更する'),('move data','データを移す'),('move stock','在庫を移す'),('move location','場所を移す'),('move to the next topic','次の議題に移る')]),make_phrases('move',[('move on','次へ進む'),('move up','前倒しする'),('move back','後ろ倒しする'),('move into','入る・移転する'),('move out','退去する'),('move away','離れる'),('move along','進む'),('move around','動き回る'),('move over','横へずれる'),('move toward','向かう')]))

hold = simple_verb('hold',33,'HOLD','/hoʊld/','ホールド','手放さず保つ・場を持つ','HOLDは「持つ」だけでなく、会議を開く、状態を保つ、責任や権利を持つなど、何かを一定の位置に保つ感覚で使います。',make_meanings('hold',[
('meeting','開催する','HOLD + 会議 / イベント','会議やイベントを開く。','hold a meeting は仕事で最重要。',[ex('We will hold a meeting tomorrow.','明日会議を開きます。','hold','a meeting','開きます'),ex('The company held a training session.','会社は研修を開催しました。','held','a training session','開催しました'),ex('We hold weekly reviews every Friday.','毎週金曜日にレビュー会議を開いています。','hold','weekly reviews','開いています')]),
('keep','保つ','HOLD + 状態','状態を維持する。','hold steady などで使う。',[ex('Sales held steady this quarter.','今四半期の売上は安定していました。','held',None,'安定していました'),ex('Please hold the line for a moment.','少々お待ちください。','hold','the line','お待ちください'),ex('We need to hold the current price.','現在の価格を維持する必要があります。','hold','the current price','維持する')]),
('possess','持つ・保有する','HOLD + 権利 / 役職','権利や役職を保有する。','資格・株・役職などに使う。',[ex('She holds a senior position.','彼女は上級職に就いています。','holds','a senior position','就いています'),ex('The company holds the patent.','その会社が特許を保有しています。','holds','the patent','保有しています'),ex('He holds a license for this work.','彼はこの業務の資格を持っています。','holds','a license','持っています')]),
('delay','保留する','HOLD + 名詞','判断や処理を一時止める。','hold the order は保留する。',[ex('Please hold the order until we confirm the details.','詳細確認まで注文を保留してください。','hold','the order','保留してください'),ex('We held the decision for one week.','決定を1週間保留しました。','held','the decision','保留しました'),ex('Can you hold this request for now?','この依頼はいったん保留できますか？','hold','this request','保留できますか')]),
('believe','考えを持つ','HOLD + opinion/view','意見や考えを持つ。','やや硬めだが議論で使える。',[ex('I hold a different view on this issue.','この件について私は別の見方をしています。','hold','a different view','見方をしています'),ex('Management holds the same position.','経営陣も同じ立場です。','holds','the same position','同じ立場です'),ex('The client holds a strong opinion about quality.','顧客は品質について強い意見を持っています。','holds','a strong opinion','持っています')]),
('contain','収容する・入る','HOLD + 数量','容量として入る。','会場・箱・システム容量に使う。',[ex('The room holds 30 people.','その部屋は30人収容できます。','holds','30 people','収容できます'),ex('This folder holds all project files.','このフォルダに案件ファイルがすべて入っています。','holds','all project files','入っています'),ex('The system can hold more data.','そのシステムはより多くのデータを保持できます。','hold','more data','保持できます')]),
('phone','電話を切らず待つ','HOLD','自動詞','電話で待つ。','Can you hold? は電話で自然。',[ex('Can you hold for a moment?','少々お待ちいただけますか？','hold',None,'お待ち'),ex('Please hold while I check the schedule.','予定を確認しますのでお待ちください。','hold',None,'お待ちください'),ex('I was on hold for ten minutes.','10分間保留で待っていました。','hold',None,'保留で待って')]),
('responsible','責任を持つ','HOLD + 人 + responsible','責任を問う。','hold someone responsible は重要。',[ex('We hold the supplier responsible for the delay.','遅延について仕入先に責任があると考えています。','hold','the supplier','責任がある'),ex('The manager held me responsible for the mistake.','上司はそのミスについて私に責任があるとしました。','held','me','責任がある'),ex('We should hold each team accountable.','各チームに責任を持たせるべきです。','hold','each team','責任を持たせる')]),
('support','支える','HOLD + 名詞','物や考えを支える。','hold up は支える/持ちこたえる。',[ex('The data holds up our proposal.','そのデータが提案を支えています。','holds','our proposal','支えています'),ex('The plan held up under review.','その計画はレビューに耐えました。','held up',None,'耐えました'),ex('The structure holds the sign safely.','その構造が看板を安全に支えています。','holds','the sign','支えています')]),
('reserve','確保する','HOLD + 場所 / 予約','一時的に確保する。','席や枠の確保に使える。',[ex('Can you hold a seat for the client?','クライアント用に席を確保できますか？','hold','a seat','確保できますか'),ex('We held a room for the meeting.','会議用に部屋を確保しました。','held','a room','確保しました'),ex('Please hold this time slot.','この時間枠を確保してください。','hold','this time slot','確保してください')])]),make_phrases('hold',[('hold a meeting','会議を開く'),('hold a position','役職に就く'),('hold a license','資格を持つ'),('hold the line','電話で待つ'),('hold steady','安定を保つ'),('hold a seat','席を確保する'),('hold responsibility','責任を持つ'),('hold an event','イベントを開催する'),('hold data','データを保持する'),('hold a view','見解を持つ')]),make_phrases('hold',[('hold on','待つ'),('hold off','延期する'),('hold up','支える・遅らせる'),('hold back','控える'),('hold out','持ちこたえる'),('hold together','まとまる'),('hold onto','手放さない'),('hold over','延期する'),('hold down','維持する'),('hold against','不利に考える')]))

bring = simple_verb('bring',32,'BRING','/brɪŋ/','ブリング','こちら側へ持ってくる・もたらす','BRINGは物だけでなく、情報・人・結果・変化をこちら側へ持ってくる感覚です。仕事では資料提出、議題追加、成果をもたらす表現に使います。',make_meanings('bring',[
('carry','持ってくる','BRING + 名詞','相手のいる場所へ持ってくる。','資料・サンプル・PCなど仕事でよく使う。',[ex('Please bring the documents to the meeting.','会議に資料を持ってきてください。','bring','the documents','持ってきて'),ex('I brought the samples for the client.','クライアント用にサンプルを持参しました。','brought','the samples','持参しました'),ex('Can you bring your laptop tomorrow?','明日ノートPCを持ってきてもらえますか？','bring','your laptop','持ってきて')]),
('cause','もたらす','BRING + 結果','結果や変化を引き起こす。','bring results/change は仕事で便利。',[ex('This strategy brought good results.','この戦略は良い結果をもたらしました。','brought','good results','もたらしました'),ex('The new system will bring major changes.','新システムは大きな変化をもたらします。','bring','major changes','もたらします'),ex('Better communication brings fewer mistakes.','より良いコミュニケーションはミスを減らします。','brings','fewer mistakes','減らします')]),
('introduce','話題に出す','BRING UP + 話題','議題として持ち出す。','bring up は会議でよく使う。',[ex('I will bring up this issue in the meeting.','この件を会議で取り上げます。','bring up','this issue','取り上げます'),ex('She brought up a good point.','彼女は良い点を指摘しました。','brought up','a good point','指摘しました'),ex('Please bring up any concerns.','懸念点があれば挙げてください。','bring up','any concerns','挙げて')]),
('lead','連れてくる','BRING + 人','人をこちらへ連れてくる。','担当者やチーム参加に使う。',[ex('Can you bring the engineer to the call?','エンジニアを通話に参加させてもらえますか？','bring','the engineer','参加させて'),ex('We brought a specialist to the meeting.','専門家を会議に同席させました。','brought','a specialist','同席させました'),ex('Please bring your manager next time.','次回は上司も同席させてください。','bring','your manager','同席させて')]),
('provide','提供する','BRING + 価値 / 経験','価値や経験を提供する。','bring value は自然。',[ex('This service brings value to our clients.','このサービスは顧客に価値を提供します。','brings','value','提供します'),ex('He brings a lot of experience to the team.','彼はチームに多くの経験をもたらしています。','brings','a lot of experience','もたらしています'),ex('The partner brings technical knowledge.','そのパートナーは技術知識を提供します。','brings','technical knowledge','提供します')]),
('return','戻す','BRING + 物 + back','持ち帰る・戻す。','bring back は資料や話題を戻す。',[ex('Please bring back the signed contract.','署名済み契約書を持ち帰ってください。','bring back','the signed contract','持ち帰って'),ex('Let us bring the discussion back to cost.','議論を費用の話に戻しましょう。','bring','the discussion','戻しましょう'),ex('We need to bring back the previous version.','前の版に戻す必要があります。','bring back','the previous version','戻す')]),
('reduce','下げる','BRING + 名詞 + down','数字や費用を下げる。','bring down costs は頻出。',[ex('We need to bring down the cost.','コストを下げる必要があります。','bring down','the cost','下げる'),ex('The new process brought down errors.','新しい工程でミスが減りました。','brought down','errors','減りました'),ex('Can we bring the price down?','価格を下げられますか？','bring','the price','下げられますか')]),
('increase','引き上げる','BRING + 名詞 + up','水準を上げる。','bring up quality/level など。',[ex('We need to bring up the quality level.','品質レベルを上げる必要があります。','bring up','the quality level','上げる'),ex('Training brought up team performance.','研修でチームの成果が上がりました。','brought up','team performance','上がりました'),ex('Please bring the issue up with management.','その問題を経営陣に上げてください。','bring','the issue','上げて')]),
('make-happen','実現する','BRING + 名詞 + to life','アイデアを形にする。','bring to life は提案や企画に使える。',[ex('The design brought the concept to life.','そのデザインでコンセプトが形になりました。','brought','the concept','形になりました'),ex('We can bring this idea to life.','このアイデアを実現できます。','bring','this idea','実現できます'),ex('The team brought the project to life.','チームがその企画を実現しました。','brought','the project','実現しました')]),
('cause-state','状態にする','BRING + O + to 状態','特定の状態へ持っていく。','bring to a close などで使う。',[ex('Let us bring the meeting to a close.','会議を締めくくりましょう。','bring','the meeting','締めくくりましょう'),ex('The update brought the system back online.','更新によりシステムが復旧しました。','brought','the system','復旧しました'),ex('The report brought the issue to our attention.','その報告で私たちは問題に気づきました。','brought','the issue','気づきました')])]),make_phrases('bring',[('bring documents','資料を持ってくる'),('bring value','価値をもたらす'),('bring experience','経験をもたらす'),('bring a laptop','PCを持ってくる'),('bring a specialist','専門家を同席させる'),('bring change','変化をもたらす'),('bring results','結果をもたらす'),('bring a proposal','提案を持ってくる'),('bring attention','注意を向ける'),('bring closure','締めくくる')]),make_phrases('bring',[('bring up','取り上げる'),('bring back','戻す'),('bring down','下げる'),('bring in','導入する'),('bring out','引き出す'),('bring along','連れてくる'),('bring together','まとめる'),('bring about','引き起こす'),('bring over','持ってくる'),('bring forward','前倒しする')]))

leave = simple_verb('leave',29,'LEAVE','/liːv/','リーヴ','その場から離れる・何かを残す','LEAVEは場所を離れる、物やメッセージを残す、判断を相手に任せるなど「離れる/残す」の両方で使います。',make_meanings('leave',[
('depart','出発する・退社する','LEAVE + 場所','場所を離れる。','leave the office は退社する。',[ex('I will leave the office at six.','6時に退社します。','leave','the office','退社します'),ex('She left the meeting early.','彼女は会議を早めに退席しました。','left','the meeting','退席しました'),ex('We need to leave for the airport soon.','そろそろ空港へ出発する必要があります。','leave',None,'出発する')]),
('keep-behind','残す','LEAVE + 名詞','物や情報を残す。','leave a message は最重要。',[ex('Please leave a message after the tone.','発信音の後にメッセージを残してください。','leave','a message','残してください'),ex('I left the documents on your desk.','資料をあなたの机に置いておきました。','left','the documents','置いておきました'),ex('Can you leave your contact information?','連絡先を残していただけますか？','leave','your contact information','残して')]),
('make-state','〜の状態にしておく','LEAVE + O + C','物事をある状態のままにする。','leave it open など。',[ex('Please leave the door open.','ドアは開けたままにしてください。','leave','the door','開けたまま'),ex('We should leave this issue open for now.','この件はいったん未解決のままにしましょう。','leave','this issue','未解決のまま'),ex('Do not leave the system unlocked.','システムをロック解除のままにしないでください。','leave','the system','ロック解除のまま')]),
('entrust','任せる','LEAVE + O + to 人','判断や作業を任せる。','leave it to me は「任せて」。',[ex('Please leave this task to me.','この作業は私に任せてください。','leave','this task','任せて'),ex('We left the final decision to the client.','最終判断はクライアントに任せました。','left','the final decision','任せました'),ex('I will leave the details to the engineer.','詳細はエンジニアに任せます。','leave','the details','任せます')]),
('remain','残る','LEAVE + 数量 / 時間','残りがある状態を作る。','time left など。',[ex('We have three days left before the deadline.','締切まで残り3日あります。','left',None,'残り'),ex('There is little time left.','残り時間はほとんどありません。','left',None,'残り'),ex('The delay left us with fewer options.','遅延により選択肢が少なくなりました。','left','us','少なくなりました')]),
('quit','辞める','LEAVE + 会社 / 役職','会社や役職を離れる。','退職にも使う。',[ex('He left the company last month.','彼は先月退職しました。','left','the company','退職しました'),ex('She left her position in April.','彼女は4月に役職を離れました。','left','her position','役職を離れました'),ex('Many employees left after the merger.','合併後、多くの社員が退職しました。','left',None,'退職しました')]),
('forget','置き忘れる','LEAVE + 物 + 場所','物を置いてきてしまう。','忘れ物表現。',[ex('I left my laptop in the meeting room.','会議室にノートPCを置き忘れました。','left','my laptop','置き忘れました'),ex('She left her phone at the office.','彼女は会社にスマホを置き忘れました。','left','her phone','置き忘れました'),ex('Do not leave your ID card at home.','社員証を家に忘れないでください。','leave','your ID card','忘れないで')]),
('exclude','除外する','LEAVE + O + out','外しておく。','leave out は資料作成で使う。',[ex('Please leave out the old data.','古いデータは除外してください。','leave out','the old data','除外して'),ex('We left out the confidential details.','機密情報は省きました。','left out','the confidential details','省きました'),ex('Do not leave out this point.','この点を抜かさないでください。','leave out','this point','抜かさないで')]),
('result','結果を残す','LEAVE + 印象 / 影響','印象や影響を残す。','leave an impression は便利。',[ex('The presentation left a strong impression.','そのプレゼンは強い印象を残しました。','left','a strong impression','印象を残しました'),ex('The mistake left a negative impact.','そのミスは悪い影響を残しました。','left','a negative impact','影響を残しました'),ex('His support left a positive impression on the client.','彼のサポートは顧客に良い印象を残しました。','left','a positive impression','印象を残しました')]),
('postpone','そのままにする','LEAVE + O + for later','後回しにする。','判断を保留する表現。',[ex('Let us leave this topic for later.','この話題は後で扱いましょう。','leave','this topic','後で扱い'),ex('We can leave the minor issues for next week.','小さな問題は来週に回せます。','leave','the minor issues','回せます'),ex('Please leave the formatting until the end.','書式調整は最後まで残しておいてください。','leave','the formatting','残して')])]),make_phrases('leave',[('leave a message','メッセージを残す'),('leave the office','退社する'),('leave a note','メモを残す'),('leave time','時間を残す'),('leave room','余地を残す'),('leave a decision','判断を任せる'),('leave a document','資料を置いておく'),('leave an impression','印象を残す'),('leave a task','作業を残す'),('leave a question','質問を残す')]),make_phrases('leave',[('leave out','省く'),('leave behind','置いていく'),('leave for','出発する'),('leave off','中断する'),('leave aside','脇に置く'),('leave over','残す'),('leave alone','そのままにする'),('leave to','任せる'),('leave with','預ける'),('leave from','出発する')]))

# For run phrases fill now
run_obj=make_run()
run_obj['collocations']=make_phrases('run',[('run a meeting','会議を運営する'),('run a business','会社を経営する'),('run a test','テストを実行する'),('run a report','レポートを出す'),('run operations','業務を回す'),('run late','遅れる'),('run smoothly','順調に進む'),('run a campaign','キャンペーンを実施する'),('run the system','システムを稼働させる'),('run a project','案件を進める')])
run_obj['phrasalVerbs']=make_phrases('run',[('run into','遭遇する'),('run out of','なくなる'),('run by','確認する'),('run over','超過する'),('run through','一通り確認する'),('run across','偶然見つける'),('run after','追いかける'),('run away','逃げる'),('run up','積み上がる'),('run down','要約する')])

objs={'run':run_obj,'move':move,'hold':hold,'bring':bring,'leave':leave}

def find_obj(text, idv):
    pat=f'\n  {{\n    "id": "{idv}"'
    m=re.search(re.escape(pat), text)
    if not m: return None
    start=m.start()+1
    depth=0; in_str=False; esc=False
    for i,ch in enumerate(text[start:], start):
        if in_str:
            if esc: esc=False
            elif ch=='\\': esc=True
            elif ch=='"': in_str=False
        else:
            if ch=='"': in_str=True
            elif ch=='{': depth+=1
            elif ch=='}':
                depth-=1
                if depth==0:
                    end=i+1
                    # include following comma if present
                    if end < len(text) and text[end]==',': end+=1
                    return start,end
    return None

# Insert run before leave if missing
if find_obj(s,'run') is None:
    loc=find_obj(s,'leave')
    if not loc: raise SystemExit('leave not found')
    start,_=loc
    run_txt='  '+json.dumps(objs['run'],ensure_ascii=False,indent=4).replace('\n','\n  ')+',\n'
    s=s[:start]+run_txt+s[start:]

# replace existing top-level objs
for idv in ['move','hold','bring','leave']:
    loc=find_obj(s,idv)
    if not loc: raise SystemExit(f'{idv} not found')
    start,end=loc
    txt='  '+json.dumps(objs[idv],ensure_ascii=False,indent=4).replace('\n','\n  ')+','
    s=s[:start]+txt+s[end:]

p.write_text(s)
print('updated data.ts')
