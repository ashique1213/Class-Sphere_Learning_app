import React from "react";
import Navbar from "../../Components/Layouts/Navbar";
import Footer from "../../Components/Layouts/Footer";
import Aboutimage from "../../assets/Images/Aboutimage.png";
import { Users, GraduationCap, Award, CheckCircle, Star, Quote } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";

const stats = [
  { Icon: Users, value: "15K+", label: "Students Enrolled" },
  { Icon: Users, value: "5K+", label: "Teachers Enrolled" },
  { Icon: Award, value: "75%", label: "Success Rate" },
  { Icon: GraduationCap, value: "5", label: "Years of Experience" },
];

const testimonials = [
  {
    name: "Michael Johnson",
    role: "School Administrator",
    quote: "ClassSphere has transformed our educational management, making complex tasks seamless and intuitive.",
    avatar: null,
  },
  {
    name: "Sarah Williams",
    role: "Lead Instructor",
    quote: "The platform's comprehensive features have significantly improved our online and offline learning experiences.",
    avatar: null,
  },
];

const About = () => {
  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-50">
        <div className="flex-grow px-4 pt-20 sm:px-6 lg:px-8 md:pt-30 ">
          {/* About Us Heading */}
          <div className="text-center mb-8 sm:mb-5 relative">
            <h1 className="text-3xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 relative inline-block">
              About <span className="text-teal-600">Us</span>
            </h1>
            <p className="text-gray-600 mt-3 max-w-xl mx-auto text-base sm:text-lg font-medium">
              Discover how ClassSphere is redefining education management with innovative solutions.
            </p>
          </div>

          {/* Hero Section */}
          <section className="max-w-6xl mx-auto py-8 sm:py-12 grid md:grid-cols-2 gap-8 sm:gap-10 items-center">
            <div className="relative flex justify-center">
              <img
                src={Aboutimage}
                alt="ClassSphere Platform"
                className="w-full max-w-[300px] sm:max-w-[400px] md:max-w-md rounded-2xl shadow-xl transition-all duration-500 hover:shadow-2xl hover:scale-102"
              />
              <div className="absolute -bottom-3 -left-3 bg-teal-400 h-16 sm:h-20 md:h-24 w-16 sm:w-20 md:w-24 rounded-full opacity-20 blur-2xl"></div>
            </div>
            <div className="space-y-4 sm:space-y-5">
              <div className="flex items-center gap-2 sm:gap-3">
                <CheckCircle className="text-teal-600 w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-teal-600 font-semibold text-base sm:text-lg">Innovative Education</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                Elevating Learning with <span className="text-teal-600">ClassSphere</span>
              </h2>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                ClassSphere is a cutting-edge, cloud-based platform that streamlines school management—integrating scheduling, attendance, payments, and virtual classrooms into one seamless experience.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <a
                  href="#"
                  className="bg-teal-600 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg font-medium shadow-md hover:bg-teal-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
                >
                  Learn More
                </a>
                <a
                  href="#"
                  className="border-2 border-teal-600 text-teal-600 px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg font-medium shadow-md hover:bg-teal-50 hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="max-w-6xl mx-auto py-8 sm:py-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-10 text-gray-900">Our Milestones</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white p-4 sm:p-5 rounded-xl shadow-md border border-teal-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex flex-col items-center">
                    <div className="mb-2 sm:mb-3 p-2 sm:p-3 bg-teal-50 rounded-full">
                      <stat.Icon className="text-teal-600 w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <h4 className="text-xl sm:text-2xl font-bold text-teal-600">{stat.value}</h4>
                    <p className="text-gray-600 text-xs sm:text-xs uppercase tracking-wide mt-1">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="max-w-6xl mx-auto py-8 sm:py-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-10 text-gray-900">Voices of Success</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white p-5 sm:p-6 rounded-xl shadow-md border border-teal-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-center mb-3 sm:mb-4">
                    {testimonial.avatar ? (
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-teal-200"
                      />
                    ) : (
                      <FaUserCircle className="w-10 h-10 sm:w-12 sm:h-12 text-teal-600" />
                    )}
                    <div className="ml-2 sm:ml-3">
                      <h4 className="font-bold text-sm sm:text-base text-gray-900">{testimonial.name}</h4>
                      <p className="text-xs text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Quote className="text-teal-500 w-4 h-4 sm:w-5 sm:h-5" />
                    <p className="text-gray-700 text-xs sm:text-sm leading-relaxed italic">{testimonial.quote}</p>
                  </div>
                  <div className="flex mt-2 sm:mt-3 text-teal-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;