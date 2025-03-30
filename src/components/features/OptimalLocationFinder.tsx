import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import type { LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import { loadOptimalLocationData } from "../../utils/optimalLocationData";
import { loadBHTData } from "../../utils/dataLoader";

interface LocationData {
  latitude: number;
  longitude: number;
  temperature: number;
  heatFlow: number;
  gravity: number;
  score?: number;
}

interface WellData {
  id: number;
  name: string;
  coordinates: [number, number];
  temperature: number;
  depth: number;
  state: string;
  drillingStart: string;
  drillingComplete: string;
  fieldName: string;
  formation: string;
  companyName: string;
}

interface CriteriaWeights {
  temperature: number;
  heatFlow: number;
  gravity: number;
}

interface DataStats {
  temperature: { min: number; max: number };
  heatFlow: { min: number; max: number };
  gravity: { min: number; max: number };
}

// Component to handle map updates
const MapUpdater: React.FC<{ locations: LocationData[] }> = ({ locations }) => {
  const map = useMap();

  useEffect(() => {
    if (locations.length > 0) {
      const bounds = locations.map(
        (loc) => [loc.latitude, loc.longitude] as LatLngTuple
      );
      // Add padding to the bounds
      const boundsWithPadding = map.getBounds().pad(0.1);
      map.fitBounds(boundsWithPadding, {
        padding: [50, 50],
        maxZoom: 8,
      });
    }
  }, [locations, map]);

  return null;
};

const OptimalLocationFinder: React.FC = () => {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [wells, setWells] = useState<WellData[]>([]);
  const [stats, setStats] = useState<DataStats>({
    temperature: { min: 0, max: 0 },
    heatFlow: { min: 0, max: 0 },
    gravity: { min: 0, max: 0 },
  });
  const [weights, setWeights] = useState<CriteriaWeights>({
    temperature: 0.5,
    heatFlow: 0.3,
    gravity: 0.2,
  });
  const [matchThreshold, setMatchThreshold] = useState(0.8);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load both optimal location data and well data
        const [optimalData, bhtData] = await Promise.all([
          loadOptimalLocationData(),
          loadBHTData(),
        ]);

        if (optimalData.locations.length === 0) {
          throw new Error("No valid location data found");
        }

        setLocations(optimalData.locations);
        setStats(optimalData.stats);

        // Transform well data
        const mapWells = bhtData.geoData
          .sort((a, b) => b.temperature - a.temperature)
          .slice(0, 1000)
          .map((well, index) => ({
            id: index + 1,
            name: well.operation_name || `Well ${well.state}-${index + 1}`,
            coordinates: [well.latitude, well.longitude] as [number, number],
            temperature: well.temperature,
            depth: well.depth,
            state: well.state,
            drillingStart: well.drilling_start,
            drillingComplete: well.drilling_complete,
            fieldName: well.field_name,
            formation: well.formation,
            companyName: well.company_name,
          }));
        setWells(mapWells);
      } catch (error) {
        console.error("Error loading data:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load data"
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const calculateScore = (location: LocationData): number => {
    // Track which measurements are available
    const availableMeasurements = {
      temperature: location.temperature !== undefined,
      heatFlow: location.heatFlow !== undefined,
      gravity: location.gravity !== undefined,
    };

    // Calculate total available weight
    const totalAvailableWeight = Object.entries(availableMeasurements).reduce(
      (sum, [key, available]) =>
        sum + (available ? weights[key as keyof CriteriaWeights] : 0),
      0
    );

    if (totalAvailableWeight === 0) return 0;

    // Normalize values between 0 and 1 and calculate weighted sum
    let score = 0;

    if (availableMeasurements.temperature) {
      const normalizedTemp =
        (location.temperature - stats.temperature.min) /
        (stats.temperature.max - stats.temperature.min);
      score += normalizedTemp * weights.temperature;
    }

    if (availableMeasurements.heatFlow) {
      const normalizedHeatFlow =
        (location.heatFlow - stats.heatFlow.min) /
        (stats.heatFlow.max - stats.heatFlow.min);
      score += normalizedHeatFlow * weights.heatFlow;
    }

    if (availableMeasurements.gravity) {
      const normalizedGravity =
        (location.gravity - stats.gravity.min) /
        (stats.gravity.max - stats.gravity.min);
      score += normalizedGravity * weights.gravity;
    }

    // Normalize the final score by the total available weight
    return score / totalAvailableWeight;
  };

  const calculateWellScore = (well: WellData): number => {
    // Normalize temperature between 0 and 1 based on stats
    const normalizedTemp =
      (well.temperature - stats.temperature.min) /
      (stats.temperature.max - stats.temperature.min);

    // For wells, we'll focus mainly on temperature since that's our primary data
    // We can add more criteria later if we get more well data
    return normalizedTemp;
  };

  const getFilteredLocations = (): LocationData[] => {
    return locations.filter((location) => {
      const score = calculateScore(location);
      return score >= matchThreshold;
    });
  };

  const getFilteredWells = (): WellData[] => {
    return wells
      .filter((well) => {
        const score = calculateWellScore(well);
        return score >= matchThreshold;
      })
      .sort((a, b) => calculateWellScore(b) - calculateWellScore(a))
      .slice(0, 50); // Only show top 50 wells that meet criteria
  };

  const getMarkerStyle = (): L.PathOptions => {
    return {
      fillColor: "#7C3AED", // Purple for all locations
      color: "#5B21B6", // Darker purple for border
      weight: 3,
      opacity: 1,
      fillOpacity: 0.8,
    };
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "Not provided";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleApplyCriteria = () => {
    // Instead of remounting the map, just update the weights and threshold
    // The markers will update automatically due to React's state management
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-600 text-center">
          <h2 className="text-xl font-semibold mb-2">Error Loading Data</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const center: LatLngTuple = [31.9686, -99.9018];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Optimal Location Finder</h1>

      {/* Criteria Weights and Threshold Controls */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Adjust Criteria Weights</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Temperature Weight: {weights.temperature.toFixed(2)}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={weights.temperature}
              onChange={(e) =>
                setWeights({
                  ...weights,
                  temperature: parseFloat(e.target.value),
                })
              }
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Heat Flow Weight: {weights.heatFlow.toFixed(2)}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={weights.heatFlow}
              onChange={(e) =>
                setWeights({ ...weights, heatFlow: parseFloat(e.target.value) })
              }
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gravity Weight: {weights.gravity.toFixed(2)}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={weights.gravity}
              onChange={(e) =>
                setWeights({ ...weights, gravity: parseFloat(e.target.value) })
              }
              className="w-full"
            />
          </div>
          <div className="mt-4 pt-4 border-t">
            <label className="block text-sm font-medium text-gray-700">
              Match Threshold: {matchThreshold.toFixed(2)}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={matchThreshold}
              onChange={(e) => setMatchThreshold(parseFloat(e.target.value))}
              className="w-full"
            />
            <p className="text-sm text-gray-500 mt-1">
              Locations with scores above this threshold will be highlighted
            </p>
          </div>
          <div className="mt-4">
            <button
              onClick={handleApplyCriteria}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Apply Criteria
            </button>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="h-[600px] w-full rounded-lg shadow relative">
        <MapContainer
          center={center}
          zoom={6}
          style={{ height: "100%", width: "100%" }}
          bounds={[
            [25, -107], // Southwest coordinates
            [37, -93], // Northeast coordinates
          ]}
          boundsOptions={{ padding: [50, 50] }}
        >
          <MapUpdater locations={locations} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MarkerClusterGroup
            chunkedLoading
            maxClusterRadius={50}
            spiderfyOnMaxZoom={true}
            showCoverageOnHover={true}
            zoomToBoundsOnClick={true}
            key={`${weights.temperature}-${weights.heatFlow}-${weights.gravity}-${matchThreshold}`}
          >
            {/* Plot only matching optimal locations */}
            {getFilteredLocations().map((location, index) => (
              <CircleMarker
                key={`opt-${index}`}
                center={[location.latitude, location.longitude] as LatLngTuple}
                radius={12}
                pathOptions={getMarkerStyle()}
              >
                <Popup>
                  <div className="p-2 min-w-[250px]">
                    <h3 className="font-semibold mb-2">
                      🎯 Optimal Well Location
                    </h3>
                    <div className="space-y-1">
                      <p>
                        Temperature: {location.temperature?.toFixed(2) ?? "N/A"}
                        °C
                      </p>
                      <p>
                        Heat Flow: {location.heatFlow?.toFixed(2) ?? "N/A"}{" "}
                        mW/m²
                      </p>
                      <p>
                        Gravity: {location.gravity?.toFixed(2) ?? "N/A"} mGal
                      </p>
                      <p className="font-semibold">
                        Score: {calculateScore(location).toFixed(2)}
                      </p>
                      <p className="text-purple-600 font-medium">
                        ✓ Matching location (score ≥ {matchThreshold.toFixed(2)}
                        )
                      </p>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}

            {/* Plot only matching wells */}
            {getFilteredWells().map((well) => (
              <CircleMarker
                key={`well-${well.id}`}
                center={well.coordinates}
                radius={6}
                pathOptions={getMarkerStyle()}
              >
                <Popup>
                  <div className="p-2 min-w-[250px]">
                    <h3 className="text-base font-semibold text-gray-900 mb-2">
                      {well.name}
                    </h3>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Location:</span>{" "}
                        {well.state}
                      </p>
                      {well.companyName && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Company:</span>{" "}
                          {well.companyName}
                        </p>
                      )}
                      {well.formation && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Formation:</span>{" "}
                          {well.formation}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Temperature:</span>{" "}
                        {well.temperature.toFixed(1)}°C
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Depth:</span>{" "}
                        {well.depth.toFixed(1)}km
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Score:</span>{" "}
                        {calculateWellScore(well).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Drilling Start:</span>{" "}
                        {formatDate(well.drillingStart)}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Drilling Complete:</span>{" "}
                        {formatDate(well.drillingComplete)}
                      </p>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>
        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg z-[1000]">
          <h4 className="font-semibold mb-2">Location Types</h4>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-[#7C3AED] mr-2"></div>
              <span className="text-sm">Matching Locations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Temperature Range</h3>
          <p className="text-gray-600">
            {stats.temperature.min.toFixed(1)}°C -{" "}
            {stats.temperature.max.toFixed(1)}°C
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Heat Flow Range</h3>
          <p className="text-gray-600">
            {stats.heatFlow.min.toFixed(1)} - {stats.heatFlow.max.toFixed(1)}{" "}
            mW/m²
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Gravity Range</h3>
          <p className="text-gray-600">
            {stats.gravity.min.toFixed(1)} - {stats.gravity.max.toFixed(1)} mGal
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Matching Locations</h3>
          <p className="text-gray-600">
            {locations.filter((loc) => calculateScore(loc) >= matchThreshold)
              .length + getFilteredWells().length}{" "}
            locations
          </p>
        </div>
      </div>
    </div>
  );
};

export default OptimalLocationFinder;
