/* eslint-disable react-hooks/preserve-manual-memoization */
/* eslint-disable react-hooks/immutability */
"use client";
import React, { memo, useState, useMemo, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
	FiChevronLeft,
	FiBookOpen,
	FiCheckCircle,
	FiCircle,
	FiCheck,
	FiX,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import { MdOutlineQuiz } from "react-icons/md";
import { BsChatDots } from "react-icons/bs";
import { getCourse } from "@/service/course";





const QuizView = ({ quiz }) => {
	const [info, setInfo] = useState({
		answers: {}, // { questionIndex: selectedOptionIndex }
		submitted: false,
		score: 0,
	});

	const set = (key, value) => setInfo((prev) => ({ ...prev, [key]: value }));

	const handleSelect = (qIdx, oIdx) => {
		if (info.submitted) return;
		setInfo((prev) => ({
			...prev,
			answers: { ...prev.answers, [qIdx]: oIdx },
		}));
	};

	const handleSubmit = () => {
		let score = 0;
		quiz.forEach((q, i) => {
			if (info.answers[i] === q.correctOptionIndex) score++;
		});
		setInfo((prev) => ({ ...prev, submitted: true, score }));
	};

	const handleRetry = () =>
		setInfo({ answers: {}, submitted: false, score: 0 });

	const allAnswered = Object.keys(info.answers).length === quiz.length;

	return (
		<div className="flex flex-col gap-6 py-6">
			{/* Score banner */}
			{info.submitted && (
				<div
					className={`flex items-center justify-between px-5 py-4 rounded-2xl border ${
						info.score === quiz.length
							? "bg-blue-50 border-blue-200"
							: "bg-gray-50 border-gray-200"
					}`}
				>
					<div className="flex flex-col">
						<span className="text-sm font-semibold text-gray-700">
							Quiz Complete
						</span>
						<span className="text-xs text-gray-400 mt-0.5">
							{info.score === quiz.length
								? "🎉 Perfect score!"
								: `${quiz.length - info.score} question${
										quiz.length - info.score > 1 ? "s" : ""
								  } to review`}
						</span>
					</div>
					<div className="flex items-center gap-3">
						<span className="text-2xl font-extrabold text-blue-600">
							{info.score}
							<span className="text-base font-medium text-gray-400">
								/{quiz.length}
							</span>
						</span>
						<button
							onClick={handleRetry}
							className="text-xs text-blue-600 font-semibold bg-white border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition"
						>
							Retry
						</button>
					</div>
				</div>
			)}

			{/* Questions */}
			{quiz.map((q, qIdx) => {
				const selected = info.answers[qIdx];
				const isCorrect = selected === q.correctOptionIndex;

				return (
					<div key={qIdx} className="flex flex-col gap-3">
						<div className="flex items-start gap-2">
							<span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
								{qIdx + 1}
							</span>
							<p className="text-sm font-semibold text-gray-800 leading-snug">
								{q.question}
							</p>
						</div>

						<div className="flex flex-col gap-2 pl-8">
							{q.options.map((opt, oIdx) => {
								const isSelected = selected === oIdx;
								const isRight = q.correctOptionIndex === oIdx;
								let style =
									"border-gray-100 bg-white text-gray-700 hover:border-blue-200 hover:bg-blue-50";
								if (info.submitted) {
									if (isRight)
										style = "border-blue-400 bg-blue-50 text-blue-700";
									else if (isSelected && !isRight)
										style = "border-red-300 bg-red-50 text-red-600";
									else style = "border-gray-100 bg-white text-gray-400";
								} else if (isSelected) {
									style = "border-blue-500 bg-blue-50 text-blue-700";
								}

								return (
									<button
										key={oIdx}
										onClick={() => handleSelect(qIdx, oIdx)}
										className={`flex items-center justify-between text-left px-4 py-3 rounded-xl border text-sm transition-all duration-150 ${style}`}
									>
										<span>{opt}</span>
										{info.submitted && isRight && (
											<FiCheck
												size={14}
												className="text-blue-500 shrink-0 ml-2"
											/>
										)}
										{info.submitted && isSelected && !isRight && (
											<FiX size={14} className="text-red-400 shrink-0 ml-2" />
										)}
									</button>
								);
							})}
						</div>

						{/* Explanation */}
						{info.submitted && (
							<div
								className={`ml-8 px-4 py-3 rounded-xl text-xs leading-relaxed ${
									isCorrect
										? "bg-blue-50 text-blue-700 border border-blue-100"
										: "bg-red-50 text-red-600 border border-red-100"
								}`}
							>
								<span className="font-semibold">
									{isCorrect ? "✓ Correct — " : "✗ Incorrect — "}
								</span>
								{q.explanation}
							</div>
						)}
					</div>
				);
			})}

			{/* Submit */}
			{!info.submitted && (
				<button
					onClick={handleSubmit}
					disabled={!allAnswered}
					className="self-start flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all"
				>
					<MdOutlineQuiz size={16} />
					Submit Answers
				</button>
			)}
		</div>
	);
};


const ModulePage = () => {
	const router = useRouter();
	const params = useParams();
	const { courseId, moduleId } = params || {};

	

	const [info, setInfo] = useState({
		activeLessonId: null,
		activeTab: "content", // "content" | "practice",
		loading: true,
		module: null,
		lessons: [],
	});

	useEffect(() => {
		fetchCourseData();
	}, []);

	const fetchCourseData = useCallback(async () => {
		try {
			const { data } = await getCourse(courseId);
			const modules = data?.modules || [];
			const currentModule = modules.find((m) => m._id === moduleId);
			setInfo((prev) => ({
				...prev,
				loading: false,
				module: currentModule,
				lessons: currentModule?.lessons || [],
				activeLessonId: currentModule?.lessons?.[0]?._id || null,
			}));
		} catch (error) {
			message.error("Failed to fetch course data. Please try again.");
			console.error("Error fetching course data:", error);
		} finally {
			setInfo((prev) => ({ ...prev, loading: false }));
		}
	}, [courseId, moduleId]);

	const set = (key, value) => setInfo((prev) => ({ ...prev, [key]: value }));

	const activeLesson = useMemo(
		() => info?.lessons.find((l) => l._id === info.activeLessonId),
		[info.activeLessonId, info?.lessons]
	);

	const activeLessonIndex = useMemo(() => {
		return info?.lessons.findIndex((l) => l?._id === info?.activeLessonId);
	}, [info.activeLessonId, info?.lessons]);

	const goToLesson = (id) =>
		setInfo((prev) => ({ ...prev, activeLessonId: id, activeTab: "content" }));
	const goPrev = () => {
		if (activeLessonIndex > 0)
			goToLesson(info?.lessons[activeLessonIndex - 1]._id);
	};
	const goNext = () => {
		if (activeLessonIndex < info?.lessons.length - 1)
			goToLesson(info?.lessons[activeLessonIndex + 1]._id);
	};

	return (
		<div className="min-h-screen bg-white flex flex-col">
			{/* ── Top Navbar ──────────────────────────────────────────────────────── */}
			<nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-30">
				<button
					onClick={() => router.push(`/course/${courseId}`)}
					className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 font-medium transition"
				>
					<FiChevronLeft size={16} />
					<span>Back to Course</span>
				</button>

				<div className="flex items-center gap-2">
					<div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
						<HiSparkles size={14} className="text-white" />
					</div>
					<span className="text-base font-bold text-gray-900 tracking-tight">
						flo101
					</span>
				</div>

				<div className="text-xs text-gray-400 font-medium">
					{activeLessonIndex + 1} / {info?.lessons.length} lessons
				</div>
			</nav>

			{/* ── Body: Sidebar + Content ──────────────────────────────────────────── */}
			<div className="flex flex-1 overflow-hidden">
				{/* ── Sidebar ───────────────────────────────────────────────────────── */}
				<aside className="w-64 shrink-0 border-r border-gray-100 flex flex-col overflow-y-auto bg-white">
					{/* Module title */}
					<div className="px-5 py-4 border-b border-gray-50">
						<p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
							Module
						</p>
						<p className="text-sm font-bold text-gray-800 leading-snug">
							{info?.module?.title}
						</p>
					</div>

					{/* Lesson list */}
					<div className="flex flex-col py-3 px-3 gap-1">
						{info?.lessons.map((lesson, idx) => {
							const isActive = lesson._id === info.activeLessonId;
							const isDone = lesson.status === "completed";

							return (
								<button
									key={lesson._id}
									onClick={() => goToLesson(lesson._id)}
									className={`flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all ${
										isActive
											? "bg-blue-600 text-white shadow-sm"
											: "hover:bg-gray-50 text-gray-700"
									}`}
								>
									{/* Icon */}
									<div
										className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold border-2 transition-all ${
											isActive
												? "border-white/40 bg-white/20 text-white"
												: isDone
												? "border-blue-200 bg-blue-50 text-blue-500"
												: "border-gray-200 bg-white text-gray-400"
										}`}
									>
										{isDone && !isActive ? (
											<FiCheckCircle size={14} className="text-blue-500" />
										) : (
											<span>{String(idx + 1).padStart(2, "0")}</span>
										)}
									</div>

									<div className="flex flex-col min-w-0">
										<span
											className={`text-xs font-semibold leading-snug truncate ${
												isActive ? "text-white" : "text-gray-700"
											}`}
										>
											{lesson.title}
										</span>
										<span
											className={`text-xs mt-0.5 ${
												isActive ? "text-blue-100" : "text-gray-400"
											}`}
										>
											{lesson.estimatedMinutes} min
										</span>
									</div>
								</button>
							);
						})}
					</div>
				</aside>

				{/* ── Main Content ──────────────────────────────────────────────────── */}
				<main className="flex-1 flex flex-col overflow-y-auto">
					{/* Lesson title */}
					<div className="px-10 pt-8 pb-4">
						<p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-2">
							Lesson {activeLessonIndex + 1}
						</p>
						<h1 className="text-2xl font-extrabold text-gray-900 leading-snug">
							{activeLesson?.title}
						</h1>
						<div className="flex items-center gap-4 mt-2">
							<span className="text-xs text-gray-400">
								{activeLesson?.estimatedMinutes} min read
							</span>
							<span
								className={`text-xs font-medium px-2 py-0.5 rounded-full ${
									activeLesson?.status === "completed"
										? "bg-blue-50 text-blue-600"
										: "bg-gray-50 text-gray-400"
								}`}
							>
								{activeLesson?.status === "completed" ? "Completed" : "Pending"}
							</span>
						</div>
					</div>

					{/* ── Tabs ────────────────────────────────────────────────────────── */}
					<div className="flex items-center gap-1 px-10 pb-0 border-b border-gray-100">
						{[
							{
								id: "content",
								label: "Content",
								icon: <FiBookOpen size={14} />,
							},
							{
								id: "practice",
								label: "Practice",
								icon: <MdOutlineQuiz size={14} />,
							},
						].map((tab) => (
							<button
								key={tab.id}
								onClick={() => set("activeTab", tab.id)}
								className={`flex items-center gap-1.5 text-sm font-semibold px-5 py-3 border-b-2 transition-all -mb-px ${
									info.activeTab === tab.id
										? "border-blue-600 text-blue-600"
										: "border-transparent text-gray-400 hover:text-gray-600"
								}`}
							>
								{tab.icon}
								{tab.label}
								{tab.id === "practice" && (
									<span
										className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ml-1 ${
											info.activeTab === "practice"
												? "bg-blue-100 text-blue-600"
												: "bg-gray-100 text-gray-400"
										}`}
									>
										{activeLesson?.quiz?.length}
									</span>
								)}
							</button>
						))}
					</div>

					{/* ── Tab Content ─────────────────────────────────────────────────── */}
					<div className="flex-1 px-10 pb-32">
						{info.activeTab === "content" ? (
							<div className="prose prose-sm max-w-none py-8 text-gray-700 leading-relaxed whitespace-pre-wrap">
								{/* You'll replace this with your markdown renderer */}
								{activeLesson?.content}
							</div>
						) : (
							<QuizView
								key={activeLesson?._id}
								quiz={activeLesson?.quiz || []}
							/>
						)}
					</div>
				</main>
			</div>

			{/* ── Bottom Bar ──────────────────────────────────────────────────────── */}
			<div className="fixed bottom-0 left-64 right-0 bg-white border-t border-gray-100 px-10 py-4 flex items-center justify-between z-20">
				<button
					onClick={goPrev}
					disabled={activeLessonIndex === 0}
					className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
				>
					<FiChevronLeft size={16} />
					Previous Lesson
				</button>

				<button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all shadow-sm shadow-blue-100">
					<FiCheckCircle size={15} />
					Mark as Complete
				</button>

				<button
					onClick={goNext}
					disabled={activeLessonIndex === info?.lessons.length - 1}
					className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
				>
					Next Lesson
					<FiChevronLeft size={16} className="rotate-180" />
				</button>
			</div>
		</div>
	);
};

export default memo(ModulePage);
