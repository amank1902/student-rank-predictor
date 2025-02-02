import { useEffect } from "react";

function RankPrediction({ quizSubmissionData, historicalQuizData, setPredictedRank }) {
  if (!quizSubmissionData || !historicalQuizData) {
    console.error("Missing data in RankPrediction:", { quizSubmissionData, historicalQuizData })
    return <div className="text-center p-4">Insufficient data for rank prediction</div>
  }

  const predictedRank = predictRank(quizSubmissionData, historicalQuizData)
  const confidenceInterval = calculateConfidenceInterval(predictedRank, historicalQuizData)

  useEffect(() => {
    setPredictedRank(predictedRank);
  }, [predictedRank, setPredictedRank]);

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-3xl font-bold mb-4">Rank Prediction</h2>
      <p className="mb-2 text-xl">Based on your quiz performance and historical data, your predicted NEET rank is:</p>
      <h3 className="text-3xl font-bold text-blue-600 mb-4">{predictedRank}</h3>
      <p className="mb-2 text-xl">Confidence Interval:</p>
      <p className="text-2xl font-semibold text-green-600 mb-4">
        {confidenceInterval.lower} - {confidenceInterval.upper}
      </p>
      <p className="text-sm text-gray-600">
        Note: This is a more sophisticated prediction, but actual NEET rank depends on various factors and the
        performance of all candidates.
      </p>
    </div>
  )
}

function predictRank(quizSubmissionData, historicalQuizData) {
  const totalCandidates = 1800000; // Assuming total NEET candidates
  const currentScore = Number.parseFloat(quizSubmissionData.final_score) || 0;
  const historicalScores = historicalQuizData.map((quiz) => Number.parseFloat(quiz.final_score) || 0);

  if (!historicalScores.length) return totalCandidates; 

  // Weighted average calculation
  const weightedScores = historicalScores.map((score, index) => score * (index + 1));
  const weightedSum = weightedScores.reduce((a, b) => a + b, 0);
  const weights = historicalScores.map((_, index) => index + 1);
  const weightSum = weights.reduce((a, b) => a + b, 0);

  const weightedAverage = (weightedSum / weightSum + currentScore) / 2;

  
  const predictedPercentile = Math.max(5, (weightedAverage / 720) * 100);

  
  const predictedRank = Math.min(totalCandidates, Math.round(totalCandidates * (1 - predictedPercentile / 100)));

  return predictedRank;
}

function calculateConfidenceInterval(predictedRank, historicalQuizData) {
  const historicalRanks = historicalQuizData.map((quiz) => quiz.rank || 0);
  const stdDev = calculateStandardDeviation(historicalRanks);

  
  const marginOfError = 1.96 * (stdDev / Math.sqrt(historicalRanks.length));

  return {
    lower: Math.max(1, Math.round(predictedRank - marginOfError)),
    upper: Math.round(predictedRank + marginOfError),
  };
}

function calculateStandardDeviation(values) {
  const n = values.length;
  const mean = values.reduce((a, b) => a + b) / n;
  return Math.sqrt(values.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
}

export default RankPrediction;
