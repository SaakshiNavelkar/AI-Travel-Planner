const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

// ✅ Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest"
    });

    const result = await model.generateContent(prompt);

    const text = result.response.text();

    res.json({ plan: text });

  } catch (error) {

    console.error("SERVER ERROR:", error);
    res.status(500).json({ error: error.message });

  }

});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});