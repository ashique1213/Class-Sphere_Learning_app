import React from "react";
import { FaVideo, FaUsers } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const MeetingCard = ({ meet, user, joinMeeting, slug, handleEndMeeting }) => {
  const isTeacher = user.role === "teacher";
  const email = useSelector((state) => state.auth.email);

  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/meetings/details/${meet.meeting_id}`, { state: { meet, slug } });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <FaVideo className="text-teal-500 text-xl sm:text-2xl flex-shrink-0" />
          <div>
            <span className="text-gray-800 font-medium text-sm sm:text-base">
              Topic: {meet.title}
            </span>
            <p className="text-gray-600 text-xs sm:text-sm">
              {new Date(meet.created_at).toLocaleDateString()}{" "}
              {new Date(meet.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true, // Ensures AM/PM format
              })}
            </p>
          </div>
          {meet.participants.length > 0 && (
            <div className="mt-1">
              {user?.role === "student" && (
                <tbody className="divide-y">
                  {meet.participants
                    .filter(
                      (participant) => participant.user.email === user.email
                    )
                    .map((participant) => (
                      <tr
                        key={participant.user.id}
                        className="hover:bg-gray-50"
                      >
                        <td className="text-sm">
                          Joined Date:{" "}
                          {new Date(participant.joined_at).toLocaleDateString()}{" "}
                          {new Date(participant.joined_at).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true, // Ensures AM/PM format
                            }
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              )}

              <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaUsers /> Participants ({meet.participants.length})
              </h4>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={() => joinMeeting(meet.meeting_id)}
            className={`px-3 sm:px-4 py-1 sm:py-2 rounded-md text-white text-xs sm:text-sm w-full sm:w-auto ${
              meet.is_active ? "bg-teal-500" : "bg-gray-500"
            }`}
            disabled={!meet.is_active}
          >
            {meet.is_active ? "Join Meeting" : "Meeting Ended"}
          </button>

          {isTeacher &&
            meet.is_active &&
            meet.host_details.email === user.email && (
              <button
                onClick={() => handleEndMeeting(meet.meeting_id)}
                className="px-3 sm:px-4 py-1 sm:py-2 rounded-md text-white bg-red-500 text-xs sm:text-sm w-full sm:w-auto"
              >
                End Meeting
              </button>
            )}
          {isTeacher && (
            <button
              onClick={handleViewDetails}
              className="px-3 sm:px-4 py-1 sm:py-2 rounded-md text-white bg-teal-900 text-xs sm:text-sm w-full sm:w-auto"
            >
              View Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeetingCard;
