import React from "react";

const DurationSlider = ({ duration, setDuration }) => {
  return (
    <div className="max-w-md mx-auto text-center bg-white p-4 rounded-xl border shadow-sm">
      {/* Label + Value */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-700">Learning Duration</span>
        <span className="text-sm font-semibold text-blue-600">{duration} days</span>
      </div>

      {/* Slider */}
      <input
        type="range"
        min="1"
        max="60"
        value={duration}
        onChange={(e) => setDuration(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
      />

      {/* Range markers */}
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>1</span>
        <span>15</span>
        <span>30</span>
        <span>45</span>
        <span>60</span>
      </div>
    </div>
  );
};

export default DurationSlider;
