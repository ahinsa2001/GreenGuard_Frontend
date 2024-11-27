// // ManagePlotPlant.jsx

// import React, { useState } from 'react';
// import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
// import NavigationBar from '../navbar/NavigationBar';
// import bgImage from '../../images/bgImage.jpg';

// const ManagePlant = () => {
//   // Sample plot data
//   const [plots, setPlots] = useState([
//     { id: 1, name: 'Plot A', plantType: 'Tomatoes', area: '500 sq ft' },
//     { id: 2, name: 'Plot B', plantType: 'Lettuce', area: '300 sq ft' },
//     // Add more plots as needed
//   ]);

//   // State for modal visibility
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
//   const [selectedPlot, setSelectedPlot] = useState(null);

//   // Form state
//   const [formData, setFormData] = useState({
//     name: '',
//     plantType: '',
//     area: '',
//   });

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // Open modal for adding or editing
//   const openModal = (mode, plot = null) => {
//     setModalMode(mode);
//     setIsModalOpen(true);
//     if (mode === 'edit' && plot) {
//       setSelectedPlot(plot);
//       setFormData({
//         name: plot.name,
//         plantType: plot.plantType,
//         area: plot.area,
//       });
//     } else {
//       setFormData({ name: '', plantType: '', area: '' });
//     }
//   };

//   // Close modal
//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedPlot(null);
//   };

//   // Handle form submission
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (modalMode === 'add') {
//       // Add new plot
//       const newPlot = {
//         id: plots.length + 1,
//         ...formData,
//       };
//       setPlots([...plots, newPlot]);
//     } else if (modalMode === 'edit') {
//       // Update existing plot
//       const updatedPlots = plots.map((plot) =>
//         plot.id === selectedPlot.id ? { ...plot, ...formData } : plot
//       );
//       setPlots(updatedPlots);
//     }
//     closeModal();
//   };

//   // Delete plot
//   // const deletePlot = (plotId) => {
//   //   const confirmed = window.confirm('Are you sure you want to delete this plot?');
//   //   if (confirmed) {
//   //     const updatedPlots = plots.filter((plot) => plot.id !== plotId);
//   //     setPlots(updatedPlots);
//   //   }
//   // };

//   const deletePlot = async (plotId) => {
//     const confirmed = window.confirm('Are you sure you want to delete this plot?');
//     if (confirmed) {
//       try {
//         await axios.delete(`http://localhost:8080/api/plants/delete/${plotId}`);
//         fetchPlots();  // Fetch updated list after deleting
//       } catch (error) {
//         console.error('Error deleting plot:', error);
//       }
//     }
//   };
  

//   return (
//     <div className="min-h-screen flex flex-col overflow-hidden">
//       {/* Navbar */}
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
//         <div className="h-full flex flex-col bg-white bg-opacity-80 rounded-lg shadow p-6">
//           {/* Header */}
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-2xl font-bold">Manage Plot Plants</h2>
//             <button
//               onClick={() => openModal('add')}
//               className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//             >
//               <FaPlus className="mr-2" />
//               Add New Plot
//             </button>
//           </div>

//           {/* Plot Table */}
//           <div className="flex-grow overflow-auto">
//             <table className="w-full table-auto bg-white rounded shadow">
//               <thead>
//                 <tr className="bg-gray-200 text-left">
//                   <th className="px-4 py-2">ID</th>
//                   <th className="px-4 py-2">Plot Name</th>
//                   <th className="px-4 py-2">Plant Type</th>
//                   <th className="px-4 py-2">Area</th>
//                   <th className="px-4 py-2">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {plots.map((plot) => (
//                   <tr key={plot.id} className="border-b hover:bg-gray-100">
//                     <td className="px-4 py-2">{plot.id}</td>
//                     <td className="px-4 py-2">{plot.name}</td>
//                     <td className="px-4 py-2">{plot.plantType}</td>
//                     <td className="px-4 py-2">{plot.area}</td>
//                     <td className="px-4 py-2">
//                       <button
//                         onClick={() => openModal('edit', plot)}
//                         className="text-yellow-500 hover:text-yellow-700 mr-4"
//                       >
//                         <FaEdit />
//                       </button>
//                       <button
//                         onClick={() => deletePlot(plot.id)}
//                         className="text-red-500 hover:text-red-700"
//                       >
//                         <FaTrashAlt />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Modal */}
//           {isModalOpen && (
//             <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//               <div className="bg-white rounded-lg shadow-lg w-1/3">
//                 <div className="px-6 py-4 flex items-center justify-between border-b">
//                   <h3 className="text-xl font-bold">
//                     {modalMode === 'add' ? 'Add New Plot' : 'Edit Plot'}
//                   </h3>
//                   <button onClick={closeModal} className="text-gray-600 hover:text-gray-800">
//                     ✕
//                   </button>
//                 </div>
//                 <form onSubmit={handleSubmit} className="p-6">
//                   <div className="mb-4">
//                     <label className="block text-gray-700 mb-2">Plot Name</label>
//                     <input
//                       type="text"
//                       name="name"
//                       value={formData.name}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 py-2 border rounded"
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 mb-2">Plant Type</label>
//                     <input
//                       type="text"
//                       name="plantType"
//                       value={formData.plantType}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 py-2 border rounded"
//                     />
//                   </div>
//                   <div className="mb-6">
//                     <label className="block text-gray-700 mb-2">Area</label>
//                     <input
//                       type="text"
//                       name="area"
//                       value={formData.area}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 py-2 border rounded"
//                     />
//                   </div>
//                   <div className="flex justify-end">
//                     <button
//                       type="button"
//                       onClick={closeModal}
//                       className="px-4 py-2 mr-2 text-gray-700 hover:text-gray-900"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//                     >
//                       {modalMode === 'add' ? 'Add Plot' : 'Save Changes'}
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManagePlant;


import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import NavigationBar from '../navbar/NavigationBar';
import bgImage from '../../images/bgImage.jpg';

const ManagePlant = () => {
  const [plots, setPlots] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [formData, setFormData] = useState({
    potNumber: '',
    plantType: '',
    userId: '',
  });

  // Fetch all plots from backend
  const fetchPlots = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/plants/all');
      setPlots(response.data);
    } catch (error) {
      console.error('Error fetching plots:', error);
    }
  };

  // useEffect to fetch plots on component mount
  useEffect(() => {
    fetchPlots();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Open modal for adding or editing
  const openModal = (mode, plot = null) => {
    setModalMode(mode);
    setIsModalOpen(true);
    if (mode === 'edit' && plot) {
      setSelectedPlot(plot);
      setFormData({
        potNumber: plot.potNumber,
        plantType: plot.plantType,
        userId: plot.userId,
      });
    } else {
      setFormData({ potNumber: '', plantType: '', userId: '' });
    }
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPlot(null);
  };

  // Handle form submission (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        // Add new plot
        await axios.post('http://localhost:8080/api/plants/add', formData);
      } else if (modalMode === 'edit') {
        // Update existing plot
        await axios.put(`http://localhost:8080/api/plants/update/${selectedPlot.id}`, formData);
      }
      fetchPlots(); // Refresh plots after submission
      closeModal();
    } catch (error) {
      console.error('Error saving plot:', error);
    }
  };

  // Delete plot
  const deletePlot = async (plotId) => {
    const confirmed = window.confirm('Are you sure you want to delete this plot?');
    if (confirmed) {
      try {
        await axios.delete(`http://localhost:8080/api/plants/delete/${plotId}`);
        fetchPlots(); // Refresh plots after deletion
      } catch (error) {
        console.error('Error deleting plot:', error);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {/* Navbar */}
      <NavigationBar />

      {/* Main Content */}
      <div
        className="flex-grow overflow-hidden px-10 pt-4"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="h-full flex flex-col bg-white bg-opacity-50 rounded-lg shadow p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Manage Plot Plants</h2>
            <button
              onClick={() => openModal('add')}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              <FaPlus className="mr-2" />
              Add New Plot
            </button>
          </div>

          {/* Plot Table */}
          <div className="flex-grow overflow-auto">
            <table className="w-full table-auto bg-white rounded shadow">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Pot Number</th>
                  <th className="px-4 py-2">Plant Type</th>
                  {/* <th className="px-4 py-2">User ID</th> */}
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {plots.map((plot) => (
                  <tr key={plot.id} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-2">{plot.id}</td>
                    <td className="px-4 py-2">{plot.potNumber}</td>
                    <td className="px-4 py-2">{plot.plantType}</td>
                    {/* <td className="px-4 py-2">{plot.userId}</td> */}
                    <td className="px-4 py-2">
                      <button
                        onClick={() => openModal('edit', plot)}
                        className="text-yellow-500 hover:text-yellow-700 mr-4"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deletePlot(plot.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg shadow-lg w-1/3">
                <div className="px-6 py-4 flex items-center justify-between border-b">
                  <h3 className="text-xl font-bold">
                    {modalMode === 'add' ? 'Add New Plot' : 'Edit Plot'}
                  </h3>
                  <button onClick={closeModal} className="text-gray-600 hover:text-gray-800">
                    ✕
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6">
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Pot Number</label>
                    <input
                      type="text"
                      name="potNumber"
                      value={formData.potNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Plant Type</label>
                    <input
                      type="text"
                      name="plantType"
                      value={formData.plantType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2">User ID</label>
                    <input
                      type="text"
                      name="userId"
                      value={formData.userId}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 mr-2 text-gray-700 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      {modalMode === 'add' ? 'Add Plot' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagePlant;
