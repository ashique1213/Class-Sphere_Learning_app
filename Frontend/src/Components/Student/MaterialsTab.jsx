import React from "react";
import { FaFilePdf, FaVideo, FaDownload, FaEye, FaCalendarAlt } from "react-icons/fa";

const MaterialsTab = ({ materials = [] }) => {
  if (!materials.length) {
    return <p className="text-gray-500 text-center text-sm">No materials available.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {materials.map((material) => (
        <div
          key={material.id}
          className="bg-white p-5 rounded-lg shadow-md border border-gray-200"
        >
          <div className="flex items-center gap-3">
            {material.type === "pdf" ? (
              <FaFilePdf className="text-red-400 text-4xl" />
            ) : (
              <FaVideo className="text-teal-300 text-4xl" />
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{material.name}</h3>
              <div className="flex items-center text-gray-500 text-sm mt-1">
                <FaCalendarAlt className="mr-1" />
                <span>{material.date}</span>
              </div>
            </div>
          </div>
          <p className="text-gray-600 text-sm mt-3">{material.description}</p>

          {material.type === "pdf" ? (
            <div className="mt-4 flex gap-3">
              <a
                href={material.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-teal-600 hover:text-teal-900 transition"
              >
                <FaEye /> View PDF
              </a>
              <a
                href={material.url}
                download
                className="flex items-center gap-2 text-teal-600 hover:text-teal-900 transition"
              >
                <FaDownload /> Download PDF
              </a>
            </div>
          ) : material.type === "video" ? (
            <a
              href={material.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center gap-2 text-red-600 hover:text-red-900 transition"
            >
              <FaEye /> Watch Video
            </a>
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default MaterialsTab;
