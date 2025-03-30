import React, { useState } from "react";
import {
  MapIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import WellMap from "../map/WellMap";

export default function WellFinder() {
  const [temperatureFilter, setTemperatureFilter] = useState("all");
  const [depthFilter, setDepthFilter] = useState("all");

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Well Finder
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Interactive map interface to locate and explore geothermal wells
              across the region. Search, filter, and analyze well data with
              ease.
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Filters Section */}
        <div className="mb-8 bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-medium text-gray-900">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="temperature"
                className="block text-sm font-medium text-gray-700"
              >
                Temperature Range
              </label>
              <select
                id="temperature"
                value={temperatureFilter}
                onChange={(e) => setTemperatureFilter(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="all">All Temperatures</option>
                <option value="high">High ({">"}120°C)</option>
                <option value="medium">Medium (60-120°C)</option>
                <option value="low">Low ({"<"}60°C)</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="depth"
                className="block text-sm font-medium text-gray-700"
              >
                Depth Range
              </label>
              <select
                id="depth"
                value={depthFilter}
                onChange={(e) => setDepthFilter(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="all">All Depths</option>
                <option value="shallow">Shallow ({"<"}3km)</option>
                <option value="medium">Medium (3-5km)</option>
                <option value="deep">Deep ({">"}5km)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="h-[600px] w-full">
            <WellMap />
          </div>
        </div>

        {/* Search Results Section */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-medium text-gray-900">
              Search Results
            </h2>
          </div>
          <div className="text-sm text-gray-500">
            Click on wells in the map to view detailed information
          </div>
        </div>
      </div>
    </div>
  );
}
