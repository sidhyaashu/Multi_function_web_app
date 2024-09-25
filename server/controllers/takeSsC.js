import puppeteer from 'puppeteer';

const take_ss = async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'Please provide a valid URL.' });
    }

    try {
        const screenshotBuffer = await takeScreenshot(url);
        res.setHeader('Content-Disposition', 'attachment; filename=screenshot.png');
        res.setHeader('Content-Type', 'image/png');
        res.send(screenshotBuffer); // Send buffer directly
    } catch (err) {
        console.error('Error taking screenshot:', err);
        res.status(500).json({ error: 'Failed to take screenshot.' });
    }
};

async function takeScreenshot(url) {
    const browser = await puppeteer.launch({ headless: true }); // Run in headless mode
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Take the screenshot as a buffer with the specified type
    const screenshotBuffer = await page.screenshot({ fullPage: true, type: 'png' });
    await browser.close();


    console.log('Screenshot captured successfully.');
    return screenshotBuffer; // Return the buffer directly
}

export default take_ss;
