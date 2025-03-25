import React, { useState, useEffect } from "react";
import { FaFileAlt, FaSearch, FaPlus, FaTimes, FaEye, FaEdit, FaTrash, FaSpinner } from "react-icons/fa";
import Navbar from "../../../Components/Layouts/Navbar";
import Footer from "../../../Components/Layouts/Footer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { fetchClassroom } from "../../../api/classroomapi";
import { fetchMaterials, createMaterial, updateMaterial, deleteMaterial } from "../../../api/materialsapi";
import { useParams, Link } from "react-router-dom";
import DeleteModal from "../../../Components/Layouts/DeleteModal";

const MaterialsPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 
    const [materialToDelete, setMaterialToDelete] = useState(null); 
    const [isDeleting, setIsDeleting] = useState(false); 
    const [isAdding, setIsAdding] = useState(false);
    const [materials, setMaterials] = useState([]);
    const [newMaterial, setNewMaterial] = useState({ topic: "", file: null });
    const [editMaterial, setEditMaterial] = useState({ id: null, topic: "", file: null, material_type: "" });
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const { user } = useSelector((state) => state.auth);
    const authToken = useSelector((state) => state.auth.authToken);
    const [classroom, setClassroom] = useState(null);
    const { slug } = useParams();

    useEffect(() => {
        const loadData = async () => {
            if (!authToken) {
                console.error("No Auth Token Found!");
                setLoading(false);
                return;
            }

            try {
                const [classroomData, materialsData] = await Promise.all([
                    fetchClassroom(slug),
                    fetchMaterials(slug),
                ]);
                setClassroom(classroomData);
                setMaterials(materialsData);
            } catch {
                toast.error("Failed to fetch data.");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [slug, authToken]);

    const handleAddMaterial = async () => {
        if (!newMaterial.topic || !newMaterial.file) {
            toast.error("Please provide both topic and file.");
            return;
        }

        setIsAdding(true);
        const formData = new FormData();
        formData.append('topic', newMaterial.topic);
        formData.append('file', newMaterial.file);

        try {
            const newMat = await createMaterial(slug, formData);
            setMaterials([...materials, newMat]);
            setNewMaterial({ topic: "", file: null });
            setIsModalOpen(false);
            toast.success("Material added successfully!");
        } catch (error) {
            toast.error("Failed to add material.");
        } finally {
            setIsAdding(false);
        }
    };

    const handleEditMaterial = (material) => {
        setEditMaterial({
            id: material.id,
            topic: material.topic,
            file: null,
            material_type: material.material_type,
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateMaterial = async () => {
        if (!editMaterial.topic) {
            toast.error("Please provide a topic.");
            return;
        }

        const formData = new FormData();
        formData.append('topic', editMaterial.topic);
        if (editMaterial.file) {
            formData.append('file', editMaterial.file);
        }

        try {
            const updatedMat = await updateMaterial(slug, editMaterial.id, formData);
            setMaterials(materials.map(m => m.id === updatedMat.id ? updatedMat : m));
            setEditMaterial({ id: null, topic: "", file: null, material_type: "" });
            setIsEditModalOpen(false);
            toast.success("Material updated successfully!");
        } catch (error) {
            toast.error("Failed to update material.");
        }
    };

    const openDeleteModal = (materialId) => {
        setMaterialToDelete(materialId);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteMaterial = async () => {
        if (!materialToDelete) return;

        setIsDeleting(true);
        try {
            await deleteMaterial(slug, materialToDelete);
            setMaterials(materials.filter((m) => m.id !== materialToDelete));
            toast.success("Material deleted successfully!");
        } catch (error) {
            toast.error("Failed to delete material.");
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
            setMaterialToDelete(null);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 px-4 pt-16 sm:pt-20 md:pt-20">
                <div className="text-sm text-black max-w-full sm:max-w-5xl mx-auto py-4 capitalize">
                    Home | My Account |{" "}
                    <Link to={`/myclassrooms/${user?.username}`} className="hover:underline">{user?.username}</Link> |{" "}
                    <Link to={`/myclassrooms/${user?.username}`} className="hover:underline">Classroom</Link> |{" "}
                    <Link to={`/classdetails/${slug}`} className="hover:underline">{classroom?.name}</Link> |{" "}
                    <span className="font-bold">Materials</span>
                </div>

                <div className="bg-white max-w-full sm:max-w-5xl mx-auto rounded-lg shadow-lg overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-teal-400 to-teal-600 p-4 sm:p-6 flex flex-col md:flex-row md:items-center text-center md:text-left">
                        <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-white flex items-center justify-center text-teal-500 shadow-md">
                            <FaFileAlt className="text-3xl sm:text-4xl md:text-5xl" />
                        </div>
                        <div className="flex-1 mt-4 md:mt-0 md:ml-4">
                            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">Materials</h2>
                            <p className="text-white text-sm sm:text-base opacity-90">Browse and manage classroom materials.</p>
                        </div>
                        <div className="mt-4 md:mt-0 md:ml-4 text-center w-full md:w-auto">
                            <button onClick={() => setIsModalOpen(true)} className="bg-white text-teal-600 px-4 py-2 rounded-md border border-teal-500 shadow-md hover:bg-gray-100 w-full md:w-auto flex items-center gap-2 justify-center">
                                <FaPlus /> Add Material
                            </button>
                        </div>
                    </div>
                </div>

                <div className="max-w-full sm:max-w-5xl mx-auto flex items-center bg-gray-200 rounded-lg overflow-hidden shadow-sm mb-6">
                    <input
                        type="text"
                        placeholder="Search materials..."
                        className="px-4 py-2 w-full border-none outline-none bg-transparent text-sm sm:text-base"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-3">
                        <FaSearch className="text-sm sm:text-base" />
                    </button>
                </div>

                <div className="max-w-full sm:max-w-5xl mx-auto bg-white shadow-md rounded-lg overflow-hidden p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Materials</h3>
                    <div className="space-y-4">
                        {materials.length > 0 ? (
                            materials
                                .filter((material) => material.topic.toLowerCase().includes(searchQuery.toLowerCase()))
                                .map((material) => (
                                    <div key={material.id} className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-sm border">
                                        <span className="text-gray-800 font-medium">{material.topic}</span>
                                        {material.material_type === "video" ? (
                                            <video src={material.file_url} className="w-24 h-16" controls></video>
                                        ) : (
                                            <span className="text-gray-500">PDF</span>
                                        )}
                                        <div className="flex gap-2">
                                            <a href={material.file_url} target="_blank" rel="noopener noreferrer" className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-xs sm:text-sm"><FaEye /></a>
                                            <button onClick={() => handleEditMaterial(material)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-xs sm:text-sm"><FaEdit /></button>
                                            <button
                                                onClick={() => openDeleteModal(material.id)}
                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs sm:text-sm"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                ))
                        ) : (
                            <p className="text-gray-600 text-sm sm:text-base">No materials added yet.</p>
                        )}
                    </div>
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-130">
                            <h3 className="text-lg font-semibold mb-4">Add Material</h3>
                            <input
                                type="text"
                                placeholder="Topic"
                                className="w-full border border-gray-300 px-3 py-2 rounded-md mb-4"
                                value={newMaterial.topic}
                                onChange={(e) => setNewMaterial({ ...newMaterial, topic: e.target.value })}
                                disabled={isAdding}
                            />
                            <input
                                type="file"
                                className="w-full border border-gray-300 px-3 py-2 rounded-md mb-4"
                                onChange={(e) => setNewMaterial({ ...newMaterial, file: e.target.files[0] })}
                                disabled={isAdding}
                            />
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-1 rounded-md"
                                    disabled={isAdding}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddMaterial}
                                    className="bg-teal-500 text-white px-5 py-1 rounded-md flex items-center gap-2 disabled:bg-teal-300 disabled:cursor-not-allowed"
                                    disabled={isAdding}
                                >
                                    {isAdding ? (
                                        <>
                                            <FaSpinner className="animate-spin" /> Adding...
                                        </>
                                    ) : (
                                        "Add"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {isEditModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-130">
                            <h3 className="text-lg font-semibold mb-4">Edit Material</h3>
                            <input
                                type="text"
                                placeholder="Topic"
                                className="w-full border border-gray-300 px-3 py-2 rounded-md mb-4"
                                value={editMaterial.topic}
                                onChange={(e) => setEditMaterial({ ...editMaterial, topic: e.target.value })}
                            />
                            <p className="text-sm text-gray-600 mb-2">Current Type: {editMaterial.material_type}</p>
                            <input
                                type="file"
                                className="w-full border border-gray-300 px-3 py-2 rounded-md mb-4"
                                onChange={(e) => setEditMaterial({ ...editMaterial, file: e.target.files[0] })}
                            />
                            <div className="flex justify-end gap-3">
                                <button onClick={() => setIsEditModalOpen(false)} className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-1 rounded-md">Cancel</button>
                                <button onClick={handleUpdateMaterial} className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-1 rounded-md">Update</button>
                            </div>
                        </div>
                    </div>
                )}

                <DeleteModal
                    isOpen={isDeleteModalOpen}
                    onConfirm={handleDeleteMaterial}
                    onCancel={() => {
                        setIsDeleteModalOpen(false);
                        setMaterialToDelete(null);
                    }}
                    message="Are you sure you want to delete this material? This action cannot be undone."
                    isDeleting={isDeleting} 
                />
            </div>
            <Footer />
        </>
    );
};

export default MaterialsPage;