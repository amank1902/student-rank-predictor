import { useState, useEffect } from "react";
import DataAnalysis from "./components/DataAnalysis";
import RankPrediction from "./components/RankPrediction";
import CollegePrediction from "./components/CollegePrediction";
import PerformanceChart from "./components/PerformanceChart";

function App() {
  const [quizData, setQuizData] = useState(null);
  const [quizSubmissionData, setQuizSubmissionData] = useState(null);
  const [historicalQuizData, setHistoricalQuizData] = useState(null);
  const [predictedRank, setPredictedRank] = useState(null);  // <-- Store predicted rank
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const corsProxy = "https://thingproxy.freeboard.io/fetch/";
      const fetchWithErrorHandling = async (url, setter) => {
        try {
          const response = await fetch(corsProxy + url, {
            headers: {
              Origin: "http://localhost:3000",
            },
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          console.log(`Data fetched from ${url}:`, data);
          setter(data);
        } catch (error) {
          console.error(`Error fetching data from ${url}:`, error);
          throw error;
        }
      };

      try {
        await fetchWithErrorHandling("https://www.jsonkeeper.com/b/LLQT", (data) => setQuizData(data.quiz));
        await fetchWithErrorHandling("https://api.jsonserve.com/rJvd7g", setQuizSubmissionData);
        await fetchWithErrorHandling("https://api.jsonserve.com/XgAgFJ", (data) => setHistoricalQuizData([data]));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(`Failed to fetch data: ${error.message}`);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error)
    return (
      <div className="text-center p-4 text-red-500">
        <h2 className="text-xl font-bold mb-2">Error:</h2>
        <p>{error}</p>
        <p className="mt-2 text-sm">Please check the console for more details and try again later.</p>
      </div>
    );

  if (!quizData || !quizSubmissionData || !historicalQuizData) {
    return <div className="text-center p-4">Data is incomplete. Please try again later.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Student Rank Predictor</h1>
      <DataAnalysis
        quizData={quizData}
        quizSubmissionData={quizSubmissionData}
        historicalQuizData={historicalQuizData}
      />
      <PerformanceChart historicalQuizData={historicalQuizData} />
      <RankPrediction 
        quizSubmissionData={quizSubmissionData} 
        historicalQuizData={historicalQuizData} 
        setPredictedRank={setPredictedRank}  
      />
      <CollegePrediction predictedRank={predictedRank} /> 
    </div>
  );
}

export default App;
