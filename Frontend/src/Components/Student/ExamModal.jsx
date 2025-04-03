import React, { useState, useEffect, useRef } from "react";
import { FaChevronLeft, FaChevronRight, FaClock, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

const ExamModal = ({
  isOpen,
  onClose,
  exam,
  onSubmit,
  viewMode = false,
  submittedAnswers = {},
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);
  const shouldAutoSubmit = useRef(false); // Flag for auto-submit

  // Reset state when modal opens
  useEffect(() => {
    if (!isOpen) return;

    setCurrentQuestion(0);
    if (viewMode) {
      const mappedAnswers = {};
      exam.questions.forEach((q, index) => {
        mappedAnswers[index] = submittedAnswers[q.id] || null;
      });
      setSelectedAnswers(mappedAnswers);
      setTimeLeft(0);
    } else {
      setSelectedAnswers({});
      const initialTime = exam.timeout ? parseInt(exam.timeout, 10) * 60 : 600;
      setTimeLeft(initialTime);
    }
  }, [isOpen, viewMode]);

  // Timer Setup and Cleanup
  useEffect(() => {
    if (!isOpen || viewMode) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          shouldAutoSubmit.current = true; // Set flag instead of calling directly
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isOpen, viewMode]);

  // Handle Auto-Submit after timer expires
  useEffect(() => {
    if (shouldAutoSubmit.current && !viewMode) {
      toast.info("Time’s up! Exam auto-submitted with current answers.");
      onSubmit(selectedAnswers);
      onClose();
      shouldAutoSubmit.current = false; // Reset flag
    }
  }, [timeLeft, viewMode, selectedAnswers, onSubmit, onClose]);

  // Format Timer
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Handle Answer Selection
  const handleAnswerSelect = (option) => {
    if (!viewMode) {
      setSelectedAnswers((prev) => {
        const updated = { ...prev, [currentQuestion]: option };
        return updated;
      });
    }
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

  // Handle Manual Submit
  const handleSubmit = () => {
    if (!viewMode) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      onSubmit(selectedAnswers);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-opacity-50 p-4 z-50">
      <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-lg relative">
        {/* Close Button - Only in viewMode */}
        {viewMode && (
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            onClick={onClose}
          >
            <FaTimes size={18} />
          </button>
        )}

        {/* Timer */}
        <div className="flex justify-between items-center mb-4 text-gray-700">
          <h2 className="text-lg font-semibold">
            {exam.topic} - {exam.marks} Marks
          </h2>
          {!viewMode && (
            <div className="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-full">
              <FaClock className="text-red-500" />
              <span className="text-sm font-semibold">{formatTime(timeLeft)}</span>
            </div>
          )}
        </div>

        {/* Question */}
        <div>
          <h3 className="text-lg font-semibold mb-3">
            Q{currentQuestion + 1}. {exam.questions[currentQuestion].question_text}
          </h3>

          {/* Options */}
            <div className="grid grid-cols-1 gap-2">
              {exam.questions[currentQuestion].options.map((option, index) => {
                const isCorrect = option === exam.questions[currentQuestion].correct_answer;
                const isSelected = selectedAnswers[currentQuestion] === option;
                const notAnswered = selectedAnswers[currentQuestion] === null;

                let buttonClass = "w-full px-4 py-2 rounded-md border transition-all duration-300 text-left ";
                
                if (viewMode) {
                  if (isCorrect) {
                    buttonClass += "bg-emerald-400 text-white"; // Show correct answer in green
                  } else if (isSelected) {
                    buttonClass += "bg-red-700 text-white"; // Show wrong selected answer in red
                  } else {
                    buttonClass += "bg-gray-100"; // Default color
                  }
                } else {
                  buttonClass += isSelected ? "bg-teal-500 text-white" : "bg-gray-100 hover:bg-gray-200";
                }

                return (
                  <button
                    key={index}
                    className={buttonClass}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={viewMode || timeLeft <= 0}
                  >
                    {viewMode && notAnswered ? "Not Answered" : option}
                  </button>
                );
              })}
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
              className={`px-5 py-2 rounded-md text-sm ${
                viewMode
                  ? "bg-gray-500 text-white hover:bg-gray-600"
                  : "bg-teal-500 text-white hover:bg-teal-600"
              }`}
              disabled={!viewMode && timeLeft <= 0}
            >
              {viewMode ? "Close" : "Submit Exam"}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 bg-teal-500 text-white px-3 py-2 rounded-md hover:bg-teal-600 text-sm"
              disabled={!viewMode && timeLeft <= 0}
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