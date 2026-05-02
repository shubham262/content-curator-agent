import { model } from "../config/gemini.js";

const callGemini = async (prompt, purpose) => {
	let lastError;
	for (let attempt = 1; attempt <= 2; attempt++) {
		try {
			const result = await model.generateContent(prompt);
			const text = result.response.text();
			return JSON.parse(text); // responseMimeType guarantees valid JSON, but we still catch
		} catch (err) {
			lastError = err;
			if (attempt === 1) {
				console.warn(
					`[Gemini] Attempt ${attempt} failed, retrying…`,
					err.message
				);
				await new Promise((r) => setTimeout(r, 1500));
			}
		}
	}
	throw new Error(
		`Gemini call failed after 2 attempts for ${purpose}: ${lastError.message}`
	);
};

export const generateCourseOutline = async (learningObjective) => {
	const prompt = `
You are a curriculum designer. Given the learning objective below, generate a complete course outline.

Learning Objective: "${learningObjective}"

Return ONLY valid JSON matching this exact schema:
{
  "title": "string",
  "description": "string (2-3 sentences)",
  "level": "beginner" | "intermediate" | "advanced",
  "modules": [
    {
      "order": number,
      "title": "string",
      "description": "string (1-2 sentences)"
    }
  ]
}

Rules:
- 3 to 5 modules
- modules ordered logically from foundational to advanced
- No extra keys, no markdown, no explanation — pure JSON only
`;
	return callGemini(prompt);
};

export const generateModuleLessons = async (courseTitle, module) => {
	const prompt = `
You are a technical content writer. Generate detailed lessons for the module below.

Course: "${courseTitle}"
Module ${module.order}: "${module.title}"
Module description: "${module.description}"

Return ONLY valid JSON matching this exact schema:
{
  "lessons": [
    {
      "order": number,
      "title": "string",
      "estimatedMinutes": number,
      "content": "string (full lesson in Markdown, minimum 300 words)"
    }
  ]
}

Rules:
- 2 to 4 lessons per module
- content must be rich Markdown: use ##, ###, bullet points, code blocks where relevant
- estimatedMinutes between 5 and 20
- No extra keys, no markdown wrapping, pure JSON only
`;
	return callGemini(prompt);
};

