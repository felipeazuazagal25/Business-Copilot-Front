import React from "react";

const Button = ({
  children,
  onClick,
  color = "default",
  className,
  disabled = false,
}) => {
  return (
    <button
      disabled={disabled}
      className={`text-sm outline p-2 rounded-lg transition-all duration-150 ease-in-out ${
        color === "default"
          ? "text-[#4048F1] outline-[#4048F1] bg-indigo-50  hover:bg-[#4048F1] hover:text-white"
          : `text-${color}-500 outline-${color}-500 bg-${color}-50  hover:bg-${color}-500 hover:text-white`
      } ${className} ${
        disabled &&
        "bg-gray-100 text-gray-400 outline-gray-400 hover:text-gray-400"
      }`}
      onClick={onClick}
      style={{ cursor: disabled ? "not-allowed" : "pointer" }}
    >
      {children}
    </button>
  );
};

export default Button;
