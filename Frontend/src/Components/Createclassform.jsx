import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { updateClassroom,createClassroom } from "../api/classroomapi";
import "react-toastify/dist/ReactToastify.css";


const CreateClassForm = ({ onClose, existingClass }) => {
  const authToken = useSelector((state) => state.auth.authToken);
  const userEmail = useSelector((state) => state.auth.email);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    code: "",
    max_participants: "",
    start_datetime: "",
    end_datetime: "",
    description: "",
  });

  useEffect(() => {
    if (existingClass) {
      setFormData(existingClass);
    }
  }, [existingClass]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!authToken) {
      alert("You must be logged in.");
      return;
    }

    try {
      if (existingClass) {
        // Update existing class
        await updateClassroom(existingClass.id, formData, authToken);
        localStorage.setItem("toastMessage", "Classroom updated successfully!");
      } else {
        // Create new class
        await createClassroom(formData, authToken, userEmail);
        localStorage.setItem("toastMessage", "Classroom created successfully!");
      }

      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to save classroom.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto mt-5">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {existingClass ? "Edit Classroom" : "Create Classroom"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-gray-600">Classroom Name</label>
            <input type="text" name="name" className="w-full border rounded-md p-2 mt-1" onChange={handleChange} value={formData.name} required />
          </div>
          <div>
            <label className="text-gray-600">Category</label>
            <input type="text" name="category" className="w-full border rounded-md p-2 mt-1" onChange={handleChange} value={formData.category} required />
          </div>
          <div>
            <label className="text-gray-600">Classroom Code</label>
            <input type="text" name="code" className="w-full border rounded-md p-2 mt-1" onChange={handleChange} value={formData.code} required />
          </div>
          <div>
            <label className="text-gray-600">Max Participants</label>
            <input type="number" name="max_participants" className="w-full border rounded-md p-2 mt-1" onChange={handleChange} value={formData.max_participants} required />
          </div>
          <div>
            <label className="text-gray-600">Start Date & Time</label>
            <input type="datetime-local" name="start_datetime" className="w-full border rounded-md p-2 mt-1" onChange={handleChange} value={formData.start_datetime} required />
          </div>
          <div>
            <label className="text-gray-600">End Date & Time</label>
            <input type="datetime-local" name="end_datetime" className="w-full border rounded-md p-2 mt-1" onChange={handleChange} value={formData.end_datetime} required />
          </div>
        </div>
        <div className="mt-4">
          <label className="text-gray-600">Description</label>
          <textarea name="description" className="w-full border rounded-md p-2 mt-1" rows="4" onChange={handleChange} value={formData.description} required ></textarea>
        </div>
        <div className="mt-4 flex justify-end gap-4">
          <button type="button" onClick={onClose} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md">
            Cancel
          </button>
          <button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md">
            {existingClass ? "Update" : "Save Now"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateClassForm;
