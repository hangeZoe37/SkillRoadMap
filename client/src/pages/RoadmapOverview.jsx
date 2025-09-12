import React, { useEffect, useState, useRef } from "react";
import { createRoadmap } from "../api/roadmapAPI";
import Loader from "../components/Loader";
import { motion, AnimatePresence } from "framer-motion";

const RoadmapOverview = ({ topic, duration, level, score, breakdown }) => {
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState(null);
  const [activeDay, setActiveDay] = useState(null);
  const [expandedLevel, setExpandedLevel] = useState(null);
  const [error, setError] = useState(null);
  const [completedItems, setCompletedItems] = useState(new Set());

  const timelineRef = useRef(null);

  const levelColors = {
    1: {
      bg: "bg-gradient-to-r from-blue-100 to-indigo-100",
      accent: "bg-gradient-to-r from-blue-500 to-indigo-500",
      badge: "bg-blue-100 text-blue-700",
      border: "border-blue-200",
      text: "text-blue-800",
      progress: "from-blue-400 to-indigo-400",
    },
    2: {
      bg: "bg-gradient-to-r from-teal-100 to-green-100",
      accent: "bg-gradient-to-r from-teal-500 to-green-500",
      badge: "bg-teal-100 text-teal-700",
      border: "border-teal-200",
      text: "text-teal-800",
      progress: "from-teal-400 to-green-400",
    },
    3: {
      bg: "bg-gradient-to-r from-amber-100 to-orange-100",
      accent: "bg-gradient-to-r from-amber-500 to-orange-500",
      badge: "bg-amber-100 text-amber-700",
      border: "border-amber-200",
      text: "text-amber-800",
      progress: "from-amber-400 to-orange-400",
    },
  };

  // Toggle completion status for topics
  const toggleComplete = (dayNumber, levelNumber, topicIndex) => {
    const key = `${dayNumber}-${levelNumber}-${topicIndex}`;
    const newCompleted = new Set(completedItems);
    
    if (newCompleted.has(key)) {
      newCompleted.delete(key);
    } else {
      newCompleted.add(key);
    }
    
    setCompletedItems(newCompleted);
  };

  // fetch roadmap (safe pattern w/ try/catch)
  async function handleCreateRoadmap(topic, duration, level, score, breakdown) {
    setLoading(true);
    setError(null);
    try {
      const data = await createRoadmap(
        topic,
        duration,
        level,
        score,
        breakdown
      );
      setRoadmap(data || null);
      // Set the first day as active by default
      if (data?.days?.length > 0) {
        setActiveDay(data.days[0].dayNumber);
      }
    } catch (err) {
      console.error("Roadmap fetch error:", err);
      setError(err?.message || "Failed to generate roadmap");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (topic) handleCreateRoadmap(topic, duration, level, score, breakdown);
  }, [topic, duration, level, score, breakdown]);

  // Scroll active day into view in horizontal timeline
  useEffect(() => {
    if (activeDay && timelineRef.current) {
      const activeElement = timelineRef.current.querySelector(`[data-day="${activeDay}"]`);
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
        });
      }
    }
  }, [activeDay]);

  // Calculate progress percentage
  const calculateProgress = () => {
    if (!roadmap?.days) return 0;
    
    const totalItems = roadmap.days.reduce((total, day) => {
      return total + day.levels.reduce((levelTotal, level) => {
        return levelTotal + level.topics.length;
      }, 0);
    }, 0);
    
    return totalItems > 0 ? (completedItems.size / totalItems) * 100 : 0;
  };

  if (error) {
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-br from-blue-50/60 to-green-50/60 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl w-full mx-auto p-6 bg-white rounded-2xl shadow-lg border border-red-100 text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() =>
              handleCreateRoadmap(topic, duration, level, score, breakdown)
            }
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-19 pb-8 bg-gradient-to-br from-blue-50/60 to-green-50/60">
      <div className="max-w-7xl mx-auto px-4">
        {loading && <Loader message="Creating your personalized roadmap..." />}

        {!loading && roadmap && (
          <>
            {/* Compact header with progress */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/90 backdrop-blur-md rounded-xl p-4 flex items-center justify-between gap-4 border border-white shadow-md mb-4"
            >
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent truncate">
                  {roadmap.topic}
                </h1>
                <p className="text-xs text-gray-600 mt-0.5">Your personalized learning journey</p>
                
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <div className="px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700 flex items-center gap-1 border border-blue-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    {roadmap.duration} days
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs border ${
                    roadmap.level === "Beginner" 
                      ? "bg-green-50 text-green-700 border-green-200" 
                      : roadmap.level === "Intermediate"
                      ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                      : "bg-purple-50 text-purple-700 border-purple-200"
                  }`}>
                    {roadmap.level}
                  </div>
                  {score && (
                    <div className="px-2 py-1 rounded-full text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200">
                      Score: {score}
                    </div>
                  )}
                </div>
              </div>

              {/* Progress circle */}
              <div className="flex flex-col items-center">
                <div className="relative w-10 h-10">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#eee"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="2.5"
                      strokeDasharray={`${calculateProgress()}, 100`}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">
                    {Math.round(calculateProgress())}%
                  </span>
                </div>
                <span className="text-xs text-gray-500 mt-0.5">Complete</span>
              </div>
            </motion.div>

            {/* Compact Horizontal Timeline */}
            <div className="mb-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 border border-white shadow-md">
              <div className="relative">
                {/* Progress line with gradient */}
                <div className="absolute left-0 right-0 top-1/2 h-1 bg-gradient-to-r from-blue-200 via-green-200 to-blue-200 -translate-y-1/2 z-0 rounded-full"></div>
                
                <div 
                  ref={timelineRef}
                  className="flex overflow-x-auto pb-2 hide-scrollbar"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  <div className="flex p-2 space-x-2 mx-auto">
                    {roadmap.days?.map((day, index) => {
                      const isActive = activeDay === day.dayNumber;
                      const dayProgress = calculateDayProgress(day.dayNumber);
                      const isCompleted = dayProgress === 100;
                      
                      return (
                        <motion.button
                          key={day.dayNumber}
                          data-day={day.dayNumber}
                          whileHover={{ y: -2, scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => {
                            setActiveDay(day.dayNumber);
                            setExpandedLevel(null);
                          }}
                          className={`flex flex-col items-center justify-center relative z-10 min-w-[60px] p-2 rounded-lg transition-all duration-300 ${
                            isActive
                              ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md transform scale-105"
                              : isCompleted
                              ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200 shadow-sm"
                              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-xs"
                          }`}
                        >
                          {/* Connection line (except for last item) */}
                          {index < roadmap.days.length - 1 && (
                            <div className={`absolute -right-2 top-1/2 w-2 h-0.5 -translate-y-1/2 ${
                              isCompleted ? "bg-green-400" : "bg-gray-300"
                            }`}></div>
                          )}
                          
                          {/* Day number with improved styling */}
                          <div className={`text-sm font-bold ${isActive ? "text-white" : isCompleted ? "text-green-700" : "text-gray-800"}`}>
                            {day.dayNumber}
                          </div>
                          
                          <span className={`text-xs mt-0.5 ${isActive ? "text-blue-100" : isCompleted ? "text-green-600" : "text-gray-500"}`}>
                            Day {day.dayNumber}
                          </span>
                          
                          {/* Progress indicator */}
                          <div className="w-full h-1 bg-gray-200 rounded-full mt-1.5 overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                isCompleted 
                                  ? "bg-green-500" 
                                  : "bg-gradient-to-r from-blue-400 to-indigo-400"
                              }`}
                              style={{ width: `${dayProgress}%` }}
                            ></div>
                          </div>
                          
                          {/* Completion checkmark */}
                          {isCompleted && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center shadow-xs">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                          
                          {/* Time estimate */}
                          <div className={`text-xs mt-1 ${isActive ? "text-blue-100" : isCompleted ? "text-green-600" : "text-gray-500"} flex items-center`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {day.estimatedTime}m
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Details section without fixed height */}
            <section id="details" className="bg-white/90 backdrop-blur-sm rounded-xl border border-white shadow-md overflow-hidden">
              <AnimatePresence mode="wait">
                {activeDay === null ? (
                  <motion.div
                    key="welcome"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-4 min-h-[200px] flex items-center justify-center text-center"
                  >
                    <div>
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                      </div>
                      <h2 className="text-lg font-bold text-gray-800 mb-1">
                        Start your learning journey
                      </h2>
                      <p className="text-xs text-gray-600 max-w-md mx-auto">
                        Select a day from your personalized roadmap to explore levels, topics, and resources designed just for you.
                      </p>
                      <motion.div 
                        animate={{ y: [0, 4, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="mt-4 text-gray-400"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </motion.div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`day-${activeDay}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="p-3"
                  >
                    {roadmap.days
                      ?.filter((d) => d.dayNumber === activeDay)
                      .map((d) => (
                        <div key={d.dayNumber} className="space-y-3">
                          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white flex items-center justify-center font-bold shadow-sm text-xs">
                                {d.dayNumber}
                              </div>
                              <div>
                                <h3 className="text-base font-bold text-gray-800">
                                  Day {d.dayNumber}: {d.title || "Learning Day"}
                                </h3>
                                <div className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
                                  <span className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {d.estimatedTime} minutes
                                  </span>
                                  <span>•</span>
                                  <span className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    {d.levels.reduce((total, level) => total + level.topics.length, 0)} topics
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 w-full md:w-auto justify-end mt-2 md:mt-0">
                              <motion.button 
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="px-2.5 py-1 rounded-lg text-xs bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm hover:shadow-md transition-all flex items-center gap-1"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Start Day
                              </motion.button>
                              <motion.button 
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="px-2.5 py-1 rounded-lg text-xs bg-white border border-gray-200 hover:bg-gray-50 shadow-xs flex items-center gap-1"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Take Quiz
                              </motion.button>
                            </div>
                          </div>

                          {/* levels */}
                          <div className="space-y-2">
                            {d.levels.map((lvl) => {
                              const isOpen = expandedLevel === lvl.levelNumber;
                              const colors = levelColors[lvl.levelNumber] || levelColors[1];
                              const levelProgress = calculateLevelProgress(d.dayNumber, lvl.levelNumber);

                              return (
                                <motion.div
                                  key={lvl.levelNumber}
                                  layout
                                  className="rounded-lg border border-gray-200 overflow-hidden shadow-xs hover:shadow-sm transition-all"
                                >
                                  <motion.button
                                    layout
                                    onClick={() =>
                                      setExpandedLevel(
                                        isOpen ? null : lvl.levelNumber
                                      )
                                    }
                                    className={`w-full flex items-center justify-between p-2 text-left ${colors.bg} ${
                                      isOpen ? "rounded-t-lg" : "rounded-lg"
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <div
                                        className={`w-6 h-6 rounded-full ${colors.accent} text-white flex items-center justify-center text-xs font-bold shadow-inner`}
                                      >
                                        {lvl.levelNumber}
                                      </div>
                                      <div>
                                        <div className="text-xs font-semibold text-gray-800">
                                          Level {lvl.levelNumber} - {lvl.title || "Learning Objectives"}
                                        </div>
                                        <div className="text-xs text-gray-600">
                                          {lvl.topics.length} topics
                                          {lvl.description && ` • ${lvl.description}`}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                      {/* Progress bar */}
                                      <div className="flex items-center">
                                        <span className="text-xs text-gray-600 mr-1">{Math.round(levelProgress)}%</span>
                                        <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
                                          <div 
                                            className={`h-full bg-gradient-to-r ${colors.progress}`}
                                            style={{ width: `${levelProgress}%` }}
                                          ></div>
                                        </div>
                                      </div>
                                      
                                      <div className="text-xs font-medium text-gray-700">
                                        {isOpen ? (
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                                          </svg>
                                        ) : (
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                          </svg>
                                        )}
                                      </div>
                                    </div>
                                  </motion.button>

                                  {/* topics (collapsible) */}
                                  <AnimatePresence initial={false}>
                                    {isOpen && (
                                      <motion.div
                                        key="topics"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{
                                          duration: 0.3,
                                          ease: "easeInOut",
                                        }}
                                        className="p-2 bg-white border-t border-gray-100"
                                      >
                                        <motion.div
                                          className="space-y-2"
                                          initial="hidden"
                                          animate="show"
                                          exit="hidden"
                                          variants={{
                                            hidden: { opacity: 0 },
                                            show: {
                                              opacity: 1,
                                              transition: {
                                                staggerChildren: 0.1,
                                              },
                                            },
                                          }}
                                        >
                                          {lvl.topics.map(
                                            (topicItem, ti) => {
                                              const topicKey = `${d.dayNumber}-${lvl.levelNumber}-${ti}`;
                                              const isCompleted = completedItems.has(topicKey);
                                              
                                              return (
                                                <motion.article
                                                  key={ti}
                                                  variants={{
                                                    hidden: { opacity: 0, y: 8 },
                                                    show: { opacity: 1, y: 0 },
                                                  }}
                                                  className={`p-2 rounded-md border ${colors.border} bg-white hover:shadow-xs transition-all ${isCompleted ? 'opacity-75' : ''}`}
                                                >
                                                  <div className="flex items-start gap-2">
                                                    <button 
                                                      onClick={() => toggleComplete(d.dayNumber, lvl.levelNumber, ti)}
                                                      className={`flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 transition-all ${
                                                        isCompleted 
                                                          ? `${colors.accent} border-transparent text-white`
                                                          : `border-gray-300 hover:border-blue-400`
                                                      }`}
                                                    >
                                                      {isCompleted && (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                      )}
                                                    </button>
                                                    <div className="flex-1">
                                                      <h4 className={`font-semibold text-xs ${isCompleted ? "line-through text-gray-500" : "text-gray-800"}`}>
                                                        {topicItem.title}
                                                      </h4>
                                                      <p className="text-xs text-gray-600 mt-0.5">
                                                        {topicItem.description}
                                                      </p>

                                                      {/* resources */}
                                                      {topicItem.resources?.length > 0 && (
                                                        <div className="mt-1.5 space-y-1">
                                                          <div className="text-xs font-medium text-gray-500 flex items-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                            Resources:
                                                          </div>
                                                          {topicItem.resources.map(
                                                            (r, ri) => (
                                                              <a
                                                                key={ri}
                                                                href={r}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-start gap-1 group p-1 rounded-md hover:bg-blue-50 transition-colors"
                                                              >
                                                                <span className="mt-0.5 flex-shrink-0">
                                                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                                  </svg>
                                                                </span>
                                                                <span className="flex-1 break-words">
                                                                  {r.length > 60
                                                                    ? `${r.slice(0, 60)}...`
                                                                    : r}
                                                                </span>
                                                              </a>
                                                            )
                                                          )}
                                                        </div>
                                                      )}
                                                    </div>
                                                  </div>
                                                </motion.article>
                                              );
                                            }
                                          )}
                                        </motion.div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </motion.div>
                              );
                            })}
                          </div>

                          {/* nav buttons for day */}
                          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                            <motion.button
                              whileHover={{ x: -2 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                const prev = Math.max(1, d.dayNumber - 1);
                                setExpandedLevel(null);
                                setActiveDay(prev);
                              }}
                              disabled={d.dayNumber === 1}
                              className={`px-2.5 py-1 rounded-lg text-xs flex items-center gap-1 ${
                                d.dayNumber === 1
                                  ? "bg-gray-100 text-gray-400"
                                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-xs"
                              }`}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                              Previous
                            </motion.button>

                            <div className="text-xs text-gray-500">
                              Day {d.dayNumber} of {roadmap.days?.length}
                            </div>

                            <motion.button
                              whileHover={{ x: 2 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                const next = Math.min(
                                  roadmap.days?.length || duration,
                                  d.dayNumber + 1
                                );
                                setExpandedLevel(null);
                                setActiveDay(next);
                              }}
                              disabled={d.dayNumber === (roadmap.days?.length || duration)}
                              className={`px-2.5 py-1 rounded-lg text-xs flex items-center gap-1 ${
                                d.dayNumber === (roadmap.days?.length || duration)
                                  ? "bg-gray-100 text-gray-400"
                                  : "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm hover:shadow-md transition-all"
                              }`}
                            >
                              Next
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </motion.button>
                          </div>
                        </div>
                      ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </>
        )}
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );

  // Helper function to calculate progress for a specific day
  function calculateDayProgress(dayNumber) {
    if (!roadmap?.days) return 0;
    
    const day = roadmap.days.find(d => d.dayNumber === dayNumber);
    if (!day) return 0;
    
    let totalItems = 0;
    let completed = 0;
    
    day.levels.forEach(level => {
      level.topics.forEach((_, topicIndex) => {
        totalItems++;
        if (completedItems.has(`${dayNumber}-${level.levelNumber}-${topicIndex}`)) {
          completed++;
        }
      });
    });
    
    return totalItems > 0 ? (completed / totalItems) * 100 : 0;
  }
  
  // Helper function to calculate progress for a specific level
  function calculateLevelProgress(dayNumber, levelNumber) {
    if (!roadmap?.days) return 0;
    
    const day = roadmap.days.find(d => d.dayNumber === dayNumber);
    if (!day) return 0;
    
    const level = day.levels.find(l => l.levelNumber === levelNumber);
    if (!level) return 0;
    
    let totalItems = level.topics.length;
    let completed = 0;
    
    level.topics.forEach((_, topicIndex) => {
      if (completedItems.has(`${dayNumber}-${levelNumber}-${topicIndex}`)) {
        completed++;
      }
    });
    
    return totalItems > 0 ? (completed / totalItems) * 100 : 0;
  }
};

export default RoadmapOverview;