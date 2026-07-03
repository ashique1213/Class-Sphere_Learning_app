import React from "react";

const ExamQuestions = ({ 
  questions, 
  indexOfFirstQuestion, 
  currentPage, 
  totalPages, 
  setCurrentPage 
}) => {
  if (questions.length === 0) {
    return <p className="text-gray-500 mt-2">No questions available.</p>;
  }

  return (
    <>
      <div className="space-y-4 mt-4">
        {questions.map((q, index) => (
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
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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
  );
};

export default React.memo(ExamQuestions);
