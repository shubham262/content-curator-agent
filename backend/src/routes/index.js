import express from "express";
import {
	createCourseController,
	getCourseInfoController,
} from "../controllers/index.js";

const router = express.Router();

router.post("/create-course", createCourseController);
router.get("/fetch-course/:courseId", getCourseInfoController);
export default router;
