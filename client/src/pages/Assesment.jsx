import React, { useEffect, useState } from "react";
import { fetchAssessmentQuestions } from "../api/assessmentAPi.js";
import Loader from "../components/Loader";
import QuestionCard from "../components/QuestionCard";
import ErrorBoundary from "../components/ErrorBoundary";
import { showErrorToast } from "../components/Toast";

const Assessment = ({ topic, duration, handleAssessmentFinish }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState(null);

  const getQuestions = async (topic) => {
    setLoading(true);
    setError(null);
    try {
      const Ques = await fetchAssessmentQuestions(topic);
      if (Ques && Ques.length > 0) {
        setQuestions(Ques);
      } else {
        throw new Error("No questions received from server");
      }
    } catch (err) {
      setError(err);
      showErrorToast("Failed to load assessment questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (topic) getQuestions(topic);
  }, [topic]);

  const handleNext = (nextId) => {
    if (nextId < questions.length) setId(nextId);
  };

  const handleRetry = () => {
    setError(null);
    getQuestions(topic);
  };

  if (error) return <ErrorBoundary error={error} onRetry={handleRetry} />;

  return (
    <div className=" mt-[7%] md:mt-[3%] bg-gray-50 flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center items-center p-4 ">
        {loading && <Loader message="Preparing Your Assessment..." />}

        {!loading && questions.length > 0 && (
          <>
            {/* Sticky Header */}
            <header className="bg-white shadow-sm border-b sticky top-0 z-10">
              <div className="max-w-4xl mx-auto px-4 py-4 text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Assessment Quiz
                </h1>
                <div className="flex justify-center items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <span>📚</span>
                    <span>Topic: {topic}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>⏱️</span>
                    <span>Duration: {duration} days</span>
                  </div>
                </div>
              </div>
            </header>
            <QuestionCard
              questions={questions}
              id={id}
              handleNext={handleNext}
              handleAssessmentFinish={handleAssessmentFinish}
              answers={answers}
              setAnswers={setAnswers}
            />
          </>
        )}

        {!loading && questions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📝</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No Questions Available
            </h2>
            <p className="text-gray-500">
              Unable to generate questions for this topic.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Assessment;
