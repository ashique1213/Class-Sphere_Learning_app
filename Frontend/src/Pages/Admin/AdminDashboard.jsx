import React from "react";
import Sidebar from "../../Components/Sidebar";
import Dashboardcontent from "../../Components/Dashboardcontent";

const AdminDashboard = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar />
      <Dashboardcontent />
    </div>
  );
};

export default AdminDashboard;