import { memo } from "react";
import { FiCheckCircle } from "react-icons/fi";

export const LessonList = ({ module, lessons, activeLessonId, onSelect }) => (
	<div className="flex flex-col h-full">
		{/* Module title */}
		<div className="px-5 py-4 border-b border-gray-100 shrink-0">
			<p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
				Module
			</p>
			<p className="text-sm font-bold text-gray-800 leading-snug">
				{module?.title}
			</p>
		</div>

		{/* Scrollable lesson list */}
		<div className="flex flex-col py-3 px-3 gap-1 overflow-y-auto flex-1">
			{lessons.map((lesson, idx) => {
				const isActive = lesson._id === activeLessonId;
				const isDone = lesson.status === "completed";

				return (
					<button
						key={lesson._id}
						onClick={() => onSelect(lesson._id)}
						className={`flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all ${
							isActive
								? "bg-blue-600 text-white shadow-sm"
								: "hover:bg-gray-50 text-gray-700"
						}`}
					>
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
	</div>
);
export default memo(LessonList);
