import React from "react";
import { FaUsers } from "react-icons/fa";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import CreateClassForm from "../../Components/Createcalssfrom";

const Createclass = () => {
  const classes = [
    {
      id: 1,
      name: "Class 1",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Vestibulum ante ipsum primis in faucibus.",
    },
    {
      id: 2,
      name: "Class 2",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Vestibulum ante ipsum primis in faucibus.",
    },
    {
      id: 3,
      name: "Class 3",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Vestibulum ante ipsum primis in faucibus.",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:py-20 md:px-10 lg:px-40">
        {/* Breadcrumbs */}
        <div className="p-4 text-gray-600 text-sm max-w-6xl mx-auto">
          Home | My Account | <span className="font-bold">Kristin Watson</span>
        </div>

        {/* Header */}
        <div className="bg-white max-w-5xl mx-auto rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-teal-400 to-teal-600 p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white flex items-center justify-center text-teal-500 shadow-md">
              <FaUsers className="text-4xl sm:text-5xl" />
            </div>
            <div className="ml-4 mt-3 md:mt-0">
              <h2 className="text-xl sm:text-2xl font-semibold text-white">
                Class Rooms
              </h2>
              <p className="text-white text-sm sm:text-base opacity-90">
                Browse and join classes from different teachers
              </p>
            </div>
            <div className="ml-auto">
              <button className="bg-white text-teal-600 font-semibold px-4 py-2 rounded-md shadow-md hover:bg-gray-100 transition">
                Create Class
              </button>
            </div>
          </div>
        </div>

        {/* <CreateClassForm /> */}

        {/* Class Cards */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {classes.map((classItem) => (
            <div
              key={classItem.id}
              className="bg-white rounded-lg shadow-md p-6 text-center"
            >
              <div className="w-16 h-16 bg-teal-500 text-white flex items-center justify-center rounded-full mx-auto mb-4">
                <FaUsers className="text-3xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                {classItem.name}
              </h3>
              <p className="text-gray-600 mt-2">{classItem.description}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Createclass;
