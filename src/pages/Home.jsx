import React from 'react';
import { Link } from 'react-router-dom';
import Plasma from '../components/Plasma';

const Home = () => {
  return (
    <div className="h-full flex-grow bg-gray-900 text-white flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Plasma Background */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
          <Plasma 
            color="#ff6b35"
            speed={0.6}
            direction="forward"
            scale={1.1}
            opacity={0.8}
            mouseInteractive={true}
          />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto pointer-events-none">
        <div className="mb-8 pointer-events-auto">
            <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text drop-shadow-lg">
            AudioML
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 font-light mb-10 max-w-2xl mx-auto leading-relaxed shadow-black drop-shadow-md">
            Experience real-time audio classification powered by machine learning. Verify, analyze, and visualize sound with precision.
            </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pointer-events-auto">
            <Link
            to="/tool"
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-blue-600 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-1 w-full sm:w-auto"
            >
            <span>Explore Tool</span>
            <svg className="w-5 h-5 ml-2 -mr-1 transition-transform group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            </Link>

            <Link
            to="/docs"
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-800/80 backdrop-blur-sm border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 hover:bg-gray-700 hover:border-gray-500 hover:shadow-lg hover:-translate-y-1 w-full sm:w-auto"
            >
            <span>Documentation</span>
            </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
