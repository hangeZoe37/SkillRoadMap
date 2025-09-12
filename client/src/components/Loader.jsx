import React, { useEffect, useState } from 'react';

const Loader = ({ message = "Loading your learning journey..." }) => {
  const [progress, setProgress] = useState(0);
  const [currentIcon, setCurrentIcon] = useState(0);
  
  const icons = ['🧠', '✨', '📚', '🎯'];
  const loadingSteps = [
    "Analyzing your preferences...",
    "Crafting personalized content...",
    "Building your roadmap...",
    "Finalizing experience..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 95) return p;
        return Math.min(p + Math.floor(Math.random() * 8) + 2, 95);
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const iconInterval = setInterval(() => {
      setCurrentIcon((current) => (current + 1) % icons.length);
    }, 2000); // Slower icon changes

    return () => clearInterval(iconInterval);
  }, []);

  const currentStep = Math.floor((progress / 100) * loadingSteps.length);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 px-6">
      
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-blue-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-indigo-200 rounded-full blur-3xl"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-md mx-auto">
        
        {/* Simple Icon Container */}
        <div className="mb-8">
          <div className="w-16 h-16 mx-auto bg-white border border-gray-200 rounded-2xl flex items-center justify-center shadow-sm">
            <span className="text-2xl transition-all duration-500 ease-in-out opacity-80">
              {icons[currentIcon]}
            </span>
          </div>
        </div>

        {/* Main Message */}
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          {message}
        </h2>
        
        {/* Step Message - More subtle */}
        <p className="text-sm text-gray-500 mb-10 transition-all duration-700 ease-in-out">
          {loadingSteps[currentStep] || loadingSteps[loadingSteps.length - 1]}
        </p>

        {/* Progress Container */}
        <div className="w-full max-w-xs mx-auto space-y-6">
          
          {/* Minimal Progress Bar */}
          <div className="relative">
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gray-700 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Simple Progress Text */}
          <div className="flex justify-center">
            <span className="text-sm text-gray-600 font-medium tabular-nums">
              {progress}%
            </span>
          </div>

          {/* Minimal Step Indicators */}
          <div className="flex justify-center space-x-3 pt-4">
            {loadingSteps.map((_, index) => (
              <div 
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                  index <= currentStep 
                    ? 'bg-gray-700' 
                    : 'bg-gray-300'
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;