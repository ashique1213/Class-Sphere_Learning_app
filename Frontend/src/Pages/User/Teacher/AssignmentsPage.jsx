import React, { useState, useEffect } from "react";
import {
  FaClipboardList,
  FaSearch,
  FaPlus,
  FaTimes,
  FaEye,
  FaEdit,
  FaTrash,
  FaSpinner,
} from "react-icons/fa";
import Navbar from "../../../Components/Layouts/Navbar";
import Footer from "../../../Components/Layouts/Footer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { fetchClassroom } from "../../../api/classroomapi";
import {
  fetchAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
} from "../../../api/assignmentsapi";
import DeleteModal from "../../../Components/Layouts/DeleteModal";

const AssignmentsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 
  const [assignmentToDelete, setAssignmentToDelete] = useState(null); 
  const [isAdding, setIsAdding] = useState(false); 
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); 
  const [assignments, setAssignments] = useState([]);
  const [newAssignment, setNewAssignment] = useState({
    topic: "",
    description: "",
    last_date: "",
    total_marks: "",
  });
  const [editAssignment, setEditAssignment] = useState({
    id: null,
    topic: "",
    description: "",
    last_date: "",
    total_marks: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const authToken = useSelector((state) => state.auth.authToken);
  const { slug } = useParams();
  const [classroom, setClassroom] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      if (!authToken) {
        console.error("No Auth Token Found!");
        setLoading(false);
        return;
      }

      try {
        const [classroomData, assignmentsData] = await Promise.all([
          fetchClassroom(slug),
          fetchAssignments(slug),
        ]);
        setClassroom(classroomData);
        setAssignments(assignmentsData);
      } catch {
        toast.error("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug, authToken]);

  const handleAddAssignment = async () => {
    if (
      !newAssignment.topic ||
      !newAssignment.description ||
      !newAssignment.last_date ||
      !newAssignment.total_marks
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsAdding(true);
    try {
      const newAssign = await createAssignment(slug, newAssignment);
      setAssignments([...assignments, newAssign]);
      setNewAssignment({
        topic: "",
        description: "",
        last_date: "",
        total_marks: "",
      });
      setIsModalOpen(false);
      toast.success("Assignment added successfully!");
    } catch (error) {
      toast.error("Failed to add assignment.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleEditAssignment = (assignment) => {
    const date = new Date(assignment.last_date);
    const formattedDate = date.toISOString().slice(0, 16);
  
    setEditAssignment({
      id: assignment.id,
      topic: assignment.topic,
      description: assignment.description,
      last_date: formattedDate, 
      total_marks: assignment.total_marks,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateAssignment = async () => {
    if (
      !editAssignment.topic ||
      !editAssignment.description ||
      !editAssignment.last_date ||
      !editAssignment.total_marks
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsEditing(true);
    try {
      const updatedAssign = await updateAssignment(
        slug,
        editAssignment.id,
        editAssignment
      );
      setAssignments(
        assignments.map((a) => (a.id === updatedAssign.id ? updatedAssign : a))
      );
      setEditAssignment({
        id: null,
        topic: "",
        description: "",
        last_date: "",
        total_marks: "",
      });
      setIsEditModalOpen(false);
      toast.success("Assignment updated successfully!");
    } catch (error) {
      toast.error("Failed to update assignment.");
    } finally {
      setIsEditing(false);
    }
  };

  const openDeleteModal = (assignmentId) => {
    setAssignmentToDelete(assignmentId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteAssignment = async () => {
    if (!assignmentToDelete) return;

    setIsDeleting(true);
    try {
      await deleteAssignment(slug, assignmentToDelete);
      setAssignments(assignments.filter((a) => a.id !== assignmentToDelete));
      toast.success("Assignment deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete assignment.");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setAssignmentToDelete(null);
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
          <Link
            to={`/myclassrooms/${user?.username}`}
            className="hover:underline"
          >
            {user?.username}
          </Link>{" "}
          |{" "}
          <Link
            to={`/myclassrooms/${user?.username}`}
            className="hover:underline"
          >
            Classroom
          </Link>{" "}
          |{" "}
          <Link to={`/classdetails/${slug}`} className="hover:underline">
            {classroom?.name}
          </Link>{" "}
          | <span className="font-bold">Assignments</span>
        </div>

        <div className="bg-white max-w-full sm:max-w-5xl mx-auto rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-teal-400 to-teal-600 p-4 sm:p-6 flex flex-col md:flex-row md:items-center text-center md:text-left">
            <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-white flex items-center justify-center text-teal-500 shadow-md">
              <FaClipboardList className="text-3xl sm:text-4xl md:text-5xl" />
            </div>
            <div className="flex-1 mt-4 md:mt-0 md:ml-4">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">
                Assignments
              </h2>
              <p className="text-white text-sm sm:text-base opacity-90">
                Manage and track your assignments.
              </p>
            </div>
            <div className="mt-4 md:mt-0 md:ml-4 text-center w-full md:w-auto">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-white text-teal-600 px-4 py-2 rounded-md border border-teal-500 shadow-md hover:bg-gray-100 w-full md:w-auto flex items-center gap-2 justify-center"
              >
                <FaPlus /> Add Assignment
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-full sm:max-w-5xl mx-auto flex items-center bg-gray-200 rounded-lg overflow-hidden shadow-sm mb-6">
          <input
            type="text"
            placeholder="Search assignments..."
            className="px-4 py-2 w-full border-none outline-none bg-transparent text-sm sm:text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-3">
            <FaSearch className="text-sm sm:text-base" />
          </button>
        </div>

        <div className="max-w-full sm:max-w-5xl mx-auto bg-white shadow-md rounded-lg overflow-hidden p-4 sm:p-6 capitalize">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
            Assignments
          </h3>
          <div className="space-y-4">
            {assignments.length > 0 ? (
              assignments
                .filter((assignment) =>
                  assignment.topic
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                )
                .map((assignment) => (
                  <div
                    key={assignment.id}
                    className="bg-gray-100 p-4 rounded-lg shadow-sm border"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-800 font-medium">
                          {assignment.topic}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {assignment.description}
                        </p>
                        <p className="text-gray-500 text-xs">
                          Due: {new Date(assignment.last_date).toLocaleString()}{" "}
                          | Marks: {assignment.total_marks}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          to={`/assignments/${slug}/${assignment.id}`}
                          state={{ slug }}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-xs sm:text-sm flex items-center gap-1"
                        >
                          <FaEye /> View
                        </Link>
                        <button
                          onClick={() => handleEditAssignment(assignment)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-xs sm:text-sm"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => openDeleteModal(assignment.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs sm:text-sm"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-gray-600 text-sm sm:text-base">
                No assignments added yet.
              </p>
            )}
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-130">
              <h3 className="text-lg font-semibold mb-4">Add Assignment</h3>
              <input
                type="text"
                placeholder="Topic"
                className="w-full border border-gray-300 px-3 py-2 rounded-md mb-4"
                value={newAssignment.topic}
                onChange={(e) =>
                  setNewAssignment({ ...newAssignment, topic: e.target.value })
                }
                disabled={isAdding}
              />
              <textarea
                placeholder="Description"
                className="w-full border border-gray-300 px-3 py-2 rounded-md mb-4"
                value={newAssignment.description}
                onChange={(e) =>
                  setNewAssignment({
                    ...newAssignment,
                    description: e.target.value,
                  })
                }
                disabled={isAdding}
              />
              <input
                type="datetime-local"
                className="w-full border border-gray-300 px-3 py-2 rounded-md mb-4"
                value={newAssignment.last_date}
                onChange={(e) =>
                  setNewAssignment({
                    ...newAssignment,
                    last_date: e.target.value,
                  })
                }
                disabled={isAdding}
              />
              <input
                type="number"
                placeholder="Total Marks"
                className="w-full border border-gray-300 px-3 py-2 rounded-md mb-4"
                value={newAssignment.total_marks}
                onChange={(e) =>
                  setNewAssignment({
                    ...newAssignment,
                    total_marks: e.target.value,
                  })
                }
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
                  onClick={handleAddAssignment}
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
              <h3 className="text-lg font-semibold mb-4">Edit Assignment</h3>
              <input
                type="text"
                placeholder="Topic"
                className="w-full border border-gray-300 px-3 py-2 rounded-md mb-4"
                value={editAssignment.topic}
                onChange={(e) =>
                  setEditAssignment({
                    ...editAssignment,
                    topic: e.target.value,
                  })
                }
                disabled={isEditing}
              />
              <textarea
                placeholder="Description"
                className="w-full border border-gray-300 px-3 py-2 rounded-md mb-4"
                value={editAssignment.description}
                onChange={(e) =>
                  setEditAssignment({
                    ...editAssignment,
                    description: e.target.value,
                  })
                }
                disabled={isEditing}
              />
              <input
                type="datetime-local"
                className="w-full border border-gray-300 px-3 py-2 rounded-md mb-4"
                value={editAssignment.last_date}
                onChange={(e) =>
                  setEditAssignment({
                    ...editAssignment,
                    last_date: e.target.value,
                  })
                }
                disabled={isEditing}
              />
              <input
                type="number"
                placeholder="Total Marks"
                className="w-full border border-gray-300 px-3 py-2 rounded-md mb-4"
                value={editAssignment.total_marks}
                onChange={(e) =>
                  setEditAssignment({
                    ...editAssignment,
                    total_marks: e.target.value,
                  })
                }
                disabled={isEditing}
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-1 rounded-md"
                  disabled={isEditing}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateAssignment}
                  className="bg-teal-500 text-white px-5 py-1 rounded-md flex items-center gap-2 disabled:bg-teal-300 disabled:cursor-not-allowed"
                  disabled={isEditing}
                >
                  {isEditing ? (
                    <>
                      <FaSpinner className="animate-spin" /> Updating...
                    </>
                  ) : (
                    "Update"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        <DeleteModal
          isOpen={isDeleteModalOpen}
          onConfirm={handleDeleteAssignment}
          onCancel={() => {
            setIsDeleteModalOpen(false);
            setAssignmentToDelete(null);
          }}
          message="Are you sure you want to delete this assignment? This action cannot be undone."
          isDeleting={isDeleting}
        />
      </div>
      <Footer />
    </>
  );
};

export default AssignmentsPage;