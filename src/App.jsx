import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import WellMap from "./components/map/WellMap";
import HomePage from "./components/home/HomePage";
import WellAnalysis from "./components/features/WellAnalysis";
import WellFinder from "./components/features/WellFinder";
import OptimalLocation from "./components/features/OptimalLocation";
import GeothermalResources from "./components/features/GeothermalResources";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-2 px-4 sm:px-2 lg:px-8">
            <div className="flex justify-between items-center">
              <Link
                to="/"
                className="text-7xl font-bold text-gray-900 hover:text-indigo-600"
              >
                GeoHeat
              </Link>
              <nav className="flex space-x-4">
                <Link
                  to="/well-analysis"
                  className="text-gray-600 hover:text-indigo-600"
                >
                  Well Analysis
                </Link>
                <Link
                  to="/well-finder"
                  className="text-gray-600 hover:text-indigo-600"
                >
                  Well Finder
                </Link>
                <Link
                  to="/optimal-location"
                  className="text-gray-600 hover:text-indigo-600"
                >
                  Optimal Location
                </Link>
                <Link
                  to="/geothermal-resources"
                  className="text-gray-600 hover:text-indigo-600"
                >
                  Resources
                </Link>
              </nav>
            </div>
          </div>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/well-analysis" element={<WellAnalysis />} />
            <Route path="/well-finder" element={<WellFinder />} />
            <Route path="/optimal-location" element={<OptimalLocation />} />
            <Route
              path="/geothermal-resources"
              element={<GeothermalResources />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
