// Analytics service - core business logic for reports and KPIs
const pool = require('../config/database');

class AnalyticsService {
  // Get dashboard KPIs
  async getDashboardKPIs() {
    // Get vehicle status counts
    const vehicleStatusQuery = `
      SELECT status, COUNT(*) as count
      FROM vehicles
      GROUP BY status
    `;
    const vehicleStatusResult = await pool.query(vehicleStatusQuery);
    
    const vehicleStatus = {
      Available: 0,
      'On Trip': 0,
      'In Shop': 0,
      Retired: 0,
    };
    
    vehicleStatusResult.rows.forEach(row => {
      vehicleStatus[row.status] = parseInt(row.count);
    });

    // Get maintenance alerts count (vehicles with scheduled or in-progress maintenance)
    const maintenanceAlertsQuery = `
      SELECT COUNT(DISTINCT vehicle_id) as count
      FROM maintenance
      WHERE status IN ('Scheduled', 'In Progress')
    `;
    const maintenanceAlertsResult = await pool.query(maintenanceAlertsQuery);
    const maintenanceAlerts = parseInt(maintenanceAlertsResult.rows[0].count) || 0;

    // Calculate utilization rate
    const totalAvailableVehicles = vehicleStatus.Available + vehicleStatus['On Trip'];
    const utilizationRate = totalAvailableVehicles > 0 
      ? ((vehicleStatus['On Trip'] / totalAvailableVehicles) * 100).toFixed(1)
      : 0;

    // Get pending trips count
    const pendingTripsQuery = `
      SELECT COUNT(*) as count
      FROM trips
      WHERE status = 'In Progress'
    `;
    const pendingTripsResult = await pool.query(pendingTripsQuery);
    const pendingTrips = parseInt(pendingTripsResult.rows[0].count) || 0;

    // Get active drivers count (drivers with valid licenses)
    const activeDriversQuery = `
      SELECT COUNT(*) as count
      FROM drivers
      WHERE license_expiry > CURRENT_DATE
    `;
    const activeDriversResult = await pool.query(activeDriversQuery);
    const activeDrivers = parseInt(activeDriversResult.rows[0].count) || 0;

    // Get total vehicles count
    const totalVehicles = Object.values(vehicleStatus).reduce((sum, count) => sum + count, 0);

    return {
      vehicle_status: vehicleStatus,
      maintenance_alerts: maintenanceAlerts,
      utilization_rate: parseFloat(utilizationRate),
      pending_trips: pendingTrips,
      active_drivers: activeDrivers,
      total_vehicles: totalVehicles,
      last_updated: new Date().toISOString(),
    };
  }

  // Get dashboard alerts
  async getDashboardAlerts() {
    const alerts = [];

    // Get drivers with licenses expiring within 30 days
    const expiringLicensesQuery = `
      SELECT id, name, license_expiry
      FROM drivers
      WHERE license_expiry > CURRENT_DATE 
        AND license_expiry <= CURRENT_DATE + INTERVAL '30 days'
      ORDER BY license_expiry ASC
    `;
    const expiringLicensesResult = await pool.query(expiringLicensesQuery);
    
    expiringLicensesResult.rows.forEach(driver => {
      const daysUntilExpiry = Math.ceil(
        (new Date(driver.license_expiry) - new Date()) / (1000 * 60 * 60 * 24)
      );
      alerts.push({
        type: 'license_expiry',
        severity: daysUntilExpiry <= 7 ? 'high' : 'warning',
        message: `Driver ${driver.name} license expires in ${daysUntilExpiry} days`,
        driver_id: driver.id,
        expiry_date: driver.license_expiry,
      });
    });

    // Get vehicles with scheduled or in-progress maintenance
    const maintenanceDueQuery = `
      SELECT m.id, m.vehicle_id, v.license_plate, m.service_type, m.service_date, m.status
      FROM maintenance m
      JOIN vehicles v ON m.vehicle_id = v.id
      WHERE m.status IN ('Scheduled', 'In Progress')
      ORDER BY m.service_date ASC
    `;
    const maintenanceDueResult = await pool.query(maintenanceDueQuery);
    
    maintenanceDueResult.rows.forEach(maintenance => {
      const serviceDate = new Date(maintenance.service_date);
      const today = new Date();
      const isPastDue = serviceDate < today;
      
      alerts.push({
        type: 'maintenance_due',
        severity: isPastDue ? 'high' : 'warning',
        message: `Vehicle ${maintenance.license_plate} ${isPastDue ? 'overdue for' : 'requires'} ${maintenance.service_type}`,
        vehicle_id: maintenance.vehicle_id,
        maintenance_id: maintenance.id,
        service_date: maintenance.service_date,
      });
    });

    // Get vehicles with high odometer (example: over 100,000 km)
    const highOdometerQuery = `
      SELECT id, license_plate, odometer_km
      FROM vehicles
      WHERE odometer_km > 100000 AND status != 'Retired'
      ORDER BY odometer_km DESC
    `;
    const highOdometerResult = await pool.query(highOdometerQuery);
    
    highOdometerResult.rows.forEach(vehicle => {
      alerts.push({
        type: 'high_odometer',
        severity: 'info',
        message: `Vehicle ${vehicle.license_plate} has high odometer reading: ${vehicle.odometer_km} km`,
        vehicle_id: vehicle.id,
        odometer_km: vehicle.odometer_km,
      });
    });

    return { alerts };
  }

  // Get financial summary
  async getFinancialSummary({ start_date, end_date, vehicle_id = null }) {
    let expenseQuery = `
      SELECT 
        SUM(amount) as total_expenses,
        SUM(CASE WHEN expense_type = 'Fuel' THEN amount ELSE 0 END) as fuel_expenses,
        SUM(CASE WHEN expense_type = 'Repair' THEN amount ELSE 0 END) as repair_expenses,
        SUM(CASE WHEN expense_type NOT IN ('Fuel', 'Repair') THEN amount ELSE 0 END) as other_expenses,
        SUM(fuel_liters) as total_fuel_liters
      FROM expenses
      WHERE 1=1
    `;
    const params = [];
    
    if (start_date) {
      params.push(start_date);
      expenseQuery += ` AND expense_date >= $${params.length}`;
    }
    if (end_date) {
      params.push(end_date);
      expenseQuery += ` AND expense_date <= $${params.length}`;
    }
    if (vehicle_id) {
      params.push(vehicle_id);
      expenseQuery += ` AND vehicle_id = $${params.length}`;
    }

    const expenseResult = await pool.query(expenseQuery, params);
    const expenses = expenseResult.rows[0];

    // Get maintenance costs
    let maintenanceQuery = `
      SELECT SUM(cost) as maintenance_expenses
      FROM maintenance
      WHERE 1=1
    `;
    const maintenanceParams = [];
    
    if (start_date) {
      maintenanceParams.push(start_date);
      maintenanceQuery += ` AND service_date >= $${maintenanceParams.length}`;
    }
    if (end_date) {
      maintenanceParams.push(end_date);
      maintenanceQuery += ` AND service_date <= $${maintenanceParams.length}`;
    }
    if (vehicle_id) {
      maintenanceParams.push(vehicle_id);
      maintenanceQuery += ` AND vehicle_id = $${maintenanceParams.length}`;
    }

    const maintenanceResult = await pool.query(maintenanceQuery, maintenanceParams);
    const maintenanceExpenses = parseFloat(maintenanceResult.rows[0].maintenance_expenses) || 0;

    return {
      total_expenses: parseFloat(expenses.total_expenses) || 0,
      fuel_expenses: parseFloat(expenses.fuel_expenses) || 0,
      repair_expenses: parseFloat(expenses.repair_expenses) || 0,
      maintenance_expenses: maintenanceExpenses,
      other_expenses: parseFloat(expenses.other_expenses) || 0,
      total_fuel_liters: parseFloat(expenses.total_fuel_liters) || 0,
    };
  }

  // Get expenses by vehicle for reporting
  async getExpensesByVehicle({ start_date, end_date }) {
    let query = `
      SELECT 
        v.id as vehicle_id,
        v.license_plate,
        SUM(e.amount) as total_expenses,
        COUNT(DISTINCT t.id) as trips_completed,
        v.odometer_km
      FROM vehicles v
      LEFT JOIN expenses e ON v.id = e.vehicle_id
      LEFT JOIN trips t ON v.id = t.vehicle_id AND t.status = 'Completed'
      WHERE 1=1
    `;
    const params = [];
    
    if (start_date) {
      params.push(start_date);
      query += ` AND (e.expense_date IS NULL OR e.expense_date >= $${params.length})`;
    }
    if (end_date) {
      params.push(end_date);
      query += ` AND (e.expense_date IS NULL OR e.expense_date <= $${params.length})`;
    }

    query += `
      GROUP BY v.id, v.license_plate, v.odometer_km
      ORDER BY total_expenses DESC
    `;

    const result = await pool.query(query, params);
    return result.rows.map(row => ({
      vehicle_id: row.vehicle_id,
      license_plate: row.license_plate,
      total_expenses: parseFloat(row.total_expenses) || 0,
      trips_completed: parseInt(row.trips_completed) || 0,
      odometer_km: parseInt(row.odometer_km) || 0,
    }));
  }
}

module.exports = new AnalyticsService();
