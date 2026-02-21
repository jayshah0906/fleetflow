import React from "react";
import Sidebar from "../components/layout/Sidebar";
import MaintenanceTable from "../components/dashboard/MaintenanceTable";
import DispatchForm from "../components/dashboard/DispatchForm";
import EfficiencyBanner from "../components/dashboard/EfficiencyBanner";

function DashboardAdmin() {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="content-area">
        <div className="admin-grid">
          <DispatchForm />
          <MaintenanceTable />
        </div>

        <EfficiencyBanner />
      </div>
    </div>
  );
}

export default DashboardAdmin;
