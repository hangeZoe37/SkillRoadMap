import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

// Initialize Gemini Client
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

// Function to delay execution
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to generate normal text with retry logic
export async function generateText(prompt, retryCount = 0) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 
    const result = await model.generateContent(prompt);

    return result.response.text();
  } catch (error) {
    console.error(`Error generating content with Gemini (attempt ${retryCount + 1}):`, error);
    
    // Check if it's a retryable error (503, 429, or network errors)
    const isRetryable = error.status === 503 || 
                       error.status === 429 || 
                       error.status === 500 ||
                       error.code === 'ECONNRESET' ||
                       error.code === 'ETIMEDOUT';
    
    if (isRetryable && retryCount < MAX_RETRIES) {
      console.log(`Retrying in ${RETRY_DELAY}ms... (attempt ${retryCount + 1}/${MAX_RETRIES})`);
      await delay(RETRY_DELAY * (retryCount + 1)); // Exponential backoff
      return generateText(prompt, retryCount + 1);
    }
    
    throw error;
  }
}

// Function to generate JSON
export async function generateJSON(prompt, schemaHint = "") {
  const guard = `
    RULES:
    - Respond ONLY with valid JSON. No extra text, no comments.
    - If unsure, return an empty JSON object {}.
    ${schemaHint ? `- SCHEMA: ${schemaHint}` : ""}
  `;

  try {
    const text = await generateText(`${prompt}\n\n${guard}`);
    return text; // return raw text, let caller parse
  } catch (error) {
    console.error("Error generating JSON from Gemini:", error);
    return ""; // fail-safe return
  }
}