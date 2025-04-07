import React, { useState, useEffect } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { HiOutlineUsers } from "react-icons/hi";
import { IoWalletOutline } from "react-icons/io5";
import { logout } from "../../redux/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS,CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend} from "chart.js";
import { getDashboardStats } from "../../api/dashboardapi";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboardcontent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        setError("Failed to load dashboard data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/adminlogin");
  };

  const chartData = stats?.subscription_trend
    ? {
        labels: stats.subscription_trend.map((item) => item.day),
        datasets: [{
          label: "Subscriptions",
          data: stats.subscription_trend.map((item) => item.count),
          borderColor: "#0d9488",
          backgroundColor: "rgba(13, 148, 136, 0.1)",
          fill: true,
          tension: 0.4,
          borderWidth: 2,
        }],
      }
    : {};

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {position: "top"},
      tooltip: {backgroundColor: "rgba(0,0,0,0.7)"}
    },
    scales: {
      x: {grid: {display: false}},
      y: {beginAtZero: true}
    },
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-4 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 p-4 text-black">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 bg-white p-3 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold text-black">Dashboard</h2>
        <button
          onClick={handleLogout}
          className="flex items-center text-gray-600 hover:text-teal-600"
        >
          <FaSignOutAlt className="mr-1" />
          <span>Logout</span>
        </button>
      </div>

      {stats && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="flex items-center mb-2">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <HiOutlineUsers className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Students</p>
                  <p className="text-lg font-bold">{stats.users.students}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="flex items-center mb-2">
                <div className="bg-orange-100 p-2 rounded-lg mr-3">
                  <HiOutlineUsers className="text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Teachers</p>
                  <p className="text-lg font-bold">{stats.users.teachers}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="flex items-center mb-2">
                <div className="bg-green-100 p-2 rounded-lg mr-3">
                  <IoWalletOutline className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Revenue</p>
                  <p className="text-lg font-bold">₹{stats.transactions.revenue.toFixed(2)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="flex items-center mb-2">
                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                  <IoWalletOutline className="text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Active Subs</p>
                  <p className="text-lg font-bold">{stats.subscriptions.active}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts and Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            {/* Chart */}
            <div className="bg-white p-4 rounded-lg shadow-sm lg:col-span-2">
              <h3 className="text-sm font-medium mb-3">Subscription Trend</h3>
              <div className="h-64">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>
            
            {/* Plans Summary */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium mb-3">Plans Summary</h3>
              <div className="space-y-3">
                {stats.subscriptions.plans.map((plan, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium capitalize">{plan.name}</span>
                      <span>₹{plan.price}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Active: {plan.active_count}</span>
                      <span>Total: {plan.user_count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                      <div 
                        className="bg-teal-500 h-1.5 rounded-full" 
                        style={{ width: `${(plan.active_count / (plan.user_count || 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Revenue and Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Revenue by Plan */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium mb-3">Revenue by Plan</h3>
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="pb-2">Plan</th>
                    <th className="pb-2">Users</th>
                    <th className="pb-2 text-right">Revenue (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.transactions.revenue_by_plan.map((plan, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 capitalize">{plan.name}</td>
                      <td className="py-2">{stats.subscriptions.plans.find(p => p.name === plan.name)?.user_count || 0}</td>
                      <td className="py-2 text-right font-medium">{plan.total_earnings ? plan.total_earnings.toFixed(2) : "0.00"}</td>
                    </tr>
                  ))}
                  <tr className="font-medium">
                    <td className="py-2">Total</td>
                    <td className="py-2"></td>
                    <td className="py-2 text-right">{stats.transactions.revenue.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium mb-3">Recent Transactions</h3>
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="pb-2">User</th>
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.transactions.recent.slice(0, 5).map((txn, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 capitalize">{txn.user__username}</td>
                      <td className="py-2">{new Date(txn.created_at).toLocaleDateString()}</td>
                      <td className="py-2">₹{txn.amount}</td>
                      <td className="py-2">
                        <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                          txn.status === "succeeded" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {txn.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboardcontent;