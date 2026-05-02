import { Worker } from "bullmq";
import db from "../models/index.js";
import redis from "../config/redis.js";
import {
	generateCourseOutline,
	generateModuleLessons,
} from "../helper/index.js";

const { Course, Module, Lesson } = db;

const courseWorker = new Worker(
	"course-generation",
	async (job) => {
		const { courseId, learningObjective, level } = job.data;

		console.log(
			`[Worker] Starting course generation for courseId: ${courseId}`
		);

		try {
			// ── Step 1: Generate outline ─────────────────────────────────────

			const outline = await generateCourseOutline(learningObjective, level);
			const { title, description, modules: rawModules = [] } = outline;

			// Patch course with title + description now that we have them
			await Course.findByIdAndUpdate(courseId, { title, description });

			// ── Step 2: For each module → generate lessons ───────────────────
			for (let i = 0; i < rawModules.length; i++) {
				const rawModule = rawModules[i];

				// Save module to DB
				const savedModule = await Module.create({
					courseId,
					order: rawModule.order,
					title: rawModule.title,
					description: rawModule.description,
				});

				// Generate lessons + quiz for this module
				const { lessons: rawLessons = [] } = await generateModuleLessons(
					title,
					rawModule,
					level
				);

				// Save each lesson
				const lessonDocs = rawLessons.map((lesson) => ({
					moduleId: savedModule._id,
					courseId,
					order: lesson.order,
					title: lesson.title,
					estimatedMinutes: lesson.estimatedMinutes,
					content: lesson.content,
					quiz: lesson.quiz || [],
				}));

				await Lesson.insertMany(lessonDocs);

				console.log(
					`[Worker] Module ${i + 1}/${
						rawModules.length
					} done for courseId: ${courseId}`
				);
			}

			// ── Step 3: Mark course complete ─────────────────────────────────
			await Course.findByIdAndUpdate(courseId, { status: "complete" });
			console.log(`[Worker] Course complete: ${courseId}`);
		} catch (error) {
			// Mark course as failed so frontend can surface it
			await Course.findByIdAndUpdate(courseId, {
				status: "failed",
				error: error.message,
			});
			console.error(
				`[Worker] Course generation failed for ${courseId}:`,
				error.message
			);
			throw error;
		}
	},
	{
		connection: redis,
		concurrency: 3,
	}
);

courseWorker.on("completed", (job) => {
	console.log(`[Worker] Job ${job.id} completed`);
});

courseWorker.on("failed", (job, err) => {
	console.error(
		`[Worker] Job ${job.id} failed after all retries:`,
		err.message
	);
});

export default courseWorker;
