import React, { useState } from "react";

const CreateClassForm = ({ onClose }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto mt-5">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Create Classroom</h2>
      <form>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-gray-600">Classroom Name</label>
            <input type="text" className="w-full border rounded-md p-2 mt-1" />
          </div>
          <div>
            <label className="text-gray-600">Category/Subject</label>
            <input type="text" className="w-full border rounded-md p-2 mt-1" />
          </div>
          <div>
            <label className="text-gray-600">Classroom Code</label>
            <input type="text" className="w-full border rounded-md p-2 mt-1" />
          </div>
          <div>
            <label className="text-gray-600">Max Participants</label>
            <input type="number" className="w-full border rounded-md p-2 mt-1" />
          </div>
          <div>
            <label className="text-gray-600">Start Date & Time</label>
            <input type="datetime-local" className="w-full border rounded-md p-2 mt-1" />
          </div>
          <div>
            <label className="text-gray-600">End Date & Time</label>
            <input type="datetime-local" className="w-full border rounded-md p-2 mt-1" />
          </div>
        </div>
        <div className="mt-4">
          <label className="text-gray-600">Description</label>
          <textarea className="w-full border rounded-md p-2 mt-1" rows="4"></textarea>
        </div>
        <div className="mt-4 flex justify-end gap-4">
          <button type="button" onClick={onClose} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md">
            Cancel
          </button>
          <button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md">
            Save Now
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateClassForm;