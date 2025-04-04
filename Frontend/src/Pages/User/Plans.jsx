import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Layouts/Navbar";
import Footer from "../../Components/Layouts/Footer";
import { CheckCircle, Star, XCircle } from "lucide-react";
import { getAllSubscriptionPlans } from "../../api/subscriptionapi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const authToken = useSelector((state) => state.auth.authToken);
  const navigate = useNavigate();

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await getAllSubscriptionPlans(authToken);
      const mappedPlans = response.map((plan) => ({
        id: plan.id,
        title: plan.name.charAt(0).toUpperCase() + plan.name.slice(1),
        price: plan.name === "free" ? "Free Forever" : `₹${plan.price} / ${plan.duration_days} Days`,
        features: [
          {
            text: "Private messaging with students & teachers",
            locked: plan.name === "free",
          },
          {
            text: plan.name === "free" ? "Limited to 1 classroom" : "Can join or create unlimited classrooms",
            locked: plan.name === "free",
          },
        ],
        buttonText: plan.name === "free" ? "Start for Free" : plan.name === "pro" ? "Upgrade to Pro" : "Go Premium",
        buttonStyle:
          plan.name === "free"
            ? "border-2 border-teal-600 text-teal-600 hover:bg-teal-500 hover:text-white"
            : plan.name === "pro"
            ? "bg-teal-600 text-white hover:bg-teal-700"
            : "border-2 border-teal-600 text-teal-600 hover:bg-teal-500 hover:text-white",
        highlighted: plan.name === "pro",
      }));
      setPlans(mappedPlans);
    } catch (error) {
      console.error("Error fetching plans:", error);
      toast.error("Failed to load plans. Please try again later.");
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelect = (planId) => {
    if (!authToken) {
      toast.warn("Please log in to subscribe to a plan.");
      navigate("/signup");
      return;
    }
    navigate("/payment", { state: { planId } });
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-50">
          <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
            <p className="text-gray-600 text-lg">Loading plans...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-50">
        <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="w-full max-w-6xl">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                Subscription <span className="text-teal-600">Plans</span>
              </h1>
              <p className="text-gray-600 mt-4 max-w-xl mx-auto text-lg font-medium">
                Unlock seamless communication with a plan tailored for you.
              </p>
            </div>
            <section>
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.length > 0 ? (
                  plans.map((plan, index) => (
                    <div
                      key={index}
                      className={`relative bg-white p-6 rounded-2xl shadow-lg border border-teal-100 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl ${
                        plan.highlighted ? "border-teal-600 scale-105 bg-teal-50/30" : ""
                      }`}
                    >
                      {plan.highlighted && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-teal-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                          <Star className="w-4 h-4 fill-current" /> Popular
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{plan.title}</h3>
                      <p className="text-3xl font-extrabold text-teal-600 mb-6">{plan.price}</p>
                      <ul className="space-y-3 mb-8">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2">
                            {feature.locked ? (
                              <XCircle className="text-red-500 w-5 h-5" />
                            ) : (
                              <CheckCircle className="text-teal-600 w-5 h-5" />
                            )}
                            <span
                              className={`text-sm font-medium ${
                                feature.locked ? "text-gray-500 line-through" : "text-gray-700"
                              }`}
                            >
                              {feature.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => handlePlanSelect(plan.id)}
                        className={`block w-full text-center px-6 py-3 rounded-lg font-semibold text-sm shadow-md transition-all duration-300 transform hover:scale-105 ${plan.buttonStyle}`}
                      >
                        {plan.buttonText}
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center text-gray-600">
                    No plans available at the moment.
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Plans;
