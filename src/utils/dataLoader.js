import Papa from 'papaparse';

export const loadBHTData = async () => {
  try {
    console.log('Starting to load BHT data...');
    const response = await fetch('/data/SMU/BHT_Data.csv');
    console.log('CSV file fetched:', response.ok);
    const csvText = await response.text();
    console.log('CSV text length:', csvText.length);
    
    const { data } = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      transform: (value) => {
        // Convert numeric values
        if (!isNaN(value) && value !== '') {
          return parseFloat(value);
        }
        return value || ''; // Return empty string for null/undefined/NaN values
      }
    });

    console.log('Parsed data rows:', data.length);
    console.log('First row:', data[0]);
    console.log('Available columns:', Object.keys(data[0]));
    console.log('First row coordinates:', {
      longitude: data[0]['longitude'],
      latitude: data[0]['latitude']
    });

    // Calculate mean depth for wells with temperature 143°C
    const wellsAt143C = data.filter(row => row['bhtcorrected_temp'] === 143);
    const meanDepthAt143C = wellsAt143C.length > 0 
      ? wellsAt143C.reduce((sum, row) => sum + row['depth'], 0) / wellsAt143C.length
      : 0;
    console.log('Mean depth at 143°C:', meanDepthAt143C);

    // Filter and transform data for the temperature vs depth plot
    const temperatureData = data
      .filter(row => {
        const hasData = row['depth'] && row['bhtcorrected_temp'];
        if (!hasData) {
          console.log('Missing temperature or depth data:', row);
        }
        return hasData;
      })
      .map(row => ({
        depth: row['depth'] / 1000, // Convert meters to kilometers
        temperature: row['bhtcorrected_temp']
      }));

    // console.log('Temperature data points:', temperatureData.length);
    if (temperatureData.length > 0) {
      console.log('First 5 temperature data points:', temperatureData.slice(0, 5));
      console.log('Temperature range:', {
        min: Math.min(...temperatureData.map(d => d.temperature)),
        max: Math.max(...temperatureData.map(d => d.temperature))
      });
      console.log('Depth range (km):', {
        min: Math.min(...temperatureData.map(d => d.depth)),
        max: Math.max(...temperatureData.map(d => d.depth))
      });
    }

    // Filter and transform data for the geospatial plot
    const geoData = data
      .filter(row => {
        const hasCoordinates = row['longitude'] && row['latitude'];
        const meetsTempCriteria = row['bhtcorrected_temp'] > 60;
        const meetsDepthCriteria = row['depth'] <= 6000;
        
        // if (!hasCoordinates) {
        //   console.log('Missing coordinates:', row);
        // }
        // if (!meetsTempCriteria) {
        //   console.log('Temperature below 60°C:', row['bhtcorrected_temp']);
        // }
        // if (!meetsDepthCriteria) {
        //   console.log('Depth above 6km:', row['depth']);
        // }
        
        return hasCoordinates && meetsTempCriteria && meetsDepthCriteria;
      })
      .map(row => ({
        longitude: parseFloat(row['longitude']),
        latitude: parseFloat(row['latitude']),
        temperature: parseFloat(row['bhtcorrected_temp']),
        depth: parseFloat(row['depth']) / 1000, // Convert to km for consistency
        state: row['state'],
        operation_name: row['operation_name'],
        drilling_start: row['drilling_start'],
        drilling_complete: row['drilling_complete'],
        field_name: row['field_name'],
        formation: row['formation'],
        company_name: row['company_name']
      }));

    console.log('Geospatial data points:', geoData.length);
    if (geoData.length > 0) {
      console.log('First 5 geospatial data points:', geoData.slice(0, 5));
      console.log('Geospatial temperature range:', {
        min: Math.min(...geoData.map(d => d.temperature)),
        max: Math.max(...geoData.map(d => d.temperature))
      });
      console.log('Geospatial depth range (km):', {
        min: Math.min(...geoData.map(d => d.depth)),
        max: Math.max(...geoData.map(d => d.depth))
      });
    }

    // Validate data structure
    console.log('Temperature data structure:', {
      hasData: temperatureData.length > 0,
      samplePoint: temperatureData[0],
      keys: temperatureData.length > 0 ? Object.keys(temperatureData[0]) : []
    });
    console.log('Geospatial data structure:', {
      hasData: geoData.length > 0,
      samplePoint: geoData[0],
      keys: geoData.length > 0 ? Object.keys(geoData[0]) : []
    });

    return {
      temperatureData,
      geoData,
      statistics: {
        meanDepthAt143C,
        wellsAt143CCount: wellsAt143C.length
      }
    };
  } catch (error) {
    console.error('Error loading BHT data:', error);
    return {
      temperatureData: [],
      geoData: [],
      statistics: {
        meanDepthAt143C: 0,
        wellsAt143CCount: 0
      }
    };
  }
};

export async function loadGravityData() {
  try {
    console.log('Starting to load gravity data...');
    const response = await fetch('/data/gravity/filter_column.txt');
    console.log('Gravity data response:', response.ok);
    const text = await response.text();
    console.log('Gravity data text length:', text.length);
    
    // Process the text data
    const lines = text.split('\n').filter(line => line.trim());
    console.log('Number of lines in gravity data:', lines.length);
    
    const gravityData = lines.map(line => {
      const values = line.trim().split(/\s+/);
      const point = {
        longitude: parseFloat(values[0]),
        latitude: parseFloat(values[1]),
        stationElevation: parseFloat(values[2]),
        observedGravity: parseFloat(values[3]),
        innerTerrainCorrection: parseFloat(values[4]),
        outerTerrainCorrection: parseFloat(values[5]),
        freeAirGravityAnomaly: parseFloat(values[6]),
        bouguerGravityAnomaly: parseFloat(values[7])
      };
      
      // Validate the data
      if (isNaN(point.longitude) || isNaN(point.latitude) || isNaN(point.bouguerGravityAnomaly)) {
        console.warn('Invalid data point:', values);
        return null;
      }
      
      return point;
    }).filter(point => point !== null);

    console.log('Processed gravity data points:', gravityData.length);
    console.log('Sample gravity data point:', gravityData[0]);

    // Filter for positive gravity anomalies
    const positiveAnomalies = gravityData.filter(point => point.bouguerGravityAnomaly > 0);
    console.log('Positive anomalies count:', positiveAnomalies.length);
    console.log('Sample positive anomaly:', positiveAnomalies[0]);
    
    // Log some statistics about the data
    if (positiveAnomalies.length > 0) {
      console.log('Positive anomalies range:', {
        min: Math.min(...positiveAnomalies.map(p => p.bouguerGravityAnomaly)),
        max: Math.max(...positiveAnomalies.map(p => p.bouguerGravityAnomaly)),
        mean: positiveAnomalies.reduce((sum, p) => sum + p.bouguerGravityAnomaly, 0) / positiveAnomalies.length
      });
    }

    return {
      allData: gravityData,
      positiveAnomalies: positiveAnomalies,
      statistics: {
        totalStations: gravityData.length,
        positiveAnomalyCount: positiveAnomalies.length,
        positiveAnomalyPercentage: (positiveAnomalies.length / gravityData.length * 100).toFixed(2)
      }
    };
  } catch (error) {
    console.error('Error loading gravity data:', error);
    return {
      allData: [],
      positiveAnomalies: [],
      statistics: {
        totalStations: 0,
        positiveAnomalyCount: 0,
        positiveAnomalyPercentage: 0
      }
    };
  }
} 