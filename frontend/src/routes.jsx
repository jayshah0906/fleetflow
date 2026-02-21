import React from "react";
import { Routes, Route } from "react-router-dom";

import DashboardMain from "./pages/DashboardMain";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardOperations from "./pages/DashboardOperations";
import VehicleRegistry from "./pages/VehicleRegistry";
import AuthPage from "./pages/AuthPage";

function RoutesConfig() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/dashboard" element={<DashboardMain />} />
      <Route path="/admin" element={<DashboardAdmin />} />
      <Route path="/operations" element={<DashboardOperations />} />
      <Route path="/registry" element={<VehicleRegistry />} />
    </Routes>
  );
}

export default RoutesConfig;
