export type Example = {
  en: string;
  ja: string;
  focus?: string;
  object?: string;
  jaFocus?: string;
};

export type MeaningBlock = {
  id: string;
  title: string;
  pattern: string;
  transitivity: string;
  structure: string;
  image: string;
  point: string;
  examples: Example[];
};

export type PhraseBlock = {
  phrase: string;
  ja: string;
  image: string;
  pattern: string;
  examples: Example[];
};

export type Verb = {
  id: string;
  rank: number;
  word: string;
  ipa: string;
  kana: string;
  syllable: string;
  transitivity: string;
  importance: string;
  core: string;
  coreDetail: string;
  meanings: MeaningBlock[];
  collocations: PhraseBlock[];
  phrasalVerbs: PhraseBlock[];
};

export const verbs: Verb[] = [
  {
    "id": "get",
    "rank": 1,
    "word": "GET",
    "ipa": "/ɡet/",
    "kana": "ゲット",
    "syllable": "get",
    "transitivity": "他動詞・自動詞",
    "importance": "★★★★★ 超重要",
    "core": "自分のものになる",
    "coreDetail": "物・情報・許可・機会・状態・場所が、自分の領域に入ってくるイメージ。社会人英語ではメール確認、承認取得、案件獲得、状況変化まで幅広く使う。",
    "meanings": [
      {
        "id": "obtain",
        "title": "① 手に入れる・獲得する",
        "pattern": "GET + 名詞",
        "transitivity": "他動詞",
        "structure": "S + get + O（目的語）",
        "image": "外にある物・案件・承認などを自分の側に取り込む。",
        "point": "get の後ろに「何を手に入れたか」を置く。仕事では client, project, approval, information などと相性が良い。",
        "examples": [
          {
            "en": "I got a new client this month.",
            "ja": "今月、新規顧客を獲得した。",
            "focus": "got",
            "object": "a new client",
            "jaFocus": "獲得した"
          },
          {
            "en": "We got a new project from the Singapore office.",
            "ja": "シンガポール本社から新しい案件を獲得した。",
            "focus": "got",
            "object": "a new project",
            "jaFocus": "獲得した"
          },
          {
            "en": "I got approval from my manager.",
            "ja": "上司の承認を得た。",
            "focus": "got",
            "object": "approval",
            "jaFocus": "得た"
          },
          {
            "en": "Did you get the information from the client?",
            "ja": "クライアントから情報を入手しましたか？",
            "focus": "get",
            "object": "the information",
            "jaFocus": "入手"
          },
          {
            "en": "We finally got the budget for this project.",
            "ja": "ようやくこの案件の予算を確保した。",
            "focus": "got",
            "object": "the budget",
            "jaFocus": "確保した"
          }
        ]
      },
      {
        "id": "become",
        "title": "② 〜になる",
        "pattern": "GET + 形容詞",
        "transitivity": "自動詞に近い使い方",
        "structure": "S + get + C（補語）",
        "image": "ある状態が自分や状況に入ってくる。",
        "point": "get の後ろに状態を表す形容詞を置く。busy, better, difficult, ready など社会人会話でよく使う。",
        "examples": [
          {
            "en": "Things are getting busy this week.",
            "ja": "今週は忙しくなってきている。",
            "focus": "getting",
            "jaFocus": "忙しくなって"
          },
          {
            "en": "The schedule is getting tight.",
            "ja": "スケジュールが厳しくなってきている。",
            "focus": "getting",
            "jaFocus": "厳しくなって"
          },
          {
            "en": "Our communication is getting better.",
            "ja": "私たちのコミュニケーションは良くなっている。",
            "focus": "getting",
            "jaFocus": "良くなって"
          },
          {
            "en": "The issue got complicated.",
            "ja": "その問題は複雑になった。",
            "focus": "got",
            "jaFocus": "複雑になった"
          },
          {
            "en": "Let's get ready for the meeting.",
            "ja": "会議の準備をしましょう。",
            "focus": "get",
            "jaFocus": "準備"
          }
        ]
      },
      {
        "id": "arrive",
        "title": "③ 到着する",
        "pattern": "GET TO + 場所 / GET HOME",
        "transitivity": "自動詞",
        "structure": "S + get + to 場所",
        "image": "目的地が自分の到達範囲に入る。",
        "point": "場所には get to を使う。ただし home は副詞なので get home。",
        "examples": [
          {
            "en": "I got to the office at nine.",
            "ja": "9時にオフィスに着いた。",
            "focus": "got",
            "jaFocus": "着いた"
          },
          {
            "en": "What time did you get to the meeting room?",
            "ja": "何時に会議室へ着きましたか？",
            "focus": "get",
            "jaFocus": "着きました"
          },
          {
            "en": "I got home late after the client meeting.",
            "ja": "クライアントとの会議後、遅く帰宅した。",
            "focus": "got",
            "jaFocus": "帰宅した"
          }
        ]
      },
      {
        "id": "understand",
        "title": "④ 理解する",
        "pattern": "GET + 内容",
        "transitivity": "他動詞",
        "structure": "S + get + O（内容）",
        "image": "意味や意図が自分の中に入ってくる。",
        "point": "I get it. は「分かりました」。ビジネスの短い返答で非常によく使える。",
        "examples": [
          {
            "en": "I get it.",
            "ja": "分かりました。",
            "focus": "get",
            "object": "it",
            "jaFocus": "分かりました"
          },
          {
            "en": "I don't get the point.",
            "ja": "要点が分かりません。",
            "focus": "get",
            "object": "the point",
            "jaFocus": "分かりません"
          },
          {
            "en": "Do you get what I mean?",
            "ja": "私の言いたいことは分かりますか？",
            "focus": "get",
            "jaFocus": "分かりますか"
          }
        ]
      },
      {
        "id": "receive",
        "title": "⑤ 受け取る・確認する",
        "pattern": "GET + メール・資料・連絡",
        "transitivity": "他動詞",
        "structure": "S + get + O（受け取るもの）",
        "image": "相手から来たものが自分のところに入る。",
        "point": "メール・資料・見積・連絡を受け取った時に使う。社会人には最重要。",
        "examples": [
          {
            "en": "I got your email.",
            "ja": "メールを確認しました。",
            "focus": "got",
            "object": "your email",
            "jaFocus": "確認しました"
          },
          {
            "en": "I got the report this morning.",
            "ja": "今朝、報告書を受け取りました。",
            "focus": "got",
            "object": "the report",
            "jaFocus": "受け取りました"
          },
          {
            "en": "I got the quotation from the supplier.",
            "ja": "仕入先から見積書を受け取りました。",
            "focus": "got",
            "object": "the quotation",
            "jaFocus": "受け取りました"
          },
          {
            "en": "Did you get my message?",
            "ja": "私のメッセージを確認しましたか？",
            "focus": "get",
            "object": "my message",
            "jaFocus": "確認しました"
          }
        ]
      },
      {
        "id": "permission",
        "title": "⑥ 許可を得る",
        "pattern": "GET + permission / approval",
        "transitivity": "他動詞",
        "structure": "S + get + O（許可・承認）",
        "image": "許可や承認が自分の側に来る。",
        "point": "permission は許可、approval は承認。社内確認や稟議の文脈で使いやすい。",
        "examples": [
          {
            "en": "I got permission to share the file.",
            "ja": "そのファイルを共有する許可を得ました。",
            "focus": "got",
            "object": "permission",
            "jaFocus": "許可を得ました"
          },
          {
            "en": "We need to get approval before ordering.",
            "ja": "発注前に承認を得る必要があります。",
            "focus": "get",
            "object": "approval",
            "jaFocus": "承認を得る"
          },
          {
            "en": "Did you get permission from your manager?",
            "ja": "上司から許可を得ましたか？",
            "focus": "get",
            "object": "permission",
            "jaFocus": "許可を得ましたか"
          }
        ]
      },
      {
        "id": "chance",
        "title": "⑦ 機会を得る",
        "pattern": "GET + chance / opportunity",
        "transitivity": "他動詞",
        "structure": "S + get + O（機会）",
        "image": "チャンスや機会が自分のところに来る。",
        "point": "chance は会話寄り、opportunity は少し丁寧。",
        "examples": [
          {
            "en": "I got a chance to join the meeting.",
            "ja": "会議に参加する機会を得ました。",
            "focus": "got",
            "object": "a chance",
            "jaFocus": "機会を得ました"
          },
          {
            "en": "We got an opportunity to work with a new client.",
            "ja": "新しい顧客と仕事をする機会を得ました。",
            "focus": "got",
            "object": "an opportunity",
            "jaFocus": "機会を得ました"
          },
          {
            "en": "I finally got a chance to speak with him.",
            "ja": "ようやく彼と話す機会を得ました。",
            "focus": "got",
            "object": "a chance",
            "jaFocus": "機会を得ました"
          }
        ]
      },
      {
        "id": "sick",
        "title": "⑧ 体調が悪くなる",
        "pattern": "GET + sick / tired / stressed",
        "transitivity": "自動詞に近い使い方",
        "structure": "S + get + C（状態）",
        "image": "体調や感情の状態が自分に入る。",
        "point": "社会人会話では体調・疲労・ストレスの変化を自然に言える。",
        "examples": [
          {
            "en": "I got sick last week.",
            "ja": "先週、体調を崩しました。",
            "focus": "got",
            "jaFocus": "体調を崩しました"
          },
          {
            "en": "I got tired after the long meeting.",
            "ja": "長い会議の後で疲れました。",
            "focus": "got",
            "jaFocus": "疲れました"
          },
          {
            "en": "I get stressed when deadlines are tight.",
            "ja": "締切が厳しいとストレスを感じます。",
            "focus": "get",
            "jaFocus": "ストレスを感じます"
          }
        ]
      },
      {
        "id": "buy",
        "title": "⑨ 買う・入手する",
        "pattern": "GET + 物",
        "transitivity": "他動詞",
        "structure": "S + get + O（買った物・入手した物）",
        "image": "買ったもの・入手したものを自分のものにする。",
        "point": "buy よりカジュアルに「買う・入手する」を表せる。",
        "examples": [
          {
            "en": "Where did you get that laptop?",
            "ja": "そのノートPCはどこで買いましたか？",
            "focus": "get",
            "object": "that laptop",
            "jaFocus": "買いました"
          },
          {
            "en": "I got this monitor online.",
            "ja": "このモニターはオンラインで買いました。",
            "focus": "got",
            "object": "this monitor",
            "jaFocus": "買いました"
          },
          {
            "en": "Can we get new samples by Friday?",
            "ja": "金曜日までに新しいサンプルを入手できますか？",
            "focus": "get",
            "object": "new samples",
            "jaFocus": "入手できますか"
          }
        ]
      },
      {
        "id": "make_happen",
        "title": "⑩ 〜してもらう・動かす",
        "pattern": "GET + 人 + to 動詞",
        "transitivity": "他動詞",
        "structure": "S + get + 人 + to do",
        "image": "人が動いてくれる状態を作る。",
        "point": "少し上級だが、仕事では「誰かに〜してもらう」でよく使える。",
        "examples": [
          {
            "en": "I'll get Tanaka to check the document.",
            "ja": "田中さんに資料を確認してもらいます。",
            "focus": "get",
            "jaFocus": "確認してもらいます"
          },
          {
            "en": "Can you get the supplier to send the samples?",
            "ja": "仕入先にサンプルを送ってもらえますか？",
            "focus": "get",
            "jaFocus": "送ってもらえますか"
          },
          {
            "en": "We need to get the team to agree on this.",
            "ja": "チームにこの件で合意してもらう必要があります。",
            "focus": "get",
            "jaFocus": "合意してもらう"
          }
        ]
      }
    ],
    "collocations": [
      {
        "phrase": "get ready",
        "ja": "準備する",
        "image": "ready（準備できた状態）になる。会議・出張・商談前によく使う。",
        "pattern": "get + 形容詞",
        "examples": [
          {
            "en": "Let's get ready for the client meeting.",
            "ja": "クライアントとの会議の準備をしましょう。",
            "focus": "get ready",
            "jaFocus": "準備"
          },
          {
            "en": "I'm getting ready for the presentation.",
            "ja": "プレゼンの準備をしています。",
            "focus": "getting ready",
            "jaFocus": "準備"
          },
          {
            "en": "Please get ready by three.",
            "ja": "3時までに準備してください。",
            "focus": "get ready",
            "jaFocus": "準備"
          }
        ]
      },
      {
        "phrase": "get better",
        "ja": "良くなる・改善する",
        "image": "better（より良い状態）になる。能力・状況・体調に使える。",
        "pattern": "get + 形容詞",
        "examples": [
          {
            "en": "Our process is getting better.",
            "ja": "私たちのプロセスは改善しています。",
            "focus": "getting better",
            "jaFocus": "改善"
          },
          {
            "en": "Your presentation is getting better.",
            "ja": "あなたのプレゼンは良くなっています。",
            "focus": "getting better",
            "jaFocus": "良くなって"
          },
          {
            "en": "The situation will get better soon.",
            "ja": "状況はすぐに良くなるでしょう。",
            "focus": "get better",
            "jaFocus": "良くなる"
          }
        ]
      },
      {
        "phrase": "get worse",
        "ja": "悪化する",
        "image": "worse（より悪い状態）になる。問題・状況・体調に使う。",
        "pattern": "get + 形容詞",
        "examples": [
          {
            "en": "The issue is getting worse.",
            "ja": "その問題は悪化しています。",
            "focus": "getting worse",
            "jaFocus": "悪化"
          },
          {
            "en": "The delay got worse last week.",
            "ja": "先週、遅延がさらに悪化しました。",
            "focus": "got worse",
            "jaFocus": "悪化"
          },
          {
            "en": "We should act before things get worse.",
            "ja": "状況が悪化する前に対応すべきです。",
            "focus": "get worse",
            "jaFocus": "悪化"
          }
        ]
      },
      {
        "phrase": "get started",
        "ja": "始める",
        "image": "started（始まった状態）になる。会議や作業開始に便利。",
        "pattern": "get + 過去分詞",
        "examples": [
          {
            "en": "Let's get started.",
            "ja": "始めましょう。",
            "focus": "get started",
            "jaFocus": "始め"
          },
          {
            "en": "We should get started with the agenda.",
            "ja": "議題から始めましょう。",
            "focus": "get started",
            "jaFocus": "始め"
          },
          {
            "en": "Can we get started now?",
            "ja": "今始めてもいいですか？",
            "focus": "get started",
            "jaFocus": "始め"
          }
        ]
      },
      {
        "phrase": "get involved",
        "ja": "関わる",
        "image": "involved（関わっている状態）になる。案件やプロジェクト参加に使う。",
        "pattern": "get + 過去分詞",
        "examples": [
          {
            "en": "I got involved in this project last month.",
            "ja": "先月このプロジェクトに関わるようになりました。",
            "focus": "got involved",
            "jaFocus": "関わる"
          },
          {
            "en": "We need to get the sales team involved.",
            "ja": "営業チームにも関わってもらう必要があります。",
            "focus": "get involved",
            "jaFocus": "関わって"
          },
          {
            "en": "He got involved in the discussion.",
            "ja": "彼はその議論に参加しました。",
            "focus": "got involved",
            "jaFocus": "参加"
          }
        ]
      },
      {
        "phrase": "get used to",
        "ja": "慣れる",
        "image": "used to（慣れている状態）になる。新しい仕事・環境に使う。",
        "pattern": "get used to + 名詞 / 動名詞",
        "examples": [
          {
            "en": "I'm getting used to the new system.",
            "ja": "新しいシステムに慣れてきました。",
            "focus": "getting used to",
            "jaFocus": "慣れて"
          },
          {
            "en": "It takes time to get used to remote work.",
            "ja": "リモートワークに慣れるには時間がかかります。",
            "focus": "get used to",
            "jaFocus": "慣れる"
          },
          {
            "en": "Have you got used to the new process?",
            "ja": "新しい手順には慣れましたか？",
            "focus": "got used to",
            "jaFocus": "慣れました"
          }
        ]
      },
      {
        "phrase": "get tired",
        "ja": "疲れる",
        "image": "tired（疲れた状態）になる。体力・集中力の低下を表す。",
        "pattern": "get + 形容詞",
        "examples": [
          {
            "en": "I get tired after back-to-back meetings.",
            "ja": "連続会議の後は疲れます。",
            "focus": "get tired",
            "jaFocus": "疲れ"
          },
          {
            "en": "She got tired during the long call.",
            "ja": "彼女は長い電話中に疲れました。",
            "focus": "got tired",
            "jaFocus": "疲れ"
          },
          {
            "en": "Don't get too tired before the presentation.",
            "ja": "プレゼン前に疲れすぎないでください。",
            "focus": "get too tired",
            "jaFocus": "疲れすぎ"
          }
        ]
      },
      {
        "phrase": "get angry",
        "ja": "怒る",
        "image": "angry（怒った状態）になる。感情変化に使う。",
        "pattern": "get + 形容詞",
        "examples": [
          {
            "en": "The client got angry about the delay.",
            "ja": "クライアントは遅延について怒りました。",
            "focus": "got angry",
            "jaFocus": "怒りました"
          },
          {
            "en": "Don't get angry during the meeting.",
            "ja": "会議中に怒らないでください。",
            "focus": "get angry",
            "jaFocus": "怒らない"
          },
          {
            "en": "He gets angry when reports are late.",
            "ja": "報告書が遅れると彼は怒ります。",
            "focus": "gets angry",
            "jaFocus": "怒ります"
          }
        ]
      },
      {
        "phrase": "get close",
        "ja": "近づく",
        "image": "close（近い状態）になる。期限・目標・関係性に使える。",
        "pattern": "get + 形容詞",
        "examples": [
          {
            "en": "We are getting close to the deadline.",
            "ja": "締切が近づいています。",
            "focus": "getting close",
            "jaFocus": "近づいて"
          },
          {
            "en": "The team got close to the target.",
            "ja": "チームは目標に近づきました。",
            "focus": "got close",
            "jaFocus": "近づき"
          },
          {
            "en": "Let's get close to the final design.",
            "ja": "最終デザインに近づけましょう。",
            "focus": "get close",
            "jaFocus": "近づけ"
          }
        ]
      },
      {
        "phrase": "get serious",
        "ja": "本気になる・深刻になる",
        "image": "serious（本気・深刻な状態）になる。仕事の温度感に使える。",
        "pattern": "get + 形容詞",
        "examples": [
          {
            "en": "We need to get serious about quality.",
            "ja": "品質について本気で取り組む必要があります。",
            "focus": "get serious",
            "jaFocus": "本気で"
          },
          {
            "en": "The problem is getting serious.",
            "ja": "その問題は深刻になっています。",
            "focus": "getting serious",
            "jaFocus": "深刻"
          },
          {
            "en": "Management got serious about the issue.",
            "ja": "経営陣はその問題に本腰を入れました。",
            "focus": "got serious",
            "jaFocus": "本腰"
          }
        ]
      }
    ],
    "phrasalVerbs": [
      {
        "phrase": "get up",
        "ja": "起きる・立ち上がる",
        "image": "up は上方向。体や状態が上に起きるイメージ。",
        "pattern": "get + up",
        "examples": [
          {
            "en": "I get up at six on weekdays.",
            "ja": "平日は6時に起きます。",
            "focus": "get up",
            "jaFocus": "起き"
          },
          {
            "en": "He got up and explained the issue.",
            "ja": "彼は立ち上がって問題を説明しました。",
            "focus": "got up",
            "jaFocus": "立ち上がって"
          },
          {
            "en": "What time do you get up for work?",
            "ja": "仕事の日は何時に起きますか？",
            "focus": "get up",
            "jaFocus": "起きます"
          }
        ]
      },
      {
        "phrase": "get out",
        "ja": "出る・抜け出す",
        "image": "out は外へ。場所・状況から外に出る。",
        "pattern": "get + out",
        "examples": [
          {
            "en": "Let's get out of the meeting room.",
            "ja": "会議室を出ましょう。",
            "focus": "get out",
            "jaFocus": "出ましょう"
          },
          {
            "en": "We need to get out of this situation.",
            "ja": "この状況から抜け出す必要があります。",
            "focus": "get out",
            "jaFocus": "抜け出す"
          },
          {
            "en": "He got out of the contract.",
            "ja": "彼はその契約から抜けました。",
            "focus": "got out",
            "jaFocus": "抜けました"
          }
        ]
      },
      {
        "phrase": "get in",
        "ja": "入る・到着する",
        "image": "in は中へ。建物・車・状況に入る。",
        "pattern": "get + in",
        "examples": [
          {
            "en": "What time did you get in today?",
            "ja": "今日は何時に出社しましたか？",
            "focus": "get in",
            "jaFocus": "出社"
          },
          {
            "en": "Please get in the car.",
            "ja": "車に乗ってください。",
            "focus": "get in",
            "jaFocus": "乗って"
          },
          {
            "en": "The order got in yesterday.",
            "ja": "注文は昨日入りました。",
            "focus": "got in",
            "jaFocus": "入りました"
          }
        ]
      },
      {
        "phrase": "get on",
        "ja": "乗る・進める",
        "image": "on は接触・継続。乗り物に乗る、仕事を進める。",
        "pattern": "get + on",
        "examples": [
          {
            "en": "I got on the train at Shinjuku.",
            "ja": "新宿で電車に乗りました。",
            "focus": "got on",
            "jaFocus": "乗りました"
          },
          {
            "en": "Let's get on with the task.",
            "ja": "その作業を進めましょう。",
            "focus": "get on",
            "jaFocus": "進め"
          },
          {
            "en": "How are you getting on with the project?",
            "ja": "その案件は順調に進んでいますか？",
            "focus": "getting on",
            "jaFocus": "進んで"
          }
        ]
      },
      {
        "phrase": "get off",
        "ja": "降りる・離れる",
        "image": "off は離れる。乗り物・仕事・電話から離れる。",
        "pattern": "get + off",
        "examples": [
          {
            "en": "I got off the train at Tokyo Station.",
            "ja": "東京駅で電車を降りました。",
            "focus": "got off",
            "jaFocus": "降りました"
          },
          {
            "en": "I just got off a call with the client.",
            "ja": "クライアントとの電話が今終わりました。",
            "focus": "got off",
            "jaFocus": "終わりました"
          },
          {
            "en": "What time do you get off work?",
            "ja": "何時に仕事が終わりますか？",
            "focus": "get off",
            "jaFocus": "終わります"
          }
        ]
      },
      {
        "phrase": "get back",
        "ja": "戻る・折り返す",
        "image": "back は戻る。場所・連絡・状態が戻る。",
        "pattern": "get + back",
        "examples": [
          {
            "en": "I'll get back to you by tomorrow.",
            "ja": "明日までに折り返します。",
            "focus": "get back",
            "jaFocus": "折り返し"
          },
          {
            "en": "I got back to the office after lunch.",
            "ja": "昼食後にオフィスへ戻りました。",
            "focus": "got back",
            "jaFocus": "戻りました"
          },
          {
            "en": "Can we get back to the main topic?",
            "ja": "本題に戻れますか？",
            "focus": "get back",
            "jaFocus": "戻れます"
          }
        ]
      },
      {
        "phrase": "get over",
        "ja": "乗り越える",
        "image": "over は越える。問題や困難を越えて向こう側へ行く。",
        "pattern": "get + over + 名詞",
        "examples": [
          {
            "en": "We got over the first problem.",
            "ja": "最初の問題を乗り越えました。",
            "focus": "got over",
            "jaFocus": "乗り越え"
          },
          {
            "en": "It took time to get over the mistake.",
            "ja": "そのミスを乗り越えるのに時間がかかりました。",
            "focus": "get over",
            "jaFocus": "乗り越える"
          },
          {
            "en": "She got over the pressure quickly.",
            "ja": "彼女はプレッシャーをすぐに乗り越えました。",
            "focus": "got over",
            "jaFocus": "乗り越え"
          }
        ]
      },
      {
        "phrase": "get through",
        "ja": "やり切る・通じる",
        "image": "through は通り抜ける。仕事・困難・電話を通過する。",
        "pattern": "get + through",
        "examples": [
          {
            "en": "We got through the busy season.",
            "ja": "繁忙期を乗り切りました。",
            "focus": "got through",
            "jaFocus": "乗り切り"
          },
          {
            "en": "I couldn't get through to him.",
            "ja": "彼に電話がつながりませんでした。",
            "focus": "get through",
            "jaFocus": "つながり"
          },
          {
            "en": "Let's get through these tasks today.",
            "ja": "今日これらの作業をやり切りましょう。",
            "focus": "get through",
            "jaFocus": "やり切り"
          }
        ]
      },
      {
        "phrase": "get along",
        "ja": "うまくやる",
        "image": "along は一緒に進む。人間関係がうまく進む。",
        "pattern": "get + along",
        "examples": [
          {
            "en": "I get along with my team.",
            "ja": "チームとうまくやっています。",
            "focus": "get along",
            "jaFocus": "うまく"
          },
          {
            "en": "Do you get along with the new manager?",
            "ja": "新しい上司とうまくやっていますか？",
            "focus": "get along",
            "jaFocus": "うまく"
          },
          {
            "en": "They got along well during the project.",
            "ja": "彼らはその案件中うまくやっていました。",
            "focus": "got along",
            "jaFocus": "うまく"
          }
        ]
      },
      {
        "phrase": "get away",
        "ja": "離れる・抜け出す",
        "image": "away は離れていく。場所・仕事・問題から離れる。",
        "pattern": "get + away",
        "examples": [
          {
            "en": "I need to get away from work for a while.",
            "ja": "少し仕事から離れる必要があります。",
            "focus": "get away",
            "jaFocus": "離れる"
          },
          {
            "en": "We can't get away from this issue.",
            "ja": "この問題から逃れることはできません。",
            "focus": "get away",
            "jaFocus": "逃れる"
          },
          {
            "en": "He got away early today.",
            "ja": "彼は今日早めに退社しました。",
            "focus": "got away",
            "jaFocus": "退社"
          }
        ]
      }
    ]
  },
  {
    "id": "take",
    "rank": 2,
    "word": "TAKE",
    "ipa": "/teɪk/",
    "kana": "テイク",
    "syllable": "take",
    "transitivity": "他動詞中心",
    "importance": "★★★★★ 超重要",
    "core": "自分の側に引き受ける",
    "coreDetail": "物・時間・責任・行動・役割を自分の側に取って扱うイメージ。仕事では「責任を負う」「時間がかかる」「対応する」「引き継ぐ」で頻出。",
    "meanings": [
      {
        "id": "responsibility",
        "title": "① 責任を引き受ける",
        "pattern": "TAKE + responsibility / charge",
        "transitivity": "他動詞",
        "structure": "S + take + O",
        "image": "責任や担当を自分の側に引き受ける。",
        "point": "仕事では take responsibility / take charge / take ownership が重要。誰が担当するかを明確にする表現。",
        "examples": [
          {
            "en": "I will take responsibility for this project.",
            "ja": "この案件の責任は私が負います。",
            "focus": "take responsibility",
            "jaFocus": "責任"
          },
          {
            "en": "She took charge of the meeting.",
            "ja": "彼女が会議を取り仕切りました。",
            "focus": "took charge",
            "jaFocus": "取り仕切り"
          },
          {
            "en": "We need to take ownership of this issue.",
            "ja": "この問題は私たちが責任を持って対応する必要があります。",
            "focus": "take ownership",
            "jaFocus": "責任を持って"
          }
        ]
      },
      {
        "id": "time",
        "title": "② 時間がかかる",
        "pattern": "TAKE + 時間",
        "transitivity": "他動詞",
        "structure": "It / This + takes + 時間",
        "image": "時間を自分の中で消費するイメージ。",
        "point": "作業時間や納期感を伝える時に必須。It takes ... / This will take ... が基本。",
        "examples": [
          {
            "en": "This task will take about two hours.",
            "ja": "この作業は約2時間かかります。",
            "focus": "will take",
            "jaFocus": "かかります",
            "object": "about two hours"
          },
          {
            "en": "It took longer than expected.",
            "ja": "予想より時間がかかりました。",
            "focus": "took",
            "jaFocus": "かかりました"
          },
          {
            "en": "How long will the approval process take?",
            "ja": "承認プロセスにはどのくらい時間がかかりますか？",
            "focus": "take",
            "jaFocus": "かかります"
          }
        ]
      },
      {
        "id": "action",
        "title": "③ 行動を取る",
        "pattern": "TAKE + action / steps / measures",
        "transitivity": "他動詞",
        "structure": "S + take + O",
        "image": "必要な対応を自分の側で実行する。",
        "point": "ビジネスでは take action, take steps, take measures が非常によく使われる。",
        "examples": [
          {
            "en": "We need to take action immediately.",
            "ja": "すぐに対応する必要があります。",
            "focus": "take action",
            "jaFocus": "対応"
          },
          {
            "en": "The team took steps to reduce costs.",
            "ja": "チームはコスト削減に向けて手を打ちました。",
            "focus": "took steps",
            "jaFocus": "手を打ち"
          },
          {
            "en": "We should take measures to prevent delays.",
            "ja": "遅延を防ぐ対策を取るべきです。",
            "focus": "take measures",
            "jaFocus": "対策を取る"
          }
        ]
      },
      {
        "id": "notes",
        "title": "④ メモ・記録を取る",
        "pattern": "TAKE + notes / minutes",
        "transitivity": "他動詞",
        "structure": "S + take + O",
        "image": "情報を自分の手元に記録として取る。",
        "point": "会議では take notes / take minutes が基本。minutes は議事録。",
        "examples": [
          {
            "en": "Let me take notes during the meeting.",
            "ja": "会議中に私がメモを取ります。",
            "focus": "take notes",
            "jaFocus": "メモ"
          },
          {
            "en": "Can you take the minutes today?",
            "ja": "今日、議事録を取ってもらえますか？",
            "focus": "take the minutes",
            "jaFocus": "議事録"
          },
          {
            "en": "I took notes on the client’s request.",
            "ja": "クライアントの要望をメモしました。",
            "focus": "took notes",
            "jaFocus": "メモ"
          }
        ]
      },
      {
        "id": "over",
        "title": "⑤ 引き継ぐ・対応を受け持つ",
        "pattern": "TAKE over / TAKE care of",
        "transitivity": "他動詞",
        "structure": "S + take over + O",
        "image": "仕事や担当を自分の側へ移す。",
        "point": "take over は担当や案件の引き継ぎ、take care of は処理・対応に使う。",
        "examples": [
          {
            "en": "I will take over this account next month.",
            "ja": "来月この顧客を引き継ぎます。",
            "focus": "take over",
            "jaFocus": "引き継ぎ"
          },
          {
            "en": "Can you take care of this request?",
            "ja": "この依頼に対応してもらえますか？",
            "focus": "take care of",
            "jaFocus": "対応"
          },
          {
            "en": "He took over the project after the handover.",
            "ja": "引き継ぎ後、彼がその案件を担当しました。",
            "focus": "took over",
            "jaFocus": "担当"
          }
        ]
      }
    ],
    "collocations": [
      {
        "phrase": "take responsibility",
        "ja": "責任を負う",
        "image": "responsibility を自分の側に引き受ける。",
        "pattern": "take + 名詞",
        "examples": [
          {
            "en": "I will take responsibility for the result.",
            "ja": "結果について私が責任を負います。",
            "focus": "take responsibility",
            "jaFocus": "責任"
          },
          {
            "en": "Managers should take responsibility for team decisions.",
            "ja": "管理職はチームの決定に責任を持つべきです。",
            "focus": "take responsibility",
            "jaFocus": "責任"
          },
          {
            "en": "Who will take responsibility for this issue?",
            "ja": "この問題は誰が責任を持ちますか？",
            "focus": "take responsibility",
            "jaFocus": "責任"
          }
        ]
      },
      {
        "phrase": "take notes",
        "ja": "メモを取る",
        "image": "情報を自分の記録として取る。",
        "pattern": "take + notes",
        "examples": [
          {
            "en": "Please take notes during the call.",
            "ja": "通話中にメモを取ってください。",
            "focus": "take notes",
            "jaFocus": "メモ"
          },
          {
            "en": "I took notes on the key points.",
            "ja": "重要点をメモしました。",
            "focus": "took notes",
            "jaFocus": "メモ"
          },
          {
            "en": "She always takes clear notes.",
            "ja": "彼女はいつも分かりやすくメモを取ります。",
            "focus": "takes clear notes",
            "jaFocus": "メモ"
          }
        ]
      },
      {
        "phrase": "take a break",
        "ja": "休憩する",
        "image": "休憩時間を自分のために取る。",
        "pattern": "take + a break",
        "examples": [
          {
            "en": "Let’s take a short break.",
            "ja": "少し休憩しましょう。",
            "focus": "take a short break",
            "jaFocus": "休憩"
          },
          {
            "en": "I took a break after the meeting.",
            "ja": "会議後に休憩しました。",
            "focus": "took a break",
            "jaFocus": "休憩"
          },
          {
            "en": "You should take a break before the presentation.",
            "ja": "プレゼン前に休憩した方がいいです。",
            "focus": "take a break",
            "jaFocus": "休憩"
          }
        ]
      },
      {
        "phrase": "take time",
        "ja": "時間がかかる",
        "image": "時間を消費する。",
        "pattern": "take + time",
        "examples": [
          {
            "en": "This will take time.",
            "ja": "これは時間がかかります。",
            "focus": "take time",
            "jaFocus": "時間"
          },
          {
            "en": "The review took more time than expected.",
            "ja": "確認に予想以上の時間がかかりました。",
            "focus": "took more time",
            "jaFocus": "時間"
          },
          {
            "en": "Good communication takes time.",
            "ja": "良いコミュニケーションには時間がかかります。",
            "focus": "takes time",
            "jaFocus": "時間"
          }
        ]
      },
      {
        "phrase": "take a look",
        "ja": "見る・確認する",
        "image": "短く軽く確認する。",
        "pattern": "take + a look",
        "examples": [
          {
            "en": "Could you take a look at this file?",
            "ja": "このファイルを確認してもらえますか？",
            "focus": "take a look",
            "jaFocus": "確認"
          },
          {
            "en": "I’ll take a look and get back to you.",
            "ja": "確認して折り返します。",
            "focus": "take a look",
            "jaFocus": "確認"
          },
          {
            "en": "Please take a quick look before the meeting.",
            "ja": "会議前に軽く確認してください。",
            "focus": "take a quick look",
            "jaFocus": "確認"
          }
        ]
      }
    ],
    "phrasalVerbs": [
      {
        "phrase": "take over",
        "ja": "引き継ぐ",
        "image": "担当を自分の側へ移す。",
        "pattern": "take over + 名詞",
        "examples": [
          {
            "en": "I will take over the project.",
            "ja": "その案件を引き継ぎます。",
            "focus": "take over",
            "jaFocus": "引き継ぎ"
          },
          {
            "en": "She took over my role last week.",
            "ja": "先週、彼女が私の役割を引き継ぎました。",
            "focus": "took over",
            "jaFocus": "引き継ぎ"
          },
          {
            "en": "Can you take over this client?",
            "ja": "この顧客を引き継いでもらえますか？",
            "focus": "take over",
            "jaFocus": "引き継ぎ"
          }
        ]
      },
      {
        "phrase": "take off",
        "ja": "休みを取る・離れる",
        "image": "仕事から一時的に離れる。",
        "pattern": "take off + 時間",
        "examples": [
          {
            "en": "I will take Friday off.",
            "ja": "金曜日に休みを取ります。",
            "focus": "take Friday off",
            "jaFocus": "休み"
          },
          {
            "en": "She took a day off.",
            "ja": "彼女は1日休みを取りました。",
            "focus": "took a day off",
            "jaFocus": "休み"
          },
          {
            "en": "Can I take the afternoon off?",
            "ja": "午後休を取ってもいいですか？",
            "focus": "take the afternoon off",
            "jaFocus": "午後休"
          }
        ]
      },
      {
        "phrase": "take on",
        "ja": "引き受ける",
        "image": "新しい仕事や役割を自分に乗せる。",
        "pattern": "take on + 名詞",
        "examples": [
          {
            "en": "We can take on one more project.",
            "ja": "もう1件案件を引き受けられます。",
            "focus": "take on",
            "jaFocus": "引き受け"
          },
          {
            "en": "He took on a new role.",
            "ja": "彼は新しい役割を引き受けました。",
            "focus": "took on",
            "jaFocus": "引き受け"
          },
          {
            "en": "Don’t take on too much work.",
            "ja": "仕事を抱え込みすぎないでください。",
            "focus": "take on",
            "jaFocus": "抱え込み"
          }
        ]
      },
      {
        "phrase": "take up",
        "ja": "取り上げる・始める",
        "image": "時間や議題を占める。",
        "pattern": "take up + 名詞",
        "examples": [
          {
            "en": "This issue will take up the whole meeting.",
            "ja": "この問題で会議全体を使うことになります。",
            "focus": "take up",
            "jaFocus": "使う"
          },
          {
            "en": "Let’s take up this topic next.",
            "ja": "次にこの議題を取り上げましょう。",
            "focus": "take up",
            "jaFocus": "取り上げ"
          },
          {
            "en": "The task took up my morning.",
            "ja": "その作業で午前中がつぶれました。",
            "focus": "took up",
            "jaFocus": "つぶれ"
          }
        ]
      },
      {
        "phrase": "take care of",
        "ja": "対応する・処理する",
        "image": "相手や問題を自分の側で面倒見る。",
        "pattern": "take care of + 名詞",
        "examples": [
          {
            "en": "I’ll take care of it.",
            "ja": "私が対応します。",
            "focus": "take care of",
            "jaFocus": "対応"
          },
          {
            "en": "Can you take care of the invoice?",
            "ja": "請求書を処理してもらえますか？",
            "focus": "take care of",
            "jaFocus": "処理"
          },
          {
            "en": "The team took care of the issue quickly.",
            "ja": "チームはその問題に素早く対応しました。",
            "focus": "took care of",
            "jaFocus": "対応"
          }
        ]
      }
    ]
  },
  {
    "id": "make",
    "rank": 3,
    "word": "MAKE",
    "ipa": "/meɪk/",
    "kana": "メイク",
    "syllable": "make",
    "transitivity": "他動詞",
    "importance": "★★★★★ 超重要",
    "core": "作り出す・結果を生む",
    "coreDetail": "決定・進捗・資料・関係・状況を作り出すイメージ。仕事では「決める」「作成する」「進捗を出す」「調整する」で使う。",
    "meanings": [
      {
        "id": "decision",
        "title": "① 決定する",
        "pattern": "MAKE + decision / choice",
        "transitivity": "他動詞",
        "structure": "S + make + O",
        "image": "考えた結果を形にする。",
        "point": "make a decision は社会人英語の最重要表現。decide より名詞で管理しやすい。",
        "examples": [
          {
            "en": "We need to make a decision today.",
            "ja": "今日、決定する必要があります。",
            "focus": "make a decision",
            "jaFocus": "決定"
          },
          {
            "en": "The manager made the final decision.",
            "ja": "マネージャーが最終決定をしました。",
            "focus": "made the final decision",
            "jaFocus": "決定"
          },
          {
            "en": "Can we make a decision by Friday?",
            "ja": "金曜日までに決められますか？",
            "focus": "make a decision",
            "jaFocus": "決め"
          }
        ]
      },
      {
        "id": "progress",
        "title": "② 進捗を出す",
        "pattern": "MAKE + progress",
        "transitivity": "他動詞",
        "structure": "S + make + O",
        "image": "前に進む結果を作る。",
        "point": "進捗報告で頻出。good / steady / little progress と組み合わせる。",
        "examples": [
          {
            "en": "We made good progress this week.",
            "ja": "今週は良い進捗がありました。",
            "focus": "made good progress",
            "jaFocus": "進捗"
          },
          {
            "en": "The project is making steady progress.",
            "ja": "案件は着実に進んでいます。",
            "focus": "making steady progress",
            "jaFocus": "進んで"
          },
          {
            "en": "We didn’t make much progress today.",
            "ja": "今日はあまり進捗が出ませんでした。",
            "focus": "make much progress",
            "jaFocus": "進捗"
          }
        ]
      },
      {
        "id": "create",
        "title": "③ 作成する",
        "pattern": "MAKE + document / list / plan",
        "transitivity": "他動詞",
        "structure": "S + make + O",
        "image": "資料や計画を形にする。",
        "point": "create より日常的で短く言える。資料・リスト・計画に使いやすい。",
        "examples": [
          {
            "en": "I made a proposal for the client.",
            "ja": "クライアント向けの提案書を作成しました。",
            "focus": "made a proposal",
            "jaFocus": "作成"
          },
          {
            "en": "Can you make a list of action items?",
            "ja": "対応事項のリストを作ってもらえますか？",
            "focus": "make a list",
            "jaFocus": "作って"
          },
          {
            "en": "Let’s make a plan for next month.",
            "ja": "来月の計画を立てましょう。",
            "focus": "make a plan",
            "jaFocus": "立て"
          }
        ]
      },
      {
        "id": "cause",
        "title": "④ 〜させる",
        "pattern": "MAKE + 人/物 + 形容詞",
        "transitivity": "他動詞",
        "structure": "S + make + O + C",
        "image": "相手や状況に変化を生む。",
        "point": "make it clear / make it easy など、説明や調整で便利。",
        "examples": [
          {
            "en": "This chart makes the data clear.",
            "ja": "このグラフでデータが分かりやすくなります。",
            "focus": "makes the data clear",
            "jaFocus": "分かりやすく"
          },
          {
            "en": "The new system makes our work easier.",
            "ja": "新システムで仕事が楽になります。",
            "focus": "makes our work easier",
            "jaFocus": "楽に"
          },
          {
            "en": "Please make the deadline clear.",
            "ja": "締切を明確にしてください。",
            "focus": "make the deadline clear",
            "jaFocus": "明確に"
          }
        ]
      },
      {
        "id": "arrange",
        "title": "⑤ 調整・約束する",
        "pattern": "MAKE + appointment / arrangement",
        "transitivity": "他動詞",
        "structure": "S + make + O",
        "image": "予定や約束を作る。",
        "point": "make an appointment / make arrangements は社外連絡で使いやすい。",
        "examples": [
          {
            "en": "I made an appointment with the client.",
            "ja": "クライアントと面談の約束をしました。",
            "focus": "made an appointment",
            "jaFocus": "約束"
          },
          {
            "en": "We need to make arrangements for the visit.",
            "ja": "訪問の手配をする必要があります。",
            "focus": "make arrangements",
            "jaFocus": "手配"
          },
          {
            "en": "Can you make time for a short call?",
            "ja": "短い電話の時間を作れますか？",
            "focus": "make time",
            "jaFocus": "時間を作れ"
          }
        ]
      }
    ],
    "collocations": [
      {
        "phrase": "make a decision",
        "ja": "決定する",
        "image": "考えを結果として作る。",
        "pattern": "make + 名詞",
        "examples": [
          {
            "en": "Let’s make a decision today.",
            "ja": "今日決めましょう。",
            "focus": "make a decision",
            "jaFocus": "決め"
          },
          {
            "en": "We made a quick decision.",
            "ja": "素早く決定しました。",
            "focus": "made a quick decision",
            "jaFocus": "決定"
          },
          {
            "en": "It is hard to make a decision without data.",
            "ja": "データなしで決めるのは難しいです。",
            "focus": "make a decision",
            "jaFocus": "決める"
          }
        ]
      },
      {
        "phrase": "make progress",
        "ja": "進捗を出す",
        "image": "前に進む状態を作る。",
        "pattern": "make + progress",
        "examples": [
          {
            "en": "We are making progress.",
            "ja": "進捗が出ています。",
            "focus": "making progress",
            "jaFocus": "進捗"
          },
          {
            "en": "They made progress on the issue.",
            "ja": "彼らはその問題で進捗を出しました。",
            "focus": "made progress",
            "jaFocus": "進捗"
          },
          {
            "en": "Let’s make more progress this week.",
            "ja": "今週さらに進めましょう。",
            "focus": "make more progress",
            "jaFocus": "進め"
          }
        ]
      },
      {
        "phrase": "make sure",
        "ja": "確認する",
        "image": "確実な状態を作る。",
        "pattern": "make sure + 文",
        "examples": [
          {
            "en": "Please make sure the file is correct.",
            "ja": "ファイルが正しいか確認してください。",
            "focus": "make sure",
            "jaFocus": "確認"
          },
          {
            "en": "I’ll make sure it is updated.",
            "ja": "更新されているか確認します。",
            "focus": "make sure",
            "jaFocus": "確認"
          },
          {
            "en": "Make sure everyone has the latest version.",
            "ja": "全員が最新版を持っているか確認してください。",
            "focus": "Make sure",
            "jaFocus": "確認"
          }
        ]
      },
      {
        "phrase": "make time",
        "ja": "時間を作る",
        "image": "予定の中に時間を作る。",
        "pattern": "make + time",
        "examples": [
          {
            "en": "Can you make time tomorrow?",
            "ja": "明日時間を作れますか？",
            "focus": "make time",
            "jaFocus": "時間"
          },
          {
            "en": "I’ll make time for the call.",
            "ja": "その電話の時間を作ります。",
            "focus": "make time",
            "jaFocus": "時間"
          },
          {
            "en": "We need to make time for review.",
            "ja": "確認の時間を作る必要があります。",
            "focus": "make time",
            "jaFocus": "時間"
          }
        ]
      },
      {
        "phrase": "make a mistake",
        "ja": "ミスをする",
        "image": "ミスという結果を作ってしまう。",
        "pattern": "make + a mistake",
        "examples": [
          {
            "en": "I made a mistake in the report.",
            "ja": "報告書でミスをしました。",
            "focus": "made a mistake",
            "jaFocus": "ミス"
          },
          {
            "en": "It’s okay to make mistakes.",
            "ja": "ミスしても大丈夫です。",
            "focus": "make mistakes",
            "jaFocus": "ミス"
          },
          {
            "en": "We should avoid making the same mistake.",
            "ja": "同じミスを避けるべきです。",
            "focus": "making the same mistake",
            "jaFocus": "ミス"
          }
        ]
      }
    ],
    "phrasalVerbs": [
      {
        "phrase": "make up",
        "ja": "構成する・埋め合わせる",
        "image": "不足や全体を作り上げる。",
        "pattern": "make up + 名詞",
        "examples": [
          {
            "en": "These costs make up 30% of the budget.",
            "ja": "これらの費用が予算の30%を占めます。",
            "focus": "make up",
            "jaFocus": "占め"
          },
          {
            "en": "I’ll make up for the delay.",
            "ja": "遅れを埋め合わせます。",
            "focus": "make up for",
            "jaFocus": "埋め合わせ"
          },
          {
            "en": "The team is made up of five members.",
            "ja": "チームは5名で構成されています。",
            "focus": "made up of",
            "jaFocus": "構成"
          }
        ]
      },
      {
        "phrase": "make out",
        "ja": "理解する・判別する",
        "image": "ぼんやりしたものを形として捉える。",
        "pattern": "make out + 名詞",
        "examples": [
          {
            "en": "I can’t make out the numbers.",
            "ja": "数字が読み取れません。",
            "focus": "make out",
            "jaFocus": "読み取れ"
          },
          {
            "en": "Can you make out what he said?",
            "ja": "彼が言ったことを聞き取れますか？",
            "focus": "make out",
            "jaFocus": "聞き取れ"
          },
          {
            "en": "It was hard to make out the details.",
            "ja": "詳細を把握するのが難しかったです。",
            "focus": "make out",
            "jaFocus": "把握"
          }
        ]
      },
      {
        "phrase": "make for",
        "ja": "〜に役立つ・向かう",
        "image": "ある結果や方向を作る。",
        "pattern": "make for + 名詞",
        "examples": [
          {
            "en": "Clear rules make for better communication.",
            "ja": "明確なルールはより良いコミュニケーションにつながります。",
            "focus": "make for",
            "jaFocus": "つながり"
          },
          {
            "en": "This update makes for a smoother process.",
            "ja": "この更新で手順がよりスムーズになります。",
            "focus": "makes for",
            "jaFocus": "スムーズ"
          },
          {
            "en": "Small improvements make for big results.",
            "ja": "小さな改善が大きな結果につながります。",
            "focus": "make for",
            "jaFocus": "つながり"
          }
        ]
      },
      {
        "phrase": "make it",
        "ja": "間に合う・成功する",
        "image": "目的地や目標に到達する状態を作る。",
        "pattern": "make it",
        "examples": [
          {
            "en": "I can make it to the meeting.",
            "ja": "会議に間に合います。",
            "focus": "make it",
            "jaFocus": "間に合い"
          },
          {
            "en": "Can you make it by three?",
            "ja": "3時までに来られますか？",
            "focus": "make it",
            "jaFocus": "来られ"
          },
          {
            "en": "We made it before the deadline.",
            "ja": "締切前に間に合いました。",
            "focus": "made it",
            "jaFocus": "間に合い"
          }
        ]
      },
      {
        "phrase": "make do with",
        "ja": "〜で間に合わせる",
        "image": "あるもので何とか形にする。",
        "pattern": "make do with + 名詞",
        "examples": [
          {
            "en": "We need to make do with the current budget.",
            "ja": "現行予算で何とかする必要があります。",
            "focus": "make do with",
            "jaFocus": "何とか"
          },
          {
            "en": "Can we make do with this version?",
            "ja": "この版で間に合わせられますか？",
            "focus": "make do with",
            "jaFocus": "間に合わせ"
          },
          {
            "en": "They made do with limited resources.",
            "ja": "限られたリソースで何とかしました。",
            "focus": "made do with",
            "jaFocus": "何とか"
          }
        ]
      }
    ]
  },
  {
    "id": "give",
    "rank": 4,
    "word": "GIVE",
    "ipa": "/ɡɪv/",
    "kana": "ギヴ",
    "syllable": "give",
    "transitivity": "他動詞・自動詞",
    "importance": "★★★★★ 超重要",
    "core": "相手に渡す",
    "coreDetail": "情報・許可・説明・意見・機会を相手へ渡すイメージ。",
    "meanings": [
      {
        "id": "update",
        "title": "1 ① 共有する",
        "pattern": "GIVE + 人 + update",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "相手に渡す",
        "point": "進捗や情報を相手に渡す。",
        "examples": [
          {
            "en": "I’ll give you an update tomorrow.",
            "ja": "明日、進捗を共有します。",
            "focus": "give you an update",
            "jaFocus": "共有"
          },
          {
            "en": "Can you give me a quick update?",
            "ja": "簡単に進捗を共有してもらえますか？",
            "focus": "give me a quick update",
            "jaFocus": "共有"
          },
          {
            "en": "She gave us an update on the project.",
            "ja": "彼女が案件の進捗を共有してくれました。",
            "focus": "gave us an update",
            "jaFocus": "共有"
          }
        ]
      },
      {
        "id": "feedback",
        "title": "2 ② 意見を伝える",
        "pattern": "GIVE + feedback / advice",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "相手に渡す",
        "point": "相手に改善材料を渡す。",
        "examples": [
          {
            "en": "Can you give me feedback?",
            "ja": "フィードバックをもらえますか？",
            "focus": "give me feedback",
            "jaFocus": "フィードバック"
          },
          {
            "en": "I gave him advice on the proposal.",
            "ja": "提案書について彼に助言しました。",
            "focus": "gave him advice",
            "jaFocus": "助言"
          },
          {
            "en": "Please give honest feedback.",
            "ja": "率直なフィードバックをください。",
            "focus": "give honest feedback",
            "jaFocus": "フィードバック"
          }
        ]
      },
      {
        "id": "permission",
        "title": "3 ③ 許可する",
        "pattern": "GIVE + permission / approval",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "相手に渡す",
        "point": "許可や承認を相手に渡す。",
        "examples": [
          {
            "en": "The manager gave us approval.",
            "ja": "上司が承認してくれました。",
            "focus": "gave us approval",
            "jaFocus": "承認"
          },
          {
            "en": "Who gave permission for this change?",
            "ja": "この変更を誰が許可しましたか？",
            "focus": "gave permission",
            "jaFocus": "許可"
          },
          {
            "en": "They gave us the green light.",
            "ja": "彼らは実行許可を出してくれました。",
            "focus": "gave us the green light",
            "jaFocus": "許可"
          }
        ]
      },
      {
        "id": "presentation",
        "title": "4 ④ 行う・実施する",
        "pattern": "GIVE + presentation / explanation",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "相手に渡す",
        "point": "説明や発表を相手へ渡す。",
        "examples": [
          {
            "en": "I will give a presentation next week.",
            "ja": "来週プレゼンをします。",
            "focus": "give a presentation",
            "jaFocus": "プレゼン"
          },
          {
            "en": "She gave a clear explanation.",
            "ja": "彼女は分かりやすく説明しました。",
            "focus": "gave a clear explanation",
            "jaFocus": "説明"
          },
          {
            "en": "Can you give a short overview?",
            "ja": "簡単な概要を説明してもらえますか？",
            "focus": "give a short overview",
            "jaFocus": "説明"
          }
        ]
      },
      {
        "id": "chance",
        "title": "5 ⑤ 機会を与える",
        "pattern": "GIVE + 人 + chance",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "相手に渡す",
        "point": "相手に機会を渡す。",
        "examples": [
          {
            "en": "Please give me a chance to explain.",
            "ja": "説明する機会をください。",
            "focus": "give me a chance",
            "jaFocus": "機会"
          },
          {
            "en": "This project gave us a good opportunity.",
            "ja": "この案件は良い機会になりました。",
            "focus": "gave us a good opportunity",
            "jaFocus": "機会"
          },
          {
            "en": "Can we give the supplier another chance?",
            "ja": "その仕入先にもう一度機会を与えられますか？",
            "focus": "give the supplier another chance",
            "jaFocus": "機会"
          }
        ]
      }
    ],
    "collocations": [
      {
        "phrase": "give feedback",
        "ja": "フィードバックする",
        "image": "意見を相手へ渡す。",
        "pattern": "give + feedback",
        "examples": [
          {
            "en": "I’ll give feedback by Friday.",
            "ja": "金曜日までにフィードバックします。",
            "focus": "give feedback",
            "jaFocus": "フィードバック"
          },
          {
            "en": "She gave useful feedback.",
            "ja": "彼女は役立つフィードバックをくれました。",
            "focus": "gave useful feedback",
            "jaFocus": "フィードバック"
          },
          {
            "en": "Please give feedback on the draft.",
            "ja": "下書きにフィードバックをください。",
            "focus": "give feedback",
            "jaFocus": "フィードバック"
          }
        ]
      },
      {
        "phrase": "give permission",
        "ja": "許可する",
        "image": "許可を相手へ渡す。",
        "pattern": "give + permission",
        "examples": [
          {
            "en": "They gave permission to proceed.",
            "ja": "彼らは進行を許可しました。",
            "focus": "gave permission",
            "jaFocus": "許可"
          },
          {
            "en": "Who can give permission?",
            "ja": "誰が許可できますか？",
            "focus": "give permission",
            "jaFocus": "許可"
          },
          {
            "en": "We need permission before starting.",
            "ja": "開始前に許可が必要です。",
            "focus": "permission",
            "jaFocus": "許可"
          }
        ]
      },
      {
        "phrase": "give a presentation",
        "ja": "プレゼンする",
        "image": "発表内容を相手へ渡す。",
        "pattern": "give + presentation",
        "examples": [
          {
            "en": "I’ll give a presentation tomorrow.",
            "ja": "明日プレゼンします。",
            "focus": "give a presentation",
            "jaFocus": "プレゼン"
          },
          {
            "en": "He gave a presentation to the client.",
            "ja": "彼は顧客にプレゼンしました。",
            "focus": "gave a presentation",
            "jaFocus": "プレゼン"
          },
          {
            "en": "Can you give the opening presentation?",
            "ja": "冒頭プレゼンをお願いできますか？",
            "focus": "give the opening presentation",
            "jaFocus": "プレゼン"
          }
        ]
      },
      {
        "phrase": "give notice",
        "ja": "知らせる",
        "image": "通知を相手へ渡す。",
        "pattern": "give + notice",
        "examples": [
          {
            "en": "Please give us notice in advance.",
            "ja": "事前に知らせてください。",
            "focus": "give us notice",
            "jaFocus": "知らせ"
          },
          {
            "en": "They gave short notice.",
            "ja": "彼らは直前に知らせました。",
            "focus": "gave short notice",
            "jaFocus": "知らせ"
          },
          {
            "en": "We should give notice to the team.",
            "ja": "チームに知らせるべきです。",
            "focus": "give notice",
            "jaFocus": "知らせ"
          }
        ]
      },
      {
        "phrase": "give priority",
        "ja": "優先する",
        "image": "優先順位を与える。",
        "pattern": "give + priority",
        "examples": [
          {
            "en": "We should give priority to this issue.",
            "ja": "この問題を優先すべきです。",
            "focus": "give priority",
            "jaFocus": "優先"
          },
          {
            "en": "Please give this order priority.",
            "ja": "この注文を優先してください。",
            "focus": "give this order priority",
            "jaFocus": "優先"
          },
          {
            "en": "The team gave priority to quality.",
            "ja": "チームは品質を優先しました。",
            "focus": "gave priority",
            "jaFocus": "優先"
          }
        ]
      }
    ],
    "phrasalVerbs": [
      {
        "phrase": "give up",
        "ja": "諦める",
        "image": "持っていた努力を手放す。",
        "pattern": "give up",
        "examples": [
          {
            "en": "Don’t give up on this client.",
            "ja": "この顧客を諦めないでください。",
            "focus": "give up",
            "jaFocus": "諦め"
          },
          {
            "en": "We gave up on that option.",
            "ja": "その選択肢は諦めました。",
            "focus": "gave up",
            "jaFocus": "諦め"
          },
          {
            "en": "She never gives up easily.",
            "ja": "彼女は簡単には諦めません。",
            "focus": "gives up",
            "jaFocus": "諦め"
          }
        ]
      },
      {
        "phrase": "give in",
        "ja": "譲る",
        "image": "相手側へ折れる。",
        "pattern": "give in",
        "examples": [
          {
            "en": "We should not give in too quickly.",
            "ja": "すぐに譲るべきではありません。",
            "focus": "give in",
            "jaFocus": "譲る"
          },
          {
            "en": "The supplier finally gave in.",
            "ja": "仕入先は最終的に譲歩しました。",
            "focus": "gave in",
            "jaFocus": "譲歩"
          },
          {
            "en": "Don’t give in on the price.",
            "ja": "価格では譲らないでください。",
            "focus": "give in",
            "jaFocus": "譲らない"
          }
        ]
      },
      {
        "phrase": "give back",
        "ja": "返す",
        "image": "相手に戻して渡す。",
        "pattern": "give back + 名詞",
        "examples": [
          {
            "en": "I’ll give back the sample tomorrow.",
            "ja": "明日サンプルを返します。",
            "focus": "give back",
            "jaFocus": "返し"
          },
          {
            "en": "Please give the file back after review.",
            "ja": "確認後にファイルを返してください。",
            "focus": "give the file back",
            "jaFocus": "返して"
          },
          {
            "en": "They gave back the deposit.",
            "ja": "彼らは保証金を返しました。",
            "focus": "gave back",
            "jaFocus": "返し"
          }
        ]
      },
      {
        "phrase": "give out",
        "ja": "配る・発表する",
        "image": "外へ配る。",
        "pattern": "give out + 名詞",
        "examples": [
          {
            "en": "We gave out the materials.",
            "ja": "資料を配布しました。",
            "focus": "gave out",
            "jaFocus": "配布"
          },
          {
            "en": "Please give out the handouts.",
            "ja": "配布資料を配ってください。",
            "focus": "give out",
            "jaFocus": "配って"
          },
          {
            "en": "The company gave out new guidelines.",
            "ja": "会社は新しいガイドラインを発表しました。",
            "focus": "gave out",
            "jaFocus": "発表"
          }
        ]
      },
      {
        "phrase": "give off",
        "ja": "発する",
        "image": "外へ出す。",
        "pattern": "give off + 名詞",
        "examples": [
          {
            "en": "This product gives off very little heat.",
            "ja": "この製品はほとんど熱を発しません。",
            "focus": "gives off",
            "jaFocus": "発し"
          },
          {
            "en": "The device gave off a strange smell.",
            "ja": "その機器は変なにおいを発しました。",
            "focus": "gave off",
            "jaFocus": "発し"
          },
          {
            "en": "LEDs give off light efficiently.",
            "ja": "LEDは効率よく光を発します。",
            "focus": "give off",
            "jaFocus": "発し"
          }
        ]
      }
    ]
  },
  {
    "id": "have",
    "rank": 5,
    "word": "HAVE",
    "ipa": "/hæv/",
    "kana": "ハヴ",
    "syllable": "have",
    "transitivity": "他動詞・自動詞",
    "importance": "★★★★★ 超重要",
    "core": "持っている",
    "coreDetail": "会議・予定・問題・時間・経験を自分の状態として持っているイメージ。",
    "meanings": [
      {
        "id": "m1",
        "title": "1 ① 予定がある",
        "pattern": "HAVE + meeting / call",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "持っている・抱えている",
        "point": "予定を持っている。",
        "examples": [
          {
            "en": "I have a meeting at three.",
            "ja": "3時に会議があります。",
            "focus": "have a meeting",
            "jaFocus": "会議"
          },
          {
            "en": "We have a call with Singapore today.",
            "ja": "今日はシンガポールと電話会議があります。",
            "focus": "have a call",
            "jaFocus": "電話会議"
          },
          {
            "en": "Do you have plans after work?",
            "ja": "仕事後に予定はありますか？",
            "focus": "have plans",
            "jaFocus": "予定"
          }
        ]
      },
      {
        "id": "m2",
        "title": "2 ② 問題がある",
        "pattern": "HAVE + issue / problem",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "持っている・抱えている",
        "point": "問題を抱えている。",
        "examples": [
          {
            "en": "We have an issue with delivery.",
            "ja": "納期に問題があります。",
            "focus": "have an issue",
            "jaFocus": "問題"
          },
          {
            "en": "Do you have any concerns?",
            "ja": "懸念点はありますか？",
            "focus": "have any concerns",
            "jaFocus": "懸念"
          },
          {
            "en": "The client has a problem with the price.",
            "ja": "顧客は価格に問題を感じています。",
            "focus": "has a problem",
            "jaFocus": "問題"
          }
        ]
      },
      {
        "id": "m3",
        "title": "3 ③ 時間がある",
        "pattern": "HAVE + time",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "持っている・抱えている",
        "point": "使える時間を持っている。",
        "examples": [
          {
            "en": "Do you have time today?",
            "ja": "今日お時間ありますか？",
            "focus": "have time",
            "jaFocus": "時間"
          },
          {
            "en": "I don’t have much time before the meeting.",
            "ja": "会議前にあまり時間がありません。",
            "focus": "have much time",
            "jaFocus": "時間"
          },
          {
            "en": "We have enough time to review it.",
            "ja": "確認する時間は十分あります。",
            "focus": "have enough time",
            "jaFocus": "時間"
          }
        ]
      },
      {
        "id": "m4",
        "title": "4 ④ 経験する",
        "pattern": "HAVE + experience / trouble",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "持っている・抱えている",
        "point": "出来事を経験として持つ。",
        "examples": [
          {
            "en": "We had trouble with the system.",
            "ja": "システムで問題がありました。",
            "focus": "had trouble",
            "jaFocus": "問題"
          },
          {
            "en": "I had a good conversation with the client.",
            "ja": "顧客と良い会話ができました。",
            "focus": "had a good conversation",
            "jaFocus": "会話"
          },
          {
            "en": "Have you had this issue before?",
            "ja": "以前この問題がありましたか？",
            "focus": "had this issue",
            "jaFocus": "問題"
          }
        ]
      },
      {
        "id": "m5",
        "title": "5 ⑤ 食事・休憩を取る",
        "pattern": "HAVE + lunch / break",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "持っている・抱えている",
        "point": "食事や休憩を取る。",
        "examples": [
          {
            "en": "Let’s have lunch after the meeting.",
            "ja": "会議後に昼食を取りましょう。",
            "focus": "have lunch",
            "jaFocus": "昼食"
          },
          {
            "en": "Can we have a short break?",
            "ja": "少し休憩できますか？",
            "focus": "have a short break",
            "jaFocus": "休憩"
          },
          {
            "en": "I had coffee with the supplier.",
            "ja": "仕入先とコーヒーを飲みました。",
            "focus": "had coffee",
            "jaFocus": "コーヒー"
          }
        ]
      }
    ],
    "collocations": [
      {
        "phrase": "have a meeting",
        "ja": "会議がある",
        "image": "予定を持っている。",
        "pattern": "have + meeting",
        "examples": [
          {
            "en": "We have a meeting tomorrow.",
            "ja": "明日会議があります。",
            "focus": "have a meeting",
            "jaFocus": "会議"
          },
          {
            "en": "I had a meeting with the client.",
            "ja": "顧客と会議をしました。",
            "focus": "had a meeting",
            "jaFocus": "会議"
          },
          {
            "en": "Do we have a meeting today?",
            "ja": "今日会議はありますか？",
            "focus": "have a meeting",
            "jaFocus": "会議"
          }
        ]
      },
      {
        "phrase": "have time",
        "ja": "時間がある",
        "image": "使える時間を持つ。",
        "pattern": "have + time",
        "examples": [
          {
            "en": "Do you have time now?",
            "ja": "今時間ありますか？",
            "focus": "have time",
            "jaFocus": "時間"
          },
          {
            "en": "I have time after lunch.",
            "ja": "昼食後なら時間があります。",
            "focus": "have time",
            "jaFocus": "時間"
          },
          {
            "en": "We don’t have enough time.",
            "ja": "十分な時間がありません。",
            "focus": "have enough time",
            "jaFocus": "時間"
          }
        ]
      },
      {
        "phrase": "have an issue",
        "ja": "問題がある",
        "image": "問題を抱えている。",
        "pattern": "have + issue",
        "examples": [
          {
            "en": "We have an issue.",
            "ja": "問題があります。",
            "focus": "have an issue",
            "jaFocus": "問題"
          },
          {
            "en": "They had an issue with payment.",
            "ja": "支払いに問題がありました。",
            "focus": "had an issue",
            "jaFocus": "問題"
          },
          {
            "en": "Do you have any issues?",
            "ja": "何か問題はありますか？",
            "focus": "have any issues",
            "jaFocus": "問題"
          }
        ]
      },
      {
        "phrase": "have a look",
        "ja": "確認する",
        "image": "軽く見る機会を持つ。",
        "pattern": "have + a look",
        "examples": [
          {
            "en": "Please have a look.",
            "ja": "確認してください。",
            "focus": "have a look",
            "jaFocus": "確認"
          },
          {
            "en": "I’ll have a look later.",
            "ja": "後で確認します。",
            "focus": "have a look",
            "jaFocus": "確認"
          },
          {
            "en": "Can you have a quick look?",
            "ja": "軽く確認してもらえますか？",
            "focus": "have a quick look",
            "jaFocus": "確認"
          }
        ]
      },
      {
        "phrase": "have a question",
        "ja": "質問がある",
        "image": "質問を持っている。",
        "pattern": "have + question",
        "examples": [
          {
            "en": "I have a question.",
            "ja": "質問があります。",
            "focus": "have a question",
            "jaFocus": "質問"
          },
          {
            "en": "Do you have any questions?",
            "ja": "質問はありますか？",
            "focus": "have any questions",
            "jaFocus": "質問"
          },
          {
            "en": "She had a question about the quote.",
            "ja": "彼女は見積について質問がありました。",
            "focus": "had a question",
            "jaFocus": "質問"
          }
        ]
      }
    ],
    "phrasalVerbs": [
      {
        "phrase": "have to",
        "ja": "〜しなければならない",
        "image": "義務を持つ。",
        "pattern": "have to + 動詞",
        "examples": [
          {
            "en": "We have to finish this today.",
            "ja": "今日これを終わらせなければなりません。",
            "focus": "have to",
            "jaFocus": "しなければ"
          },
          {
            "en": "I have to check the details.",
            "ja": "詳細を確認しなければなりません。",
            "focus": "have to",
            "jaFocus": "しなければ"
          },
          {
            "en": "Do we have to join the meeting?",
            "ja": "会議に参加しなければなりませんか？",
            "focus": "have to",
            "jaFocus": "しなければ"
          }
        ]
      },
      {
        "phrase": "have on",
        "ja": "身につけている",
        "image": "身に持っている。",
        "pattern": "have on + 名詞",
        "examples": [
          {
            "en": "He had a jacket on.",
            "ja": "彼はジャケットを着ていました。",
            "focus": "had a jacket on",
            "jaFocus": "着て"
          },
          {
            "en": "Do you have your badge on?",
            "ja": "バッジを付けていますか？",
            "focus": "have your badge on",
            "jaFocus": "付けて"
          },
          {
            "en": "She had headphones on during the call.",
            "ja": "彼女は通話中ヘッドホンをしていました。",
            "focus": "had headphones on",
            "jaFocus": "して"
          }
        ]
      },
      {
        "phrase": "have over",
        "ja": "招く",
        "image": "相手をこちら側に持つ。",
        "pattern": "have over + 人",
        "examples": [
          {
            "en": "We had the client over for a demo.",
            "ja": "デモのため顧客を招きました。",
            "focus": "had the client over",
            "jaFocus": "招き"
          },
          {
            "en": "Can we have them over next week?",
            "ja": "来週彼らを招けますか？",
            "focus": "have them over",
            "jaFocus": "招け"
          },
          {
            "en": "They had us over at their office.",
            "ja": "彼らは私たちをオフィスに招いてくれました。",
            "focus": "had us over",
            "jaFocus": "招いて"
          }
        ]
      },
      {
        "phrase": "have around",
        "ja": "近くに置く",
        "image": "周囲に持つ。",
        "pattern": "have around + 名詞",
        "examples": [
          {
            "en": "It’s useful to have samples around.",
            "ja": "サンプルを手元に置いておくと便利です。",
            "focus": "have samples around",
            "jaFocus": "手元"
          },
          {
            "en": "Do you have the catalog around?",
            "ja": "カタログは手元にありますか？",
            "focus": "have the catalog around",
            "jaFocus": "手元"
          },
          {
            "en": "We should have spare parts around.",
            "ja": "予備部品を置いておくべきです。",
            "focus": "have spare parts around",
            "jaFocus": "置いて"
          }
        ]
      },
      {
        "phrase": "have back",
        "ja": "戻してもらう",
        "image": "相手から戻る。",
        "pattern": "have back + 名詞",
        "examples": [
          {
            "en": "Can I have the document back?",
            "ja": "資料を返してもらえますか？",
            "focus": "have the document back",
            "jaFocus": "返して"
          },
          {
            "en": "We had the samples back yesterday.",
            "ja": "昨日サンプルが戻ってきました。",
            "focus": "had the samples back",
            "jaFocus": "戻って"
          },
          {
            "en": "I need to have my laptop back.",
            "ja": "ノートPCを返してもらう必要があります。",
            "focus": "have my laptop back",
            "jaFocus": "返して"
          }
        ]
      }
    ]
  },
  {
    "id": "go",
    "rank": 6,
    "word": "GO",
    "ipa": "/ɡoʊ/",
    "kana": "ゴー",
    "syllable": "go",
    "transitivity": "他動詞・自動詞",
    "importance": "★★★★☆ 重要",
    "core": "離れて進む",
    "coreDetail": "人・予定・案件・話題が次の場所や段階へ進む。",
    "meanings": [
      {
        "id": "m1",
        "title": "① 行く",
        "pattern": "GO TO + 場所",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "離れて進む",
        "point": "仕事先や会議へ向かう。",
        "examples": [
          {
            "en": "I will go to the client office tomorrow.",
            "ja": "明日クライアント先へ行きます。",
            "focus": "go to",
            "jaFocus": "行き"
          },
          {
            "en": "The project is going well.",
            "ja": "案件は順調に進んでいます。",
            "focus": "going well",
            "jaFocus": "進んで"
          },
          {
            "en": "Let’s go over the agenda.",
            "ja": "議題を確認しましょう。",
            "focus": "go over",
            "jaFocus": "確認"
          }
        ]
      },
      {
        "id": "m2",
        "title": "② 進む",
        "pattern": "GO + 副詞",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "離れて進む",
        "point": "案件や状況が進行する。",
        "examples": [
          {
            "en": "I will go to the client office tomorrow.",
            "ja": "明日クライアント先へ行きます。",
            "focus": "go to",
            "jaFocus": "行き"
          },
          {
            "en": "The project is going well.",
            "ja": "案件は順調に進んでいます。",
            "focus": "going well",
            "jaFocus": "進んで"
          },
          {
            "en": "Let’s go over the agenda.",
            "ja": "議題を確認しましょう。",
            "focus": "go over",
            "jaFocus": "確認"
          }
        ]
      },
      {
        "id": "m3",
        "title": "③ 確認する",
        "pattern": "GO OVER + 名詞",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "離れて進む",
        "point": "資料や議題を一通り見る。",
        "examples": [
          {
            "en": "I will go to the client office tomorrow.",
            "ja": "明日クライアント先へ行きます。",
            "focus": "go to",
            "jaFocus": "行き"
          },
          {
            "en": "The project is going well.",
            "ja": "案件は順調に進んでいます。",
            "focus": "going well",
            "jaFocus": "進んで"
          },
          {
            "en": "Let’s go over the agenda.",
            "ja": "議題を確認しましょう。",
            "focus": "go over",
            "jaFocus": "確認"
          }
        ]
      },
      {
        "id": "m4",
        "title": "④ うまくいく",
        "pattern": "GO WELL",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "離れて進む",
        "point": "状況が良い方向に進む。",
        "examples": [
          {
            "en": "I will go to the client office tomorrow.",
            "ja": "明日クライアント先へ行きます。",
            "focus": "go to",
            "jaFocus": "行き"
          },
          {
            "en": "The project is going well.",
            "ja": "案件は順調に進んでいます。",
            "focus": "going well",
            "jaFocus": "進んで"
          },
          {
            "en": "Let’s go over the agenda.",
            "ja": "議題を確認しましょう。",
            "focus": "go over",
            "jaFocus": "確認"
          }
        ]
      },
      {
        "id": "m5",
        "title": "⑤ 実施される",
        "pattern": "GO AHEAD",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "離れて進む",
        "point": "予定通り進める。",
        "examples": [
          {
            "en": "I will go to the client office tomorrow.",
            "ja": "明日クライアント先へ行きます。",
            "focus": "go to",
            "jaFocus": "行き"
          },
          {
            "en": "The project is going well.",
            "ja": "案件は順調に進んでいます。",
            "focus": "going well",
            "jaFocus": "進んで"
          },
          {
            "en": "Let’s go over the agenda.",
            "ja": "議題を確認しましょう。",
            "focus": "go over",
            "jaFocus": "確認"
          }
        ]
      }
    ],
    "collocations": [
      {
        "phrase": "go well",
        "ja": "うまくいく",
        "image": "go well を仕事で使う基本表現として覚える。",
        "pattern": "go well",
        "examples": [
          {
            "en": "Please go well if possible.",
            "ja": "可能であれば「うまくいく」してください。",
            "focus": "go well",
            "jaFocus": "うまくいく"
          },
          {
            "en": "We need to go well today.",
            "ja": "今日「うまくいく」する必要があります。",
            "focus": "go well",
            "jaFocus": "うまくいく"
          },
          {
            "en": "I will go well after the meeting.",
            "ja": "会議後に「うまくいく」します。",
            "focus": "go well",
            "jaFocus": "うまくいく"
          }
        ]
      },
      {
        "phrase": "go ahead",
        "ja": "進める",
        "image": "go ahead を仕事で使う基本表現として覚える。",
        "pattern": "go ahead",
        "examples": [
          {
            "en": "Please go ahead if possible.",
            "ja": "可能であれば「進める」してください。",
            "focus": "go ahead",
            "jaFocus": "進める"
          },
          {
            "en": "We need to go ahead today.",
            "ja": "今日「進める」する必要があります。",
            "focus": "go ahead",
            "jaFocus": "進める"
          },
          {
            "en": "I will go ahead after the meeting.",
            "ja": "会議後に「進める」します。",
            "focus": "go ahead",
            "jaFocus": "進める"
          }
        ]
      },
      {
        "phrase": "go over",
        "ja": "確認する",
        "image": "go over を仕事で使う基本表現として覚える。",
        "pattern": "go over",
        "examples": [
          {
            "en": "Please go over if possible.",
            "ja": "可能であれば「確認する」してください。",
            "focus": "go over",
            "jaFocus": "確認する"
          },
          {
            "en": "We need to go over today.",
            "ja": "今日「確認する」する必要があります。",
            "focus": "go over",
            "jaFocus": "確認する"
          },
          {
            "en": "I will go over after the meeting.",
            "ja": "会議後に「確認する」します。",
            "focus": "go over",
            "jaFocus": "確認する"
          }
        ]
      },
      {
        "phrase": "go to a meeting",
        "ja": "会議に行く",
        "image": "go to a meeting を仕事で使う基本表現として覚える。",
        "pattern": "go to a meeting",
        "examples": [
          {
            "en": "Please go to a meeting if possible.",
            "ja": "可能であれば「会議に行く」してください。",
            "focus": "go to a meeting",
            "jaFocus": "会議に行く"
          },
          {
            "en": "We need to go to a meeting today.",
            "ja": "今日「会議に行く」する必要があります。",
            "focus": "go to a meeting",
            "jaFocus": "会議に行く"
          },
          {
            "en": "I will go to a meeting after the meeting.",
            "ja": "会議後に「会議に行く」します。",
            "focus": "go to a meeting",
            "jaFocus": "会議に行く"
          }
        ]
      },
      {
        "phrase": "go on a business trip",
        "ja": "出張に行く",
        "image": "go on a business trip を仕事で使う基本表現として覚える。",
        "pattern": "go on a business trip",
        "examples": [
          {
            "en": "Please go on a business trip if possible.",
            "ja": "可能であれば「出張に行く」してください。",
            "focus": "go on a business trip",
            "jaFocus": "出張に行く"
          },
          {
            "en": "We need to go on a business trip today.",
            "ja": "今日「出張に行く」する必要があります。",
            "focus": "go on a business trip",
            "jaFocus": "出張に行く"
          },
          {
            "en": "I will go on a business trip after the meeting.",
            "ja": "会議後に「出張に行く」します。",
            "focus": "go on a business trip",
            "jaFocus": "出張に行く"
          }
        ]
      }
    ],
    "phrasalVerbs": [
      {
        "phrase": "go over",
        "ja": "確認する",
        "image": "go のコアイメージと後ろの語のイメージを合わせて理解する。",
        "pattern": "go over",
        "examples": [
          {
            "en": "We should go over this issue.",
            "ja": "この件について「確認する」すべきです。",
            "focus": "go over",
            "jaFocus": "確認する"
          },
          {
            "en": "I will go over after the call.",
            "ja": "通話後に「確認する」します。",
            "focus": "go over",
            "jaFocus": "確認する"
          },
          {
            "en": "Can you go over it today?",
            "ja": "今日それを「確認する」できますか？",
            "focus": "go over",
            "jaFocus": "確認する"
          }
        ]
      },
      {
        "phrase": "go ahead",
        "ja": "進める",
        "image": "go のコアイメージと後ろの語のイメージを合わせて理解する。",
        "pattern": "go ahead",
        "examples": [
          {
            "en": "We should go ahead this issue.",
            "ja": "この件について「進める」すべきです。",
            "focus": "go ahead",
            "jaFocus": "進める"
          },
          {
            "en": "I will go ahead after the call.",
            "ja": "通話後に「進める」します。",
            "focus": "go ahead",
            "jaFocus": "進める"
          },
          {
            "en": "Can you go ahead it today?",
            "ja": "今日それを「進める」できますか？",
            "focus": "go ahead",
            "jaFocus": "進める"
          }
        ]
      },
      {
        "phrase": "go through",
        "ja": "経験する・確認する",
        "image": "go のコアイメージと後ろの語のイメージを合わせて理解する。",
        "pattern": "go through",
        "examples": [
          {
            "en": "We should go through this issue.",
            "ja": "この件について「経験する・確認する」すべきです。",
            "focus": "go through",
            "jaFocus": "経験する・確認する"
          },
          {
            "en": "I will go through after the call.",
            "ja": "通話後に「経験する・確認する」します。",
            "focus": "go through",
            "jaFocus": "経験する・確認する"
          },
          {
            "en": "Can you go through it today?",
            "ja": "今日それを「経験する・確認する」できますか？",
            "focus": "go through",
            "jaFocus": "経験する・確認する"
          }
        ]
      },
      {
        "phrase": "go back",
        "ja": "戻る",
        "image": "go のコアイメージと後ろの語のイメージを合わせて理解する。",
        "pattern": "go back",
        "examples": [
          {
            "en": "We should go back this issue.",
            "ja": "この件について「戻る」すべきです。",
            "focus": "go back",
            "jaFocus": "戻る"
          },
          {
            "en": "I will go back after the call.",
            "ja": "通話後に「戻る」します。",
            "focus": "go back",
            "jaFocus": "戻る"
          },
          {
            "en": "Can you go back it today?",
            "ja": "今日それを「戻る」できますか？",
            "focus": "go back",
            "jaFocus": "戻る"
          }
        ]
      },
      {
        "phrase": "go on",
        "ja": "続く",
        "image": "go のコアイメージと後ろの語のイメージを合わせて理解する。",
        "pattern": "go on",
        "examples": [
          {
            "en": "We should go on this issue.",
            "ja": "この件について「続く」すべきです。",
            "focus": "go on",
            "jaFocus": "続く"
          },
          {
            "en": "I will go on after the call.",
            "ja": "通話後に「続く」します。",
            "focus": "go on",
            "jaFocus": "続く"
          },
          {
            "en": "Can you go on it today?",
            "ja": "今日それを「続く」できますか？",
            "focus": "go on",
            "jaFocus": "続く"
          }
        ]
      }
    ]
  },
  {
    "id": "come",
    "rank": 7,
    "word": "COME",
    "ipa": "/kʌm/",
    "kana": "カム",
    "syllable": "come",
    "transitivity": "他動詞・自動詞",
    "importance": "★★★★☆ 重要",
    "core": "こちらへ来る",
    "coreDetail": "人・連絡・期限・結果がこちら側へ近づく。",
    "meanings": [
      {
        "id": "m1",
        "title": "① 来る",
        "pattern": "COME TO + 場所",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "こちらへ来る",
        "point": "会議や場所に来る。",
        "examples": [
          {
            "en": "Can you come to the meeting?",
            "ja": "会議に来られますか？",
            "focus": "come to",
            "jaFocus": "来られ"
          },
          {
            "en": "The deadline is coming soon.",
            "ja": "締切が近づいています。",
            "focus": "coming",
            "jaFocus": "近づいて"
          },
          {
            "en": "The request came from the client.",
            "ja": "その依頼はクライアントから来ました。",
            "focus": "came",
            "jaFocus": "来ました"
          }
        ]
      },
      {
        "id": "m2",
        "title": "② 近づく",
        "pattern": "COME + soon / up",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "こちらへ来る",
        "point": "期限が近づく。",
        "examples": [
          {
            "en": "Can you come to the meeting?",
            "ja": "会議に来られますか？",
            "focus": "come to",
            "jaFocus": "来られ"
          },
          {
            "en": "The deadline is coming soon.",
            "ja": "締切が近づいています。",
            "focus": "coming",
            "jaFocus": "近づいて"
          },
          {
            "en": "The request came from the client.",
            "ja": "その依頼はクライアントから来ました。",
            "focus": "came",
            "jaFocus": "来ました"
          }
        ]
      },
      {
        "id": "m3",
        "title": "③ 発生する",
        "pattern": "COME FROM + 人/場所",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "こちらへ来る",
        "point": "依頼や連絡が来る。",
        "examples": [
          {
            "en": "Can you come to the meeting?",
            "ja": "会議に来られますか？",
            "focus": "come to",
            "jaFocus": "来られ"
          },
          {
            "en": "The deadline is coming soon.",
            "ja": "締切が近づいています。",
            "focus": "coming",
            "jaFocus": "近づいて"
          },
          {
            "en": "The request came from the client.",
            "ja": "その依頼はクライアントから来ました。",
            "focus": "came",
            "jaFocus": "来ました"
          }
        ]
      },
      {
        "id": "m4",
        "title": "④ 思い浮かぶ",
        "pattern": "COME TO mind",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "こちらへ来る",
        "point": "考えが浮かぶ。",
        "examples": [
          {
            "en": "Can you come to the meeting?",
            "ja": "会議に来られますか？",
            "focus": "come to",
            "jaFocus": "来られ"
          },
          {
            "en": "The deadline is coming soon.",
            "ja": "締切が近づいています。",
            "focus": "coming",
            "jaFocus": "近づいて"
          },
          {
            "en": "The request came from the client.",
            "ja": "その依頼はクライアントから来ました。",
            "focus": "came",
            "jaFocus": "来ました"
          }
        ]
      },
      {
        "id": "m5",
        "title": "⑤ 結果になる",
        "pattern": "COME TO + 結論",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "こちらへ来る",
        "point": "結論や合意に至る。",
        "examples": [
          {
            "en": "Can you come to the meeting?",
            "ja": "会議に来られますか？",
            "focus": "come to",
            "jaFocus": "来られ"
          },
          {
            "en": "The deadline is coming soon.",
            "ja": "締切が近づいています。",
            "focus": "coming",
            "jaFocus": "近づいて"
          },
          {
            "en": "The request came from the client.",
            "ja": "その依頼はクライアントから来ました。",
            "focus": "came",
            "jaFocus": "来ました"
          }
        ]
      }
    ],
    "collocations": [
      {
        "phrase": "come to a meeting",
        "ja": "会議に来る",
        "image": "come to a meeting を仕事で使う基本表現として覚える。",
        "pattern": "come to a meeting",
        "examples": [
          {
            "en": "Please come to a meeting if possible.",
            "ja": "可能であれば「会議に来る」してください。",
            "focus": "come to a meeting",
            "jaFocus": "会議に来る"
          },
          {
            "en": "We need to come to a meeting today.",
            "ja": "今日「会議に来る」する必要があります。",
            "focus": "come to a meeting",
            "jaFocus": "会議に来る"
          },
          {
            "en": "I will come to a meeting after the meeting.",
            "ja": "会議後に「会議に来る」します。",
            "focus": "come to a meeting",
            "jaFocus": "会議に来る"
          }
        ]
      },
      {
        "phrase": "come up",
        "ja": "発生する",
        "image": "come up を仕事で使う基本表現として覚える。",
        "pattern": "come up",
        "examples": [
          {
            "en": "Please come up if possible.",
            "ja": "可能であれば「発生する」してください。",
            "focus": "come up",
            "jaFocus": "発生する"
          },
          {
            "en": "We need to come up today.",
            "ja": "今日「発生する」する必要があります。",
            "focus": "come up",
            "jaFocus": "発生する"
          },
          {
            "en": "I will come up after the meeting.",
            "ja": "会議後に「発生する」します。",
            "focus": "come up",
            "jaFocus": "発生する"
          }
        ]
      },
      {
        "phrase": "come to mind",
        "ja": "思い浮かぶ",
        "image": "come to mind を仕事で使う基本表現として覚える。",
        "pattern": "come to mind",
        "examples": [
          {
            "en": "Please come to mind if possible.",
            "ja": "可能であれば「思い浮かぶ」してください。",
            "focus": "come to mind",
            "jaFocus": "思い浮かぶ"
          },
          {
            "en": "We need to come to mind today.",
            "ja": "今日「思い浮かぶ」する必要があります。",
            "focus": "come to mind",
            "jaFocus": "思い浮かぶ"
          },
          {
            "en": "I will come to mind after the meeting.",
            "ja": "会議後に「思い浮かぶ」します。",
            "focus": "come to mind",
            "jaFocus": "思い浮かぶ"
          }
        ]
      },
      {
        "phrase": "come to an agreement",
        "ja": "合意する",
        "image": "come to an agreement を仕事で使う基本表現として覚える。",
        "pattern": "come to an agreement",
        "examples": [
          {
            "en": "Please come to an agreement if possible.",
            "ja": "可能であれば「合意する」してください。",
            "focus": "come to an agreement",
            "jaFocus": "合意する"
          },
          {
            "en": "We need to come to an agreement today.",
            "ja": "今日「合意する」する必要があります。",
            "focus": "come to an agreement",
            "jaFocus": "合意する"
          },
          {
            "en": "I will come to an agreement after the meeting.",
            "ja": "会議後に「合意する」します。",
            "focus": "come to an agreement",
            "jaFocus": "合意する"
          }
        ]
      },
      {
        "phrase": "come on time",
        "ja": "時間通りに来る",
        "image": "come on time を仕事で使う基本表現として覚える。",
        "pattern": "come on time",
        "examples": [
          {
            "en": "Please come on time if possible.",
            "ja": "可能であれば「時間通りに来る」してください。",
            "focus": "come on time",
            "jaFocus": "時間通りに来る"
          },
          {
            "en": "We need to come on time today.",
            "ja": "今日「時間通りに来る」する必要があります。",
            "focus": "come on time",
            "jaFocus": "時間通りに来る"
          },
          {
            "en": "I will come on time after the meeting.",
            "ja": "会議後に「時間通りに来る」します。",
            "focus": "come on time",
            "jaFocus": "時間通りに来る"
          }
        ]
      }
    ],
    "phrasalVerbs": [
      {
        "phrase": "come up",
        "ja": "発生する",
        "image": "come のコアイメージと後ろの語のイメージを合わせて理解する。",
        "pattern": "come up",
        "examples": [
          {
            "en": "We should come up this issue.",
            "ja": "この件について「発生する」すべきです。",
            "focus": "come up",
            "jaFocus": "発生する"
          },
          {
            "en": "I will come up after the call.",
            "ja": "通話後に「発生する」します。",
            "focus": "come up",
            "jaFocus": "発生する"
          },
          {
            "en": "Can you come up it today?",
            "ja": "今日それを「発生する」できますか？",
            "focus": "come up",
            "jaFocus": "発生する"
          }
        ]
      },
      {
        "phrase": "come back",
        "ja": "戻る",
        "image": "come のコアイメージと後ろの語のイメージを合わせて理解する。",
        "pattern": "come back",
        "examples": [
          {
            "en": "We should come back this issue.",
            "ja": "この件について「戻る」すべきです。",
            "focus": "come back",
            "jaFocus": "戻る"
          },
          {
            "en": "I will come back after the call.",
            "ja": "通話後に「戻る」します。",
            "focus": "come back",
            "jaFocus": "戻る"
          },
          {
            "en": "Can you come back it today?",
            "ja": "今日それを「戻る」できますか？",
            "focus": "come back",
            "jaFocus": "戻る"
          }
        ]
      },
      {
        "phrase": "come across",
        "ja": "偶然見つける",
        "image": "come のコアイメージと後ろの語のイメージを合わせて理解する。",
        "pattern": "come across",
        "examples": [
          {
            "en": "We should come across this issue.",
            "ja": "この件について「偶然見つける」すべきです。",
            "focus": "come across",
            "jaFocus": "偶然見つける"
          },
          {
            "en": "I will come across after the call.",
            "ja": "通話後に「偶然見つける」します。",
            "focus": "come across",
            "jaFocus": "偶然見つける"
          },
          {
            "en": "Can you come across it today?",
            "ja": "今日それを「偶然見つける」できますか？",
            "focus": "come across",
            "jaFocus": "偶然見つける"
          }
        ]
      },
      {
        "phrase": "come in",
        "ja": "入る・届く",
        "image": "come のコアイメージと後ろの語のイメージを合わせて理解する。",
        "pattern": "come in",
        "examples": [
          {
            "en": "We should come in this issue.",
            "ja": "この件について「入る・届く」すべきです。",
            "focus": "come in",
            "jaFocus": "入る・届く"
          },
          {
            "en": "I will come in after the call.",
            "ja": "通話後に「入る・届く」します。",
            "focus": "come in",
            "jaFocus": "入る・届く"
          },
          {
            "en": "Can you come in it today?",
            "ja": "今日それを「入る・届く」できますか？",
            "focus": "come in",
            "jaFocus": "入る・届く"
          }
        ]
      },
      {
        "phrase": "come down to",
        "ja": "結局〜になる",
        "image": "come のコアイメージと後ろの語のイメージを合わせて理解する。",
        "pattern": "come down to",
        "examples": [
          {
            "en": "We should come down to this issue.",
            "ja": "この件について「結局〜になる」すべきです。",
            "focus": "come down to",
            "jaFocus": "結局〜になる"
          },
          {
            "en": "I will come down to after the call.",
            "ja": "通話後に「結局〜になる」します。",
            "focus": "come down to",
            "jaFocus": "結局〜になる"
          },
          {
            "en": "Can you come down to it today?",
            "ja": "今日それを「結局〜になる」できますか？",
            "focus": "come down to",
            "jaFocus": "結局〜になる"
          }
        ]
      }
    ]
  },
  {
    "id": "put",
    "rank": 8,
    "word": "PUT",
    "ipa": "/pʊt/",
    "kana": "プット",
    "syllable": "put",
    "transitivity": "他動詞・自動詞",
    "importance": "★★★★☆ 重要",
    "core": "置く",
    "coreDetail": "情報・資料・予定・考えを適切な場所に置く。",
    "meanings": [
      {
        "id": "m1",
        "title": "① 置く",
        "pattern": "PUT + 名詞 + 場所",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "置く・配置する",
        "point": "物や情報を場所に置く。",
        "examples": [
          {
            "en": "Please put the file in the folder.",
            "ja": "ファイルをフォルダに入れてください。",
            "focus": "put",
            "jaFocus": "入れて"
          },
          {
            "en": "I put the details in the email.",
            "ja": "詳細はメールに記載しました。",
            "focus": "put",
            "jaFocus": "記載"
          },
          {
            "en": "Let’s put this on the agenda.",
            "ja": "これを議題に入れましょう。",
            "focus": "put",
            "jaFocus": "入れ"
          }
        ]
      },
      {
        "id": "m2",
        "title": "② 記載する",
        "pattern": "PUT + 情報 + in/on",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "置く・配置する",
        "point": "メールや資料に情報を入れる。",
        "examples": [
          {
            "en": "Please put the file in the folder.",
            "ja": "ファイルをフォルダに入れてください。",
            "focus": "put",
            "jaFocus": "入れて"
          },
          {
            "en": "I put the details in the email.",
            "ja": "詳細はメールに記載しました。",
            "focus": "put",
            "jaFocus": "記載"
          },
          {
            "en": "Let’s put this on the agenda.",
            "ja": "これを議題に入れましょう。",
            "focus": "put",
            "jaFocus": "入れ"
          }
        ]
      },
      {
        "id": "m3",
        "title": "③ 提案する",
        "pattern": "PUT FORWARD + 名詞",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "置く・配置する",
        "point": "案を前に出す。",
        "examples": [
          {
            "en": "Please put the file in the folder.",
            "ja": "ファイルをフォルダに入れてください。",
            "focus": "put",
            "jaFocus": "入れて"
          },
          {
            "en": "I put the details in the email.",
            "ja": "詳細はメールに記載しました。",
            "focus": "put",
            "jaFocus": "記載"
          },
          {
            "en": "Let’s put this on the agenda.",
            "ja": "これを議題に入れましょう。",
            "focus": "put",
            "jaFocus": "入れ"
          }
        ]
      },
      {
        "id": "m4",
        "title": "④ 優先する",
        "pattern": "PUT + priority on",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "置く・配置する",
        "point": "重点を置く。",
        "examples": [
          {
            "en": "Please put the file in the folder.",
            "ja": "ファイルをフォルダに入れてください。",
            "focus": "put",
            "jaFocus": "入れて"
          },
          {
            "en": "I put the details in the email.",
            "ja": "詳細はメールに記載しました。",
            "focus": "put",
            "jaFocus": "記載"
          },
          {
            "en": "Let’s put this on the agenda.",
            "ja": "これを議題に入れましょう。",
            "focus": "put",
            "jaFocus": "入れ"
          }
        ]
      },
      {
        "id": "m5",
        "title": "⑤ 人を状態にする",
        "pattern": "PUT + 人 + in 状態",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "置く・配置する",
        "point": "相手を特定の状況に置く。",
        "examples": [
          {
            "en": "Please put the file in the folder.",
            "ja": "ファイルをフォルダに入れてください。",
            "focus": "put",
            "jaFocus": "入れて"
          },
          {
            "en": "I put the details in the email.",
            "ja": "詳細はメールに記載しました。",
            "focus": "put",
            "jaFocus": "記載"
          },
          {
            "en": "Let’s put this on the agenda.",
            "ja": "これを議題に入れましょう。",
            "focus": "put",
            "jaFocus": "入れ"
          }
        ]
      }
    ],
    "collocations": [
      {
        "phrase": "put in writing",
        "ja": "書面にする",
        "image": "put in writing を仕事で使う基本表現として覚える。",
        "pattern": "put in writing",
        "examples": [
          {
            "en": "Please put in writing if possible.",
            "ja": "可能であれば「書面にする」してください。",
            "focus": "put in writing",
            "jaFocus": "書面にする"
          },
          {
            "en": "We need to put in writing today.",
            "ja": "今日「書面にする」する必要があります。",
            "focus": "put in writing",
            "jaFocus": "書面にする"
          },
          {
            "en": "I will put in writing after the meeting.",
            "ja": "会議後に「書面にする」します。",
            "focus": "put in writing",
            "jaFocus": "書面にする"
          }
        ]
      },
      {
        "phrase": "put priority on",
        "ja": "優先する",
        "image": "put priority on を仕事で使う基本表現として覚える。",
        "pattern": "put priority on",
        "examples": [
          {
            "en": "Please put priority on if possible.",
            "ja": "可能であれば「優先する」してください。",
            "focus": "put priority on",
            "jaFocus": "優先する"
          },
          {
            "en": "We need to put priority on today.",
            "ja": "今日「優先する」する必要があります。",
            "focus": "put priority on",
            "jaFocus": "優先する"
          },
          {
            "en": "I will put priority on after the meeting.",
            "ja": "会議後に「優先する」します。",
            "focus": "put priority on",
            "jaFocus": "優先する"
          }
        ]
      },
      {
        "phrase": "put pressure on",
        "ja": "圧力をかける",
        "image": "put pressure on を仕事で使う基本表現として覚える。",
        "pattern": "put pressure on",
        "examples": [
          {
            "en": "Please put pressure on if possible.",
            "ja": "可能であれば「圧力をかける」してください。",
            "focus": "put pressure on",
            "jaFocus": "圧力をかける"
          },
          {
            "en": "We need to put pressure on today.",
            "ja": "今日「圧力をかける」する必要があります。",
            "focus": "put pressure on",
            "jaFocus": "圧力をかける"
          },
          {
            "en": "I will put pressure on after the meeting.",
            "ja": "会議後に「圧力をかける」します。",
            "focus": "put pressure on",
            "jaFocus": "圧力をかける"
          }
        ]
      },
      {
        "phrase": "put a plan in place",
        "ja": "計画を整える",
        "image": "put a plan in place を仕事で使う基本表現として覚える。",
        "pattern": "put a plan in place",
        "examples": [
          {
            "en": "Please put a plan in place if possible.",
            "ja": "可能であれば「計画を整える」してください。",
            "focus": "put a plan in place",
            "jaFocus": "計画を整える"
          },
          {
            "en": "We need to put a plan in place today.",
            "ja": "今日「計画を整える」する必要があります。",
            "focus": "put a plan in place",
            "jaFocus": "計画を整える"
          },
          {
            "en": "I will put a plan in place after the meeting.",
            "ja": "会議後に「計画を整える」します。",
            "focus": "put a plan in place",
            "jaFocus": "計画を整える"
          }
        ]
      },
      {
        "phrase": "put effort into",
        "ja": "力を入れる",
        "image": "put effort into を仕事で使う基本表現として覚える。",
        "pattern": "put effort into",
        "examples": [
          {
            "en": "Please put effort into if possible.",
            "ja": "可能であれば「力を入れる」してください。",
            "focus": "put effort into",
            "jaFocus": "力を入れる"
          },
          {
            "en": "We need to put effort into today.",
            "ja": "今日「力を入れる」する必要があります。",
            "focus": "put effort into",
            "jaFocus": "力を入れる"
          },
          {
            "en": "I will put effort into after the meeting.",
            "ja": "会議後に「力を入れる」します。",
            "focus": "put effort into",
            "jaFocus": "力を入れる"
          }
        ]
      }
    ],
    "phrasalVerbs": [
      {
        "phrase": "put off",
        "ja": "延期する",
        "image": "put のコアイメージと後ろの語のイメージを合わせて理解する。",
        "pattern": "put off",
        "examples": [
          {
            "en": "We should put off this issue.",
            "ja": "この件について「延期する」すべきです。",
            "focus": "put off",
            "jaFocus": "延期する"
          },
          {
            "en": "I will put off after the call.",
            "ja": "通話後に「延期する」します。",
            "focus": "put off",
            "jaFocus": "延期する"
          },
          {
            "en": "Can you put off it today?",
            "ja": "今日それを「延期する」できますか？",
            "focus": "put off",
            "jaFocus": "延期する"
          }
        ]
      },
      {
        "phrase": "put together",
        "ja": "まとめる",
        "image": "put のコアイメージと後ろの語のイメージを合わせて理解する。",
        "pattern": "put together",
        "examples": [
          {
            "en": "We should put together this issue.",
            "ja": "この件について「まとめる」すべきです。",
            "focus": "put together",
            "jaFocus": "まとめる"
          },
          {
            "en": "I will put together after the call.",
            "ja": "通話後に「まとめる」します。",
            "focus": "put together",
            "jaFocus": "まとめる"
          },
          {
            "en": "Can you put together it today?",
            "ja": "今日それを「まとめる」できますか？",
            "focus": "put together",
            "jaFocus": "まとめる"
          }
        ]
      },
      {
        "phrase": "put forward",
        "ja": "提案する",
        "image": "put のコアイメージと後ろの語のイメージを合わせて理解する。",
        "pattern": "put forward",
        "examples": [
          {
            "en": "We should put forward this issue.",
            "ja": "この件について「提案する」すべきです。",
            "focus": "put forward",
            "jaFocus": "提案する"
          },
          {
            "en": "I will put forward after the call.",
            "ja": "通話後に「提案する」します。",
            "focus": "put forward",
            "jaFocus": "提案する"
          },
          {
            "en": "Can you put forward it today?",
            "ja": "今日それを「提案する」できますか？",
            "focus": "put forward",
            "jaFocus": "提案する"
          }
        ]
      },
      {
        "phrase": "put in",
        "ja": "投入する",
        "image": "put のコアイメージと後ろの語のイメージを合わせて理解する。",
        "pattern": "put in",
        "examples": [
          {
            "en": "We should put in this issue.",
            "ja": "この件について「投入する」すべきです。",
            "focus": "put in",
            "jaFocus": "投入する"
          },
          {
            "en": "I will put in after the call.",
            "ja": "通話後に「投入する」します。",
            "focus": "put in",
            "jaFocus": "投入する"
          },
          {
            "en": "Can you put in it today?",
            "ja": "今日それを「投入する」できますか？",
            "focus": "put in",
            "jaFocus": "投入する"
          }
        ]
      },
      {
        "phrase": "put up with",
        "ja": "我慢する",
        "image": "put のコアイメージと後ろの語のイメージを合わせて理解する。",
        "pattern": "put up with",
        "examples": [
          {
            "en": "We should put up with this issue.",
            "ja": "この件について「我慢する」すべきです。",
            "focus": "put up with",
            "jaFocus": "我慢する"
          },
          {
            "en": "I will put up with after the call.",
            "ja": "通話後に「我慢する」します。",
            "focus": "put up with",
            "jaFocus": "我慢する"
          },
          {
            "en": "Can you put up with it today?",
            "ja": "今日それを「我慢する」できますか？",
            "focus": "put up with",
            "jaFocus": "我慢する"
          }
        ]
      }
    ]
  },
  {
    "id": "keep",
    "rank": 9,
    "word": "KEEP",
    "ipa": "/kiːp/",
    "kana": "キープ",
    "syllable": "keep",
    "transitivity": "他動詞・自動詞",
    "importance": "★★★★☆ 重要",
    "core": "保つ",
    "coreDetail": "状態・情報・約束・品質を維持する。",
    "meanings": [
      {
        "id": "m1",
        "title": "① 保つ",
        "pattern": "KEEP + 名詞 + 形容詞",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "保つ・続ける",
        "point": "状態を維持する。",
        "examples": [
          {
            "en": "Please keep me updated.",
            "ja": "進捗を随時共有してください。",
            "focus": "keep me updated",
            "jaFocus": "共有"
          },
          {
            "en": "Let’s keep the schedule flexible.",
            "ja": "スケジュールは柔軟にしておきましょう。",
            "focus": "keep",
            "jaFocus": "しておき"
          },
          {
            "en": "We need to keep the quality high.",
            "ja": "品質を高く保つ必要があります。",
            "focus": "keep",
            "jaFocus": "保つ"
          }
        ]
      },
      {
        "id": "m2",
        "title": "② 続ける",
        "pattern": "KEEP + 動名詞",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "保つ・続ける",
        "point": "動作を続ける。",
        "examples": [
          {
            "en": "Please keep me updated.",
            "ja": "進捗を随時共有してください。",
            "focus": "keep me updated",
            "jaFocus": "共有"
          },
          {
            "en": "Let’s keep the schedule flexible.",
            "ja": "スケジュールは柔軟にしておきましょう。",
            "focus": "keep",
            "jaFocus": "しておき"
          },
          {
            "en": "We need to keep the quality high.",
            "ja": "品質を高く保つ必要があります。",
            "focus": "keep",
            "jaFocus": "保つ"
          }
        ]
      },
      {
        "id": "m3",
        "title": "③ 連絡し続ける",
        "pattern": "KEEP + 人 + updated",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "保つ・続ける",
        "point": "情報共有を続ける。",
        "examples": [
          {
            "en": "Please keep me updated.",
            "ja": "進捗を随時共有してください。",
            "focus": "keep me updated",
            "jaFocus": "共有"
          },
          {
            "en": "Let’s keep the schedule flexible.",
            "ja": "スケジュールは柔軟にしておきましょう。",
            "focus": "keep",
            "jaFocus": "しておき"
          },
          {
            "en": "We need to keep the quality high.",
            "ja": "品質を高く保つ必要があります。",
            "focus": "keep",
            "jaFocus": "保つ"
          }
        ]
      },
      {
        "id": "m4",
        "title": "④ 守る",
        "pattern": "KEEP + promise / deadline",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "保つ・続ける",
        "point": "約束や期限を守る。",
        "examples": [
          {
            "en": "Please keep me updated.",
            "ja": "進捗を随時共有してください。",
            "focus": "keep me updated",
            "jaFocus": "共有"
          },
          {
            "en": "Let’s keep the schedule flexible.",
            "ja": "スケジュールは柔軟にしておきましょう。",
            "focus": "keep",
            "jaFocus": "しておき"
          },
          {
            "en": "We need to keep the quality high.",
            "ja": "品質を高く保つ必要があります。",
            "focus": "keep",
            "jaFocus": "保つ"
          }
        ]
      },
      {
        "id": "m5",
        "title": "⑤ 取っておく",
        "pattern": "KEEP + 名詞",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "保つ・続ける",
        "point": "資料や記録を残す。",
        "examples": [
          {
            "en": "Please keep me updated.",
            "ja": "進捗を随時共有してください。",
            "focus": "keep me updated",
            "jaFocus": "共有"
          },
          {
            "en": "Let’s keep the schedule flexible.",
            "ja": "スケジュールは柔軟にしておきましょう。",
            "focus": "keep",
            "jaFocus": "しておき"
          },
          {
            "en": "We need to keep the quality high.",
            "ja": "品質を高く保つ必要があります。",
            "focus": "keep",
            "jaFocus": "保つ"
          }
        ]
      }
    ],
    "collocations": [
      {
        "phrase": "keep me updated",
        "ja": "随時共有する",
        "image": "keep me updated を仕事で使う基本表現として覚える。",
        "pattern": "keep me updated",
        "examples": [
          {
            "en": "Please keep me updated if possible.",
            "ja": "可能であれば「随時共有する」してください。",
            "focus": "keep me updated",
            "jaFocus": "随時共有する"
          },
          {
            "en": "We need to keep me updated today.",
            "ja": "今日「随時共有する」する必要があります。",
            "focus": "keep me updated",
            "jaFocus": "随時共有する"
          },
          {
            "en": "I will keep me updated after the meeting.",
            "ja": "会議後に「随時共有する」します。",
            "focus": "keep me updated",
            "jaFocus": "随時共有する"
          }
        ]
      },
      {
        "phrase": "keep in touch",
        "ja": "連絡を取り合う",
        "image": "keep in touch を仕事で使う基本表現として覚える。",
        "pattern": "keep in touch",
        "examples": [
          {
            "en": "Please keep in touch if possible.",
            "ja": "可能であれば「連絡を取り合う」してください。",
            "focus": "keep in touch",
            "jaFocus": "連絡を取り合う"
          },
          {
            "en": "We need to keep in touch today.",
            "ja": "今日「連絡を取り合う」する必要があります。",
            "focus": "keep in touch",
            "jaFocus": "連絡を取り合う"
          },
          {
            "en": "I will keep in touch after the meeting.",
            "ja": "会議後に「連絡を取り合う」します。",
            "focus": "keep in touch",
            "jaFocus": "連絡を取り合う"
          }
        ]
      },
      {
        "phrase": "keep a record",
        "ja": "記録を残す",
        "image": "keep a record を仕事で使う基本表現として覚える。",
        "pattern": "keep a record",
        "examples": [
          {
            "en": "Please keep a record if possible.",
            "ja": "可能であれば「記録を残す」してください。",
            "focus": "keep a record",
            "jaFocus": "記録を残す"
          },
          {
            "en": "We need to keep a record today.",
            "ja": "今日「記録を残す」する必要があります。",
            "focus": "keep a record",
            "jaFocus": "記録を残す"
          },
          {
            "en": "I will keep a record after the meeting.",
            "ja": "会議後に「記録を残す」します。",
            "focus": "keep a record",
            "jaFocus": "記録を残す"
          }
        ]
      },
      {
        "phrase": "keep the deadline",
        "ja": "期限を守る",
        "image": "keep the deadline を仕事で使う基本表現として覚える。",
        "pattern": "keep the deadline",
        "examples": [
          {
            "en": "Please keep the deadline if possible.",
            "ja": "可能であれば「期限を守る」してください。",
            "focus": "keep the deadline",
            "jaFocus": "期限を守る"
          },
          {
            "en": "We need to keep the deadline today.",
            "ja": "今日「期限を守る」する必要があります。",
            "focus": "keep the deadline",
            "jaFocus": "期限を守る"
          },
          {
            "en": "I will keep the deadline after the meeting.",
            "ja": "会議後に「期限を守る」します。",
            "focus": "keep the deadline",
            "jaFocus": "期限を守る"
          }
        ]
      },
      {
        "phrase": "keep it simple",
        "ja": "簡潔にする",
        "image": "keep it simple を仕事で使う基本表現として覚える。",
        "pattern": "keep it simple",
        "examples": [
          {
            "en": "Please keep it simple if possible.",
            "ja": "可能であれば「簡潔にする」してください。",
            "focus": "keep it simple",
            "jaFocus": "簡潔にする"
          },
          {
            "en": "We need to keep it simple today.",
            "ja": "今日「簡潔にする」する必要があります。",
            "focus": "keep it simple",
            "jaFocus": "簡潔にする"
          },
          {
            "en": "I will keep it simple after the meeting.",
            "ja": "会議後に「簡潔にする」します。",
            "focus": "keep it simple",
            "jaFocus": "簡潔にする"
          }
        ]
      }
    ],
    "phrasalVerbs": [
      {
        "phrase": "keep up",
        "ja": "維持する",
        "image": "keep のコアイメージと後ろの語のイメージを合わせて理解する。",
        "pattern": "keep up",
        "examples": [
          {
            "en": "We should keep up this issue.",
            "ja": "この件について「維持する」すべきです。",
            "focus": "keep up",
            "jaFocus": "維持する"
          },
          {
            "en": "I will keep up after the call.",
            "ja": "通話後に「維持する」します。",
            "focus": "keep up",
            "jaFocus": "維持する"
          },
          {
            "en": "Can you keep up it today?",
            "ja": "今日それを「維持する」できますか？",
            "focus": "keep up",
            "jaFocus": "維持する"
          }
        ]
      },
      {
        "phrase": "keep going",
        "ja": "続ける",
        "image": "keep のコアイメージと後ろの語のイメージを合わせて理解する。",
        "pattern": "keep going",
        "examples": [
          {
            "en": "We should keep going this issue.",
            "ja": "この件について「続ける」すべきです。",
            "focus": "keep going",
            "jaFocus": "続ける"
          },
          {
            "en": "I will keep going after the call.",
            "ja": "通話後に「続ける」します。",
            "focus": "keep going",
            "jaFocus": "続ける"
          },
          {
            "en": "Can you keep going it today?",
            "ja": "今日それを「続ける」できますか？",
            "focus": "keep going",
            "jaFocus": "続ける"
          }
        ]
      },
      {
        "phrase": "keep on",
        "ja": "続ける",
        "image": "keep のコアイメージと後ろの語のイメージを合わせて理解する。",
        "pattern": "keep on",
        "examples": [
          {
            "en": "We should keep on this issue.",
            "ja": "この件について「続ける」すべきです。",
            "focus": "keep on",
            "jaFocus": "続ける"
          },
          {
            "en": "I will keep on after the call.",
            "ja": "通話後に「続ける」します。",
            "focus": "keep on",
            "jaFocus": "続ける"
          },
          {
            "en": "Can you keep on it today?",
            "ja": "今日それを「続ける」できますか？",
            "focus": "keep on",
            "jaFocus": "続ける"
          }
        ]
      },
      {
        "phrase": "keep out",
        "ja": "入れない",
        "image": "keep のコアイメージと後ろの語のイメージを合わせて理解する。",
        "pattern": "keep out",
        "examples": [
          {
            "en": "We should keep out this issue.",
            "ja": "この件について「入れない」すべきです。",
            "focus": "keep out",
            "jaFocus": "入れない"
          },
          {
            "en": "I will keep out after the call.",
            "ja": "通話後に「入れない」します。",
            "focus": "keep out",
            "jaFocus": "入れない"
          },
          {
            "en": "Can you keep out it today?",
            "ja": "今日それを「入れない」できますか？",
            "focus": "keep out",
            "jaFocus": "入れない"
          }
        ]
      },
      {
        "phrase": "keep away",
        "ja": "近づけない",
        "image": "keep のコアイメージと後ろの語のイメージを合わせて理解する。",
        "pattern": "keep away",
        "examples": [
          {
            "en": "We should keep away this issue.",
            "ja": "この件について「近づけない」すべきです。",
            "focus": "keep away",
            "jaFocus": "近づけない"
          },
          {
            "en": "I will keep away after the call.",
            "ja": "通話後に「近づけない」します。",
            "focus": "keep away",
            "jaFocus": "近づけない"
          },
          {
            "en": "Can you keep away it today?",
            "ja": "今日それを「近づけない」できますか？",
            "focus": "keep away",
            "jaFocus": "近づけない"
          }
        ]
      }
    ]
  },
  {
    "id": "find",
    "rank": 10,
    "word": "FIND",
    "ipa": "/faɪnd/",
    "kana": "ファインド",
    "syllable": "find",
    "transitivity": "他動詞・自動詞",
    "importance": "★★★★☆ 重要",
    "core": "見つける",
    "coreDetail": "情報・原因・方法・時間を見つける。",
    "meanings": [
      {
        "id": "m1",
        "title": "① 見つける",
        "pattern": "FIND + 名詞",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "見つける・分かる",
        "point": "必要なものを見つける。",
        "examples": [
          {
            "en": "I found the cause of the issue.",
            "ja": "問題の原因を見つけました。",
            "focus": "found",
            "jaFocus": "見つけ"
          },
          {
            "en": "Can you find a better solution?",
            "ja": "より良い解決策を見つけられますか？",
            "focus": "find",
            "jaFocus": "見つけ"
          },
          {
            "en": "We need to find time for a meeting.",
            "ja": "会議の時間を見つける必要があります。",
            "focus": "find time",
            "jaFocus": "時間"
          }
        ]
      },
      {
        "id": "m2",
        "title": "② 分かる",
        "pattern": "FIND + that節",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "見つける・分かる",
        "point": "調べて分かる。",
        "examples": [
          {
            "en": "I found the cause of the issue.",
            "ja": "問題の原因を見つけました。",
            "focus": "found",
            "jaFocus": "見つけ"
          },
          {
            "en": "Can you find a better solution?",
            "ja": "より良い解決策を見つけられますか？",
            "focus": "find",
            "jaFocus": "見つけ"
          },
          {
            "en": "We need to find time for a meeting.",
            "ja": "会議の時間を見つける必要があります。",
            "focus": "find time",
            "jaFocus": "時間"
          }
        ]
      },
      {
        "id": "m3",
        "title": "③ 方法を見つける",
        "pattern": "FIND a way to",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "見つける・分かる",
        "point": "解決策を見つける。",
        "examples": [
          {
            "en": "I found the cause of the issue.",
            "ja": "問題の原因を見つけました。",
            "focus": "found",
            "jaFocus": "見つけ"
          },
          {
            "en": "Can you find a better solution?",
            "ja": "より良い解決策を見つけられますか？",
            "focus": "find",
            "jaFocus": "見つけ"
          },
          {
            "en": "We need to find time for a meeting.",
            "ja": "会議の時間を見つける必要があります。",
            "focus": "find time",
            "jaFocus": "時間"
          }
        ]
      },
      {
        "id": "m4",
        "title": "④ 時間を作る",
        "pattern": "FIND time",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "見つける・分かる",
        "point": "時間を見つける。",
        "examples": [
          {
            "en": "I found the cause of the issue.",
            "ja": "問題の原因を見つけました。",
            "focus": "found",
            "jaFocus": "見つけ"
          },
          {
            "en": "Can you find a better solution?",
            "ja": "より良い解決策を見つけられますか？",
            "focus": "find",
            "jaFocus": "見つけ"
          },
          {
            "en": "We need to find time for a meeting.",
            "ja": "会議の時間を見つける必要があります。",
            "focus": "find time",
            "jaFocus": "時間"
          }
        ]
      },
      {
        "id": "m5",
        "title": "⑤ 感じる",
        "pattern": "FIND + O + 形容詞",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "見つける・分かる",
        "point": "ある印象を持つ。",
        "examples": [
          {
            "en": "I found the cause of the issue.",
            "ja": "問題の原因を見つけました。",
            "focus": "found",
            "jaFocus": "見つけ"
          },
          {
            "en": "Can you find a better solution?",
            "ja": "より良い解決策を見つけられますか？",
            "focus": "find",
            "jaFocus": "見つけ"
          },
          {
            "en": "We need to find time for a meeting.",
            "ja": "会議の時間を見つける必要があります。",
            "focus": "find time",
            "jaFocus": "時間"
          }
        ]
      }
    ],
    "collocations": [
      {
        "phrase": "find a solution",
        "ja": "解決策を見つける",
        "image": "find a solution を仕事で使う基本表現として覚える。",
        "pattern": "find a solution",
        "examples": [
          {
            "en": "Please find a solution if possible.",
            "ja": "可能であれば「解決策を見つける」してください。",
            "focus": "find a solution",
            "jaFocus": "解決策を見つける"
          },
          {
            "en": "We need to find a solution today.",
            "ja": "今日「解決策を見つける」する必要があります。",
            "focus": "find a solution",
            "jaFocus": "解決策を見つける"
          },
          {
            "en": "I will find a solution after the meeting.",
            "ja": "会議後に「解決策を見つける」します。",
            "focus": "find a solution",
            "jaFocus": "解決策を見つける"
          }
        ]
      },
      {
        "phrase": "find time",
        "ja": "時間を作る",
        "image": "find time を仕事で使う基本表現として覚える。",
        "pattern": "find time",
        "examples": [
          {
            "en": "Please find time if possible.",
            "ja": "可能であれば「時間を作る」してください。",
            "focus": "find time",
            "jaFocus": "時間を作る"
          },
          {
            "en": "We need to find time today.",
            "ja": "今日「時間を作る」する必要があります。",
            "focus": "find time",
            "jaFocus": "時間を作る"
          },
          {
            "en": "I will find time after the meeting.",
            "ja": "会議後に「時間を作る」します。",
            "focus": "find time",
            "jaFocus": "時間を作る"
          }
        ]
      },
      {
        "phrase": "find out",
        "ja": "分かる",
        "image": "find out を仕事で使う基本表現として覚える。",
        "pattern": "find out",
        "examples": [
          {
            "en": "Please find out if possible.",
            "ja": "可能であれば「分かる」してください。",
            "focus": "find out",
            "jaFocus": "分かる"
          },
          {
            "en": "We need to find out today.",
            "ja": "今日「分かる」する必要があります。",
            "focus": "find out",
            "jaFocus": "分かる"
          },
          {
            "en": "I will find out after the meeting.",
            "ja": "会議後に「分かる」します。",
            "focus": "find out",
            "jaFocus": "分かる"
          }
        ]
      },
      {
        "phrase": "find a way",
        "ja": "方法を見つける",
        "image": "find a way を仕事で使う基本表現として覚える。",
        "pattern": "find a way",
        "examples": [
          {
            "en": "Please find a way if possible.",
            "ja": "可能であれば「方法を見つける」してください。",
            "focus": "find a way",
            "jaFocus": "方法を見つける"
          },
          {
            "en": "We need to find a way today.",
            "ja": "今日「方法を見つける」する必要があります。",
            "focus": "find a way",
            "jaFocus": "方法を見つける"
          },
          {
            "en": "I will find a way after the meeting.",
            "ja": "会議後に「方法を見つける」します。",
            "focus": "find a way",
            "jaFocus": "方法を見つける"
          }
        ]
      },
      {
        "phrase": "find it difficult",
        "ja": "難しいと感じる",
        "image": "find it difficult を仕事で使う基本表現として覚える。",
        "pattern": "find it difficult",
        "examples": [
          {
            "en": "Please find it difficult if possible.",
            "ja": "可能であれば「難しいと感じる」してください。",
            "focus": "find it difficult",
            "jaFocus": "難しいと感じる"
          },
          {
            "en": "We need to find it difficult today.",
            "ja": "今日「難しいと感じる」する必要があります。",
            "focus": "find it difficult",
            "jaFocus": "難しいと感じる"
          },
          {
            "en": "I will find it difficult after the meeting.",
            "ja": "会議後に「難しいと感じる」します。",
            "focus": "find it difficult",
            "jaFocus": "難しいと感じる"
          }
        ]
      }
    ],
    "phrasalVerbs": [
      {
        "phrase": "find out",
        "ja": "分かる",
        "image": "find のコアイメージと後ろの語のイメージを合わせて理解する。",
        "pattern": "find out",
        "examples": [
          {
            "en": "We should find out this issue.",
            "ja": "この件について「分かる」すべきです。",
            "focus": "find out",
            "jaFocus": "分かる"
          },
          {
            "en": "I will find out after the call.",
            "ja": "通話後に「分かる」します。",
            "focus": "find out",
            "jaFocus": "分かる"
          },
          {
            "en": "Can you find out it today?",
            "ja": "今日それを「分かる」できますか？",
            "focus": "find out",
            "jaFocus": "分かる"
          }
        ]
      },
      {
        "phrase": "find in",
        "ja": "〜の中に見つける",
        "image": "find のコアイメージと後ろの語のイメージを合わせて理解する。",
        "pattern": "find in",
        "examples": [
          {
            "en": "We should find in this issue.",
            "ja": "この件について「〜の中に見つける」すべきです。",
            "focus": "find in",
            "jaFocus": "〜の中に見つける"
          },
          {
            "en": "I will find in after the call.",
            "ja": "通話後に「〜の中に見つける」します。",
            "focus": "find in",
            "jaFocus": "〜の中に見つける"
          },
          {
            "en": "Can you find in it today?",
            "ja": "今日それを「〜の中に見つける」できますか？",
            "focus": "find in",
            "jaFocus": "〜の中に見つける"
          }
        ]
      },
      {
        "phrase": "find for",
        "ja": "〜のために見つける",
        "image": "find のコアイメージと後ろの語のイメージを合わせて理解する。",
        "pattern": "find for",
        "examples": [
          {
            "en": "We should find for this issue.",
            "ja": "この件について「〜のために見つける」すべきです。",
            "focus": "find for",
            "jaFocus": "〜のために見つける"
          },
          {
            "en": "I will find for after the call.",
            "ja": "通話後に「〜のために見つける」します。",
            "focus": "find for",
            "jaFocus": "〜のために見つける"
          },
          {
            "en": "Can you find for it today?",
            "ja": "今日それを「〜のために見つける」できますか？",
            "focus": "find for",
            "jaFocus": "〜のために見つける"
          }
        ]
      },
      {
        "phrase": "find against",
        "ja": "不利な判断をする",
        "image": "find のコアイメージと後ろの語のイメージを合わせて理解する。",
        "pattern": "find against",
        "examples": [
          {
            "en": "We should find against this issue.",
            "ja": "この件について「不利な判断をする」すべきです。",
            "focus": "find against",
            "jaFocus": "不利な判断をする"
          },
          {
            "en": "I will find against after the call.",
            "ja": "通話後に「不利な判断をする」します。",
            "focus": "find against",
            "jaFocus": "不利な判断をする"
          },
          {
            "en": "Can you find against it today?",
            "ja": "今日それを「不利な判断をする」できますか？",
            "focus": "find against",
            "jaFocus": "不利な判断をする"
          }
        ]
      },
      {
        "phrase": "find oneself",
        "ja": "気づくと〜している",
        "image": "find のコアイメージと後ろの語のイメージを合わせて理解する。",
        "pattern": "find oneself",
        "examples": [
          {
            "en": "We should find oneself this issue.",
            "ja": "この件について「気づくと〜している」すべきです。",
            "focus": "find oneself",
            "jaFocus": "気づくと〜している"
          },
          {
            "en": "I will find oneself after the call.",
            "ja": "通話後に「気づくと〜している」します。",
            "focus": "find oneself",
            "jaFocus": "気づくと〜している"
          },
          {
            "en": "Can you find oneself it today?",
            "ja": "今日それを「気づくと〜している」できますか？",
            "focus": "find oneself",
            "jaFocus": "気づくと〜している"
          }
        ]
      }
    ]
  },
  {
    "id": "see",
    "rank": 11,
    "word": "SEE",
    "ipa": "",
    "kana": "シー",
    "syllable": "see",
    "transitivity": "他動詞・自動詞",
    "importance": "★★★★☆ 重要",
    "core": "見る・理解する",
    "coreDetail": "状況や意図を確認する",
    "meanings": [
      {
        "id": "business-basic",
        "title": "① ビジネスで使う基本形",
        "pattern": "see + 名詞 / see if",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "状況や意図を確認する",
        "point": "まずは社会人の会話・メールで使いやすい基本形を覚える。",
        "examples": [
          {
            "en": "I see your point.",
            "ja": "おっしゃる点は分かります。",
            "focus": "see",
            "object": "your point",
            "jaFocus": "分かります"
          },
          {
            "en": "Let me see the document.",
            "ja": "資料を確認させてください。",
            "focus": "see",
            "object": "the document",
            "jaFocus": "確認"
          },
          {
            "en": "I'll see if we can adjust it.",
            "ja": "調整できるか確認します。",
            "focus": "see if",
            "jaFocus": "確認"
          }
        ]
      }
    ],
    "collocations": [],
    "phrasalVerbs": []
  },
  {
    "id": "look",
    "rank": 12,
    "word": "LOOK",
    "ipa": "",
    "kana": "ルック",
    "syllable": "look",
    "transitivity": "他動詞・自動詞",
    "importance": "★★★★☆ 重要",
    "core": "目を向ける・確認する",
    "coreDetail": "資料や状況を見る",
    "meanings": [
      {
        "id": "business-basic",
        "title": "① ビジネスで使う基本形",
        "pattern": "look at + 名詞",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "資料や状況を見る",
        "point": "まずは社会人の会話・メールで使いやすい基本形を覚える。",
        "examples": [
          {
            "en": "Please look at the latest version.",
            "ja": "最新版を確認してください。",
            "focus": "look at",
            "object": "the latest version",
            "jaFocus": "確認"
          },
          {
            "en": "I'll look into the issue.",
            "ja": "その問題を調べます。",
            "focus": "look into",
            "object": "the issue",
            "jaFocus": "調べ"
          },
          {
            "en": "This looks good to me.",
            "ja": "私には良さそうに見えます。",
            "focus": "looks",
            "jaFocus": "見えます"
          }
        ]
      }
    ],
    "collocations": [],
    "phrasalVerbs": []
  },
  {
    "id": "watch",
    "rank": 13,
    "word": "WATCH",
    "ipa": "",
    "kana": "ウォッチ",
    "syllable": "watch",
    "transitivity": "他動詞・自動詞",
    "importance": "★★★★☆ 重要",
    "core": "注意して見る",
    "coreDetail": "状況や数字を継続的に見る",
    "meanings": [
      {
        "id": "business-basic",
        "title": "① ビジネスで使う基本形",
        "pattern": "watch + 名詞",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "状況や数字を継続的に見る",
        "point": "まずは社会人の会話・メールで使いやすい基本形を覚える。",
        "examples": [
          {
            "en": "We need to watch the delivery schedule.",
            "ja": "納期スケジュールを注意して見る必要があります。",
            "focus": "watch",
            "object": "the delivery schedule",
            "jaFocus": "注意して見る"
          },
          {
            "en": "Please watch the market trend.",
            "ja": "市場動向を注視してください。",
            "focus": "watch",
            "object": "the market trend",
            "jaFocus": "注視"
          },
          {
            "en": "I watched the training video.",
            "ja": "研修動画を見ました。",
            "focus": "watched",
            "object": "the training video",
            "jaFocus": "見ました"
          }
        ]
      }
    ],
    "collocations": [],
    "phrasalVerbs": []
  },
  {
    "id": "hear",
    "rank": 14,
    "word": "HEAR",
    "ipa": "",
    "kana": "ヒア",
    "syllable": "hear",
    "transitivity": "他動詞・自動詞",
    "importance": "★★★★☆ 重要",
    "core": "聞く・耳に入る",
    "coreDetail": "情報や話が耳に入る",
    "meanings": [
      {
        "id": "business-basic",
        "title": "① ビジネスで使う基本形",
        "pattern": "hear + 名詞",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "情報や話が耳に入る",
        "point": "まずは社会人の会話・メールで使いやすい基本形を覚える。",
        "examples": [
          {
            "en": "I heard about the delay.",
            "ja": "遅延について聞きました。",
            "focus": "heard",
            "object": "the delay",
            "jaFocus": "聞き"
          },
          {
            "en": "Did you hear from the supplier?",
            "ja": "仕入先から連絡はありましたか？",
            "focus": "hear from",
            "jaFocus": "連絡"
          },
          {
            "en": "I heard good feedback from the client.",
            "ja": "クライアントから良い反応を聞きました。",
            "focus": "heard",
            "object": "good feedback",
            "jaFocus": "聞き"
          }
        ]
      }
    ],
    "collocations": [],
    "phrasalVerbs": []
  },
  {
    "id": "listen",
    "rank": 15,
    "word": "LISTEN",
    "ipa": "",
    "kana": "リッスン",
    "syllable": "listen",
    "transitivity": "他動詞・自動詞",
    "importance": "★★★★☆ 重要",
    "core": "意識して聞く",
    "coreDetail": "相手の話を注意して聞く",
    "meanings": [
      {
        "id": "business-basic",
        "title": "① ビジネスで使う基本形",
        "pattern": "listen to + 名詞",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "相手の話を注意して聞く",
        "point": "まずは社会人の会話・メールで使いやすい基本形を覚える。",
        "examples": [
          {
            "en": "Please listen to the customer's needs.",
            "ja": "顧客のニーズを聞いてください。",
            "focus": "listen to",
            "object": "the customer's needs",
            "jaFocus": "聞いて"
          },
          {
            "en": "I listened to the explanation.",
            "ja": "説明を聞きました。",
            "focus": "listened to",
            "object": "the explanation",
            "jaFocus": "聞き"
          },
          {
            "en": "Let's listen carefully before deciding.",
            "ja": "決める前にしっかり聞きましょう。",
            "focus": "listen",
            "jaFocus": "聞き"
          }
        ]
      }
    ],
    "collocations": [],
    "phrasalVerbs": []
  },
  {
    "id": "think",
    "rank": 16,
    "word": "THINK",
    "ipa": "",
    "kana": "シンク",
    "syllable": "think",
    "transitivity": "他動詞・自動詞",
    "importance": "★★★★☆ 重要",
    "core": "考える・思う",
    "coreDetail": "判断や意見を持つ",
    "meanings": [
      {
        "id": "business-basic",
        "title": "① ビジネスで使う基本形",
        "pattern": "think + 文",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "判断や意見を持つ",
        "point": "まずは社会人の会話・メールで使いやすい基本形を覚える。",
        "examples": [
          {
            "en": "I think we should revise the proposal.",
            "ja": "提案書を修正すべきだと思います。",
            "focus": "think",
            "jaFocus": "思います"
          },
          {
            "en": "What do you think about this plan?",
            "ja": "この計画についてどう思いますか？",
            "focus": "think",
            "jaFocus": "思いますか"
          },
          {
            "en": "I'll think about the best option.",
            "ja": "最善の選択肢を考えます。",
            "focus": "think about",
            "object": "the best option",
            "jaFocus": "考え"
          }
        ]
      }
    ],
    "collocations": [],
    "phrasalVerbs": []
  },
  {
    "id": "know",
    "rank": 17,
    "word": "KNOW",
    "ipa": "",
    "kana": "ノウ",
    "syllable": "know",
    "transitivity": "他動詞・自動詞",
    "importance": "★★★★☆ 重要",
    "core": "知っている・把握している",
    "coreDetail": "情報や状況を知っている",
    "meanings": [
      {
        "id": "business-basic",
        "title": "① ビジネスで使う基本形",
        "pattern": "know + 名詞 / know that",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "情報や状況を知っている",
        "point": "まずは社会人の会話・メールで使いやすい基本形を覚える。",
        "examples": [
          {
            "en": "I know the client well.",
            "ja": "そのクライアントをよく知っています。",
            "focus": "know",
            "object": "the client",
            "jaFocus": "知って"
          },
          {
            "en": "Do you know the deadline?",
            "ja": "締切を知っていますか？",
            "focus": "know",
            "object": "the deadline",
            "jaFocus": "知って"
          },
          {
            "en": "I know this is urgent.",
            "ja": "これが急ぎだと分かっています。",
            "focus": "know",
            "jaFocus": "分かって"
          }
        ]
      }
    ],
    "collocations": [],
    "phrasalVerbs": []
  },
  {
    "id": "feel",
    "rank": 18,
    "word": "FEEL",
    "ipa": "",
    "kana": "フィール",
    "syllable": "feel",
    "transitivity": "他動詞・自動詞",
    "importance": "★★★★☆ 重要",
    "core": "感じる",
    "coreDetail": "意見や状態を感覚で表す",
    "meanings": [
      {
        "id": "business-basic",
        "title": "① ビジネスで使う基本形",
        "pattern": "feel + 形容詞",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "意見や状態を感覚で表す",
        "point": "まずは社会人の会話・メールで使いやすい基本形を覚える。",
        "examples": [
          {
            "en": "I feel this is a good opportunity.",
            "ja": "これは良い機会だと感じます。",
            "focus": "feel",
            "jaFocus": "感じ"
          },
          {
            "en": "I feel confident about the proposal.",
            "ja": "その提案には自信があります。",
            "focus": "feel confident",
            "jaFocus": "自信"
          },
          {
            "en": "Do you feel ready for the meeting?",
            "ja": "会議の準備はできていますか？",
            "focus": "feel ready",
            "jaFocus": "準備"
          }
        ]
      }
    ],
    "collocations": [],
    "phrasalVerbs": []
  },
  {
    "id": "work",
    "rank": 19,
    "word": "WORK",
    "ipa": "",
    "kana": "ワーク",
    "syllable": "work",
    "transitivity": "他動詞・自動詞",
    "importance": "★★★★☆ 重要",
    "core": "働く・機能する",
    "coreDetail": "人が働く、方法や仕組みが機能する",
    "meanings": [
      {
        "id": "business-basic",
        "title": "① ビジネスで使う基本形",
        "pattern": "work + 副詞 / work on",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "人が働く、方法や仕組みが機能する",
        "point": "まずは社会人の会話・メールで使いやすい基本形を覚える。",
        "examples": [
          {
            "en": "This solution works well.",
            "ja": "この解決策はうまく機能します。",
            "focus": "works well",
            "jaFocus": "機能"
          },
          {
            "en": "I'm working on the quotation.",
            "ja": "見積書を作成中です。",
            "focus": "working on",
            "object": "the quotation",
            "jaFocus": "作成中"
          },
          {
            "en": "We work with overseas clients.",
            "ja": "海外顧客と仕事をしています。",
            "focus": "work with",
            "object": "overseas clients",
            "jaFocus": "仕事"
          }
        ]
      }
    ],
    "collocations": [],
    "phrasalVerbs": []
  },
  {
    "id": "use",
    "rank": 20,
    "word": "USE",
    "ipa": "",
    "kana": "ユーズ",
    "syllable": "use",
    "transitivity": "他動詞・自動詞",
    "importance": "★★★★☆ 重要",
    "core": "使う",
    "coreDetail": "道具・情報・方法を使う",
    "meanings": [
      {
        "id": "business-basic",
        "title": "① ビジネスで使う基本形",
        "pattern": "use + 名詞",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "道具・情報・方法を使う",
        "point": "まずは社会人の会話・メールで使いやすい基本形を覚える。",
        "examples": [
          {
            "en": "Please use the latest data.",
            "ja": "最新データを使ってください。",
            "focus": "use",
            "object": "the latest data",
            "jaFocus": "使って"
          },
          {
            "en": "We use this tool every day.",
            "ja": "私たちはこのツールを毎日使っています。",
            "focus": "use",
            "object": "this tool",
            "jaFocus": "使って"
          },
          {
            "en": "Can we use this example?",
            "ja": "この例を使えますか？",
            "focus": "use",
            "object": "this example",
            "jaFocus": "使え"
          }
        ]
      }
    ],
    "collocations": [],
    "phrasalVerbs": []
  },
  {
    "id": "start",
    "rank": 21,
    "word": "START",
    "ipa": "",
    "kana": "スタート",
    "syllable": "start",
    "transitivity": "他動詞・自動詞",
    "importance": "★★★★☆ 重要",
    "core": "始める",
    "coreDetail": "作業や会議を開始する",
    "meanings": [
      {
        "id": "business-basic",
        "title": "① ビジネスで使う基本形",
        "pattern": "START + 名詞 / 文",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "作業や会議を開始する",
        "point": "まずは社会人の会話・メールで使いやすい基本形を覚える。",
        "examples": [
          {
            "en": "Let's start the meeting.",
            "ja": "会議を始めましょう。",
            "focus": "start",
            "object": "the meeting",
            "jaFocus": "始め"
          },
          {
            "en": "We need to start the project next week.",
            "ja": "来週その案件を始める必要があります。",
            "focus": "start",
            "object": "the project",
            "jaFocus": "始める"
          },
          {
            "en": "Can we start with the agenda?",
            "ja": "議題から始めてもいいですか？",
            "focus": "start with",
            "object": "the agenda",
            "jaFocus": "始め"
          }
        ]
      }
    ],
    "collocations": [],
    "phrasalVerbs": []
  },
  {
    "id": "stop",
    "rank": 22,
    "word": "STOP",
    "ipa": "",
    "kana": "ストップ",
    "syllable": "stop",
    "transitivity": "他動詞・自動詞",
    "importance": "★★★★☆ 重要",
    "core": "止める",
    "coreDetail": "作業や問題を止める",
    "meanings": [
      {
        "id": "business-basic",
        "title": "① ビジネスで使う基本形",
        "pattern": "STOP + 名詞 / 文",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "作業や問題を止める",
        "point": "まずは社会人の会話・メールで使いやすい基本形を覚える。",
        "examples": [
          {
            "en": "Let's stop here for today.",
            "ja": "今日はここで終わりにしましょう。",
            "focus": "stop",
            "jaFocus": "終わり"
          },
          {
            "en": "We need to stop the delay.",
            "ja": "遅延を止める必要があります。",
            "focus": "stop",
            "object": "the delay",
            "jaFocus": "止める"
          },
          {
            "en": "Please stop using the old file.",
            "ja": "古いファイルの使用をやめてください。",
            "focus": "stop using",
            "object": "the old file",
            "jaFocus": "やめて"
          }
        ]
      }
    ],
    "collocations": [],
    "phrasalVerbs": []
  },
  {
    "id": "try",
    "rank": 23,
    "word": "TRY",
    "ipa": "",
    "kana": "トライ",
    "syllable": "try",
    "transitivity": "他動詞・自動詞",
    "importance": "★★★★☆ 重要",
    "core": "試す",
    "coreDetail": "方法を試す",
    "meanings": [
      {
        "id": "business-basic",
        "title": "① ビジネスで使う基本形",
        "pattern": "TRY + 名詞 / 文",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "方法を試す",
        "point": "まずは社会人の会話・メールで使いやすい基本形を覚える。",
        "examples": [
          {
            "en": "I'll try a different approach.",
            "ja": "別の方法を試してみます。",
            "focus": "try",
            "object": "a different approach",
            "jaFocus": "試して"
          },
          {
            "en": "Let's try this first.",
            "ja": "まずこれを試しましょう。",
            "focus": "try",
            "object": "this",
            "jaFocus": "試し"
          },
          {
            "en": "Can you try again tomorrow?",
            "ja": "明日もう一度試せますか？",
            "focus": "try",
            "jaFocus": "試せ"
          }
        ]
      }
    ],
    "collocations": [],
    "phrasalVerbs": []
  },
  {
    "id": "help",
    "rank": 24,
    "word": "HELP",
    "ipa": "",
    "kana": "ヘルプ",
    "syllable": "help",
    "transitivity": "他動詞・自動詞",
    "importance": "★★★★☆ 重要",
    "core": "助ける",
    "coreDetail": "人や作業を助ける",
    "meanings": [
      {
        "id": "business-basic",
        "title": "① ビジネスで使う基本形",
        "pattern": "HELP + 名詞 / 文",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "人や作業を助ける",
        "point": "まずは社会人の会話・メールで使いやすい基本形を覚える。",
        "examples": [
          {
            "en": "Can you help me with this report?",
            "ja": "この報告書を手伝ってもらえますか？",
            "focus": "help me",
            "object": "this report",
            "jaFocus": "手伝って"
          },
          {
            "en": "This tool helps us save time.",
            "ja": "このツールは時間短縮に役立ちます。",
            "focus": "helps",
            "object": "save time",
            "jaFocus": "役立ち"
          },
          {
            "en": "I'll help the team prepare.",
            "ja": "チームの準備を手伝います。",
            "focus": "help",
            "object": "the team",
            "jaFocus": "手伝い"
          }
        ]
      }
    ],
    "collocations": [],
    "phrasalVerbs": []
  },
  {
    "id": "show",
    "rank": 25,
    "word": "SHOW",
    "ipa": "",
    "kana": "ショウ",
    "syllable": "show",
    "transitivity": "他動詞・自動詞",
    "importance": "★★★★☆ 重要",
    "core": "見せる",
    "coreDetail": "資料や結果を見せる",
    "meanings": [
      {
        "id": "business-basic",
        "title": "① ビジネスで使う基本形",
        "pattern": "SHOW + 名詞 / 文",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "資料や結果を見せる",
        "point": "まずは社会人の会話・メールで使いやすい基本形を覚える。",
        "examples": [
          {
            "en": "I'll show you the data.",
            "ja": "データをお見せします。",
            "focus": "show you",
            "object": "the data",
            "jaFocus": "お見せ"
          },
          {
            "en": "This chart shows the trend.",
            "ja": "この表は傾向を示しています。",
            "focus": "shows",
            "object": "the trend",
            "jaFocus": "示して"
          },
          {
            "en": "Can you show me the sample?",
            "ja": "サンプルを見せてもらえますか？",
            "focus": "show me",
            "object": "the sample",
            "jaFocus": "見せて"
          }
        ]
      }
    ],
    "collocations": [],
    "phrasalVerbs": []
  },
  {
    "id": "tell",
    "rank": 26,
    "word": "TELL",
    "ipa": "",
    "kana": "テル",
    "syllable": "tell",
    "transitivity": "他動詞・自動詞",
    "importance": "★★★★☆ 重要",
    "core": "伝える",
    "coreDetail": "情報を伝える",
    "meanings": [
      {
        "id": "business-basic",
        "title": "① ビジネスで使う基本形",
        "pattern": "TELL + 名詞 / 文",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "情報を伝える",
        "point": "まずは社会人の会話・メールで使いやすい基本形を覚える。",
        "examples": [
          {
            "en": "I will tell the details.",
            "ja": "詳細を確認・対応します。",
            "focus": "tell",
            "object": "the details",
            "jaFocus": "確認・対応"
          },
          {
            "en": "We need to tell this today.",
            "ja": "今日これを進める必要があります。",
            "focus": "tell",
            "object": "this",
            "jaFocus": "進める"
          },
          {
            "en": "Can you tell it by tomorrow?",
            "ja": "明日までに対応できますか？",
            "focus": "tell",
            "object": "it",
            "jaFocus": "対応"
          }
        ]
      }
    ],
    "collocations": [],
    "phrasalVerbs": []
  },
  {
    "id": "ask",
    "rank": 27,
    "word": "ASK",
    "ipa": "",
    "kana": "アスク",
    "syllable": "ask",
    "transitivity": "他動詞・自動詞",
    "importance": "★★★★☆ 重要",
    "core": "尋ねる・依頼する",
    "coreDetail": "質問や依頼をする",
    "meanings": [
      {
        "id": "business-basic",
        "title": "① ビジネスで使う基本形",
        "pattern": "ASK + 名詞 / 文",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "質問や依頼をする",
        "point": "まずは社会人の会話・メールで使いやすい基本形を覚える。",
        "examples": [
          {
            "en": "I'll ask the supplier.",
            "ja": "仕入先に確認します。",
            "focus": "ask",
            "object": "the supplier",
            "jaFocus": "確認"
          },
          {
            "en": "Can I ask a quick question?",
            "ja": "少し質問してもいいですか？",
            "focus": "ask",
            "object": "a quick question",
            "jaFocus": "質問"
          },
          {
            "en": "We should ask for approval.",
            "ja": "承認を依頼すべきです。",
            "focus": "ask for",
            "object": "approval",
            "jaFocus": "依頼"
          }
        ]
      }
    ],
    "collocations": [],
    "phrasalVerbs": []
  },
  {
    "id": "call",
    "rank": 28,
    "word": "CALL",
    "ipa": "",
    "kana": "コール",
    "syllable": "call",
    "transitivity": "他動詞・自動詞",
    "importance": "★★★★☆ 重要",
    "core": "電話する・呼ぶ",
    "coreDetail": "連絡や呼び方を表す",
    "meanings": [
      {
        "id": "business-basic",
        "title": "① ビジネスで使う基本形",
        "pattern": "CALL + 名詞 / 文",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "連絡や呼び方を表す",
        "point": "まずは社会人の会話・メールで使いやすい基本形を覚える。",
        "examples": [
          {
            "en": "I will call the details.",
            "ja": "詳細を確認・対応します。",
            "focus": "call",
            "object": "the details",
            "jaFocus": "確認・対応"
          },
          {
            "en": "We need to call this today.",
            "ja": "今日これを進める必要があります。",
            "focus": "call",
            "object": "this",
            "jaFocus": "進める"
          },
          {
            "en": "Can you call it by tomorrow?",
            "ja": "明日までに対応できますか？",
            "focus": "call",
            "object": "it",
            "jaFocus": "対応"
          }
        ]
      }
    ],
    "collocations": [],
    "phrasalVerbs": []
  },
  {
    "id": "leave",
    "rank": 29,
    "word": "LEAVE",
    "ipa": "",
    "kana": "リーヴ",
    "syllable": "leave",
    "transitivity": "他動詞・自動詞",
    "importance": "★★★★☆ 重要",
    "core": "離れる・残す",
    "coreDetail": "場所を離れる、情報を残す",
    "meanings": [
      {
        "id": "business-basic",
        "title": "① ビジネスで使う基本形",
        "pattern": "LEAVE + 名詞 / 文",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "場所を離れる、情報を残す",
        "point": "まずは社会人の会話・メールで使いやすい基本形を覚える。",
        "examples": [
          {
            "en": "I will leave the details.",
            "ja": "詳細を確認・対応します。",
            "focus": "leave",
            "object": "the details",
            "jaFocus": "確認・対応"
          },
          {
            "en": "We need to leave this today.",
            "ja": "今日これを進める必要があります。",
            "focus": "leave",
            "object": "this",
            "jaFocus": "進める"
          },
          {
            "en": "Can you leave it by tomorrow?",
            "ja": "明日までに対応できますか？",
            "focus": "leave",
            "object": "it",
            "jaFocus": "対応"
          }
        ]
      }
    ],
    "collocations": [],
    "phrasalVerbs": []
  },
  {
    "id": "move",
    "rank": 30,
    "word": "MOVE",
    "ipa": "",
    "kana": "ムーヴ",
    "syllable": "move",
    "transitivity": "他動詞・自動詞",
    "importance": "★★★★☆ 重要",
    "core": "動かす・移動する",
    "coreDetail": "予定や物を動かす",
    "meanings": [
      {
        "id": "business-basic",
        "title": "① ビジネスで使う基本形",
        "pattern": "MOVE + 名詞 / 文",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "予定や物を動かす",
        "point": "まずは社会人の会話・メールで使いやすい基本形を覚える。",
        "examples": [
          {
            "en": "I will move the details.",
            "ja": "詳細を確認・対応します。",
            "focus": "move",
            "object": "the details",
            "jaFocus": "確認・対応"
          },
          {
            "en": "We need to move this today.",
            "ja": "今日これを進める必要があります。",
            "focus": "move",
            "object": "this",
            "jaFocus": "進める"
          },
          {
            "en": "Can you move it by tomorrow?",
            "ja": "明日までに対応できますか？",
            "focus": "move",
            "object": "it",
            "jaFocus": "対応"
          }
        ]
      }
    ],
    "collocations": [],
    "phrasalVerbs": []
  },
  {
    "id": "turn",
    "rank": 31,
    "word": "TURN",
    "ipa": "",
    "kana": "ターン",
    "syllable": "turn",
    "transitivity": "他動詞・自動詞",
    "importance": "★★★★☆ 重要",
    "core": "変える・向きを変える",
    "coreDetail": "状態を変える",
    "meanings": [
      {
        "id": "business-basic",
        "title": "① ビジネスで使う基本形",
        "pattern": "TURN + 名詞 / 文",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "状態を変える",
        "point": "まずは社会人の会話・メールで使いやすい基本形を覚える。",
        "examples": [
          {
            "en": "I will turn the details.",
            "ja": "詳細を確認・対応します。",
            "focus": "turn",
            "object": "the details",
            "jaFocus": "確認・対応"
          },
          {
            "en": "We need to turn this today.",
            "ja": "今日これを進める必要があります。",
            "focus": "turn",
            "object": "this",
            "jaFocus": "進める"
          },
          {
            "en": "Can you turn it by tomorrow?",
            "ja": "明日までに対応できますか？",
            "focus": "turn",
            "object": "it",
            "jaFocus": "対応"
          }
        ]
      }
    ],
    "collocations": [],
    "phrasalVerbs": []
  },
  {
    "id": "bring",
    "rank": 32,
    "word": "BRING",
    "ipa": "",
    "kana": "ブリング",
    "syllable": "bring",
    "transitivity": "他動詞・自動詞",
    "importance": "★★★★☆ 重要",
    "core": "持ってくる",
    "coreDetail": "相手の所へ持ってくる",
    "meanings": [
      {
        "id": "business-basic",
        "title": "① ビジネスで使う基本形",
        "pattern": "BRING + 名詞 / 文",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "相手の所へ持ってくる",
        "point": "まずは社会人の会話・メールで使いやすい基本形を覚える。",
        "examples": [
          {
            "en": "I will bring the details.",
            "ja": "詳細を確認・対応します。",
            "focus": "bring",
            "object": "the details",
            "jaFocus": "確認・対応"
          },
          {
            "en": "We need to bring this today.",
            "ja": "今日これを進める必要があります。",
            "focus": "bring",
            "object": "this",
            "jaFocus": "進める"
          },
          {
            "en": "Can you bring it by tomorrow?",
            "ja": "明日までに対応できますか？",
            "focus": "bring",
            "object": "it",
            "jaFocus": "対応"
          }
        ]
      }
    ],
    "collocations": [],
    "phrasalVerbs": []
  },
  {
    "id": "hold",
    "rank": 33,
    "word": "HOLD",
    "ipa": "",
    "kana": "ホールド",
    "syllable": "hold",
    "transitivity": "他動詞・自動詞",
    "importance": "★★★★☆ 重要",
    "core": "保持する・開催する",
    "coreDetail": "会議や状態を保つ",
    "meanings": [
      {
        "id": "business-basic",
        "title": "① ビジネスで使う基本形",
        "pattern": "HOLD + 名詞 / 文",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "会議や状態を保つ",
        "point": "まずは社会人の会話・メールで使いやすい基本形を覚える。",
        "examples": [
          {
            "en": "I will hold the details.",
            "ja": "詳細を確認・対応します。",
            "focus": "hold",
            "object": "the details",
            "jaFocus": "確認・対応"
          },
          {
            "en": "We need to hold this today.",
            "ja": "今日これを進める必要があります。",
            "focus": "hold",
            "object": "this",
            "jaFocus": "進める"
          },
          {
            "en": "Can you hold it by tomorrow?",
            "ja": "明日までに対応できますか？",
            "focus": "hold",
            "object": "it",
            "jaFocus": "対応"
          }
        ]
      }
    ],
    "collocations": [],
    "phrasalVerbs": []
  },
  {
    "id": "set",
    "rank": 34,
    "word": "SET",
    "ipa": "",
    "kana": "セット",
    "syllable": "set",
    "transitivity": "他動詞・自動詞",
    "importance": "★★★★☆ 重要",
    "core": "設定する",
    "coreDetail": "期限や条件を設定する",
    "meanings": [
      {
        "id": "business-basic",
        "title": "① ビジネスで使う基本形",
        "pattern": "SET + 名詞 / 文",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "期限や条件を設定する",
        "point": "まずは社会人の会話・メールで使いやすい基本形を覚える。",
        "examples": [
          {
            "en": "I will set the details.",
            "ja": "詳細を確認・対応します。",
            "focus": "set",
            "object": "the details",
            "jaFocus": "確認・対応"
          },
          {
            "en": "We need to set this today.",
            "ja": "今日これを進める必要があります。",
            "focus": "set",
            "object": "this",
            "jaFocus": "進める"
          },
          {
            "en": "Can you set it by tomorrow?",
            "ja": "明日までに対応できますか？",
            "focus": "set",
            "object": "it",
            "jaFocus": "対応"
          }
        ]
      }
    ],
    "collocations": [],
    "phrasalVerbs": []
  },
  {
    "id": "change",
    "rank": 35,
    "word": "CHANGE",
    "ipa": "",
    "kana": "チェンジ",
    "syllable": "change",
    "transitivity": "他動詞・自動詞",
    "importance": "★★★★☆ 重要",
    "core": "変える",
    "coreDetail": "計画や内容を変更する",
    "meanings": [
      {
        "id": "business-basic",
        "title": "① ビジネスで使う基本形",
        "pattern": "CHANGE + 名詞 / 文",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "計画や内容を変更する",
        "point": "まずは社会人の会話・メールで使いやすい基本形を覚える。",
        "examples": [
          {
            "en": "I will change the details.",
            "ja": "詳細を確認・対応します。",
            "focus": "change",
            "object": "the details",
            "jaFocus": "確認・対応"
          },
          {
            "en": "We need to change this today.",
            "ja": "今日これを進める必要があります。",
            "focus": "change",
            "object": "this",
            "jaFocus": "進める"
          },
          {
            "en": "Can you change it by tomorrow?",
            "ja": "明日までに対応できますか？",
            "focus": "change",
            "object": "it",
            "jaFocus": "対応"
          }
        ]
      }
    ],
    "collocations": [],
    "phrasalVerbs": []
  },
  {
    "id": "open",
    "rank": 36,
    "word": "OPEN",
    "ipa": "",
    "kana": "オープン",
    "syllable": "open",
    "transitivity": "他動詞・自動詞",
    "importance": "★★★★☆ 重要",
    "core": "開く",
    "coreDetail": "会議・ファイル・可能性を開く",
    "meanings": [
      {
        "id": "business-basic",
        "title": "① ビジネスで使う基本形",
        "pattern": "OPEN + 名詞 / 文",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "会議・ファイル・可能性を開く",
        "point": "まずは社会人の会話・メールで使いやすい基本形を覚える。",
        "examples": [
          {
            "en": "I will open the details.",
            "ja": "詳細を確認・対応します。",
            "focus": "open",
            "object": "the details",
            "jaFocus": "確認・対応"
          },
          {
            "en": "We need to open this today.",
            "ja": "今日これを進める必要があります。",
            "focus": "open",
            "object": "this",
            "jaFocus": "進める"
          },
          {
            "en": "Can you open it by tomorrow?",
            "ja": "明日までに対応できますか？",
            "focus": "open",
            "object": "it",
            "jaFocus": "対応"
          }
        ]
      }
    ],
    "collocations": [],
    "phrasalVerbs": []
  },
  {
    "id": "close",
    "rank": 37,
    "word": "CLOSE",
    "ipa": "",
    "kana": "クローズ",
    "syllable": "close",
    "transitivity": "他動詞・自動詞",
    "importance": "★★★★☆ 重要",
    "core": "閉じる・終える",
    "coreDetail": "会議や案件を終える",
    "meanings": [
      {
        "id": "business-basic",
        "title": "① ビジネスで使う基本形",
        "pattern": "CLOSE + 名詞 / 文",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "会議や案件を終える",
        "point": "まずは社会人の会話・メールで使いやすい基本形を覚える。",
        "examples": [
          {
            "en": "I will close the details.",
            "ja": "詳細を確認・対応します。",
            "focus": "close",
            "object": "the details",
            "jaFocus": "確認・対応"
          },
          {
            "en": "We need to close this today.",
            "ja": "今日これを進める必要があります。",
            "focus": "close",
            "object": "this",
            "jaFocus": "進める"
          },
          {
            "en": "Can you close it by tomorrow?",
            "ja": "明日までに対応できますか？",
            "focus": "close",
            "object": "it",
            "jaFocus": "対応"
          }
        ]
      }
    ],
    "collocations": [],
    "phrasalVerbs": []
  },
  {
    "id": "build",
    "rank": 38,
    "word": "BUILD",
    "ipa": "",
    "kana": "ビルド",
    "syllable": "build",
    "transitivity": "他動詞・自動詞",
    "importance": "★★★★☆ 重要",
    "core": "作る・築く",
    "coreDetail": "関係や仕組みを作る",
    "meanings": [
      {
        "id": "business-basic",
        "title": "① ビジネスで使う基本形",
        "pattern": "BUILD + 名詞 / 文",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "関係や仕組みを作る",
        "point": "まずは社会人の会話・メールで使いやすい基本形を覚える。",
        "examples": [
          {
            "en": "I will build the details.",
            "ja": "詳細を確認・対応します。",
            "focus": "build",
            "object": "the details",
            "jaFocus": "確認・対応"
          },
          {
            "en": "We need to build this today.",
            "ja": "今日これを進める必要があります。",
            "focus": "build",
            "object": "this",
            "jaFocus": "進める"
          },
          {
            "en": "Can you build it by tomorrow?",
            "ja": "明日までに対応できますか？",
            "focus": "build",
            "object": "it",
            "jaFocus": "対応"
          }
        ]
      }
    ],
    "collocations": [],
    "phrasalVerbs": []
  },
  {
    "id": "learn",
    "rank": 39,
    "word": "LEARN",
    "ipa": "",
    "kana": "ラーン",
    "syllable": "learn",
    "transitivity": "他動詞・自動詞",
    "importance": "★★★★☆ 重要",
    "core": "学ぶ",
    "coreDetail": "情報や方法を学ぶ",
    "meanings": [
      {
        "id": "business-basic",
        "title": "① ビジネスで使う基本形",
        "pattern": "LEARN + 名詞 / 文",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "情報や方法を学ぶ",
        "point": "まずは社会人の会話・メールで使いやすい基本形を覚える。",
        "examples": [
          {
            "en": "I will learn the details.",
            "ja": "詳細を確認・対応します。",
            "focus": "learn",
            "object": "the details",
            "jaFocus": "確認・対応"
          },
          {
            "en": "We need to learn this today.",
            "ja": "今日これを進める必要があります。",
            "focus": "learn",
            "object": "this",
            "jaFocus": "進める"
          },
          {
            "en": "Can you learn it by tomorrow?",
            "ja": "明日までに対応できますか？",
            "focus": "learn",
            "object": "it",
            "jaFocus": "対応"
          }
        ]
      }
    ],
    "collocations": [],
    "phrasalVerbs": []
  },
  {
    "id": "meet",
    "rank": 40,
    "word": "MEET",
    "ipa": "",
    "kana": "ミート",
    "syllable": "meet",
    "transitivity": "他動詞・自動詞",
    "importance": "★★★★☆ 重要",
    "core": "会う・満たす",
    "coreDetail": "人に会う、条件を満たす",
    "meanings": [
      {
        "id": "business-basic",
        "title": "① ビジネスで使う基本形",
        "pattern": "MEET + 名詞 / 文",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "人に会う、条件を満たす",
        "point": "まずは社会人の会話・メールで使いやすい基本形を覚える。",
        "examples": [
          {
            "en": "I will meet the details.",
            "ja": "詳細を確認・対応します。",
            "focus": "meet",
            "object": "the details",
            "jaFocus": "確認・対応"
          },
          {
            "en": "We need to meet this today.",
            "ja": "今日これを進める必要があります。",
            "focus": "meet",
            "object": "this",
            "jaFocus": "進める"
          },
          {
            "en": "Can you meet it by tomorrow?",
            "ja": "明日までに対応できますか？",
            "focus": "meet",
            "object": "it",
            "jaFocus": "対応"
          }
        ]
      }
    ],
    "collocations": [],
    "phrasalVerbs": []
  },
  {
    "id": "send",
    "rank": 41,
    "word": "SEND",
    "ipa": "",
    "kana": "センド",
    "syllable": "send",
    "transitivity": "他動詞・自動詞",
    "importance": "★★★★☆ 重要",
    "core": "送る",
    "coreDetail": "メールや資料を送る",
    "meanings": [
      {
        "id": "business-basic",
        "title": "① ビジネスで使う基本形",
        "pattern": "SEND + 名詞 / 文",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "メールや資料を送る",
        "point": "まずは社会人の会話・メールで使いやすい基本形を覚える。",
        "examples": [
          {
            "en": "I'll send the file today.",
            "ja": "今日ファイルを送ります。",
            "focus": "send",
            "object": "the file",
            "jaFocus": "送ります"
          },
          {
            "en": "Please send me the quotation.",
            "ja": "見積書を送ってください。",
            "focus": "send me",
            "object": "the quotation",
            "jaFocus": "送って"
          },
          {
            "en": "Did you send the email?",
            "ja": "メールを送りましたか？",
            "focus": "send",
            "object": "the email",
            "jaFocus": "送り"
          }
        ]
      }
    ],
    "collocations": [],
    "phrasalVerbs": []
  },
  {
    "id": "pay",
    "rank": 42,
    "word": "PAY",
    "ipa": "",
    "kana": "ペイ",
    "syllable": "pay",
    "transitivity": "他動詞・自動詞",
    "importance": "★★★★☆ 重要",
    "core": "支払う",
    "coreDetail": "費用や注意を払う",
    "meanings": [
      {
        "id": "business-basic",
        "title": "① ビジネスで使う基本形",
        "pattern": "PAY + 名詞 / 文",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "費用や注意を払う",
        "point": "まずは社会人の会話・メールで使いやすい基本形を覚える。",
        "examples": [
          {
            "en": "I will pay the details.",
            "ja": "詳細を確認・対応します。",
            "focus": "pay",
            "object": "the details",
            "jaFocus": "確認・対応"
          },
          {
            "en": "We need to pay this today.",
            "ja": "今日これを進める必要があります。",
            "focus": "pay",
            "object": "this",
            "jaFocus": "進める"
          },
          {
            "en": "Can you pay it by tomorrow?",
            "ja": "明日までに対応できますか？",
            "focus": "pay",
            "object": "it",
            "jaFocus": "対応"
          }
        ]
      }
    ],
    "collocations": [],
    "phrasalVerbs": []
  },
  {
    "id": "buy",
    "rank": 43,
    "word": "BUY",
    "ipa": "",
    "kana": "バイ",
    "syllable": "buy",
    "transitivity": "他動詞・自動詞",
    "importance": "★★★★☆ 重要",
    "core": "買う",
    "coreDetail": "商品やサービスを購入する",
    "meanings": [
      {
        "id": "business-basic",
        "title": "① ビジネスで使う基本形",
        "pattern": "BUY + 名詞 / 文",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "商品やサービスを購入する",
        "point": "まずは社会人の会話・メールで使いやすい基本形を覚える。",
        "examples": [
          {
            "en": "I will buy the details.",
            "ja": "詳細を確認・対応します。",
            "focus": "buy",
            "object": "the details",
            "jaFocus": "確認・対応"
          },
          {
            "en": "We need to buy this today.",
            "ja": "今日これを進める必要があります。",
            "focus": "buy",
            "object": "this",
            "jaFocus": "進める"
          },
          {
            "en": "Can you buy it by tomorrow?",
            "ja": "明日までに対応できますか？",
            "focus": "buy",
            "object": "it",
            "jaFocus": "対応"
          }
        ]
      }
    ],
    "collocations": [],
    "phrasalVerbs": []
  },
  {
    "id": "sell",
    "rank": 44,
    "word": "SELL",
    "ipa": "",
    "kana": "セル",
    "syllable": "sell",
    "transitivity": "他動詞・自動詞",
    "importance": "★★★★☆ 重要",
    "core": "売る",
    "coreDetail": "商品や提案を売る",
    "meanings": [
      {
        "id": "business-basic",
        "title": "① ビジネスで使う基本形",
        "pattern": "SELL + 名詞 / 文",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "商品や提案を売る",
        "point": "まずは社会人の会話・メールで使いやすい基本形を覚える。",
        "examples": [
          {
            "en": "I will sell the details.",
            "ja": "詳細を確認・対応します。",
            "focus": "sell",
            "object": "the details",
            "jaFocus": "確認・対応"
          },
          {
            "en": "We need to sell this today.",
            "ja": "今日これを進める必要があります。",
            "focus": "sell",
            "object": "this",
            "jaFocus": "進める"
          },
          {
            "en": "Can you sell it by tomorrow?",
            "ja": "明日までに対応できますか？",
            "focus": "sell",
            "object": "it",
            "jaFocus": "対応"
          }
        ]
      }
    ],
    "collocations": [],
    "phrasalVerbs": []
  },
  {
    "id": "choose",
    "rank": 45,
    "word": "CHOOSE",
    "ipa": "",
    "kana": "チューズ",
    "syllable": "choose",
    "transitivity": "他動詞・自動詞",
    "importance": "★★★★☆ 重要",
    "core": "選ぶ",
    "coreDetail": "選択肢を選ぶ",
    "meanings": [
      {
        "id": "business-basic",
        "title": "① ビジネスで使う基本形",
        "pattern": "CHOOSE + 名詞 / 文",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "選択肢を選ぶ",
        "point": "まずは社会人の会話・メールで使いやすい基本形を覚える。",
        "examples": [
          {
            "en": "I will choose the details.",
            "ja": "詳細を確認・対応します。",
            "focus": "choose",
            "object": "the details",
            "jaFocus": "確認・対応"
          },
          {
            "en": "We need to choose this today.",
            "ja": "今日これを進める必要があります。",
            "focus": "choose",
            "object": "this",
            "jaFocus": "進める"
          },
          {
            "en": "Can you choose it by tomorrow?",
            "ja": "明日までに対応できますか？",
            "focus": "choose",
            "object": "it",
            "jaFocus": "対応"
          }
        ]
      }
    ],
    "collocations": [],
    "phrasalVerbs": []
  },
  {
    "id": "follow",
    "rank": 46,
    "word": "FOLLOW",
    "ipa": "",
    "kana": "フォロー",
    "syllable": "follow",
    "transitivity": "他動詞・自動詞",
    "importance": "★★★★☆ 重要",
    "core": "従う・追う",
    "coreDetail": "手順や進捗を追う",
    "meanings": [
      {
        "id": "business-basic",
        "title": "① ビジネスで使う基本形",
        "pattern": "FOLLOW + 名詞 / 文",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "手順や進捗を追う",
        "point": "まずは社会人の会話・メールで使いやすい基本形を覚える。",
        "examples": [
          {
            "en": "I will follow the details.",
            "ja": "詳細を確認・対応します。",
            "focus": "follow",
            "object": "the details",
            "jaFocus": "確認・対応"
          },
          {
            "en": "We need to follow this today.",
            "ja": "今日これを進める必要があります。",
            "focus": "follow",
            "object": "this",
            "jaFocus": "進める"
          },
          {
            "en": "Can you follow it by tomorrow?",
            "ja": "明日までに対応できますか？",
            "focus": "follow",
            "object": "it",
            "jaFocus": "対応"
          }
        ]
      }
    ],
    "collocations": [],
    "phrasalVerbs": []
  },
  {
    "id": "create",
    "rank": 47,
    "word": "CREATE",
    "ipa": "",
    "kana": "クリエイト",
    "syllable": "create",
    "transitivity": "他動詞・自動詞",
    "importance": "★★★★☆ 重要",
    "core": "作成する",
    "coreDetail": "資料や価値を作る",
    "meanings": [
      {
        "id": "business-basic",
        "title": "① ビジネスで使う基本形",
        "pattern": "CREATE + 名詞 / 文",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "資料や価値を作る",
        "point": "まずは社会人の会話・メールで使いやすい基本形を覚える。",
        "examples": [
          {
            "en": "I will create the details.",
            "ja": "詳細を確認・対応します。",
            "focus": "create",
            "object": "the details",
            "jaFocus": "確認・対応"
          },
          {
            "en": "We need to create this today.",
            "ja": "今日これを進める必要があります。",
            "focus": "create",
            "object": "this",
            "jaFocus": "進める"
          },
          {
            "en": "Can you create it by tomorrow?",
            "ja": "明日までに対応できますか？",
            "focus": "create",
            "object": "it",
            "jaFocus": "対応"
          }
        ]
      }
    ],
    "collocations": [],
    "phrasalVerbs": []
  },
  {
    "id": "reach",
    "rank": 48,
    "word": "REACH",
    "ipa": "",
    "kana": "リーチ",
    "syllable": "reach",
    "transitivity": "他動詞・自動詞",
    "importance": "★★★★☆ 重要",
    "core": "到達する・連絡がつく",
    "coreDetail": "目標や相手に届く",
    "meanings": [
      {
        "id": "business-basic",
        "title": "① ビジネスで使う基本形",
        "pattern": "REACH + 名詞 / 文",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "目標や相手に届く",
        "point": "まずは社会人の会話・メールで使いやすい基本形を覚える。",
        "examples": [
          {
            "en": "I will reach the details.",
            "ja": "詳細を確認・対応します。",
            "focus": "reach",
            "object": "the details",
            "jaFocus": "確認・対応"
          },
          {
            "en": "We need to reach this today.",
            "ja": "今日これを進める必要があります。",
            "focus": "reach",
            "object": "this",
            "jaFocus": "進める"
          },
          {
            "en": "Can you reach it by tomorrow?",
            "ja": "明日までに対応できますか？",
            "focus": "reach",
            "object": "it",
            "jaFocus": "対応"
          }
        ]
      }
    ],
    "collocations": [],
    "phrasalVerbs": []
  },
  {
    "id": "return",
    "rank": 49,
    "word": "RETURN",
    "ipa": "",
    "kana": "リターン",
    "syllable": "return",
    "transitivity": "他動詞・自動詞",
    "importance": "★★★★☆ 重要",
    "core": "戻る・返す",
    "coreDetail": "物や連絡を戻す",
    "meanings": [
      {
        "id": "business-basic",
        "title": "① ビジネスで使う基本形",
        "pattern": "RETURN + 名詞 / 文",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "物や連絡を戻す",
        "point": "まずは社会人の会話・メールで使いやすい基本形を覚える。",
        "examples": [
          {
            "en": "I will return the details.",
            "ja": "詳細を確認・対応します。",
            "focus": "return",
            "object": "the details",
            "jaFocus": "確認・対応"
          },
          {
            "en": "We need to return this today.",
            "ja": "今日これを進める必要があります。",
            "focus": "return",
            "object": "this",
            "jaFocus": "進める"
          },
          {
            "en": "Can you return it by tomorrow?",
            "ja": "明日までに対応できますか？",
            "focus": "return",
            "object": "it",
            "jaFocus": "対応"
          }
        ]
      }
    ],
    "collocations": [],
    "phrasalVerbs": []
  },
  {
    "id": "check",
    "rank": 50,
    "word": "CHECK",
    "ipa": "",
    "kana": "チェック",
    "syllable": "check",
    "transitivity": "他動詞・自動詞",
    "importance": "★★★★☆ 重要",
    "core": "確認する",
    "coreDetail": "内容を確認する",
    "meanings": [
      {
        "id": "business-basic",
        "title": "① ビジネスで使う基本形",
        "pattern": "CHECK + 名詞 / 文",
        "transitivity": "他動詞・自動詞",
        "structure": "仕事でよく使う基本パターン",
        "image": "内容を確認する",
        "point": "まずは社会人の会話・メールで使いやすい基本形を覚える。",
        "examples": [
          {
            "en": "I'll check the details.",
            "ja": "詳細を確認します。",
            "focus": "check",
            "object": "the details",
            "jaFocus": "確認"
          },
          {
            "en": "Please check the latest version.",
            "ja": "最新版を確認してください。",
            "focus": "check",
            "object": "the latest version",
            "jaFocus": "確認"
          },
          {
            "en": "Can you check with the client?",
            "ja": "クライアントに確認してもらえますか？",
            "focus": "check with",
            "object": "the client",
            "jaFocus": "確認"
          }
        ]
      }
    ],
    "collocations": [],
    "phrasalVerbs": []
  }
];

export type TestSection = "basic" | "idioms" | "phrasal" | "all";

export type TestItem = {
  id: string;
  verbId: string;
  section: Exclude<TestSection, "all">;
  meaningTitle: string;
  pattern: string;
  ja: string;
  en: string;
};

function safeId(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}

export const testItems: TestItem[] = verbs.flatMap((verb) => [
  ...verb.meanings.flatMap((m) =>
    m.examples.slice(0, 3).map((e, index) => ({
      id: `${verb.id}-basic-${m.id}-${index}-${safeId(e.en)}`,
      verbId: verb.id,
      section: "basic" as const,
      meaningTitle: m.title,
      pattern: m.pattern,
      ja: e.ja,
      en: e.en
    }))
  ),
  ...verb.collocations.slice(0, 10).flatMap((p, phraseIndex) =>
    p.examples.slice(0, 3).map((e, index) => ({
      id: `${verb.id}-idioms-${phraseIndex}-${index}-${safeId(e.en)}`,
      verbId: verb.id,
      section: "idioms" as const,
      meaningTitle: `熟語：${p.phrase}`,
      pattern: p.pattern,
      ja: e.ja,
      en: e.en
    }))
  ),
  ...verb.phrasalVerbs.slice(0, 10).flatMap((p, phraseIndex) =>
    p.examples.slice(0, 3).map((e, index) => ({
      id: `${verb.id}-phrasal-${phraseIndex}-${index}-${safeId(e.en)}`,
      verbId: verb.id,
      section: "phrasal" as const,
      meaningTitle: `句動詞：${p.phrase}`,
      pattern: p.pattern,
      ja: e.ja,
      en: e.en
    }))
  )
]);

export function getVerb(id: string) {
  return verbs.find((v) => v.id === id) ?? verbs[0];
}

export function getTestItemsForVerb(verbId: string, section: TestSection = "all") {
  return testItems.filter((item) => item.verbId === verbId && (section === "all" || item.section === section));
}

export function getTestItemById(itemId: string) {
  return testItems.find((item) => item.id === itemId);
}
