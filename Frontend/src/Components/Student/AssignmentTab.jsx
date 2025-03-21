import React, { useState } from "react";
import { FaFileUpload, FaClock } from "react-icons/fa";

const AssignmentTab = ({ assignments = [] }) => {
  const [uploadedFiles, setUploadedFiles] = useState({});

  const handleFileUpload = (event, assignmentId) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFiles((prev) => ({
        ...prev,
        [assignmentId]: file.name,
      }));
    }
  };

  if (!assignments || assignments.length === 0) {
    return (
      <p className="text-center text-gray-500 text-sm sm:text-base">
        No assignments available.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 p-4">
      {assignments.map((assignment) => (
        <div
          key={assignment.id}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
        >
          {/* Assignment Title */}
          <h3 className="text-lg font-semibold text-gray-800">
            {assignment.topic}
          </h3>
          <p className="text-xs text-gray-500">{assignment.category}</p>

          {/* Description */}
          <p className="text-sm text-gray-600 mt-2 mb-4">{assignment.description}</p>

          {/* Due Date */}
          <div className="flex items-center text-sm text-red-500 mb-4">
            <FaClock className="mr-2" />
            <span className="font-medium">Due Date:</span> {assignment.endDate}
          </div>

          {/* File Upload Section */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload your assignment:
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center gap-2 hover:border-teal-500 transition">
              <FaFileUpload className="text-gray-400 text-3xl" />
              <p className="text-xs text-gray-500">Drag & drop or click to upload</p>
              <input
                type="file"
                className="hidden"
                id={`upload-${assignment.id}`}
                onChange={(e) => handleFileUpload(e, assignment.id)}
              />
              <label
                htmlFor={`upload-${assignment.id}`}
                className="cursor-pointer bg-gray-200 text-gray-700 px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-300 transition"
              >
                Choose File
              </label>
              {uploadedFiles[assignment.id] && (
                <p className="text-xs text-gray-500 mt-2">
                  Uploaded: {uploadedFiles[assignment.id]}
                </p>
              )}
            </div>
            <button className="mt-3 w-full bg-teal-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-teal-600 transition">
              Submit Assignment
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AssignmentTab;
