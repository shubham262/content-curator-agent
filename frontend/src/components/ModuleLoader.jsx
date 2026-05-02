import { HiSparkles } from "react-icons/hi2";

const ModuleLoader = () => (
	<div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
		<div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
			<HiSparkles size={22} className="text-white animate-pulse" />
		</div>
		<div className="flex flex-col items-center gap-1">
			<p className="text-gray-800 font-semibold text-base">Loading lesson</p>
			<p className="text-gray-400 text-sm">Preparing your content…</p>
		</div>
		{/* Skeleton sidebar + content */}
		<div className="w-full max-w-4xl flex gap-4 px-6 mt-6">
			<div className="w-56 shrink-0 flex flex-col gap-2">
				{[80, 60, 70, 65, 75].map((w, i) => (
					<div
						key={i}
						className="h-12 bg-gray-100 rounded-xl animate-pulse"
						style={{ width: `${w}%` }}
					/>
				))}
			</div>
			<div className="flex-1 flex flex-col gap-3">
				<div className="h-6 bg-gray-100 rounded-lg animate-pulse w-1/2" />
				<div className="h-4 bg-gray-100 rounded-lg animate-pulse w-full" />
				<div className="h-4 bg-gray-100 rounded-lg animate-pulse w-5/6" />
				<div className="h-4 bg-gray-100 rounded-lg animate-pulse w-3/4" />
				<div className="h-4 bg-gray-100 rounded-lg animate-pulse w-full mt-2" />
				<div className="h-4 bg-gray-100 rounded-lg animate-pulse w-2/3" />
			</div>
		</div>
	</div>
);
export default ModuleLoader;
