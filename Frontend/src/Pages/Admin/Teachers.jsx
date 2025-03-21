import React from "react";
import Sidebar from "../../Components/Admin/Sidebar"
import TeachersTable from "../../Components/Admin/TeachersTable";

const Teachers = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar />
      <TeachersTable />
    </div>
  );
};

export default Teachers;