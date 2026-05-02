import mongoose from "mongoose";
const { Schema } = mongoose;
const moduleSchema = new Schema(
	{
		courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
		order: { type: Number, required: true },
		title: { type: String, required: true },
		description: { type: String },
		metadata: { type: Schema.Types.Mixed, default: {} },
	},
	{ timestamps: true }
);

const Module = mongoose.model("Module", moduleSchema);
