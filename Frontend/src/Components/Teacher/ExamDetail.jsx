import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye } from "react-icons/fa";
import { fetchExam, fetchExamSubmissionsForTeacher } from "../../api/examsapi";
import Navbar from "../Navbar";
import Footer from "../Footer";

const ExamDetail = () => {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const location = useLocation();
  const slug = location.state?.slug;

  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 3;

  useEffect(() => {
    const loadExam = async () => {
      try {
        const data = await fetchExam(examId);
        console.log("Fetched Exam:", data);
        setExam(data);
      } catch (error) {
        toast.error("Failed to fetch exam details.");
        console.error("Exam Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadExam();
  }, [examId]);

  const handleViewSubmissions = async () => {
    try {
      console.log("Fetching submissions for examId:", examId);
      const examSubmissions = await fetchExamSubmissionsForTeacher(examId);
      console.log("Submissions Fetched:", examSubmissions);
      setSubmissions(examSubmissions);
      setShowSubmissions(true);
      console.log(
        "Show Submissions Set to True, Submissions:",
        examSubmissions
      );
    } catch (error) {
      toast.error("Failed to fetch submissions.");
      console.error(
        "Submissions Fetch Error:",
        error.response?.data || error.message
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-center text-gray-600 text-lg">
          Loading exam details...
        </p>
      </div>
    );
  }

  if (!exam || !slug) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 pt-16 sm:pt-20 md:pt-20">
        <p className="text-center text-gray-500 text-lg">
          {exam ? "Classroom slug not found." : "Exam not found."}
        </p>
      </div>
    );
  }

  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = exam.questions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );
  const totalPages = Math.ceil(exam.questions.length / questionsPerPage);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 px-4 pt-16 sm:pt-20 md:pt-20">
        <div className="max-w-5xl mx-auto text-sm text-black py-4">
          <Link to="/" className="hover:underline text-gray-600">
            Home
          </Link>{" "}
          |{" "}
          <Link to={`/exams/${slug}`} className="hover:underline text-gray-600">
            Exams
          </Link>{" "}
          | <span className="font-bold text-teal-600">{exam.topic}</span>
        </div>

        <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            {/* Exam Title */}
            <h2 className="text-xl font-bold text-gray-800">{exam.topic}</h2>

            {/* Buttons Container */}
            <div className="flex gap-4">
              <button
                onClick={handleViewSubmissions}
                className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition flex items-center gap-2"
              >
                <FaEye /> View Submissions
              </button>

              <Link
                to={`/exams/${slug}`}
                className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition flex items-center gap-2"
              >
                ← Back to Exams
              </Link>
            </div>
          </div>

          {showSubmissions && (
            <div className="mt-6 bg-gray-100 p-4 mb-4 rounded-lg shadow-sm">
              <h3 className="text-md font-semibold text-gray-900 mb-4">
                📋 Student Submissions
              </h3>
              {submissions.length === 0 ? (
                <p className="text-gray-500">
                  No students have submitted this exam yet.
                </p>
              ) : (
                <ul className="space-y-2">
                  {submissions.map((submission, index) => {
                    const studentName =
                      `${submission.student.first_name || ""} ${
                        submission.student.last_name || ""
                      }`.trim() || submission.student.username; // Fallback to username if name is empty
                    return (
                      <li
                        key={submission.id || index}
                        className="p-2 bg-white rounded-md shadow-sm flex justify-between items-center"
                      >
                        <span className="text-gray-700 ml-5 capitalize font-bold">
                          {studentName}
                        </span>
                        <span>
                          Submitted on{" "}
                          {new Date(submission.submitted_at).toLocaleString()}
                        </span>
                        <span className="text-teal-600 pr-5 font-medium">
                          Score: {submission.score || "N/A"}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
              <div className="flex justify-end">
                <button
                  onClick={() => setShowSubmissions(false)}
                  className="mt-4 bg-gray-300 text-gray-800 px-5 py-1 rounded-lg hover:bg-gray-400 transition"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          <p className="text-gray-600 mb-2">
            <strong className="text-gray-800">Description:</strong>{" "}
            {exam.description}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700 mb-6">
            <p>
              <strong className="text-gray-800">⏳ Timeout:</strong>{" "}
              {exam.timeout}
            </p>
            <p>
              <strong className="text-gray-800">📅 End Date:</strong>{" "}
              {exam.end_date}
            </p>
            <p>
              <strong className="text-gray-800">🏆 Marks:</strong> {exam.marks}
            </p>
          </div>

          <h3 className="text-md font-semibold text-gray-900 mt-6">
            📌 Questions
          </h3>
          {exam.questions.length === 0 ? (
            <p className="text-gray-500 mt-2">No questions available.</p>
          ) : (
            <>
              <div className="space-y-4 mt-4">
                {currentQuestions.map((q, index) => (
                  <div
                    key={q.id || index}
                    className="bg-gray-100 p-4 rounded-lg shadow-sm"
                  >
                    <p className="font-semibold text-gray-800">
                      Q{indexOfFirstQuestion + index + 1}: {q.question_text}
                    </p>
                    <ul className="mt-2 space-y-1">
                      {q.options.map((opt, optIndex) => (
                        <li
                          key={optIndex}
                          className={`p-2 rounded-md ${
                            opt === q.correct_answer
                              ? "bg-teal-100 text-teal-700 font-medium"
                              : "text-gray-700"
                          }`}
                        >
                          {opt} {opt === q.correct_answer && "✔"}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4 mt-6">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === 1
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-teal-500 text-white hover:bg-teal-600"
                    }`}
                  >
                    ← Previous
                  </button>
                  <span className="text-gray-700 font-semibold">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === totalPages
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-teal-500 text-white hover:bg-teal-600"
                    }`}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ExamDetail;
