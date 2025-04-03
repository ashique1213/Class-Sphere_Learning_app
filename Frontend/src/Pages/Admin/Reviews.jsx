import React from "react";
import Sidebar from "../../Components/Admin/Sidebar";
import ReviewsTable from "../../Components/Admin/ReviewsTable";

const Reviews = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar />
      <ReviewsTable />
    </div>
  );
};

export default Reviews;