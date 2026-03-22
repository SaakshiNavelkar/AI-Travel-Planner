app.post("/generate", async (req, res) => {

  const { destination, days, budget, food } = req.body;

  const prompt = `
Create a ${days}-day travel itinerary for ${destination}.

Budget: ${budget}
Food preference: ${food}

Rules:
- Start directly from Day 1
- Exactly 1 or 2 places per day
- Restaurant must be written on the SAME line
- Dish must be written on the SAME line
- Do NOT add travel tips
- Do NOT add explanations
- Do NOT use markdown symbols
`;

  try {

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    const text = response.candidates[0].content.parts[0].text;

    res.json({
      plan: text
    });

  } catch (error) {

    console.error("SERVER ERROR:", error);
    res.status(500).json({ error: "Failed to fetch AI response" });

  }

});
