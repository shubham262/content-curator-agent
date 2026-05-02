import express from "express";
import {
	createCourseController,
	getCourseInfoController,
	submitQuiz,
	updateLessonProgress,
} from "../controllers/index.js";

const router = express.Router();

router.post("/create-course", createCourseController);
router.get("/fetch-course/:courseId", getCourseInfoController);
router.put("/mark-lesson-complete/:courseId/:lessonId", updateLessonProgress);
router.put("/submit-quiz/:courseId/:lessonId", submitQuiz);
export default router;
