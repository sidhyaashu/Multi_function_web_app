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

  const notify = (msg, type) => {
    if (type === 'success') toast.success(msg);
    else toast.error(msg);
  };

  const handleGenerateQRCode = async () => {
    if (!qrText) {
      notify('Please enter valid text to generate a QR code.', 'error');
      return;
    }

    setLoading(true);
    setShowDownload(false);

    try {
      const url = await QRCode.toDataURL(qrText, { errorCorrectionLevel: 'H' });
      setQrCodeUrl(url);
      notify('QR Code generated successfully!', 'success');
      setShowDownload(true);
    } catch (error) {
      console.error(error);
      notify('Error generating QR code. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!qrCodeUrl) return;

    const pdf = new jsPDF();
    pdf.text('Your QR Code:', 10, 10);
    pdf.addImage(qrCodeUrl, 'JPEG', 10, 20, 180, 180);
    pdf.save('qr-code.pdf');
    notify('PDF downloaded successfully!', 'success');
  };

  const handleGenerateNew = () => {
    setQrText('');
    setQrCodeUrl('');
    setShowDownload(false);
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6 mx-auto">
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

      {loading && <CircularProgress color="primary" className="mt-4" />}

      {showDownload && (
        <motion.div
          className="flex flex-col items-center mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img 
            src={qrCodeUrl} 
            alt="Generated QR Code" 
            style={{ width: '250px', height: '250px' }} 
            className="mt-4 mb-4 rounded-lg border shadow-lg" 
          />
          <div className="flex justify-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                color="success"
                onClick={handleDownloadPDF}
                className="p-4"
                style={{ width: '200px' }}  
              >
                Download as PDF
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
                Generate New
              </Button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default QR;
