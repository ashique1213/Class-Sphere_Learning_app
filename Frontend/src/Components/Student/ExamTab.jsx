import React, { useState } from "react";
import ExamModal from "./ExamModal";
import { FaBookOpen, FaArrowRight } from "react-icons/fa";

const ExamTab = ({ exams = [] }) => {
  const [selectedExam, setSelectedExam] = useState(null);

  const handleStartExam = (exam) => {
    setSelectedExam(exam);
  };

  const handleSubmitExam = (answers) => {
    console.log("Submitted Answers:", answers);
    alert("Exam submitted successfully!");
    setSelectedExam(null);
  };

  if (!exams.length) {
    return <p className="text-gray-500 text-center text-sm">No upcoming exams.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 p-4">
      {exams.map((exam) => (
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

          <button
            className="mt-5 w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-2 rounded-full flex items-center justify-center gap-2 font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 active:scale-95"
            onClick={() => handleStartExam(exam)}
          >
            Start Exam <FaArrowRight />
          </button>
        </div>
      ))}

      {/* Exam Modal */}
      {selectedExam && (
        <ExamModal
          isOpen={!!selectedExam}
          onClose={() => setSelectedExam(null)}
          exam={selectedExam}
          onSubmit={handleSubmitExam}
        />
      )}
    </div>
  );
};

export default ExamTab;
