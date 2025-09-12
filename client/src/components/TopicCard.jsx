import React from "react";

const TopicCard = ({ title, desc, icon, selected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-lg border  p-3  transition-all cursor-pointer shadow-sm hover:shadow-md 
        ${selected 
          ? "border-blue-400 bg-blue-50 scale-105" 
          : "border-gray-200 hover:scale-105 bg-white"
        }`}
    >
      {/* Icon */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 flex items-center justify-center rounded-full bg-gradient-to-tr from-blue-100 to-green-100 text-lg">
          {icon}
        </div>
        <h4 className="text-sm font-semibold text-gray-800">{title}</h4>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-600 leading-snug">{desc}</p>
    </div>
  );
};

export default TopicCard;
