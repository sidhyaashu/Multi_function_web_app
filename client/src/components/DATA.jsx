import React, { useState } from 'react';
import axios from 'axios';

const DATA_FIELDS = [
  'id', 'name', 'email', 'phone', 'address', 'city', 'state', 'country', 'postalCode', 'job', 'username',
  'dateOfBirth', 'company', 'product', 'color', 'quote', 'website', 'userAgent', 'registrationDate', 'isActive',
  'description', 'lastLogin', 'favoriteColor', 'title', 'hobbies', 'favoriteNumber', 'bio', 'interests', 'skills', 'subscriptionStatus'
];

const DATA = () => {
  const [selectedFields, setSelectedFields] = useState(
    DATA_FIELDS.reduce((acc, field) => {
      acc[field] = false; // Default all fields to unselected
      return acc;
    }, {})
  );

  const [numRecords, setNumRecords] = useState(10); // Default number of records
  const [showButtons, setShowButtons] = useState(false);

  const handleFieldChange = (field) => {
    setSelectedFields((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleGenerateData = async () => {
    try {
      const response = await axios.post('/api/generate-data', {
        numRecords: numRecords,
        selectedFields: selectedFields,
      });

      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'generated_data.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      setShowButtons(true); 
    } catch (error) {
      console.error('Error generating data:', error);
    }
  };

  const handleConfirmGeneration = () => {
    console.log("Data generation confirmed. The file will be downloaded.");
  };

  const handleCancelGeneration = () => {
    setShowButtons(false); // Hide buttons if canceled
  };

  return (
    <div className="max-w-full mx-auto p-6 ">
      <h1 className="text-3xl font-bold text-center mb-6">Generate Random Data</h1>
      <form className={`mb-6 ${showButtons ? 'hidden' : ''}`}>
        <label className="block text-lg text-gray-700 mb-2">Number of Records:</label>
        <input
          type="number"
          value={numRecords}
          onChange={(e) => setNumRecords(e.target.value)}
          min="1"
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4"> {/* Changed to 4 columns */}
          {DATA_FIELDS.map((field) => (
            <div key={field} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedFields[field]}
                onChange={() => handleFieldChange(field)}
                id={field}
                className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor={field} className="ml-2 text-lg text-gray-700">{field}</label>
            </div>
          ))}
        </div>
      </form>
      {!showButtons ? (
        <button
          onClick={handleGenerateData}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Generate Data
        </button>
      ) : (
        <div className="flex justify-between mt-4">
          <button
            onClick={handleConfirmGeneration}
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200 mr-2"
          >
            Download CSV
          </button>
          <button
            onClick={handleCancelGeneration}
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-700 transition duration-200"
          >
            Generate New Data
          </button>
        </div>
      )}
      <p className="text-sm text-gray-500 text-center mt-4">
        Select the fields you want to include in the generated data.
      </p>
    </div>
  );
};

export default DATA;
