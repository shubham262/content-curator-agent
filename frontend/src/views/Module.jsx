/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react/display-name */
/* eslint-disable react-hooks/preserve-manual-memoization */
/* eslint-disable react-hooks/immutability */
"use client";
import React, { memo, useState, useMemo, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
	FiChevronLeft,
	FiBookOpen,
	FiCheckCircle,
	FiCheck,
	FiX,
	FiMenu,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import { MdOutlineQuiz } from "react-icons/md";
import { Drawer, message } from "antd";
import { getCourse } from "@/service/course";
import MobileLessonDrawer from "@/components/MobileLessonDrawer";
import LessonList from "@/components/LessonList";
import QuizView from "@/components/QuizView";
import ContentView from "@/components/ContentView";
import ModuleLoader from "@/components/ModuleLoader";

const ModulePage = () => {
	const router = useRouter();
	const params = useParams();
	const { courseId, moduleId } = params || {};

	const [info, setInfo] = useState({
		activeLessonId: null,
		activeTab: "content",
		loading: true,
		module: null,
		lessons: [],
		drawerOpen: false,
	});

	const set = (key, value) => setInfo((prev) => ({ ...prev, [key]: value }));

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

	useEffect(() => {
		fetchCourseData();
	}, []);

	const activeLesson = useMemo(
		() => info.lessons.find((l) => l._id === info.activeLessonId),
		[info.activeLessonId, info.lessons]
	);

	const activeLessonIndex = useMemo(
		() => info.lessons.findIndex((l) => l._id === info.activeLessonId),
		[info.activeLessonId, info.lessons]
	);

	const goToLesson = useCallback(
		(id) =>
			setInfo((prev) => ({
				...prev,
				activeLessonId: id,
				activeTab: "content",
				drawerOpen: false,
			})),
		[]
	);

	const goPrev = () => {
		if (activeLessonIndex > 0)
			goToLesson(info.lessons[activeLessonIndex - 1]._id);
	};
	const goNext = () => {
		if (activeLessonIndex < info.lessons.length - 1)
			goToLesson(info.lessons[activeLessonIndex + 1]._id);
	};

	if (info.loading) return <ModuleLoader />;

	return (
		<div className="min-h-screen bg-white flex flex-col">
			{/* ── Navbar ──────────────────────────────────────────────────────── */}
			<nav className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-30">
				<div className="flex items-center gap-2">
					{/* Hamburger — mobile only */}
					<button
						onClick={() => set("drawerOpen", true)}
						className="flex md:hidden items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:bg-gray-50 transition"
					>
						<FiMenu size={18} />
					</button>
					<button
						onClick={() => router.push(`/course/${courseId}`)}
						className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 font-medium transition"
					>
						<FiChevronLeft size={16} />
						<span className="hidden sm:inline">Back to Course</span>
					</button>
				</div>

				<div className="flex items-center gap-2">
					<div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
						<HiSparkles size={14} className="text-white" />
					</div>
					<span className="text-base font-bold text-gray-900 tracking-tight">
						flo101
					</span>
				</div>

				<div className="text-xs text-gray-400 font-medium">
					{activeLessonIndex + 1} / {info.lessons.length}
					<span className="hidden sm:inline"> lessons</span>
				</div>
			</nav>

			{/* ── Mobile Drawer ────────────────────────────────────────────────── */}
			<MobileLessonDrawer
				open={info.drawerOpen}
				onClose={() => set("drawerOpen", false)}
				module={info.module}
				lessons={info.lessons}
				activeLessonId={info.activeLessonId}
				onSelect={goToLesson}
			/>

			{/* ── Body ─────────────────────────────────────────────────────────── */}
			<div className="flex flex-1 overflow-hidden">
				{/* Desktop Sidebar — hidden on mobile */}
				<aside className="hidden md:flex w-64 shrink-0 border-r border-gray-100 flex-col overflow-y-auto bg-white">
					<LessonList
						module={info.module}
						lessons={info.lessons}
						activeLessonId={info.activeLessonId}
						onSelect={goToLesson}
					/>
				</aside>

				{/* Main */}
				<main className="flex-1 flex flex-col overflow-y-auto">
					<div className="px-5 md:px-10 pt-8 pb-4">
						<p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-2">
							Lesson {activeLessonIndex + 1}
						</p>
						<h1 className="text-xl md:text-2xl font-extrabold text-gray-900 leading-snug">
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

					{/* Tabs */}
					<div className="flex items-center gap-1 px-5 md:px-10 pb-0 border-b border-gray-100">
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
								className={`flex items-center gap-1.5 text-sm font-semibold px-4 md:px-5 py-3 border-b-2 transition-all -mb-px ${
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

					{/* Tab content */}
					<div className="flex-1 px-5 md:px-10 pb-32">
						{info.activeTab === "content" ? (
							<ContentView content={activeLesson?.content} />
						) : (
							<QuizView
								key={activeLesson?._id}
								quiz={activeLesson?.quiz || []}
							/>
						)}
					</div>
				</main>
			</div>

			{/* ── Bottom Bar ───────────────────────────────────────────────────── */}
			<div className="fixed bottom-0 left-0 md:left-64 right-0 bg-white border-t border-gray-100 px-4 md:px-10 py-4 flex items-center justify-between z-20">
				<button
					onClick={goPrev}
					disabled={activeLessonIndex === 0}
					className="flex items-center gap-1.5 text-sm font-semibold text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
				>
					<FiChevronLeft size={16} />
					<span className="hidden sm:inline">Previous</span>
				</button>

				<button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 md:px-6 py-2.5 rounded-xl transition-all shadow-sm shadow-blue-100">
					<FiCheckCircle size={15} />
					<span className="hidden sm:inline">Mark as</span> Complete
				</button>

				<button
					onClick={goNext}
					disabled={activeLessonIndex === info.lessons.length - 1}
					className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
				>
					<span className="hidden sm:inline">Next</span>
					<FiChevronLeft size={16} className="rotate-180" />
				</button>
			</div>
		</div>
	);
};

export default memo(ModulePage);
