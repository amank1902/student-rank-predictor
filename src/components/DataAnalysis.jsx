function DataAnalysis({ quizData, quizSubmissionData, historicalQuizData }) {
  if (!quizData || !quizSubmissionData || !historicalQuizData) {
    console.error("Missing data in DataAnalysis:", { quizData, quizSubmissionData, historicalQuizData });
    return <div className="text-center p-4">Insufficient data for analysis</div>;
  }

  const weakAreas = identifyWeakAreas(quizData, quizSubmissionData);
  const improvementTrends = calculateImprovementTrends(historicalQuizData);
  const performanceGaps = identifyPerformanceGaps(quizSubmissionData, historicalQuizData);

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-3xl font-bold mb-4">Performance Analysis</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">Weak Areas:</h3>
          <ul className="list-disc pl-5">
            {weakAreas.length > 0 ? weakAreas.map((area, index) => (
              <li key={index} className="mb-1 text-xl">{area}</li>
            )) : <li className="text-xl">No significant weak areas identified</li>}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Improvement Trends:</h3>
          <ul className="list-disc pl-5">
            {improvementTrends.length > 0 ? improvementTrends.map((trend, index) => (
              <li key={index} className="mb-1 text-xl">{trend}</li>
            )) : <li>No enough historical data to calculate improvement trends</li>}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Performance Gaps:</h3>
          <ul className="list-disc pl-5">
            {performanceGaps.length > 0 ? performanceGaps.map((gap, index) => (
              <li key={index} className="mb-1 text-xl">{gap}</li>
            )) : <li>No significant performance gaps identified</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}

function identifyWeakAreas(quizData, quizSubmissionData) {
  const weakAreas = [];
  const correctAnswers = quizSubmissionData.correct_answers || 0;
  const totalQuestions = quizSubmissionData.total_questions || 1;
  const accuracy = (correctAnswers / totalQuestions) * 100;

  if (accuracy < 60) {
    weakAreas.push(`Overall performance (${accuracy.toFixed(2)}% accuracy)`);
  }

  if (quizData.topic && accuracy < 70) {
    weakAreas.push(`${quizData.topic} (needs improvement)`);
  }

  return weakAreas;
}

function calculateImprovementTrends(historicalQuizData) {
  if (!Array.isArray(historicalQuizData) || historicalQuizData.length < 2) {
    return ["Not enough historical data to calculate improvement trends"];
  }

  const sortedData = historicalQuizData.sort((a, b) => new Date(a.submitted_at) - new Date(b.submitted_at));
  const firstScore = sortedData[0].score || 0;
  const lastScore = sortedData[sortedData.length - 1].score || 0;

  const improvement = ((lastScore - firstScore) / firstScore) * 100;

  if (improvement > 0) {
    return [`Overall improvement of ${improvement.toFixed(2)}% observed`];
  } else if (improvement < 0) {
    return [`Overall decline of ${Math.abs(improvement).toFixed(2)}% observed`];
  } else {
    return ["No significant improvement trend observed"];
  }
}

function identifyPerformanceGaps(quizSubmissionData, historicalQuizData) {
  const gaps = [];
  const currentAccuracy = parseFloat(quizSubmissionData.accuracy) || 0;
  const averageHistoricalAccuracy =
    historicalQuizData.reduce((sum, quiz) => sum + (parseFloat(quiz.accuracy) || 0), 0) /
    historicalQuizData.length;

  const accuracyGap = currentAccuracy - averageHistoricalAccuracy;

  if (Math.abs(accuracyGap) > 10) {
    gaps.push(
      `Your accuracy in the latest quiz was ${Math.abs(accuracyGap).toFixed(2)}% ${
        accuracyGap > 0 ? "higher" : "lower"
      } than your average accuracy across previous attempts.`
    );
  }

  const currentSpeed = parseInt(quizSubmissionData.speed) || 0;
  const averageHistoricalSpeed =
    historicalQuizData.reduce((sum, quiz) => sum + (parseInt(quiz.speed) || 0), 0) / historicalQuizData.length;

  const speedGap = currentSpeed - averageHistoricalSpeed;

  if (Math.abs(speedGap) > 10) {
    gaps.push(
      `Your answering speed in the latest quiz was ${Math.abs(speedGap).toFixed(2)}% ${
        speedGap > 0 ? "faster" : "slower"
      } than your average speed across previous attempts.`
    );
  }

  return gaps.length > 0 ? gaps : ["No significant performance gaps identified"];
}


export default DataAnalysis;
