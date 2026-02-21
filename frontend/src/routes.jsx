import React from "react";
import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardMain from "./pages/DashboardMain";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardOperations from "./pages/DashboardOperations";
import DashboardFleetManager from "./pages/DashboardFleetManager";
import DashboardDispatcher from "./pages/DashboardDispatcher";
import DashboardSafetyOfficer from "./pages/DashboardSafetyOfficer";
import DashboardFinanceAnalyst from "./pages/DashboardFinanceAnalyst";
import VehicleRegistry from "./pages/VehicleRegistry";
import DriverManagement from "./pages/DriverManagement";
import Maintenance from "./pages/Maintenance";
import MaintenanceApproval from "./pages/MaintenanceApproval";
import SafetyCompliance from "./pages/SafetyCompliance";
import FinancialReport from "./pages/FinancialReport";
import FinanceReport from "./pages/FinanceReport";
import NewTrip from "./pages/NewTrip";
import AuthPage from "./pages/AuthPage";

function RoutesConfig() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardMain /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><DashboardAdmin /></ProtectedRoute>} />
      <Route path="/operations" element={<ProtectedRoute><DashboardOperations /></ProtectedRoute>} />
      <Route path="/fleet-manager" element={<ProtectedRoute><DashboardFleetManager /></ProtectedRoute>} />
      <Route path="/dispatcher" element={<ProtectedRoute><DashboardDispatcher /></ProtectedRoute>} />
      <Route path="/safety-officer" element={<ProtectedRoute><DashboardSafetyOfficer /></ProtectedRoute>} />
      <Route path="/finance-analyst" element={<ProtectedRoute><DashboardFinanceAnalyst /></ProtectedRoute>} />
      <Route path="/registry" element={<ProtectedRoute><VehicleRegistry /></ProtectedRoute>} />
      <Route path="/driver-management" element={<ProtectedRoute><DriverManagement /></ProtectedRoute>} />
      <Route path="/maintenance" element={<ProtectedRoute><Maintenance /></ProtectedRoute>} />
      <Route path="/maintenance-approval" element={<ProtectedRoute><MaintenanceApproval /></ProtectedRoute>} />
      <Route path="/safety-compliance" element={<ProtectedRoute><SafetyCompliance /></ProtectedRoute>} />
      <Route path="/financial-report" element={<ProtectedRoute><FinancialReport /></ProtectedRoute>} />
      <Route path="/finance-report" element={<ProtectedRoute><FinanceReport /></ProtectedRoute>} />
      <Route path="/new-trip" element={<ProtectedRoute><NewTrip /></ProtectedRoute>} />
    </Routes>
  );
}

export default RoutesConfig;
