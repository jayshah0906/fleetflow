import React, { useState, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import KPICard from "../components/dashboard/KPICard";
import TripsTable from "../components/dashboard/TripsTable";
import FleetMap from "../components/dashboard/FleetMap";
import api from "../services/api";
import "../styles/dashboard.css";

function DashboardMain() {
  const [kpis, setKpis] = useState({
    total_vehicles: 0,
    maintenance_alerts: 0,
    utilization_rate: 0,
    pending_trips: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.getDashboardKPIs();
      if (response.success) {
        setKpis(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="content-area">
        <Topbar />

        <div className="page-content">
          <div className="kpi-grid">
            <KPICard 
              title="Active Fleet" 
              value={loading ? "..." : kpis.total_vehicles || 0} 
            />
            <KPICard 
              title="Maint. Alerts" 
              value={loading ? "..." : String(kpis.maintenance_alerts || 0).padStart(2, '0')} 
            />
            <KPICard 
              title="Utilization" 
              value={loading ? "..." : `${Math.round(kpis.utilization_rate || 0)}%`} 
            />
            <KPICard 
              title="Pending Cargo" 
              value={loading ? "..." : kpis.pending_trips || 0} 
            />
          </div>

          <TripsTable />
          <FleetMap />
        </div>
      </div>
    </div>
  );
}

export default DashboardMain;
