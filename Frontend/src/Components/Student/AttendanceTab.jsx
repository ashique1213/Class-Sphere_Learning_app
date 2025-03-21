import React from "react";
import { FaCalendarAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const AttendanceTab = ({ attendanceRecords = [] }) => {
  if (!attendanceRecords || attendanceRecords.length === 0) {
    return (
      <p className="text-center text-gray-500 text-sm sm:text-base">
        No attendance records available.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-teal-500 text-white text-left text-sm sm:text-base">
          <tr>
            <th className="p-3">Topic</th>
            <th className="p-3">Date</th>
            <th className="p-3">Joined Date</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {attendanceRecords.map((record, index) => (
            <tr
              key={index}
              className="border-b last:border-none text-sm sm:text-base text-gray-700 hover:bg-gray-100 transition"
            >
              <td className="p-3">{record.topic}</td>
              <td className="p-3 flex items-center gap-2">
                <FaCalendarAlt className="text-gray-500" /> {record.date}
              </td>
              <td className="p-3">
                {record.joinedDate ? (
                  <span className="text-teal-600 font-medium">
                    {record.joinedDate}
                  </span>
                ) : (
                  <span className="text-gray-400 italic">Absent</span>
                )}
              </td>
              <td className="p-3">
                {record.joinedDate ? (
                  <span className="text-teal-600 flex items-center gap-1">
                    <FaCheckCircle /> Present
                  </span>
                ) : (
                  <span className="text-red-500 flex items-center gap-1">
                    <FaTimesCircle /> Absent
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTab;
