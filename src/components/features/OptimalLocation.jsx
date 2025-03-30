import React from "react";
import OptimalLocationFinder from "./OptimalLocationFinder";

export default function OptimalLocation() {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Optimal Location Finder
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Find the perfect locations for new geothermal wells based on
              geological data, temperature gradients, and energy potential.
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <OptimalLocationFinder />
      </div>
    </div>
  );
}
