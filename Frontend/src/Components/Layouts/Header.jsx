import React from "react";
import HeaderImage from "../../assets/Images/HeaderImage.png";

const Header = () => {
  return (
    <div className="relative w-full overflow-hidden flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-16 md:py-28 mt-[60px] md:mt-0 bg-gradient-to-br from-teal-600 via-emerald-500 to-cyan-500">
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

      {/* Content Section */}
      <div className="text-center md:text-left max-w-xl z-10 md:w-1/2 px-4 md:px-8">
        <div className="backdrop-blur-sm bg-white/10 p-8 rounded-3xl border border-white/20 shadow-2xl">
          <h1 className="text-white text-4xl md:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-md">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-amber-500">
              Studying
            </span>{" "}
            Online is now much easier
          </h1>
          <p className="text-teal-50 text-lg md:text-xl mt-5 font-medium drop-shadow-sm">
            ClassSphere is an interesting platform that will teach you in a more interactive and engaging way.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
            <button className="bg-white text-teal-700 px-8 py-3.5 rounded-full font-bold hover:bg-orange-500 hover:text-white transform hover:scale-105 transition-all duration-300 shadow-xl w-full sm:w-auto">
              Join for free
            </button>
            <button className="flex items-center justify-center gap-3 text-white border-2 border-white/80 px-8 py-3.5 rounded-full hover:bg-white/20 transform hover:scale-105 transition-all duration-300 shadow-xl w-full sm:w-auto backdrop-blur-md">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch how it works
            </button>
          </div>
        </div>
      </div>

      {/* Image Section */}
      <div className="relative w-full md:w-1/2 flex justify-center md:justify-end z-10 mt-12 md:mt-0">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-teal-400 to-cyan-300 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <img
            src={HeaderImage}
            alt="Studying Online"
            className="relative w-[90%] max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl h-auto object-cover transform hover:scale-[1.02] transition-transform duration-500 drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Bottom Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full h-16 md:h-24 bg-white rounded-t-[50%] scale-x-110 translate-y-1/2"></div>
    </div>
  );
};

export default Header;
