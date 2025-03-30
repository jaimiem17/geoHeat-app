import Papa from 'papaparse';

export const loadOptimalLocationData = async () => {
  try {
    console.log('Starting to load optimal location data...');
    
    // Load BHT data
    console.log('Loading BHT data...');
    const bhtResponse = await fetch('/data/SMU/SMU_BHT(SMU-BHT 6-11-2020).csv');
    if (!bhtResponse.ok) throw new Error(`Failed to load BHT data: ${bhtResponse.statusText}`);
    const bhtText = await bhtResponse.text();
    const bhtData = Papa.parse(bhtText, { 
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      transform: (value) => value.trim()
    }).data;
    console.log(`Loaded ${bhtData.length} BHT data points`);

    // Load heat flow data
    console.log('Loading heat flow data...');
    const heatFlowResponse = await fetch('/data/temperature/SMU HeatFlowdata for upload 12-2022 for public(Table 5-13-21).csv');
    if (!heatFlowResponse.ok) throw new Error(`Failed to load heat flow data: ${heatFlowResponse.statusText}`);
    const heatFlowText = await heatFlowResponse.text();
    const heatFlowData = Papa.parse(heatFlowText, { 
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      transform: (value) => value.trim()
    }).data;
    console.log(`Loaded ${heatFlowData.length} heat flow data points`);

    // Load gravity data
    console.log('Loading gravity data...');
    const gravityResponse = await fetch('/data/gravity/filter_column.txt');
    if (!gravityResponse.ok) throw new Error(`Failed to load gravity data: ${gravityResponse.statusText}`);
    const gravityText = await gravityResponse.text();
    const gravityData = gravityText.split('\n')
      .filter(line => line.trim())
      .map(line => {
        const values = line.trim().split(/\s+/);
        return {
          longitude: parseFloat(values[0]),
          latitude: parseFloat(values[1]),
          stationElevation: parseFloat(values[2]),
          observedGravity: parseFloat(values[3]),
          innerTerrainCorrection: parseFloat(values[4]),
          outerTerrainCorrection: parseFloat(values[5]),
          freeAirGravityAnomaly: parseFloat(values[6]),
          bouguerGravityAnomaly: parseFloat(values[7])
        };
      });
    console.log(`Loaded ${gravityData.length} gravity data points`);

    // Process and combine data
    const locationMap = new Map();
    let validBHTPoints = 0;
    let validHeatFlowPoints = 0;
    let validGravityPoints = 0;

    // Process BHT data
    bhtData.forEach((point) => {
      const lat = parseFloat(point.latitude);
      const lon = parseFloat(point.longitude);
      const temp = parseFloat(point.bhtcorrected_temp);
      
      if (!isNaN(lat) && !isNaN(lon) && !isNaN(temp)) {
        const key = `${lat.toFixed(4)},${lon.toFixed(4)}`;
        locationMap.set(key, {
          latitude: lat,
          longitude: lon,
          temperature: temp,
        });
        validBHTPoints++;
      }
    });

    // Add heat flow data
    heatFlowData.forEach((point) => {
      // Skip empty rows or rows without heat flow data
      if (!point.ID || !point['CO HF (mW/m2)']) return;

      // Extract state from ID (format: STATE-XXXXX)
      const state = point.ID.split('-')[0];
      
      // For now, we'll use a simplified approach with fixed coordinates for each state
      // This is a temporary solution until we get the actual coordinates
      let lat, lon;
      switch (state) {
        case 'TX':
          lat = 31.9686;
          lon = -99.9018;
          break;
        case 'LA':
          lat = 31.2448;
          lon = -92.1450;
          break;
        case 'AK':
          lat = 64.8561;
          lon = -147.8028;
          break;
        default:
          return;
      }

      const heatFlow = parseFloat(point['CO HF (mW/m2)']);
      
      if (!isNaN(lat) && !isNaN(lon) && !isNaN(heatFlow)) {
        const key = `${lat.toFixed(4)},${lon.toFixed(4)}`;
        const existing = locationMap.get(key);
        if (existing) {
          existing.heatFlow = heatFlow;
        } else {
          locationMap.set(key, {
            latitude: lat,
            longitude: lon,
            heatFlow: heatFlow,
          });
        }
        validHeatFlowPoints++;
      }
    });

    // Add gravity data
    gravityData.forEach((point) => {
      const lat = parseFloat(point.latitude);
      const lon = parseFloat(point.longitude);
      const gravity = parseFloat(point.bouguerGravityAnomaly);
      
      if (!isNaN(lat) && !isNaN(lon) && !isNaN(gravity)) {
        const key = `${lat.toFixed(4)},${lon.toFixed(4)}`;
        const existing = locationMap.get(key);
        if (existing) {
          existing.gravity = gravity;
        } else {
          locationMap.set(key, {
            latitude: lat,
            longitude: lon,
            gravity: gravity,
          });
        }
        validGravityPoints++;
      }
    });

    console.log(`Valid data points:
      BHT: ${validBHTPoints}
      Heat Flow: ${validHeatFlowPoints}
      Gravity: ${validGravityPoints}`);

    // Log sample data points
    console.log('Sample BHT point:', bhtData[0]);
    console.log('Sample Heat Flow point:', heatFlowData[0]);
    console.log('Sample Gravity point:', gravityData[0]);

    // Convert map to array and filter out incomplete data points
    const locations = Array.from(locationMap.values()).filter(
      (location) => location.temperature && location.heatFlow && location.gravity
    );

    console.log(`Total valid locations with complete data: ${locations.length}`);
    if (locations.length > 0) {
      console.log('Sample complete location:', locations[0]);
    }

    // Log some incomplete locations to understand what's missing
    const incompleteLocations = Array.from(locationMap.values()).filter(
      (location) => !location.temperature || !location.heatFlow || !location.gravity
    );
    console.log('Sample incomplete locations:', incompleteLocations.slice(0, 3));

    // Instead of throwing an error, let's use a more lenient approach
    // We'll use locations that have at least two out of three measurements
    const partialLocations = Array.from(locationMap.values()).filter(
      (location) => 
        (location.temperature && location.heatFlow) ||
        (location.temperature && location.gravity) ||
        (location.heatFlow && location.gravity)
    );

    console.log(`Total locations with at least two measurements: ${partialLocations.length}`);
    if (partialLocations.length > 0) {
      console.log('Sample partial location:', partialLocations[0]);
    }

    // Calculate statistics for normalization
    const stats = {
      temperature: {
        min: Math.min(...partialLocations.map((l) => l.temperature || 0)),
        max: Math.max(...partialLocations.map((l) => l.temperature || 0)),
      },
      heatFlow: {
        min: Math.min(...partialLocations.map((l) => l.heatFlow || 0)),
        max: Math.max(...partialLocations.map((l) => l.heatFlow || 0)),
      },
      gravity: {
        min: Math.min(...partialLocations.map((l) => l.gravity || 0)),
        max: Math.max(...partialLocations.map((l) => l.gravity || 0)),
      },
    };

    console.log('Data statistics:', stats);

    return {
      locations: partialLocations,
      stats,
    };
  } catch (error) {
    console.error('Error loading optimal location data:', error);
    throw error; // Re-throw to handle in the component
  }
}; 