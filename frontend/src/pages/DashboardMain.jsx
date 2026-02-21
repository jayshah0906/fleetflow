import React from "react";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import KPICard from "../components/dashboard/KPICard";
import TripsTable from "../components/dashboard/TripsTable";
import FleetMap from "../components/dashboard/FleetMap";
import "../styles/dashboard.css";

function DashboardMain() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="content-area">
        <Topbar />

        <div className="page-content">
          <div className="kpi-grid">
            <KPICard title="Active Fleet" value="220" />
            <KPICard title="Maint. Alerts" value="05" />
            <KPICard title="Utilization" value="92%" />
            <KPICard title="Pending Cargo" value="20" />
          </div>

          <TripsTable />
          <FleetMap />
        </div>
      </div>
    </div>
  );
}

export default DashboardMain;
