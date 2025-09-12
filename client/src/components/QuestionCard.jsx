import React, { useState } from "react";
import { GrRadialSelected } from "react-icons/gr";
import { FaRegCircle } from "react-icons/fa";
import { useNavigate } from "react-router";
import { showErrorToast } from "../components/Toast";
import { evaluateAssessment } from "../api/assessmentAPi.js";

const QuestionCard = ({
  questions,
  id,
  handleNext,
  handleAssessmentFinish,
  answers,
  setAnswers,
}) => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);
  const [locked, setLocked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNextClick = async () => {
    if (selectedOption === null) {
      showErrorToast("Please select an option before proceeding");
      return;
    }

    const newAnswers = [...answers, selectedOption];
    setAnswers(newAnswers);

    if (id === questions.length - 1) {
      setIsSubmitting(true);
      try {
        const res = await evaluateAssessment(newAnswers, questions);
        handleAssessmentFinish(res);
        navigate("/result");
      } catch (err) {
        showErrorToast("Failed to evaluate assessment. Please try again.");
        console.log(err);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setSelectedOption(null);
      setLocked(false);
      handleNext(id + 1);
    }
  };

  const handleOptionClick = (index) => {
    if (locked) return;
    setLocked(true);
    setSelectedOption(index);
  };

  const currentQuestion = questions[id];

  return (
    <div className="max-w-xl md:max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 flex flex-col gap-6">
        {/* Question Header */}
        <div className="flex justify-between items-center">
          <div className="text-gray-500 text-sm">
            Question {id + 1} / {questions.length}
          </div>
          <div
            className={`text-xs px-3 py-1 rounded-full font-semibold text-white
  ${
    currentQuestion.difficulty === "Easy"
      ? "bg-green-400"
      : currentQuestion.difficulty === "Medium"
      ? "bg-yellow-400"
      : "bg-red-400"
  }`}
          >
            {currentQuestion.difficulty}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-2 bg-gradient-to-r from-blue-400 to-green-400 transition-all duration-300"
            style={{ width: `${((id + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question Text */}
        <h2 className="text-gray-800 text-lg font-semibold">
          {currentQuestion.question}
        </h2>

        {/* Options */}
        <div className="flex flex-col gap-3">
          {currentQuestion.options.map((opt, index) => {
            const isSelected = selectedOption === index;
            const isCorrect = currentQuestion.correct === index;

            return (
              <button
                key={index}
                onClick={() => handleOptionClick(index)}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-colors duration-200
                  ${
                    isSelected
                      ? isCorrect
                        ? "bg-green-50 border-green-400"
                        : "bg-red-50 border-red-400"
                      : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }
                `}
              >
                <div className="text-gray-500">
                  {isSelected ? <GrRadialSelected /> : <FaRegCircle />}
                </div>
                <div className="flex-1 text-gray-700 text-sm">{opt}</div>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {locked && currentQuestion.explanation && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-blue-700 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-blue-500">💡</span>
              <p>{currentQuestion.explanation}</p>
            </div>
          </div>
        )}

        {/* Next/Submit Button */}
        <div className="text-center">
          <button
            disabled={isSubmitting}
            onClick={handleNextClick}
            className={`px-6 py-2 rounded-xl font-semibold text-sm transition-transform duration-200
              ${
                isSubmitting
                  ? "bg-gray-300 cursor-not-allowed text-gray-600"
                  : id === questions.length - 1
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }
            `}
          >
            {isSubmitting
              ? "Submitting..."
              : id === questions.length - 1
              ? "Submit Assessment"
              : "Next Question"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
