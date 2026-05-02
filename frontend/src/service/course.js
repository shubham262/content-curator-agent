import api from ".";

export const createCourse = async (payload) => {
	try {
		const { data } = await api.post("/api/create-course", payload);

		return data;
	} catch (error) {
		throw new Error(
			error?.message || "Something went wrong while createCourse"
		);
	}
};
export const markLessonComplete = async (courseId, lessonId) => {
	try {
		const { data } = await api.put(
			`/api/mark-lesson-complete/${courseId}/${lessonId}`
		);

		return data;
	} catch (error) {
		throw new Error(
			error?.message || "Something went wrong while markLessonComplete"
		);
	}
};

export const submitLessonQuiz = async (courseId, lessonId, payload) => {
	try {
		const { data } = await api.put(
			`/api/submit-quiz/${courseId}/${lessonId}`,
			payload
		);

		return data;
	} catch (error) {
		throw new Error(
			error?.message || "Something went wrong while submitLessonQuiz"
		);
	}
};
export const getCourse = async (courseId) => {
	try {
		const { data } = await api.get(`/api/fetch-course/${courseId}`);

		return data;
	} catch (error) {
		throw new Error(error?.message || "Something went wrong while getCourse");
	}
};
