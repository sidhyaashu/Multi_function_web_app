import React, { useState } from 'react';
import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';
import { motion } from 'framer-motion';
import { CircularProgress, TextField, Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'fontsource-roboto';

const QR = () => {
  const [loading, setLoading] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [qrText, setQrText] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const notifySuccess = (msg) => toast.success(msg);
  const notifyError = (msg) => toast.error(msg);

  const handleGenerateQRCode = async () => {
    if (!qrText) {
      notifyError('Please enter valid text to generate a QR code.');
      return;
    }

    setLoading(true);
    setShowDownload(false);

    try {
      const url = await QRCode.toDataURL(qrText, { errorCorrectionLevel: 'H' });
      setQrCodeUrl(url);
      notifySuccess('QR Code generated successfully!');
      setLoading(false);
      setShowDownload(true);
    } catch (error) {
      console.error(error);
      notifyError('Error generating QR code. Please try again.');
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!qrCodeUrl) return;

    const pdf = new jsPDF();
    pdf.text('Your QR Code:', 10, 10);
    pdf.addImage(qrCodeUrl, 'JPEG', 10, 20, 180, 180);
    pdf.save('qr-code.pdf');
    notifySuccess('PDF downloaded successfully!');
  };

  const handleGenerateNew = () => {
    setQrText('');
    setQrCodeUrl('');
    setShowDownload(false);
  };

  return (
    <div className="flex flex-col items-center min-h-screen w-full max-w-full p-6 mx-auto">
      <ToastContainer position="top-center" />
      <h1 className="text-4xl font-bold mb-6 text-blue-700 font-roboto">QR Code Generator</h1>
      
      <TextField
        label="Enter text for QR Code"
        value={qrText}
        onChange={(e) => setQrText(e.target.value)}
        error={!qrText}
        helperText={!qrText ? 'This field is required' : ''}
        fullWidth
        margin="normal"
        variant="outlined"
        className="mb-4"
      />
      
      {!loading && !showDownload && (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGenerateQRCode}
            fullWidth
            className="p-4 mb-4"
          >
            Generate QR Code
          </Button>
        </motion.div>
      )}

      {loading && (
        <div className="mt-4">
          <CircularProgress color="primary" />
        </div>
      )}

      {showDownload && (
        <motion.div
          className="flex flex-col items-center mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Scaled QR Code */}
          <img 
            src={qrCodeUrl} 
            alt="Generated QR Code" 
            style={{ width: '250px', height: '250px' }} 
            className="mt-4 mb-4 rounded-lg border shadow-lg" 
          />
          
          {/* Buttons in a row with space */}
          <div className="flex flex-row justify-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                color="success"
                onClick={handleDownloadPDF}
                className="p-4"
                style={{ width: '200px' }}  
              >
                Download QR Code as PDF
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleGenerateNew}
                className="p-4"
                style={{ width: '200px' }} 
              >
                Generate New QR Code
              </Button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default QR;
