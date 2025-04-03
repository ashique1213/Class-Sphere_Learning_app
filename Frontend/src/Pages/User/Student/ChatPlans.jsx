import React from "react";
import Navbar from "../../../Components/Layouts/Navbar";
import Footer from "../../../Components/Layouts/Footer";
import { CheckCircle, Star } from "lucide-react";

const plans = [
  {
    title: "Free",
    price: "Free / 14 Days",
    features: [
      "Text chat only",
      "Private messaging with students",
      "Can create and moderate group discussions",
    ],
    buttonText: "Try for Free",
    buttonStyle: "border-2 border-teal-600 text-teal-600 hover:bg-teal-500 hover:text-white",
  },
  {
    title: "Teachers",
    price: "$24 / Month",
    features: [
      "Text chat only",
      "Private messaging with teachers",
      "Private messaging with students",
    ],
    buttonText: "Get Started",
    buttonStyle: "bg-teal-600 text-white hover:bg-teal-700",
    highlighted: true,
  },
  {
    title: "All Members",
    price: "$42 / Month",
    features: [
      "Text chat only",
      "Private messaging with teachers and students",
      "Can create private study groups",
    ],
    buttonText: "Choose Plan",
    buttonStyle: "border-2 border-teal-600 text-teal-600 hover:bg-teal-500 hover:text-white",
  },
];

const ChatPlans = () => {
  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-50">
        <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
          <div className="w-full max-w-5xl">
            {/* Heading */}
            <div className="text-center mb-10 relative">
              <h1 className="text-4xl md:text-4xl font-extrabold text-gray-900 relative inline-block">
                Chat <span className="text-teal-600">Plans</span>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-2 bg-teal-600 rounded-full opacity-30 blur-sm"></div>
              </h1>
              <p className="text-gray-600 mt-4 max-w-xl mx-auto text-lg font-medium">
                Unlock seamless communication with a plan tailored for you.
              </p>
            </div>

            {/* Plans Section */}
            <section>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan, index) => (
                  <div
                    key={index}
                    className={`relative bg-white p-6 rounded-2xl shadow-lg border border-teal-100 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl ${
                      plan.highlighted ? "border-teal-600 scale-105 bg-teal-50/30" : ""
                    }`}
                  >
                    {/* Highlighted Badge */}
                    {plan.highlighted && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-teal-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <Star className="w-4 h-4 fill-current" /> Popular
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.title}</h3>
                    <p className="text-3xl font-extrabold text-teal-600 mb-4">{plan.price}</p>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle className="text-teal-600 w-5 h-5" />
                          <span className="text-gray-700 text-sm font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <a
                      href="/payment"
                      className={`block text-center px-5 py-3 rounded-lg font-semibold text-sm shadow-md transition-all duration-300 transform hover:scale-105 ${plan.buttonStyle}`}
                    >
                      {plan.buttonText}
                    </a>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ChatPlans;