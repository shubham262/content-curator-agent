/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, {
	memo,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { Collapse, message } from "antd";
import {
	FiBookOpen,
	FiCircle,
	FiCheckCircle,
	FiPlay,
	FiClock,
	FiLayers,
	FiAlertCircle,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import { getCourse } from "@/service/course";
import { useParams, useRouter } from "next/navigation";

const { Panel } = Collapse;

const CoursePage = () => {
	const params = useParams();
	const router = useRouter();
	const { courseId } = params || {};

	const intervalRef = useRef(null);
	const redirectRef = useRef(null);

	const [info, setInfo] = useState({
		loading: true,
		course: null,
		status: null, // "generating" | "complete" | "failed"
		countdown: 10,
	});

	const set = (key, value) => setInfo((prev) => ({ ...prev, [key]: value }));

	// ── Fetch ────────────────────────────────────────────────────────────
	const fetchCourseData = useCallback(async () => {
		try {
			const { data } = await getCourse(courseId);

			setInfo((prev) => ({
				...prev,
				loading: false,
				course: data,
				status: data?.status,
			}));

			// Stop polling on terminal states
			if (data?.status === "complete" || data?.status === "failed") {
				clearInterval(intervalRef.current);

				if (data?.status === "failed") {
					startRedirectCountdown();
				}
			}
		} catch (error) {
			message.error("Failed to fetch course data. Please try again.");
			console.error("Error fetching course data:", error);
			clearInterval(intervalRef.current);
			setInfo((prev) => ({ ...prev, loading: false, status: "failed" }));
			startRedirectCountdown();
		}
	}, [courseId]);

	// ── Polling ──────────────────────────────────────────────────────────
	useEffect(() => {
		fetchCourseData();

		intervalRef.current = setInterval(() => {
			setInfo((prev) => {
				if (prev.status === "complete" || prev.status === "failed") {
					clearInterval(intervalRef.current);
					return prev;
				}
				return prev;
			});
			fetchCourseData();
		}, 4000);

		return () => {
			clearInterval(intervalRef.current);
			clearInterval(redirectRef.current);
		};
	}, []);

	// ── Failed redirect countdown ────────────────────────────────────────
	const startRedirectCountdown = () => {
		let count = 10;
		redirectRef.current = setInterval(() => {
			count -= 1;
			set("countdown", count);
			if (count <= 0) {
				clearInterval(redirectRef.current);
				router.push("/");
			}
		}, 1000);
	};

	// ── Derived ──────────────────────────────────────────────────────────
	const modules = useMemo(() => info?.course?.modules || [], [info?.course]);

	const totalLessons = useMemo(
		() => modules.reduce((acc, m) => acc + m.lessons.length, 0),
		[modules]
	);

	const completedLessons = useMemo(
		() =>
			modules.reduce(
				(acc, m) =>
					acc + m.lessons.filter((l) => l.status === "completed").length,
				0
			),
		[modules]
	);

	const progressPercent = useMemo(
		() =>
			totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0,
		[completedLessons, totalLessons]
	);

	// ── Loading state ────────────────────────────────────────────────────
	if (info.loading) {
		return (
			<div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
				<div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center animate-pulse">
					<HiSparkles size={22} className="text-white" />
				</div>
				<p className="text-gray-500 text-sm font-medium">
					Loading your course…
				</p>
			</div>
		);
	}

	// ── Generating state ─────────────────────────────────────────────────
	if (info.status === "generating") {
		return (
			<div className="min-h-screen bg-white flex flex-col">
				<nav className="flex items-center justify-between px-8 py-5 border-b border-blue-50">
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
							<HiSparkles size={16} className="text-white" />
						</div>
						<span className="text-lg font-bold text-gray-900 tracking-tight">
							flo101
						</span>
					</div>
				</nav>

				<div className="flex flex-col items-center justify-center flex-1 gap-6 px-6">
					{/* Spinner */}
					<div className="relative w-20 h-20">
						<div className="absolute inset-0 rounded-full border-4 border-blue-100" />
						<div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
						<div className="absolute inset-0 flex items-center justify-center">
							<HiSparkles size={24} className="text-blue-600" />
						</div>
					</div>

					<div className="flex flex-col items-center gap-2 text-center">
						<p className="text-gray-900 font-bold text-xl">
							Building your course
						</p>
						<p className="text-gray-400 text-sm max-w-xs leading-relaxed">
							We're generating modules, lessons, and quizzes tailored to your
							goal. This takes about 30–60 seconds.
						</p>
					</div>

					{/* Steps */}
					<div className="flex flex-col gap-2 mt-2 w-full max-w-xs">
						{[
							"Designing course structure",
							"Writing lesson content",
							"Generating practice quizzes",
						].map((step, i) => (
							<div
								key={i}
								className="flex items-center gap-3 bg-blue-50 px-4 py-2.5 rounded-xl"
							>
								<div
									className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce shrink-0"
									style={{ animationDelay: `${i * 0.2}s` }}
								/>
								<span className="text-sm text-blue-700 font-medium">
									{step}
								</span>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	// ── Failed state ─────────────────────────────────────────────────────
	if (info.status === "failed") {
		return (
			<div className="min-h-screen bg-white flex flex-col">
				<nav className="flex items-center justify-between px-8 py-5 border-b border-blue-50">
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
							<HiSparkles size={16} className="text-white" />
						</div>
						<span className="text-lg font-bold text-gray-900 tracking-tight">
							flo101
						</span>
					</div>
				</nav>

				<div className="flex flex-col items-center justify-center flex-1 gap-5 px-6">
					<div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
						<FiAlertCircle size={30} className="text-red-400" />
					</div>
					<div className="flex flex-col items-center gap-2 text-center">
						<p className="text-gray-900 font-bold text-xl">
							Course generation failed
						</p>
						<p className="text-gray-400 text-sm max-w-xs leading-relaxed">
							Something went wrong while building your course. You'll be
							redirected to the home page in{" "}
							<span className="text-red-400 font-semibold">
								{info.countdown}s
							</span>
							.
						</p>
					</div>
					<button
						onClick={() => router.push("/")}
						className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all"
					>
						Go back now
					</button>
				</div>
			</div>
		);
	}

	// ── Complete state ───────────────────────────────────────────────────
	return (
		<div className="min-h-screen bg-white flex flex-col">
			<nav className="flex items-center justify-between px-8 py-5 border-b border-blue-50">
				<div
					className="flex items-center gap-2 cursor-pointer"
					onClick={() => router.push("/")}
				>
					<div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
						<HiSparkles size={16} className="text-white" />
					</div>
					<span className="text-lg font-bold text-gray-900 tracking-tight">
						flo101
					</span>
				</div>
				<span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full capitalize">
					{info?.course?.level}
				</span>
			</nav>

			<div className="flex flex-col max-w-3xl mx-auto w-full px-6 py-12 gap-10">
				{/* Course header */}
				<div className="flex flex-col gap-3">
					<h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-snug">
						{info?.course?.title}
					</h1>
					<p className="text-gray-500 text-base leading-relaxed">
						{info?.course?.description}
					</p>

					<div className="flex items-center gap-5 mt-1 flex-wrap">
						<div className="flex items-center gap-1.5 text-gray-400 text-sm">
							<FiLayers size={14} className="text-blue-400" />
							<span>{modules.length} modules</span>
						</div>
						<div className="flex items-center gap-1.5 text-gray-400 text-sm">
							<FiBookOpen size={14} className="text-blue-400" />
							<span>{totalLessons} lessons</span>
						</div>
						<div className="flex items-center gap-1.5 text-gray-400 text-sm capitalize">
							<FiClock size={14} className="text-blue-400" />
							<span>{info?.course?.level} level</span>
						</div>
					</div>

					<div className="flex flex-col gap-1.5 mt-2">
						<div className="flex items-center justify-between">
							<span className="text-xs text-gray-400 font-medium">
								Your progress
							</span>
							<span className="text-xs text-blue-600 font-semibold">
								{completedLessons}/{totalLessons} lessons completed
							</span>
						</div>
						<div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
							<div
								className="h-full bg-blue-500 rounded-full transition-all duration-500"
								style={{ width: `${progressPercent}%` }}
							/>
						</div>
					</div>
				</div>

				{/* Modules */}
				<div className="flex flex-col gap-3">
					<h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
						Course Modules
					</h2>

					<Collapse
						accordion={false}
						defaultActiveKey={[]}
						ghost
						className="flex flex-col gap-3"
						expandIcon={() => null}
					>
						{modules.map((mod, idx) => {
							const modCompleted = mod.lessons.filter(
								(l) => l.status === "completed"
							).length;
							const modTotal = mod.lessons.length;
							const allDone = modCompleted === modTotal;

							return (
								<Panel
									key={mod._id}
									className="!border !border-gray-100 !rounded-2xl !bg-white overflow-hidden shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-200"
									header={
										<div className="flex items-center justify-between w-full py-1">
											<div className="flex items-center gap-3">
												<div
													className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
														allDone ? "bg-blue-600" : "bg-blue-50"
													}`}
												>
													{allDone ? (
														<FiCheckCircle size={15} className="text-white" />
													) : (
														<span className="text-blue-600 text-xs font-bold">
															{String(idx + 1).padStart(2, "0")}
														</span>
													)}
												</div>
												<div className="flex flex-col">
													<span className="text-gray-900 font-semibold text-sm leading-snug">
														{mod.title}
													</span>
													<span className="text-gray-400 text-xs mt-0.5">
														{modCompleted}/{modTotal} lessons completed
													</span>
												</div>
											</div>
										</div>
									}
								>
									<div className="flex flex-col gap-1 pb-4 px-2">
										{mod.lessons.map((lesson) => (
											<div
												key={lesson._id}
												className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-blue-50 transition group"
											>
												<div className="flex items-center gap-3">
													{lesson.status === "completed" ? (
														<FiCheckCircle
															size={16}
															className="text-blue-500 shrink-0"
														/>
													) : (
														<FiCircle
															size={16}
															className="text-gray-300 shrink-0"
														/>
													)}
													<div className="flex flex-col">
														<span className="text-sm text-gray-700 font-medium leading-snug">
															{lesson.title}
														</span>
														<span className="text-xs text-gray-400 mt-0.5">
															{lesson.estimatedMinutes} min ·{" "}
															{lesson.quiz.length} quiz questions
														</span>
													</div>
												</div>
												<span
													className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${
														lesson.status === "completed"
															? "bg-blue-50 text-blue-600"
															: "bg-gray-50 text-gray-400"
													}`}
												>
													{lesson.status === "completed"
														? "Completed"
														: "Pending"}
												</span>
											</div>
										))}

										<div className="h-px bg-gray-50 my-2" />

										<button
											onClick={() =>
												router.push(
													`/course/${info?.course?._id}/module/${mod._id}`
												)
											}
											className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-all duration-200 shadow-sm shadow-blue-100 hover:shadow-md hover:shadow-blue-200 hover:-translate-y-0.5 active:translate-y-0 mt-1"
										>
											<FiPlay size={14} />
											{modCompleted > 0 && !allDone
												? "Continue Module"
												: allDone
												? "Review Module"
												: "Start Module"}
										</button>
									</div>
								</Panel>
							);
						})}
					</Collapse>
				</div>
			</div>

			<footer className="text-center text-xs text-gray-400 py-6 border-t border-gray-50 mt-auto">
				© {new Date().getFullYear()} flo101 · All rights reserved
			</footer>
		</div>
	);
};

export default memo(CoursePage);
