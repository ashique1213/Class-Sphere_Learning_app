import React, { useState, useEffect } from "react";
import { FaTimes, FaChevronLeft, FaChevronRight, FaClock } from "react-icons/fa";

const ExamModal = ({ isOpen, onClose, exam, onSubmit }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(exam.timeout * 60); // Convert minutes to seconds

  useEffect(() => {
    if (isOpen) {
      setCurrentQuestion(0);
      setSelectedAnswers({});
      setTimeLeft(exam.timeout * 60);
    }
  }, [isOpen, exam]);

  // Timer Countdown
  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [isOpen, timeLeft]);

  // Format Timer
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Handle Answer Selection
  const handleAnswerSelect = (option) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: option,
    });
  };

  // Handle Next & Previous
  const handleNext = () => {
    if (currentQuestion < exam.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Handle Submit
  const handleSubmit = () => {
    onSubmit(selectedAnswers);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-opacity-50 p-4 z-50">
      <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-lg relative">
        {/* Close Button */}
        <button className="absolute top-3 right-3 text-gray-500 hover:text-red-500" onClick={onClose}>
          <FaTimes size={18} />
        </button>

        {/* Timer */}
        <div className="flex justify-between items-center mb-4 text-gray-700">
          <h2 className="text-lg font-semibold">{exam.topic} - {exam.marks} Marks</h2>
          <div className="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-full">
            <FaClock className="text-red-500" />
            <span className="text-sm font-semibold">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Question */}
        <div>
          <h3 className="text-lg font-semibold mb-3">
            Q{currentQuestion + 1}. {exam.questions[currentQuestion].question}
          </h3>

          {/* Options */}
          <div className="grid grid-cols-1 gap-2">
            {exam.questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                className={`w-full px-4 py-2 rounded-md border transition-all duration-300 text-left
                  ${
                    selectedAnswers[currentQuestion] === option
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                onClick={() => handleAnswerSelect(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2 bg-gray-300 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-400 disabled:opacity-50 text-sm"
          >
            <FaChevronLeft size={14} /> Previous
          </button>

          {currentQuestion === exam.questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="bg-teal-500 text-white px-5 py-2 rounded-md hover:bg-teal-600 text-sm"
            >
              Submit Exam
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 bg-teal-500 text-white px-3 py-2 rounded-md hover:bg-teal-600 text-sm"
            >
              Next <FaChevronRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamModal;
