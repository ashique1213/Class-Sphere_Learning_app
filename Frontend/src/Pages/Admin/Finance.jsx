import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../../Components/Admin/Sidebar";
import { FaDownload, FaSignOutAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchFinanceOverview } from "../../api/adminapi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import debounce from "lodash/debounce";

const Finance = () => {
  const [transactions, setTransactions] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [allSubscriptions, setAllSubscriptions] = useState([]); 
  const [totalBalance, setTotalBalance] = useState(0);
  const [mostSubscribedPlan, setMostSubscribedPlan] = useState("None");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortPeriod, setSortPeriod] = useState("day");
  const [loading, setLoading] = useState(true);
  const [currentTransactionPage, setCurrentTransactionPage] = useState(1);
  const [currentSubscriptionPage, setCurrentSubscriptionPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const authToken = useSelector((state) => state.auth.authToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/adminlogin");
  };

  const filterAndSortTransactions = useCallback((transactionsData) => {
    let filtered = [...transactionsData];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((trans) =>
        (trans.user?.toLowerCase().includes(query) || 
         trans.subscription_plan?.name?.toLowerCase().includes(query))
      );
    }

    if (startDate) {
      const start = new Date(startDate);
      filtered = filtered.filter((trans) => new Date(trans.created_at) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter((trans) => new Date(trans.created_at) <= end);
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      if (sortPeriod === "day") return dateA - dateB;
      if (sortPeriod === "week") {
        const weekA = Math.floor(dateA.getTime() / (1000 * 60 * 60 * 24 * 7));
        const weekB = Math.floor(dateB.getTime() / (1000 * 60 * 60 * 24 * 7));
        return weekA - weekB;
      }
      if (sortPeriod === "month") {
        const monthA = dateA.getMonth() + dateA.getFullYear() * 12;
        const monthB = dateB.getMonth() + dateB.getFullYear() * 12;
        return monthA - monthB;
      }
      return dateA - dateB;
    });

    return filtered;
  }, [searchQuery, startDate, endDate, sortPeriod]);

  const filterSubscriptions = useCallback((subscriptionsData) => {
    let filtered = [...subscriptionsData];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((sub) =>
        (sub.user?.toLowerCase().includes(query) || 
         sub.plan?.name?.toLowerCase().includes(query))
      );
    }

    if (startDate) {
      const start = new Date(startDate);
      filtered = filtered.filter((sub) => new Date(sub.start_date) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter((sub) => new Date(sub.end_date) <= end);
    }

    // Sort by start_date (you could add more sort options if needed)
    filtered.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

    return filtered;
  }, [searchQuery, startDate, endDate]);

  const fetchData = async () => {
    if (!authToken) {
      toast.warn("Please log in as admin.");
      navigate("/adminlogin");
      return;
    }

    try {
      setLoading(true);
      const data = await fetchFinanceOverview(authToken);
      setAllTransactions(data.transactions);
      setAllSubscriptions(data.current_subscriptions);
      const filteredTransactions = filterAndSortTransactions(data.transactions);
      const filteredSubscriptions = filterSubscriptions(data.current_subscriptions);
      setTransactions(filteredTransactions);
      setSubscriptions(filteredSubscriptions);
      setTotalBalance(data.total_balance);
      setMostSubscribedPlan(data.most_subscribed_plan);
    } catch (error) {
      console.error("Error fetching finance data:", error);
      toast.error("Failed to load finance data.");
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchQuery(value);
      setCurrentTransactionPage(1);
      setCurrentSubscriptionPage(1);
    }, 300),
    []
  );

  useEffect(() => {
    fetchData();
  }, [authToken]);

  useEffect(() => {
    if (allTransactions.length > 0) {
      const filteredTransactions = filterAndSortTransactions(allTransactions);
      setTransactions(filteredTransactions);
    }
    if (allSubscriptions.length > 0) {
      const filteredSubscriptions = filterSubscriptions(allSubscriptions);
      setSubscriptions(filteredSubscriptions);
    }
  }, [searchQuery, startDate, endDate, sortPeriod, allTransactions, allSubscriptions, filterAndSortTransactions, filterSubscriptions]);

  // Pagination for Transactions
  const indexOfLastTransaction = currentTransactionPage * itemsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - itemsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const totalTransactionPages = Math.ceil(transactions.length / itemsPerPage);

  // Pagination for Subscriptions
  const indexOfLastSubscription = currentSubscriptionPage * itemsPerPage;
  const indexOfFirstSubscription = indexOfLastSubscription - itemsPerPage;
  const currentSubscriptions = subscriptions.slice(indexOfFirstSubscription, indexOfLastSubscription);
  const totalSubscriptionPages = Math.ceil(subscriptions.length / itemsPerPage);

  const paginateTransactions = (pageNumber) => setCurrentTransactionPage(pageNumber);
  const paginateSubscriptions = (pageNumber) => setCurrentSubscriptionPage(pageNumber);

// ... (previous imports and code remain the same until download functions)

const downloadPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Add header
      doc.setFontSize(18);
      doc.setTextColor(0, 128, 128); // Teal color
      doc.text("Finance Overview - Transactions", 14, 20);
      
      // Add date and time
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);
  
      const columns = [
        { header: "User ID", dataKey: "userId" },
        { header: "User", dataKey: "user" },
        { header: "Plan", dataKey: "plan" },
        { header: "Amount", dataKey: "amount" },
        { header: "Transaction ID", dataKey: "transaction_id" },
        { header: "Date", dataKey: "date" },
        { header: "Status", dataKey: "status" },
      ];
  
      const body = transactions.map((trans) => ({
        userId: trans.id || "Unknown",
        user: trans.user || "Unknown",
        plan: trans.subscription_plan?.name || "N/A",
        amount: `${trans.amount} ${trans.currency}`,
        transaction_id: trans.transaction_id,
        date: new Date(trans.created_at).toLocaleDateString(),
        status: trans.status,
      }));
  
      autoTable(doc, {
        startY: 35,
        head: [columns.map((col) => col.header)],
        body: body.map((row) => columns.map((col) => row[col.dataKey])),
        styles: {
          fontSize: 10,
          cellPadding: 3,
          textColor: [40, 40, 40],
          overflow: 'linebreak',
        },
        headStyles: {
          fillColor: [0, 128, 128], 
          textColor: [255, 255, 255], 
          fontStyle: 'bold',
          halign: 'center',
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245], 
        },
        columnStyles: {
          0: { cellWidth: 25 }, 
          1: { cellWidth: 30 }, 
          2: { cellWidth: 25 },
          3: { cellWidth: 20 },
          4: { cellWidth: 40 }, 
          5: { cellWidth: 25 }, 
          6: { cellWidth: 25 }, 
        },
        didDrawPage: (data) => {
          // Footer
          doc.setFontSize(8);
          doc.setTextColor(100);
          doc.text(
            `Page ${data.pageNumber}`,
            data.settings.margin.left,
            doc.internal.pageSize.height - 10
          );
        },
      });
  
      doc.save("finance_transactions.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    }
  };
  
  const downloadExcel = () => {
    try {
      const worksheetData = transactions.map((trans) => ({
        "User ID": trans.id || "Unknown",
        User: trans.user || "Unknown",
        Plan: trans.subscription_plan?.name || "N/A",
        Amount: `${trans.amount} ${trans.currency}`,
        "Transaction ID": trans.transaction_id,
        Date: new Date(trans.created_at).toLocaleDateString(),
        Status: trans.status,
      }));
  
      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      
      // Define column widths (in characters)
      const wscols = [
        { wch: 15 }, 
        { wch: 20 }, 
        { wch: 15 }, 
        { wch: 15 }, 
        { wch: 25 },
        { wch: 15 },
        { wch: 15 }, 
      ];
      
      worksheet['!cols'] = wscols;
  
      // Add styling
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
  
      // Add header styling
      const range = XLSX.utils.decode_range(worksheet['!ref']);
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell = worksheet[XLSX.utils.encode_cell({ r: 0, c: C })];
        if (cell) {
          cell.s = {
            font: { bold: true },
            fill: { fgColor: { rgb: "008080" } }, // Teal background
            color: { rgb: "FFFFFF" }, // White text
            alignment: { horizontal: "center" },
          };
        }
      }
  
      XLSX.writeFile(workbook, "finance_transactions.xlsx");
    } catch (error) {
      console.error("Error generating Excel:", error);
      toast.error("Failed to generate Excel");
    }
  };
  

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-4 md:p-6 flex items-center justify-center">
          <p className="text-black text-sm md:text-base">Loading finance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-black">Finance</h2>
          <div className="flex items-center space-x-4">
            <FaSignOutAlt
              onClick={handleLogout}
              className="text-xl md:text-2xl text-black hover:text-gray-800 cursor-pointer"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-black">Total Balance</h3>
            <p className="text-2xl font-bold text-black">₹{totalBalance.toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-black">Most Subscribed Plan</h3>
            <p className="text-2xl font-bold text-black capitalize">{mostSubscribedPlan}</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-black mb-1">Search</label>
              <input
                type="text"
                onChange={(e) => debouncedSearch(e.target.value)}
                placeholder="Search user or plan..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-black mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-black mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-black mb-1">Sort By</label>
              <select
                value={sortPeriod}
                onChange={(e) => setSortPeriod(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
              </select>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={downloadPDF}
              className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 flex items-center gap-2 text-sm"
            >
              <FaDownload /> PDF
            </button>
            <button
              onClick={downloadExcel}
              className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 flex items-center gap-2 text-sm"
            >
              <FaDownload /> Excel
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6 overflow-x-auto capitalize">
          <h3 className="text-lg font-medium text-black mb-4">Transactions</h3>
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b text-left text-sm text-black">
                <th className="p-3">UserId</th>
                <th className="p-3">User</th>
                <th className="p-3">Plan</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Transaction ID</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.length > 0 ? (
                currentTransactions.map((trans) => (
                  <tr key={trans.id} className="border-b text-sm text-black">
                    <td className="p-3">{trans.id || "Unknown"}</td>
                    <td className="p-3">{trans.user || "Unknown"}</td>
                    <td className="p-3">{trans.subscription_plan?.name || "N/A"}</td>
                    <td className="p-3">{trans.amount} {trans.currency}</td>
                    <td className="p-3">{trans.transaction_id}</td>
                    <td className="p-3">{new Date(trans.created_at).toLocaleDateString()}</td>
                    <td className="p-3">
                      <span
                        className={`font-bold ${
                          trans.status === "succeeded" ? "text-teal-500" : "text-red-500"
                        }`}
                      >
                        {trans.status.charAt(0).toUpperCase() + trans.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-black">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {totalTransactionPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => paginateTransactions(currentTransactionPage - 1)}
                disabled={currentTransactionPage === 1}
                className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 disabled:bg-gray-300"
              >
                Previous
              </button>
              <span className="text-black">
                Page {currentTransactionPage} of {totalTransactionPages}
              </span>
              <button
                onClick={() => paginateTransactions(currentTransactionPage + 1)}
                disabled={currentTransactionPage === totalTransactionPages}
                className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 disabled:bg-gray-300"
              >
                Next
              </button>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto capitalize">
          <h3 className="text-lg font-medium text-black mb-4">Current Subscriptions</h3>
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b text-left text-sm text-black">
                <th className="p-3">UserId</th>
                <th className="p-3">Username</th>
                <th className="p-3">Plan</th>
                <th className="p-3">Start Date</th>
                <th className="p-3">End Date</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentSubscriptions.length > 0 ? (
                currentSubscriptions.map((sub) => (
                  <tr key={sub.id} className="border-b text-sm text-black">
                    <td className="p-3">{sub.id}</td>
                    <td className="p-3">{sub.user}</td>
                    <td className="p-3">{sub.plan?.name || "N/A"}</td>
                    <td className="p-3">{new Date(sub.start_date).toLocaleDateString()}</td>
                    <td className="p-3">{new Date(sub.end_date).toLocaleDateString()}</td>
                    <td className="p-3">
                      <span
                        className={`font-bold ${
                          sub.is_active ? "text-teal-500" : "text-red-500"
                        }`}
                      >
                        {sub.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-black">
                    No active subscriptions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {totalSubscriptionPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => paginateSubscriptions(currentSubscriptionPage - 1)}
                disabled={currentSubscriptionPage === 1}
                className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 disabled:bg-gray-300"
              >
                Previous
              </button>
              <span className="text-black">
                Page {currentSubscriptionPage} of {totalSubscriptionPages}
              </span>
              <button
                onClick={() => paginateSubscriptions(currentSubscriptionPage + 1)}
                disabled={currentSubscriptionPage === totalSubscriptionPages}
                className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 disabled:bg-gray-300"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Finance;