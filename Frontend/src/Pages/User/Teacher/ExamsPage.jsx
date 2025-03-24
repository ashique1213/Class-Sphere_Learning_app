import React, { useEffect, useState } from "react";
import { FaFileAlt, FaSearch, FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import Navbar from "../../../Components/Navbar";
import Footer from "../../../Components/Footer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchExams, createExam, updateExam, deleteExam } from "../../../api/examsapi";
import DeleteModal from "../../../Components/DeleteModal"; // Import the DeleteModal
import { fetchClassroom } from "../../../api/classroomapi";

const ExamsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exams, setExams] = useState([]);
  const [newExam, setNewExam] = useState({
    topic: "",
    description: "",
    timeout: "",
    end_date: "",
    marks: "",
    questions: [{ question_text: "", options: ["", "", "", ""], correct_answer: "" }],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editExamId, setEditExamId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, authToken } = useSelector((state) => state.auth);
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [classroom, setClassroom] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState(null); 
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const loadData = async () => {
      if (!authToken) {
        console.error("No Auth Token Found!");
        setLoading(false);
        return;
      }

      try {
        const [classroomData, examsData] = await Promise.all([
          fetchClassroom(slug),
          fetchExams(slug),
        ]);
        setClassroom(classroomData);
        setExams(Array.isArray(examsData) ? examsData : []);
      } catch (error) {
        toast.error("Failed to fetch data.");
        setExams([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [slug, authToken]);

  const handleAddExam = async () => {
    if (
      !newExam.topic ||
      !newExam.description ||
      !newExam.timeout ||
      !newExam.end_date ||
      !newExam.marks
    ) {
      toast.error("Please provide all exam details.");
      return;
    }
    if (newExam.timeout < 10 || newExam.timeout > 25) {
      toast.error("Timeout must be between 10 and 25.");
      return;
    }
    
    if (newExam.end_date <= today) {
      toast.error("End date must be in the future.");
      return;
    }
    
    if (newExam.marks <= 10) {
      toast.error("Marks must be greater than 10.");
      return;
    }

    try {
      if (isEditing) {
        const updatedExam = await updateExam(editExamId, newExam);
        setExams(exams.map((exam) => (exam.id === editExamId ? updatedExam : exam)));
        toast.success("Exam updated successfully!");
      } else {
        const createdExam = await createExam(slug, newExam);
        setExams((prevExams) => [...prevExams, createdExam]);
        toast.success("Exam added successfully!");
      }
      resetModal();
    } catch (error) {
      toast.error(
        error.response?.data?.error || `Failed to ${isEditing ? "update" : "create"} exam.`
      );
    }
  };

  const handleEditExam = (exam) => {
    setNewExam({
      topic: exam.topic,
      description: exam.description,
      timeout: exam.timeout,
      end_date: exam.end_date,
      marks: exam.marks,
      questions: exam.questions,
    });
    setEditExamId(exam.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDeleteExam = (examId) => {
    // Open the delete modal instead of using window.confirm
    setExamToDelete(examId);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteExam = async () => {
    try {
      await deleteExam(examToDelete);
      setExams(exams.filter((exam) => exam.id !== examToDelete));
      toast.success("Exam deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete exam.");
    } finally {
      setIsDeleteModalOpen(false);
      setExamToDelete(null);
    }
  };

  const cancelDeleteExam = () => {
    setIsDeleteModalOpen(false);
    setExamToDelete(null);
  };

  const addQuestion = () => {
    if (newExam.questions.length < 10) {
      setNewExam({
        ...newExam,
        questions: [
          ...newExam.questions,
          { question_text: "", options: ["", "", "", ""], correct_answer: "" },
        ],
      });
    } else {
      toast.error("Maximum 10 questions allowed.");
    }
  };

  const resetModal = () => {
    setNewExam({
      topic: "",
      description: "",
      timeout: "",
      end_date: "",
      marks: "",
      questions: [{ question_text: "", options: ["", "", "", ""], correct_answer: "" }],
    });
    setIsEditing(false);
    setEditExamId(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 px-4 pt-16 sm:pt-20 md:pt-20">
        <div className="text-sm text-black max-w-full sm:max-w-5xl mx-auto py-4 capitalize">
          Home | My Account |{" "}
          <Link to={`/myclassrooms/${user?.username}`} className="hover:underline">
            {user?.username}
          </Link>{" "}
          |{" "}
          <Link to={`/myclassrooms/${user?.username}`} className="hover:underline">
            Classroom
          </Link>{" "}
          |{" "}
          <Link to={`/classdetails/${slug}`} className="hover:underline">
            {classroom?.name || "Classroom"}
          </Link>{" "}
          | <span className="font-bold">Exams</span>
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

        <div className="max-w-5xl mx-auto">
          {loading ? (
            <p className="text-center text-gray-600">Loading exams...</p>
          ) : !Array.isArray(exams) || exams.length === 0 ? (
            <p className="text-center text-gray-500">No exams available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {exams.map((exam) => (
                <div
                  key={exam.id}
                  className="bg-white p-5 rounded-xl shadow-md transition-all hover:shadow-lg"
                >
                  <h3 className="text-xl font-semibold text-gray-800">{exam.topic}</h3>
                  <p className="text-gray-600">{exam.description}</p>
                  <div className="mt-2 text-sm text-gray-500 space-y-1">
                    <p>
                      ⏳ Timeout: <span className="font-medium">{exam.timeout}</span>
                    </p>
                    <p>
                      📅 End Date: <span className="font-medium">{exam.end_date}</span>
                    </p>
                    <p>
                      🏆 Marks: <span className="font-medium">{exam.marks}</span>
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-end gap-3">
                    <button
                      onClick={() => navigate(`/exam/${exam.id}`, { state: { slug } })}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleEditExam(exam)}
                      className="p-2 text-yellow-500 hover:text-yellow-700 transition-all"
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteExam(exam.id)}
                      className="p-2 text-red-500 hover:text-red-700 transition-all"
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-md p-4 z-[1000]">
            <div className="bg-white w-[90%] sm:w-[80%] md:w-[60%] lg:w-[60%] xl:w-[60%] px-5 pt-4 pb-6 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">
                {isEditing ? "Edit Exam" : "Add Exam"}
              </h3>

              <input
                type="text"
                placeholder="Topic"
                className="w-full border border-gray-300 px-3 py-2 rounded-md mb-2"
                value={newExam.topic}
                onChange={(e) => setNewExam({ ...newExam, topic: e.target.value })}
              />

              <textarea
                placeholder="Description"
                className="w-full border border-gray-300 px-3 py-2 rounded-md mb-2"
                value={newExam.description}
                onChange={(e) => setNewExam({ ...newExam, description: e.target.value })}
              ></textarea>

              <input
                type="text"
                placeholder="Timeout (e.g., 10 minitues)"
                className="w-full border border-gray-300 px-3 py-2 rounded-md mb-2"
                value={newExam.timeout}
                onChange={(e) => setNewExam({ ...newExam, timeout: e.target.value })}
              />

              <input
                type="date"
                className="w-full border border-gray-300 px-3 py-2 rounded-md mb-2"
                value={newExam.end_date}
                onChange={(e) => setNewExam({ ...newExam, end_date: e.target.value })}
              />

              <input
                type="number"
                placeholder="Marks"
                className="w-full border border-gray-300 px-3 py-2 rounded-md mb-4"
                value={newExam.marks}
                onChange={(e) => setNewExam({ ...newExam, marks: e.target.value })}
              />

              <div className="mb-4">
                {newExam.questions.map((q, index) => (
                  <div key={index} className="mb-3 p-3 border border-gray-200 rounded-md">
                    <input
                      type="text"
                      placeholder={`Question ${index + 1}`}
                      className="w-full border border-gray-300 px-3 py-2 rounded-md mb-2"
                      value={q.question_text}
                      onChange={(e) => {
                        const updatedQuestions = [...newExam.questions];
                        updatedQuestions[index].question_text = e.target.value;
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
                            updatedQuestions[index].options[optIndex] = e.target.value;
                            setNewExam({ ...newExam, questions: updatedQuestions });
                          }}
                        />
                      ))}
                    </div>

                    <select
                      className="w-full border border-gray-300 px-3 py-2 rounded-md"
                      value={q.correct_answer}
                      onChange={(e) => {
                        const updatedQuestions = [...newExam.questions];
                        updatedQuestions[index].correct_answer = e.target.value;
                        setNewExam({ ...newExam, questions: updatedQuestions });
                      }}
                    >
                      <option value="">Select Correct Answer</option>
                      {q.options.map((opt, optIndex) => (
                        <option key={optIndex} value={opt}>
                          {opt || `Option ${optIndex + 1}`}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
                <div className="flex justify-end gap-2">
                  <button
                    onClick={addQuestion}
                    className="bg-teal-500 text-white px-3 py-2 rounded-md mt-2 mr-1"
                  >
                    Add Question
                  </button>
                  <button
                    onClick={resetModal}
                    className="bg-gray-300 text-black px-3 py-2 rounded-md mt-2 mr-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddExam}
                    className="bg-teal-500 text-white px-4 py-2 rounded-md mt-2 mr-1"
                  >
                    {isEditing ? "Update" : "Add"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add DeleteModal */}
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onConfirm={confirmDeleteExam}
          onCancel={cancelDeleteExam}
          message="Are you sure you want to delete this exam?"
        />
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default ExamsPage;