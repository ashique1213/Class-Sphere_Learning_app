import React, { useState } from "react";
import {
  FaFileAlt,
  FaSearch,
  FaPlus,
  FaTimes,
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import Navbar from "../../../Components/Navbar";
import Footer from "../../../Components/Footer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ExamsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exams, setExams] = useState([]);
  const [newExam, setNewExam] = useState({
    topic: "",
    description: "",
    timeout: "",
    endDate: "",
    marks: "",
    questions: [{ question: "", options: ["", "", "", ""], answer: "" }],
  });
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddExam = () => {
    if (
      !newExam.topic ||
      !newExam.description ||
      !newExam.timeout ||
      !newExam.endDate ||
      !newExam.marks
    ) {
      toast.error("Please provide all exam details.");
      return;
    }
    setExams([...exams, newExam]);
    setNewExam({
      topic: "",
      description: "",
      timeout: "",
      endDate: "",
      marks: "",
      questions: [{ question: "", options: ["", "", "", ""], answer: "" }],
    });
    setIsModalOpen(false);
    toast.success("Exam added successfully!");
  };

  const addQuestion = () => {
    if (newExam.questions.length < 10) {
      setNewExam({
        ...newExam,
        questions: [
          ...newExam.questions,
          { question: "", options: ["", "", "", ""], answer: "" },
        ],
      });
    } else {
      toast.error("Maximum 10 questions allowed.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 px-4 pt-16 sm:pt-20 md:pt-20">
        <div className="text-sm text-black max-w-full sm:max-w-5xl mx-auto py-4">
          Home | My Account | <span className="font-bold">Exams</span>
        </div>

        <div className="bg-white max-w-full sm:max-w-5xl mx-auto rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-teal-400 to-teal-600 p-4 sm:p-6 flex flex-col md:flex-row md:items-center text-center md:text-left">
            <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-white flex items-center justify-center text-teal-500 shadow-md">
              <FaFileAlt className="text-3xl sm:text-4xl md:text-5xl" />
            </div>
            <div className="flex-1 mt-4 md:mt-0 md:ml-4">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">
                Exams
              </h2>
              <p className="text-white text-sm sm:text-base opacity-90">
                Browse and manage exams.
              </p>
            </div>
            <div className="mt-4 md:mt-0 md:ml-4 text-center w-full md:w-auto">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-white text-teal-600 px-4 py-2 rounded-md border border-teal-500 shadow-md hover:bg-gray-100 w-full md:w-auto flex items-center gap-2 justify-center"
              >
                <FaPlus /> Add Exam
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-full sm:max-w-5xl mx-auto flex items-center bg-gray-200 rounded-lg overflow-hidden shadow-sm mb-6">
          <input
            type="text"
            placeholder="Search exams..."
            className="px-4 py-2 w-full border-none outline-none bg-transparent text-sm sm:text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-3">
            <FaSearch className="text-sm sm:text-base" />
          </button>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-md p-4 z-[1000]">
            <div className="bg-white w-[90%] sm:w-[80%] md:w-[60%] lg:w-[60%] xl:w-[60%] px-5 pt-4 pb-6 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Add Exam</h3>

              <input
                type="text"
                placeholder="Topic"
                className="w-full border border-gray-300 px-3 py-2 rounded-md mb-2"
                value={newExam.topic}
                onChange={(e) =>
                  setNewExam({ ...newExam, topic: e.target.value })
                }
              />

              <textarea
                placeholder="Description"
                className="w-full border border-gray-300 px-3 py-2 rounded-md mb-2"
                value={newExam.description}
                onChange={(e) =>
                  setNewExam({ ...newExam, description: e.target.value })
                }
              ></textarea>

              <input
                type="text"
                placeholder="Timeout"
                className="w-full border border-gray-300 px-3 py-2 rounded-md mb-2"
                value={newExam.timeout}
                onChange={(e) =>
                  setNewExam({ ...newExam, timeout: e.target.value })
                }
              />

              <input
                type="date"
                className="w-full border border-gray-300 px-3 py-2 rounded-md mb-2"
                value={newExam.endDate}
                onChange={(e) =>
                  setNewExam({ ...newExam, endDate: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Marks"
                className="w-full border border-gray-300 px-3 py-2 rounded-md mb-4"
                value={newExam.marks}
                onChange={(e) =>
                  setNewExam({ ...newExam, marks: e.target.value })
                }
              />

              <div className="mb-4">
                {newExam.questions.map((q, index) => (
                  <div
                    key={index}
                    className="mb-3 p-3 border border-gray-200 rounded-md"
                  >
                    <input
                      type="text"
                      placeholder={`Question ${index + 1}`}
                      className="w-full border border-gray-300 px-3 py-2 rounded-md mb-2"
                      value={q.question}
                      onChange={(e) => {
                        const updatedQuestions = [...newExam.questions];
                        updatedQuestions[index].question = e.target.value;
                        setNewExam({ ...newExam, questions: updatedQuestions });
                      }}
                    />

                    <div className="grid grid-cols-2 gap-2 mb-2">
                      {q.options.map((opt, optIndex) => (
                        <input
                          key={optIndex}
                          type="text"
                          placeholder={`Option ${optIndex + 1}`}
                          className="border border-gray-300 px-3 py-2 rounded-md"
                          value={opt}
                          onChange={(e) => {
                            const updatedQuestions = [...newExam.questions];
                            updatedQuestions[index].options[optIndex] =
                              e.target.value;
                            setNewExam({
                              ...newExam,
                              questions: updatedQuestions,
                            });
                          }}
                        />
                      ))}
                    </div>

                    <select
                      className="w-full border border-gray-300 px-3 py-2 rounded-md"
                      value={q.answer}
                      onChange={(e) => {
                        const updatedQuestions = [...newExam.questions];
                        updatedQuestions[index].answer = e.target.value;
                        setNewExam({ ...newExam, questions: updatedQuestions });
                      }}
                    >
                      <option value="">Select Correct Answer</option>
                      {q.options.map((opt, optIndex) => (
                        <option key={optIndex} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
                <div className="flex justify-end gap-2">
                  <div>
                    <button
                      onClick={addQuestion}
                      className="bg-teal-500 text-white px-3 py-2 rounded-md mt-2 mr-1"
                    >
                      Add Question
                    </button>
                  </div>
                  <button
                    button
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-300 text-black px-3 py-2 rounded-md mt-2 mr-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddExam}
                    className="bg-teal-500 text-white px-4 py-2 rounded-md mt-2 mr-1"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ExamsPage;
