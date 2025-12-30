import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-purple-600 rounded-full blur-[150px] opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[150px] opacity-30 animate-pulse"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text drop-shadow-lg">
            AudioML
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 font-light mb-10 max-w-2xl mx-auto leading-relaxed">
            Experience real-time audio classification powered by machine learning. Verify, analyze, and visualize sound with precision.
            </p>
        </div>

        <Link
          to="/tool"
          className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-blue-600 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-1"
        >
          <span>Explore Tool</span>
          <svg className="w-5 h-5 ml-2 -mr-1 transition-transform group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
        </Link>
      </div>

       {/* Footer / Credits */}
       <div className="absolute bottom-6 text-gray-500 text-sm z-10">
        <p>© 2024 VeloSonics. Powered by Teachable Machine.</p>
      </div>
    </div>
  );
};

export default Home;
