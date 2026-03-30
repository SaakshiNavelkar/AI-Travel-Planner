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

IMPORTANT: Follow this format EXACTLY. Do not change anything.

Day 1
Places to Visit: place1, place2
Restaurant Suggestion: restaurant name only
Dish to Try: dish name only
Activity: activity or NONE

Day 2
Places to Visit: place1, place2
Restaurant Suggestion: restaurant name only
Dish to Try: dish name only
Activity: activity or NONE

RULES:
- Each field MUST be on a NEW LINE
- DO NOT combine fields in one line
- DO NOT write extra words
- DO NOT explain anything
- DO NOT add descriptions
- Restaurant must be real and match budget:
    low → street/local
    medium → popular restaurants
    luxury → premium/fine dining
- Dish must be specific (not "local food")
- If no activity → write NONE
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