import React from "react";
import { Link } from "react-router-dom";
import { Home, AlertCircle } from "lucide-react";

const NotFound: React.FC = () => {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center">
      <div className="relative mb-8">
       
        <div className=" inset-0 flex items-center justify-center">
          <AlertCircle size={80} className="text-blue-500 animate-pulse" />
        </div>
      </div>

      <h2 className="mb-4 text-3xl font-bold text-white">
        Oops! Page not found
      </h2>

      <p className="mb-8 max-w-md text-gray-400">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>

      <Link
        to="/"
        className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-all duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"
      >
        <span className="mr-2 transform transition-transform group-hover:-translate-x-1">
          <Home size={20} />
        </span>
        Return to Dashboard
        <span className="absolute inset-x-0 bottom-0 h-0.5 scale-x-0 bg-white transition-transform duration-300 group-hover:scale-x-100" />
      </Link>
    </div>
  );
};

export default NotFound;
