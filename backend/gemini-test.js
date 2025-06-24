import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';

// Use your API key from .env or paste directly for testing
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY || "YOUR_API_KEY_HERE");

async function main() {
  try {
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" }); // <-- Use Flash model

    const result = await model.generateContent("Explain quantum entanglement in simple terms.");
    const response = await result.response;
    const text = response.text();

    console.log("✅ Gemini Output:\n", text);
  } catch (error) {
    console.error("❌ Gemini API Error:\n", error);
  }
}

main();
