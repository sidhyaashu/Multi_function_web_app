import { useState } from 'react';
import domtoimage from 'dom-to-image';

const simulateLoading = (duration, callback) => {
  setTimeout(callback, duration);
};

const URLScreenshotGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [urlText, setUrlText] = useState('');
  const [imageData, setImageData] = useState(null);
  const [error, setError] = useState('');

  const handleButtonClick = async () => {
    if (!urlText) {
      setError('URL cannot be empty!');
      return;
    }
    
    setError('');
    setLoading(true);
    setShowDownload(false);

    simulateLoading(2000, async () => {
      try {
        const screenshot = await generateScreenshot();
        setImageData(screenshot);
        setLoading(false);
        setShowDownload(true);
      } catch (error) {
        console.error('Error generating screenshot:', error);
        setLoading(false);
      }
    });
  };

  const handleGenerateNew = () => {
    setUrlText('');
    setShowDownload(false);
    setImageData(null);
  };

  const generateScreenshot = async () => {
    const element = document.querySelector('#capture');
    if (!element) {
      throw new Error('Element not found');
    }

    return new Promise((resolve, reject) => {
      domtoimage.toPng(element, {
        cacheBust: true,
        skipFonts: true // This avoids the cross-origin issue with Google Fonts
      })
      .then((dataUrl) => {
        resolve(dataUrl);
      })
      .catch((error) => {
        reject(error);
      });
    });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-full p-6 mx-auto bg-white">

      {/* Dynamic Screenshot Preview */}
      <div
        id="capture"
        className={`w-[300px] h-[200px] mb-4 flex items-center justify-center border border-gray-300 ${
          showDownload ? 'bg-gray-200' : 'hidden'
        }`}
      >
        <p className="text-center">{urlText || 'Preview of Screenshot Area'}</p>
      </div>

      {/* Show input and button only when screenshot is not generated */}
      {!showDownload && (
        <>
          <input
            type="text"
            value={urlText}
            onChange={(e) => setUrlText(e.target.value)}
            placeholder="Enter URL to simulate"
            className="w-full p-4 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="mb-2 text-red-500">{error}</p>}
          
          {!loading && (
            <button
              onClick={handleButtonClick}
              className="w-full p-4 mb-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition duration-200"
            >
              Generate Screenshot
            </button>
          )}
          {loading && <div className="mt-4 text-gray-600">Generating screenshot...</div>}
        </>
      )}

      {/* Show preview and download buttons only after screenshot is generated */}
      {showDownload && imageData && (
        <div className="flex flex-col items-center">
          <img src={imageData} alt="Screenshot" className="w-48 h-32 mb-4 object-contain" />
          <a
            href={imageData}
            download="screenshot.png"
            className="w-full p-4 mt-4 text-white bg-green-600 rounded hover:bg-green-700 transition duration-200"
          >
            Download Screenshot
          </a>
          <button
            className="w-full p-4 mt-2 text-white bg-gray-600 rounded hover:bg-gray-700 transition duration-200"
            onClick={handleGenerateNew}
          >
            Generate New Screenshot
          </button>
        </div>
      )}
    </div>
  );
};

export default URLScreenshotGenerator;
