import React from "react";
import {
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  LightBulbIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

export default function GeothermalResources() {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Geothermal Resources
            </h1>
            <p className="mt-6 text-lg leading-2 text-gray-700">
              Find local contractors, explore incentive programs, and discover
              financing options for your geothermal project.
            </p>
            <p className="mt-6 text-med leading-8 text-gray-400">
              <br /> If 10% of U.S. homes switched to geothermal heat pumps, it
              could save $10+ billion per year in energy costs.
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Energy Savings Overview */}
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="rounded-2xl bg-gray-50 p-8">
            <div className="flex items-center gap-x-3">
              <LightBulbIcon className="h-5 w-5 text-indigo-600" />
              <h3 className="text-xl font-semibold leading-8 text-gray-900">
                Energy Savings Impact
              </h3>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg bg-white p-6 shadow ring-1 ring-gray-900/5">
                <p className="text-3xl font-bold text-indigo-600">3.0M</p>
                <p className="mt-2 text-sm text-gray-600">
                  Homes Powered by Geothermal
                </p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow ring-1 ring-gray-900/5">
                <p className="text-3xl font-bold text-indigo-600">45%</p>
                <p className="mt-2 text-sm text-gray-600">
                  Average Energy Savings
                </p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow ring-1 ring-gray-900/5">
                <p className="text-3xl font-bold text-indigo-600">2.6M</p>
                <p className="mt-2 text-sm text-gray-600">
                  Tons CO2 Reduced Annually
                </p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow ring-1 ring-gray-900/5">
                <p className="text-3xl font-bold text-indigo-600">$1.2B</p>
                <p className="mt-2 text-sm text-gray-600">
                  Annual Energy Cost Savings
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Local Contractors */}
        <div className="mt-16">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="flex items-center gap-x-3">
              <UserGroupIcon className="h-5 w-5 text-indigo-600" />
              <h3 className="text-xl font-semibold leading-8 text-gray-900">
                Local Geothermal Contractors
              </h3>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg bg-white p-6 shadow ring-1 ring-gray-900/5">
                <h4 className="text-base font-semibold text-gray-900">
                  EcoHeat Solutions
                </h4>
                <p className="mt-2 text-sm text-gray-600">
                  Specialized in residential geothermal installations
                </p>
                <div className="mt-4">
                  <a
                    href="#"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    View Website →
                  </a>
                </div>
              </div>
              <div className="rounded-lg bg-white p-6 shadow ring-1 ring-gray-900/5">
                <h4 className="text-base font-semibold text-gray-900">
                  Green Earth Systems
                </h4>
                <p className="mt-2 text-sm text-gray-600">
                  Commercial and industrial geothermal experts
                </p>
                <div className="mt-4">
                  <a
                    href="#"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    View Website →
                  </a>
                </div>
              </div>
              <div className="rounded-lg bg-white p-6 shadow ring-1 ring-gray-900/5">
                <h4 className="text-base font-semibold text-gray-900">
                  Sustainable Energy Co
                </h4>
                <p className="mt-2 text-sm text-gray-600">
                  Full-service geothermal solutions
                </p>
                <div className="mt-4">
                  <a
                    href="#"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    View Website →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Incentive Programs */}
        <div className="mt-16">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="flex items-center gap-x-3">
              <CurrencyDollarIcon className="h-5 w-5 text-indigo-600" />
              <h3 className="text-xl font-semibold leading-8 text-gray-900">
                Available Incentive Programs
              </h3>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="rounded-lg bg-white p-6 shadow ring-1 ring-gray-900/5">
                <h4 className="text-base font-semibold text-gray-900">
                  Federal Tax Credit
                </h4>
                <p className="mt-2 text-sm text-gray-600">
                  30% tax credit for grid-scale geothermal systems
                </p>
                <div className="mt-4">
                  <a
                    href="#"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Learn More →
                  </a>
                </div>
              </div>
              <div className="rounded-lg bg-white p-6 shadow ring-1 ring-gray-900/5">
                <h4 className="text-base font-semibold text-gray-900">
                  State Rebates
                </h4>
                <p className="mt-2 text-sm text-gray-600">
                  Up to $5,000 in state-specific incentives
                </p>
                <div className="mt-4">
                  <a
                    href="#"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Check Eligibility →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Financing Options */}
        <div className="mt-16">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="flex items-center gap-x-3">
              <BuildingOfficeIcon className="h-5 w-5 text-indigo-600" />
              <h3 className="text-xl font-semibold leading-8 text-gray-900">
                Financing Options
              </h3>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="rounded-lg bg-white p-6 shadow ring-1 ring-gray-900/5">
                <h4 className="text-base font-semibold text-gray-900">
                  Energy-Efficient Mortgages
                </h4>
                <p className="mt-2 text-sm text-gray-600">
                  Special mortgage programs for energy-efficient homes
                </p>
                <div className="mt-4">
                  <a
                    href="#"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Explore Options →
                  </a>
                </div>
              </div>
              <div className="rounded-lg bg-white p-6 shadow ring-1 ring-gray-900/5">
                <h4 className="text-base font-semibold text-gray-900">
                  Property Assessed Clean Energy (PACE)
                </h4>
                <p className="mt-2 text-sm text-gray-600">
                  Long-term financing for energy improvements
                </p>
                <div className="mt-4">
                  <a
                    href="#"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Check Availability →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
