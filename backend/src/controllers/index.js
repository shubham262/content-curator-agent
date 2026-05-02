import db from "../models/index.js";
import courseQueue from "../queue/index.js";
const { Course, Module, Lesson } = db;
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

		await courseQueue.add("generate-course", {
			courseId: course._id.toString(),
			learningObjective: trimmed,
			level,
		});

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

export const getCourseInfoController = async (req, res) => {
	try {
		const { courseId } = req.params || {};
		if (!courseId) {
			return res.status(400).json({
				success: false,
				error: "Course ID is required",
			});
		}
		const course = await Course.findById(courseId).lean();
		if (!course) {
			return res
				.status(404)
				.json({ success: false, error: "Course not found" });
		}

		if (course.status === "generating") {
			return res.status(200).json({
				success: true,
				data: { status: course.status, courseId },
			});
		}

		const modules = await Module.find({ courseId }).sort("order").lean();
		const lessons = await Lesson.find({ courseId }).sort("order").lean();

		const modulesWithLessons = modules.map((mod) => ({
			...mod,
			lessons: lessons.filter(
				(l) => l.moduleId.toString() === mod._id.toString()
			),
		}));
		return res.status(200).json({
			success: true,
			data: { ...course, modules: modulesWithLessons },
		});
	} catch (error) {
		console.error("Onboarding Error:", error);
		return res.status(500).json({
			success: false,
			error: error.message || "Failed to initialize Brand DNA",
		});
	}
};
