export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
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
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `Create a full HTML website for: ${prompt}`
          }
        ]
      })
    });

    const data = await response.json();

    return res.status(200).json({
      html: data?.content?.[0]?.text || JSON.stringify(data)
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
