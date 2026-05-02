"use client";
import React, { memo, useState } from "react";
import { Select } from "antd";
import { HiSparkles } from "react-icons/hi2";
import { FiTarget, FiZap, FiBookOpen } from "react-icons/fi";
import { createCourse } from "@/service/brand";
import { useRouter } from "next/navigation";

const { Option } = Select;

const Landing = () => {
	const router = useRouter();
	const [info, setInfo] = useState({
		learningObjective: "",
		level: "intermediate",
		loading: false,
		error: "",
	});

	const set = (key, value) => setInfo((prev) => ({ ...prev, [key]: value }));

	const handleGenerate = async () => {
		if (!info.learningObjective.trim()) {
			set("error", "Please enter a learning objective");
			return;
		}
		set("loading", true);
		set("error", "");
		try {
			const payload = {
				learningObjective: info.learningObjective,
				level: info.level,
			};
			const { data } = await createCourse(payload);
			console.log("Course creation response:", data);
			return router.push(`/course/${data?.courseId}`);
			// if (data.success) {
			// 	// redirect to course status page
			// 	window.location.href = `/course/${data.data.courseId}`;
			// } else {
			// 	set("error", data.error || "Something went wrong");
			// }
		} catch (err) {
			set("error", "Failed to connect. Please try again.");
		} finally {
			set("loading", false);
		}
	};

	const features = [
		{ icon: <FiTarget size={18} />, label: "Goal-driven curriculum" },
		{ icon: <FiZap size={18} />, label: "AI-generated in seconds" },
		{ icon: <FiBookOpen size={18} />, label: "Quizzes for every lesson" },
	];

	return (
		<div className="min-h-screen bg-white flex flex-col">
			{/* ── Navbar ───────────────────────────────────────────────── */}
			<nav className="flex items-center justify-between px-8 py-5 border-b border-blue-50">
				<div className="flex items-center gap-2">
					<div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
						<HiSparkles size={16} className="text-white" />
					</div>
					<span className="text-lg font-bold text-gray-900 tracking-tight">
						flo101
					</span>
				</div>
				<span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
					Beta
				</span>
			</nav>

			{/* ── Hero ─────────────────────────────────────────────────── */}
			<div className="flex flex-col items-center justify-center flex-1 px-6 py-20">
				{/* Badge */}
				<div className="flex items-center gap-2 bg-blue-50 text-blue-600 text-sm font-medium px-4 py-1.5 rounded-full mb-8">
					<HiSparkles size={14} />
					<span>Powered by Gemini AI</span>
				</div>

				{/* Heading */}
				<h1 className="text-5xl font-extrabold text-gray-900 text-center leading-tight max-w-2xl mb-4 tracking-tight">
					Learn anything,
					<br />
					<span className="text-blue-600">your way.</span>
				</h1>

				<p className="text-gray-500 text-center text-lg max-w-md mb-12 leading-relaxed">
					Tell us what you want to learn. We'll build a complete course —
					lessons, examples, and quizzes — just for you.
				</p>

				{/* ── Card ─────────────────────────────────────────────── */}
				<div className="w-full max-w-xl bg-white border border-gray-100 rounded-2xl shadow-xl shadow-blue-50 p-8 flex flex-col gap-6">
					{/* Learning objective */}
					<div className="flex flex-col gap-2">
						<label className="text-sm font-semibold text-gray-700">
							What do you want to learn?
						</label>
						<textarea
							rows={3}
							placeholder="e.g. I want to learn React from scratch and build real projects"
							value={info.learningObjective}
							onChange={(e) => set("learningObjective", e.target.value)}
							className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
						/>
						{info.error && (
							<span className="text-red-500 text-xs mt-1">{info.error}</span>
						)}
					</div>

					{/* Level */}
					<div className="flex flex-col gap-2">
						<label className="text-sm font-semibold text-gray-700">
							Your current level
						</label>
						<Select
							value={info.level}
							onChange={(val) => set("level", val)}
							size="large"
							style={{ width: "100%" }}
							styles={{
								popup: { root: { borderRadius: "12px" } },
							}}
						>
							<Option value="beginner">
								🌱 Beginner — starting from scratch
							</Option>
							<Option value="intermediate">
								⚡ Intermediate — I know the basics
							</Option>
							<Option value="advanced">
								🔥 Advanced — go deep and technical
							</Option>
						</Select>
					</div>

					{/* Generate button */}
					<button
						onClick={handleGenerate}
						disabled={info.loading}
						className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-sm py-3.5 rounded-xl transition-all duration-200 shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300 hover:-translate-y-0.5 active:translate-y-0"
					>
						{info.loading ? (
							<>
								<svg
									className="animate-spin h-4 w-4 text-white"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									/>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8v8z"
									/>
								</svg>
								Building your course…
							</>
						) : (
							<>
								<HiSparkles size={16} />
								Generate My Course
							</>
						)}
					</button>
				</div>

				{/* ── Feature pills ────────────────────────────────────── */}
				<div className="flex items-center gap-4 mt-10 flex-wrap justify-center">
					{features.map((f, i) => (
						<div
							key={i}
							className="flex items-center gap-2 text-gray-500 text-sm bg-gray-50 px-4 py-2 rounded-full border border-gray-100"
						>
							<span className="text-blue-500">{f.icon}</span>
							{f.label}
						</div>
					))}
				</div>
			</div>

			{/* ── Footer ───────────────────────────────────────────────── */}
			<footer className="text-center text-xs text-gray-400 py-6 border-t border-gray-50">
				© {new Date().getFullYear()} flo101 · All rights reserved
			</footer>
		</div>
	);
};

export default memo(Landing);
