import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ImageUpload from './components/imageUpload/ImageUpload';
import Login from './components/login/Login';
import AdminDashboard from './components/adminDashboard/AdminDashboard';
import ManageUser from './components/manageUser/ManageUser';
import ManagePlant from './components/managePlant/ManagePlant';
import ManageTasks from './components/manageTask/ManageTask';
import MonitorPlantHealth from './components/monitorPlantHealth/MonitorPlantHealth';
import WorkerDashboard from './components/workerDashboard/WorkerDashboard';
import PredictImage from './components/predictImage/PredictImage';
import PredictionResult from './components/predictionResult/PredictionResult';


// // Helper function to check if the user is authenticated
// const isAuthenticated = () => {
//   return !!localStorage.getItem('token'); // Check if the token exists in localStorage
// };

function App() {
  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/adminDashboard" element={<AdminDashboard />}/>
        <Route path="/manageUser" element={<ManageUser/>}/>
        <Route path="/managePlant" element={<ManagePlant/>}/>
        <Route path="/manageTask" element={<ManageTasks/>}/>
        <Route path="/monitorPlantHealth" element={<MonitorPlantHealth/>}/>

        <Route path="/workerDashboard" element={<WorkerDashboard/>}/>
        <Route path="/predictImage" element={<PredictImage/>}/>
        <Route path="/predictionResult" element={<PredictionResult/>} />

      </Routes>
    </Router>

    // <Router>
    // <Routes>
    //   {/* Login route */}
    //   <Route path="/login" element={<Login />} />

    //   {/* Protected route: Only accessible if authenticated */}
    //   <Route
    //     path="/image-upload"
    //     element={
    //       isAuthenticated() ? <ImageUpload /> : <Navigate to="/login" />
    //     }
    //   />

    //   {/* Redirect to login by default */}
    //   <Route path="*" element={<Navigate to="/login" />} />
    // </Routes>
    // </Router>
  )
}

export default App;

