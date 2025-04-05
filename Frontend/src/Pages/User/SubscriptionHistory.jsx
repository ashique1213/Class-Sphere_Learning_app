import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Layouts/Navbar";
import Footer from "../../Components/Layouts/Footer";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getSubscriptionHistory,
  getTransactionHistory,
} from "../../api/subscriptionapi";
import { CheckCircle, XCircle } from "lucide-react";
import { FaSpinner } from "react-icons/fa";

const itemsPerPage = 3;

const Pagination = ({ currentPage, totalItems, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-4 space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        Prev
      </button>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i + 1)}
          className={`px-3 py-1 rounded ${
            currentPage === i + 1 ? "bg-teal-600 text-white" : "bg-gray-100"
          }`}
        >
          {i + 1}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

const SubscriptionHistory = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subPage, setSubPage] = useState(1);
  const [transPage, setTransPage] = useState(1);

  const authToken = useSelector((state) => state.auth.authToken);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      if (!authToken) {
        toast.warn("Please log in to view your subscription history.");
        navigate("/signup");
        return;
      }

      try {
        const subData = await getSubscriptionHistory(authToken);
        const transData = await getTransactionHistory(authToken);
        setSubscriptions(subData);
        setTransactions(transData);
      } catch (error) {
        toast.error("Failed to load history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [authToken, navigate]);

  const paginate = (data, page) => {
    const start = (page - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  };

  const paginatedSubscriptions = paginate(subscriptions, subPage);
  const paginatedTransactions = paginate(transactions, transPage);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <FaSpinner className="animate-spin text-teal-500 text-4xl" />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 px-4 pt-20 pb-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-sm text-black max-w-full sm:max-w-5xl mx-auto py-4 capitalize">
            Home |{" "}
            <Link to="/profile" className="hover:underline">
              My Account
            </Link>{" "}
            |{" "}
            <Link to="/profile" className="hover:underline">
              {user?.username}
            </Link>{" "}
            | <span className="font-bold">Subscription History</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3 text-center">
            Your Subscription & Transaction History
          </h1>

          {/* Subscriptions */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Subscriptions
            </h2>
            {subscriptions.length ? (
              <>
                <div className="overflow-x-auto bg-white rounded-2xl shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-teal-600 text-white">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold">
                          Plan
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">
                          Start
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">
                          End
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {paginatedSubscriptions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium">
                            {sub.plan.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(sub.start_date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(sub.end_date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                                sub.is_active
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {sub.is_active ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                <XCircle className="w-4 h-4" />
                              )}
                              {sub.is_active ? "Active" : "Inactive"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination
                  currentPage={subPage}
                  totalItems={subscriptions.length}
                  onPageChange={setSubPage}
                />
              </>
            ) : (
              <p className="text-center text-gray-500 mt-6">
                No subscriptions found.
              </p>
            )}
          </div>

          {/* Transactions */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Transactions
            </h2>
            {transactions.length ? (
              <>
                <div className="overflow-x-auto bg-white rounded-2xl shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-teal-600 text-white">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold">
                          Plan
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">
                          Transaction ID
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {paginatedTransactions.map((trans) => (
                        <tr key={trans.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium">
                            {trans.subscription_plan.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {trans.amount} {trans.currency}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {trans.transaction_id}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(trans.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                                trans.status === "succeeded"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {trans.status === "succeeded" ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                <XCircle className="w-4 h-4" />
                              )}
                              {trans.status.charAt(0).toUpperCase() +
                                trans.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination
                  currentPage={transPage}
                  totalItems={transactions.length}
                  onPageChange={setTransPage}
                />
              </>
            ) : (
              <p className="text-center text-gray-500 mt-6">
                No transactions found.
              </p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SubscriptionHistory;
