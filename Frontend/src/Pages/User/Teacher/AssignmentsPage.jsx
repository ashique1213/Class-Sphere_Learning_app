import React, { useState } from "react";
import { FaClipboardList, FaSearch, FaPlus, FaTimes, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import Navbar from "../../../Components/Navbar";
import Footer from "../../../Components/Footer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AssignmentsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [newAssignment, setNewAssignment] = useState({ topic: "", description: "", lastDate: "", totalMarks: "" });
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddAssignment = () => {
    if (!newAssignment.topic || !newAssignment.description || !newAssignment.lastDate || !newAssignment.totalMarks) {
      toast.error("Please fill in all fields.");
      return;
    }
    setAssignments([...assignments, newAssignment]);
    setNewAssignment({ topic: "", description: "", lastDate: "", totalMarks: "" });
    setIsModalOpen(false);
    toast.success("Assignment added successfully!");
  };

  const handleDeleteAssignment = (index) => {
    const updatedAssignments = assignments.filter((_, i) => i !== index);
    setAssignments(updatedAssignments);
    toast.success("Assignment deleted successfully!");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 px-4 pt-16 sm:pt-20 md:pt-20">
        <div className="text-sm text-black max-w-full sm:max-w-5xl mx-auto py-4">
          Home | My Account | <span className="font-bold">Assignments</span>
        </div>

        <div className="bg-white max-w-full sm:max-w-5xl mx-auto rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-teal-400 to-teal-600 p-4 sm:p-6 flex flex-col md:flex-row md:items-center text-center md:text-left">
            <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-white flex items-center justify-center text-teal-500 shadow-md">
              <FaClipboardList className="text-3xl sm:text-4xl md:text-5xl" />
            </div>
            <div className="flex-1 mt-4 md:mt-0 md:ml-4">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">Assignments</h2>
              <p className="text-white text-sm sm:text-base opacity-90">Manage and track your assignments.</p>
            </div>
            <div className="mt-4 md:mt-0 md:ml-4 text-center w-full md:w-auto">
              <button onClick={() => setIsModalOpen(true)} className="bg-white text-teal-600 px-4 py-2 rounded-md border border-teal-500 shadow-md hover:bg-gray-100 w-full md:w-auto flex items-center gap-2 justify-center">
                <FaPlus /> Add Assignment
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-full sm:max-w-5xl mx-auto flex items-center bg-gray-200 rounded-lg overflow-hidden shadow-sm mb-6">
          <input type="text" placeholder="Search assignments..." className="px-4 py-2 w-full border-none outline-none bg-transparent text-sm sm:text-base" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <button className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-3">
            <FaSearch className="text-sm sm:text-base" />
          </button>
        </div>

        <div className="max-w-full sm:max-w-5xl mx-auto bg-white shadow-md rounded-lg overflow-hidden p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Assignments</h3>
          <div className="space-y-4">
            {assignments.length > 0 ? (
              assignments
                .filter((assignment) => assignment.topic.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((assignment, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-sm border">
                    <div>
                      <p className="text-gray-800 font-medium">{assignment.topic}</p>
                      <p className="text-gray-600 text-sm">{assignment.description}</p>
                      <p className="text-gray-500 text-xs">Due: {assignment.lastDate} | Marks: {assignment.totalMarks}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-xs sm:text-sm"><FaEye /></button>
                      <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-xs sm:text-sm"><FaEdit /></button>
                      <button onClick={() => handleDeleteAssignment(index)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs sm:text-sm"><FaTrash /></button>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-gray-600 text-sm sm:text-base">No assignments added yet.</p>
            )}
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-130">
              <h3 className="text-lg font-semibold mb-4">Add Assignment</h3>
              <input type="text" placeholder="Topic" className="w-full border border-gray-300 px-3 py-2 rounded-md mb-4" value={newAssignment.topic} onChange={(e) => setNewAssignment({ ...newAssignment, topic: e.target.value })} />
              <textarea placeholder="Description" className="w-full border border-gray-300 px-3 py-2 rounded-md mb-4" value={newAssignment.description} onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })} />
              <input type="date" className="w-full border border-gray-300 px-3 py-2 rounded-md mb-4" value={newAssignment.lastDate} onChange={(e) => setNewAssignment({ ...newAssignment, lastDate: e.target.value })} />
              <input type="number" placeholder="Total Marks" className="w-full border border-gray-300 px-3 py-2 rounded-md mb-4" value={newAssignment.totalMarks} onChange={(e) => setNewAssignment({ ...newAssignment, totalMarks: e.target.value })} />
              <div className="flex justify-end gap-3">
                <button onClick={() => setIsModalOpen(false)} className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-1 rounded-md">Cancel</button>
                <button onClick={handleAddAssignment} className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-1 rounded-md">Add</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default AssignmentsPage;