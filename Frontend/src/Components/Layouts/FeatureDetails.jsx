import React from "react";
import Feature1 from "../../assets/Images/Feature1.png";
import Feature2 from "../../assets/Images/Feature2.png";
import Feature3 from "../../assets/Images/Feature3.png";
import Feature4 from "../../assets/Images/Feature4.png";
import Feature5 from "../../assets/Images/Feature5.png";
import Teacher from "../../assets/Images/Teacher.png";
import Student from "../../assets/Images/Student.png";

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
    <div className="bg-slate-50 py-16 md:py-24">
      <div className="text-center px-5 md:px-[25%] mb-16">
        {/* Title Section */}
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
          <span className="text-slate-800">What is </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-500">ClassSphere?</span>
        </h1>
        <p className="text-slate-600 mt-6 text-lg md:text-xl leading-relaxed">
          <b className="text-slate-800">ClassSphere</b> is a platform that allows educators to create
          online classes whereby they can store the course materials online;
          manage assignments, quizzes and exams; monitor due dates; grade
          results and provide students with feedback all in one seamless place.
        </p>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-stretch justify-center gap-8 px-6">
        {/* Instructor Card */}
        <div className="group relative w-full md:w-1/2 h-80 rounded-3xl overflow-hidden shadow-xl transform hover:-translate-y-2 transition-all duration-500 cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent z-10 opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
          <img
            src={Teacher}
            alt="Instructor"
            className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 z-20 p-8 flex flex-col items-center justify-end">
            <h2 className="text-white text-2xl font-bold tracking-wide mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              FOR INSTRUCTORS
            </h2>
            <button className="px-8 py-3 bg-white/20 backdrop-blur-md border border-white/50 text-white rounded-full font-semibold hover:bg-white hover:text-slate-900 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              I am Teacher
            </button>
          </div>
        </div>

        {/* Student Card */}
        <div className="group relative w-full md:w-1/2 h-80 rounded-3xl overflow-hidden shadow-xl transform hover:-translate-y-2 transition-all duration-500 cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-t from-teal-900 via-teal-900/40 to-transparent z-10 opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
          <img
            src={Student} 
            alt="Student"
            className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 z-20 p-8 flex flex-col items-center justify-end">
            <h2 className="text-white text-2xl font-bold tracking-wide mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              FOR STUDENTS
            </h2>
            <button className="px-8 py-3 bg-teal-500 text-white rounded-full font-semibold hover:bg-teal-400 hover:shadow-[0_0_20px_rgba(20,184,166,0.4)] transition-all duration-300">
              I am Student
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        {/* Title Section */}
        <div className="text-center mb-20">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            <span className="text-slate-800">Our </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-500">Features</span>
          </h1>
          <p className="text-slate-500 mt-4 text-lg md:text-xl">
            Extraordinary features that make learning activities more interactive.
          </p>
        </div>

        {/* Features List */}
        <div className="space-y-24">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={`flex flex-col ${
                feature.reverse ? "md:flex-row-reverse" : "md:flex-row"
              } items-center gap-12 lg:gap-20`}
            >
              {/* Image */}
              <div className="w-full md:w-1/2 flex justify-center relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-teal-200 to-blue-200 rounded-3xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
                <img
                  className="relative w-full max-w-lg rounded-2xl shadow-2xl shadow-slate-200 ring-1 ring-slate-900/5 transform group-hover:scale-[1.02] transition-transform duration-500"
                  src={feature.image}
                  alt="Feature"
                />
              </div>

              {/* Feature Description */}
              <div className="w-full md:w-1/2 text-center md:text-left">
                <h2 className="text-2xl md:text-4xl font-bold leading-tight">
                  {feature.title.split(" ").map((word, i) => (
                    <span
                      key={i}
                      className={i % 2 === 0 ? "text-teal-600" : "text-slate-800"}
                    >
                      {word}{" "}
                    </span>
                  ))}
                </h2>

                {/* Feature Points */}
                <div className="mt-8 space-y-6">
                  {feature.points.map((point, i) => (
                    <div key={i} className="flex items-start gap-5">
                      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-teal-50 rounded-full shadow-inner shadow-teal-100">
                        <svg className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <p className="leading-relaxed text-slate-600 text-lg mt-2">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureDetails;
