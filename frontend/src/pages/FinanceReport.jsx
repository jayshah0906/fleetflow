import React from "react";
import { Navigate } from "react-router-dom";

// Redirect to FinancialReport (this appears to be a duplicate)
function FinanceReport() {
  return <Navigate to="/financial-report" replace />;
}

export default FinanceReport;
