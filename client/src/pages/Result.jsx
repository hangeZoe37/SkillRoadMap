import React from "react";
import { useNavigate } from "react-router-dom";
import Marks from "../components/Marks";
import { Trophy, Target, Clock } from "lucide-react";
import { motion } from "framer-motion";

const Result = ({ score, level, breakdown, topic, duration }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center bg-gradient-to-br from-green-50 via-white to-blue-50 px-5 py-4 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="shadow-xl rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200 text-center w-full max-w-sm p-5 "
      >
        {/* Trophy Icon */}
        <div className="flex justify-center mb-3">
          <Trophy className="w-8 h-8 text-yellow-500" />
        </div>

        {/* Marks Circle */}
        <div className="flex justify-center mb-4">
          <Marks correct={breakdown.correct} />
        </div>

        {/* Score */}
        <h2 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
          Your Score
        </h2>
        <div className="text-2xl font-extrabold text-green-600 mb-1">{score}%</div>
        <div className="text-gray-700 mb-3 text-sm flex justify-center items-center gap-1">
          <Target className="w-4 h-4 text-indigo-500" />
          Level: <span className="font-semibold">{level}</span>
        </div>

        {/* Breakdown */}
        <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl p-3 mb-4 shadow-inner">
          <h3 className="font-semibold text-gray-800 mb-2 text-sm">
            Answer Breakdown
          </h3>
          <div className="grid grid-cols-3 gap-2 text-xs font-medium">
            <div className="bg-emerald-50 border border-emerald-200 p-2 rounded-lg">
              <div className="text-emerald-600 font-bold">{breakdown.EasyCorrect}</div>
              <div className="text-[10px] text-gray-600">Easy</div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 p-2 rounded-lg">
              <div className="text-yellow-600 font-bold">{breakdown.MediumCorrect}</div>
              <div className="text-[10px] text-gray-600">Medium</div>
            </div>
            <div className="bg-red-50 border border-red-200 p-2 rounded-lg">
              <div className="text-red-600 font-bold">{breakdown.HardCorrect}</div>
              <div className="text-[10px] text-gray-600">Hard</div>
            </div>
          </div>
          <p className="mt-2 text-[11px] text-gray-500">
            Total correct: {breakdown.correct} / 10
          </p>
        </div>

        {/* Next Steps */}
        <h3 className="text-sm font-semibold text-gray-800 mb-1">
          Start your course for:
        </h3>
        <div className="text-indigo-700 font-bold text-base mb-1">{topic}</div>
        <div className="text-gray-600 flex items-center justify-center gap-1 text-xs mb-4">
          <Clock className="w-4 h-4 text-gray-500" />
          {duration} days
        </div>

        <motion.button
          onClick={() => navigate("/roadmap-overview")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-5 py-2 rounded-lg font-semibold text-sm text-white shadow-md bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all"
        >
          🚀 Explore Roadmap
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Result;
