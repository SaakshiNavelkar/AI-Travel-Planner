const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

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

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!data.candidates) {
      throw new Error("No response from AI");
    }

    const text = data.candidates[0].content.parts[0].text;

    res.json({ plan: text });

  } catch (error) {

    console.error("SERVER ERROR:", error);
    res.status(500).json({ error: error.message });

  }

});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});