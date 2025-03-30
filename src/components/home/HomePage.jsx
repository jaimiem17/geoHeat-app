import React from "react";
import { Link } from "react-router-dom";
import {
  ChartBarIcon,
  MapIcon,
  MagnifyingGlassIcon,
  BeakerIcon,
} from "@heroicons/react/24/outline";

// Features for each page
const features = [
  {
    name: "Well Analysis",
    description:
      "Analyze geothermal well data including temperature, depth, and energy potential.",
    icon: ChartBarIcon,
    href: "/well-analysis",
  },
  {
    name: "Well Finder",
    description:
      "Interactive map to locate and explore geothermal wells across the region.",
    icon: MapIcon,
    href: "/well-finder",
  },
  {
    name: "Optimal Location",
    description:
      "Find the best locations for new geothermal wells based on geological data.",
    icon: MagnifyingGlassIcon,
    href: "/optimal-location",
  },
  {
    name: "Resources",
    description: "Process and analyze raw geothermal data for insights.",
    icon: BeakerIcon,
    href: "/geothermal-resources",
  },
];

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Geothermal Energy Dashboard
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Analyze and optimize geothermal well locations with our
              open-source interactive dashboard. Make data-driven decisions for
              geothermal energy development.
            </p>
          </div>
        </div>
      </div>

      {/* Feature section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">
            Geothermal Analysis
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to analyze geothermal wells
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our comprehensive dashboard provides tools for analyzing well data,
            finding optimal locations, and processing geological information.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <feature.icon
                    className="h-5 w-5 flex-none text-indigo-600"
                    aria-hidden="true"
                  />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                  <p className="mt-6">
                    <Link
                      to={feature.href}
                      className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                    >
                      Learn more <span aria-hidden="true">→</span>
                    </Link>
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Stats section */}
      <div className="mx-auto mt-32 max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Key Statistics
            </h2>
          </div>
          <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col bg-gray-400/5 p-8">
              <dt className="text-sm leading-6 text-gray-600">Total Wells</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">
                2,500+
              </dd>
            </div>
            <div className="flex flex-col bg-gray-400/5 p-8">
              <dt className="text-sm leading-6 text-gray-600">
                Average Temperature
              </dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">
                120°C
              </dd>
            </div>
            <div className="flex flex-col bg-gray-400/5 p-8">
              <dt className="text-sm leading-6 text-gray-600">Average Depth</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">
                2.5km
              </dd>
            </div>
            <div className="flex flex-col bg-gray-400/5 p-8">
              <dt className="text-sm leading-6 text-gray-600">Data Points</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">
                1M+
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
