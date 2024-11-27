
import axios from 'axios';
import React, { useRef, useState } from 'react';
import bgImage from '../../images/bgImage.jpg';

const ImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [result, setResult] = useState({
    predictedClass: '',
    confidence: '',
    treatment: '',
  });
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      // Call function to upload image and get results
      uploadImage(file);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Update the result with data from the backend
      setResult({
        predictedClass: response.data.predictedClass,
        confidence: response.data.confidence,
        treatment: response.data.treatment,
      });
    } catch (error) {
      console.error('Error uploading the image:', error);
      // Optionally handle error (show error message to user)
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      className="flex items-center justify-center h-screen opacity-95"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
          {/* <div className="bg-opacity-1 text-secondary p-10 rounded-xl shadow-lg backdrop-blur-md w-full max-w-lg text-center"> */}
        <div 
          className="bg-opacity-80 text-secondary p-10 rounded-xl shadow-lg backdrop-blur-md w-full max-w-lg text-center border border-gray-300" // Added border classes
          style={{
            borderWidth: '0.2px', // Optional: Adjust the width
            borderColor: 'secondary', // Optional: Specific color if not using Tailwind color
          }}
        >
          <h1 className="text-2xl font-semibold text-darkGary mb-6">
            Chili Plant Health Managing System
          </h1>
          
          {/* Hidden File Input */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            className="hidden" // Hide the input field
          />

          {/* Custom Button to Trigger File Input */}
          <button
            onClick={handleButtonClick}
            className="mb-6 cursor-pointer p-3 bg-primary text-secondary rounded-md hover:bg-secondary hover:text-primary transition"
          >
            Upload Image
          </button>

          {selectedImage && (
            <img
              src={selectedImage}
              alt="Uploaded"
              className="w-full h-60 object-cover rounded-md mb-6"
            />
          )}
          {loading ? (
            <p>Loading...</p>
          ) : (
            result.predictedClass && (
              <div className="text-left text-lightWhite-800">
                <p>
                  <strong>Predicted class:</strong> {result.predictedClass}
                </p>
                <p>
                  <strong>Confidence:</strong> {result.confidence}
                </p>
                <p>
                  <strong>Treatment:</strong> {result.treatment}
                </p>
              </div>
            )
          )}
        </div>
      
      
    </div>
  );
};

export default ImageUpload;
