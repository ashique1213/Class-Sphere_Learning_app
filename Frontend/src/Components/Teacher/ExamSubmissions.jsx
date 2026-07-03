import React from "react";

const ExamSubmissions = ({ submissions, setShowSubmissions }) => {
  return (
    <div className="mt-6 bg-gray-100 p-4 mb-4 rounded-lg shadow-sm">
      <h3 className="text-md font-semibold text-gray-900 mb-4">
        📋 Student Submissions
      </h3>
      {submissions.length === 0 ? (
        <p className="text-gray-500">
          No students have submitted this exam yet.
        </p>
      ) : (
        <ul className="space-y-2">
          {submissions.map((submission, index) => {
            const studentName =
              `${submission.student.first_name || ""} ${
                submission.student.last_name || ""
              }`.trim() || submission.student.username;
            return (
              <li
                key={submission.id || index}
                className="p-2 bg-white rounded-md shadow-sm flex justify-between items-center"
              >
                <span className="text-gray-700 ml-5 capitalize font-bold">
                  {studentName}
                </span>
                <span>
                  Submitted on{" "}
                  {new Date(submission.submitted_at).toLocaleString()}
                </span>
                <span className="text-teal-600 pr-5 font-medium">
                  Score: {submission.score || "N/A"}
                </span>
              </li>
            );
          })}
        </ul>
      )}
      <div className="flex justify-end">
        <button
          onClick={() => setShowSubmissions(false)}
          className="mt-4 bg-gray-300 text-gray-800 px-5 py-1 rounded-lg hover:bg-gray-400 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default React.memo(ExamSubmissions);
