export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "OPENAI_API_KEY is not set in Vercel Environment Variables" });
    }

    const { lyrics, title = "", artist = "" } = req.body || {};
    if (!lyrics || typeof lyrics !== "string") {
      return res.status(400).json({ error: "lyrics is required" });
    }

    const lines = lyrics
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 40);

    if (!lines.length) {
      return res.status(400).json({ error: "lyrics is empty" });
    }

    const prompt = `あなたは洋楽英語学習アプリ Lyrics English の英語教師です。
曲名: ${title || "未入力"}
アーティスト: ${artist || "未入力"}

以下の歌詞はアプリ側で1行ずつに補正済みです。番号ごとに必ず1件ずつ解析してください。
行を結合したり、複数行を1つにまとめたりしないでください。

必ず守ること:
- 出力はJSONだけ。
- translation は自然な日本語訳。直訳しすぎない。
- grammar はその行で実際に使われている文法だけを2〜5個。短く説明。
- 不定詞、動名詞、現在分詞、前置詞、関係詞、助動詞、否定、比較などがあれば説明。
- words は英検準2級以上を目安に、学習価値の高い単語だけを1〜5個。the / you / I / said / like などの基本語は原則選ばない。
- 各単語には意味、使い方、英語例文、日本語訳を付ける。
- 手動解析用にも使えるように、各行の単語は word / meaning / usage / example / example_ja の5項目を必ず返す。選ぶ単語は英検準2級以上を目安にする。
- lyrics の著作権本文を増やしたり補完したりしない。渡された行だけ扱う。
- lines配列の件数は、入力された行数と同じにする。
- lyric には該当番号の英文だけを入れる。

歌詞:
${lines.map((line, index) => `${index + 1}. ${line}`).join("\n")}`;

    const schema = {
      type: "object",
      additionalProperties: false,
      properties: {
        lines: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              line_no: { type: "number" },
              lyric: { type: "string" },
              translation: { type: "string" },
              grammar: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    name: { type: "string" },
                    explanation: { type: "string" }
                  },
                  required: ["name", "explanation"]
                }
              },
              words: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    word: { type: "string" },
                    meaning: { type: "string" },
                    usage: { type: "string" },
                    example: { type: "string" },
                    example_ja: { type: "string" }
                  },
                  required: ["word", "meaning", "usage", "example", "example_ja"]
                }
              },
              examples: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    en: { type: "string" },
                    ja: { type: "string" }
                  },
                  required: ["en", "ja"]
                }
              }
            },
            required: ["line_no", "lyric", "translation", "grammar", "words", "examples"]
          }
        }
      },
      required: ["lines"]
    };

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        input: prompt,
        text: {
          format: {
            type: "json_schema",
            name: "lyrics_english_analysis",
            schema,
            strict: true
          }
        }
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "OpenAI API error",
        details: data
      });
    }

    const text = data.output_text || data.output?.flatMap((item) => item.content || [])?.find((content) => content.text)?.text || "";
    if (!text) {
      return res.status(500).json({ error: "OpenAI response was empty", details: data });
    }

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (error) {
      return res.status(500).json({ error: "Failed to parse OpenAI JSON", raw: text });
    }

    return res.status(200).json(parsed);
  } catch (error) {
    return res.status(500).json({ error: error.message || "AI analysis failed" });
  }
}
