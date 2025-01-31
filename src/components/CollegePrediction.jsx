function CollegePrediction({ predictedRank }) {
  const predictCollege = (rank) => {
    if (predictedRank === null || predictedRank === undefined || isNaN(predictedRank)) {
      console.error("Invalid rank in CollegePrediction:", predictedRank);
      return <div className="text-center p-4 text-red-500">Rank data is unavailable.</div>;
    }
    if (!rank || typeof rank !== "number") {
      console.error("Invalid rank in CollegePrediction:", rank);
      return "Unable to predict college";
    }

    console.log("Processed Predicted Rank:", rank); // Debugging

    if (rank <= 100) {
      return "All India Institute of Medical Sciences (AIIMS), New Delhi";
    } else if (rank <= 500) {
      return "Christian Medical College (CMC), Vellore";
    } else if (rank <= 1000) {
      return "Armed Forces Medical College (AFMC), Pune";
    } else if (rank <= 5000) {
      return "Maulana Azad Medical College, New Delhi";
    } else if (rank <= 10000) {
      return "Government Medical College, Chandigarh";
    } else {
      return "Please consult the complete list of medical colleges based on your rank";
    }
  };

  const predictedCollege = predictCollege(predictedRank);

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-4">College Prediction</h2>
      <p className="mb-2">Based on your predicted rank, you might be eligible for:</p>
      <h3 className="text-xl font-semibold text-green-600 mb-4">{predictedCollege}</h3>
      <p className="text-sm text-gray-600">
        Note: This is a simplified prediction. Actual college admissions depend on various factors including reservation
        categories, state quotas, and individual college criteria.
      </p>
    </div>
  );
}

export default CollegePrediction;
