function RankPrediction({ quizSubmissionData, historicalQuizData }) {
  if (!quizSubmissionData || !historicalQuizData) {
    console.error("Missing data in RankPrediction:", { quizSubmissionData, historicalQuizData })
    return <div className="text-center p-4">Insufficient data for rank prediction</div>
  }

  const predictedRank = predictRank(quizSubmissionData, historicalQuizData)
  const confidenceInterval = calculateConfidenceInterval(predictedRank, historicalQuizData)

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-4">Rank Prediction</h2>
      <p className="mb-2">Based on your quiz performance and historical data, your predicted NEET rank is:</p>
      <h3 className="text-3xl font-bold text-blue-600 mb-4">{predictedRank}</h3>
      <p className="mb-2">Confidence Interval:</p>
      <p className="text-xl font-semibold text-green-600 mb-4">
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
  const currentScore = Number.parseFloat(quizSubmissionData.final_score) || 0
  const historicalScores = historicalQuizData.map((quiz) => Number.parseFloat(quiz.final_score) || 0)

  // Calculate weighted average, giving more weight to recent scores
  const weightedScores = historicalScores.map((score, index) => score * (index + 1))
  const weightedSum = weightedScores.reduce((a, b) => a + b, 0)
  const weights = historicalScores.map((_, index) => index + 1)
  const weightSum = weights.reduce((a, b) => a + b, 0)

  const weightedAverage = (weightedSum / weightSum + currentScore) / 2

  // Assuming a total of 720 marks in NEET (180 questions * 4 marks each)
  const predictedPercentile = (weightedAverage / 720) * 100

  // Assuming approximately 1.8 million students take NEET each year
  const totalCandidates = 1800000
  const predictedRank = Math.round(totalCandidates * (1 - predictedPercentile / 100))

  return predictedRank
}

function calculateConfidenceInterval(predictedRank, historicalQuizData) {
  const historicalRanks = historicalQuizData.map((quiz) => quiz.rank || 0)
  const stdDev = calculateStandardDeviation(historicalRanks)

  // Using a 95% confidence interval
  const marginOfError = 1.96 * (stdDev / Math.sqrt(historicalRanks.length))

  return {
    lower: Math.max(1, Math.round(predictedRank - marginOfError)),
    upper: Math.round(predictedRank + marginOfError),
  }
}

function calculateStandardDeviation(values) {
  const n = values.length
  const mean = values.reduce((a, b) => a + b) / n
  return Math.sqrt(values.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
}

export default RankPrediction

