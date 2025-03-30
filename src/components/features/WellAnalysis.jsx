import React, { useEffect, useState } from "react";
import { ChartBarIcon } from "@heroicons/react/24/outline";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  ReferenceLine,
} from "recharts";
import { loadBHTData, loadGravityData } from "../../utils/dataLoader";

export default function WellAnalysis() {
  const [data, setData] = useState({
    temperatureData: [],
    geoData: [],
    statistics: {
      wellsAt143CCount: 0,
      meanDepthAt143C: 0,
    },
  });
  const [gravityData, setGravityData] = useState({
    allData: [],
    positiveAnomalies: [],
    statistics: {
      totalStations: 0,
      positiveAnomalyCount: 0,
      positiveAnomalyPercentage: 0,
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [bhtResult, gravityResult] = await Promise.all([
          loadBHTData(),
          loadGravityData(),
        ]);

        setData(bhtResult);
        setGravityData(gravityResult);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Well Analysis
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Comprehensive analysis of geothermal wells including temperature
              profiles, depth measurements, and energy potential calculations.
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">
            Analysis Tools
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Advanced Well Analysis Features
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Access powerful tools for analyzing geothermal well data and
            generating insights.
          </p>
        </div>

        {/* Analysis Features */}
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-3">
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold leading-8 text-gray-900">
                Temperature Analysis
              </h3>
              <p className="mt-4 text-base leading-7 text-gray-600">
                Analyze temperature profiles and gradients across different
                depths.
              </p>
            </div>
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold leading-8 text-gray-900">
                Energy Potential
              </h3>
              <p className="mt-4 text-base leading-7 text-gray-600">
                Calculate and visualize the energy potential of each well.
              </p>
            </div>
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold leading-8 text-gray-900">
                Performance Metrics
              </h3>
              <p className="mt-4 text-base leading-7 text-gray-600">
                Track and compare well performance over time.
              </p>
            </div>
          </div>
        </div>

        {/* Data Visualization Section */}
        <div className="mt-32">
          {/* Statistics Section */}
          <div className="rounded-2xl bg-gray-50 p-8 mb-8">
            <h3 className="text-xl font-semibold leading-8 text-gray-900 mb-4">
              Key Statistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="text-sm font-medium text-gray-500">
                  Wells at 143°C
                </h4>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {data.statistics.wellsAt143CCount}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="text-sm font-medium text-gray-500">
                  Mean Depth at 143°C
                </h4>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {data.statistics.meanDepthAt143C.toFixed(2)} km
                </p>
              </div>
            </div>
          </div>

          {/* Temperature vs Depth Scatter Plot */}
          <div className="rounded-2xl bg-gray-50 p-8">
            <h3 className="text-xl font-semibold leading-8 text-gray-900 mb-8">
              Bottom Hole Temperature vs Depth
            </h3>
            <div className="h-[400px] w-full">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Loading data...</p>
                </div>
              ) : data.temperatureData.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No temperature data available</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 30,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="depth"
                      label={{
                        value: "Depth (km)",
                        position: "bottom",
                        offset: 10,
                      }}
                      type="number"
                      domain={["dataMin", "dataMax"]}
                    />
                    <YAxis
                      label={{
                        value: "Subsurface Temperature (°C)",
                        angle: -90,
                        position: "insideLeft",
                        style: {
                          textAnchor: "middle",
                        },
                      }}
                      type="number"
                      domain={["dataMin", "dataMax"]}
                    />
                    <Tooltip />
                    <Scatter
                      data={data.temperatureData}
                      fill="rgba(0, 150, 255, 0.6)"
                      name="Bottom Hole Temperature"
                      dataKey="temperature"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Geospatial Plot */}
          <div className="col-span-2">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold mb-4">
                Well Locations (Temperature {">"} 60°C, Depth ≤ 6km)
              </h3>
              <div className="h-[400px]">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Loading data...</p>
                  </div>
                ) : data.geoData.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">
                      No geospatial data available
                    </p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 30,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="longitude"
                        label={{
                          value: "Longitude",
                          position: "bottom",
                          offset: 10,
                        }}
                        type="number"
                        domain={["dataMin", "dataMax"]}
                      />
                      <YAxis
                        label={{
                          value: "Latitude",
                          angle: -90,
                          position: "insideLeft",
                          style: {
                            textAnchor: "middle",
                          },
                        }}
                        type="number"
                        domain={["dataMin", "dataMax"]}
                      />
                      <Tooltip />
                      <Scatter
                        data={data.geoData}
                        fill="rgba(0, 150, 255, 0.6)"
                        name="Well Locations"
                        dataKey="temperature"
                      />
                      <ReferenceLine
                        x={-94}
                        stroke="#000"
                        strokeDasharray="3 3"
                        label="TX|LA Boundary"
                      />
                      <ReferenceLine
                        y={33}
                        stroke="#000"
                        strokeDasharray="3 3"
                        label="TX|LA Boundary"
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          {/* Gravity Anomalies Chart */}
          <div className="mt-8 rounded-2xl bg-gray-50 p-8">
            <h3 className="text-xl font-semibold leading-8 text-gray-900 mb-8">
              Locations of Positive Gravity Anomalies in Texas
            </h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                {gravityData.statistics.positiveAnomalyPercentage}% of stations
                show positive gravity anomalies. Gravity anomoly data allows us
                to clearly visualize high gravity anomalies as well as regions
                likely to have thermal resources.
              </p>
            </div>
            <div className="h-[400px] w-full">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Loading data...</p>
                </div>
              ) : !gravityData.positiveAnomalies ||
                gravityData.positiveAnomalies.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">
                    No gravity anomaly data available
                  </p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 30,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="longitude"
                      label={{
                        value: "Longitude",
                        position: "bottom",
                        offset: 10,
                      }}
                      type="number"
                      domain={["dataMin", "dataMax"]}
                    />
                    <YAxis
                      label={{
                        value: "Latitude",
                        angle: -90,
                        position: "insideLeft",
                        style: {
                          textAnchor: "middle",
                        },
                      }}
                      type="number"
                      domain={["dataMin", "dataMax"]}
                    />
                    <Tooltip />
                    <Scatter
                      data={gravityData.positiveAnomalies}
                      fill="rgba(79, 70, 229, 0.6)"
                      name="Positive Gravity Anomalies"
                      xAxisId={0}
                      yAxisId={0}
                      xDataKey="longitude"
                      yDataKey="latitude"
                    />
                    <ReferenceLine
                      x={-94}
                      stroke="#000"
                      strokeDasharray="3 3"
                      label="TX|LA Boundary"
                    />
                    <ReferenceLine
                      y={33}
                      stroke="#000"
                      strokeDasharray="3 3"
                      label="TX|LA Boundary"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
