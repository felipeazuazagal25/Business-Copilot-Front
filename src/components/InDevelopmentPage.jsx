import React from "react";
import { FaHammer } from "react-icons/fa";

const InDevelopmentPage = () => {
  return (
    <div className="w-full min-h-24 text-gray-500 bg-gray-100 rounded-lg p-5 flex-column items-center justify-center">
      <div className="text-center">
        Esta página se encuentra en desarrollo...
      </div>
      <div className="flex justify-center mt-3">
        <FaHammer className="text-[#4048F1] h-10 w-10 p-2" />
      </div>
    </div>
  );
};

export default InDevelopmentPage;
