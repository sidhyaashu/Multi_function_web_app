import { useState } from 'react';
import domtoimage from 'dom-to-image';
import { simulateLoading } from "../constants/simulateLoading.js";

const URLScreenshotGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [urlText, setUrlText] = useState('');
  const [imageData, setImageData] = useState(null);

  const handleButtonClick = async () => {
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
      
      {/* This hidden div is always present but only visible when screenshot is generated */}
      <div 
        id="capture" 
        className={`w-[300px] h-[200px] mb-4 flex items-center justify-center ${showDownload ? 'bg-gray-200' : 'hidden'}`}
      >
        <p>Preview of Screenshot Area</p>
      </div>

      {/* Show input and button only when screenshot is not generated */}
      {!showDownload && (
        <>
          <input
            type="text"
            value={urlText}
            onChange={(e) => setUrlText(e.target.value)} 
            placeholder="Enter URL to simulate (no actual URL loading)"
            className="w-full p-4 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {!loading && (
            <button
              onClick={handleButtonClick}
              className="w-full p-4 mb-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition duration-200"
            >
              Generate Screenshot
            </button>
          )}
          {loading && <div className="mt-4 text-gray-600">Loading...</div>}
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
