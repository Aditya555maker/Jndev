export default async function handler(req, res) {
  // 👇 ये लाइन ADD करनी है (important)
  if (req.method === "GET") {
    return res.status(200).json({ message: "API working ✅" });
  }

  try {
    const { prompt } = req.body;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-sonnet-20240229",
        max_tokens: 4000,
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: data });
    }

    res.status(200).json({
      result: data?.content?.[0]?.text || "No response"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
