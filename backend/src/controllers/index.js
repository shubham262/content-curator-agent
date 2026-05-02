import db from "../models/index.js";
import courseQueue from "../queue/index.js";
const { Course } = db;
export const createCourseController = async (req, res) => {
	try {
		const { learningObjective, level = "intermediate" } = req.body || {};
		if (!learningObjective) {
			return res.status(400).json({
				success: false,
				error: "Learning objective is required",
			});
		}

		const validLevels = ["beginner", "intermediate", "advanced"];
		if (!validLevels.includes(level)) {
			return res.status(400).json({
				success: false,
				error: `level must be one of: ${validLevels.join(", ")}`,
			});
		}
		const trimmed = learningObjective.trim();
		const course = await Course.create({
			title: "Generating...",
			description: "",
			learningObjective: trimmed,
			level,
			status: "generating",
		});

		// await courseQueue.add("generate-course", {
		// 	courseId: course._id.toString(),
		// 	learningObjective: trimmed,
		// 	level,
		// });

		return res.status(202).json({
			success: true,
			message: "Course generation started",
			data: { courseId: course._id },
		});
	} catch (error) {
		console.error("Onboarding Error:", error);
		return res.status(500).json({
			success: false,
			error: error.message || "Failed to initialize Brand DNA",
		});
	}
};
