import mongoose from "mongoose";
const { Schema } = mongoose;

const quizQuestionSchema = new Schema(
	{
		question: { type: String, required: true },
		options: [{ type: String, required: true }],
		correctOptionIndex: { type: Number, required: true },
		explanation: { type: String, required: true },
	},
	{ _id: false }
);

const lessonSchema = new Schema(
	{
		moduleId: { type: Schema.Types.ObjectId, ref: "Module", required: true },
		courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
		order: { type: Number, required: true },
		title: { type: String, required: true },
		estimatedMinutes: { type: Number, default: 10 },
		content: { type: String, required: true }, // markdown
		quiz: [quizQuestionSchema],
		userQuizResponse: { type: Schema.Types.Mixed, default: {} },
		metadata: { type: Schema.Types.Mixed, default: {} },
	},
	{ timestamps: true }
);

const Lesson = mongoose.model("Lesson", lessonSchema);
export default Lesson;
