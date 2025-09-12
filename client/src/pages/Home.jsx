import React, { useState } from "react";
import TopicCard from "../components/TopicCard";
import DurationSlider from "../components/DurationSlider";
import { useNavigate } from "react-router";
import { showWarningToast } from "../components/Toast";
import OutlineButton from "../components/OutlineButton";

const TOPICS = [
  {
    key: "JavaScript",
    name: "JavaScript",
    desc: "Master the language of the web",
    icon: "⚡",
  },
  {
    key: "React",
    name: "React",
    desc: "Build dynamic user interfaces",
    icon: "⚛️",
  },
  { key: "Node", name: "Node.js", desc: "Server-side JavaScript", icon: "🟢" },
  {
    key: "Python",
    name: "Python",
    desc: "Versatile programming language",
    icon: "🐍",
  },
  {
    key: "DSA",
    name: "Data Structures",
    desc: "Problem-solving & algorithms",
    icon: "🧠",
  },
  {
    key: "HTMLCSS",
    name: "HTML & CSS",
    desc: "Structure & style the web",
    icon: "🎨",
  },
  { key: "MongoDB", name: "MongoDB", desc: "NoSQL mastery", icon: "🍃" },
  { key: "SQL", name: "SQL", desc: "Relational queries", icon: "🗄️" },
  // { key: "Git", name: "Git & GitHub", desc: "Version control essentials", icon: "🐙" },
  // { key: "REST", name: "REST APIs", desc: "Build and consume APIs", icon: "🔗" },
  // { key: "TS", name: "TypeScript", desc: "Type-safe JavaScript", icon: "🔒" },
  // { key: "Vue", name: "Vue.js", desc: "Progressive framework", icon: "🟩" },
];

const Home = ({ onBegin }) => {
  const [selected, setSelect] = useState(null);
  const [duration, setDuration] = useState(7);
  const [customTopic, setCustomTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleCustomTopicSelect = () => {
    if (!customTopic.trim()) {
      showWarningToast("Please enter a topic name");
      return;
    }
    setSelect(customTopic.trim());
  };

  const handleStartAssessment = () => {
    if (!selected) {
      showWarningToast("Please select a topic first");
      return;
    }
    setIsLoading(true);
    onBegin(selected, duration);
    navigate("/assess");
  };

  const handleDirectToRoadmap = () => {
    if (!selected) {
      showWarningToast("Please select a topic first");
      return;
    }
    setIsLoading(true);
    onBegin(selected, duration);
    navigate("/roadmap-overview");
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 mt-5">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-center">
            {user && <span className="">Hey {user?.name} 👋,</span>}{" "}
            <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              Choose Your Learning Adventure
            </span>
          </h1>

          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Select a topic, set your learning duration, and kickstart your
            personalized journey 🚀
          </p>
        </div>

        {/* Custom Topic Input */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-center text-gray-700 mb-4">
            Or Create Your Own Topic
          </h2>

          <div className="flex gap-2 justify-center max-w-md mx-auto">
            <input
              type="text"
              className="flex-1 px-3 py-2 text-sm border outline-none border-gray-300  focus:border-blue-500 focus:ring-1 focus:ring-blue-300"
              placeholder="Enter a custom topic..."
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCustomTopicSelect()}
            />
            <OutlineButton
              onClick={handleCustomTopicSelect}
            >
              Add
            </OutlineButton>
          </div>

          {/* Display as a card when added */}
          {customTopic.trim() && (
            <div
              onClick={() => setSelect(customTopic.trim())}
              className={`mt-4 px-4 py-2 cursor-pointer max-w-md mx-auto rounded-lg border text-sm flex justify-between items-center shadow-sm transition-all
        ${
          selected === customTopic.trim()
            ? "border-blue-400 bg-blue-50 scale-105"
            : "border-gray-200 hover:scale-105 bg-white"
        }`}
            >
              <span className="flex items-center gap-2">
                📝 {customTopic.trim()}
              </span>
              {selected === customTopic.trim() && (
                <span className="text-xs font-medium text-green-600">
                  ✅ Selected
                </span>
              )}
            </div>
          )}
        </div>

        {/* Topic Grid */}
        <div className="mb-10 md:mx-[15%] ">
          <h2 className="text-lg font-bold text-center text-gray-800 mb-6 ">
            Popular Topics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {TOPICS.map((topic,idx) => (
              <div
                key={topic.key}
                onClick={() => setSelect(topic.key)}
                className={`${idx>3?"block md:hidden":""} cursor-pointer transform hover:scale-105 transition-transform`}
              >
                <TopicCard
                  title={topic.name}
                  desc={topic.desc}
                  icon={topic.icon}
                  selected={selected === topic.key}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Duration Slider */}
        <div className="mb-12">
          <DurationSlider duration={duration} setDuration={setDuration} />
        </div>

        {/* Action Buttons */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              disabled={isLoading}
              onClick={handleStartAssessment}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50"
            >
              {isLoading ? "Starting..." : "Start Assessment"}
            </button>

            <button
              disabled={isLoading}
              onClick={handleDirectToRoadmap}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl shadow hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50"
            >
              {isLoading ? "Generating..." : "Direct to Roadmap"}
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            {selected
              ? `✨ Ready to learn ${selected} in ${duration} days!`
              : "⚡ Please select a topic to continue"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
