# GeoHeat - Geothermal Well Analysis Dashboard

An interactive dashboard for analyzing geothermal well locations and energy potential in the Sabine Uplift region of Northwest Louisiana and East Texas.

## Features

- **Interactive Map**: Visualize geothermal well locations and heat flow data
- **Well Analysis**: Detailed analysis of well data with temperature profiles and statistics
- **Well Finder**: Search and filter wells based on various criteria
- **Optimal Location**: Find ideal locations for new geothermal wells
- **Resource Assessment**: Comprehensive view of geothermal resources in the region
- **Data Processing**: Tools for processing and analyzing geothermal data

## Tech Stack

- **Frontend Framework**: React with Vite
- **Styling**: Tailwind CSS
- **Mapping**:
  - Mapbox GL JS
  - Leaflet
- **Data Visualization**:
  - Recharts
  - Chart.js
- **Type Safety**: TypeScript
- **Development Tools**:
  - ESLint: Code linting and style enforcement
  - PostCSS: CSS processing and transformation
- **Additional Libraries**:
  - React Router: Navigation and routing
  - React Query: Data fetching and caching
  - Axios: HTTP client

## Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- Mapbox access token

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/jaimiem17/geoheat-app.git
   cd geoheat-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your Mapbox token:

   ```
   VITE_MAPBOX_TOKEN=your_mapbox_token_here
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
├── src/                    # Source code
│   ├── components/        # React components
│   │   ├── features/     # Feature-specific components
│   │   ├── home/         # Homepage components
│   │   └── map/          # Map-related components
│   ├── utils/            # Utility functions and data processing
│   └── types/            # TypeScript type definitions
├── data/                  # Data files and resources
│   ├── SMU/              # SMU Geothermal Laboratory data
│   ├── gravity/          # Gravity data files
│   └── temperature/      # Temperature and heat flow data
├── public/               # Public static assets
└── [configuration files] # Various config files (vite, tailwind, etc.)
```

## Data Organization

The application's data is organized in the following structure:

- `data/SMU/`: Contains SMU Geothermal Laboratory data including:
  - Bottom Hole Temperature (BHT) data
  - Heat flow measurements
  - Well information
- `data/gravity/`: Contains gravity data files including:
  - Texas and Louisiana gravity station data
  - Merged gravity data for the region
  - Processed and cleaned gravity data
- `data/temperature/`: Contains temperature and heat flow data including:
  - Regional temperature data
  - Heat flow measurements
  - Temperature profiles

## Data Sources

The application uses data from:

- SMU Geothermal Laboratory (well data)
- USGS (gravity data)
- Regional temperature data

## License

This project is proprietary software. All rights reserved. See the [LICENSE](LICENSE) file for details.
