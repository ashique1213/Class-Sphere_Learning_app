import React from "react";

const SubmissionTab = ({ submissions = [] }) => {
    console.log("Submissions in Tab:", submissions); // Debug
    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
                My Submissions
            </h3>
            {submissions.length === 0 ? (
                <p className="text-gray-500 text-sm sm:text-base">No submissions yet.</p>
            ) : (
                <ul className="space-y-3 sm:space-y-4">
                    {submissions.map((submission) => {
                        const studentName = submission.student_name || 
                            `${submission.student?.first_name || ""} ${submission.student?.last_name || ""}`.trim() ||
                            submission.student?.username || "Unknown";
                        const submissionType = submission.type === "exam" ? "Exam" : submission.type === "assignment" ? "Assignment" : "Unknown";
                        const submissionTopic = submission.topic || "Unknown Topic";
                        return (
                            <li
                                key={submission.id}
                                className="p-3 sm:p-4 bg-gray-100 rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0"
                            >
                                <div className="text-gray-700 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                    <span className="font-medium text-sm sm:text-base capitalize">
                                        {studentName}
                                    </span>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs sm:text-sm text-gray-500 capitalize">
                                        <span>
                                            {submissionType}: {submissionTopic} - Submitted on{" "}
                                            {new Date(submission.submitted_at).toLocaleString()}
                                        </span>
                                        {(submission.file || submission.file_url) && (
                                            <a
                                                href={submission.file?.url || submission.file_url || submission.file}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-teal-600 hover:underline whitespace-nowrap"
                                            >
                                                View File
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <span className="text-teal-600 font-medium text-sm sm:text-base shrink-0">
                                    Score: {submission.score !== null ? submission.score : "N/A"}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default SubmissionTab;