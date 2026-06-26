export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const url = String(req.query?.url || "").trim();
  if (!url) {
    return res.status(400).json({ error: "url is required" });
  }

  try {
    const endpoint = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`;
    const response = await fetch(endpoint, {
      headers: {
        "User-Agent": "Lyrics English YouTube metadata helper"
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "YouTube oEmbed failed" });
    }

    const json = await response.json();
    return res.status(200).json({
      title: json.title || "",
      author_name: json.author_name || "",
      thumbnail_url: json.thumbnail_url || ""
    });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Unknown error" });
  }
}
