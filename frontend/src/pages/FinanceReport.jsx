import React from "react";
import { useNavigate } from "react-router-dom";
import SidebarFleetManager from "../components/layout/SidebarFleetManager";
import "../styles/dashboard.css";

function FinanceReport() {
  const navigate = useNavigate();

  const handleViewDetailedReport = () => {
    navigate("/financial-report");
  };

  return (
    <div className="app-layout">
      <SidebarFleetManager />
      <div className="content-area" style={{ backgroundColor: '#ffffff' }}>
        <div className="page-content" style={{ backgroundColor: '#ffffff', padding: '30px' }}>
          
          <h1 style={{ color: '#333', marginBottom: '20px' }}>Finance Report</h1>
          <p style={{ color: '#6c757d', marginBottom: '30px', fontSize: '16px' }}>
            Financial overview and analytics for fleet operations.
          </p>

          {/* Quick Stats KPI Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
            marginBottom: '40px'
          }}>
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '30px',
              borderRadius: '12px',
              border: '1px solid #dee2e6',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#28a745', fontSize: '14px', marginBottom: '10px', fontWeight: '600', textTransform: 'uppercase' }}>
                Total Revenue
              </h3>
              <p style={{ color: '#28a745', fontSize: '36px', fontWeight: 'bold', margin: 0 }}>
                Rs. 99L
              </p>
            </div>
            
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '30px',
              borderRadius: '12px',
              border: '1px solid #dee2e6',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#dc3545', fontSize: '14px', marginBottom: '10px', fontWeight: '600', textTransform: 'uppercase' }}>
                Total Expenses
              </h3>
              <p style={{ color: '#dc3545', fontSize: '36px', fontWeight: 'bold', margin: 0 }}>
                Rs. 35L
              </p>
            </div>

            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '30px',
              borderRadius: '12px',
              border: '1px solid #dee2e6',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#007bff', fontSize: '14px', marginBottom: '10px', fontWeight: '600', textTransform: 'uppercase' }}>
                Fleet ROI
              </h3>
              <p style={{ color: '#007bff', fontSize: '36px', fontWeight: 'bold', margin: 0 }}>
                + 12.5%
              </p>
            </div>
            
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '30px',
              borderRadius: '12px',
              border: '1px solid #dee2e6',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#6f42c1', fontSize: '14px', marginBottom: '10px', fontWeight: '600', textTransform: 'uppercase' }}>
                Active Vehicles
              </h3>
              <p style={{ color: '#6f42c1', fontSize: '36px', fontWeight: 'bold', margin: 0 }}>
                220
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '30px',
            borderRadius: '12px',
            border: '1px solid #dee2e6',
            marginBottom: '30px'
          }}>
            <h2 style={{ color: '#333', fontSize: '20px', marginBottom: '20px', fontWeight: '600' }}>
              Quick Actions
            </h2>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <button 
                onClick={handleViewDetailedReport}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                View Detailed Report
              </button>
            </div>
          </div>

          {/* Recent Activity Summary */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #dee2e6',
            padding: '30px'
          }}>
            <h2 style={{ color: '#333', fontSize: '20px', marginBottom: '20px', fontWeight: '600' }}>
              Recent Financial Activity
            </h2>
            <div style={{ color: '#6c757d', fontSize: '14px', lineHeight: '2' }}>
              <div style={{ padding: '15px', borderBottom: '1px solid #dee2e6' }}>
                <span style={{ color: '#28a745', fontWeight: '600' }}>✓</span> Revenue increased by 8% this month
              </div>
              <div style={{ padding: '15px', borderBottom: '1px solid #dee2e6' }}>
                <span style={{ color: '#ffc107', fontWeight: '600' }}>⚠</span> Fuel costs up by 3% compared to last month
              </div>
              <div style={{ padding: '15px', borderBottom: '1px solid #dee2e6' }}>
                <span style={{ color: '#28a745', fontWeight: '600' }}>✓</span> Maintenance costs reduced by 5%
              </div>
              <div style={{ padding: '15px' }}>
                <span style={{ color: '#007bff', fontWeight: '600' }}>ℹ</span> 5 vehicles showing high ROI performance
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FinanceReport;
