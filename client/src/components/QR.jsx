import React, { useState } from 'react';
import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';
import { motion } from 'framer-motion';

const QR = () => {
  const [loading, setLoading] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [qrText, setQrText] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const handleGenerateQRCode = async () => {
    if (!qrText) {
      alert('Please enter text to generate a QR code.');
      return;
    }

    setLoading(true);
    setShowDownload(false);

    try {
      const url = await QRCode.toDataURL(qrText, { errorCorrectionLevel: 'H' });
      setQrCodeUrl(url);
      setLoading(false);
      setShowDownload(true);
    } catch (error) {
      console.error(error);
      alert('Error generating QR code. Please try again.');
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!qrCodeUrl) return;

    const pdf = new jsPDF();
    pdf.text('Your QR Code:', 10, 10);
    pdf.addImage(qrCodeUrl, 'JPEG', 10, 20, 180, 180);
    pdf.save('qr-code.pdf');
  };

  const handleGenerateNew = () => {
    setQrText('');
    setQrCodeUrl('');
    setShowDownload(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-full p-6 mx-auto  ">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">QR Code Generator</h1>
      <input
        type="text"
        value={qrText}
        onChange={(e) => setQrText(e.target.value)}
        placeholder="Enter text for QR Code"
        className="w-full p-4 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {!loading && !showDownload && (
        <motion.button
          onClick={handleGenerateQRCode}
          className="w-full p-4 mb-2 text-white bg-blue-600 rounded"
          whileHover={{ scale: 1.001 }}
          whileTap={{ scale: 0.99 }}
        >
          Generate QR Code
        </motion.button>
      )}
      {loading && <div className="mt-4 text-gray-600 animate-pulse">Loading...</div>}

      {showDownload && (
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img src={qrCodeUrl} alt="Generated QR Code" className="mt-4 mb-4 rounded border" />
          <motion.button
            className="w-full p-4 mt-4 text-white bg-green-600 rounded hover:bg-green-700 transition duration-200"
            onClick={handleDownloadPDF}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Download QR Code as PDF
          </motion.button>
          <motion.button
            className="w-full p-4 mt-2 text-white bg-gray-600 rounded hover:bg-gray-700 transition duration-200"
            onClick={handleGenerateNew}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Generate New QR Code
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default QR;
