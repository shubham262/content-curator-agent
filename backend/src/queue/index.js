import { Queue } from "bullmq";
import redis from "../config/redis.js";

const courseQueue = new Queue("course-generation", {
	connection: redis,
	defaultJobOptions: {
		attempts: 3, // retry failed jobs up to 3 times
		backoff: { type: "exponential", delay: 3000 },
		removeOnComplete: 50, // keep last 50 completed jobs
		removeOnFail: 100, // keep last 100 failed jobs for debugging
	},
});

export default courseQueue;
