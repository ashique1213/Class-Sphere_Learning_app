import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const API_URL = "http://127.0.0.1:8000/api/classrooms/";

const Createclassform = ({ onClose }) => {
  const authToken = useSelector((state) => state.auth.authToken); // Get token from Redux
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
 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!authToken) {
      alert("You must be logged in to create a classroom.");
      return;
    }

    try {
      await axios.post(API_URL, { ...formData, teacher_email: userEmail }, {  
        headers: {
          "Authorization": `Bearer ${authToken}`,  // Attach token in request
          "Content-Type": "application/json",
        },
      });

      alert("Classroom created successfully!");
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error creating classroom:", error);
      alert("Failed to create classroom. Check authentication.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto mt-5">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Create Classroom</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-gray-600">Classroom Name</label>
            <input type="text" name="name" className="w-full border rounded-md p-2 mt-1" onChange={handleChange} required />
          </div>
          <div>
            <label className="text-gray-600">Category/Subject</label>
            <input type="text" name="category" className="w-full border rounded-md p-2 mt-1" onChange={handleChange} required />
          </div>
          <div>
            <label className="text-gray-600">Classroom Code</label>
            <input type="text" name="code" className="w-full border rounded-md p-2 mt-1" onChange={handleChange} required />
          </div>
          <div>
            <label className="text-gray-600">Max Participants</label>
            <input type="number" name="max_participants" className="w-full border rounded-md p-2 mt-1" onChange={handleChange} required />
          </div>
          <div>
            <label className="text-gray-600">Start Date & Time</label>
            <input type="datetime-local" name="start_datetime" className="w-full border rounded-md p-2 mt-1" onChange={handleChange} required />
          </div>
          <div>
            <label className="text-gray-600">End Date & Time</label>
            <input type="datetime-local" name="end_datetime" className="w-full border rounded-md p-2 mt-1" onChange={handleChange} required />
          </div>
        </div>
        <div className="mt-4">
          <label className="text-gray-600">Description</label>
          <textarea name="description" className="w-full border rounded-md p-2 mt-1" rows="4" onChange={handleChange}></textarea>
        </div>
        <div className="mt-4 flex justify-end gap-4">
          <button type="button" onClick={onClose} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md">
            Cancel
          </button>
          <button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md">
            Save Now
          </button>
        </div>
      </form>
    </div>
  );
};

export default Createclassform;
