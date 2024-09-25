import { useState, useCallback } from 'react';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress for loading spinner
import 'tailwindcss/tailwind.css'; // Ensure Tailwind CSS is imported

const URLScreenshotGenerator = () => {
    const [loading, setLoading] = useState(false);
    const [urlText, setUrlText] = useState('');
    const [error, setError] = useState('');
    const [toastVisible, setToastVisible] = useState(false);
    const [downloadLink, setDownloadLink] = useState('');

    // Regex for URL validation
    const isValidUrl = (url) => {
        const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])?)\\.)+([a-z]{2,}|[a-z\\d-]{2,}\\.[a-z]{2,})|' + // domain name
            'localhost|' + // localhost
            '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}|' + // IP
            '\\[?[a-fA-F0-9]*:[a-fA-F0-9:]+\\]?)' + // IPv6
            '(\\:\\d+)?(\\/[-a-z\\d%@_.~+&:]*)*$', 'i'); // port and path
        return !!pattern.test(url);
    };

    const handleButtonClick = useCallback(async () => {
        if (!urlText) {
            showToast('URL cannot be empty!');
            return;
        }
        if (!isValidUrl(urlText)) {
            showToast('Please enter a valid URL!');
            return;
        }

        setError('');
        setLoading(true);
        setDownloadLink('');

        try {
            const response = await axios.post('/api/take-ss/take-screenshot', { url: urlText }, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            setDownloadLink(url);
            showToast('Screenshot generated successfully!');
        } catch (error) {
            console.error('Error generating screenshot:', error);
            showToast('Failed to generate screenshot. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, [urlText]);

    const showToast = (message) => {
        setError(message);
        setToastVisible(true);
        setTimeout(() => {
            setToastVisible(false);
            setError('');
        }, 3000);
    };

    const handleGenerateNew = useCallback(() => {
        setUrlText('');
        setDownloadLink('');
    }, []);

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-full p-6 mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-blue-600">URL To Screenshot</h1>
            <input
                type="text"
                value={urlText}
                onChange={(e) => setUrlText(e.target.value)}
                placeholder="Enter URL to capture screenshot"
                className="w-full p-4 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="URL input"
            />
            {error && <p className="mb-2 text-red-500">{error}</p>}

            <button
                onClick={handleButtonClick}
                disabled={loading}
                className={`w-full p-4 mb-2 text-white ${loading ? 'bg-gray-400' : 'bg-blue-600'} rounded hover:bg-blue-700 transition duration-200`}
                aria-label="Generate Screenshot"
            >
                {loading ? <CircularProgress size={24} className="inline" /> : 'Generate Screenshot'}
            </button>

            {downloadLink && (
                <div className="flex flex-col items-center">
                    <a
                        href={downloadLink}
                        download="screenshot.png"
                        className="w-full p-4 mt-4 text-white bg-green-600 rounded hover:bg-green-700 transition duration-200"
                        aria-label="Download Screenshot"
                    >
                        Download Screenshot
                    </a>
                    <button
                        className="w-full p-4 mt-2 text-white bg-gray-600 rounded hover:bg-gray-700 transition duration-200"
                        onClick={handleGenerateNew}
                        aria-label="Generate New Screenshot"
                    >
                        Generate New Screenshot
                    </button>
                </div>
            )}

            {/* Toast Notification */}
            {toastVisible && (
                <div className="fixed top-4 right-4 p-4 bg-red-500 text-white rounded shadow-md z-10">
                    {error}
                </div>
            )}
        </div>
    );
};

export default URLScreenshotGenerator;