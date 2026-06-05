export default async function handler(req, res) {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        error: "YouTube URL is required",
      });
    }

    const oembedUrl =
      "https://www.youtube.com/oembed?format=json&url=" +
      encodeURIComponent(url);

    const response = await fetch(oembedUrl);

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Failed to fetch YouTube oEmbed",
        status: response.status,
      });
    }

    const data = await response.json();

    return res.status(200).json({
      title: data.title || "",
      author_name: data.author_name || "",
      thumbnail_url: data.thumbnail_url || "",
      html: data.html || "",
      provider_name: data.provider_name || "YouTube",
      provider_url: data.provider_url || "https://www.youtube.com/",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Server error while fetching YouTube info",
      message: error.message,
    });
  }
}
