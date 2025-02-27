import React from "react";
import Feature1 from "../assets/Images/Feature1.png";
import Feature2 from "../assets/Images/Feature2.png";
import Feature3 from "../assets/Images/Feature3.png";
import Feature4 from "../assets/Images/Feature4.png";
import Feature5 from "../assets/Images/Feature5.png";
import Teacher from "../assets/Images/Teacher.png";
import Student from "../assets/Images/Student.png";

const features = [
  {
    id: 1,
    title: "A user interface designed for the classroom",
    image: Feature1,
    points: [
      "Teachers don’t get lost in the grid view and have a dedicated Podium space.",
      "TA’s and presenters can be moved to the front of the class.",
      "Teachers can easily see all students and class data at one time.",
    ],
    reverse: false,
  },
  {
    id: 2,
    title: "Tools For Teachers And Learners",
    image: Feature2,
    points: [
      "Class has a dynamic set of teaching tools built to be deployed and used during class. Teachers can hand out assignments in real-time for students to complete and submit.",
    ],
    reverse: true,
  },
  {
    id: 3,
    title: "Assessments, Quizzes, Tests",
    image: Feature3,
    points: [
      "Easily launch live assignments, quizzes, and tests. Student results are automatically entered in the online gradebook.",
    ],
    reverse: false,
  },
  {
    id: 4,
    title: "Class Management Tools for Educators",
    image: Feature4,
    points: [
      "Class provides tools to help run and manage the class such as Class Roster, Attendance, and more. With the Gradebook, teachers can review and grade tests and quizzes in real-time.",
    ],
    reverse: true,
  },
  {
    id: 5,
    title: "One-on-One Discussions",
    image: Feature5,
    points: [
      "Teachers and teacher assistants can talk with students privately without leaving the Zoom environment.",
    ],
    reverse: false,
  },
];

const FeatureDetails = () => {
  return (
    <>
      <div className="text-center px-[25%] py-5">
        {/* Title Section */}
        <h1 className="text-xl md:text-3xl font-bold">
          <span className="text-blue-800">What is </span>
          <span className="text-teal-500">ClassSphere?</span>
        </h1>
        <p className="text-gray-700 mt-3 text-lg">
          <b>ClassSphere</b> is a platform that allows educators to create
          online classes whereby they can store the course materials online;
          manage assignments, quizzes and exams; monitor due dates; grade
          results and provide students with feedback all in one place.
        </p>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 p-6">
        {/* Instructor Card */}
        <div className="relative w-full md:w-[40%] h-64 rounded-xl overflow-hidden shadow-lg">
          <img
            src={Teacher}
            alt="Instructor"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0  bg-opacity-50 flex flex-col items-center justify-center">
            <h2 className="text-white text-lg md:text-xl font-bold">
              FOR INSTRUCTORS
            </h2>
            <button className="mt-4 px-6 py-2 border border-white text-white rounded-full hover:bg-white hover:text-black transition">
              I am Teacher
            </button>
          </div>
        </div>

        {/* Student Card */}
        <div className="relative w-full md:w-[40%] h-64 rounded-xl overflow-hidden shadow-lg">
          <img
            src={Student} // Replace with actual student image
            alt="Student"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-opacity-50 flex flex-col items-center justify-center">
            <h2 className="text-white text-lg md:text-xl font-bold">
              FOR STUDENTS
            </h2>
            <button className="mt-4 px-6 py-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition">
              I am Student
            </button>
          </div>
        </div>
      </div>

      <div className="text-center px-10 md:px-30 py-10">
        {/* Title Section */}
        <h1 className="text-xl md:text-3xl font-bold">
          <span className="text-blue-800">Our </span>
          <span className="text-teal-500">Features</span>
        </h1>
        <p className="text-gray-700 mt-3 text-lg">
          The extraordinary feature can make learning activities more
          interactive.
        </p>

        {/* Features List */}
        {features.map((feature, index) => (
          <div
            key={feature.id}
            className={`flex flex-col ${
              feature.reverse ? "md:flex-row-reverse" : "md:flex-row"
            } items-center gap-8 mt-12`}
          >
            {/* Image */}
            <div className="w-full md:w-1/2 flex justify-center">
              <img
                className="w-full max-w-md md:max-w-full rounded-lg shadow-lg"
                src={feature.image}
                alt="Feature"
              />
            </div>

            {/* Feature Description */}
            <div className="w-full md:w-1/2 text-center md:text-left">
              <h2 className="text-xl md:text-2xl font-bold leading-snug">
                {feature.title.split(" ").map((word, i) => (
                  <span
                    key={i}
                    className={i % 2 === 0 ? "text-teal-500" : "text-blue-800"}
                  >
                    {word}{" "}
                  </span>
                ))}
              </h2>

              {/* Feature Points */}
              <div className="mt-6 space-y-4">
                {feature.points.map((point, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <span className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full">
                      🎤
                    </span>
                    <p className="leading-relaxed text-gray-700">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default FeatureDetails;
