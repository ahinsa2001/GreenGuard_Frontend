// // MonitorPlantHealth.jsx

// import React, { useState } from 'react';
// import { Line } from 'react-chartjs-2';
// import {
//   FaArrowUp,
//   FaArrowDown,
//   FaHeartbeat,
//   FaSeedling,
//   FaChartLine,
// } from 'react-icons/fa';
// import NavigationBar from '../navbar/NavigationBar';
// import bgImage from '../../images/bgImage.jpg';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Tooltip,
//   Legend
// );

// const MonitorPlantHealth = () => {
//   const [isDaily, setIsDaily] = useState(true);

//   // Sample data for the metrics
//   const growthRate = 75; // in percentage
//   const diseaseSpreadRate = 20; // in percentage
//   const yieldPredictionRate = 80; // in percentage

//   // Data for the graph
//   const dailyData = {
//     labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
//     datasets: [
//       {
//         label: 'Growth Rate (%)',
//         data: [70, 72, 74, 76, 78, 80, 82],
//         borderColor: '#34d399',
//         backgroundColor: 'rgba(52, 211, 153, 0.2)',
//       },
//       {
//         label: 'Disease Spread Rate (%)',
//         data: [15, 16, 17, 18, 19, 20, 21],
//         borderColor: '#f87171',
//         backgroundColor: 'rgba(248, 113, 113, 0.2)',
//       },
//       {
//         label: 'Yield Prediction Rate (%)',
//         data: [78, 79, 80, 81, 82, 83, 84],
//         borderColor: '#60a5fa',
//         backgroundColor: 'rgba(96, 165, 250, 0.2)',
//       },
//     ],
//   };

//   const monthlyData = {
//     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
//     datasets: [
//       {
//         label: 'Growth Rate (%)',
//         data: [65, 68, 70, 72, 75, 78],
//         borderColor: '#34d399',
//         backgroundColor: 'rgba(52, 211, 153, 0.2)',
//       },
//       {
//         label: 'Disease Spread Rate (%)',
//         data: [10, 12, 14, 16, 18, 20],
//         borderColor: '#f87171',
//         backgroundColor: 'rgba(248, 113, 113, 0.2)',
//       },
//       {
//         label: 'Yield Prediction Rate (%)',
//         data: [70, 72, 74, 76, 78, 80],
//         borderColor: '#60a5fa',
//         backgroundColor: 'rgba(96, 165, 250, 0.2)',
//       },
//     ],
//   };

//   // Sample predicted results data
//   const predictedResults = [
//     {
//       date: '2023-10-12',
//       healthyCount: 120,
//       diseasedCount: 30,
//       dayGrowthRate: 2,
//       dayDiseaseRate: 1,
//       status: 'Good',
//     },
//     {
//       date: '2023-10-13',
//       healthyCount: 118,
//       diseasedCount: 32,
//       dayGrowthRate: 1.8,
//       dayDiseaseRate: 1.2,
//       status: 'Moderate',
//     },
//     {
//       date: '2023-10-14',
//       healthyCount: 115,
//       diseasedCount: 35,
//       dayGrowthRate: 1.5,
//       dayDiseaseRate: 1.5,
//       status: 'Bad',
//     },
//     // Add more data as needed
//   ];

//   // Function to get status indicator
//   const getStatusIndicator = (status) => {
//     switch (status) {
//       case 'Good':
//         return <FaArrowUp className="text-green-500" />;
//       case 'Moderate':
//         return <FaArrowUp className="text-yellow-500" />;
//       case 'Bad':
//         return <FaArrowDown className="text-red-500" />;
//       default:
//         return <FaArrowUp className="text-gray-500" />;
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col overflow-hidden">
//       {/* Navbar */}
//       <NavigationBar/>

//       {/* Main Content */}
//       <div
//         className="flex-grow overflow-hidden px-10 pt-4"
//         style={{
//           backgroundImage: `url(${bgImage})`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//         }}
//       >
//         <div className="h-full flex flex-col bg-white bg-opacity rounded-lg shadow p-6">
//           {/* Top Metrics */}
//           <div className="flex justify-between mb-6">
//             <div className="w-1/3 px-4">
//               <div className="bg-green-100 p-4 rounded-lg flex items-center">
//                 <FaSeedling className="text-green-500 text-3xl mr-4" />
//                 <div>
//                   <p className="text-2xl font-bold">{growthRate}%</p>
//                   <p className="text-gray-700">Growth Rate</p>
//                 </div>
//               </div>
//             </div>
//             <div className="w-1/3 px-4">
//               <div className="bg-red-100 p-4 rounded-lg flex items-center">
//                 <FaHeartbeat className="text-red-500 text-3xl mr-4" />
//                 <div>
//                   <p className="text-2xl font-bold">{diseaseSpreadRate}%</p>
//                   <p className="text-gray-700">Disease Spread Rate</p>
//                 </div>
//               </div>
//             </div>
//             <div className="w-1/3 px-4">
//               <div className="bg-blue-100 p-4 rounded-lg flex items-center">
//                 <FaChartLine className="text-blue-500 text-3xl mr-4" />
//                 <div>
//                   <p className="text-2xl font-bold">{yieldPredictionRate}%</p>
//                   <p className="text-gray-700">Yield Prediction Rate</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Graph */}
//           <div className="mb-6">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold">Plant Health Metrics</h2>
//               <div>
//                 <button
//                   onClick={() => setIsDaily(true)}
//                   className={`px-3 py-1 rounded-l-lg ${
//                     isDaily ? 'bg-blue-500 text-white' : 'bg-gray-200'
//                   }`}
//                 >
//                   Daily
//                 </button>
//                 <button
//                   onClick={() => setIsDaily(false)}
//                   className={`px-3 py-1 rounded-r-lg ${
//                     !isDaily ? 'bg-blue-500 text-white' : 'bg-gray-200'
//                   }`}
//                 >
//                   Monthly
//                 </button>
//               </div>
//             </div>
//             <div className="h-64">
//               <Line
//                 data={isDaily ? dailyData : monthlyData}
//                 options={{ maintainAspectRatio: false }}
//               />
//             </div>
//           </div>

//           {/* Predicted Results Table */}
//           <div className="flex-grow overflow-auto">
//             <table className="w-full table-auto bg-white rounded shadow">
//               <thead>
//                 <tr className="bg-gray-200 text-left">
//                   <th className="px-4 py-2">Date</th>
//                   <th className="px-4 py-2">Healthy Plant Count</th>
//                   <th className="px-4 py-2">Diseased Plant Count</th>
//                   {/* <th className="px-4 py-2">Day Growth Rate (%)</th>
//                   <th className="px-4 py-2">Day Disease Rate (%)</th> */}
//                   <th className="px-4 py-2">Overall Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {predictedResults.map((result, index) => (
//                   <tr key={index} className="border-b hover:bg-gray-100">
//                     <td className="px-4 py-2">{result.date}</td>
//                     <td className="px-4 py-2">{result.healthyCount}</td>
//                     <td className="px-4 py-2">{result.diseasedCount}</td>
//                     {/* <td className="px-4 py-2">{result.dayGrowthRate}%</td>
//                     <td className="px-4 py-2">{result.dayDiseaseRate}%</td> */}
//                     <td className="px-4 py-2 flex items-center">
//                       {getStatusIndicator(result.status)}
//                       <span className="ml-2">{result.status}</span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MonitorPlantHealth;




// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Line } from 'react-chartjs-2';
// import {
//   FaArrowUp,
//   FaArrowDown,
//   FaHeartbeat,
//   FaSeedling,
//   FaChartLine,
// } from 'react-icons/fa';
// import NavigationBar from '../navbar/NavigationBar';
// import bgImage from '../../images/bgImage.jpg';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Tooltip,
//   Legend
// );

// const MonitorPlantHealth = () => {
//   const [isDaily, setIsDaily] = useState(true);
//   const [growthRate, setGrowthRate] = useState(0);
//   const [diseaseSpreadRate, setDiseaseSpreadRate] = useState(0);
//   const [yieldPredictionRate, setYieldPredictionRate] = useState(0);
//   const [predictedResults, setPredictedResults] = useState([]);
//   const [predictions, setPredictions] = useState([]);

//   // Fetch data from the backend API
//   useEffect(() => {
//     const fetchMetrics = async () => {
//       try {
//         const response = await axios.get('http://localhost:8080/api/analytics/plantMetrics');
//         setGrowthRate(response.data.growthRate);
//         setDiseaseSpreadRate(response.data.diseaseSpreadRate);
//         setYieldPredictionRate(response.data.yieldPredictionRate);
//       } catch (error) {
//         console.error("Error fetching plant metrics:", error);
//       }
//     };

//     const fetchPredictedResults = async () => {
//       try {
//         const response = await axios.get('http://localhost:8080/api/analytics/predictedResults');
//         setPredictedResults(response.data);
//       } catch (error) {
//         console.error("Error fetching predicted results:", error);
//       }
//     };

//     const fetchPredictions = async () => {
//       try {
//         const response = await axios.get('http://localhost:8080/api/predictions/getAllPredictions');
//         setPredictions(response.data);
//       } catch (error) {
//         console.error("Error fetching predictions:", error);
//       }
//     };

//     fetchMetrics();
//     fetchPredictedResults();
//     fetchPredictions();
//   }, []);

//   // Function to get status indicator
//   const getStatusIndicator = (status) => {
//     switch (status) {
//       case 'Good':
//         return <FaArrowUp className="text-green-500" />;
//       case 'Moderate':
//         return <FaArrowUp className="text-yellow-500" />;
//       case 'Bad':
//         return <FaArrowDown className="text-red-500" />;
//       default:
//         return <FaArrowUp className="text-gray-500" />;
//     }
//   };
  
//   return (
//     <div className="min-h-screen flex flex-col overflow-hidden">
//       <NavigationBar />

//       {/* Main Content */}
//       <div
//         className="flex-grow overflow-hidden px-10 pt-4"
//         style={{
//           backgroundImage: `url(${bgImage})`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//         }}
//       >
//         <div className="h-full flex flex-col bg-white bg-opacity rounded-lg shadow p-6">
//           {/* Top Metrics */}
//           <div className="flex justify-between mb-6">
//             <div className="w-1/3 px-4">
//               <div className="bg-green-100 p-4 rounded-lg flex items-center">
//                 <FaSeedling className="text-green-500 text-3xl mr-4" />
//                 <div>
//                   <p className="text-2xl font-bold">{growthRate}%</p>
//                   <p className="text-gray-700">Growth Rate</p>
//                 </div>
//               </div>
//             </div>
//             <div className="w-1/3 px-4">
//               <div className="bg-red-100 p-4 rounded-lg flex items-center">
//                 <FaHeartbeat className="text-red-500 text-3xl mr-4" />
//                 <div>
//                   <p className="text-2xl font-bold">{diseaseSpreadRate}%</p>
//                   <p className="text-gray-700">Disease Spread Rate</p>
//                 </div>
//               </div>
//             </div>
//             <div className="w-1/3 px-4">
//               <div className="bg-blue-100 p-4 rounded-lg flex items-center">
//                 <FaChartLine className="text-blue-500 text-3xl mr-4" />
//                 <div>
//                   <p className="text-2xl font-bold">{yieldPredictionRate}%</p>
//                   <p className="text-gray-700">Yield Prediction Rate</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Results Summary Table */}
//           <div className="mb-6">
//             <h2 className="text-xl font-bold mb-4">Results Summary</h2>
//             <div className="overflow-auto">
//               <table className="w-full table-auto bg-white rounded shadow">
//                 <thead>
//                   <tr className="bg-gray-200 text-left">
//                     <th className="px-4 py-2">Date</th>
//                     <th className="px-4 py-2">Healthy Plant Count</th>
//                     <th className="px-4 py-2">Diseased Plant Count</th>
//                     <th className="px-4 py-2">Overall Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {predictedResults.map((result, index) => (
//                     <tr key={index} className="border-b hover:bg-gray-100">
//                       <td className="px-4 py-2">{result.date}</td>
//                       <td className="px-4 py-2">{result.healthyCount}</td>
//                       <td className="px-4 py-2">{result.diseasedCount}</td>
//                       <td className="px-4 py-2 flex items-center">
//                         {getStatusIndicator(result.status)}
//                         <span className="ml-2">{result.status}</span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Prediction Table */}
//           <div className="flex-grow overflow-auto">
//             <h2 className="text-xl font-bold mb-4">Prediction Table</h2>
//             <table className="w-full table-auto bg-white rounded shadow">
//               <thead>
//                 <tr className="bg-gray-200 text-left">
//                   <th className="px-4 py-2">Plant Pot Number</th>
//                   <th className="px-4 py-2">Detected Disease</th>
//                   <th className="px-4 py-2">Confidence Level</th>
//                   <th className="px-4 py-2">Predicted Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {predictions.map((prediction, index) => (
//                   <tr key={index} className="border-b hover:bg-gray-100">
//                     <td className="px-4 py-2">{prediction.potNumber}</td>
//                     <td className={`px-4 py-2 ${prediction.disease === 'Healthy' ? 'text-green-500' : 'text-red-500'}`}>{prediction.disease}</td>
//                     <td className="px-4 py-2">{prediction.confidence}%</td>
//                     <td className="px-4 py-2">{prediction.predictedDate}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MonitorPlantHealth;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaArrowUp, FaArrowDown, FaHeartbeat, FaSeedling, FaChartLine } from 'react-icons/fa';
import NavigationBar from '../navbar/NavigationBar';
import bgImage from '../../images/bgImage.jpg';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const MonitorPlantHealth = () => {
  const [growthRate, setGrowthRate] = useState(0);
  const [diseaseSpreadRate, setDiseaseSpreadRate] = useState(0);
  const [yieldPredictionRate, setYieldPredictionRate] = useState(0);
  const [predictedResults, setPredictedResults] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [diseaseTypes, setDiseaseTypes] = useState([]);

  const [resultsPage, setResultsPage] = useState(1);
  const [resultsPerPage] = useState(5); // Number of rows per page for results summary

  const [predictionsPage, setPredictionsPage] = useState(1);
  const [predictionsPerPage] = useState(5); // Number of rows per page for predictions table

  const [dateFilter, setDateFilter] = useState('');
  const [diseaseFilter, setDiseaseFilter] = useState('');

  // Fetch data from the backend API
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/analytics/plantMetrics');
        setGrowthRate(response.data.growthRate);
        setDiseaseSpreadRate(response.data.diseaseSpreadRate);
        setYieldPredictionRate(response.data.yieldPredictionRate);
      } catch (error) {
        console.error('Error fetching plant metrics:', error);
      }
    };

    const fetchPredictedResults = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/analytics/predictedResults');
        setPredictedResults(response.data);
      } catch (error) {
        console.error('Error fetching predicted results:', error);
      }
    };

    const fetchPredictions = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/predictions/getAllPredictions');
        setPredictions(response.data);
      } catch (error) {
        console.error('Error fetching predictions:', error);
      }
    };

    const fetchDiseaseTypes = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/predictions/allDiseaseTypes');
        setDiseaseTypes(response.data);
      } catch (error) {
        console.error('Error fetching disease types:', error);
      }
    };

    fetchMetrics();
    fetchPredictedResults();
    fetchPredictions();
    fetchDiseaseTypes();
  }, []);

  const getStatusIndicator = (status) => {
    switch (status) {
      case 'Good':
        return <FaArrowUp className="text-green-500" />;
      case 'Moderate':
        return <FaArrowUp className="text-yellow-500" />;
      case 'Bad':
        return <FaArrowDown className="text-red-500" />;
      default:
        return <FaArrowUp className="text-gray-500" />;
    }
  };

  const handleDateFilterChange = (event) => setDateFilter(event.target.value);
  const handleDiseaseFilterChange = (event) => setDiseaseFilter(event.target.value);

  const filteredPredictions = predictions.filter((prediction) => {
    return (
      (!dateFilter || prediction.predictedDate === dateFilter) &&
      (!diseaseFilter || prediction.disease === diseaseFilter)
    );
  });

  // Pagination logic for results summary
  const resultsStartIndex = (resultsPage - 1) * resultsPerPage;
  const resultsPaginated = predictedResults.slice(resultsStartIndex, resultsStartIndex + resultsPerPage);

  // Pagination logic for predictions
  const predictionsStartIndex = (predictionsPage - 1) * predictionsPerPage;
  // const predictionsPaginated = predictions.slice(predictionsStartIndex, predictionsStartIndex + predictionsPerPage);
  const predictionsPaginated = filteredPredictions.slice(predictionsStartIndex, predictionsStartIndex + predictionsPerPage);

  const chartData = {
    labels: predictedResults.map((result) => result.date),
    datasets: [
      {
        label: 'Healthy Plants',
        data: predictedResults.map((result) => result.healthyCount),
        borderColor: 'green',
        backgroundColor: 'rgba(0, 128, 0, 0.2)',
      },
      {
        label: 'Diseased Plants',
        data: predictedResults.map((result) => result.diseasedCount),
        borderColor: 'red',
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <NavigationBar />

      <div
        className="flex-grow overflow-hidden px-10 pt-4"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="h-full flex flex-col bg-white bg-opacity-80 rounded-lg shadow p-4 mb-6">
          <div className="flex justify-between">
            <div className="w-1/3 px-4">
              <div className="bg-green-100 p-4 rounded-lg flex items-center">
                <FaSeedling className="text-green-500 text-3xl mr-4" />
                <div>
                  <p className="text-2xl font-bold">{growthRate}%</p>
                  <p className="text-gray-700">Growth Rate</p>
                </div>
              </div>
            </div>
            <div className="w-1/3 px-4">
              <div className="bg-red-100 p-4 rounded-lg flex items-center">
                <FaHeartbeat className="text-red-500 text-3xl mr-4" />
                <div>
                  <p className="text-2xl font-bold">{diseaseSpreadRate}%</p>
                  <p className="text-gray-700">Disease Spread Rate</p>
                </div>
              </div>
            </div>
            <div className="w-1/3 px-4">
              <div className="bg-blue-100 p-4 rounded-lg flex items-center">
                <FaChartLine className="text-blue-500 text-3xl mr-4" />
                <div>
                  <p className="text-2xl font-bold">{yieldPredictionRate}%</p>
                  <p className="text-gray-700">Yield Prediction Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white bg-opacity-90 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Results Summary Chart</h2>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <Line data={chartData} />
          </div>
        </div>

        <div className="h-full flex flex-col bg-white bg-opacity-90 rounded-lg shadow p-6 mb-6">
          <div className="mb-2">
            <h2 className="text-xl font-bold mb-4">Results Summary</h2>
            <div className="overflow-auto">
              <table className="w-full table-auto bg-white rounded shadow">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Healthy Plant Count</th>
                    <th className="px-4 py-2">Diseased Plant Count</th>
                    <th className="px-4 py-2">Overall Status</th>
                  </tr>
                </thead>
                <tbody>
                  {resultsPaginated.map((result, index) => (
                    <tr key={index} className="border-b hover:bg-gray-100">
                      <td className="px-4 py-2">{result.date}</td>
                      <td className="px-4 py-2">{result.healthyCount}</td>
                      <td className="px-4 py-2">{result.diseasedCount}</td>
                      <td className="px-4 py-2 flex items-center">
                        {getStatusIndicator(result.status)}
                        <span className="ml-2">{result.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination controls */}
              <div className="flex justify-center items-center mt-4">
                <button
                  onClick={() => setResultsPage((prev) => Math.max(prev - 1, 1))}
                  disabled={resultsPage === 1}
                  className="bg-gray-300 px-4 mx-2 py-2 rounded hover:bg-gray-400"
                >
                  Previous
                </button>
                <span>
                  Page {resultsPage} of {Math.ceil(predictedResults.length / resultsPerPage)}
                </span>
                <button
                  onClick={() => setResultsPage((prev) => Math.min(prev + 1, Math.ceil(predictedResults.length / resultsPerPage)))}
                  disabled={resultsPage === Math.ceil(predictedResults.length / resultsPerPage)}
                  className="bg-gray-300 px-4 mx-2 py-2 rounded hover:bg-gray-400"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="h-full flex flex-col bg-white bg-opacity-90 rounded-lg shadow p-6 mb-6">
          <div className="flex-grow overflow-auto">
            <h2 className="text-xl font-bold mb-4">Prediction Results</h2>
            <div className="flex space-x-4 mb-4">
              <input
                type="date"
                value={dateFilter}
                onChange={handleDateFilterChange}
                className="border px-4 py-2 rounded"
              />
              <select
                value={diseaseFilter}
                onChange={handleDiseaseFilterChange}
                className="border px-4 py-2 rounded"
              >
                <option value="">All Diseases</option>
                {diseaseTypes.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <table className="w-full table-auto bg-white rounded shadow">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="px-4 py-2">Plant Pot Number</th>
                  <th className="px-4 py-2">Detected Disease</th>
                  <th className="px-4 py-2">Confidence Level</th>
                  <th className="px-4 py-2">Predicted Date</th>
                </tr>
              </thead>
              <tbody>
                {predictionsPaginated.map((prediction, index) => (
                  <tr key={index} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-2">{prediction.potNumber}</td>
                    <td className={`px-4 py-2 ${prediction.disease === 'Healthy' ? 'text-green-500' : 'text-red-500'}`}>{prediction.disease}</td>
                    <td className="px-4 py-2">{prediction.confidence}%</td>
                    <td className="px-4 py-2">{prediction.predictedDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination controls */}
            <div className="flex justify-center items-center mt-4">
              <button
                onClick={() => setPredictionsPage((prev) => Math.max(prev - 1, 1))}
                disabled={predictionsPage === 1}
                className="bg-gray-300 px-4 mx-2 py-2 rounded hover:bg-gray-400"
              >
                Previous
              </button>
              <span>
                Page {predictionsPage} of {Math.ceil(predictions.length / predictionsPerPage)}
              </span>
              <button
                onClick={() => setPredictionsPage((prev) => Math.min(prev + 1, Math.ceil(predictions.length / predictionsPerPage)))}
                disabled={predictionsPage === Math.ceil(predictions.length / predictionsPerPage)}
                className="bg-gray-300 px-4 mx-2 py-2 rounded hover:bg-gray-400"
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

export default MonitorPlantHealth;


