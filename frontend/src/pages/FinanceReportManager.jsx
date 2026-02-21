import React from "react";
import SidebarFleetManager from "../components/layout/SidebarFleetManager";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../styles/dashboard.css";

function FinanceReportManager() {
  // Sample financial data by vehicle
  const vehicleFinancialData = [
    { vehicle: "MH 00", revenue: 17, fuelCost: 6, maintenance: 2, netProfit: 9, acquisitionCost: 50, roi: 18 },
    { vehicle: "DL 01", revenue: 25, fuelCost: 9, maintenance: 3, netProfit: 13, acquisitionCost: 80, roi: 16.25 },
    { vehicle: "KA 02", revenue: 12, fuelCost: 4, maintenance: 5, netProfit: 3, acquisitionCost: 45, roi: 6.67 },
    { vehicle: "TN 03", revenue: 30, fuelCost: 11, maintenance: 4, netProfit: 15, acquisitionCost: 85, roi: 17.65 },
    { vehicle: "UP 04", revenue: 15, fuelCost: 5, maintenance: 2.5, netProfit: 7.5, acquisitionCost: 48, roi: 15.63 },
  ];

  const topCostlyVehicles = [
    { id: "VAN-03", cost: 15 },
    { id: "TRK-01", cost: 25 },
    { id: "TRK-05", cost: 45 },
    { id: "TRK-08", cost: 75 },
    { id: "TRK-02", cost: 100 },
  ];

  // Fuel efficiency trend data
  const fuelEfficiencyData = [
    { month: "Jan", efficiency: 8.5 },
    { month: "Feb", efficiency: 9.2 },
    { month: "Mar", efficiency: 9.8 },
    { month: "Apr", efficiency: 8.9 },
    { month: "May", efficiency: 10.5 },
    { month: "Jun", efficiency: 11.2 },
  ];

  const exportToPDF = () => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    // Title
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text("Financial Report - FleetFlow", 105, 20, { align: "center" });

    // Subtitle
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text("Monthly Financial Analysis", 105, 28, { align: "center" });

    // Line separator
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 32, 190, 32);

    // Month-wise Financial Summary Table
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text("Financial Summary by Vehicle", 20, 42);

    doc.autoTable({
      startY: 48,
      head: [['Vehicle', 'Revenue', 'Fuel Cost', 'Maintenance', 'Net Profit']],
      body: vehicleFinancialData.map(item => [
        item.vehicle,
        `Rs. ${item.revenue}L`,
        `Rs. ${item.fuelCost}L`,
        `Rs. ${item.maintenance}L`,
        `Rs. ${item.netProfit}L`
      ]),
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 10, cellPadding: 5 },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    // Fuel Efficiency Trend
    const yPos1 = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text("Fuel Efficiency Trend (km/L)", 20, yPos1);

    doc.autoTable({
      startY: yPos1 + 5,
      head: [['Month', 'Efficiency (km/L)']],
      body: fuelEfficiencyData.map(item => [
        item.month,
        item.efficiency.toFixed(1)
      ]),
      theme: 'grid',
      headStyles: { fillColor: [52, 152, 219], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 10, cellPadding: 5 },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    // Top 5 Costliest Vehicles
    const yPos2 = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text("Top 5 Costliest Vehicles", 20, yPos2);

    doc.autoTable({
      startY: yPos2 + 5,
      head: [['Vehicle ID', 'Total Cost (Rs. in Lakhs)']],
      body: topCostlyVehicles.map(item => [
        item.id,
        `Rs. ${item.cost}L`
      ]),
      theme: 'grid',
      headStyles: { fillColor: [231, 76, 60], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 10, cellPadding: 5 },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(`Generated on ${currentDate}`, 105, pageHeight - 15, { align: "center" });
    doc.text("FleetFlow - Fleet Management System", 105, pageHeight - 10, { align: "center" });

    // Save the PDF
    doc.save(`FleetFlow_Financial_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="app-layout">
      <SidebarFleetManager />
      <div className="content-area" style={{ backgroundColor: '#ffffff' }}>
        <div className="page-content" style={{ backgroundColor: '#ffffff', padding: '30px' }}>
          
          <h1 style={{ color: '#333', marginBottom: '20px' }}>Financial Report</h1>

          {/* Key Metrics Formulas */}
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #dee2e6',
            marginBottom: '30px'
          }}>
            <h2 style={{ color: '#333', fontSize: '18px', marginBottom: '15px', fontWeight: '600' }}>
              Key Metrics:
            </h2>
            <div style={{ color: '#495057', fontSize: '14px', lineHeight: '1.8' }}>
              <div style={{ marginBottom: '10px' }}>
                <strong>• Fuel Efficiency:</strong> km / L
              </div>
              <div>
                <strong>• Vehicle ROI:</strong> {'{'}Revenue - (Maintenance + Fuel){'}'} / {'{'}Acquisition Cost{'}'}
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '30px',
              borderRadius: '12px',
              border: '1px solid #dee2e6',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#28a745', fontSize: '16px', marginBottom: '10px', fontWeight: '600' }}>
                Total Fuel Cost
              </h3>
              <p style={{ color: '#28a745', fontSize: '42px', fontWeight: 'bold', margin: 0 }}>
                Rs. 2.6L
              </p>
            </div>
            
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '30px',
              borderRadius: '12px',
              border: '1px solid #dee2e6',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#007bff', fontSize: '16px', marginBottom: '10px', fontWeight: '600' }}>
                Fleet ROI
              </h3>
              <p style={{ color: '#007bff', fontSize: '42px', fontWeight: 'bold', margin: 0 }}>
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
              <h3 style={{ color: '#6f42c1', fontSize: '16px', marginBottom: '10px', fontWeight: '600' }}>
                Utilization Rate
              </h3>
              <p style={{ color: '#6f42c1', fontSize: '42px', fontWeight: 'bold', margin: 0 }}>
                92%
              </p>
            </div>
          </div>

          {/* Charts Section */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px',
            marginBottom: '30px'
          }}>
            {/* Fuel Efficiency Trend Chart */}
            <div style={{
              backgroundColor: '#f5f5f5',
              padding: '20px',
              borderRadius: '12px'
            }}>
              <h3 style={{ color: '#333', fontSize: '18px', marginBottom: '20px' }}>
                Fuel Efficiency Trend (kmL)
              </h3>
              <div style={{ position: 'relative', height: '250px' }}>
                <svg width="100%" height="100%" viewBox="0 0 400 250">
                  {/* Grid lines */}
                  <line x1="50" y1="200" x2="350" y2="200" stroke="#ddd" strokeWidth="1"/>
                  <line x1="50" y1="150" x2="350" y2="150" stroke="#ddd" strokeWidth="1"/>
                  <line x1="50" y1="100" x2="350" y2="100" stroke="#ddd" strokeWidth="1"/>
                  <line x1="50" y1="50" x2="350" y2="50" stroke="#ddd" strokeWidth="1"/>
                  
                  {/* Line 1 */}
                  <polyline
                    points="70,180 120,140 170,120 220,160 270,100 320,80"
                    fill="none"
                    stroke="#666"
                    strokeWidth="2"
                  />
                  {/* Points */}
                  <circle cx="70" cy="180" r="4" fill="#666"/>
                  <circle cx="120" cy="140" r="4" fill="#666"/>
                  <circle cx="170" cy="120" r="4" fill="#666"/>
                  <circle cx="220" cy="160" r="4" fill="#666"/>
                  <circle cx="270" cy="100" r="4" fill="#666"/>
                  <circle cx="320" cy="80" r="4" fill="#666"/>
                  
                  {/* X-axis labels */}
                  <text x="70" y="230" textAnchor="middle" fontSize="12" fill="#666">Jan - Dec</text>
                  <text x="220" y="230" textAnchor="middle" fontSize="12" fill="#666">Jan - Dec</text>
                  <text x="320" y="230" textAnchor="middle" fontSize="12" fill="#666">Dec</text>
                </svg>
              </div>
            </div>

            {/* Top 5 Costliest Vehicles Chart */}
            <div style={{
              backgroundColor: '#f5f5f5',
              padding: '20px',
              borderRadius: '12px'
            }}>
              <h3 style={{ color: '#333', fontSize: '18px', marginBottom: '20px' }}>
                Top 5 Costliest Vehicles
              </h3>
              <div style={{ position: 'relative', height: '250px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', paddingTop: '30px' }}>
                {topCostlyVehicles.map((vehicle, index) => (
                  <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                    <div style={{
                      width: '60px',
                      height: `${vehicle.cost * 2}px`,
                      background: 'repeating-linear-gradient(45deg, #666, #666 10px, #888 10px, #888 20px)',
                      borderRadius: '4px 4px 0 0',
                      marginBottom: '10px'
                    }}></div>
                    <span style={{ fontSize: '12px', color: '#666', fontWeight: '600' }}>{vehicle.id}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Financial Summary Table */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #dee2e6',
            padding: '20px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{
                color: '#333',
                fontSize: '20px',
                margin: 0,
                fontWeight: '600'
              }}>
                Financial Summary by Vehicle
              </h2>
              
              {/* Export Button */}
              <button
                onClick={exportToPDF}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'background-color 0.3s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
              >
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Export Report
              </button>
            </div>
            
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{
                    padding: '15px',
                    textAlign: 'left',
                    color: '#495057',
                    fontSize: '16px',
                    fontWeight: '600',
                    borderBottom: '2px solid #dee2e6'
                  }}>Vehicle</th>
                  <th style={{
                    padding: '15px',
                    textAlign: 'left',
                    color: '#495057',
                    fontSize: '16px',
                    fontWeight: '600',
                    borderBottom: '2px solid #dee2e6'
                  }}>Revenue</th>
                  <th style={{
                    padding: '15px',
                    textAlign: 'left',
                    color: '#495057',
                    fontSize: '16px',
                    fontWeight: '600',
                    borderBottom: '2px solid #dee2e6'
                  }}>Fuel Cost</th>
                  <th style={{
                    padding: '15px',
                    textAlign: 'left',
                    color: '#495057',
                    fontSize: '16px',
                    fontWeight: '600',
                    borderBottom: '2px solid #dee2e6'
                  }}>Maintenance</th>
                  <th style={{
                    padding: '15px',
                    textAlign: 'left',
                    color: '#495057',
                    fontSize: '16px',
                    fontWeight: '600',
                    borderBottom: '2px solid #dee2e6'
                  }}>Net Profit</th>
                  <th style={{
                    padding: '15px',
                    textAlign: 'left',
                    color: '#495057',
                    fontSize: '16px',
                    fontWeight: '600',
                    borderBottom: '2px solid #dee2e6'
                  }}>ROI %</th>
                </tr>
              </thead>
              <tbody>
                {vehicleFinancialData.map((data, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '15px', color: '#212529', fontSize: '14px', fontWeight: '600' }}>{data.vehicle}</td>
                    <td style={{ padding: '15px', color: '#212529', fontSize: '14px' }}>Rs. {data.revenue}L</td>
                    <td style={{ padding: '15px', color: '#dc3545', fontSize: '14px' }}>Rs. {data.fuelCost}L</td>
                    <td style={{ padding: '15px', color: '#dc3545', fontSize: '14px' }}>Rs. {data.maintenance}L</td>
                    <td style={{ padding: '15px', color: '#28a745', fontSize: '14px', fontWeight: '600' }}>Rs. {data.netProfit}L</td>
                    <td style={{ padding: '15px', color: '#007bff', fontSize: '14px', fontWeight: '600' }}>{data.roi}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FinanceReportManager;
