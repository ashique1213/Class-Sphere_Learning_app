import React from "react";

const DeleteModal = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center w-11/12 sm:w-96">
        <h3 className="text-lg font-semibold text-gray-800">Confirm Deletion</h3>
        <p className="text-gray-600 my-4">{message || "Are you sure you want to delete this?"}</p>
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
