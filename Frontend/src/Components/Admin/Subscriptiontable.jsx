import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaSignOutAlt, FaPlus } from "react-icons/fa";
import { logout } from "../../redux/authSlice";
import { toast } from "react-toastify"; // Import toast
import {
  getAllSubscriptionPlans,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  toggleActiveSubscriptionPlan,
} from "../../api/subscriptionapi";
import ConfirmationModal from "../Layouts/ConfirmationModal";

const SubscriptionTable = () => {
  const [plans, setPlans] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editId, setEditId] = useState(null);
  const [toggleId, setToggleId] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const plansPerPage = 7;
  const activePlan = toggleId ? plans.find((p) => p.id === toggleId) : null;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authToken = useSelector((state) => state.auth.authToken);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await getAllSubscriptionPlans();
      setPlans(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error fetching plans:", error);
      setPlans([]);
      toast.error("Failed to fetch plans: " + error.message); // Toast for fetch error
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/adminlogin");
  };

  const handleCreatePlan = async (data) => {
    try {
      await createSubscriptionPlan(data);
      await fetchPlans();
      setCreateModalOpen(false);
      toast.success("Plan created successfully!");
    } catch (error) {
      toast.error(error.error || "Failed to create plan");
    }
  };

  const handleUpdatePlan = async (id, data) => {
    try {
      await updateSubscriptionPlan(id, data);
      await fetchPlans();
      setEditId(null);
      toast.success("Plan updated successfully!"); // Success toast
    } catch (error) {
      toast.error("Failed to update plan: " + error.error); // Error toast
    }
  };

  const handleToggleActive = async () => {
    try {
      await toggleActiveSubscriptionPlan(toggleId);
      await fetchPlans();
      setToggleId(null);
      toast.success(
        plans.find((p) => p.id === toggleId).is_active
          ? "Plan deactivated successfully!"
          : "Plan activated successfully!"
      ); // Dynamic success toast
    } catch (error) {
      toast.error("Failed to toggle plan status: " + error); // Error toast
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchPlans();
    } else {
      navigate("/adminlogin");
    }
  }, [authToken]);

  const filteredPlans =
    loading || !Array.isArray(plans)
      ? []
      : plans.filter((plan) =>
          plan.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

  const indexOfLastPlan = currentPage * plansPerPage;
  const indexOfFirstPlan = indexOfLastPlan - plansPerPage;
  const currentPlans = filteredPlans.slice(indexOfFirstPlan, indexOfLastPlan);
  const totalPages = Math.ceil(filteredPlans.length / plansPerPage);

  if (loading) {
    return <div className="p-4 text-center">Loading plans...</div>;
  }

  return (
    <div className="flex-1 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-xl sm:text-2xl font-semibold">
          Subscription Plans
        </h2>
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="Search by name..."
              className="border px-3 py-2 rounded-md pr-10 w-full text-sm sm:text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black text-sm sm:text-base" />
          </div>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="bg-teal-500 text-white px-3 py-2 rounded-md flex items-center gap-2 hover:bg-teal-600 text-sm sm:text-base"
          >
            <FaPlus /> Create Plan
          </button>
          <FaSignOutAlt
            onClick={handleLogout}
            className="text-lg sm:text-xl cursor-pointer flex-shrink-0"
          />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b text-left text-xs sm:text-sm">
              <th className="p-2">ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Price</th>
              <th className="p-2">Duration (Days)</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPlans.length > 0 ? (
              currentPlans.map((plan) => (
                <tr key={plan.id} className="border-b text-xs sm:text-sm">
                  <td className="p-2">{plan.id}</td>
                  <td className="p-2 capitalize">{plan.name}</td>
                  <td className="p-2">₹{plan.price}</td>
                  <td className="p-2">{plan.duration_days}</td>
                  <td className="p-2">
                    <span
                      className={`py-1 rounded text-xs sm:text-sm font-bold ${
                        plan.is_active ? "text-teal-500" : "text-red-500"
                      }`}
                    >
                      {plan.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => setEditId(plan.id)}
                      className="bg-yellow-500 text-white px-2 sm:px-3 py-1 rounded hover:bg-yellow-600 text-xs sm:text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setToggleId(plan.id)}
                      className={`${
                        plan.is_active ? "bg-red-400" : "bg-teal-400"
                      } text-white px-2 sm:px-3 py-1 rounded hover:bg-opacity-80 text-xs sm:text-sm`}
                    >
                      {plan.is_active ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="p-4 text-center text-sm sm:text-base"
                >
                  No plans found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4 space-x-2 flex-wrap gap-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm ${
              currentPage === index + 1
                ? "bg-teal-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {createModalOpen && (
        <CreateModal
          onSave={handleCreatePlan}
          onClose={() => setCreateModalOpen(false)}
        />
      )}

      {editId && (
        <EditModal
          plan={plans.find((p) => p.id === editId)}
          onSave={handleUpdatePlan}
          onClose={() => setEditId(null)}
        />
      )}

      {toggleId && (
        <ConfirmationModal
          isOpen={!!toggleId}
          onClose={() => setToggleId(null)}
          onConfirm={handleToggleActive}
          title={`Confirm ${
            activePlan?.is_active ? "Deactivation" : "Activation"
          }`}
          message={`Are you sure you want to ${
            activePlan?.is_active ? "deactivate" : "activate"
          } this plan?`}
          confirmText="Confirm"
          cancelText="Cancel"
        />
      )}
    </div>
  );
};

const CreateModal = ({ onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: "free",
    price: "0", // Default price to 0 for "Free"
    duration_days: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      let updatedData = { ...prevData, [name]: value };

      // If "Free" is selected, set price to 0
      if (name === "name" && value === "free") {
        updatedData.price = "0";
      }

      return updatedData;
    });
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-opacity-50">
      <div className="bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg w-11/12 sm:w-130">
        <h3 className="text-base sm:text-lg font-semibold mb-4">
          Create New Plan
        </h3>
        <div className="space-y-4">
          <select
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md text-sm sm:text-base"
          >
            <option value="free">Free</option>
            <option value="pro">Pro</option>
            <option value="premium">Premium</option>
          </select>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full border px-3 py-2 rounded-md text-sm sm:text-base"
            min="0"
            step="0.01"
            disabled={formData.name === "free"} // Disable input for "Free" plan
          />
          <input
            type="number"
            name="duration_days"
            value={formData.duration_days}
            onChange={handleChange}
            placeholder="Duration (Days)"
            className="w-full border px-3 py-2 rounded-md text-sm sm:text-base"
            min="1"
          />
        </div>
        <div className="flex justify-center gap-2 sm:gap-4 mt-4">
          <button
            onClick={handleSubmit}
            className="bg-teal-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-md hover:bg-teal-600 text-sm sm:text-base"
          >
            Create
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 px-3 sm:px-4 py-1 sm:py-2 rounded-md hover:bg-gray-400 text-sm sm:text-base"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const EditModal = ({ plan, onSave, onClose }) => {
    const [formData, setFormData] = useState({
      name: plan.name,
      price: plan.name === "free" ? "0" : plan.price, // Ensure price is 0 for "Free"
      duration_days: plan.duration_days,
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
  
      setFormData((prevData) => {
        let updatedData = { ...prevData, [name]: value };
  
        // If "Free" is selected, set price to 0 and disable editing
        if (name === "name" && value === "free") {
          updatedData.price = "0";
        }
  
        return updatedData;
      });
    };
  
    const handleSubmit = () => {
      onSave(plan.id, formData);
    };
  
    return (
      <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-opacity-50">
        <div className="bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg w-11/12 sm:w-130">
          <h3 className="text-base sm:text-lg font-semibold mb-4">Edit Plan</h3>
          <div className="space-y-4">
            <select
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md text-sm sm:text-base"
            >
              <option value="free">Free</option>
              <option value="pro">Pro</option>
              <option value="premium">Premium</option>
            </select>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              className="w-full border px-3 py-2 rounded-md text-sm sm:text-base"
              min="0"
              step="0.01"
              disabled={formData.name === "free"} // Disable price input for "Free" plan
            />
            <input
              type="number"
              name="duration_days"
              value={formData.duration_days}
              onChange={handleChange}
              placeholder="Duration (Days)"
              className="w-full border px-3 py-2 rounded-md text-sm sm:text-base"
              min="1"
            />
          </div>
          <div className="flex justify-center gap-2 sm:gap-4 mt-4">
            <button
              onClick={handleSubmit}
              className="bg-teal-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-md hover:bg-teal-600 text-sm sm:text-base"
            >
              Save
            </button>
            <button
              onClick={onClose}
              className="bg-gray-300 px-3 sm:px-4 py-1 sm:py-2 rounded-md hover:bg-gray-400 text-sm sm:text-base"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };
  

export default SubscriptionTable;
