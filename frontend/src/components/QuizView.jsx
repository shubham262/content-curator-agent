/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { submitLessonQuiz } from "@/service/course";
import { message } from "antd";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import { MdOutlineQuiz } from "react-icons/md";

const QuizView = ({ quiz, lessonId, handleQuizSubmit, userResponses }) => {
	const params = useParams();
	const { courseId } = params || {};
	const [info, setInfo] = useState({
		answers: { ...(userResponses || {}) },
		submitted: userResponses ? true : false,
		score: 0,
	});

	useEffect(() => {
		if (userResponses) {
			let score = 0;
			quiz.forEach((q, i) => {
				if (userResponses[i] === q.correctOptionIndex) score++;
			});
			setInfo((prev) => ({ ...prev, score }));
		}
	}, [userResponses, quiz]);

	const handleSelect = (qIdx, oIdx) => {
		if (info.submitted) return;
		setInfo((prev) => ({
			...prev,
			answers: { ...prev.answers, [qIdx]: oIdx },
		}));
	};

	const handleSubmit = async () => {
		try {
			await submitLessonQuiz(courseId, lessonId, { answer: info.answers });
			await handleQuizSubmit();
			let score = 0;
			quiz.forEach((q, i) => {
				if (info.answers[i] === q.correctOptionIndex) score++;
			});
			setInfo((prev) => ({ ...prev, submitted: true, score }));
		} catch (error) {
			console.error("Error submitting quiz:", error);
			message.error("Failed to submit quiz. Please try again.");
		}
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

export default QuizView;
