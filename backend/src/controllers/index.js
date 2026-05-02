import { generateCourseOutline, generateModuleLessons } from "../helper/index.js";

export const createCourseController = async (req, res) => {
	try {
		const { learningObjective, level = "intermediate" } = req.body || {};
		if (!learningObjective) {
			return res.status(400).json({
				success: false,
				error: "Learning objective is required",
			});
		}

		const trimmed = learningObjective.trim();
		const outline = await generateCourseOutline(trimmed);

		const { title, description, modules = [] } = outline;

		for (let i = 0; i < modules.length; i++) {
			const module = modules[i];
			const lessons = await generateModuleLessons(title, module);
			modules[i].lessons = lessons;
		}

		return res.status(200).json({
			success: true,
			data: { ...outline, modules },
		});
	} catch (error) {
		console.error("Onboarding Error:", error);
		return res.status(500).json({
			success: false,
			error: error.message || "Failed to initialize Brand DNA",
		});
	}
};
