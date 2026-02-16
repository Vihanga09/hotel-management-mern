import { GoogleGenerativeAI } from "@google/generative-ai";

// Check if API Key exists
if (!process.env.GEMINI_API_KEY) {
    console.error("⚠️  GEMINI_API_KEY not found in .env file!");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }
        
        // ✅ CORRECT MODEL NAME (no "-latest")
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const prompt = `You are a professional and friendly AI assistant for Grand Horizon Hotel. 

Your role:
- Help customers with room bookings, inquiries, and hotel information
- Be polite, helpful, and concise
- Provide accurate information about hotel services
- Answer in a warm, welcoming tone
- Always respond in ENGLISH language

Customer message: ${message}

Provide a helpful response in English:`;

        console.log("📤 Sending to Gemini API...");
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log("✅ AI Response generated successfully");
        res.status(200).json({ reply: text });
        
    } catch (error) {
        console.error("❌ Gemini Backend Error:", error);
        
        // Error messages in English
        let errorMessage = "AI service is temporarily unavailable. Please try again.";
        
        if (error.message.includes("API_KEY") || error.message.includes("invalid")) {
            errorMessage = "API Key is invalid. Please check your .env file";
        } else if (error.message.includes("404") || error.message.includes("not found")) {
            errorMessage = "Model configuration issue. Please contact developer.";
        } else if (error.message.includes("quota")) {
            errorMessage = "API quota limit reached. Please check your API key.";
        }
        
        res.status(500).json({ 
            error: errorMessage,
            details: error.message 
        });
    }
};