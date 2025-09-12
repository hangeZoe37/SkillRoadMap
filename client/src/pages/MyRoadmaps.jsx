import React, { useEffect, useState } from "react";
import { getMyRoadmaps } from "../api/roadmapAPI";
import { motion } from "framer-motion";
import { showErrorToast, showSuccessToast } from "../components/Toast";
import ErrorBoundary from "../components/ErrorBoundary";
import Loader from "../components/Loader";
import { useNavigate } from "react-router";

const cardVariant = {
  hidden: { opacity: 0, y: 8 },
  visible: (i = 1) => ({ opacity: 1, y: 0, transition: { delay: 0.06 * i } }),
};

const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return "Unknown";
  }
};

const MyRoadmaps = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const fetchRoadmaps = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getMyRoadmaps();
      setRoadmaps(res || []);
    } catch (err) {
      setError(err);
      showErrorToast("Failed to load your roadmaps. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    fetchRoadmaps();
  };

  const handleShare = async (roadmap) => {
    const url = `${window.location.origin}/roadmap/${roadmap._id || ""}`;
    try {
      await navigator.clipboard.writeText(url);
      showSuccessToast("Roadmap link copied to clipboard!");
    } catch {
      // fallback
      showErrorToast("Unable to copy automatically. Opening share dialog...");
      // fallback: open native share if available
      if (navigator.share) {
        try {
          await navigator.share({ title: roadmap.topic, url });
        } catch { /* empty */ }
      }
    }
  };

  if (error) {
    return <ErrorBoundary error={error} onRetry={handleRetry} />;
  }

  if (loading) {
    return <Loader message="Loading your roadmaps..." />;
  }

  // aggregate stats
  const totalRoadmaps = roadmaps.length;
  const advancedCount = roadmaps.filter((r) => r.level === "Advanced").length;
  const totalDays = roadmaps.reduce((sum, r) => sum + (r.duration || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
            My Learning Roadmaps
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Track your progress, revisit saved plans, and jump straight into any roadmap.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 text-lg font-bold shadow">
              📚
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{totalRoadmaps}</div>
              <div className="text-xs text-gray-500">Total Roadmaps</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-green-100 to-green-200 flex items-center justify-center text-green-600 text-lg font-bold shadow">
              ⚡
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{advancedCount}</div>
              <div className="text-xs text-gray-500">Advanced Level</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-100 to-purple-200 flex items-center justify-center text-purple-600 text-lg font-bold shadow">
              ⏳
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{totalDays}</div>
              <div className="text-xs text-gray-500">Total Days</div>
            </div>
          </div>
        </div>

        {/* Empty state */}
        {roadmaps.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-7xl mb-4">🗺️</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-4">No Roadmaps Yet</h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Start your learning journey by taking an assessment or creating a roadmap for any topic.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => navigate("/")}
                className="bg-blue-500 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-blue-600 transition"
              >
                Start Learning
              </button>
              
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roadmaps.map((roadmap, idx) => (
              <motion.div
                key={roadmap._id || idx}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col"
                custom={idx}
                initial="hidden"
                animate="visible"
                variants={cardVariant}
              >
                {/* Header */}
                <div className="px-5 py-4 bg-gradient-to-r from-white to-blue-50 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {roadmap.topic || "Untitled Roadmap"}
                    </h3>
                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          roadmap.level === "Beginner"
                            ? "bg-green-100 text-green-700"
                            : roadmap.level === "Intermediate"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {roadmap.level || "No Level"}
                      </span>

                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        {roadmap.duration || 0} days
                      </span>
                    </div>
                  </div>

                  <div className="text-right text-xs text-gray-500">
                    <div>Created</div>
                    <div className="font-medium text-gray-700">{formatDate(roadmap.createdAt)}</div>
                  </div>
                </div>

                {/* Body / Stats */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-bold text-gray-700">
                        {roadmap.days?.length || 0}
                      </div>
                      <div className="text-xs text-gray-500">Days</div>
                    </div>

                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-bold text-gray-700">
                        {roadmap.days?.reduce((sum, day) => sum + (day.levels?.length || 0), 0) || 0}
                      </div>
                      <div className="text-xs text-gray-500">Levels</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        localStorage.setItem("selectedRoadmap", JSON.stringify(roadmap));
                        navigate("/roadmap-overview");
                      }}
                      className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-2xl text-sm font-semibold hover:bg-blue-600 transition"
                      aria-label={`View roadmap ${roadmap.topic}`}
                    >
                      View
                    </button>

                    <button
                      onClick={() => handleShare(roadmap)}
                      className="bg-white border border-gray-200 py-2 px-3 rounded-2xl text-sm font-semibold hover:shadow transition"
                      aria-label={`Share roadmap ${roadmap.topic}`}
                    >
                      Share
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRoadmaps;
