import express from "express";
import { createCourseController } from "../controllers/index.js";

const router = express.Router();

router.post("/create-course", createCourseController);

export default router;
