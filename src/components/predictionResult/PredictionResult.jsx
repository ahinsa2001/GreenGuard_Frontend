import React, { useState, useEffect } from 'react';
import axios from 'axios';
import bgImage from '../../images/bgImage.jpg';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import NavigationBar from '../navbar/NavigationBar';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PredictionResult = () => {
  const [isDaily, setIsDaily] = useState(true);
  const [predictions, setPredictions] = useState([]);
  const [diseaseTypes, setDiseaseTypes] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterDisease, setFilterDisease] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch predictions and disease types
  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/predictions/getAllPredictions');
        setPredictions(response.data);
      } catch (error) {
        console.error("Error fetching predictions:", error);
      }
    };

    const fetchDiseaseTypes = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/predictions/allDiseaseTypes');
        setDiseaseTypes(response.data);
      } catch (error) {
        console.error("Error fetching disease types:", error);
      }
    };

    fetchPredictions();
    fetchDiseaseTypes();
  }, []);

  // Filtering logic for daily and monthly views
  const filteredPredictions = predictions.filter(prediction => {
    const predictionDate = new Date(prediction.predictedDate);
    
    // Filter by disease
    if (filterDisease && prediction.disease !== filterDisease) {
      return false;
    }

    // Daily filter
    if (isDaily && filterDate) {
      return prediction.predictedDate === filterDate;
    }
    
    // Monthly filter
    if (!isDaily && filterMonth) {
      const month = String(predictionDate.getMonth() + 1).padStart(2, '0'); // "MM" format
      const year = predictionDate.getFullYear();
      return `${year}-${month}` === filterMonth;
    }

    return true;
  });

  // Aggregate disease counts for the filtered predictions
  const diseaseCounts = filteredPredictions.reduce((counts, pred) => {
    counts[pred.disease] = (counts[pred.disease] || 0) + 1;
    return counts;
  }, {});

  const diseaseCountData = {
    labels: Object.keys(diseaseCounts),
    datasets: [{
      label: isDaily ? 'Daily Disease Count' : 'Monthly Disease Count',
      data: Object.values(diseaseCounts),
      backgroundColor: ['#f87171', '#34d399', '#60a5fa', '#fbbf24', '#a78bfa'],
    }]
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredPredictions.length / itemsPerPage);
  const currentItems = filteredPredictions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Pagination controls
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      <div className="flex-grow overflow-auto" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="px-20 py-8">
          {/* Disease Count Chart Section */}
          <div className="grid grid-cols-1 gap-4 mb-8">
            <div className="bg-white bg-opacity-90 rounded-lg shadow p-4 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Disease Count Chart</h2>
                <div>
                  <button onClick={() => { setIsDaily(true); setFilterMonth(''); }} className={`px-3 py-1 rounded-l-lg ${isDaily ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                    Daily
                  </button>
                  <button onClick={() => { setIsDaily(false); setFilterDate(''); }} className={`px-3 py-1 rounded-r-lg ${!isDaily ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                    Monthly
                  </button>
                </div>
              </div>
              <div className="flex space-x-4 mb-4 justify-end">
                {isDaily ? (
                  <input
                    type="date"
                    className="border rounded px-3 py-2"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                  />
                ) : (
                  <input
                    type="month"
                    className="border rounded px-3 py-2"
                    value={filterMonth}
                    onChange={(e) => setFilterMonth(e.target.value)}
                  />
                )}
              </div>
              <div className="flex-1 mt-4">
                <Bar data={diseaseCountData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          </div>

          {/* Disease Prediction Results Table Section */}
          <div className="bg-white bg-opacity-70 rounded-lg shadow p-4">
            <h2 className="text-xl font-bold mb-4">Disease Prediction Results</h2>
            
            {/* Filters */}
            <div className="flex space-x-4 mb-4">
              <select
                className="border rounded px-3 py-2"
                value={filterDisease}
                onChange={(e) => setFilterDisease(e.target.value)}
              >
                <option value="">Filter by Disease</option>
                {diseaseTypes.map((disease, index) => (
                  <option key={index} value={disease}>{disease}</option>
                ))}
              </select>
            </div>

            {/* Prediction Table */}
            <div className="overflow-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-left">Plant Pot Number</th>
                    <th className="py-2 px-4 border-b text-left">Detected Disease</th>
                    <th className="py-2 px-4 border-b text-left">Confidence Level</th>
                    <th className="py-2 px-4 border-b text-left">Predicted Date</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((result, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b">{result.potNumber}</td>
                      <td className={`py-2 px-4 border-b ${result.disease === 'Healthy' ? 'text-green-500' : 'text-red-500'}`}>{result.disease}</td>
                      <td className="py-2 px-4 border-b">{result.confidence}%</td>
                      <td className="py-2 px-4 border-b">{result.predictedDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center mt-4">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="mx-2 px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Previous
              </button>
              <span className="mx-2">{`Page ${currentPage} of ${totalPages}`}</span>
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="mx-2 px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionResult;
