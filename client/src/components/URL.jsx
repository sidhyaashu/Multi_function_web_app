// import { useState } from 'react';
// import axios from 'axios';

// const URLScreenshot = () => {
//     const [url, setUrl] = useState('');
//     const [error, setError] = useState('');
//     const [loading, setLoading] = useState(false);

//     const handleScreenshot = async () => {
//         setError(''); 
//         setLoading(true); 

//         try {
//             const response = await axios.post(
//                 '/api/take-ss/take-screenshot',
//                 { url },
//                 { responseType: 'blob' } 
//             );

//             const blob = new Blob([response.data], { type: 'image/png' });
//             const link = document.createElement('a');
//             link.href = window.URL.createObjectURL(blob);
//             link.download = 'screenshot.png'; 
//             link.click();
//         } catch (err) {
//             console.error('Error taking screenshot:', err);
//             setError('Failed to capture screenshot. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="App" style={{ padding: '20px', textAlign: 'center' }}>
//             <h1>URL Screenshot Generator</h1>
//             <input
//                 type="text"
//                 value={url}
//                 onChange={(e) => setUrl(e.target.value)}
//                 placeholder="Enter URL"
//                 style={{ width: '60%', padding: '10px', fontSize: '16px' }}
//             />
//             <br />
//             <button
//                 onClick={handleScreenshot}
//                 disabled={loading || !url} 
//                 style={{
//                     marginTop: '20px',
//                     padding: '10px 20px',
//                     fontSize: '16px',
//                     cursor: 'pointer',
//                 }}
//             >
//                 {loading ? 'Taking Screenshot...' : 'Download Screenshot'}
//             </button>
//             {error && <p style={{ color: 'red' }}>{error}</p>}
//         </div>
//     );
// };

// export default URLScreenshot;



































import { useState } from 'react';
import axios from 'axios';
import { Button, TextField, CircularProgress, Snackbar, Typography } from '@mui/material';
import { styled } from '@mui/system';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { useTheme } from '@mui/material/styles';

const Container = styled('div')(({ theme }) => ({
    padding: '20px',
    textAlign: 'center',
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#fff',
    borderRadius: '8px',
}));

const StyledButton = styled(Button)(({ theme }) => ({
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    transition: 'transform 0.2s ease',
    '&:hover': {
        transform: 'scale(1.05)',
    },
}));

const URLScreenshot = () => {
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [screenshotPreview, setScreenshotPreview] = useState(null);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastSeverity, setToastSeverity] = useState('error');
    const theme = useTheme();

    const isValidUrl = (url) => {
        const regex = /^(https?:\/\/)?([a-z0-9]+[.]){1,2}[a-z]{2,6}(\/.*)?$/i;
        return regex.test(url);
    };

    const handleScreenshot = async () => {
        setError('');
        setLoading(true);
        setScreenshotPreview(null);

        if (!isValidUrl(url)) {
            setError('Invalid URL');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                '/api/take-ss/take-screenshot',
                { url },
                { responseType: 'blob' }
            );

            const blob = new Blob([response.data], { type: 'image/png' });
            const previewUrl = window.URL.createObjectURL(blob);
            setScreenshotPreview(previewUrl);

            setToastSeverity('success');
            setToastMessage('Screenshot captured successfully!');
            setToastOpen(true);
        } catch (err) {
            console.error('Error taking screenshot:', err);
            setToastSeverity('error');
            setToastMessage('Failed to capture screenshot. Please try again.');
            setToastOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!screenshotPreview) return;

        const link = document.createElement('a');
        link.href = screenshotPreview;
        link.download = 'screenshot.png';
        link.click();
    };

    const resetForm = () => {
        setUrl('');
        setScreenshotPreview(null);
        setError('');
    };

    const handleCloseToast = () => {
        setToastOpen(false);
    };

    return (
        <Container>
            <Typography variant="h4" style={{ marginBottom: '20px', fontFamily: 'Roboto, sans-serif' }}>
                URL Screenshot Generator
            </Typography>
            <TextField
                label="Enter URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                fullWidth
                error={Boolean(error)}
                helperText={error}
                variant="outlined"
                style={{ marginBottom: '20px' }}
            />
            {loading ? (
                <CircularProgress />
            ) : (
                <StyledButton
                    onClick={handleScreenshot}
                    disabled={!url}
                    variant="contained"
                    color="primary"
                    fullWidth
                >
                    {loading ? 'Taking Screenshot...' : 'Capture Screenshot'}
                </StyledButton>
            )}
            {screenshotPreview && (
                <>
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <img
                            src={screenshotPreview}
                            alt="Screenshot preview"
                            style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', boxShadow: theme.shadows[4] }}
                        />
                    </div>
                    <StyledButton
                        onClick={handleDownload}
                        variant="outlined"
                        color="success"
                        fullWidth
                        startIcon={<CheckCircleIcon />}
                    >
                        Download Screenshot
                    </StyledButton>
                    <StyledButton
                        onClick={resetForm}
                        variant="contained"
                        color="secondary"
                        fullWidth
                        style={{ marginTop: '10px' }}
                    >
                        New Screenshot
                    </StyledButton>
                </>
            )}
            <Snackbar
                open={toastOpen}
                autoHideDuration={3000}
                onClose={handleCloseToast}
                message={toastMessage}
                ContentProps={{
                    style: {
                        backgroundColor: toastSeverity === 'error' ? '#f44336' : '#4caf50',
                        fontSize: '16px',
                        display: 'flex',
                        alignItems: 'center',
                    },
                }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                action={
                    toastSeverity === 'error' ? <ErrorIcon style={{ marginRight: '8px' }} /> : <CheckCircleIcon />
                }
            />
        </Container>
    );
};

export default URLScreenshot;
