export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "OPENAI_API_KEY is not set in Vercel Environment Variables",
      });
    }

    const { lyrics, title, artist } = req.body || {};

    if (!lyrics || !String(lyrics).trim()) {
      return res.status(400).json({
        error: "lyrics is required",
      });
    }

    const prompt = `
あなたは日本人向けの洋楽英語学習アプリの先生です。
以下の歌詞を1行ずつ解析してください。

目的：
- 自然な日本語訳
- 使用されている文法の要約
- 重要単語の意味・使い方・例文
- 初心者にもわかる簡潔な説明

条件：
- 説明は長くしすぎない
- 「主語」「動詞」などの細かすぎる文構造説明は不要
- 不定詞、動名詞、現在分詞、前置詞、熟語など、実際に使われている文法を説明する
- 歌詞本文の著作権に配慮し、出力は解析結果のみ
- 必ずJSONだけで返す

曲名：${title || ""}
アーティスト：${artist || ""}

歌詞：
${lyrics}

JSON形式：
{
  "lines": [
    {
      "line_no": 1,
      "lyric": "英文",
      "translation": "自然な日本語訳",
      "grammar_points": [
        {
          "name": "文法名",
          "explanation": "短い説明"
        }
      ],
      "words": [
        {
          "word": "単語",
          "meaning": "日本語の意味",
          "usage": "使い方",
          "example": "英語例文",
          "example_ja": "例文の日本語訳"
        }
      ],
      "examples": [
        {
          "en": "英語例文",
          "ja": "日本語訳"
        }
      ]
    }
  ]
}
`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: prompt,
        temperature: 0.2,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: "OpenAI API error",
        details: data,
      });
    }

    const text =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text ||
      "";

    if (!text) {
      return res.status(500).json({
        error: "No text returned from OpenAI",
        raw: data,
      });
    }

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch (e) {
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) {
        return res.status(500).json({
          error: "AI response was not valid JSON",
          raw: text,
        });
      }
      parsed = JSON.parse(match[0]);
    }

    return res.status(200).json(parsed);
  } catch (error) {
    return res.status(500).json({
      error: "AI analysis failed",
      message: error.message,
    });
  }
}
