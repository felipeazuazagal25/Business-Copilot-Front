import React from "react";

const LoadingMessage = ({ activeMenu }) => {
  return (
    <div
      className={`fixed flex ${
        activeMenu ? "w-[calc(100%-18rem)]" : "w-full"
      } justify-center`}
    >
      <div className="px-2 py-1 max-h-16 outline outline-1 bg-yellow-100 outline-yellow-500 font-bold drop-shadow-md">
        Cargando...
      </div>
    </div>
  );
};

export default LoadingMessage;
