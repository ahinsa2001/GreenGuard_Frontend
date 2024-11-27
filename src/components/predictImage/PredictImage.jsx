//Prediction with spring boot and flask backend
import React, { useRef, useState } from 'react';
import axios from 'axios';
import NavigationBar from '../navbar/NavigationBar';
import bgImage from '../../images/bgImage.jpg';
import { FaUpload, FaCamera, FaExclamationCircle, FaCheckCircle, FaNotesMedical, FaCheck, FaSprayCan, FaLeaf, FaWater, FaRecycle, FaSun } from 'react-icons/fa';
import { MdOutlineDescription } from 'react-icons/md';

const PredictImage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [result, setResult] = useState({
    predictedClass: '',
    confidence: '',
    treatment: '',
  });
  const [loading, setLoading] = useState(false);
  const [potNumber, setPotNumber] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [validationError, setValidationError] = useState('');
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleInputChange = (e) => {
    setPotNumber(e.target.value);
    setValidationError('');  // Clear any validation error when the user types
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      uploadImage(file);
    }
  };

  const validatePotNumber = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/plants/validate/${potNumber}`);
      if (response.status === 200) {
        return true;  // Plant found, pot number is valid
      } else {
        setValidationError('Pot number not found.');
        return false;  // Pot number is invalid
      }
    } catch (error) {
      console.error('Error validating pot number:', error);
      setValidationError('Error validating pot number.');
      return false;  // Return false in case of error
    }
  };

  const uploadImage = async (file) => {
    if (!potNumber) {
      setValidationError('Please enter a valid pot number.');
      return false;
    }
  
    const isValidPot = await validatePotNumber();
    if (!isValidPot) {
      return; // Stop execution if pot number is invalid
    }
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      setLoading(true);
  
      // Call your Flask API to predict
      const response = await axios.post('http://localhost:5000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      const { predictedClass, confidence } = response.data;
  
      // Map the predicted class to disease_id
      const diseaseId = diseaseMapping[predictedClass];
  
      let treatmentSteps = [];
  
      if (predictedClass !== 'chili_healthy') {
        if (!diseaseId) {
          setValidationError('Predicted disease is not recognized. Please try again.');
          return; // Stop execution if the disease ID is not found
        }
  
        // Fetch treatments based on disease ID for diseased plants
        const treatmentResponse = await axios.get(
          `http://localhost:8080/api/predictions/treatments/${diseaseId}`
        );
  
        treatmentSteps = treatmentResponse.data.map((treatment) => ({
          id: treatment.id,
          stepNumber: treatment.stepNumber,
          instruction: treatment.instruction,
        }));
  
        // Add tasks to the task list automatically for diseased plants
        const tasks = treatmentSteps.map((treatment) => ({
          treatmentStepId: treatment.id,
          plantId: potNumber,
          status: 'Pending',
          assignedAt: new Date().toISOString(),
        }));
  
        await axios.post('http://localhost:8080/api/tasks/add', tasks, {
          withCredentials: true,
        });
      }
  
      // Save the prediction for both healthy and diseased plants
      await axios.post(
        'http://localhost:8080/api/predictions/save',
        {
          potNumber,
          diseaseId: diseaseId || null, // Use null if diseaseId is not found
          confidence,
          treatmentIds: treatmentSteps.map((step) => step.id), // Include treatment IDs for diseased plants
        },
        { withCredentials: true }
      );
  
      // Set the result
      setResult({
        predictedClass,
        confidence,
        treatmentSteps, // Save treatment steps for modal display
        potNumber,
      });

      // setResult((prevResult) => ({
      //   ...prevResult,
      //   predictedClass,
      //   confidence,
      //   potNumber, // Retain the pot number in the result
      // }));

      
      setPotNumber(''); // Clear the pot number input field
    } catch (error) {
      console.error('Error uploading the image or saving prediction:', error);
    } finally {
      setLoading(false);
    }
  };  
  
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const openCamera = () => {
    setIsCameraOpen(true);
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error('Error accessing the camera:', error);
      });
  };

  const closeCamera = () => {
    setIsCameraOpen(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  const captureImage = () => {
    if (videoRef.current) {
      const width = videoRef.current.videoWidth;
      const height = videoRef.current.videoHeight;

      canvasRef.current.width = width;
      canvasRef.current.height = height;

      const context = canvasRef.current.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, width, height);

      const dataUrl = canvasRef.current.toDataURL('image/png');
      setSelectedImage(dataUrl);
      closeCamera();

      fetch(dataUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], 'captured_image.png', { type: 'image/png' });
          uploadImage(file);
        });
    }
  };

  const diseaseMapping = {
    chili_healthy: 1,       // 'Healthy'
    chili_anthacnose: 2,    // 'Anthracnose'
    chili_leaf_curl: 3,     // 'Leaf Curl'
    chili_leaf_spot: 4,     // 'Leaf Spot'
    chili_whitefly: 5,      // 'Whitefly'
    chili_yellowish: 6      // 'Yellowish'
  };

  // Map predicted class to disease name
  const getDiseaseName = (predictedClass) => {
    switch (predictedClass) {
      case 'chili_leaf_curl':
        return 'Leaf Curl Disease';
      case 'chili_leaf_spot':
        return 'Bacterial Leaf Spot';
      case 'chili_anthacnose':
        return 'Anthacnose Disease';
      case 'chili_whitefly':
        return 'Whitefly Disease';
      case 'chili_yellowish':
        return 'Yellowish Disease';
      default:
        return predictedClass === 'chili_healthy' ? 'Healthy' : predictedClass;
    }
  };

  const [translated, setTranslated] = useState(false);

  const translateToSinhala = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/treatments/translate', 
        result.treatmentSteps.map((step) => step.id) // Send IDs of treatment steps
      );

      const translatedSteps = response.data;

      const updatedSteps = result.treatmentSteps.map((step) => {
        // Find the corresponding translated instruction
        const translation = translatedSteps.find((t) => parseInt(t.id) === step.id); // Ensure matching by converting to integers if necessary
        return {
          ...step,
          translatedInstruction: translation ? translation.translatedInstruction : step.instruction,
        };
      });

      setResult((prevResult) => ({
        ...prevResult,
        treatmentSteps: updatedSteps, // Update treatmentSteps with translated instructions
      }));
      setTranslated(true); // Mark as translated
    } catch (error) {
      console.error('Error translating to Sinhala:', error);
    }
  };


  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <NavigationBar appName="My Web App" userName="User" onLogout={() => {}} />

      <div
        className="flex-grow overflow-hidden px-10 pt-4"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="h-full flex flex-col items-center justify-center bg-white bg-opacity rounded-lg shadow p-6 mb-9 mx-60">
          {/* Plant Pot Number Input */}
          <div className="mb-6 w-fit justify-center">
            <input
              type="text"
              id="potNumber"
              name="potNumber"
              value={potNumber}
              onChange={handleInputChange}
              placeholder="Enter pot number"
              className="px-4 py-2 border rounded-md w-full"
              required
            />
            {validationError && <p className="text-red-500 mt-2">{validationError}</p>}
          </div>

          {/* Clickable Divs for Upload and Capture */}
          <div className="flex justify-center mb-6">
            {/* <div
              onClick={potNumber ? openCamera : null}
              className={`bg-green-100 p-4 rounded-lg flex items-center mx-4 ${
                !potNumber ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-green-200'
              }`}
            >
              <FaCamera className="text-green-500 text-2xl mr-4" />
              <span className="text-lg font-semibold">Capture Image</span>
            </div> */}
            <div
              onClick={potNumber ? handleButtonClick : null}
              className={`bg-blue-100 p-4 rounded-lg flex items-center mx-4 ${
                !potNumber ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-blue-200'
              }`}
            >
              <FaUpload className="text-blue-500 text-2xl mr-4" />
              <span className="text-lg font-semibold">Upload Image</span>
            </div>

            {/* Clear/Reset Button */}
            <div
              onClick={() => {
                setSelectedImage(null); // Clear the selected image
                setResult({ predictedClass: '', confidence: '', treatment: ''}); // Reset result
                setPotNumber(''); // Clear the pot number input
                setValidationError(''); // Clear errors
              }}
              className="bg-red-100 p-4 rounded-lg flex items-center mx-4 cursor-pointer hover:bg-red-200"
            >
              <FaExclamationCircle className="text-red-500 text-2xl mr-4" />
              <span className="text-lg font-semibold">Reset Fields</span>
            </div>
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            className="hidden"
          />
        </div>

      <div className="h-full flex flex-col items-center justify-center bg-white bg-opacity rounded-lg shadow p-6 mx-60">
        {/* Display Results */}
        <div className="flex flex-col md:flex-row items-start mb-6 w-full">
          {selectedImage ? (
            <img
              src={selectedImage}
              alt="Selected"
              className="w-64 h-64 object-cover rounded-md mb-4 md:mb-0 md:mr-6"
            />
          ) : (
            <div className="w-64 h-64 flex items-center justify-center bg-gray-200 rounded-md mb-4 md:mb-0 md:mr-6">
              <span className="text-gray-500">No image selected</span>
            </div>
          )}
          <div className="text-left text-gray-800 flex-1">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                <div className="mb-4 pt-14">
                  {result.predictedClass ? (
                    <>
                      {result.predictedClass === 'chili_healthy' ? (
                        <div className="flex items-center mb-4">
                          <FaCheckCircle className="text-green-500 text-3xl mr-2" />
                          <h2 className="text-2xl font-bold text-green-600">The plant is Healthy!</h2>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center mb-4">
                            <FaExclamationCircle className="text-red-500 text-3xl mr-2" />
                            <h2 className="text-2xl font-bold text-red-600">
                              The plant is infected with {getDiseaseName(result.predictedClass)}!
                            </h2>
                          </div>
                          <div
                            className="bg-red-100 w-fit p-4 rounded-md flex items-center cursor-pointer hover:bg-red-200"
                            onClick={openModal}
                          >
                            <FaNotesMedical className="text-red-500 text-2xl mr-2" />
                            <h3 className="text-lg font-semibold">Show Treatments</h3>
                          </div>
                        </>
                      )}
                      <p className="mb-4 mt-3">
                        <strong>Probability of Prediction:</strong> {result.confidence.toFixed(2)}%
                      </p>
                      <p className="mb-4">
                        <strong>Pot Number:</strong> {result.potNumber}
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-500">No prediction yet</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      </div>

      {/* Modal for Treatment Details */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          style={{ zIndex: 1000 }}
        >
          <div
            className="bg-white rounded-lg shadow-lg w-full max-w-2xl"
            style={{ maxHeight: '90vh' }}
          >
            <div className="px-6 py-4 flex items-center justify-between border-b">
              <h3 className="text-xl font-bold text-gray-700">Treatment Details</h3>
              <button onClick={closeModal} className="text-gray-600 hover:text-gray-800">
                ✕
              </button>
            </div>
            <div
              className="p-6 overflow-y-auto"
              style={{ maxHeight: 'calc(90vh - 72px)' }}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center">
                  {/* <MdOutlineDescription className="text-xl mr-2" /> */}
                  Disease: <span className="ml-2 text-gray-700">{getDiseaseName(result.predictedClass)}</span>
                </h3>
                {/* Translate Option */}
                <button
                  className="px-4 py-1 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600"
                  onClick={translateToSinhala}
                >
                  Translate to Sinhala
                </button>
              </div>

              <h4 className="mt-4 mb-2 font-semibold flex items-center text-gray-700">
                <MdOutlineDescription className="text-xl mr-2" /> Treatment Steps:
              </h4>

              <ul className="space-y-4">
                {result.treatmentSteps.map((treatment, index) => (
                  <li key={index} className="flex items-center bg-gray-50 rounded-lg p-4 shadow-sm">
                  <div className="mr-4">
                    {index + 1 === 1 && <FaSprayCan className="text-green-500 text-2xl" />}
                    {index + 1 === 2 && <FaLeaf className="text-green-500 text-2xl" />}
                    {index + 1 === 3 && <FaWater className="text-blue-500 text-2xl" />}
                    {index + 1 === 4 && <FaRecycle className="text-orange-500 text-2xl" />}
                    {index + 1 === 5 && <FaSun className="text-yellow-500 text-2xl" />}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">{`Step ${index + 1}:`}</p>
                    <p className="text-gray-600">
                      {treatment.translatedInstruction || treatment.instruction}
                    </p>
                  </div>
                </li>
                ))}
              </ul>

              {/* Disabled Button */}
              <div className="mt-6 flex justify-end">
                <button
                  className="px-6 py-2 bg-gray-300 text-gray-600 rounded-lg shadow-md cursor-not-allowed"
                  disabled
                >
                  Already added these treatments into your task list
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Camera Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="px-6 py-4 flex items-center justify-between border-b">
              <h3 className="text-xl font-bold">Capture Image</h3>
              <button onClick={closeCamera} className="text-gray-600 hover:text-gray-800">
                ✕
              </button>
            </div>
            <div className="p-6">
              <video ref={videoRef} autoPlay className="w-full h-64 bg-black rounded-md mb-4"></video>
              <div className="flex justify-end">
                <button
                  onClick={captureImage}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                >
                  Capture
                </button>
                <button
                  onClick={closeCamera}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
          <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
      )}
    </div>
  );
};

export default PredictImage;

