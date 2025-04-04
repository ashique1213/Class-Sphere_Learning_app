import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../Components/Layouts/Navbar";
import Footer from "../../Components/Layouts/Footer";
import { CreditCard, Lock, CheckCircle } from "lucide-react";
import { FaCcStripe } from "react-icons/fa";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { createPaymentIntent, confirmPayment, getAllSubscriptionPlans } from "../../api/subscriptionapi";
import { MdOutlinePayment } from "react-icons/md";
import Swal from "sweetalert2";

const stripePromise = loadStripe(import.meta.env.VITE_APP_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ plan, authToken, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.auth.user);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await createPaymentIntent(authToken, plan.id);

      // Free plan: no client_secret, subscription activated directly
      if (!response.client_secret) {
        Swal.fire({
          icon: "success",
          title: "Free Plan Activated!",
          text: response.message || "Your free subscription has been activated.",
          confirmButtonColor: "#008080",
        }).then(() => {
          onSuccess();
        });
      } else {
        // Paid plan: proceed with Stripe payment
        if (!stripe || !elements) {
          throw new Error("Stripe not initialized.");
        }

        const { client_secret } = response;
        const result = await stripe.confirmCardPayment(client_secret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: { name: event.target.name.value },
          },
        });

        if (result.error) {
          Swal.fire({
            icon: "error",
            title: "Payment Failed",
            text: result.error.message,
            confirmButtonColor: "#d33",
          });
        } else if (result.paymentIntent.status === "succeeded") {
          await confirmPayment(authToken, result.paymentIntent.id, plan.id);
          Swal.fire({
            icon: "success",
            title: "Payment Successful!",
            text: "Your subscription has been activated.",
            confirmButtonColor: "#008080",
          }).then(() => {
            onSuccess();
          });
        }
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "An unknown error occurred.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {plan.price > 0 ? (
        <>
          <div>
            <label className="block text-gray-700 font-medium text-xs mb-1">Cardholder Name</label>
            <input
              type="text"
              name="name"
              value={user?.username.toUpperCase()}
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
              required
              readOnly
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium text-xs mb-1">Card Details</label>
            <CardElement
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
              options={{ hidePostalCode: true }}
            />
          </div>
        </>
      ) : (
        <p className="text-gray-600 text-sm">This is a free plan. Click below to activate it instantly.</p>
      )}
      <button
        type="submit"
        disabled={(!stripe && plan.price > 0) || loading}
        className="w-full mt-4 bg-teal-600 text-white py-2.5 rounded-lg font-medium shadow-md hover:bg-teal-700 hover:shadow-lg flex items-center justify-center transition-all duration-300 disabled:bg-gray-400"
      >
        {loading ? (
          "Processing..."
        ) : plan.price > 0 ? (
          <>
            <CheckCircle className="mr-1" size={14} /> Confirm Payment
          </>
        ) : (
          <>
            <CheckCircle className="mr-1" size={14} /> Activate Free Plan
          </>
        )}
      </button>
    </form>
  );
};

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const authToken = useSelector((state) => state.auth.authToken);
  const [plan, setPlan] = useState(null);

  console.log("Received state:", location.state);

  useEffect(() => {
    if (!authToken) {
      toast.warn("Please log in to proceed with payment.");
      navigate("/login");
      return;
    }
    if (!location.state?.planId) {
      toast.error("No plan selected.");
      navigate("/plans");
      return;
    }
    const fetchPlan = async () => {
      try {
        const plans = await getAllSubscriptionPlans(authToken);
        const selectedPlan = plans.find((p) => p.id === location.state.planId);
        if (!selectedPlan) {
          throw new Error("Selected plan not found.");
        }
        setPlan(selectedPlan);
      } catch (error) {
        toast.error("Failed to load plan details: " + (error.message || "Unknown error"));
        navigate("/plans");
      }
    };
    fetchPlan();
  }, [authToken, location.state, navigate]);

  const handleSuccess = () => {
    navigate("/profile");
  };

  if (!plan) {
    return <div className="text-center mt-10">Loading payment details...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-teal-50 to-white">
        <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="w-full max-w-5xl">
            <div className="text-center mb-6">
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
                Complete Your <span className="text-teal-600">Purchase</span>
              </h1>
              <p className="text-gray-600 text-sm flex items-center justify-center">
                <Lock className="mr-1 text-teal-600" size={14} /> Secure Payment
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2 bg-white rounded-xl shadow-md p-5 border border-teal-100 transition-all duration-300 hover:shadow-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <CreditCard className="mr-2 text-teal-600" size={18} />{" "}
                  {plan.price > 0 ? "Payment Details" : "Plan Activation"}
                </h2>
                {plan.price > 0 && (
                  <div className="mb-3 flex items-center">
                    <FaCcStripe size={32} className="text-teal-600 mr-2" />
                    <span className="text-gray-700 font-medium text-sm">Pay with Stripe</span>
                  </div>
                )}
                <Elements stripe={stripePromise}>
                  <CheckoutForm plan={plan} authToken={authToken} onSuccess={handleSuccess} />
                </Elements>
              </div>
              <div className="bg-white rounded-xl shadow-md p-5 border border-teal-100 transition-all duration-300 hover:shadow-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Order Summary</h2>
                <div className="space-y-2 border-t border-teal-100 pt-2">
                  <div className="flex items-center mb-2">
                    <MdOutlinePayment className="w-9 h-9 rounded-lg mr-2 text-black" />
                    <div>
                      <p className="text-gray-900 font-medium text-xs">
                        {plan.name.charAt(0).toUpperCase() + plan.name.slice(1)} Plan
                      </p>
                      <p className="text-gray-600 text-xs">Access for {plan.duration_days} days</p>
                      <p className="text-teal-600 font-bold text-xs">₹{plan.price}</p>
                    </div>
                  </div>
                  <hr className="border-teal-100" />
                  <div className="flex justify-between text-gray-700 text-xs">
                    <span>Subtotal</span>
                    <span className="font-medium">₹{plan.price}</span>
                  </div>
                  <div className="flex justify-between text-gray-700 text-xs">
                    <span>Discount</span>
                    <span className="font-medium">0%</span>
                  </div>
                  <div className="flex justify-between text-gray-700 text-xs">
                    <span>Tax</span>
                    <span className="font-medium">₹0.00</span>
                  </div>
                  <div className="flex justify-between text-gray-900 font-bold text-sm border-t border-teal-100 pt-1">
                    <span>Total</span>
                    <span>₹{plan.price}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Payment;