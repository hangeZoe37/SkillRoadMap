import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
export async function fetchAssessmentQuestions(topic) {
  try {
    const response = await axios.post(
      `${API_URL}/assessment/questions`,
      { topic }
    );
    console.log("topic",topic);
    
    console.log("res",response.data);
    return response.data;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
}

export const evaluateAssessment = async (answers, questions) => {
  try {
    const result = await axios.post(
      `${API_URL}/api/assessment/evaluate`,
      { answers, questions }
    );
    return result.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
