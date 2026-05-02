import { model } from "../config/gemini.js";

const callGemini = async (prompt, purpose, fileBase64 = null) => {
	let lastError;
	for (let attempt = 1; attempt <= 2; attempt++) {
		try {
			
			let input = prompt;
			if (fileBase64) {
				input = [
					{ text: prompt },
					{
						inlineData: {
							mimeType: "application/pdf",
							data: fileBase64,
						},
					},
				];
			}

			const result = await model.generateContent(input);
			const text = result.response.text();

			// Clean markdown blocks if the model hallucinates them
			const cleanText = text.replace(/```json\n?|```/g, "").trim();
			return JSON.parse(cleanText);
		} catch (err) {
			lastError = err;
			if (attempt === 1) {
				console.warn(
					`[Gemini] Attempt ${attempt} failed for "${purpose}", retrying…`,
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

const LEVEL_CONFIG = {
	beginner:
		"Use simple language, relatable analogies, and beginner-friendly examples. Define every term on first use. Assume zero prior knowledge.",
	intermediate:
		"Use practical depth, real-world use cases, and working code examples. Assume basic familiarity with the domain.",
	advanced:
		"Go deep — cover internals, edge cases, performance tradeoffs, anti-patterns, and architectural decisions. Assume strong prior knowledge.",
};

// ─── Step 1: Course Outline ────────────────────────────────────────────────
export const generateCourseOutline = async (
	learningObjective,
	level = "intermediate",
	file = null
) => {
	const depthInstruction = LEVEL_CONFIG[level] || LEVEL_CONFIG.intermediate;

	
	const fileInstruction = file
		? "\nCRITICAL: A PDF document is attached. You MUST use the content, structure, and domain context from this PDF to form the basis of the course outline."
		: "";

	const prompt = `
You are a world-class curriculum designer.

Learning Objective: "${learningObjective}"
Level: ${level}
Tone & Depth: ${depthInstruction}${fileInstruction}

Design a thorough, complete course outline. Decide the number of modules yourself based on 
what the topic genuinely requires to be covered well — do not artificially limit or pad.
Typically 4 to 6 modules, but use your judgment.

Return ONLY valid JSON — no markdown fences, no extra keys, no explanation:
{
  "title": "string",
  "description": "string — 2 to 3 sentences covering what the learner will achieve",
  "level": "${level}",
  "modules": [
    {
      "order": number,
      "title": "string",
      "description": "string — 2 sentences: what this module covers and why it matters in the course"
    }
  ]
}
`;
	return callGemini(prompt, "course-outline", file);
};


export const generateModuleLessons = async (
	courseTitle,
	module,
	level = "intermediate",
	file = null
) => {
	const depthInstruction = LEVEL_CONFIG[level] || LEVEL_CONFIG.intermediate;


	const fileInstruction = file
		? "\nCRITICAL: A PDF document is attached. You MUST extract technical context, examples, definitions, and workflows from this PDF to write the lesson content."
		: "";

	const prompt = `
You are a world-class technical educator and content writer.

Course: "${courseTitle}"
Module ${module.order}: "${module.title}"
Module goal: "${module.description}"
Level: ${level}
Tone & Depth: ${depthInstruction}${fileInstruction}

Decide the number of lessons yourself based on what this module genuinely needs to cover it well.
Typically 3 to 5 lessons — use your judgment. Do not pad or cut short.

Each lesson must have:
1. Rich, render-ready Markdown content (minimum 600 words — go deeper if the topic needs it)
2. A 4-question MCQ quiz testing comprehension of THAT lesson specifically

─── MARKDOWN CONTENT RULES ───────────────────────────────────────────────────
- Open with "## What You'll Learn" listing 3-5 bullet outcomes
- ## for major sections, ### for subsections
- Every concept needs a concrete example — no abstract definitions without illustration
- Fenced code blocks with language tags for ALL code (\`\`\`js, \`\`\`python, \`\`\`bash, etc.)
- \`inline code\` for method names, variables, filenames, commands
- > blockquotes for key insights, warnings, and Pro Tips
- Tables for comparisons (e.g., approach A vs B)
- **Bold** for key terms on first use
- End with "## Summary" recapping 3-5 core takeaways

─── QUIZ RULES ───────────────────────────────────────────────────────────────
- 4 MCQ questions per lesson
- Test understanding and application — not rote memorization
- All 4 options must be plausible (no obviously wrong distractors)
- correctOptionIndex is 0-based (0 = first option in the array)
- explanation must say why the correct answer is right AND why the others fall short

Return ONLY valid JSON — no markdown fences, no extra keys:
{
  "lessons": [
    {
      "order": number,
      "title": "string",
      "estimatedMinutes": number,
      "content": "string — full lesson in Markdown, 600 words minimum",
      "quiz": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctOptionIndex": number,
          "explanation": "string"
        }
      ]
    }
  ]
}
`;
	return callGemini(prompt, `module-${module.order}-lessons`, file);
};
