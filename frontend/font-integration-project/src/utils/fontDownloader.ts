import fs from 'fs';
import path from 'path';
import axios from 'axios';

const FONT_URL = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap';
const FONT_DIR = path.join(__dirname, '../../public/fonts');

async function downloadFont() {
    try {
        const response = await axios.get(FONT_URL);
        const fontCss = response.data;

        // Extract font file URLs from the CSS
        const fontUrls = fontCss.match(/url\((.*?)\)/g).map(url => url.replace(/url\((.*?)\)/, '$1'));

        // Download each font file
        await Promise.all(fontUrls.map(async (url) => {
            const fontResponse = await axios.get(url, { responseType: 'arraybuffer' });
            const fontFileName = path.basename(url);
            const fontFilePath = path.join(FONT_DIR, fontFileName);

            fs.writeFileSync(fontFilePath, fontResponse.data);
        }));

        console.log('Fonts downloaded successfully!');
    } catch (error) {
        console.error('Error downloading fonts:', error);
    }
}

export default downloadFont;