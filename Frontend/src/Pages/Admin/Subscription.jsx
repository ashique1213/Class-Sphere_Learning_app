import React from "react";
import Sidebar from "../../Components/Admin/Sidebar";
import SubscriptionTable from "../../Components/Admin/Subscriptiontable";

const Subscription = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar />
      <SubscriptionTable />
    </div>
  );
};

export default Subscription;