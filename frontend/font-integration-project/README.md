# Font Integration Project

This project demonstrates how to integrate the Inter font from Google Fonts into a web application. It includes a utility for downloading the font files and applying them through CSS.

## Project Structure

```
font-integration-project
├── src
│   ├── app.ts               # Entry point of the application
│   ├── styles
│   │   └── globals.css      # Global CSS styles including font-face definition
│   └── utils
│       └── fontDownloader.ts # Utility for downloading font files
├── public
│   └── fonts
│       └── .gitkeep         # Keeps the fonts directory tracked by Git
├── scripts
│   └── downloadFonts.js      # Script to download font files
├── package.json              # npm configuration file
├── tsconfig.json             # TypeScript configuration file
└── README.md                 # Project documentation
```

## Getting Started

1. Clone the repository:
   ```
   git clone <repository-url>
   cd font-integration-project
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Download the Inter font files:
   ```
   node scripts/downloadFonts.js
   ```

4. Start the application:
   ```
   npm start
   ```

## Usage

The Inter font will be applied to the body of the application. You can customize the styles in `src/styles/globals.css`.

## License

This project is licensed under the MIT License.
