-- Fleet Management System - Seed Data
-- This file contains test data for development and demo purposes

-- Clear existing data (in reverse order of dependencies)
TRUNCATE TABLE expenses CASCADE;
TRUNCATE TABLE maintenance CASCADE;
TRUNCATE TABLE trips CASCADE;
TRUNCATE TABLE drivers CASCADE;
TRUNCATE TABLE vehicles CASCADE;
TRUNCATE TABLE users CASCADE;

-- Reset sequences
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE vehicles_id_seq RESTART WITH 1;
ALTER SEQUENCE drivers_id_seq RESTART WITH 1;
ALTER SEQUENCE trips_id_seq RESTART WITH 1;
ALTER SEQUENCE maintenance_id_seq RESTART WITH 1;
ALTER SEQUENCE expenses_id_seq RESTART WITH 1;

-- Insert test users (password for all: password123)
-- Password hash generated with bcrypt for 'password123'
INSERT INTO users (username, password_hash, email, role) VALUES
('admin', '$2b$10$3KLyg1JWs4pMlTB9SZxsYOQ7bHXLh0YIs5knpfLOxYWd6OfDimNSO', 'admin@fleet.com', 'Fleet Manager'),
('dispatcher1', '$2b$10$3KLyg1JWs4pMlTB9SZxsYOQ7bHXLh0YIs5knpfLOxYWd6OfDimNSO', 'dispatcher@fleet.com', 'Dispatcher'),
('safety1', '$2b$10$3KLyg1JWs4pMlTB9SZxsYOQ7bHXLh0YIs5knpfLOxYWd6OfDimNSO', 'safety@fleet.com', 'Safety Officer'),
('finance1', '$2b$10$3KLyg1JWs4pMlTB9SZxsYOQ7bHXLh0YIs5knpfLOxYWd6OfDimNSO', 'finance@fleet.com', 'Financial Analyst');

-- Insert test vehicles
INSERT INTO vehicles (license_plate, max_capacity_kg, odometer_km, status) VALUES
('ABC-1234', 5000, 45000, 'Available'),
('XYZ-5678', 7500, 62000, 'Available'),
('DEF-9012', 3000, 28000, 'Available'),
('GHI-3456', 10000, 95000, 'Available'),
('JKL-7890', 5000, 38000, 'On Trip'),
('MNO-2345', 6000, 71000, 'In Shop'),
('PQR-6789', 4000, 52000, 'Available'),
('STU-0123', 8000, 88000, 'Available'),
('VWX-4567', 5500, 41000, 'Available'),
('YZA-8901', 7000, 105000, 'Available');

-- Insert test drivers
INSERT INTO drivers (name, license_number, license_expiry, safety_score) VALUES
('John Smith', 'DL123456', CURRENT_DATE + INTERVAL '365 days', 95),
('Maria Garcia', 'DL234567', CURRENT_DATE + INTERVAL '200 days', 98),
('David Chen', 'DL345678', CURRENT_DATE + INTERVAL '150 days', 92),
('Sarah Johnson', 'DL456789', CURRENT_DATE + INTERVAL '400 days', 97),
('Michael Brown', 'DL567890', CURRENT_DATE + INTERVAL '300 days', 89),
('Emily Davis', 'DL678901', CURRENT_DATE + INTERVAL '25 days', 94),
('James Wilson', 'DL789012', CURRENT_DATE + INTERVAL '350 days', 96),
('Lisa Anderson', 'DL890123', CURRENT_DATE + INTERVAL '250 days', 91),
('Robert Taylor', 'DL901234', CURRENT_DATE + INTERVAL '180 days', 93),
('Jennifer Martinez', 'DL012345', CURRENT_DATE + INTERVAL '450 days', 99);

-- Insert test trips (some completed, some in progress)
INSERT INTO trips (driver_id, vehicle_id, origin, destination, cargo_weight_kg, start_time, end_time, status, created_by) VALUES
(1, 1, 'Warehouse A', 'Customer Site 1', 3500, '2024-01-15 08:00:00', '2024-01-15 14:30:00', 'Completed', 2),
(2, 2, 'Warehouse B', 'Customer Site 2', 6000, '2024-01-16 09:00:00', '2024-01-16 16:00:00', 'Completed', 2),
(3, 3, 'Warehouse A', 'Customer Site 3', 2500, '2024-01-17 07:30:00', '2024-01-17 13:00:00', 'Completed', 2),
(4, 4, 'Warehouse C', 'Customer Site 4', 8500, '2024-01-18 10:00:00', '2024-01-18 17:30:00', 'Completed', 2),
(5, 5, 'Warehouse A', 'Customer Site 5', 4200, '2024-01-20 08:00:00', NULL, 'In Progress', 2),
(1, 7, 'Warehouse B', 'Customer Site 6', 3200, '2024-01-19 11:00:00', '2024-01-19 15:30:00', 'Completed', 2),
(2, 8, 'Warehouse C', 'Customer Site 7', 7000, '2024-01-19 09:30:00', '2024-01-19 18:00:00', 'Completed', 2),
(6, 9, 'Warehouse A', 'Customer Site 8', 4800, '2024-01-18 08:00:00', '2024-01-18 14:00:00', 'Completed', 2);

-- Insert test maintenance records
INSERT INTO maintenance (vehicle_id, service_type, cost, service_date, description, status) VALUES
(1, 'Oil Change', 150.00, '2024-01-10', 'Regular maintenance - 45,000 km service', 'Completed'),
(2, 'Tire Replacement', 800.00, '2024-01-12', 'All four tires replaced', 'Completed'),
(3, 'Brake Service', 450.00, '2024-01-14', 'Brake pads and rotors replaced', 'Completed'),
(6, 'Engine Repair', 2500.00, '2024-01-20', 'Engine overheating issue - radiator replacement', 'In Progress'),
(4, 'Oil Change', 150.00, '2024-01-25', 'Scheduled maintenance', 'Scheduled'),
(7, 'Transmission Service', 600.00, '2024-01-08', 'Transmission fluid change', 'Completed');

-- Insert test expense records
INSERT INTO expenses (vehicle_id, expense_type, amount, fuel_liters, expense_date, description) VALUES
(1, 'Fuel', 85.50, 50.0, '2024-01-15', 'Fuel for trip to Customer Site 1'),
(1, 'Toll', 12.00, NULL, '2024-01-15', 'Highway toll'),
(2, 'Fuel', 120.00, 70.0, '2024-01-16', 'Fuel for trip to Customer Site 2'),
(2, 'Toll', 15.00, NULL, '2024-01-16', 'Highway toll'),
(3, 'Fuel', 65.00, 38.0, '2024-01-17', 'Fuel for trip to Customer Site 3'),
(4, 'Fuel', 140.00, 82.0, '2024-01-18', 'Fuel for trip to Customer Site 4'),
(5, 'Fuel', 95.00, 55.0, '2024-01-20', 'Fuel for ongoing trip'),
(1, 'Repair', 250.00, NULL, '2024-01-11', 'Minor body work repair'),
(2, 'Insurance', 450.00, NULL, '2024-01-01', 'Monthly insurance premium'),
(3, 'Insurance', 450.00, NULL, '2024-01-01', 'Monthly insurance premium'),
(4, 'Insurance', 550.00, NULL, '2024-01-01', 'Monthly insurance premium'),
(5, 'Insurance', 450.00, NULL, '2024-01-01', 'Monthly insurance premium'),
(7, 'Fuel', 78.00, 45.0, '2024-01-19', 'Fuel for trip to Customer Site 6'),
(8, 'Fuel', 125.00, 73.0, '2024-01-19', 'Fuel for trip to Customer Site 7'),
(9, 'Fuel', 92.00, 54.0, '2024-01-18', 'Fuel for trip to Customer Site 8');

-- Display summary
SELECT 'Seed data inserted successfully!' as message;
SELECT 'Users: ' || COUNT(*) as summary FROM users
UNION ALL
SELECT 'Vehicles: ' || COUNT(*) FROM vehicles
UNION ALL
SELECT 'Drivers: ' || COUNT(*) FROM drivers
UNION ALL
SELECT 'Trips: ' || COUNT(*) FROM trips
UNION ALL
SELECT 'Maintenance: ' || COUNT(*) FROM maintenance
UNION ALL
SELECT 'Expenses: ' || COUNT(*) FROM expenses;

-- Display test credentials
SELECT '=== TEST CREDENTIALS ===' as info;
SELECT 'Username: admin, Password: password123, Role: Fleet Manager' as credentials
UNION ALL
SELECT 'Username: dispatcher1, Password: password123, Role: Dispatcher'
UNION ALL
SELECT 'Username: safety1, Password: password123, Role: Safety Officer'
UNION ALL
SELECT 'Username: finance1, Password: password123, Role: Financial Analyst';
