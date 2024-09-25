import { useState, useCallback, useMemo, useEffect } from 'react';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import 'tailwindcss/tailwind.css';

const DATA_FIELDS = [
  'id', 'name', 'email', 'phone', 'address', 'city', 'state', 'country', 
  'postalCode', 'job', 'username', 'dateOfBirth', 'company', 'product', 
  'color', 'quote', 'website', 'userAgent', 'registrationDate', 
  'isActive', 'description', 'lastLogin', 'favoriteColor', 
  'title', 'hobbies', 'favoriteNumber', 'bio', 'interests', 'skills', 
  'subscriptionStatus'
];

const DATA = () => {
  const [selectedFields, setSelectedFields] = useState(
    DATA_FIELDS.reduce((acc, field) => {
      acc[field] = false;
      return acc;
    }, {})
  );
  const [numRecords, setNumRecords] = useState(10);
  const [showButtons, setShowButtons] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isInputValid, setIsInputValid] = useState(true); 

  const handleFieldChange = useCallback((field) => {
    setSelectedFields((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  }, []);

  // Effect to validate numRecords input
  useEffect(() => {
    if (numRecords > 100000) {
      showSnackbar('The maximum number of records allowed is 100,000.');
      setIsInputValid(false);
    } else {
      setIsInputValid(true); 
    }
  }, [numRecords]);

  const handleGenerateData = useCallback(async () => {
    const isAnyFieldSelected = Object.values(selectedFields).some(Boolean);
    
    if (!isAnyFieldSelected) {
      showSnackbar('Please select at least one field to generate data.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/gen-data/generate-data', {
        numRecords,
        selectedFields,
      }, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'generated_data.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      setShowButtons(true);
    } catch (error) {
      console.error('Error generating data:', error);
      showSnackbar('Error generating data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [numRecords, selectedFields]);

  const handleCancelGeneration = useCallback(() => {
    setSelectedFields(
      DATA_FIELDS.reduce((acc, field) => {
        acc[field] = false;
        return acc;
      }, {})
    );
    setShowButtons(false);
  }, []);

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const fieldCheckboxes = useMemo(() => (
    DATA_FIELDS.map((field) => (
      <div key={field} className="flex items-center mb-2">
        <input
          type="checkbox"
          id={field}
          checked={selectedFields[field]}
          onChange={() => handleFieldChange(field)}
          className="mr-2 cursor-pointer"
          aria-label={`Select ${field}`} 
        />
        <label htmlFor={field} className="text-sm">{field}</label>
      </div>
    ))
  ), [selectedFields, handleFieldChange]);

  return (
    <div className="max-w-full mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-blue-700 font-roboto">Generate Random Data</h1>

      {!showButtons && (
        <form className="mb-6">
          <label className="block text-lg text-gray-700 mb-2">Number of Records:</label>
          <input
            type="number"
            value={numRecords}
            onChange={(e) => setNumRecords(Number(e.target.value))}
            min="1"
            max="100000" 
            className={`w-full p-3 border border-gray-300 rounded mb-4 ${!isInputValid ? 'border-red-500' : ''}`} 
            aria-label="Number of records"
          />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {fieldCheckboxes}
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center">
          <CircularProgress />
        </div>
      ) : (
        <div className="flex justify-center mt-4 space-x-4">
          {showButtons ? (
            <button
              onClick={handleCancelGeneration}
              className="bg-gray-500 text-white px-6 py-2 rounded-md font-semibold transition duration-200 hover:bg-gray-600"
            >
              Generate New Data
            </button>
          ) : (
            <button
              onClick={handleGenerateData}
              className={`bg-green-500 text-white px-6 py-2 rounded-md font-semibold w-full transition duration-200 hover:bg-green-600 ${!isInputValid ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label="Generate Data"
              disabled={!isInputValid}
            >
              Generate Data
            </button>
          )}
        </div>
      )}

      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={3000} 
        onClose={handleSnackbarClose} 
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MuiAlert onClose={handleSnackbarClose} severity="error" elevation={6} variant="filled">
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default DATA;
