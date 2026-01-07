import "./App.css";
import { Routes, Route, Navigate } from "react-router";
import {useState } from "react";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import Assesment from "./pages/Assesment";
import Result from "./pages/Result";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import RoadmapOverview from "./pages/RoadmapOverview";
import MyRoadmaps from "./pages/MyRoadmaps";
import Arena from "./pages/Arena";

function App() {
  const [topic, setTopic] = useState(()=>{
    const saved=localStorage.getItem("topic");
    return saved?JSON.parse(saved):null;
  });
  const [duration, setDuration] = useState(7);
  const [result, setResult] = useState(null);

  return (
    <div>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <Home
              onBegin={(t, d) => {
                setTopic(t);
                setDuration(d);
                localStorage.setItem("topic",JSON.stringify(t));
                localStorage.setItem("duration",JSON.stringify(d))
              }}
            />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
 
        {/* Protected routes */}
        <Route
          path="/assess"
          element={
            <ProtectedRoute>
              {topic?(<Assesment
                topic={topic}
                duration={duration}
                handleAssessmentFinish={(res) => setResult(res)}
              />):(
                <Navigate to="/" replace />
              )}
            </ProtectedRoute>
          }
        />

        <Route
          path="/result"
          element={
            <ProtectedRoute>
              {result ? (
                <Result
                  score={result.score}
                  level={result.level}
                  breakdown={result.breakdown}
                  topic={topic}
                  duration={duration}
                />
              ) : (
                <Navigate to="/" replace />
              )}
            </ProtectedRoute>
          }
        />

        <Route
          path="/roadmap-overview"
          element={
            <ProtectedRoute>
              {(topic && duration)?(<RoadmapOverview
                topic={topic}
                duration={duration}
                level={result?.level || "beginner"}
                score={result?.score || null}
                breakdown={result?.breakdown || null}
              />):(
                <Navigate to="/" replace/>
              )}
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-roadmaps"
          element={
            <ProtectedRoute>
              <MyRoadmaps />
            </ProtectedRoute>
          }
        />
        <Route path="/arena" element={
          <ProtectedRoute>
            <Arena />
          </ProtectedRoute>
        } />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
}

export default App;
