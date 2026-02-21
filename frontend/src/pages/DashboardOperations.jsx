import React from "react";
import Sidebar from "../components/layout/Sidebar";
import KPICard from "../components/dashboard/KPICard";
import DriverCard from "../components/dashboard/DriverCard";
import FleetMap from "../components/dashboard/FleetMap";

function DashboardOperations() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="content-area">
        <div className="kpi-grid">
          <KPICard title="Total Spend" value="$42,850" />
          <KPICard title="Fuel Efficiency" value="18.5 MPG" />
          <KPICard title="Fleet Safety" value="92/100" />
          <KPICard title="Active Fleet" value="124" />
        </div>

        <div className="driver-grid">
          <DriverCard name="James Wilson" score="98" />
          <DriverCard name="Sarah Smith" score="74" />
          <DriverCard name="Robert Fox" score="99" />
        </div>

        <FleetMap />
      </div>
    </div>
  );
}

export default DashboardOperations;
