import api from "./api";

export const fetchMaterials = async (classroomSlug) => {
    const response = await api.get(`/materials/${classroomSlug}/`);
    return response.data;
};

export const createMaterial = async (classroomSlug, formData) => {
    const response = await api.post(`/materials/${classroomSlug}/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const updateMaterial = async (classroomSlug, materialId, formData) => {
    const response = await api.put(`/materials/${classroomSlug}/${materialId}/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const deleteMaterial = async (classroomSlug, materialId) => {
    const response = await api.delete(`/materials/${classroomSlug}/${materialId}/`);
    return response.data;
};