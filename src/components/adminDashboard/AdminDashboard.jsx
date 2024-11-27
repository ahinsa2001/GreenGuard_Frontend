// AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  FaUser,
  FaLeaf,
  FaTasks,
  FaHeartbeat,
  FaBell,
  FaInfoCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaSeedling,
  FaChartLine,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import bgImage from '../../images/bgImage.jpg';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import NavigationBar from '../navbar/NavigationBar';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [isDaily, setIsDaily] = useState(true); // State to toggle between daily and monthly data
  const [isDayView, setIsDayView] = useState(true); // New state for disease count chart
  const [filterDate, setFilterDate] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [predictedResults, setPredictedResults] = useState([]);
  const [growthRate, setGrowthRate] = useState(0);
  const [diseaseSpreadRate, setDiseaseSpreadRate] = useState(0);
  const [yieldPredictionRate, setYieldPredictionRate] = useState(0);

  
  // Notifications
  const [notifications, setNotifications] = useState([]);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  // Fetch all notifications on component mount
  useEffect(() => {
    fetchAllNotifications();
    fetchPredictions();
    fetchPredictedResults();
    fetchMetrics();
  }, []);

  const fetchAllNotifications = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/notifications/all`);
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

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

  const fetchPredictions = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/predictions/getAllPredictions');
      setPredictions(response.data);
    } catch (error) {
      console.error("Error fetching predictions:", error);
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


  // Filtering logic for daily and monthly views
  const filteredPredictions = predictions.filter(prediction => {
    const predictionDate = new Date(prediction.predictedDate);
    
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

  // Function to get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'info':
        return <FaInfoCircle className="text-blue-500 mr-2" />;
      case 'warning':
        return <FaExclamationTriangle className="text-yellow-500 mr-2" />;
      case 'danger':
        return <FaTimesCircle className="text-red-500 mr-2" />;
      case 'alert':
        return <FaBell className="text-green-500 mr-2" />;
      default:
        return <FaInfoCircle className="text-gray-500 mr-2" />;
    }
  };
  
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

  return (
    <div className="overflow-hidden">
      {/* Navbar */}
      <NavigationBar />

      <div
        className="grid grid-rows-[2fr,2fr,1fr] grid-cols-2 gap-4 h-screen px-20 pt-4"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >

        {/* First Row */}
        <div className="row-span-1 col-span-1 bg-white bg-opacity rounded-lg shadow p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Disease Spread Chart</h2>
            <div>
            <input
              type="month"
              className="border rounded ml-2 px-1 py-1"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
            />
            </div>
          </div>

          {/* Chart Container with Fixed Height */}
          <div className="flex-1" style={{ height: '200px' }}>
          {(() => {
              const currentDate = new Date();
              const currentYearMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
              const selectedMonth = filterMonth || currentYearMonth;

              // Filter data for the selected month
              const filteredData = predictedResults.filter((result) => {
                const resultDate = new Date(result.date);
                const resultYearMonth = `${resultDate.getFullYear()}-${String(resultDate.getMonth() + 1).padStart(2, '0')}`;
                return resultYearMonth === selectedMonth;
              });

              if (filteredData.length === 0) {
                return (
                  <div
                    className="flex justify-center items-center h-full text-red-500"
                    style={{ height: '200px' }}
                  >
                    No data available for the selected month.
                  </div>
                );
              }

              // Sort filtered data by date
              const sortedData = filteredData.sort((a, b) => new Date(a.date) - new Date(b.date));

              // Extract sorted labels and data
              const sortedLabels = sortedData.map((result) => result.date);
              const sortedHealthyCounts = sortedData.map((result) => result.healthyCount);
              const sortedDiseasedCounts = sortedData.map((result) => result.diseasedCount);

              // Chart data
              const chartData = {
                labels: sortedLabels,
                datasets: [
                  {
                    label: 'Healthy Plants',
                    data: sortedHealthyCounts,
                    borderColor: 'green',
                    backgroundColor: 'rgba(0, 128, 0, 0.2)',
                  },
                  {
                    label: 'Diseased Plants',
                    data: sortedDiseasedCounts,
                    borderColor: 'red',
                    backgroundColor: 'rgba(255, 0, 0, 0.2)',
                  },
                ],
              };

              return (
                <Line
                  data={chartData}
                  options={{
                    maintainAspectRatio: false,
                    responsive: true,
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: 'Date',
                        },
                        ticks: {
                          autoSkip: true,
                          maxTicksLimit: 10,
                        },
                      },
                      y: {
                        title: {
                          display: true,
                          text: 'Count',
                        },
                        beginAtZero: true,
                      },
                    },
                  }}
                  height={200} // Set height for better visibility
                />
              );
            })()}
          </div>
        </div>

        {/* Notifications Section */}
        <div className="row-span-1 col-span-1 bg-white bg-opacity rounded-lg shadow p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-left">Notifications</h2>
            <button
              onClick={() => setIsNotificationModalOpen(true)}
              className="text-sm text-blue-500 hover:underline"
            >
              View All
            </button>
          </div>
          {notifications.length > 0 ? (
            <ul className="space-y-2 overflow-y-auto max-h-[200px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {notifications.slice(0, 3).map((notification) => (
                <li
                  key={notification.id}
                  className={`flex items-start p-2 rounded-lg shadow-sm ${
                    notification.status === 'info'
                      ? 'bg-blue-100'
                      : notification.status === 'warning'
                      ? 'bg-yellow-100'
                      : notification.status === 'danger'
                      ? 'bg-red-100'
                      : 'bg-green-100'
                  }`}
                >
                  <div className="mr-3 text-xl mt-1 ml-1">
                    {getNotificationIcon(notification.status)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {notification.description}
                    </p>
                    <span className="text-xs text-gray-500">
                      {new Date(notification.ndate).toLocaleString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center text-gray-500">No notifications available</div>
          )}
        </div>


        {/* All Notifications Overlay */}
        {isNotificationModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-1/3 max-h-[95vh] overflow-hidden">
              <div className="px-6 py-4 flex items-center justify-between border-b">
                <h3 className="text-xl font-bold">All Notifications</h3>
                <button
                  onClick={() => setIsNotificationModalOpen(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  ✕
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[60vh] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {notifications.length > 0 ? (
                  <ul className="space-y-2">
                    {notifications.map((notification) => (
                      <li
                        key={notification.id}
                        className={`flex items-start p-3 rounded-lg shadow-sm ${
                          notification.status === 'info'
                            ? 'bg-blue-100'
                            : notification.status === 'warning'
                            ? 'bg-yellow-100'
                            : notification.status === 'danger'
                            ? 'bg-red-100'
                            : 'bg-green-100'
                        }`}
                      >
                        <div className="mr-3 text-xl mt-1 ml-1">
                          {getNotificationIcon(notification.status)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            {notification.description}
                          </p>
                          <span className="text-xs text-gray-500">
                            {new Date(notification.ndate).toLocaleString()}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center text-gray-500">No notifications available</div>
                )}
              </div>
              <div className="flex justify-end mt-6 px-6 py-4 border-t">
                <button
                  onClick={() => setIsNotificationModalOpen(false)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      
        {/* Second Row */}
        <div className="row-span-1 col-span-1 bg-white bg-opacity rounded-lg shadow p-6 flex flex-col">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-left">Plant Health Metrics</h2>
        </div>
        
        {/* Growth Rate Metric */}
        <div className="bg-green-100 p-6 rounded-lg flex items-center justify-between shadow mb-4" style={{ height: '70px' }}>
          <div className="flex items-center">
            <FaSeedling className="text-green-500 text-4xl mr-4" />
            <p className="text-gray-700 text-lg font-semibold">Growth Rate</p>
          </div>
          <p className="text-3xl font-bold text-green-500">{growthRate}%</p>
        </div>

        {/* Disease Spread Rate Metric */}
        <div className="bg-red-100 p-6 rounded-lg flex items-center justify-between shadow" style={{ height: '70px' }}>
          <div className="flex items-center">
            <FaHeartbeat className="text-red-500 text-4xl mr-4" />
            <p className="text-gray-700 text-lg font-semibold">Disease Spread Rate</p>
          </div>
          <p className="text-3xl font-bold text-red-500">{diseaseSpreadRate}%</p>
        </div>
      </div>

        {/* Disease Count Chart */}
        <div className="row-span-1 col-span-1 bg-white bg-opacity rounded-lg shadow p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Disease Count Chart</h2>
            <div>
              <button onClick={() => { setIsDaily(true); setFilterMonth(''); }} className={`px-3 py-1 rounded-l-lg ${isDaily ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                Daily
              </button>
              <button onClick={() => { setIsDaily(false); setFilterDate(''); }} className={`px-3 py-1 rounded-r-lg ${!isDaily ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                Monthly
              </button>

                {isDaily ? (
                <input
                  type="date"
                  className="border rounded ml-2 px-1 py-1"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              ) : (
                <input
                  type="month"
                  className="border rounded ml-2 px-1 py-1"
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                />
              )}
            </div>
          </div>
          <div className="flex space-x-4 mb-1 justify-end">
          </div>
          <div className="flex-1 mt-4">
                <Bar data={diseaseCountData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Third Row */}
        <div className="row-span-1 col-span-2 grid grid-cols-4 gap-4">
          <Link to="/manageUser">
            <div className="bg-white bg-opacity rounded-lg shadow p-3 flex items-center justify-center cursor-pointer hover:bg-gray-100">
              <FaUser className="text-2xl text-blue-500 mr-2" />
              <span className="text-lg font-semibold">Manage Users</span>
            </div>
          </Link>
          <Link to="/managePlant">
            <div className="bg-white bg-opacity rounded-lg shadow p-3 flex items-center justify-center cursor-pointer hover:bg-gray-100">
              <FaLeaf className="text-2xl text-green-500 mr-2" />
              <span className="text-lg font-semibold">Manage Plot Plants</span>
            </div>
          </Link>
          <Link to="/manageTask">
            <div className="bg-white bg-opacity rounded-lg shadow p-3 flex items-center justify-center cursor-pointer hover:bg-gray-100">
              <FaTasks className="text-2xl text-yellow-500 mr-2" />
              <span className="text-lg font-semibold">Monitor Tasks</span>
            </div>
          </Link>
          <Link to="/monitorPlantHealth">
            <div className="bg-white bg-opacity rounded-lg shadow p-3 flex items-center justify-center cursor-pointer hover:bg-gray-100">
              <FaHeartbeat className="text-2xl text-red-500 mr-2" />
              <span className="text-lg font-semibold">Monitor Plant Health</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;


