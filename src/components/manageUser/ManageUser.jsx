// // ManageUser.jsx

// import React, { useState, useEffect } from 'react';
// import NavigationBar from '../navbar/NavigationBar';
// import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
// import bgImage from '../../images/bgImage.jpg';

// const ManageUser = () => {
//   // Sample user data
//   const [users, setUsers] = useState([
//     { id: 1, name: 'Alice Smith', email: 'alice@example.com', role: 'Admin' },
//     { id: 2, name: 'Bob Johnson', email: 'bob@example.com', role: 'User' },
//     // Add more users as needed
//   ]);

//   // State for modal visibility
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
//   const [selectedUser, setSelectedUser] = useState(null);

//   // Form state
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     role: '',
//   });

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // Open modal for adding or editing
//   const openModal = (mode, user = null) => {
//     setModalMode(mode);
//     setIsModalOpen(true);
//     if (mode === 'edit' && user) {
//       setSelectedUser(user);
//       setFormData({
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       });
//     } else {
//       setFormData({ name: '', email: '', role: '' });
//     }
//   };

//   // Close modal
//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedUser(null);
//   };

//   // Handle form submission
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (modalMode === 'add') {
//       // Add new user
//       const newUser = {
//         id: users.length + 1,
//         ...formData,
//       };
//       setUsers([...users, newUser]);
//     } else if (modalMode === 'edit') {
//       // Update existing user
//       const updatedUsers = users.map((user) =>
//         user.id === selectedUser.id ? { ...user, ...formData } : user
//       );
//       setUsers(updatedUsers);
//     }
//     closeModal();
//   };

//   // Delete user
//   const deleteUser = (userId) => {
//     const confirmed = window.confirm('Are you sure you want to delete this user?');
//     if (confirmed) {
//       const updatedUsers = users.filter((user) => user.id !== userId);
//       setUsers(updatedUsers);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col">
//       {/* Navbar */}
//       <NavigationBar/>

//       {/* Main Content */}
//       <div className="flex-grow overflow-hidden p-6 bg-gray-100"
//         style={{
//             backgroundImage: `url(${bgImage})`,
//             backgroundSize: 'cover',
//             backgroundPosition: 'center',
//           }}
//       >
//         <div className="h-full flex flex-col bg-white bg-opacity-80 rounded-lg shadow p-6">
//           {/* Header */}
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-2xl font-bold">Manage Users</h2>
//             <button
//               onClick={() => openModal('add')}
//               className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//             >
//               <FaPlus className="mr-2" />
//               Add New User
//             </button>
//           </div>

//           {/* User Table */}
//           <div className="flex-grow overflow-auto">
//             <table className="w-full table-auto bg-white rounded shadow">
//               <thead>
//                 <tr className="bg-gray-200 text-left">
//                   <th className="px-4 py-2">ID</th>
//                   <th className="px-4 py-2">Name</th>
//                   <th className="px-4 py-2">Email</th>
//                   <th className="px-4 py-2">Role</th>
//                   <th className="px-4 py-2">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.map((user) => (
//                   <tr key={user.id} className="border-b hover:bg-gray-100">
//                     <td className="px-4 py-2">{user.id}</td>
//                     <td className="px-4 py-2">{user.name}</td>
//                     <td className="px-4 py-2">{user.email}</td>
//                     <td className="px-4 py-2">{user.role}</td>
//                     <td className="px-4 py-2">
//                       <button
//                         onClick={() => openModal('edit', user)}
//                         className="text-yellow-500 hover:text-yellow-700 mr-4"
//                       >
//                         <FaEdit />
//                       </button>
//                       <button
//                         onClick={() => deleteUser(user.id)}
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
//                     {modalMode === 'add' ? 'Add New User' : 'Edit User'}
//                   </h3>
//                   <button onClick={closeModal} className="text-gray-600 hover:text-gray-800">
//                     ✕
//                   </button>
//                 </div>
//                 <form onSubmit={handleSubmit} className="p-6">
//                   <div className="mb-4">
//                     <label className="block text-gray-700 mb-2">Name</label>
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
//                     <label className="block text-gray-700 mb-2">Email</label>
//                     <input
//                       type="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 py-2 border rounded"
//                     />
//                   </div>
//                   <div className="mb-6">
//                     <label className="block text-gray-700 mb-2">Role</label>
//                     <select
//                       name="role"
//                       value={formData.role}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 py-2 border rounded"
//                     >
//                       <option value="">Select Role</option>
//                       <option value="Admin">Admin</option>
//                       <option value="User">User</option>
//                       {/* Add more roles as needed */}
//                     </select>
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
//                       className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                     >
//                       {modalMode === 'add' ? 'Add User' : 'Save Changes'}
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

// export default ManageUser;


// ManageUser.jsx

// import React, { useState } from 'react';
// import NavigationBar from '../navbar/NavigationBar';
// import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
// import bgImage from '../../images/bgImage.jpg';

// const ManageUser = () => {
//   // Sample user data
//   const [users, setUsers] = useState([
//     { id: 1, name: 'Alice Smith', email: 'alice@example.com', contact: '123-456-7890', role: 'Admin', status: 'Active' },
//     { id: 2, name: 'Bob Johnson', email: 'bob@example.com', contact: '987-654-3210', role: 'User', status: 'Inactive' },
//     // Add more users as needed
//   ]);

//   // State for modal visibility
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
//   const [selectedUser, setSelectedUser] = useState(null);

//   // Form state
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     contact: '',
//     role: '',
//     status: '',
//   });

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // Open modal for adding or editing
//   const openModal = (mode, user = null) => {
//     setModalMode(mode);
//     setIsModalOpen(true);
//     if (mode === 'edit' && user) {
//       setSelectedUser(user);
//       setFormData({
//         name: user.name,
//         email: user.email,
//         contact: user.contact,
//         role: user.role,
//         status: user.status,
//       });
//     } else {
//       setFormData({ name: '', email: '', contact: '', role: '', status: '' });
//     }
//   };

//   // Close modal
//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedUser(null);
//   };

//   // Handle form submission
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (modalMode === 'add') {
//       // Add new user
//       const newUser = {
//         id: users.length + 1,
//         ...formData,
//       };
//       setUsers([...users, newUser]);
//     } else if (modalMode === 'edit') {
//       // Update existing user
//       const updatedUsers = users.map((user) =>
//         user.id === selectedUser.id ? { ...user, ...formData } : user
//       );
//       setUsers(updatedUsers);
//     }
//     closeModal();
//   };

//   // Delete user
//   const deleteUser = (userId) => {
//     const confirmed = window.confirm('Are you sure you want to delete this user?');
//     if (confirmed) {
//       const updatedUsers = users.filter((user) => user.id !== userId);
//       setUsers(updatedUsers);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col">
//       {/* Navbar */}
//       <NavigationBar />

//       {/* Main Content */}
//       <div
//         className="flex-grow overflow-hidden p-6 bg-gray-100"
//         style={{
//           backgroundImage: `url(${bgImage})`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//         }}
//       >
//         <div className="h-full flex flex-col bg-white bg-opacity-80 rounded-lg shadow p-6">
//           {/* Header */}
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-2xl font-bold">Manage Users</h2>
//             <button
//               onClick={() => openModal('add')}
//               className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//             >
//               <FaPlus className="mr-2" />
//               Add New User
//             </button>
//           </div>

//           {/* User Table */}
//           <div className="flex-grow overflow-auto">
//             <table className="w-full table-auto bg-white rounded shadow">
//               <thead>
//                 <tr className="bg-gray-200 text-left">
//                   <th className="px-4 py-2">ID</th>
//                   <th className="px-4 py-2">Name</th>
//                   <th className="px-4 py-2">Email</th>
//                   <th className="px-4 py-2">Contact Number</th>
//                   <th className="px-4 py-2">Role</th>
//                   <th className="px-4 py-2">Status</th>
//                   <th className="px-4 py-2">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.map((user) => (
//                   <tr key={user.id} className="border-b hover:bg-gray-100">
//                     <td className="px-4 py-2">{user.id}</td>
//                     <td className="px-4 py-2">{user.name}</td>
//                     <td className="px-4 py-2">{user.email}</td>
//                     <td className="px-4 py-2">{user.contact}</td>
//                     <td className="px-4 py-2">{user.role}</td>
//                     <td className="px-4 py-2">{user.status}</td>
//                     <td className="px-4 py-2">
//                       <button
//                         onClick={() => openModal('edit', user)}
//                         className="text-yellow-500 hover:text-yellow-700 mr-4"
//                       >
//                         <FaEdit />
//                       </button>
//                       <button
//                         onClick={() => deleteUser(user.id)}
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
//                     {modalMode === 'add' ? 'Add New User' : 'Edit User'}
//                   </h3>
//                   <button onClick={closeModal} className="text-gray-600 hover:text-gray-800">
//                     ✕
//                   </button>
//                 </div>
//                 <form onSubmit={handleSubmit} className="p-6">
//                   <div className="mb-4">
//                     <label className="block text-gray-700 mb-2">Name</label>
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
//                     <label className="block text-gray-700 mb-2">Email</label>
//                     <input
//                       type="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 py-2 border rounded"
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 mb-2">Role</label>
//                     <select
//                       name="role"
//                       value={formData.role}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 py-2 border rounded"
//                     >
//                       <option value="">Select Role</option>
//                       <option value="Admin">Admin</option>
//                       <option value="User">User</option>
//                     </select>
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 mb-2">Status</label>
//                     <select
//                       name="status"
//                       value={formData.status}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 py-2 border rounded"
//                     >
//                       <option value="">Select Status</option>
//                       <option value="Active">Active</option>
//                       <option value="Inactive">Inactive</option>
//                     </select>
//                   </div>
//                   <div className="mb-6">
//                     <label className="block text-gray-700 mb-2">Contact Number</label>
//                     <input
//                       type="text"
//                       name="contact"
//                       value={formData.contact}
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
//                       className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                     >
//                       {modalMode === 'add' ? 'Add User' : 'Save Changes'}
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

// export default ManageUser;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios'; // Import Axios
// import NavigationBar from '../navbar/NavigationBar';
// import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
// import bgImage from '../../images/bgImage.jpg';

// const ManageUser = () => {
//   const [users, setUsers] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     contact: '',
//     role: '',
//     status: '',
//   });

//   // Fetch users from backend
//   const fetchUsers = async () => {
//     try {
//       const response = await axios.get('http://localhost:8080/api/users/all');
//       setUsers(response.data);
//     } catch (error) {
//       console.error('Error fetching users:', error);
//     }
//   };

//   useEffect(() => {
//     fetchUsers(); // Fetch users on component mount
//   }, []);

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // Open modal for adding or editing
//   const openModal = (mode, user = null) => {
//     setModalMode(mode);
//     setIsModalOpen(true);
//     if (mode === 'edit' && user) {
//       setSelectedUser(user);
//       setFormData({
//         name: user.name,
//         email: user.email,
//         contact: user.contact,
//         role: user.role,
//         status: user.status,
//       });
//     } else {
//       setFormData({ name: '', email: '', contact: '', role: '', status: '' });
//     }
//   };

//   // Close modal
//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedUser(null);
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (modalMode === 'add') {
//       try {
//         const response = await axios.post('http://localhost:8080/api/users/addUser', formData);
//         setUsers([...users, response.data]); // Update users list
//       } catch (error) {
//         console.error('Error adding user:', error);
//       }
//     } else if (modalMode === 'edit') {
//       try {
//         const response = await axios.put(`http://localhost:8080/api/users/updateUser/${selectedUser.id}`, formData);
//         const updatedUsers = users.map((user) =>
//           user.id === selectedUser.id ? response.data : user
//         );
//         setUsers(updatedUsers); // Update users list
//       } catch (error) {
//         console.error('Error updating user:', error);
//       }
//     }
//     closeModal();
//   };

//   // Delete user
//   const deleteUser = async (userId) => {
//     const confirmed = window.confirm('Are you sure you want to delete this user?');
//     if (confirmed) {
//       try {
//         await axios.delete(`http://localhost:8080/api/users/deleteUser/${userId}`);
//         const updatedUsers = users.filter((user) => user.id !== userId);
//         setUsers(updatedUsers);
//       } catch (error) {
//         console.error('Error deleting user:', error);
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col">
//       {/* Navbar */}
//       <NavigationBar />

//       {/* Main Content */}
//       <div
//         className="flex-grow overflow-hidden p-6 bg-gray-100"
//         style={{
//           backgroundImage: `url(${bgImage})`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//         }}
//       >
//         <div className="h-full flex flex-col bg-white bg-opacity-80 rounded-lg shadow p-6">
//           {/* Header */}
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-2xl font-bold">Manage Users</h2>
//             <button
//               onClick={() => openModal('add')}
//               className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//             >
//               <FaPlus className="mr-2" />
//               Add New User
//             </button>
//           </div>

//           {/* User Table */}
//           <div className="flex-grow overflow-auto">
//             <table className="w-full table-auto bg-white rounded shadow">
//               <thead>
//                 <tr className="bg-gray-200 text-left">
//                   <th className="px-4 py-2">ID</th>
//                   <th className="px-4 py-2">Name</th>
//                   <th className="px-4 py-2">Email</th>
//                   <th className="px-4 py-2">Contact Number</th>
//                   <th className="px-4 py-2">Role</th>
//                   <th className="px-4 py-2">Status</th>
//                   <th className="px-4 py-2">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.map((user) => (
//                   <tr key={user.id} className="border-b hover:bg-gray-100">
//                     <td className="px-4 py-2">{user.id}</td>
//                     <td className="px-4 py-2">{user.name}</td>
//                     <td className="px-4 py-2">{user.email}</td>
//                     <td className="px-4 py-2">{user.contact_number}</td>
//                     <td className="px-4 py-2">{user.role}</td>
//                     <td className="px-4 py-2">{user.status}</td>
//                     <td className="px-4 py-2">
//                       <button
//                         onClick={() => openModal('edit', user)}
//                         className="text-yellow-500 hover:text-yellow-700 mr-4"
//                       >
//                         <FaEdit />
//                       </button>
//                       <button
//                         onClick={() => deleteUser(user.id)}
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
//                     {modalMode === 'add' ? 'Add New User' : 'Edit User'}
//                   </h3>
//                   <button onClick={closeModal} className="text-gray-600 hover:text-gray-800">
//                     ✕
//                   </button>
//                 </div>
//                 <form onSubmit={handleSubmit} className="p-6">
//                   <div className="mb-4">
//                     <label className="block text-gray-700 mb-2">Name</label>
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
//                     <label className="block text-gray-700 mb-2">Email</label>
//                     <input
//                       type="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 py-2 border rounded"
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 mb-2">Role</label>
//                     <select
//                       name="role"
//                       value={formData.role}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 py-2 border rounded"
//                     >
//                       <option value="">Select Role</option>
//                       <option value="Admin">Admin</option>
//                       <option value="User">User</option>
//                     </select>
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 mb-2">Status</label>
//                     <select
//                       name="status"
//                       value={formData.status}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 py-2 border rounded"
//                     >
//                       <option value="">Select Status</option>
//                       <option value="Active">Active</option>
//                       <option value="Inactive">Inactive</option>
//                     </select>
//                   </div>
//                   <div className="mb-6">
//                     <label className="block text-gray-700 mb-2">Contact Number</label>
//                     <input
//                       type="text"
//                       name="contact"
//                       value={formData.contact}
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
//                       className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                     >
//                       {modalMode === 'add' ? 'Add User' : 'Save Changes'}
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

// export default ManageUser;


import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import NavigationBar from '../navbar/NavigationBar';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import bgImage from '../../images/bgImage.jpg';

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact_number: '',
    role: '',
    status: '',
    password: '', // Added password field
  });

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/users/all');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch users on component mount
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Open modal for adding or editing
  const openModal = (mode, user = null) => {
    setModalMode(mode);
    setIsModalOpen(true);
    if (mode === 'edit' && user) {
      setSelectedUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        contact_number: user.contact_number,
        role: user.role,
        status: user.status,
        password: user.password, 
      });
    } else {
      setFormData({ name: '', email: '', contact_number: '', role: '', status: '', password: '' });
    }
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      try {
        const response = await axios.post('http://localhost:8080/api/users/addUser', formData)
        setUsers([...users, response.data]); // Update users list
      } catch (error) {
        console.error('Error adding user:', error);
      }
    } else if (modalMode === 'edit') {
      try {
        const response = await axios.put(`http://localhost:8080/api/users/updateUser/${selectedUser.id}`, formData);
        const updatedUsers = users.map((user) =>
          user.id === selectedUser.id ? response.data : user
        );
        setUsers(updatedUsers); // Update users list
      } catch (error) {
        console.error('Error updating user:', error);
      }
    }
    closeModal();
  };

  // Delete user
  const deleteUser = async (userId) => {
    const confirmed = window.confirm('Are you sure you want to delete this user?');
    if (confirmed) {
      try {
        await axios.delete(`http://localhost:8080/api/users/deleteUser/${userId}`);
        const updatedUsers = users.filter((user) => user.id !== userId);
        setUsers(updatedUsers);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <NavigationBar />

      {/* Main Content */}
      <div
        className="flex-grow overflow-hidden p-6 bg-gray-100"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="h-full flex flex-col bg-white bg-opacity-50 rounded-lg shadow p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Manage Users</h2>
            <button
              onClick={() => openModal('add')}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <FaPlus className="mr-2" />
              Add New User
            </button>
          </div>

          {/* User Table */}
          <div className="flex-grow overflow-auto">
            <table className="w-full table-auto bg-white rounded shadow">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Contact Number</th>
                  <th className="px-4 py-2">Role</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-2">{user.id}</td>
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.contact_number}</td>
                    <td className="px-4 py-2">{user.role}</td>
                    <td className="px-4 py-2">{user.status}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => openModal('edit', user)}
                        className="text-yellow-500 hover:text-yellow-700 mr-4"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
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
                    {modalMode === 'add' ? 'Add New User' : 'Edit User'}
                  </h3>
                  <button onClick={closeModal} className="text-gray-600 hover:text-gray-800">
                    ✕
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6">
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Role</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border rounded"
                    >
                      <option value="">Select Role</option>
                      <option value="Admin">Admin</option>
                      <option value="User">User</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border rounded"
                    >
                      <option value="">Select Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Contact Number</label>
                    <input
                      type="text"
                      name="contact_number"
                      value={formData.contact_number}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required={modalMode === 'add'} // Only required when adding new user
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
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      {modalMode === 'add' ? 'Add User' : 'Save Changes'}
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

export default ManageUser;
