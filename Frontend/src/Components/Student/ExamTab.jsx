import React, { useState, useEffect } from "react";
import ExamModal from "./ExamModal";
import { FaBookOpen, FaArrowRight, FaCheck, FaEye } from "react-icons/fa"; // Added FaEye
import { submitExam, fetchSubmissions } from "../../api/examsapi";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const ExamTab = ({ exams = [] }) => {
  const [selectedExam, setSelectedExam] = useState(null);
  const [submittedExams, setSubmittedExams] = useState(new Set());
  const [viewAnswersExam, setViewAnswersExam] = useState(null); // For viewing submitted answers
  const { slug } = useParams();

  // Fetch submissions when component mounts
  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        const submissions = await fetchSubmissions(slug);
        const submittedIds = new Set(submissions.map((sub) => sub.exam));
        setSubmittedExams(submittedIds);
      } catch (error) {
        toast.error("Failed to load exam submissions.");
      }
    };
    loadSubmissions();
  }, [slug]);

  const handleStartExam = (exam) => {
    if (submittedExams.has(exam.id)) {
      toast.info("You have already submitted this exam.");
      return;
    }
    setSelectedExam(exam);
  };

  const handleViewAnswers = async (exam) => {
    try {
      const submissions = await fetchSubmissions(slug);
      const submission = submissions.find((sub) => sub.exam === exam.id);
      if (submission) {
        setViewAnswersExam({ ...exam, submittedAnswers: submission.answers });
      } else {
        toast.error("No submission found for this exam.");
      }
    } catch (error) {
      toast.error("Failed to fetch submitted answers.");
    }
  };

  const handleSubmitExam = async (submittedAnswers) => {
    try {
      const indexedAnswers = {};
      selectedExam.questions.forEach((q, index) => {
        indexedAnswers[q.id] = submittedAnswers[index] || null;
      });
      await submitExam(selectedExam.id, indexedAnswers);
      toast.success("Exam submitted successfully!");
      setSubmittedExams((prev) => new Set([...prev, selectedExam.id]));
      setSelectedExam(null);
    } catch (error) {
      if (error.response?.status === 500 && error.response?.data?.includes("IntegrityError")) {
        toast.error("You have already submitted this exam.");
      } else {
        toast.error(error.response?.data?.error || "Failed to submit exam.");
      }
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 p-4">
      {exams.map((exam) => {
        const isSubmitted = submittedExams.has(exam.id);
        return (
          <div
            key={exam.id}
            className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-5 relative"
          >
            <div className="absolute top-3 right-3 bg-teal-500 text-white text-xs px-3 py-1 rounded-full">
              {exam.marks} Marks
            </div>

            <div className="flex items-center gap-3 text-teal-700">
              <FaBookOpen className="text-3xl" />
              <h3 className="text-lg font-semibold">{exam.topic}</h3>
            </div>

            <p className="text-gray-600 text-sm mt-2">{exam.description}</p>

            <div className="mt-5 flex gap-2">
              <button
                className={`w-full py-2 rounded-full flex items-center justify-center gap-2 font-medium transition-all duration-300 ${
                  isSubmitted
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:shadow-lg hover:scale-105 active:scale-95"
                }`}
                onClick={() => handleStartExam(exam)}
                disabled={isSubmitted}
              >
                {isSubmitted ? (
                  <>
                    Done <FaCheck />
                  </>
                ) : (
                  <>
                    Start Exam <FaArrowRight />
                  </>
                )}
              </button>
              {isSubmitted && (
                <div className="relative group">
                <button
                  className="p-2 mt-1 bg-teal-500 text-white rounded-3xl hover:bg-teal-600 transition-all duration-300"
                  onClick={() => handleViewAnswers(exam)}
                >
                  <FaEye size={20} />
                </button>
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-center scale-0 rounded bg-gray-600 text-white text-xs px-2 py-1 transition-all duration-300 group-hover:scale-100">
                  View Answers
                </span>
              </div>
              )}
            </div>
          </div>
        );
      })}

      {selectedExam && (
        <ExamModal
          isOpen={!!selectedExam}
          onClose={() => setSelectedExam(null)}
          exam={selectedExam}
          onSubmit={handleSubmitExam}
        />
      )}
      {viewAnswersExam && (
        <ExamModal
          isOpen={!!viewAnswersExam}
          onClose={() => setViewAnswersExam(null)}
          exam={viewAnswersExam}
          onSubmit={() => {}} // No submission in view mode
          viewMode={true} // Flag for view-only mode
          submittedAnswers={viewAnswersExam.submittedAnswers}
        />
      )}
    </div>
  );
};

export default ExamTab;