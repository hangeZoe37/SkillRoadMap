import React from "react";

const OutlineButton = ({
  children,
  onClick,
  from = "#3b82f6", // blue-600 hex
  to = "#10b981",   // green-500 hex
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative px-4 py-2 text-sm font-medium rounded-xl transition-all
        text-transparent bg-clip-text
        bg-gradient-to-r from-blue-600 to-green-500
        hover:scale-105
        ${className}
      `}
      style={{
        borderWidth: "2px",
        borderStyle: "solid",
        borderColor: "transparent", 
        borderImage: `linear-gradient(to right, ${from}, ${to}) 1`,

      }}
    >
      {children}
    </button>
  );
};

export default OutlineButton;
