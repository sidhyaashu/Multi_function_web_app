import React, { useState } from 'react';

const DATA_FIELDS = [
  'id',
  'name',
  'email',
  'phone',
  'address',
  'city',
  'state',
  'country',
  'postalCode',
  'job',
  'username',
  'dateOfBirth',
  'company',
  'product',
  'color',
  'quote',
  'website',
  'userAgent',
  'registrationDate',
  'isActive',
  'description',
  'lastLogin',
  'favoriteColor',
  'title',
  'hobbies',
  'favoriteNumber',
  'bio',
  'interests',
  'skills',
  'subscriptionStatus',
];

const DATA = () => {
  const [selectedFields, setSelectedFields] = useState(
    DATA_FIELDS.reduce((acc, field) => {
      acc[field] = true; // Default all fields to selected
      return acc;
    }, {})
  );

  const [showButtons, setShowButtons] = useState(false); // State to manage visibility of buttons

  const handleFieldChange = (field) => {
    setSelectedFields((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleGenerateData = async () => {
    const fieldsToExclude = Object.keys(selectedFields).filter((field) => !selectedFields[field]);
    
    // Assuming you're using an API endpoint to generate data
    await fetch('/api/generate-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        numRecords: 100, // or any other value based on your needs
        selectedFields: selectedFields,
      }),
    });

    console.log('Data generation triggered with fields:', fieldsToExclude);
    setShowButtons(true); // Show new buttons after generating data
  };

  const handleConfirmGeneration = () => {
    console.log("Data generation confirmed. The file will be downloaded.");
    // Logic to handle CSV file download can be implemented here
  };

  const handleCancelGeneration = () => {
    setShowButtons(false); // Hide buttons if canceled
  };

  return (
    <div className="max-w-full mx-auto p-6 bg-white rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6">Generate Random Data</h1>
      <form className={`mb-6 ${showButtons ? 'hidden' : ''}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
