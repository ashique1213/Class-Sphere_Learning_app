import api from "./api";

export const fetchAssignments = async (classroomSlug) => {
    const response = await api.get(`/assignments/${classroomSlug}/`);
    return response.data;
};

export const createAssignment = async (classroomSlug, data) => {
    const response = await api.post(`/assignments/${classroomSlug}/`, data);
    return response.data;
};

export const updateAssignment = async (classroomSlug, assignmentId, data) => {
    const response = await api.put(`/assignments/${classroomSlug}/${assignmentId}/`, data);
    return response.data;
};

export const deleteAssignment = async (classroomSlug, assignmentId) => {
    const response = await api.delete(`/assignments/${classroomSlug}/${assignmentId}/`);
    return response.data;
};

export const submitAssignment = async (classroomSlug, assignmentId, formData) => {
    const response = await api.post(`/assignments/${classroomSlug}/${assignmentId}/submit/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const updateSubmissionScore = async (classroomSlug, assignmentId, submissionId, score) => {
    const response = await api.put(`/assignments/${classroomSlug}/${assignmentId}/submissions/${submissionId}/`, { score });
    return response.data;
};