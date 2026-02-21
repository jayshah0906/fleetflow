# Fleet Management System - Backend

## Overview

This is the backend API for the Fleet Management System, built with Node.js, Express, and PostgreSQL.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control (RBAC)
- **Vehicle Management**: CRUD operations for fleet vehicles with status tracking
- **Driver Management**: Driver profiles with license validation and safety scores
- **Trip Management**: Trip creation with automatic validation (cargo capacity, driver license, vehicle availability)
- **Maintenance Tracking**: Maintenance records with automatic vehicle status updates
- **Expense Tracking**: Financial tracking with fuel consumption monitoring
- **Dashboard Analytics**: Real-time KPIs and alerts
- **WebSocket Support**: Real-time updates for vehicle status changes, trip events, and KPI updates

## Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL 14+
- **Authentication**: JWT (jsonwebtoken), bcrypt
- **Real-time**: WebSocket (ws)
- **Validation**: express-validator
- **Security**: CORS, rate limiting, input sanitization

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ installed and running
- Database `fleet_management_dev` created

### Installation

1. Install dependencies:
```bash
cd backend
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. Run database schema:
```bash
psql -U your_username -d fleet_management_dev -f backend/src/db/schema.sql
```

4. Load seed data:
```bash
psql -U your_username -d fleet_management_dev -f backend/src/db/seed.sql
```

5. Start the server:
```bash
npm start
```

The server will start on `http://localhost:3000`

## Test Credentials

Use these credentials to test different user roles:

| Username | Password | Role |
|----------|----------|------|
| admin | password123 | Fleet Manager |
| dispatcher1 | password123 | Dispatcher |
| safety1 | password123 | Safety Officer |
| finance1 | password123 | Financial Analyst |

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user profile

### Vehicles
- `GET /api/vehicles` - List all vehicles (with pagination)
- `GET /api/vehicles/:id` - Get vehicle details
- `POST /api/vehicles` - Create vehicle (Fleet Manager only)
- `PUT /api/vehicles/:id` - Update vehicle (Fleet Manager only)
- `DELETE /api/vehicles/:id` - Delete vehicle (Fleet Manager only)

### Drivers
- `GET /api/drivers` - List all drivers (with pagination)
- `GET /api/drivers/:id` - Get driver details
- `POST /api/drivers` - Create driver (Fleet Manager, Safety Officer)
- `PUT /api/drivers/:id` - Update driver (Fleet Manager, Safety Officer)
- `DELETE /api/drivers/:id` - Delete driver (Fleet Manager only)

### Trips
- `GET /api/trips` - List all trips (with pagination and filters)
- `GET /api/trips/:id` - Get trip details
- `POST /api/trips` - Create trip (Dispatcher, Fleet Manager)
- `PUT /api/trips/:id/complete` - Complete trip (Dispatcher, Fleet Manager)
- `DELETE /api/trips/:id` - Cancel trip (Dispatcher, Fleet Manager)

### Maintenance
- `GET /api/maintenance` - List maintenance records
- `GET /api/maintenance/:id` - Get maintenance details
- `POST /api/maintenance` - Create maintenance (Fleet Manager)
- `PUT /api/maintenance/:id/complete` - Complete maintenance (Fleet Manager)

### Expenses
- `GET /api/expenses` - List expense records
- `GET /api/expenses/:id` - Get expense details
- `POST /api/expenses` - Create expense (Financial Analyst, Fleet Manager)

### Dashboard
- `GET /api/dashboard/kpis` - Get dashboard KPIs
- `GET /api/dashboard/alerts` - Get system alerts
- `GET /api/dashboard/financial` - Get financial summary

## Testing Examples

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'
```

### Get Vehicles (with authentication)
```bash
TOKEN="your_jwt_token_here"
curl http://localhost:3000/api/vehicles \
  -H "Authorization: Bearer $TOKEN"
```

### Create Trip
```bash
TOKEN="your_jwt_token_here"
curl -X POST http://localhost:3000/api/trips \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "driver_id": 1,
    "vehicle_id": 1,
    "origin": "Warehouse A",
    "destination": "Customer Site",
    "cargo_weight_kg": 2500
  }'
```

## Validation Rules

### Trip Creation
- Cargo weight must not exceed vehicle capacity
- Driver license must not be expired
- Vehicle status must be "Available"

### Driver Management
- License expiry date must be in the future
- Safety score must be between 0 and 100

### Expense Tracking
- Fuel expenses require `fuel_liters` field
- All amounts must be positive

## WebSocket Events

Connect to `ws://localhost:3000` with JWT token in query parameter:
```javascript
const ws = new WebSocket('ws://localhost:3000?token=your_jwt_token');
```

### Event Types
- `vehicle_status_changed` - Vehicle status updated
- `trip_created` - New trip created
- `trip_completed` - Trip completed
- `kpi_update` - Dashboard KPIs updated
- `maintenance_alert` - Maintenance scheduled or due

## Database Schema

The system uses 6 main tables:
- `users` - User accounts with roles
- `vehicles` - Fleet vehicles
- `drivers` - Driver profiles
- `trips` - Trip records
- `maintenance` - Maintenance logs
- `expenses` - Expense records

All tables include proper foreign key constraints, check constraints, and indexes for performance.

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control (RBAC)
- Input sanitization (XSS prevention)
- SQL injection prevention (parameterized queries)
- Rate limiting (100 requests/minute per IP)
- CORS configuration

## Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

## License

MIT
