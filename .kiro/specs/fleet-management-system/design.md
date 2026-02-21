# Design Document: Fleet Management System

## Overview

The Fleet Management System is a web-based application designed for an 8-hour hackathon that replaces manual logbooks with a centralized digital platform. The system provides real-time fleet monitoring, driver safety tracking, maintenance scheduling, and financial analytics with role-based access control.

### System Goals

- Centralized vehicle and driver management with CRUD operations
- Real-time operational visibility through WebSocket updates
- Automated trip validation (cargo capacity, driver license, vehicle availability)
- Maintenance tracking with automatic vehicle status transitions
- Financial analytics with expense tracking and ROI calculations
- Role-based access control for four user types (Fleet Manager, Dispatcher, Safety Officer, Financial Analyst)

### Technology Stack

**Backend:**
- Runtime: Node.js (v18+)
- Framework: Express.js
- Database: PostgreSQL (v14+)
- Database Client: pg (node-postgres)
- Authentication: jsonwebtoken, bcrypt
- Real-time: ws (WebSocket library) or socket.io
- Validation: express-validator
- Environment: dotenv

**Frontend:**
- Framework: React (v18+)
- Routing: React Router v6
- HTTP Client: Axios
- WebSocket Client: native WebSocket API or socket.io-client
- State Management: React Context API or lightweight state library
- UI: CSS modules or styled-components

**Development:**
- Version Control: Git
- Package Manager: npm
- Environment Variables: .env files (excluded from Git)


## Architecture

### High-Level Architecture

The system follows a three-tier architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer (React)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Dashboard   │  │   Vehicle    │  │    Trip      │      │
│  │    Page      │  │  Management  │  │  Management  │ ...  │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
│                   ┌────────▼────────┐                        │
│                   │  API Service    │                        │
│                   │  (Axios)        │                        │
│                   └────────┬────────┘                        │
│                            │                                 │
│                   ┌────────▼────────┐                        │
│                   │  WebSocket      │                        │
│                   │  Client         │                        │
│                   └─────────────────┘                        │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTP/WS
┌─────────────────────────▼───────────────────────────────────┐
│              Application Layer (Express.js)                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                  Middleware Stack                     │   │
│  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐    │   │
│  │  │  CORS  │→ │  Auth  │→ │  RBAC  │→ │  Rate  │    │   │
│  │  │        │  │  JWT   │  │  Check │  │  Limit │    │   │
│  │  └────────┘  └────────┘  └────────┘  └────────┘    │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                    Route Layer                        │   │
│  │  /auth  /vehicles  /drivers  /trips  /maintenance    │   │
│  │  /expenses  /dashboard  /reports                     │   │
│  └────────────────────┬─────────────────────────────────┘   │
│  ┌────────────────────▼─────────────────────────────────┐   │
│  │                 Controller Layer                      │   │
│  │  Business logic, request validation, response format  │   │
│  └────────────────────┬─────────────────────────────────┘   │
│  ┌────────────────────▼─────────────────────────────────┐   │
│  │                  Service Layer                        │   │
│  │  Core business logic, transaction management         │   │
│  └────────────────────┬─────────────────────────────────┘   │
│  ┌────────────────────▼─────────────────────────────────┐   │
│  │                   Model Layer                         │   │
│  │  Database queries, data access patterns              │   │
│  └────────────────────┬─────────────────────────────────┘   │
│  ┌────────────────────▼─────────────────────────────────┐   │
│  │              WebSocket Server (ws)                    │   │
│  │  Real-time event broadcasting to connected clients   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────┬───────────────────────────────────┘
                          │ SQL
┌─────────────────────────▼───────────────────────────────────┐
│                Data Layer (PostgreSQL)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  users   │  │ vehicles │  │  drivers │  │   trips  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────┐  ┌──────────┐                                │
│  │maintenance│ │ expenses │                                │
│  └──────────┘  └──────────┘                                │
└─────────────────────────────────────────────────────────────┘
```

### Module Organization

**Backend Structure:**
```
backend/
├── src/
│   ├── config/
│   │   ├── database.js       # PostgreSQL connection pool
│   │   └── env.js            # Environment variable validation
│   ├── middleware/
│   │   ├── auth.js           # JWT verification
│   │   ├── rbac.js           # Role-based access control
│   │   ├── validation.js     # Input validation
│   │   ├── errorHandler.js   # Global error handling
│   │   └── rateLimiter.js    # Rate limiting
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── vehicle.routes.js
│   │   ├── driver.routes.js
│   │   ├── trip.routes.js
│   │   ├── maintenance.routes.js
│   │   ├── expense.routes.js
│   │   ├── dashboard.routes.js
│   │   └── report.routes.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── vehicle.controller.js
│   │   ├── driver.controller.js
│   │   ├── trip.controller.js
│   │   ├── maintenance.controller.js
│   │   ├── expense.controller.js
│   │   ├── dashboard.controller.js
│   │   └── report.controller.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── vehicle.service.js
│   │   ├── driver.service.js
│   │   ├── trip.service.js
│   │   ├── maintenance.service.js
│   │   ├── expense.service.js
│   │   └── analytics.service.js
│   ├── models/
│   │   ├── user.model.js
│   │   ├── vehicle.model.js
│   │   ├── driver.model.js
│   │   ├── trip.model.js
│   │   ├── maintenance.model.js
│   │   └── expense.model.js
│   ├── utils/
│   │   ├── logger.js         # Structured logging
│   │   ├── validators.js     # Regex patterns
│   │   └── websocket.js      # WebSocket manager
│   ├── db/
│   │   └── schema.sql        # Database schema
│   └── server.js             # Application entry point
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

**Frontend Structure:**
```
frontend/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Table.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Layout.jsx
│   │   ├── dashboard/
│   │   │   ├── KPICard.jsx
│   │   │   └── StatusChart.jsx
│   │   ├── vehicles/
│   │   │   ├── VehicleList.jsx
│   │   │   ├── VehicleForm.jsx
│   │   │   └── VehicleDetail.jsx
│   │   ├── trips/
│   │   │   ├── TripList.jsx
│   │   │   ├── TripForm.jsx
│   │   │   └── TripDetail.jsx
│   │   └── drivers/
│   │       ├── DriverList.jsx
│   │       ├── DriverForm.jsx
│   │       └── DriverDetail.jsx
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── VehiclesPage.jsx
│   │   ├── DriversPage.jsx
│   │   ├── TripsPage.jsx
│   │   ├── MaintenancePage.jsx
│   │   ├── ExpensesPage.jsx
│   │   └── ReportsPage.jsx
│   ├── services/
│   │   ├── api.js            # Axios instance
│   │   ├── auth.service.js
│   │   ├── vehicle.service.js
│   │   ├── driver.service.js
│   │   ├── trip.service.js
│   │   └── websocket.service.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useWebSocket.js
│   │   └── useForm.js
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── utils/
│   │   ├── validators.js
│   │   └── formatters.js
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── package.json
└── README.md
```


## Components and Interfaces

### Database Schema (PostgreSQL)

This is the MOST CRITICAL component for hackathon judging. The schema demonstrates proper relational design with all constraints and relationships.

#### Entity-Relationship Diagram

```
┌─────────────────┐
│     users       │
├─────────────────┤
│ id (PK)         │
│ username        │◄──────────┐
│ password_hash   │           │
│ email           │           │
│ role            │           │
│ created_at      │           │
└─────────────────┘           │
                              │
┌─────────────────┐           │
│    vehicles     │           │
├─────────────────┤           │
│ id (PK)         │◄──────┐   │
│ license_plate   │       │   │
│ max_capacity_kg │       │   │
│ odometer_km     │       │   │
│ status          │       │   │
│ created_at      │       │   │
│ updated_at      │       │   │
└─────────────────┘       │   │
        ▲                 │   │
        │                 │   │
        │                 │   │
┌───────┴─────────┐       │   │
│    drivers      │       │   │
├─────────────────┤       │   │
│ id (PK)         │◄──┐   │   │
│ name            │   │   │   │
│ license_number  │   │   │   │
│ license_expiry  │   │   │   │
│ safety_score    │   │   │   │
│ created_at      │   │   │   │
│ updated_at      │   │   │   │
└─────────────────┘   │   │   │
                      │   │   │
┌─────────────────┐   │   │   │
│      trips      │   │   │   │
├─────────────────┤   │   │   │
│ id (PK)         │   │   │   │
│ driver_id (FK)  │───┘   │   │
│ vehicle_id (FK) │───────┘   │
│ origin          │           │
│ destination     │           │
│ cargo_weight_kg │           │
│ start_time      │           │
│ end_time        │           │
│ status          │           │
│ created_by (FK) │───────────┘
│ created_at      │
└─────────────────┘
        │
        │
┌───────┴─────────┐
│  maintenance    │
├─────────────────┤
│ id (PK)         │
│ vehicle_id (FK) │───────┐
│ service_type    │       │
│ cost            │       │
│ service_date    │       │
│ description     │       │
│ status          │       │
│ created_at      │       │
└─────────────────┘       │
                          │
┌─────────────────┐       │
│    expenses     │       │
├─────────────────┤       │
│ id (PK)         │       │
│ vehicle_id (FK) │───────┘
│ expense_type    │
│ amount          │
│ fuel_liters     │
│ expense_date    │
│ description     │
│ created_at      │
└─────────────────┘
```

#### SQL Schema Definition

```sql
-- Users table for authentication and RBAC
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vehicles table
CREATE TABLE vehicles (
    id SERIAL PRIMARY KEY,
    license_plate VARCHAR(20) NOT NULL UNIQUE,
    max_capacity_kg INTEGER NOT NULL CHECK (max_capacity_kg > 0),
    odometer_km INTEGER NOT NULL DEFAULT 0 CHECK (odometer_km >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'On Trip', 'In Shop', 'Retired')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Drivers table
CREATE TABLE drivers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    license_number VARCHAR(50) NOT NULL UNIQUE,
    license_expiry DATE NOT NULL CHECK (license_expiry > CURRENT_DATE),
    safety_score INTEGER NOT NULL DEFAULT 100 CHECK (safety_score >= 0 AND safety_score <= 100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trips table
CREATE TABLE trips (
    id SERIAL PRIMARY KEY,
    driver_id INTEGER NOT NULL REFERENCES drivers(id) ON DELETE RESTRICT,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
    origin VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    cargo_weight_kg INTEGER NOT NULL CHECK (cargo_weight_kg > 0),
    start_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'In Progress' CHECK (status IN ('In Progress', 'Completed', 'Cancelled')),
    created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_end_time CHECK (end_time IS NULL OR end_time > start_time)
);

-- Maintenance logs table
CREATE TABLE maintenance (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    service_type VARCHAR(50) NOT NULL,
    cost DECIMAL(10, 2) NOT NULL CHECK (cost >= 0),
    service_date DATE NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'In Progress', 'Completed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Expenses table
CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    expense_type VARCHAR(50) NOT NULL CHECK (expense_type IN ('Fuel', 'Repair', 'Toll', 'Insurance', 'Other')),
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    fuel_liters DECIMAL(10, 2) CHECK (fuel_liters IS NULL OR fuel_liters > 0),
    expense_date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance (CRITICAL for hackathon judging)
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_license_plate ON vehicles(license_plate);

CREATE INDEX idx_drivers_license_expiry ON drivers(license_expiry);
CREATE INDEX idx_drivers_license_number ON drivers(license_number);

CREATE INDEX idx_trips_driver_id ON trips(driver_id);
CREATE INDEX idx_trips_vehicle_id ON trips(vehicle_id);
CREATE INDEX idx_trips_status ON trips(status);
CREATE INDEX idx_trips_start_time ON trips(start_time);

CREATE INDEX idx_maintenance_vehicle_id ON maintenance(vehicle_id);
CREATE INDEX idx_maintenance_service_date ON maintenance(service_date);

CREATE INDEX idx_expenses_vehicle_id ON expenses(vehicle_id);
CREATE INDEX idx_expenses_expense_date ON expenses(expense_date);
CREATE INDEX idx_expenses_expense_type ON expenses(expense_type);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_drivers_updated_at BEFORE UPDATE ON drivers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### Key Database Design Decisions

1. **Foreign Key Constraints**: All relationships use `REFERENCES` with `ON DELETE RESTRICT` for trips (prevent deletion of active vehicles/drivers) and `ON DELETE CASCADE` for maintenance/expenses (cleanup when vehicle is deleted)

2. **CHECK Constraints**: Enforce business rules at database level:
   - Positive values for capacity, weight, costs
   - Valid status enums
   - Safety scores between 0-100
   - License expiry in future
   - End time after start time

3. **UNIQUE Constraints**: Prevent duplicates for license plates, driver licenses, usernames, emails

4. **NOT NULL Constraints**: All required fields enforced at database level

5. **Indexes**: Strategic indexes on foreign keys and frequently queried columns (status, dates) for performance

6. **Timestamps**: Automatic tracking with triggers for audit trail


### API Contract (REST Endpoints)

This section defines all HTTP endpoints for team coordination. Each endpoint includes method, path, authentication requirements, request/response formats, and status codes.

#### Authentication Endpoints

**POST /api/auth/register**
- Description: Register a new user
- Authentication: None
- Request Body:
```json
{
  "username": "string (3-50 chars)",
  "password": "string (min 8 chars)",
  "email": "string (valid email)",
  "role": "Fleet Manager | Dispatcher | Safety Officer | Financial Analyst"
}
```
- Response (201):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "Fleet Manager"
  }
}
```
- Error Responses: 400 (validation error), 409 (username/email exists)

**POST /api/auth/login**
- Description: Authenticate user and receive JWT token
- Authentication: None
- Request Body:
```json
{
  "username": "string",
  "password": "string"
}
```
- Response (200):
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "john_doe",
      "role": "Fleet Manager"
    }
  }
}
```
- Error Responses: 401 (invalid credentials)

**GET /api/auth/me**
- Description: Get current user profile
- Authentication: Required (JWT)
- Response (200):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "Fleet Manager"
  }
}
```
- Error Responses: 401 (unauthorized)

#### Vehicle Endpoints

**GET /api/vehicles**
- Description: List all vehicles with pagination
- Authentication: Required
- Query Parameters: `page=1`, `limit=50`, `status=Available`
- Response (200):
```json
{
  "success": true,
  "data": {
    "vehicles": [
      {
        "id": 1,
        "license_plate": "ABC-1234",
        "max_capacity_kg": 5000,
        "odometer_km": 45000,
        "status": "Available",
        "created_at": "2024-01-15T10:00:00Z",
        "updated_at": "2024-01-20T14:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 120,
      "pages": 3
    }
  }
}
```

**GET /api/vehicles/:id**
- Description: Get vehicle details with related data
- Authentication: Required
- Response (200):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "license_plate": "ABC-1234",
    "max_capacity_kg": 5000,
    "odometer_km": 45000,
    "status": "Available",
    "active_trips": 0,
    "total_trips": 45,
    "maintenance_due": false,
    "total_expenses": 12500.50,
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-20T14:30:00Z"
  }
}
```
- Error Responses: 404 (vehicle not found)

**POST /api/vehicles**
- Description: Create a new vehicle
- Authentication: Required (Fleet Manager only)
- Request Body:
```json
{
  "license_plate": "ABC-1234",
  "max_capacity_kg": 5000,
  "odometer_km": 0
}
```
- Response (201):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "license_plate": "ABC-1234",
    "max_capacity_kg": 5000,
    "odometer_km": 0,
    "status": "Available",
    "created_at": "2024-01-15T10:00:00Z"
  }
}
```
- Error Responses: 400 (validation error), 403 (forbidden), 409 (license plate exists)

**PUT /api/vehicles/:id**
- Description: Update vehicle details
- Authentication: Required (Fleet Manager only)
- Request Body:
```json
{
  "max_capacity_kg": 5500,
  "odometer_km": 45100,
  "status": "In Shop"
}
```
- Response (200):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "license_plate": "ABC-1234",
    "max_capacity_kg": 5500,
    "odometer_km": 45100,
    "status": "In Shop",
    "updated_at": "2024-01-20T14:30:00Z"
  }
}
```
- Error Responses: 400 (validation error, odometer decrease), 403 (forbidden), 404 (not found)

**DELETE /api/vehicles/:id**
- Description: Delete a vehicle
- Authentication: Required (Fleet Manager only)
- Response (200):
```json
{
  "success": true,
  "message": "Vehicle deleted successfully"
}
```
- Error Responses: 400 (has active trips), 403 (forbidden), 404 (not found)

#### Driver Endpoints

**GET /api/drivers**
- Description: List all drivers with pagination
- Authentication: Required
- Query Parameters: `page=1`, `limit=50`, `expiring_soon=true`
- Response (200):
```json
{
  "success": true,
  "data": {
    "drivers": [
      {
        "id": 1,
        "name": "John Smith",
        "license_number": "DL123456",
        "license_expiry": "2025-06-30",
        "safety_score": 95,
        "license_expiring_soon": false,
        "created_at": "2024-01-10T09:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 80,
      "pages": 2
    }
  }
}
```

**GET /api/drivers/:id**
- Description: Get driver details
- Authentication: Required
- Response (200):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Smith",
    "license_number": "DL123456",
    "license_expiry": "2025-06-30",
    "safety_score": 95,
    "total_trips": 120,
    "active_trips": 1,
    "created_at": "2024-01-10T09:00:00Z"
  }
}
```

**POST /api/drivers**
- Description: Create a new driver
- Authentication: Required (Fleet Manager, Safety Officer)
- Request Body:
```json
{
  "name": "John Smith",
  "license_number": "DL123456",
  "license_expiry": "2025-06-30",
  "safety_score": 100
}
```
- Response (201):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Smith",
    "license_number": "DL123456",
    "license_expiry": "2025-06-30",
    "safety_score": 100,
    "created_at": "2024-01-10T09:00:00Z"
  }
}
```
- Error Responses: 400 (validation error, expired license), 403 (forbidden), 409 (license number exists)

**PUT /api/drivers/:id**
- Description: Update driver details
- Authentication: Required (Fleet Manager, Safety Officer)
- Request Body:
```json
{
  "license_expiry": "2026-06-30",
  "safety_score": 92
}
```
- Response (200): Updated driver object
- Error Responses: 400 (validation error), 403 (forbidden), 404 (not found)

**DELETE /api/drivers/:id**
- Description: Delete a driver
- Authentication: Required (Fleet Manager only)
- Response (200):
```json
{
  "success": true,
  "message": "Driver deleted successfully"
}
```
- Error Responses: 400 (has active trips), 403 (forbidden), 404 (not found)

#### Trip Endpoints

**GET /api/trips**
- Description: List all trips with pagination
- Authentication: Required
- Query Parameters: `page=1`, `limit=50`, `status=In Progress`, `vehicle_id=1`, `driver_id=1`
- Response (200):
```json
{
  "success": true,
  "data": {
    "trips": [
      {
        "id": 1,
        "driver": {
          "id": 1,
          "name": "John Smith"
        },
        "vehicle": {
          "id": 1,
          "license_plate": "ABC-1234"
        },
        "origin": "Warehouse A",
        "destination": "Customer Site B",
        "cargo_weight_kg": 3500,
        "start_time": "2024-01-20T08:00:00Z",
        "end_time": null,
        "status": "In Progress",
        "created_at": "2024-01-20T07:45:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 250,
      "pages": 5
    }
  }
}
```

**GET /api/trips/:id**
- Description: Get trip details
- Authentication: Required
- Response (200):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "driver": {
      "id": 1,
      "name": "John Smith",
      "license_number": "DL123456"
    },
    "vehicle": {
      "id": 1,
      "license_plate": "ABC-1234",
      "max_capacity_kg": 5000
    },
    "origin": "Warehouse A",
    "destination": "Customer Site B",
    "cargo_weight_kg": 3500,
    "start_time": "2024-01-20T08:00:00Z",
    "end_time": null,
    "status": "In Progress",
    "created_by": {
      "id": 2,
      "username": "dispatcher1"
    },
    "created_at": "2024-01-20T07:45:00Z"
  }
}
```

**POST /api/trips**
- Description: Create a new trip with validation
- Authentication: Required (Dispatcher, Fleet Manager)
- Request Body:
```json
{
  "driver_id": 1,
  "vehicle_id": 1,
  "origin": "Warehouse A",
  "destination": "Customer Site B",
  "cargo_weight_kg": 3500
}
```
- Response (201):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "driver_id": 1,
    "vehicle_id": 1,
    "origin": "Warehouse A",
    "destination": "Customer Site B",
    "cargo_weight_kg": 3500,
    "start_time": "2024-01-20T08:00:00Z",
    "status": "In Progress",
    "created_at": "2024-01-20T08:00:00Z"
  }
}
```
- Error Responses:
  - 400 (validation errors):
    - "Cargo exceeds vehicle capacity"
    - "Driver license expired"
    - "Vehicle not available"
  - 403 (forbidden)
  - 404 (driver or vehicle not found)

**PUT /api/trips/:id/complete**
- Description: Mark trip as completed
- Authentication: Required (Dispatcher, Fleet Manager)
- Request Body: None
- Response (200):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "Completed",
    "end_time": "2024-01-20T12:30:00Z",
    "duration_hours": 4.5
  }
}
```
- Error Responses: 400 (already completed), 403 (forbidden), 404 (not found)

**DELETE /api/trips/:id**
- Description: Cancel a trip
- Authentication: Required (Dispatcher, Fleet Manager)
- Response (200):
```json
{
  "success": true,
  "message": "Trip cancelled successfully"
}
```

#### Maintenance Endpoints

**GET /api/maintenance**
- Description: List maintenance records
- Authentication: Required
- Query Parameters: `page=1`, `limit=50`, `vehicle_id=1`, `status=Scheduled`
- Response (200):
```json
{
  "success": true,
  "data": {
    "maintenance": [
      {
        "id": 1,
        "vehicle": {
          "id": 1,
          "license_plate": "ABC-1234"
        },
        "service_type": "Oil Change",
        "cost": 150.00,
        "service_date": "2024-01-25",
        "description": "Regular maintenance",
        "status": "Scheduled",
        "created_at": "2024-01-20T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 45,
      "pages": 1
    }
  }
}
```

**POST /api/maintenance**
- Description: Create maintenance record (auto-updates vehicle status to "In Shop")
- Authentication: Required (Fleet Manager)
- Request Body:
```json
{
  "vehicle_id": 1,
  "service_type": "Oil Change",
  "cost": 150.00,
  "service_date": "2024-01-25",
  "description": "Regular maintenance"
}
```
- Response (201):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "vehicle_id": 1,
    "service_type": "Oil Change",
    "cost": 150.00,
    "service_date": "2024-01-25",
    "description": "Regular maintenance",
    "status": "Scheduled",
    "created_at": "2024-01-20T10:00:00Z"
  },
  "message": "Vehicle status updated to In Shop"
}
```

**PUT /api/maintenance/:id/complete**
- Description: Mark maintenance as completed (auto-updates vehicle status to "Available")
- Authentication: Required (Fleet Manager)
- Response (200):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "Completed"
  },
  "message": "Vehicle status updated to Available"
}
```

#### Expense Endpoints

**GET /api/expenses**
- Description: List expense records
- Authentication: Required
- Query Parameters: `page=1`, `limit=50`, `vehicle_id=1`, `expense_type=Fuel`, `start_date=2024-01-01`, `end_date=2024-01-31`
- Response (200):
```json
{
  "success": true,
  "data": {
    "expenses": [
      {
        "id": 1,
        "vehicle": {
          "id": 1,
          "license_plate": "ABC-1234"
        },
        "expense_type": "Fuel",
        "amount": 85.50,
        "fuel_liters": 50.0,
        "expense_date": "2024-01-20",
        "description": "Regular refuel",
        "created_at": "2024-01-20T14:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 180,
      "pages": 4
    }
  }
}
```

**POST /api/expenses**
- Description: Create expense record
- Authentication: Required (Financial Analyst, Fleet Manager)
- Request Body:
```json
{
  "vehicle_id": 1,
  "expense_type": "Fuel",
  "amount": 85.50,
  "fuel_liters": 50.0,
  "expense_date": "2024-01-20",
  "description": "Regular refuel"
}
```
- Response (201):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "vehicle_id": 1,
    "expense_type": "Fuel",
    "amount": 85.50,
    "fuel_liters": 50.0,
    "expense_date": "2024-01-20",
    "description": "Regular refuel",
    "created_at": "2024-01-20T14:00:00Z"
  }
}
```
- Error Responses: 400 (validation error, fuel_liters required for Fuel type), 403 (forbidden)

#### Dashboard Endpoints

**GET /api/dashboard/kpis**
- Description: Get real-time KPI metrics
- Authentication: Required
- Response (200):
```json
{
  "success": true,
  "data": {
    "vehicle_status": {
      "Available": 45,
      "On Trip": 32,
      "In Shop": 8,
      "Retired": 5
    },
    "maintenance_alerts": 3,
    "utilization_rate": 68.5,
    "pending_trips": 12,
    "active_drivers": 78,
    "total_vehicles": 90,
    "last_updated": "2024-01-20T15:30:00Z"
  }
}
```

**GET /api/dashboard/alerts**
- Description: Get system alerts (license expiry, maintenance due)
- Authentication: Required
- Response (200):
```json
{
  "success": true,
  "data": {
    "alerts": [
      {
        "type": "license_expiry",
        "severity": "warning",
        "message": "Driver John Smith license expires in 25 days",
        "driver_id": 1,
        "expiry_date": "2024-02-15"
      },
      {
        "type": "maintenance_due",
        "severity": "high",
        "message": "Vehicle ABC-1234 requires service",
        "vehicle_id": 1
      }
    ]
  }
}
```

#### Report Endpoints

**GET /api/reports/financial**
- Description: Generate financial report
- Authentication: Required (Financial Analyst, Fleet Manager)
- Query Parameters: `start_date=2024-01-01`, `end_date=2024-01-31`, `vehicle_id=1`
- Response (200):
```json
{
  "success": true,
  "data": {
    "summary": {
      "total_expenses": 45600.50,
      "fuel_expenses": 28400.00,
      "maintenance_expenses": 12200.50,
      "other_expenses": 5000.00,
      "average_fuel_efficiency": 8.5
    },
    "by_vehicle": [
      {
        "vehicle_id": 1,
        "license_plate": "ABC-1234",
        "total_expenses": 1250.00,
        "fuel_efficiency": 9.2,
        "trips_completed": 15
      }
    ]
  }
}
```

**GET /api/reports/financial/export**
- Description: Export financial report as CSV
- Authentication: Required (Financial Analyst, Fleet Manager)
- Query Parameters: Same as /api/reports/financial
- Response (200): CSV file download
- Headers: `Content-Type: text/csv`, `Content-Disposition: attachment; filename="financial_report_2024-01-20.csv"`

#### WebSocket Events

**Connection**: `ws://localhost:3000` or `wss://domain.com`
- Authentication: Send JWT token in connection query: `?token=<jwt_token>`

**Server → Client Events:**

```javascript
// Vehicle status changed
{
  "event": "vehicle_status_changed",
  "data": {
    "vehicle_id": 1,
    "license_plate": "ABC-1234",
    "old_status": "Available",
    "new_status": "On Trip",
    "timestamp": "2024-01-20T15:30:00Z"
  }
}

// Trip created
{
  "event": "trip_created",
  "data": {
    "trip_id": 1,
    "vehicle_id": 1,
    "driver_id": 1,
    "status": "In Progress",
    "timestamp": "2024-01-20T15:30:00Z"
  }
}

// Trip completed
{
  "event": "trip_completed",
  "data": {
    "trip_id": 1,
    "vehicle_id": 1,
    "duration_hours": 4.5,
    "timestamp": "2024-01-20T15:30:00Z"
  }
}

// Dashboard KPI update
{
  "event": "kpi_update",
  "data": {
    "vehicle_status": {
      "Available": 44,
      "On Trip": 33,
      "In Shop": 8,
      "Retired": 5
    },
    "utilization_rate": 69.2,
    "timestamp": "2024-01-20T15:30:00Z"
  }
}

// Maintenance alert
{
  "event": "maintenance_alert",
  "data": {
    "vehicle_id": 1,
    "license_plate": "ABC-1234",
    "message": "Maintenance due",
    "timestamp": "2024-01-20T15:30:00Z"
  }
}
```


## Data Models

### Backend Data Models (Node.js)

Each model encapsulates database queries and data access logic.

#### User Model

```javascript
// models/user.model.js
class UserModel {
  constructor(pool) {
    this.pool = pool;
  }

  async create({ username, password_hash, email, role }) {
    const query = `
      INSERT INTO users (username, password_hash, email, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, username, email, role, created_at
    `;
    const result = await this.pool.query(query, [username, password_hash, email, role]);
    return result.rows[0];
  }

  async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await this.pool.query(query, [username]);
    return result.rows[0];
  }

  async findById(id) {
    const query = 'SELECT id, username, email, role, created_at FROM users WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rows[0];
  }
}
```

#### Vehicle Model

```javascript
// models/vehicle.model.js
class VehicleModel {
  constructor(pool) {
    this.pool = pool;
  }

  async create({ license_plate, max_capacity_kg, odometer_km = 0 }) {
    const query = `
      INSERT INTO vehicles (license_plate, max_capacity_kg, odometer_km)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await this.pool.query(query, [license_plate, max_capacity_kg, odometer_km]);
    return result.rows[0];
  }

  async findAll({ page = 1, limit = 50, status = null }) {
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM vehicles';
    const params = [];
    
    if (status) {
      query += ' WHERE status = $1';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);
    
    const result = await this.pool.query(query, params);
    
    // Get total count
    const countQuery = status ? 'SELECT COUNT(*) FROM vehicles WHERE status = $1' : 'SELECT COUNT(*) FROM vehicles';
    const countParams = status ? [status] : [];
    const countResult = await this.pool.query(countQuery, countParams);
    
    return {
      vehicles: result.rows,
      total: parseInt(countResult.rows[0].count)
    };
  }

  async findById(id) {
    const query = 'SELECT * FROM vehicles WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rows[0];
  }

  async update(id, { max_capacity_kg, odometer_km, status }) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (max_capacity_kg !== undefined) {
      fields.push(`max_capacity_kg = $${paramCount++}`);
      values.push(max_capacity_kg);
    }
    if (odometer_km !== undefined) {
      fields.push(`odometer_km = $${paramCount++}`);
      values.push(odometer_km);
    }
    if (status !== undefined) {
      fields.push(`status = $${paramCount++}`);
      values.push(status);
    }

    values.push(id);
    const query = `UPDATE vehicles SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async delete(id) {
    const query = 'DELETE FROM vehicles WHERE id = $1';
    await this.pool.query(query, [id]);
  }

  async hasActiveTrips(id) {
    const query = `SELECT COUNT(*) FROM trips WHERE vehicle_id = $1 AND status = 'In Progress'`;
    const result = await this.pool.query(query, [id]);
    return parseInt(result.rows[0].count) > 0;
  }
}
```

#### Driver Model

```javascript
// models/driver.model.js
class DriverModel {
  constructor(pool) {
    this.pool = pool;
  }

  async create({ name, license_number, license_expiry, safety_score = 100 }) {
    const query = `
      INSERT INTO drivers (name, license_number, license_expiry, safety_score)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await this.pool.query(query, [name, license_number, license_expiry, safety_score]);
    return result.rows[0];
  }

  async findAll({ page = 1, limit = 50, expiring_soon = false }) {
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM drivers';
    const params = [];
    
    if (expiring_soon) {
      query += ' WHERE license_expiry <= CURRENT_DATE + INTERVAL \'30 days\'';
    }
    
    query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);
    
    const result = await this.pool.query(query, params);
    
    const countQuery = expiring_soon 
      ? 'SELECT COUNT(*) FROM drivers WHERE license_expiry <= CURRENT_DATE + INTERVAL \'30 days\''
      : 'SELECT COUNT(*) FROM drivers';
    const countResult = await this.pool.query(countQuery);
    
    return {
      drivers: result.rows,
      total: parseInt(countResult.rows[0].count)
    };
  }

  async findById(id) {
    const query = 'SELECT * FROM drivers WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rows[0];
  }

  async update(id, { license_expiry, safety_score }) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (license_expiry !== undefined) {
      fields.push(`license_expiry = $${paramCount++}`);
      values.push(license_expiry);
    }
    if (safety_score !== undefined) {
      fields.push(`safety_score = $${paramCount++}`);
      values.push(safety_score);
    }

    values.push(id);
    const query = `UPDATE drivers SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async delete(id) {
    const query = 'DELETE FROM drivers WHERE id = $1';
    await this.pool.query(query, [id]);
  }

  async isLicenseValid(id) {
    const query = 'SELECT license_expiry > CURRENT_DATE as is_valid FROM drivers WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rows[0]?.is_valid || false;
  }
}
```

#### Trip Model

```javascript
// models/trip.model.js
class TripModel {
  constructor(pool) {
    this.pool = pool;
  }

  async create({ driver_id, vehicle_id, origin, destination, cargo_weight_kg, created_by }) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      // Create trip
      const tripQuery = `
        INSERT INTO trips (driver_id, vehicle_id, origin, destination, cargo_weight_kg, created_by)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;
      const tripResult = await client.query(tripQuery, [
        driver_id, vehicle_id, origin, destination, cargo_weight_kg, created_by
      ]);

      // Update vehicle status
      const statusQuery = `UPDATE vehicles SET status = 'On Trip' WHERE id = $1`;
      await client.query(statusQuery, [vehicle_id]);

      await client.query('COMMIT');
      return tripResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async findAll({ page = 1, limit = 50, status = null, vehicle_id = null, driver_id = null }) {
    const offset = (page - 1) * limit;
    let query = `
      SELECT t.*, 
             d.name as driver_name, 
             v.license_plate as vehicle_license_plate
      FROM trips t
      JOIN drivers d ON t.driver_id = d.id
      JOIN vehicles v ON t.vehicle_id = v.id
    `;
    const params = [];
    const conditions = [];
    
    if (status) {
      conditions.push(`t.status = $${params.length + 1}`);
      params.push(status);
    }
    if (vehicle_id) {
      conditions.push(`t.vehicle_id = $${params.length + 1}`);
      params.push(vehicle_id);
    }
    if (driver_id) {
      conditions.push(`t.driver_id = $${params.length + 1}`);
      params.push(driver_id);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ` ORDER BY t.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const result = await this.pool.query(query, params);
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM trips t';
    if (conditions.length > 0) {
      countQuery += ' WHERE ' + conditions.join(' AND ');
    }
    const countResult = await this.pool.query(countQuery, params.slice(0, -2));
    
    return {
      trips: result.rows,
      total: parseInt(countResult.rows[0].count)
    };
  }

  async findById(id) {
    const query = `
      SELECT t.*, 
             json_build_object('id', d.id, 'name', d.name, 'license_number', d.license_number) as driver,
             json_build_object('id', v.id, 'license_plate', v.license_plate, 'max_capacity_kg', v.max_capacity_kg) as vehicle,
             json_build_object('id', u.id, 'username', u.username) as created_by_user
      FROM trips t
      JOIN drivers d ON t.driver_id = d.id
      JOIN vehicles v ON t.vehicle_id = v.id
      JOIN users u ON t.created_by = u.id
      WHERE t.id = $1
    `;
    const result = await this.pool.query(query, [id]);
    return result.rows[0];
  }

  async complete(id) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      // Get vehicle_id before completing
      const getVehicleQuery = 'SELECT vehicle_id FROM trips WHERE id = $1';
      const vehicleResult = await client.query(getVehicleQuery, [id]);
      const vehicle_id = vehicleResult.rows[0].vehicle_id;

      // Complete trip
      const tripQuery = `
        UPDATE trips 
        SET status = 'Completed', end_time = CURRENT_TIMESTAMP 
        WHERE id = $1 
        RETURNING *
      `;
      const tripResult = await client.query(tripQuery, [id]);

      // Update vehicle status back to Available
      const statusQuery = `UPDATE vehicles SET status = 'Available' WHERE id = $1`;
      await client.query(statusQuery, [vehicle_id]);

      await client.query('COMMIT');
      return tripResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async cancel(id) {
    const query = `UPDATE trips SET status = 'Cancelled' WHERE id = $1 RETURNING *`;
    const result = await this.pool.query(query, [id]);
    return result.rows[0];
  }
}
```

#### Maintenance Model

```javascript
// models/maintenance.model.js
class MaintenanceModel {
  constructor(pool) {
    this.pool = pool;
  }

  async create({ vehicle_id, service_type, cost, service_date, description }) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      // Create maintenance record
      const maintenanceQuery = `
        INSERT INTO maintenance (vehicle_id, service_type, cost, service_date, description)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      const maintenanceResult = await client.query(maintenanceQuery, [
        vehicle_id, service_type, cost, service_date, description
      ]);

      // Update vehicle status to In Shop
      const statusQuery = `UPDATE vehicles SET status = 'In Shop' WHERE id = $1`;
      await client.query(statusQuery, [vehicle_id]);

      await client.query('COMMIT');
      return maintenanceResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async findAll({ page = 1, limit = 50, vehicle_id = null, status = null }) {
    const offset = (page - 1) * limit;
    let query = `
      SELECT m.*, v.license_plate as vehicle_license_plate
      FROM maintenance m
      JOIN vehicles v ON m.vehicle_id = v.id
    `;
    const params = [];
    const conditions = [];
    
    if (vehicle_id) {
      conditions.push(`m.vehicle_id = $${params.length + 1}`);
      params.push(vehicle_id);
    }
    if (status) {
      conditions.push(`m.status = $${params.length + 1}`);
      params.push(status);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ` ORDER BY m.service_date DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const result = await this.pool.query(query, params);
    
    let countQuery = 'SELECT COUNT(*) FROM maintenance m';
    if (conditions.length > 0) {
      countQuery += ' WHERE ' + conditions.join(' AND ');
    }
    const countResult = await this.pool.query(countQuery, params.slice(0, -2));
    
    return {
      maintenance: result.rows,
      total: parseInt(countResult.rows[0].count)
    };
  }

  async complete(id) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      // Get vehicle_id
      const getVehicleQuery = 'SELECT vehicle_id FROM maintenance WHERE id = $1';
      const vehicleResult = await client.query(getVehicleQuery, [id]);
      const vehicle_id = vehicleResult.rows[0].vehicle_id;

      // Complete maintenance
      const maintenanceQuery = `UPDATE maintenance SET status = 'Completed' WHERE id = $1 RETURNING *`;
      const maintenanceResult = await client.query(maintenanceQuery, [id]);

      // Update vehicle status back to Available
      const statusQuery = `UPDATE vehicles SET status = 'Available' WHERE id = $1`;
      await client.query(statusQuery, [vehicle_id]);

      await client.query('COMMIT');
      return maintenanceResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}
```

#### Expense Model

```javascript
// models/expense.model.js
class ExpenseModel {
  constructor(pool) {
    this.pool = pool;
  }

  async create({ vehicle_id, expense_type, amount, fuel_liters, expense_date, description }) {
    const query = `
      INSERT INTO expenses (vehicle_id, expense_type, amount, fuel_liters, expense_date, description)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await this.pool.query(query, [
      vehicle_id, expense_type, amount, fuel_liters, expense_date, description
    ]);
    return result.rows[0];
  }

  async findAll({ page = 1, limit = 50, vehicle_id = null, expense_type = null, start_date = null, end_date = null }) {
    const offset = (page - 1) * limit;
    let query = `
      SELECT e.*, v.license_plate as vehicle_license_plate
      FROM expenses e
      JOIN vehicles v ON e.vehicle_id = v.id
    `;
    const params = [];
    const conditions = [];
    
    if (vehicle_id) {
      conditions.push(`e.vehicle_id = $${params.length + 1}`);
      params.push(vehicle_id);
    }
    if (expense_type) {
      conditions.push(`e.expense_type = $${params.length + 1}`);
      params.push(expense_type);
    }
    if (start_date) {
      conditions.push(`e.expense_date >= $${params.length + 1}`);
      params.push(start_date);
    }
    if (end_date) {
      conditions.push(`e.expense_date <= $${params.length + 1}`);
      params.push(end_date);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ` ORDER BY e.expense_date DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const result = await this.pool.query(query, params);
    
    let countQuery = 'SELECT COUNT(*) FROM expenses e';
    if (conditions.length > 0) {
      countQuery += ' WHERE ' + conditions.join(' AND ');
    }
    const countResult = await this.pool.query(countQuery, params.slice(0, -2));
    
    return {
      expenses: result.rows,
      total: parseInt(countResult.rows[0].count)
    };
  }

  async getTotalByVehicle(vehicle_id) {
    const query = `SELECT SUM(amount) as total FROM expenses WHERE vehicle_id = $1`;
    const result = await this.pool.query(query, [vehicle_id]);
    return parseFloat(result.rows[0].total) || 0;
  }
}
```

### Frontend Data Models (TypeScript/JavaScript)

```typescript
// types/models.ts

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'Fleet Manager' | 'Dispatcher' | 'Safety Officer' | 'Financial Analyst';
  created_at: string;
}

export interface Vehicle {
  id: number;
  license_plate: string;
  max_capacity_kg: number;
  odometer_km: number;
  status: 'Available' | 'On Trip' | 'In Shop' | 'Retired';
  created_at: string;
  updated_at: string;
}

export interface Driver {
  id: number;
  name: string;
  license_number: string;
  license_expiry: string;
  safety_score: number;
  created_at: string;
  updated_at: string;
}

export interface Trip {
  id: number;
  driver_id: number;
  vehicle_id: number;
  origin: string;
  destination: string;
  cargo_weight_kg: number;
  start_time: string;
  end_time: string | null;
  status: 'In Progress' | 'Completed' | 'Cancelled';
  created_by: number;
  created_at: string;
}

export interface Maintenance {
  id: number;
  vehicle_id: number;
  service_type: string;
  cost: number;
  service_date: string;
  description: string;
  status: 'Scheduled' | 'In Progress' | 'Completed';
  created_at: string;
}

export interface Expense {
  id: number;
  vehicle_id: number;
  expense_type: 'Fuel' | 'Repair' | 'Toll' | 'Insurance' | 'Other';
  amount: number;
  fuel_liters: number | null;
  expense_date: string;
  description: string;
  created_at: string;
}

export interface DashboardKPIs {
  vehicle_status: {
    Available: number;
    'On Trip': number;
    'In Shop': number;
    Retired: number;
  };
  maintenance_alerts: number;
  utilization_rate: number;
  pending_trips: number;
  active_drivers: number;
  total_vehicles: number;
  last_updated: string;
}
```


## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property Reflection

After analyzing all acceptance criteria, I identified the following redundancies:
- Properties 3.3, 9.2: Both test that new vehicles have status "Available" - combined into Property 1
- Properties 4.6, 9.3: Both test trip creation changes vehicle to "On Trip" - combined into Property 8
- Properties 5.2, 9.4: Both test trip completion returns vehicle to "Available" - combined into Property 9
- Properties 6.2, 9.5: Both test maintenance changes vehicle to "In Shop" - combined into Property 11
- Properties 4.3, 8.5: Both test expired license prevents trip creation - combined into Property 7
- Properties 7.4, 10.2, 10.3: All test expense aggregation - combined into Property 18

### Authentication and Authorization Properties

### Property 1: Valid credentials generate token
*For any* valid username and password combination in the system, authentication should return a JWT token with user information.

**Validates: Requirements 1.2**

### Property 2: Invalid credentials rejected
*For any* invalid credentials (non-existent username or incorrect password), authentication should return HTTP 401 and deny access.

**Validates: Requirements 1.3**

### Property 3: Unauthorized role access forbidden
*For any* endpoint with role restrictions, when accessed by a user without the required role, the system should return HTTP 403.

**Validates: Requirements 1.5**

### Dashboard and Real-Time Properties

### Property 4: Vehicle status counts accurate
*For any* database state, the dashboard should display accurate counts of vehicles in each status (Available, On Trip, In Shop, Retired) matching the actual database counts.

**Validates: Requirements 2.1**

### Property 5: Maintenance alert count accurate
*For any* set of maintenance records, the dashboard should display the correct count of vehicles requiring service.

**Validates: Requirements 2.2**

### Property 6: Utilization rate calculation correct
*For any* fleet state, the utilization rate should be correctly calculated as (vehicles on trip / total available vehicles) * 100.

**Validates: Requirements 2.3**

### Property 7: Pending trips count accurate
*For any* set of trips, the dashboard should display the correct count of trips with status "In Progress".

**Validates: Requirements 2.4**

### Property 8: Real-time updates broadcast on changes
*For any* vehicle status change or trip creation/completion, the system should broadcast real-time updates to all connected WebSocket clients.

**Validates: Requirements 2.5, 5.4, 13.2, 13.3**

### Vehicle Management Properties

### Property 9: New vehicle initialized correctly
*For any* newly created vehicle, the system should store all required fields (license_plate, max_capacity_kg, odometer_km) and set initial status to "Available".

**Validates: Requirements 3.1, 3.3, 9.2**

### Property 10: License plate uniqueness enforced
*For any* attempt to create a vehicle with a license plate that already exists, the system should reject the creation and return an error.

**Validates: Requirements 3.2**

### Property 11: Active vehicles cannot be deleted
*For any* vehicle with trips in "In Progress" status, deletion attempts should fail and return an error.

**Validates: Requirements 3.4**

### Property 12: Capacity must be positive
*For any* vehicle creation or update with max_capacity_kg ≤ 0, the system should reject the operation and return HTTP 400.

**Validates: Requirements 3.5**

### Property 13: Odometer only increases
*For any* vehicle update where the new odometer_km value is less than the current value, the system should reject the update and return an error.

**Validates: Requirements 3.6**

### Trip Management Properties

### Property 14: Trip stores required fields
*For any* successfully created trip, the system should store all required fields: driver_id, vehicle_id, origin, destination, cargo_weight_kg, start_time, and created_by.

**Validates: Requirements 4.1**

### Property 15: Cargo capacity validation
*For any* trip creation where cargo_weight_kg exceeds the vehicle's max_capacity_kg, the system should reject the trip and return HTTP 400 with message "Cargo exceeds vehicle capacity".

**Validates: Requirements 4.2, 4.8**

### Property 16: Expired license prevents trip
*For any* trip creation with a driver whose license_expiry is in the past, the system should reject the trip and return HTTP 400 with message "Driver license expired".

**Validates: Requirements 4.3, 4.4, 8.5**

### Property 17: Only available vehicles can be assigned
*For any* trip creation with a vehicle whose status is not "Available", the system should reject the trip and return an error.

**Validates: Requirements 4.5, 6.5, 9.7**

### Property 18: Trip creation updates vehicle status
*For any* successful trip creation, the vehicle's status should atomically change from "Available" to "On Trip".

**Validates: Requirements 4.6, 9.3**

### Property 19: Trip completion records timestamp
*For any* trip marked as completed, the system should record the end_time timestamp and ensure end_time > start_time.

**Validates: Requirements 5.1**

### Property 20: Trip completion frees vehicle
*For any* trip completion, the vehicle's status should atomically change from "On Trip" to "Available".

**Validates: Requirements 5.2, 9.4**

### Maintenance Properties

### Property 21: Maintenance stores required fields
*For any* maintenance record created, the system should store all required fields: vehicle_id, service_type, cost, service_date, and description.

**Validates: Requirements 6.1**

### Property 22: Maintenance creation locks vehicle
*For any* maintenance log creation, the vehicle's status should atomically change to "In Shop".

**Validates: Requirements 6.2, 9.5**

### Property 23: Maintenance completion frees vehicle
*For any* maintenance marked as completed, the vehicle's status should change from "In Shop" to "Available".

**Validates: Requirements 6.4**

### Property 24: Maintenance alerts for due service
*For any* vehicle that has exceeded its preventative maintenance interval (based on odometer or time since last service), the system should display a maintenance alert.

**Validates: Requirements 6.6**

### Expense and Financial Properties

### Property 25: Expense stores required fields
*For any* expense record created, the system should store all required fields: vehicle_id, expense_type, amount, expense_date.

**Validates: Requirements 7.1**

### Property 26: Fuel expenses require quantity
*For any* expense with expense_type "Fuel", the system should require fuel_liters to be provided and reject creation if missing.

**Validates: Requirements 7.2**

### Property 27: Fuel efficiency calculation correct
*For any* vehicle with fuel expense records, fuel efficiency should be correctly calculated as total distance traveled (odometer changes) divided by total fuel consumed.

**Validates: Requirements 7.3**

### Property 28: Expense aggregation correct
*For any* vehicle, the total operational cost should equal the sum of all expense amounts, and fuel/maintenance costs should be correctly aggregated by type.

**Validates: Requirements 7.4, 10.2, 10.3**

### Property 29: Expense amounts must be positive
*For any* expense creation with amount ≤ 0, the system should reject the operation and return HTTP 400.

**Validates: Requirements 7.5**

### Driver Management Properties

### Property 30: Driver stores required fields
*For any* driver created, the system should store all required fields: name, license_number, license_expiry, and safety_score.

**Validates: Requirements 8.1**

### Property 31: License expiry must be future
*For any* driver creation or update where license_expiry is in the past or today, the system should reject the operation and return an error.

**Validates: Requirements 8.2**

### Property 32: Safety score range validation
*For any* driver creation or update where safety_score is not between 0 and 100 (inclusive), the system should reject the operation and return HTTP 400.

**Validates: Requirements 8.3**

### Property 33: License expiry alerts
*For any* driver whose license_expiry is within 30 days from today, the system should display an alert.

**Validates: Requirements 8.4**

### Vehicle Status Properties

### Property 34: Status enum enforcement
*For any* vehicle operation that sets status to a value other than "Available", "On Trip", "In Shop", or "Retired", the system should reject the operation.

**Validates: Requirements 9.1**

### Property 35: Vehicle retirement
*For any* vehicle retirement action by a Fleet Manager, the vehicle's status should change to "Retired".

**Validates: Requirements 9.6**

### Financial Reporting Properties

### Property 36: ROI calculation correct
*For any* vehicle, the ROI should be correctly calculated as total revenue minus total operational costs (sum of all expenses).

**Validates: Requirements 10.1**

### Property 37: Fleet fuel efficiency average
*For any* fleet state, the average fuel efficiency should be correctly calculated as the mean of all individual vehicle fuel efficiencies.

**Validates: Requirements 10.4**

### Property 38: CSV export completeness
*For any* financial report, the CSV export should contain all data rows present in the report with all required columns.

**Validates: Requirements 10.5**

### Property 39: Pagination correctness
*For any* list endpoint with more than 50 records, pagination should correctly return 50 records per page with accurate page counts and total counts.

**Validates: Requirements 10.7, 13.6**

### Input Validation and Security Properties

### Property 40: SQL injection prevention
*For any* text input containing SQL injection patterns (e.g., '; DROP TABLE), the system should sanitize or reject the input without executing malicious SQL.

**Validates: Requirements 11.2**

### Property 41: XSS prevention
*For any* text input containing script tags or JavaScript code, the system should sanitize the input to prevent script execution.

**Validates: Requirements 11.3**

### Property 42: License plate format validation
*For any* license plate that doesn't match the expected format pattern, the system should reject the vehicle creation/update and return HTTP 400.

**Validates: Requirements 11.4**

### Property 43: Email format validation
*For any* email address that doesn't match valid email format, the system should reject the user creation/update and return HTTP 400.

**Validates: Requirements 11.5**

### Property 44: Validation error responses
*For any* validation failure, the system should return HTTP 400 with a descriptive error message indicating which field failed validation and why.

**Validates: Requirements 11.6**

### Property 45: Rate limiting enforcement
*For any* IP address that exceeds 100 requests per minute, the system should reject subsequent requests with HTTP 429 until the rate limit window resets.

**Validates: Requirements 11.9**


## Error Handling

### Error Response Format

All API errors follow a consistent JSON structure:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "Additional context"
    }
  }
}
```

### HTTP Status Codes

- **200 OK**: Successful GET, PUT, DELETE operations
- **201 Created**: Successful POST operations
- **400 Bad Request**: Validation errors, business rule violations
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: Valid authentication but insufficient permissions
- **404 Not Found**: Resource doesn't exist
- **409 Conflict**: Duplicate resource (e.g., license plate already exists)
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Unexpected server errors

### Error Categories

#### Validation Errors (400)

```javascript
// Example: Invalid cargo weight
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Cargo exceeds vehicle capacity",
    "details": {
      "cargo_weight_kg": 6000,
      "max_capacity_kg": 5000,
      "vehicle_id": 1
    }
  }
}

// Example: Expired driver license
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Driver license expired",
    "details": {
      "driver_id": 5,
      "license_expiry": "2023-12-31",
      "current_date": "2024-01-20"
    }
  }
}

// Example: Multiple validation errors
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "errors": [
        { "field": "email", "message": "Invalid email format" },
        { "field": "safety_score", "message": "Must be between 0 and 100" }
      ]
    }
  }
}
```

#### Authentication Errors (401)

```javascript
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid credentials"
  }
}

{
  "success": false,
  "error": {
    "code": "TOKEN_EXPIRED",
    "message": "Authentication token has expired"
  }
}
```

#### Authorization Errors (403)

```javascript
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Insufficient permissions",
    "details": {
      "required_role": "Fleet Manager",
      "user_role": "Dispatcher"
    }
  }
}
```

#### Resource Not Found (404)

```javascript
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Vehicle not found",
    "details": {
      "vehicle_id": 999
    }
  }
}
```

#### Conflict Errors (409)

```javascript
{
  "success": false,
  "error": {
    "code": "DUPLICATE_RESOURCE",
    "message": "License plate already exists",
    "details": {
      "license_plate": "ABC-1234",
      "existing_vehicle_id": 5
    }
  }
}
```

#### Database Errors (500)

```javascript
{
  "success": false,
  "error": {
    "code": "DATABASE_ERROR",
    "message": "An unexpected error occurred",
    "request_id": "req_abc123xyz"
  }
}
```

### Error Handling Strategy

#### Backend Error Handling

```javascript
// middleware/errorHandler.js
class AppError extends Error {
  constructor(message, statusCode, code, details = {}) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
  }
}

const errorHandler = (err, req, res, next) => {
  // Log error with request ID
  logger.error({
    request_id: req.id,
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });

  // Operational errors (expected)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details
      }
    });
  }

  // Programming errors (unexpected)
  // Don't leak error details to client
  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
      request_id: req.id
    }
  });
};

// Usage in controllers
async createTrip(req, res, next) {
  try {
    const { driver_id, vehicle_id, cargo_weight_kg } = req.body;
    
    // Validate cargo capacity
    const vehicle = await vehicleModel.findById(vehicle_id);
    if (!vehicle) {
      throw new AppError('Vehicle not found', 404, 'NOT_FOUND', { vehicle_id });
    }
    
    if (cargo_weight_kg > vehicle.max_capacity_kg) {
      throw new AppError(
        'Cargo exceeds vehicle capacity',
        400,
        'VALIDATION_ERROR',
        { cargo_weight_kg, max_capacity_kg: vehicle.max_capacity_kg }
      );
    }
    
    // Validate driver license
    const driver = await driverModel.findById(driver_id);
    const isValid = await driverModel.isLicenseValid(driver_id);
    if (!isValid) {
      throw new AppError(
        'Driver license expired',
        400,
        'VALIDATION_ERROR',
        { driver_id, license_expiry: driver.license_expiry }
      );
    }
    
    // Create trip
    const trip = await tripModel.create({ ...req.body, created_by: req.user.id });
    
    // Broadcast real-time update
    websocketManager.broadcast('trip_created', { trip_id: trip.id, vehicle_id, driver_id });
    
    res.status(201).json({ success: true, data: trip });
  } catch (error) {
    next(error);
  }
}
```

#### Frontend Error Handling

```javascript
// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  timeout: 10000
});

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      if (status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      
      // Return structured error
      return Promise.reject({
        status,
        code: data.error?.code || 'UNKNOWN_ERROR',
        message: data.error?.message || 'An error occurred',
        details: data.error?.details || {}
      });
    } else if (error.request) {
      // Request made but no response
      return Promise.reject({
        status: 0,
        code: 'NETWORK_ERROR',
        message: 'Unable to connect to server',
        details: {}
      });
    } else {
      // Something else happened
      return Promise.reject({
        status: 0,
        code: 'CLIENT_ERROR',
        message: error.message,
        details: {}
      });
    }
  }
);

export default api;
```

```javascript
// Component error handling example
const TripForm = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setError(null);
    setLoading(true);
    
    try {
      const result = await tripService.createTrip(formData);
      // Show success message
      toast.success('Trip created successfully');
      navigate('/trips');
    } catch (err) {
      // Display user-friendly error
      setError(err.message);
      
      // Show specific field errors if available
      if (err.details?.errors) {
        err.details.errors.forEach(fieldError => {
          // Highlight field with error
          setFieldError(fieldError.field, fieldError.message);
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}
      {/* Form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Trip'}
      </button>
    </form>
  );
};
```

### Transaction Rollback

For operations that modify multiple tables (trip creation, maintenance logging), use database transactions to ensure atomicity:

```javascript
// If any step fails, all changes are rolled back
const client = await pool.connect();
try {
  await client.query('BEGIN');
  
  // Step 1: Create trip
  const trip = await client.query('INSERT INTO trips ...');
  
  // Step 2: Update vehicle status
  await client.query('UPDATE vehicles SET status = ...');
  
  await client.query('COMMIT');
  return trip;
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  client.release();
}
```

### Logging

All errors are logged with structured format including:
- Request ID for tracing
- Timestamp
- Error message and stack trace
- Request details (URL, method, user)
- Context data

```javascript
logger.error({
  request_id: 'req_abc123',
  timestamp: '2024-01-20T15:30:00Z',
  error: 'Cargo exceeds vehicle capacity',
  stack: '...',
  url: '/api/trips',
  method: 'POST',
  user_id: 2,
  context: {
    vehicle_id: 1,
    cargo_weight_kg: 6000,
    max_capacity_kg: 5000
  }
});
```


## Testing Strategy

### Dual Testing Approach

The system requires both unit tests and property-based tests for comprehensive coverage:

- **Unit tests**: Verify specific examples, edge cases, error conditions, and integration points
- **Property-based tests**: Verify universal properties across all inputs through randomization
- Together they provide comprehensive coverage: unit tests catch concrete bugs, property tests verify general correctness

### Property-Based Testing

#### Framework Selection

**JavaScript/Node.js**: Use **fast-check** library
```bash
npm install --save-dev fast-check
```

#### Configuration

- Each property test MUST run minimum 100 iterations (due to randomization)
- Each test MUST reference its design document property with a comment tag
- Tag format: `// Feature: fleet-management-system, Property {number}: {property_text}`

#### Example Property Tests

```javascript
// tests/properties/trip.property.test.js
const fc = require('fast-check');
const { createTrip, getVehicle, getDriver } = require('../../src/services');

describe('Trip Management Properties', () => {
  
  // Feature: fleet-management-system, Property 15: Cargo capacity validation
  test('Property 15: Cargo exceeding capacity should be rejected', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 10000 }), // max_capacity_kg
        fc.integer({ min: 1, max: 20000 }), // cargo_weight_kg
        async (maxCapacity, cargoWeight) => {
          // Setup: Create vehicle with known capacity
          const vehicle = await createTestVehicle({ max_capacity_kg: maxCapacity });
          const driver = await createTestDriver({ license_expiry: futureDate() });
          
          // Test: Try to create trip
          if (cargoWeight > maxCapacity) {
            // Should reject
            await expect(
              createTrip({
                vehicle_id: vehicle.id,
                driver_id: driver.id,
                cargo_weight_kg: cargoWeight,
                origin: 'A',
                destination: 'B'
              })
            ).rejects.toMatchObject({
              status: 400,
              message: 'Cargo exceeds vehicle capacity'
            });
          } else {
            // Should succeed
            const trip = await createTrip({
              vehicle_id: vehicle.id,
              driver_id: driver.id,
              cargo_weight_kg: cargoWeight,
              origin: 'A',
              destination: 'B'
            });
            expect(trip).toBeDefined();
            expect(trip.cargo_weight_kg).toBe(cargoWeight);
          }
          
          // Cleanup
          await cleanupTestData(vehicle.id, driver.id);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: fleet-management-system, Property 18: Trip creation updates vehicle status
  test('Property 18: Trip creation should change vehicle status to On Trip', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1000, max: 5000 }), // capacity
        fc.integer({ min: 100, max: 1000 }),  // cargo
        fc.string({ minLength: 5, maxLength: 20 }), // origin
        fc.string({ minLength: 5, maxLength: 20 }), // destination
        async (capacity, cargo, origin, destination) => {
          // Setup
          const vehicle = await createTestVehicle({ 
            max_capacity_kg: capacity,
            status: 'Available'
          });
          const driver = await createTestDriver({ license_expiry: futureDate() });
          
          // Test: Create trip
          const trip = await createTrip({
            vehicle_id: vehicle.id,
            driver_id: driver.id,
            cargo_weight_kg: cargo,
            origin,
            destination
          });
          
          // Verify: Vehicle status changed
          const updatedVehicle = await getVehicle(vehicle.id);
          expect(updatedVehicle.status).toBe('On Trip');
          
          // Cleanup
          await cleanupTestData(vehicle.id, driver.id, trip.id);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: fleet-management-system, Property 20: Trip completion frees vehicle
  test('Property 20: Trip completion should return vehicle to Available', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1000, max: 5000 }),
        fc.integer({ min: 100, max: 1000 }),
        async (capacity, cargo) => {
          // Setup: Create trip
          const vehicle = await createTestVehicle({ max_capacity_kg: capacity });
          const driver = await createTestDriver({ license_expiry: futureDate() });
          const trip = await createTrip({
            vehicle_id: vehicle.id,
            driver_id: driver.id,
            cargo_weight_kg: cargo,
            origin: 'A',
            destination: 'B'
          });
          
          // Verify initial state
          const vehicleOnTrip = await getVehicle(vehicle.id);
          expect(vehicleOnTrip.status).toBe('On Trip');
          
          // Test: Complete trip
          await completeTrip(trip.id);
          
          // Verify: Vehicle returned to Available
          const vehicleAfter = await getVehicle(vehicle.id);
          expect(vehicleAfter.status).toBe('Available');
          
          // Cleanup
          await cleanupTestData(vehicle.id, driver.id, trip.id);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: fleet-management-system, Property 13: Odometer only increases
  test('Property 13: Odometer updates should only accept increasing values', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 0, max: 100000 }), // initial odometer
        fc.integer({ min: -10000, max: 200000 }), // new odometer
        async (initialOdometer, newOdometer) => {
          // Setup
          const vehicle = await createTestVehicle({ odometer_km: initialOdometer });
          
          // Test: Try to update odometer
          if (newOdometer < initialOdometer) {
            // Should reject decrease
            await expect(
              updateVehicle(vehicle.id, { odometer_km: newOdometer })
            ).rejects.toMatchObject({
              status: 400,
              message: expect.stringContaining('odometer')
            });
          } else {
            // Should accept increase
            const updated = await updateVehicle(vehicle.id, { odometer_km: newOdometer });
            expect(updated.odometer_km).toBe(newOdometer);
          }
          
          // Cleanup
          await cleanupTestData(vehicle.id);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: fleet-management-system, Property 28: Expense aggregation correct
  test('Property 28: Total expenses should equal sum of all expense records', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.float({ min: 10, max: 1000 }), { minLength: 1, maxLength: 20 }),
        async (expenseAmounts) => {
          // Setup
          const vehicle = await createTestVehicle({ max_capacity_kg: 5000 });
          
          // Create multiple expenses
          for (const amount of expenseAmounts) {
            await createExpense({
              vehicle_id: vehicle.id,
              expense_type: 'Fuel',
              amount,
              expense_date: new Date().toISOString().split('T')[0]
            });
          }
          
          // Test: Get total expenses
          const total = await getTotalExpenses(vehicle.id);
          const expectedTotal = expenseAmounts.reduce((sum, amt) => sum + amt, 0);
          
          // Verify: Total matches sum (with floating point tolerance)
          expect(Math.abs(total - expectedTotal)).toBeLessThan(0.01);
          
          // Cleanup
          await cleanupTestData(vehicle.id);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

#### Generators for Test Data

```javascript
// tests/generators/index.js
const fc = require('fast-check');

// Generate valid vehicle data
const vehicleArbitrary = () => fc.record({
  license_plate: fc.string({ minLength: 5, maxLength: 15 }).map(s => s.toUpperCase()),
  max_capacity_kg: fc.integer({ min: 500, max: 10000 }),
  odometer_km: fc.integer({ min: 0, max: 500000 })
});

// Generate valid driver data
const driverArbitrary = () => fc.record({
  name: fc.string({ minLength: 3, maxLength: 50 }),
  license_number: fc.string({ minLength: 8, maxLength: 20 }),
  license_expiry: fc.date({ min: new Date(), max: new Date('2030-12-31') })
    .map(d => d.toISOString().split('T')[0]),
  safety_score: fc.integer({ min: 0, max: 100 })
});

// Generate valid trip data
const tripArbitrary = (vehicleId, driverId, maxCapacity) => fc.record({
  vehicle_id: fc.constant(vehicleId),
  driver_id: fc.constant(driverId),
  origin: fc.string({ minLength: 3, maxLength: 100 }),
  destination: fc.string({ minLength: 3, maxLength: 100 }),
  cargo_weight_kg: fc.integer({ min: 1, max: maxCapacity })
});

// Generate SQL injection attempts
const sqlInjectionArbitrary = () => fc.oneof(
  fc.constant("'; DROP TABLE users; --"),
  fc.constant("1' OR '1'='1"),
  fc.constant("admin'--"),
  fc.constant("' UNION SELECT * FROM users--")
);

// Generate XSS attempts
const xssArbitrary = () => fc.oneof(
  fc.constant("<script>alert('XSS')</script>"),
  fc.constant("<img src=x onerror=alert('XSS')>"),
  fc.constant("javascript:alert('XSS')"),
  fc.constant("<iframe src='javascript:alert(1)'></iframe>")
);

module.exports = {
  vehicleArbitrary,
  driverArbitrary,
  tripArbitrary,
  sqlInjectionArbitrary,
  xssArbitrary
};
```

### Unit Testing

#### Framework Selection

**JavaScript/Node.js**: Use **Jest**
```bash
npm install --save-dev jest supertest
```

#### Unit Test Examples

```javascript
// tests/unit/auth.test.js
const { login, register } = require('../../src/services/auth.service');
const bcrypt = require('bcrypt');

describe('Authentication Service', () => {
  
  test('should hash password before storing', async () => {
    const password = 'testPassword123';
    const user = await register({
      username: 'testuser',
      password,
      email: 'test@example.com',
      role: 'Dispatcher'
    });
    
    // Password should be hashed
    expect(user.password_hash).not.toBe(password);
    expect(user.password_hash).toMatch(/^\$2[aby]\$/); // bcrypt format
    
    // Should be verifiable
    const isValid = await bcrypt.compare(password, user.password_hash);
    expect(isValid).toBe(true);
  });

  test('should return token for valid credentials', async () => {
    const credentials = {
      username: 'testuser',
      password: 'testPassword123'
    };
    
    const result = await login(credentials);
    
    expect(result).toHaveProperty('token');
    expect(result).toHaveProperty('user');
    expect(result.user.username).toBe(credentials.username);
  });

  test('should reject invalid credentials with 401', async () => {
    await expect(
      login({ username: 'testuser', password: 'wrongpassword' })
    ).rejects.toMatchObject({
      status: 401,
      message: 'Invalid credentials'
    });
  });
});

// tests/unit/vehicle.test.js
describe('Vehicle Service', () => {
  
  test('should create vehicle with Available status', async () => {
    const vehicleData = {
      license_plate: 'TEST-123',
      max_capacity_kg: 5000,
      odometer_km: 0
    };
    
    const vehicle = await createVehicle(vehicleData);
    
    expect(vehicle.status).toBe('Available');
    expect(vehicle.license_plate).toBe(vehicleData.license_plate);
  });

  test('should reject duplicate license plate', async () => {
    const vehicleData = {
      license_plate: 'DUP-123',
      max_capacity_kg: 5000
    };
    
    await createVehicle(vehicleData);
    
    await expect(
      createVehicle(vehicleData)
    ).rejects.toMatchObject({
      status: 409,
      code: 'DUPLICATE_RESOURCE'
    });
  });

  test('should prevent deletion of vehicle with active trips', async () => {
    const vehicle = await createTestVehicle({ max_capacity_kg: 5000 });
    const driver = await createTestDriver({ license_expiry: futureDate() });
    await createTrip({
      vehicle_id: vehicle.id,
      driver_id: driver.id,
      cargo_weight_kg: 1000,
      origin: 'A',
      destination: 'B'
    });
    
    await expect(
      deleteVehicle(vehicle.id)
    ).rejects.toMatchObject({
      status: 400,
      message: expect.stringContaining('active trips')
    });
  });
});

// tests/integration/trip.integration.test.js
describe('Trip Creation Integration', () => {
  
  test('should create trip and update vehicle status atomically', async () => {
    const vehicle = await createTestVehicle({ 
      max_capacity_kg: 5000,
      status: 'Available'
    });
    const driver = await createTestDriver({ license_expiry: futureDate() });
    
    const trip = await createTrip({
      vehicle_id: vehicle.id,
      driver_id: driver.id,
      cargo_weight_kg: 3000,
      origin: 'Warehouse A',
      destination: 'Customer B'
    });
    
    // Verify trip created
    expect(trip).toBeDefined();
    expect(trip.status).toBe('In Progress');
    
    // Verify vehicle status updated
    const updatedVehicle = await getVehicle(vehicle.id);
    expect(updatedVehicle.status).toBe('On Trip');
  });

  test('should rollback on validation failure', async () => {
    const vehicle = await createTestVehicle({ 
      max_capacity_kg: 5000,
      status: 'Available'
    });
    const driver = await createTestDriver({ 
      license_expiry: '2023-01-01' // Expired
    });
    
    // Should fail validation
    await expect(
      createTrip({
        vehicle_id: vehicle.id,
        driver_id: driver.id,
        cargo_weight_kg: 3000,
        origin: 'A',
        destination: 'B'
      })
    ).rejects.toMatchObject({
      status: 400,
      message: 'Driver license expired'
    });
    
    // Vehicle status should remain Available
    const vehicleAfter = await getVehicle(vehicle.id);
    expect(vehicleAfter.status).toBe('Available');
  });
});
```

### Test Coverage Goals

- **Unit Tests**: 80% code coverage minimum
- **Property Tests**: All 45 correctness properties implemented
- **Integration Tests**: All critical workflows (trip creation, maintenance, expense tracking)
- **API Tests**: All endpoints with authentication and authorization checks

### Test Organization

```
tests/
├── unit/
│   ├── auth.test.js
│   ├── vehicle.test.js
│   ├── driver.test.js
│   ├── trip.test.js
│   ├── maintenance.test.js
│   └── expense.test.js
├── integration/
│   ├── trip-workflow.test.js
│   ├── maintenance-workflow.test.js
│   └── dashboard.test.js
├── properties/
│   ├── auth.property.test.js
│   ├── vehicle.property.test.js
│   ├── driver.property.test.js
│   ├── trip.property.test.js
│   ├── maintenance.property.test.js
│   ├── expense.property.test.js
│   └── validation.property.test.js
├── api/
│   ├── auth.api.test.js
│   ├── vehicle.api.test.js
│   └── trip.api.test.js
├── generators/
│   └── index.js
└── helpers/
    ├── setup.js
    ├── teardown.js
    └── testData.js
```

### Running Tests

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run property tests only
npm run test:properties

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- tests/properties/trip.property.test.js

# Run in watch mode (for development)
npm test -- --watch
```

### Test Database Setup

Use a separate test database to avoid affecting development data:

```javascript
// tests/helpers/setup.js
const { Pool } = require('pg');

let testPool;

beforeAll(async () => {
  testPool = new Pool({
    connectionString: process.env.TEST_DATABASE_URL
  });
  
  // Run migrations
  await runMigrations(testPool);
});

afterAll(async () => {
  await testPool.end();
});

beforeEach(async () => {
  // Clear all tables before each test
  await testPool.query('TRUNCATE users, vehicles, drivers, trips, maintenance, expenses RESTART IDENTITY CASCADE');
});
```

### Continuous Integration

For hackathon demo, tests should run quickly:
- Unit tests: < 30 seconds
- Property tests: < 2 minutes (100 iterations each)
- Integration tests: < 1 minute
- Total: < 4 minutes

```yaml
# .github/workflows/test.yml (if using GitHub)
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
        env:
          TEST_DATABASE_URL: postgresql://postgres:postgres@localhost:5432/fleet_test
```

