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
export const getCourse = async (courseId) => {
	try {
		const { data } = await api.get(`/api/fetch-course/${courseId}`);

		return data;
	} catch (error) {
		throw new Error(error?.message || "Something went wrong while getCourse");
	}
};
