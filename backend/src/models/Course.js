import mongoose from "mongoose";
const { Schema } = mongoose;

const courseSchema = new Schema(
	{
		title: { type: String, required: true },
		description: { type: String },
		learningObjective: { type: String, required: true },
		level: {
			type: String,
			enum: ["beginner", "intermediate", "advanced"],
			default: "intermediate",
		},
		status: {
			type: String,
			enum: ["generating", "complete", "failed"],
			default: "generating",
		},
		error: { type: String, default: null },
		metadata: { type: Schema.Types.Mixed, default: {} },
	},
	{ timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);
export default Course;
