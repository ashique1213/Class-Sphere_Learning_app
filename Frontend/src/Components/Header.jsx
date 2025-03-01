import React, { useEffect, useState } from "react";
import HeaderImage from "../assets/Images/HeaderImage.png";

const Header = () => {
  return (
<div className="relative w-full bg-teal-500 flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-10 md:py-20 mt-[60px] md:mt-0">
      <div className="text-center md:text-left max-w-lg z-10 md:w-1/2 px-6 md:px-12">
        <h1 className="text-white text-3xl md:text-5xl font-bold leading-snug">
        <span className="text-orange-400">Studying</span> Online is now much easier
      </h1>
      <p className="text-white mt-3">
        ClassSphere is an interesting platform that will teach you in a more interactive way.
      </p>
      <div className="flex flex-col md:flex-row items-center gap-4 mt-6">
        <button className="bg-white text-teal-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition w-full md:w-auto shadow-lg">
          Join for free
        </button>
        <button className="flex items-center gap-2 text-white border border-white px-6 py-3 rounded-full hover:bg-white hover:text-teal-600 transition w-full md:w-auto shadow-lg">
          ▶ Watch how it works
        </button>
      </div>
    </div>
    <div className="relative w-full md:w-1/2 flex justify-center md:justify-end">
      <img
        src={HeaderImage}
        alt="Studying Online"
        className="w-[90%] max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl h-auto object-cover"
      />
    </div>
    <div className="absolute bottom-0 left-0 w-full h-24 bg-white rounded-t-[50%]"></div>
  </div>
  );
};

export default Header;
