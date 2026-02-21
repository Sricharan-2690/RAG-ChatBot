import * as dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Try a few candidate chat models
const candidates = [
  "gemini-2.0-flash",
  "gemini-2.0-pro",
  "gemini-1.5-pro",
  "gemini-1.5-flash"
];

async function testModels() {
  for (const modelName of candidates) {
    try {
      console.log(`\n🔎 Testing model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const res = await model.generateContent("Say 'ok' if you are working.");
      console.log(`✅ ${modelName} works, response:`, res.response.text());
      return modelName;
    } catch (err) {
      console.log(`❌ ${modelName} failed:`, err.status || "", err.statusText || "", err.message);
    }
  }

  console.log("\n⚠️ None of the candidate models worked. Check AI Studio for the exact model name.");
}

testModels();
