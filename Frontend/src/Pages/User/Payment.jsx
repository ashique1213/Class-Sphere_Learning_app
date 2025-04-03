import React, { useState } from "react";
import Navbar from "../../Components/Layouts/Navbar";
import Footer from "../../Components/Layouts/Footer";
import { CreditCard, Lock, CheckCircle } from "lucide-react";
import { FaPaypal, FaCcStripe } from "react-icons/fa";

const Payment = () => {
  const [selectedCard, setSelectedCard] = useState(null);

  const paymentMethods = [
    { id: "paypal", name: "PayPal", icon: <FaPaypal size={32} className="text-teal-600" /> },
    { id: "stripe", name: "Stripe", icon: <FaCcStripe size={32} className="text-teal-600" /> },
  ];

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-teal-50 to-white">
        <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-23">
          <div className="w-full max-w-5xl">
            {/* Heading */}
            <div className="text-center mb-6">
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">   
                Complete Your <span className="text-teal-600">Purchase</span>
              </h1>
              <p className="text-gray-600 text-sm flex items-center justify-center">
                <Lock className="mr-1 text-teal-600" size={14} /> Secure Payment
              </p>
            </div>

            {/* Payment Section */}
            <div className="grid md:grid-cols-3 gap-4">
              {/* Checkout Form */}
              <div className="md:col-span-2 bg-white rounded-xl shadow-md p-5 border border-teal-100 transition-all duration-300 hover:shadow-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <CreditCard className="mr-2 text-teal-600" size={18} /> Payment Details
                </h2>

                {/* Payment Method Selection */}
                <div className="mb-3">
                  <label className="block text-gray-700 font-medium text-xs mb-1">Payment Method</label>
                  <div className="flex space-x-2">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedCard(method.id)}
                        className={`p-2 rounded-lg border-2 flex items-center justify-center transition-all duration-300 w-16 h-12
                          ${
                            selectedCard === method.id
                              ? "border-teal-600 bg-teal-50 scale-105"
                              : "border-gray-200 hover:border-teal-300 hover:bg-teal-50/50"
                          }`}
                      >
                        {method.icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form Inputs */}
                <div className="space-y-2">
                  <div>
                    <label className="block text-gray-700 font-medium text-xs mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="Enter name"
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium text-xs mb-1">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-gray-700 font-medium text-xs mb-1">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium text-xs mb-1">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Confirm Button */}
                <button className="w-full mt-4 bg-teal-600 text-white py-2.5 rounded-lg font-medium shadow-md hover:bg-teal-700 hover:shadow-lg flex items-center justify-center transition-all duration-300">
                  <CheckCircle className="mr-1" size={14} /> Confirm Payment
                </button>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-xl shadow-md p-5 border border-teal-100 transition-all duration-300 hover:shadow-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Order Summary</h2>
                <div className="space-y-2 border-t border-teal-100 pt-2">
                  <div className="flex items-center mb-2">
                    <img
                      src="https://via.placeholder.com/36"
                      alt="Plan"
                      className="w-9 h-9 rounded-lg mr-2"
                    />
                    <div>
                      <p className="text-gray-900 font-medium text-xs">Teachers Plan</p>
                      <p className="text-gray-600 text-xs">Access for 1 month</p>
                      <p className="text-teal-600 font-bold text-xs">$24.99</p>
                    </div>
                  </div>
                  <hr className="border-teal-100" />
                  <div className="flex justify-between text-gray-700 text-xs">
                    <span>Subtotal</span>
                    <span className="font-medium">$24.99</span>
                  </div>
                  <div className="flex justify-between text-gray-700 text-xs">
                    <span>Discount</span>
                    <span className="font-medium">0%</span>
                  </div>
                  <div className="flex justify-between text-gray-700 text-xs">
                    <span>Tax</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  <div className="flex justify-between text-gray-900 font-bold text-sm border-t border-teal-100 pt-1">
                    <span>Total</span>
                    <span>$24.99</span>
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