import React from "react";
import Sidebar from "../../Components/Admin/Sidebar"
import Dashboardcontent from "../../Components/Admin/DashboardContent";

const AdminDashboard = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar />
      <Dashboardcontent />
    </div>
  );
};

export default AdminDashboard;