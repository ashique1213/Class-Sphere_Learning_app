import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye } from "react-icons/fa";
import { fetchExam, fetchExamSubmissionsForTeacher } from "../../api/examsapi";
import Navbar from "../Layouts/Navbar";
import Footer from "../Layouts/Footer";
import { FaSpinner } from "react-icons/fa";
import ExamSubmissions from "./ExamSubmissions";
import ExamQuestions from "./ExamQuestions";

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

  const handleViewSubmissions = useCallback(async () => {
    try {
      const examSubmissions = await fetchExamSubmissionsForTeacher(examId);
      setSubmissions(examSubmissions);
      setShowSubmissions(true);
    } catch (error) {
      toast.error("Failed to fetch submissions.");
      console.error(
        "Submissions Fetch Error:",
        error.response?.data || error.message
      );
    }
  }, [examId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <FaSpinner className="animate-spin text-teal-500 text-4xl" />
        </div>
        <Footer />
      </>
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
        <div className="max-w-5xl mx-auto text-sm text-black py-4 capitalize">
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
            <h2 className="text-xl font-bold text-gray-800">{exam.topic}</h2>

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
            <ExamSubmissions 
              submissions={submissions} 
              setShowSubmissions={setShowSubmissions} 
            />
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
          <ExamQuestions 
            questions={currentQuestions}
            indexOfFirstQuestion={indexOfFirstQuestion}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ExamDetail;
