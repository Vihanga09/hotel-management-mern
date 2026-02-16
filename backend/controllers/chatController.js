import { GoogleGenerativeAI } from "@google/generative-ai";

// API Key එක හරියටම ලෝඩ් වෙනවද බලන්න
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;
        
        // Model එකේ නම මෙහෙම දීලා බලන්න
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

        const prompt = `You are a professional assistant for Grand Horizon Hotel. Help with bookings. User: ${message}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({ reply: text });
    } catch (error) {
        // මෙතනදී Error එක හරියටම බලාගන්න පුළුවන්
        console.error("Gemini Backend Error:", error);
        res.status(500).json({ error: error.message });
    }
};