# Fleet Management System

A centralized digital platform for managing delivery fleet operations, replacing manual logbooks with real-time monitoring, automated validation, and comprehensive analytics.

## Features

- **User Authentication & Authorization**: Role-based access control (RBAC) for Fleet Managers, Dispatchers, Safety Officers, and Financial Analysts
- **Vehicle Registry Management**: Complete CRUD operations for fleet vehicles with status tracking
- **Trip Management**: Automated validation for cargo capacity, driver licenses, and vehicle availability
- **Maintenance Tracking**: Service history logging with automatic vehicle status updates
- **Expense & Fuel Tracking**: Financial analytics with ROI calculations and fuel efficiency metrics
- **Real-time Dashboard**: Live KPI updates via WebSocket for operational visibility
- **Driver Compliance**: License expiration tracking and safety score management

## Technology Stack

**Backend:**
- Node.js (v18+) with Express.js
- PostgreSQL (v14+) database
- JWT authentication with bcrypt password hashing
- WebSocket (ws) for real-time updates
- express-validator for input validation

**Development:**
- Jest for testing
- Nodemon for development
- Supertest for API testing

## Prerequisites

- Node.js v18 or higher
- PostgreSQL v14 or higher
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fleetflow
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and configure:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens (use a strong random string)
- `PORT`: Server port (default: 3000)

4. Create the PostgreSQL database:
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE fleet_management_dev;

# Exit psql
\q
```

5. Initialize the database schema:
```bash
psql -U postgres -d fleet_management_dev -f backend/src/db/schema.sql
```

## Running the Application

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

### Run Tests:
```bash
npm test
```

The server will start on the port specified in your `.env` file (default: 3000).

## API Documentation

The API follows RESTful conventions with the following base endpoints:

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Authenticate and receive JWT token
- `GET /api/auth/me` - Get current user profile

- `GET /api/vehicles` - List all vehicles
- `POST /api/vehicles` - Create new vehicle (Fleet Manager only)
- `GET /api/vehicles/:id` - Get vehicle details
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle

- `GET /api/drivers` - List all drivers
- `POST /api/drivers` - Create new driver
- `GET /api/drivers/:id` - Get driver details
- `PUT /api/drivers/:id` - Update driver
- `DELETE /api/drivers/:id` - Delete driver

- `GET /api/trips` - List all trips
- `POST /api/trips` - Create new trip (Dispatcher/Fleet Manager)
- `GET /api/trips/:id` - Get trip details
- `PUT /api/trips/:id/complete` - Mark trip as completed
- `DELETE /api/trips/:id` - Cancel trip

- `GET /api/maintenance` - List maintenance records
- `POST /api/maintenance` - Create maintenance record (Fleet Manager)
- `PUT /api/maintenance/:id/complete` - Complete maintenance

- `GET /api/expenses` - List expense records
- `POST /api/expenses` - Create expense record (Financial Analyst/Fleet Manager)

- `GET /api/dashboard/kpis` - Get real-time KPI metrics
- `GET /api/dashboard/alerts` - Get system alerts

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.js  # PostgreSQL connection pool
│   │   └── env.js       # Environment variable validation
│   ├── middleware/      # Express middleware
│   │   ├── auth.js      # JWT authentication
│   │   ├── rbac.js      # Role-based access control
│   │   ├── validation.js
│   │   ├── errorHandler.js
│   │   └── rateLimiter.js
│   ├── routes/          # API route definitions
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── models/          # Database queries
│   ├── utils/           # Utility functions
│   │   ├── logger.js    # Structured logging
│   │   ├── validators.js # Regex patterns
│   │   └── websocket.js # WebSocket manager
│   ├── db/
│   │   └── schema.sql   # Database schema
│   └── server.js        # Application entry point
```

## Database Schema

The system uses PostgreSQL with the following tables:
- `users` - User accounts with role-based access
- `vehicles` - Fleet vehicle registry
- `drivers` - Driver profiles with license tracking
- `trips` - Delivery trip records
- `maintenance` - Vehicle maintenance logs
- `expenses` - Financial expense tracking

See `backend/src/db/schema.sql` for complete schema definition with constraints and indexes.

## Development Guidelines

- All passwords are hashed using bcrypt before storage
- JWT tokens expire after 24 hours (configurable)
- Rate limiting: 100 requests per minute per IP
- All API responses follow the format:
  ```json
  {
    "success": true/false,
    "data": {...},
    "error": "error message"
  }
  ```

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control (RBAC)
- Input validation and sanitization
- SQL injection prevention via parameterized queries
- CORS configuration
- Rate limiting
- Environment-based configuration (no secrets in code)

## License

ISC
