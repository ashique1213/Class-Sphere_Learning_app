import React, { useState, useEffect } from "react";
import { FaClipboardList, FaEye, FaDownload, FaSave } from "react-icons/fa";
import { useParams, Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { fetchAssignments, updateSubmissionScore } from "../../api/assignmentsapi";

const AssignmentDetail = () => {
  const { assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const slug = location.state?.slug;

  useEffect(() => {
    const loadAssignment = async () => {
      try {
        const assignments = await fetchAssignments(slug);
        const selectedAssignment = assignments.find(a => a.id === parseInt(assignmentId));
        if (!selectedAssignment) throw new Error("Assignment not found");
        setAssignment(selectedAssignment);
      } catch (error) {
        toast.error("Failed to fetch assignment details.");
        console.error("Assignment Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAssignment();
  }, [assignmentId, slug]);

  const handleScoreChange = async (submissionId, score, totalMarks) => {
    if (score === null || score === "") return; // Allow saving only when score is set
    if (score < 0 || score > totalMarks) {
      toast.error(`Score must be between 0 and ${totalMarks}`);
      return;
    }
    try {
      const updatedSubmission = await updateSubmissionScore(slug, assignmentId, submissionId, score);
      setAssignment({
        ...assignment,
        submissions: assignment.submissions.map(sub => 
          sub.id === submissionId ? updatedSubmission : sub
        )
      });
      toast.success("Score updated successfully!");
    } catch (error) {
      toast.error("Failed to update score.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-center text-gray-600 text-lg">Loading assignment details...</p>
      </div>
    );
  }

  if (!assignment || !slug) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 pt-16 sm:pt-20 md:pt-20">
        <p className="text-center text-gray-500 text-lg">
          {assignment ? "Classroom slug not found." : "Assignment not found."}
        </p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 px-4 pt-16 sm:pt-20 md:pt-20">
        {/* Breadcrumb */}
        <div className="max-w-5xl mx-auto text-sm text-black py-4 capitalize">
          <Link to="/" className="hover:underline text-gray-600">Home</Link> |{" "}
          <Link to={`/assignments/${slug}`} className="hover:underline text-gray-600">Assignments</Link> |{" "}
          <span className="font-bold text-teal-600">{assignment.topic}</span>
        </div>

        {/* Assignment Header */}
        <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-lg ">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                <FaClipboardList className="text-teal-600 text-2xl" />
              </div>
              <div>
                <h2 className="text-xl sm:text-1xl font-bold text-gray-800 capitalize">{assignment.topic}</h2>
                <p className="text-gray-600 text-sm">Due: {new Date(assignment.last_date).toLocaleString()}</p>
              </div>
            </div>
            <Link
              to={`/assignments/${slug}`}
              className="mt-4 sm:mt-0 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition flex items-center gap-2"
            >
              ← Back to Assignments
            </Link>
          </div>

          {/* Assignment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 mb-6">
            <p>
              <strong className="text-gray-800">Description:</strong> {assignment.description}
            </p>
            <p>
              <strong className="text-gray-800">Total Marks:</strong> {assignment.total_marks}
            </p>
          </div>

          {/* Submissions Section */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaEye className="text-teal-600" /> Student Submissions
            </h3>
            {assignment.submissions.length === 0 ? (
              <p className="text-gray-500 text-sm">No students have submitted this assignment yet.</p>
            ) : (
              <div className="space-y-4">
                {assignment.submissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="bg-gray-100 p-4 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                  >
                    <div>
                      <p className="text-gray-800 font-medium capitalize">{submission.student_name}</p>
                      <p className="text-gray-600 text-sm">
                        Submitted on {new Date(submission.submitted_at).toLocaleString()}
                      </p>
                      {submission.file && (
                        <a
                          href={submission.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-600 text-sm hover:underline flex items-center gap-1"
                        >
                          <FaDownload /> Download Submission
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="0"
                        max={assignment.total_marks}
                        value={submission.score !== null ? submission.score : ""}
                        onChange={(e) => {
                          const newScore = e.target.value === "" ? null : parseInt(e.target.value);
                          setAssignment({
                            ...assignment,
                            submissions: assignment.submissions.map(sub => 
                              sub.id === submission.id ? { ...sub, score: newScore } : sub
                            )
                          });
                        }}
                        className="w-20 border border-gray-300 px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Score"
                      />
                      <span className="text-gray-600">/ {assignment.total_marks}</span>
                      <button
                        onClick={() => handleScoreChange(submission.id, submission.score, assignment.total_marks)}
                        className="bg-teal-500 text-white px-3 py-1 rounded-md hover:bg-teal-600 flex items-center gap-1"
                        disabled={submission.score === null || submission.score === ""}
                      >
                        <FaSave /> Save
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AssignmentDetail;