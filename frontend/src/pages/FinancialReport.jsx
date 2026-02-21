import React, { useState, useEffect } from "react";
import SidebarFinanceAnalyst from "../components/layout/SidebarFinanceAnalyst";
import api from "../services/api";
import "../styles/dashboard.css";

function FinancialReport() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalExpenses: 0,
    fuelExpenses: 0,
    maintenanceExpenses: 0,
    otherExpenses: 0
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await api.getExpenses({ page: 1, limit: 100 });
      if (response.success) {
        const expensesList = response.data.expenses || [];
        setExpenses(expensesList);

        // Calculate summary
        const total = expensesList.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
        const fuel = expensesList
          .filter(e => e.expense_type === 'Fuel')
          .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
        const maintenance = expensesList
          .filter(e => e.expense_type === 'Maintenance')
          .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
        const other = total - fuel - maintenance;

        setSummary({
          totalExpenses: total,
          fuelExpenses: fuel,
          maintenanceExpenses: maintenance,
          otherExpenses: other
        });
      }
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-layout">
      <SidebarFinanceAnalyst />
      <div className="content-area" style={{ backgroundColor: '#ffffff' }}>
        <div className="page-content" style={{ backgroundColor: '#ffffff', padding: '30px' }}>
          <h1 style={{ color: '#333', marginBottom: '20px' }}>Financial Report</h1>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
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
              <h3 style={{ color: '#007bff', fontSize: '16px', marginBottom: '10px' }}>
                Total Expenses
              </h3>
              <p style={{ color: '#007bff', fontSize: '32px', fontWeight: 'bold', margin: 0 }}>
                {loading ? '...' : `Rs. ${summary.totalExpenses.toFixed(2)}`}
              </p>
            </div>

            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '30px',
              borderRadius: '12px',
              border: '1px solid #dee2e6',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#dc3545', fontSize: '16px', marginBottom: '10px' }}>
                Fuel Expenses
              </h3>
              <p style={{ color: '#dc3545', fontSize: '32px', fontWeight: 'bold', margin: 0 }}>
                {loading ? '...' : `Rs. ${summary.fuelExpenses.toFixed(2)}`}
              </p>
            </div>

            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '30px',
              borderRadius: '12px',
              border: '1px solid #dee2e6',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#ffc107', fontSize: '16px', marginBottom: '10px' }}>
                Maintenance
              </h3>
              <p style={{ color: '#ffc107', fontSize: '32px', fontWeight: 'bold', margin: 0 }}>
                {loading ? '...' : `Rs. ${summary.maintenanceExpenses.toFixed(2)}`}
              </p>
            </div>

            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '30px',
              borderRadius: '12px',
              border: '1px solid #dee2e6',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#6c757d', fontSize: '16px', marginBottom: '10px' }}>
                Other Expenses
              </h3>
              <p style={{ color: '#6c757d', fontSize: '32px', fontWeight: 'bold', margin: 0 }}>
                {loading ? '...' : `Rs. ${summary.otherExpenses.toFixed(2)}`}
              </p>
            </div>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #dee2e6',
            overflow: 'hidden'
          }}>
            <h2 style={{ padding: '20px', margin: 0, borderBottom: '1px solid #dee2e6' }}>
              Expense Details
            </h2>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                    Date
                  </th>
                  <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                    Vehicle
                  </th>
                  <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                    Type
                  </th>
                  <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                    Description
                  </th>
                  <th style={{ padding: '15px', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>
                      Loading expenses...
                    </td>
                  </tr>
                ) : expenses.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>
                      No expenses found
                    </td>
                  </tr>
                ) : (
                  expenses.map((expense) => (
                    <tr key={expense.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                      <td style={{ padding: '15px' }}>
                        {new Date(expense.expense_date).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '15px' }}>
                        {expense.vehicle_license_plate || `Vehicle #${expense.vehicle_id}`}
                      </td>
                      <td style={{ padding: '15px' }}>{expense.expense_type}</td>
                      <td style={{ padding: '15px' }}>{expense.description || 'N/A'}</td>
                      <td style={{ padding: '15px', textAlign: 'right', fontWeight: '600' }}>
                        Rs. {parseFloat(expense.amount).toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FinancialReport;
