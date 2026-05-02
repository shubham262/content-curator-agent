import express from "express";
import {
	createCourseController,
	getCourseInfoController,
	updateLessonProgress,
} from "../controllers/index.js";

const router = express.Router();

router.post("/create-course", createCourseController);
router.get("/fetch-course/:courseId", getCourseInfoController);
router.put("/mark-lesson-complete/:courseId/:lessonId", updateLessonProgress);
export default router;
