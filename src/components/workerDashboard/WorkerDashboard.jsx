// WorkerDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  FaLeaf,
  FaTasks,
  FaHeartbeat,
  FaCheckSquare,
  FaSquare,
  FaInfoCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaBell,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import NavigationBar from '../navbar/NavigationBar';
import bgImage from '../../images/bgImage.jpg';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

const WorkerDashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [allNotifications, setAllNotifications] = useState([]);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [predictedResults, setPredictedResults] = useState([]);
  const [isDaily, setIsDaily] = useState(true); // State to toggle between daily and monthly data
  const [filterDate, setFilterDate] = useState('');
  const [filterMonth, setFilterMonth] = useState('');

  // Add a new state to store task completion stats
  const [taskCompletionStats, setTaskCompletionStats] = useState({
    completedTasks: 0,
    pendingTasks: 0,
  });

  // Fetch limited notifications on component mount
  useEffect(() => {
    fetchNotifications();
    fetchPredictedResults();
    fetchTaskCompletionStats();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/notifications/user?limit=3`, {
        withCredentials: true, // This sends cookies along with the request
      });
      setNotifications(response.data); // Set limited notifications
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Fetch all notifications when 'View More' is clicked
  const fetchAllNotifications = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/notifications/user/all`, {
        withCredentials: true, // This sends cookies along with the request
      });
      setAllNotifications(response.data); // Set all notifications
      setIsNotificationModalOpen(true); // Open modal
    } catch (error) {
      console.error('Error fetching all notifications:', error);
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

  // Function to fetch task completion stats
  const fetchTaskCompletionStats = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/tasks/completionStats', {
        withCredentials: true, // Send cookies for authentication
      });
      setTaskCompletionStats(response.data); // Update state with stats
    } catch (error) {
      console.error('Error fetching task completion stats:', error);
    }
  };

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

  // Dynamically generate data for the Doughnut chart
  const getTasksCompletenessData = () => ({
    labels: ['Completed', 'Pending'], // Labels for chart sections
    datasets: [
      {
        data: [taskCompletionStats.completedTasks, taskCompletionStats.pendingTasks], // Use fetched stats
        backgroundColor: ['#34d399', '#f87171'], // Colors for completed and pending
        hoverBackgroundColor: ['#10b981', '#ef4444'], // Hover colors
      },
    ],
  });

  const translateToSinhala = () => {
    const translatedTasks = tasks.map(task => ({
      ...task,
      instruction: task.sinhalaInstruction || task.instruction,
    }));
    setTasks(translatedTasks);
  };

  const [isSinhala, setIsSinhala] = useState(false); // Track language state

  const toggleLanguage = () => {
    if (isSinhala) {
      // Switch back to English
      const englishTasks = tasks.map(task => ({
        ...task,
        instruction: task.originalInstruction || task.instruction, // Revert to original instruction
      }));
      setTasks(englishTasks);
    } else {
      // Switch to Sinhala
      const sinhalaTasks = tasks.map(task => ({
        ...task,
        originalInstruction: task.originalInstruction || task.instruction, // Save original instruction (English)
        instruction: task.sinhalaInstruction || task.instruction, // Use Sinhala if available
      }));
      setTasks(sinhalaTasks);
    }
    setIsSinhala(!isSinhala); // Toggle the language state
  };


  // State to hold tasks data
  const [tasks, setTasks] = useState([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Fetch tasks from backend when the modal is opened
  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/tasks/get', {
        withCredentials: true, // This sends cookies along with the request
      });

      // Check if tasks have already been set
    if (tasks.length === 0) {
      // Set tasks with originalCompletedStatus to track changes
      const fetchedTasks = response.data.map(task => ({
        ...task,
        originalCompletedStatus: task.completed, // Store the original completed status
      }));

      // Filter tasks to show only pending tasks
      const pendingTasks = response.data.filter((task) => task.status === 'Pending');
      setTasks(pendingTasks);
      // setTasks(response.data);
    }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    if (isTaskModalOpen) {
      fetchTasks(); // Fetch tasks when the modal opens
    }
  }, [isTaskModalOpen]);

  // Handle task completion toggle
  const handleTaskToggle = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  // Handle saving tasks (updates the database)
  const handleSaveTasks = async () => {
    // First, check if any tasks were toggled (completed or unchecked)
    const isAnyTaskToggled = tasks.some(task => task.completed !== task.originalCompletedStatus);

    if (!isAnyTaskToggled) {
      // If no tasks were toggled, show an alert or a validation error message
      alert('Please select at least one task before saving.');
      return; // Stop here, don't proceed with the save
    }

    try {
      const completedTasks = tasks.map((task) => ({
        id: task.id,
        status: task.completed ? 'Completed' : 'Pending', // Map 'completed' to 'status'
        completedAt: task.completed ? new Date().toISOString() : null // Set 'completedAt' if task is completed
      }));

      await axios.post('http://localhost:8080/api/tasks/update', completedTasks, {
        withCredentials: true, // This sends cookies along with the request
      }); 

      setIsTaskModalOpen(false);
      fetchTaskCompletionStats(); // Refresh chart stats after saving
      alert('Tasks marked as completed!');
    } catch (error) {
      console.error('Error updating tasks:', error);
    }
  };


  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {/* Navbar */}
      <NavigationBar appName="My Web App" userName="Worker User" onLogout={() => {}} />

      {/* Main Content */}
      <div
        className="flex-grow overflow-hidden px-10 pt-4"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="h-full flex flex-col">
          {/* First Row */}
          <div className="flex flex-1 mb-4">
            {/* Disease Spread Chart */}
            <div className="w-1/2 bg-white bg-opacity rounded-lg shadow p-4 flex flex-col">
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

              {/* Filter the data to include only the selected month or current month */}
              <div className="flex-1" style={{ height: '200px' }}>
                {(() => {
                  const currentDate = new Date();
                  const currentYearMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
                  const selectedMonth = filterMonth || currentYearMonth;

                  // Filter data for the selected month
                  const filteredData = predictedResults.filter((predictedResult) => {
                    const resultDate = new Date(predictedResult.date);
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
                        // data: filteredData.map((result) => result.diseasedCount),
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
            <div className="w-1/2 bg-white bg-opacity rounded-lg shadow p-4 flex flex-col ml-3">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-left">Notifications</h2>
                <button
                  onClick={fetchAllNotifications}
                  className="text-sm text-blue-500 hover:underline mr-2"
                >
                  View All
                </button>
              </div>
              {notifications.length > 0 ? (
                <ul className="space-y-2 overflow-y-auto max-h-[200px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {notifications.map((notification) => (
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


            {/* All Notifications Modal */}
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
                    {allNotifications.length > 0 ? (
                      <ul className="space-y-2">
                        {allNotifications.map((notification) => (
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
          </div>

          {/* Second Row */}
          <div className="flex flex-1">
            {/* Quick Actions */}
            <div className="w-1/2 bg-white bg-opacity rounded-lg shadow p-4 flex flex-col mr-2">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="flex flex-col space-y-4">
                <Link to="/predictImage">
                  <div className="bg-green-100 p-4 rounded-lg flex items-center cursor-pointer hover:bg-green-200">
                    <FaHeartbeat className="text-green-500 text-2xl mr-4" />
                    <span className="text-lg font-semibold">Disease Prediction</span>
                  </div>
                </Link>
                <Link to="/predictionResult">
                  <div className="bg-blue-100 p-4 rounded-lg flex items-center cursor-pointer hover:bg-blue-200">
                    <FaLeaf className="text-blue-500 text-2xl mr-4" />
                    <span className="text-lg font-semibold">View Prediction Results</span>
                  </div>
                </Link>
                <button
                  onClick={() => setIsTaskModalOpen(true)}
                  className="bg-yellow-100 p-4 rounded-lg flex items-center cursor-pointer hover:bg-yellow-200"
                >
                  <FaTasks className="text-yellow-500 text-2xl mr-4" />
                  <span className="text-lg font-semibold">View Pending Task List</span>
                </button>
              </div>
            </div>


            {/* Tasks Completeness */}
            <div className="w-1/2 bg-white bg-opacity rounded-lg shadow p-4 flex flex-col ml-2">
              <h2 className="text-xl font-bold mb-4">Tasks Completeness</h2>
              <div className="flex-1 flex items-center justify-center">
                {taskCompletionStats.completedTasks + taskCompletionStats.pendingTasks > 0 ? (
                  <Doughnut
                    data={getTasksCompletenessData()}
                    options={{
                      maintainAspectRatio: false,
                      plugins: {
                        tooltip: {
                          callbacks: {
                            label: function (tooltipItem) {
                              const dataset = tooltipItem.dataset;
                              const total = dataset.data.reduce((prev, curr) => prev + curr, 0);
                              const value = dataset.data[tooltipItem.dataIndex];
                              const percentage = ((value / total) * 100).toFixed(2);
                              return `${value} (${percentage}%)`;
                            },
                          },
                        },
                      },
                    }}
                  />
                ) : (
                  <p className="text-gray-500">No tasks available</p>
                )}
              </div>
            </div>


          </div>
        </div>


        {/* Task Model */}
        {isTaskModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-3/6 max-h-[95vh] overflow-hidden">
              <div className="px-6 py-4 flex items-center justify-between border-b">
                <h3 className="text-xl font-bold">Your Tasks</h3>
                
                <button
                  onClick={() => setIsTaskModalOpen(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  ✕
                </button>

              </div>
              {/* Scrollable content area */}
              <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
                {/* Grouping tasks by plantId */}
                {Object.entries(
                  tasks.reduce((acc, task) => {
                    if (!acc[task.plantId]) {
                      acc[task.plantId] = [];
                    }
                    acc[task.plantId].push(task);
                    return acc;
                  }, {})
                ).map(([plantId, plantTasks]) => (
                  <div key={plantId} className="bg-gray-100 rounded-lg p-4 shadow-sm">
                    <h4 className="text-lg font-semibold flex items-center mb-4">
                      <FaLeaf className="text-green-500 mr-2" />
                      Plant Pot Number: {plantId}
                    </h4>
                    <ul className="space-y-3">
                      {plantTasks.map((task) => (
                        <li key={task.id} className="flex items-start">
                          <button
                            onClick={() => handleTaskToggle(task.id)}
                            className="mr-4 text-2xl focus:outline-none"
                          >
                            {task.completed ? (
                              <FaCheckSquare className="text-green-500" />
                            ) : (
                              <FaSquare className="text-gray-500" />
                            )}
                          </button>
                          <div className="flex flex-col">
                            <span
                              className={`text-base ${
                                task.completed ? 'line-through text-gray-500' : ''
                              }`}
                            >
                              {task.instruction}
                            </span>
                            <span className="text-sm text-gray-400">
                              Treatment ID {task.treatmentStepId}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-6 px-6 py-4 border-t">
              <button
                  onClick={toggleLanguage}
                  className={`px-4 py-2 mr-2 text-white rounded font-normal shadow-md transition duration-300 ease-in-out ${
                    isSinhala
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                > 
                  {isSinhala ? 'Translate to English' : 'Translate to Sinhala'}
                </button>
                
                <button
                  onClick={handleSaveTasks}
                  className="px-4 py-2 mr-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Complete Treatment
                </button>

                <button
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}


      </div>
    </div>
  );
};

export default WorkerDashboard;
