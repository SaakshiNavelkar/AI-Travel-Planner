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

FORMAT STRICTLY:

Day 1
Places to Visit: <place1>, <place2>
Restaurant Suggestion: <restaurant name>
Dish to Try: <specific dish name>
Activity: <activity>

Day 2
...

RULES:
- ALWAYS give real restaurant names
- ALWAYS give real dish names
- Budget must affect restaurant quality
- DO NOT write generic text like "local restaurant"
- DO NOT change headings
- DO NOT add extra text
`;

  try {

    const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});

const result = await model.generateContent(prompt);

// safer extraction
const text = result.response.candidates[0].content.parts[0].text;

    res.json({ plan: text });

  } catch (error) {

    console.error("SERVER ERROR:", error);
    res.status(500).json({ error: error.message });

  }

});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});