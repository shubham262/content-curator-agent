import { GoogleGenerativeAI } from "@google/generative-ai";
export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
export const model = genAI.getGenerativeModel({
	model: "gemini-3-flash-preview",
	generationConfig: {
		temperature: 0.7,
		responseMimeType: "application/json",
	},
});
