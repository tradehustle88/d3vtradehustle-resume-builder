const fs = require('fs');
const path = require('path');
const https = require('https');

const fontUrl = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap';
const fontDir = path.join(__dirname, '../public/fonts');

function downloadFont() {
    https.get(fontUrl, (response) => {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            const fontFiles = extractFontFiles(data);
            saveFontFiles(fontFiles);
        });
    }).on('error', (err) => {
        console.error('Error downloading font:', err);
    });
}

function extractFontFiles(css) {
    const regex = /url\((.*?)\)/g;
    const urls = [];
    let match;

    while ((match = regex.exec(css)) !== null) {
        urls.push(match[1].replace(/['"]/g, ''));
    }

    return urls;
}

function saveFontFiles(urls) {
    if (!fs.existsSync(fontDir)) {
        fs.mkdirSync(fontDir, { recursive: true });
    }

    urls.forEach((url) => {
        const fileName = path.basename(url);
        const filePath = path.join(fontDir, fileName);

        https.get(url, (response) => {
            const fileStream = fs.createWriteStream(filePath);
            response.pipe(fileStream);

            fileStream.on('finish', () => {
                fileStream.close();
                console.log(`Downloaded: ${fileName}`);
            });
        }).on('error', (err) => {
            console.error('Error saving font file:', err);
        });
    });
}

downloadFont();