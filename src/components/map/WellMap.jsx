import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { loadBHTData } from "../../utils/dataLoader";

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function WellMap() {
  const [wells, setWells] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWells = async () => {
      try {
        const result = await loadBHTData();
        // Transform the geoData into the format needed for the map
        // Limit to first 1000 wells and sort by temperature
        const mapWells = result.geoData
          .sort((a, b) => b.temperature - a.temperature) // Sort by temperature (highest first)
          .slice(0, 1000) // Take only the first 1000 wells
          .map((well, index) => ({
            id: index + 1,
            name: well.operation_name || `Well ${well.state}-${index + 1}`,
            coordinates: [well.latitude, well.longitude],
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
        console.error("Error loading well data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWells();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Not provided";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <MapContainer
      center={[31.5, -93.5]}
      zoom={7}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Loading wells...</p>
        </div>
      ) : (
        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={50}
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={true}
          zoomToBoundsOnClick={true}
        >
          {wells.map((well) => (
            <Marker key={well.id} position={well.coordinates}>
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
            </Marker>
          ))}
        </MarkerClusterGroup>
      )}
    </MapContainer>
  );
}
