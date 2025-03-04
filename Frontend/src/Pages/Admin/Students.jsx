import React from "react";
import Sidebar from "../../Components/Sidebar";
import StudentsTable from "../../Components/StudentsTable";

const Students = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
        <Sidebar />
        <StudentsTable />
      </div>
    </>
  );
};

export default Students;
