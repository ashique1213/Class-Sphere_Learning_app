import React, { useState } from "react";
import { FaFileUpload, FaClock, FaSpinner } from "react-icons/fa"; // Added FaSpinner for loading
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const AssignmentTab = ({ assignments = [], onSubmit }) => { // Added onSubmit prop
    const [uploadedFiles, setUploadedFiles] = useState({});
    const [loading, setLoading] = useState({}); // New loading state for each assignment
    const { slug } = useParams();

    const handleFileUpload = (event, assignmentId) => {
        const file = event.target.files[0];
        if (file) {
            setUploadedFiles((prev) => ({
                ...prev,
                [assignmentId]: file,
            }));
        }
    };

    const handleSubmit = async (assignmentId) => {
        const file = uploadedFiles[assignmentId];
        if (!file) {
            toast.error("Please upload a file before submitting.");
            return;
        }

        // Set loading state for this assignment
        setLoading((prev) => ({ ...prev, [assignmentId]: true }));

        try {
            // Use onSubmit prop instead of direct API call
            await onSubmit(assignmentId, file);
            toast.success("Assignment submitted successfully!");
            setUploadedFiles((prev) => ({ ...prev, [assignmentId]: null })); // Reset file input
        } catch (error) {
            toast.error(error?.response?.data?.error || "Failed to submit assignment.");
        } finally {
            // Reset loading state
            setLoading((prev) => ({ ...prev, [assignmentId]: false }));
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
            {assignments.map((assignment) => {
                const isExpired = new Date(assignment.last_date) < new Date();
                const isLoading = loading[assignment.id] || false; // Check if this assignment is loading
                return (
                    <div
                        key={assignment.id}
                        className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
                    >
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-semibold text-gray-800 capitalize">
                                {assignment.topic}
                            </h3>
                            <div className="text-sm text-gray-600">
                                {assignment.submission_score !== null ? (
                                    <p>
                                        <strong>Score:</strong> {assignment.submission_score} / {assignment.total_marks}
                                    </p>
                                ) : (
                                    <p>Not yet graded</p>
                                )}
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2 mb-4 capitalize">
                            {assignment.description}
                        </p>
                        <div className="flex items-center text-sm text-red-500 mb-4">
                            <FaClock className="mr-2" />
                            <span className="font-medium">Due Date:</span>{" "}
                            {new Date(assignment.last_date).toLocaleString()}
                            {isExpired && (
                                <span className="ml-2 text-red-600 font-semibold">
                                    (Expired)
                                </span>
                            )}
                        </div>
                        <div className="mt-4">
                            {assignment.file_url ? (
                                <div className="text-sm text-gray-500 mb-2">
                                    <p>
                                        Submitted:{" "}
                                        <a
                                            href={assignment.file_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-teal-600 hover:underline"
                                        >
                                            View Submission
                                        </a>
                                    </p>
                                </div>
                            ) : !isExpired ? (
                                <>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Upload your assignment:
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center gap-2 hover:border-teal-500 transition">
                                        <FaFileUpload className="text-gray-400 text-3xl" />
                                        <p className="text-xs text-gray-500">
                                            Drag & drop or click to upload
                                        </p>
                                        <input
                                            type="file"
                                            className="hidden"
                                            id={`upload-${assignment.id}`}
                                            onChange={(e) => handleFileUpload(e, assignment.id)}
                                            disabled={isLoading} // Disable input while loading
                                        />
                                        <label
                                            htmlFor={`upload-${assignment.id}`}
                                            className={`cursor-pointer bg-gray-200 text-gray-700 px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-300 transition ${
                                                isLoading ? "opacity-50 cursor-not-allowed" : ""
                                            }`}
                                        >
                                            Choose File
                                        </label>
                                        {uploadedFiles[assignment.id] && (
                                            <p className="text-xs text-gray-500 mt-2">
                                                Selected: {uploadedFiles[assignment.id].name}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleSubmit(assignment.id)}
                                        className={`mt-3 w-full bg-teal-500 text-white px-4 py-2 rounded-md shadow-md transition flex items-center justify-center gap-2 ${
                                            isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-teal-600"
                                        }`}
                                        disabled={isLoading} // Disable button while loading
                                    >
                                        {isLoading ? (
                                            <>
                                                <FaSpinner className="animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            "Submit Assignment"
                                        )}
                                    </button>
                                </>
                            ) : (
                                <p className="text-sm text-gray-500">No submission made.</p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default AssignmentTab;