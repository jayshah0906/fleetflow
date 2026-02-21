import React from "react";
import Sidebar from "../components/layout/Sidebar";
import StatsCard from "../components/registry/StatsCard";
import VehicleTable from "../components/registry/VehicleTable";
import Pagination from "../components/registry/Pagination";
import "../styles/registry.css";

function VehicleRegistry() {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="content-area">
        <div className="stats-grid">
          <StatsCard title="Total Fleet" value="124" />
          <StatsCard title="Active Status" value="98" />
          <StatsCard title="In Maintenance" value="12" />
        </div>

        <VehicleTable />
        <Pagination />
      </div>
    </div>
  );
}

export default VehicleRegistry;
