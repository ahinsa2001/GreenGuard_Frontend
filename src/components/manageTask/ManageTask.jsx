// // ManageTasks.jsx
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   FaEdit,
//   FaTrashAlt,
//   FaPlus,
//   FaCheckCircle,
//   FaSpinner,
//   FaClock,
// } from 'react-icons/fa';
// import NavigationBar from '../navbar/NavigationBar';
// import bgImage from '../../images/bgImage.jpg';

// const ManageTasks = () => {
//   const [tasks, setTasks] = useState([]);

//   // Fetch tasks from the backend
//   useEffect(() => {
//     const fetchTasks = async () => {
//       try {
//         const response = await axios.get('http://localhost:8080/api/tasks/viewAllTasks');
//         setTasks(response.data);
//       } catch (error) {
//         console.error("Error fetching tasks:", error);
//       }
//     };
//     fetchTasks();
//   }, []);


//   // Total tasks
//   const totalTasks = tasks.length;

//   // Task counts
//   const completedTasks = tasks.filter((task) => task.status === 'Completed').length;
//   const inProgressTasks = tasks.filter((task) => task.status === 'In Progress').length;
//   const pendingTasks = tasks.filter((task) => task.status === 'Pending').length;

//   // Task rates
//   const completedRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;
//   const inProgressRate = totalTasks > 0 ? ((inProgressTasks / totalTasks) * 100).toFixed(1) : 0;
//   const pendingRate = totalTasks > 0 ? ((pendingTasks / totalTasks) * 100).toFixed(1) : 0;

//   return (
//     <div className="min-h-screen flex flex-col overflow-hidden">
//       {/* Navbar */}
//       <NavigationBar appName="My Web App" userName="Admin User" onLogout={() => {}} />

//       {/* Main Content */}
//       <div
//         className="flex-grow overflow-hidden px-10 pt-4"
//         style={{
//           backgroundImage: `url(${bgImage})`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//         }}
//       >
//         <div className="h-full flex flex-col bg-white bg-opacity-80 rounded-lg shadow p-6">
//           {/* Task Rates */}
//           <div className="flex justify-between mb-6">
//             <div className="w-1/3 px-4">
//               <div className="bg-green-100 p-4 rounded-lg flex items-center">
//                 <FaCheckCircle className="text-green-500 text-3xl mr-4" />
//                 <div>
//                   <p className="text-2xl font-bold">{completedRate}%</p>
//                   <p className="text-gray-700">Completed Task Rate</p>
//                 </div>
//               </div>
//             </div>
//             <div className="w-1/3 px-4">
//               <div className="bg-yellow-100 p-4 rounded-lg flex items-center">
//                 <FaSpinner className="text-yellow-500 text-3xl mr-4" />
//                 <div>
//                   <p className="text-2xl font-bold">{inProgressRate}%</p>
//                   <p className="text-gray-700">In Progress Task Rate</p>
//                 </div>
//               </div>
//             </div>
//             <div className="w-1/3 px-4">
//               <div className="bg-blue-100 p-4 rounded-lg flex items-center">
//                 <FaClock className="text-blue-500 text-3xl mr-4" />
//                 <div>
//                   <p className="text-2xl font-bold">{pendingRate}%</p>
//                   <p className="text-gray-700">Pending Task Rate</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Header */}
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-2xl font-bold">Monitor Tasks</h2>
//           </div>

//           {/* Task Table */}
//           <div className="flex-grow overflow-auto">
//             <table className="w-full table-auto bg-white rounded shadow">
//               <thead>
//                 <tr className="bg-gray-200 text-left">
//                   <th className="px-4 py-2">Plant Pot</th>
//                   {/* <th className="px-4 py-2">Treatment Step No</th> */}
//                   <th className="px-4 py-2">Treatment</th>
//                   <th className="px-4 py-2">Assigned User</th>
//                   <th className="px-4 py-2">Status</th>
//                   <th className="px-4 py-2">Assigned At</th>
//                   <th className="px-4 py-2">Completed At</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {tasks.map((task) => (
//                     <tr key={task.id} className="border-b hover:bg-gray-100">
//                       <td className="px-4 py-2">{task.plantPotNumber}</td>
//                       {/* <td className="px-4 py-2">{task.treatmentStepId}</td> */}
//                       <td className="px-4 py-2">{task.treatmentDescription}</td>
//                       <td className="px-4 py-2">{task.username}</td>
//                       <td className="px-4 py-2">{task.status}</td>
//                       <td className="px-4 py-2">{task.assignedAt}</td>
//                       <td className="px-4 py-2">{task.completedAt}</td>
//                     </tr>
//                   ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManageTasks;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaEdit,
  FaList,
  FaTrashAlt,
  FaPlus,
  FaCheckCircle,
  FaSpinner,
  FaClock,
  FaArrowLeft,
  FaArrowRight
} from 'react-icons/fa';
import NavigationBar from '../navbar/NavigationBar';
import bgImage from '../../images/bgImage.jpg';

const ManageTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  // Filter states
  const [statusFilter, setStatusFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [plantPotFilter, setPlantPotFilter] = useState('');
  const [assignedDateFilter, setAssignedDateFilter] = useState('');
  
  // Additional states for fetching users and plant pots
  const [users, setUsers] = useState([]);
  const [plantPots, setPlantPots] = useState([]);

  // Fetch tasks, users, and plant pots
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/tasks/viewAllTasks');
        setTasks(response.data);
        setFilteredTasks(response.data); // Set initial filtered tasks
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/users/all');
        setUsers(response.data.filter(user => user.role === "User"));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchPlantPots = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/plants/all');
        setPlantPots(response.data);
      } catch (error) {
        console.error("Error fetching plant pots:", error);
      }
    };

    fetchTasks();
    fetchUsers();
    fetchPlantPots();
  }, []);

  // Total tasks and rates
  const totalTasks = tasks.length;
  const totalTaskCount = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === 'Completed').length;
  const pendingTasks = tasks.filter((task) => task.status === 'Pending').length;

  const completedRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;
  const pendingRate = totalTasks > 0 ? ((pendingTasks / totalTasks) * 100).toFixed(1) : 0;

  // Filter the tasks based on selected filters
  useEffect(() => {
    let filtered = tasks;

    if (statusFilter) filtered = filtered.filter(task => task.status === statusFilter);
    if (userFilter) filtered = filtered.filter(task => task.username === userFilter);
    if (plantPotFilter) filtered = filtered.filter(task => task.plantPotNumber === plantPotFilter);
    if (assignedDateFilter) filtered = filtered.filter(task => task.formattedAssignedAt.includes(assignedDateFilter));

    setFilteredTasks(filtered);
    setCurrentPage(1); // Reset to the first page after filtering
  }, [statusFilter, userFilter, plantPotFilter, assignedDateFilter, tasks]);

  // Pagination calculations
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  const nextPage = () => setCurrentPage((prevPage) => (prevPage < totalPages ? prevPage + 1 : prevPage));
  const prevPage = () => setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {/* Navbar */}
      <NavigationBar appName="My Web App" userName="Admin User" onLogout={() => {}} />

      {/* Main Content */}
      <div
        className="flex-grow overflow-hidden px-10 pt-4"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="h-full flex flex-col bg-white bg-opacity-40 rounded-lg shadow p-6">
          {/* Task Rates */}
          <div className="flex justify-between mb-6">
            <div className="w-1/3 px-4">
              <div className="bg-gray-100 p-4 rounded-lg flex items-center">
                <FaList className="text-gray-600 text-3xl mr-4" />
                <div>
                  <p className="text-2xl font-bold">{totalTaskCount}</p>
                  <p className="text-gray-700">Total Number of Tasks</p>
                </div>
              </div>
            </div>
            <div className="w-1/3 px-4">
              <div className="bg-green-100 p-4 rounded-lg flex items-center">
                <FaCheckCircle className="text-green-500 text-3xl mr-4" />
                <div>
                  <p className="text-2xl font-bold">{completedRate}%</p>
                  <p className="text-gray-700">Completed Task Rate</p>
                </div>
              </div>
            </div>
            <div className="w-1/3 px-4">
              <div className="bg-blue-100 p-4 rounded-lg flex items-center">
                <FaClock className="text-blue-500 text-3xl mr-4" />
                <div>
                  <p className="text-2xl font-bold">{pendingRate}%</p>
                  <p className="text-gray-700">Pending Task Rate</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* <div className="flex justify-between mb-6">
            <div className="w-1/3 px-4">
              <div className="bg-green-100 p-4 rounded-lg flex items-center">
                <FaCheckCircle className="text-green-500 text-3xl mr-4" />
                <div>
                  <p className="text-2xl font-bold">{completedRate}%</p>
                  <p className="text-gray-700">Completed Task Rate</p>
                </div>
              </div>
            </div>
            <div className="w-1/3 px-4">
              <div className="bg-yellow-100 p-4 rounded-lg flex items-center">
                <FaSpinner className="text-yellow-500 text-3xl mr-4" />
                <div>
                  <p className="text-2xl font-bold">{totalTaskCount}</p>
                  <p className="text-gray-700">Total Tasks</p>
                </div>
              </div>
            </div>
            <div className="w-1/3 px-4">
              <div className="bg-blue-100 p-4 rounded-lg flex items-center">
                <FaClock className="text-blue-500 text-3xl mr-4" />
                <div>
                  <p className="text-2xl font-bold">{pendingRate}%</p>
                  <p className="text-gray-700">Pending Task Rate</p>
                </div>
              </div>
            </div>
          </div> */}
          

          {/* Filter Options */}
          <div className="flex space-x-4 mb-4">
            <select
              className="border rounded px-3 py-2"
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
            >
              <option value="">Filter by User</option>
              {users.map(user => (
                <option key={user.id} value={user.name}>{user.name}</option>
              ))}
            </select>

            <select
              className="border rounded px-3 py-2"
              value={plantPotFilter}
              onChange={(e) => setPlantPotFilter(e.target.value)}
            >
              <option value="">Filter by Plant Pot</option>
              {plantPots.map(plantPot => (
                <option key={plantPot.id} value={plantPot.potNumber}>{plantPot.potNumber}</option>
              ))}
            </select>

            <select
              className="border rounded px-3 py-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Filter by Status</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
            </select>

            <input
              type="date"
              className="border rounded px-3 py-2"
              value={assignedDateFilter}
              onChange={(e) => setAssignedDateFilter(e.target.value)}
            />
          </div>

          {/* Task Table */}
          <div className="flex-grow overflow-auto">
            <table className="w-full table-auto bg-white rounded shadow">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="px-4 py-2">Plant Pot</th>
                  <th className="px-4 py-2">Treatment</th>
                  <th className="px-4 py-2">Assigned User</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Assigned At</th>
                  <th className="px-4 py-2">Completed At</th>
                </tr>
              </thead>
              <tbody>
                {currentTasks.map((task) => (
                  <tr key={task.id} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-2">{task.plantPotNumber}</td>
                    <td className="px-4 py-2">{task.treatmentDescription}</td>
                    <td className="px-4 py-2">{task.username}</td>
                    <td className="px-4 py-2">{task.status}</td>
                    <td className="px-4 py-2">{task.formattedAssignedAt}</td>
                    <td className="px-4 py-2">{task.formattedCompletedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {/* <div className="flex justify-center items-center mt-4">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`mx-2 p-2 rounded ${currentPage === 1 ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
            >
              <FaArrowLeft />
            </button>
            <span className="mx-4 text-lg font-sans">{currentPage}</span>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`mx-2 p-2 rounded ${currentPage === totalPages ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
            >
              <FaArrowRight />
            </button>
          </div> */}
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
  );
};

export default ManageTasks;
