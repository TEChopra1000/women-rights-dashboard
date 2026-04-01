# Women's Rights Global Policy Dashboard

A comprehensive website displaying women's rights policies around the world, focusing on abortion access, maternity leave, marriage rights, and bodily autonomy across different countries.

## Features

- **Global Overview**: Statistics and data visualization of women's rights policies across 195 countries
- **Abortion Rights**: Country-by-country breakdown of abortion access and restrictions
- **Maternity Leave**: Comparison of maternity leave policies worldwide
- **Marriage Rights**: Analysis of marriage equality and women's rights in marriage
- **Bodily Autonomy**: Information on bodily autonomy rights and protections
- **Country Comparison**: Side-by-side comparison tool for different countries
- **Source Verification**: Links to official sources and references

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Data Visualization**: Chart.js
- **Development Server**: live-server

## Prerequisites

- Node.js (version 12 or higher)
- npm (Node Package Manager)

## Installation

1. Clone or download this repository
2. Navigate to the project directory:
   ```bash
   cd women_rights
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Development Mode
To run the application with live reload (recommended for development):
```bash
npm run dev
```

### Production Mode
To run the application:
```bash
npm start
```

Both commands will start a local server on port 3000. Open your browser and navigate to:
```
http://localhost:3000
```

## Project Structure

```
women_rights/
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── script.js           # JavaScript functionality
├── package.json        # Project dependencies and scripts
├── package-lock.json   # Locked dependency versions
└── node_modules/       # Installed dependencies
```

## Usage

1. **Home Page**: Overview of global women's rights statistics
2. **Navigation**: Use the top navigation bar to explore different policy areas
3. **Data Visualization**: Interactive charts showing policy data across countries
4. **Country Comparison**: Select multiple countries to compare their policies
5. **Source Verification**: Click on data points to view official sources

## Building for Production

This is a static website, so no build process is required. All files can be served directly from a web server.

```bash
npm run build
```

## License

MIT License

## Contributing

This project focuses on providing accurate, well-sourced information about women's rights policies worldwide. All data should be verifiable through official government sources and reputable organizations.