const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

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

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash"
    });

    const result = await model.generateContent(prompt);

    const response = await result.response;
    const text = response.text();

    res.json({
        candidates: [
            {
                content: {
                    parts: [{ text }]
                }
            }
        ]
    });

} catch (error) {

    console.error("SERVER ERROR:", error);
    res.status(500).json({ error: "Failed to fetch AI response" });

}

});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});