import React from "react";
import { FaVideo, FaUsers } from "react-icons/fa";

const MeetingCard = ({ meet, user, joinMeeting, handleEndMeeting }) => {
  const isTeacher = user.role === "teacher";

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
              Created: {new Date(meet.created_at).toLocaleString()}
            </p>
            <p className="text-gray-600 text-xs sm:text-sm">
              Duration: {meet.duration} minutes
            </p>
            <p className="text-gray-600 text-xs sm:text-sm">
              Type: {meet.is_one_to_one ? "One-to-One" : "One-to-Many"}
            </p>
            <p className="text-gray-600 text-xs sm:text-sm">
              Host: {meet.host_details.username} ({meet.host_details.email})
            </p>
          </div>
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

          {isTeacher && meet.is_active && meet.host_details.email === user.email && (
            <button
              onClick={() => handleEndMeeting(meet.meeting_id)}
              className="px-3 sm:px-4 py-1 sm:py-2 rounded-md text-white bg-red-500 text-xs sm:text-sm w-full sm:w-auto"
            >
              End Meeting
            </button>
          )}
        </div>
      </div>

      {meet.participants.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <FaUsers /> Participants ({meet.participants.length})
          </h4>
          <ul className="mt-2 space-y-2">
            {meet.participants.map((participant) => (
              <li
                key={participant.user.id}
                className="text-xs sm:text-sm text-gray-600"
              >
                {participant.user.username} ({participant.user.email}) - Joined:{" "}
                {new Date(participant.joined_at).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MeetingCard;