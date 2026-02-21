# Implementation Plan: Fleet Management System

## Overview

This is an 8-hour hackathon implementation plan for a 2-person team. Person 1 (Backend Lead) handles ALL backend work including database, API, auth, and WebSocket. Person 2 (Frontend Lead) handles ALL frontend work including React UI, API integration, and real-time updates. The critical integration point is at Hour 2 when the API contract is shared, allowing frontend to start with mock data and switch to real endpoints.

## Critical Timeline

- **Hours 0-2**: Parallel development (Backend: database + auth, Frontend: setup + mock UI)
- **Hour 2**: API contract shared - Frontend switches from mock to real endpoints
- **Hours 2-5**: Backend completes all endpoints + WebSocket, Frontend builds all pages + integration
- **Hours 5-7**: Integration testing and bug fixes together
- **Hours 7-8**: Polish and demo prep

## Team Roles

- **Person 1 (You - Backend Lead)**: Database schema, models, authentication, all API endpoints, validation, RBAC, WebSocket server, business logic
- **Person 2 (Frontend Friend)**: React setup, all UI components, all pages, API integration, WebSocket client, responsive design

## Technology Stack

- Backend: Node.js 18+, Express.js, PostgreSQL 14+, pg, jsonwebtoken, bcrypt, ws
- Frontend: React 18+, React Router v6, Axios, native WebSocket API
- Development: Git, npm, dotenv

---

## Person 1 (You): Backend Lead - ALL Backend Work

### Hours 0-2: Database + Authentication (CRITICAL PATH)

- [x] 1.1 Initialize project and database setup (Hour 0, 20 min)
  - Create project root directory structure
  - Initialize npm project: `npm init -y`
  - Create `.gitignore` file (node_modules, .env, build artifacts)
  - Install PostgreSQL locally or use Docker
  - Create development database: `fleet_management_dev`
  - Create `.env.example` with DATABASE_URL, JWT_SECRET, PORT
  - Install backend dependencies: express, pg, jsonwebtoken, bcrypt, dotenv, ws, express-validator, cors
  - Install dev dependencies: jest, supertest, nodemon
  - Create `backend/` directory structure (src/config, middleware, routes, controllers, services, models, utils)
  - _Requirements: 16.2, 16.3, 17.1, 17.5, 18.1, 18.3, 17.3, 17.4_

- [ ] 1.2 Create complete database schema (Hour 0-1, 40 min)
  - Create `backend/src/db/schema.sql` file
  - Define all 6 tables: users, vehicles, drivers, trips, maintenance, expenses
  - Add all foreign key constraints with ON DELETE rules
  - Add all CHECK constraints (positive values, status enums, date validations)
  - Add all UNIQUE constraints (license plates, driver licenses, usernames, emails)
  - Add all NOT NULL constraints on required fields
  - Create all indexes on foreign keys and frequently queried columns
  - Create update_updated_at trigger function and apply to vehicles/drivers tables
  - Run schema.sql to create all tables
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 3.7, 8.6_

- [ ] 1.3 Create database connection and all models (Hour 1-1.5, 30 min)
  - Create `backend/src/config/database.js` with pg Pool (max 20 connections)
  - Create `backend/src/models/user.model.js` (create, findByUsername, findById)
  - Create `backend/src/models/vehicle.model.js` (CRUD + hasActiveTrips)
  - Create `backend/src/models/driver.model.js` (CRUD + isLicenseValid)
  - Create `backend/src/models/trip.model.js` (CRUD with transactions)
  - Create `backend/src/models/maintenance.model.js` (CRUD with transactions)
  - Create `backend/src/models/expense.model.js` (CRUD + aggregations)
  - Use parameterized queries for all operations
  - _Requirements: 13.7, 16.2, 1.1, 1.2, 11.2, 3.1-3.6, 8.1-8.4, 4.1-4.7, 6.1-6.4, 7.1-7.4_

- [ ] 1.4 Implement authentication service and middleware (Hour 1.5-2, 30 min)
  - Create `backend/src/config/env.js` (load and validate environment variables)
  - Create `backend/src/services/auth.service.js` (register with bcrypt, login with JWT)
  - Create `backend/src/middleware/auth.js` (verifyToken middleware)
  - Create `backend/src/middleware/rbac.js` (requireRole middleware)
  - Create `backend/src/controllers/auth.controller.js`
  - Create `backend/src/routes/auth.routes.js` (POST /register, /login, GET /me)
  - Set JWT expiration to 24 hours
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

### Hour 2: API Contract Handoff (CRITICAL MILESTONE)

- [ ] 1.5 Document API contract and share with frontend (Hour 2, 15 min)
  - Create `API_CONTRACT.md` with all endpoints:
    - Auth: POST /api/auth/register, /login, GET /api/auth/me
    - Vehicles: GET /api/vehicles, GET /api/vehicles/:id, POST /api/vehicles, PUT /api/vehicles/:id, DELETE /api/vehicles/:id
    - Drivers: GET /api/drivers, GET /api/drivers/:id, POST /api/drivers, PUT /api/drivers/:id, DELETE /api/drivers/:id
    - Trips: GET /api/trips, GET /api/trips/:id, POST /api/trips, PUT /api/trips/:id/complete, DELETE /api/trips/:id
    - Maintenance: GET /api/maintenance, POST /api/maintenance, PUT /api/maintenance/:id/complete
    - Expenses: GET /api/expenses, POST /api/expenses
    - Dashboard: GET /api/dashboard/kpis, GET /api/dashboard/alerts
  - Document request/response formats for each endpoint
  - Document authentication header format: `Authorization: Bearer <token>`
  - Document error response format
  - Document WebSocket events: vehicle_status_changed, trip_created, trip_completed, kpi_update
  - Share with Person 2 so they can start API integration
  - _Requirements: All API requirements_

### Hours 2-5: Complete All Backend Services

- [ ] 1.6 Create validation and error handling middleware (Hour 2-2.5, 30 min)
  - Create `backend/src/middleware/validation.js`
  - Create `backend/src/utils/validators.js` (license plate regex, email regex, XSS sanitization)
  - Create `backend/src/middleware/errorHandler.js` (AppError class, global error handler)
  - Create `backend/src/middleware/rateLimiter.js` (100 req/min per IP)
  - Create `backend/src/utils/logger.js` (structured logging for auth, errors, validation)
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.9, 15.1-15.6_

- [ ] 1.7 Implement vehicle service and routes (Hour 2.5-3, 30 min)
  - Create `backend/src/services/vehicle.service.js` with business logic
  - Create `backend/src/controllers/vehicle.controller.js`
  - Create `backend/src/routes/vehicle.routes.js`
  - Implement all CRUD endpoints with pagination and filters
  - Add validation: unique license plate, positive capacity, odometer only increases
  - Add RBAC: Fleet Manager only for create/update/delete
  - Check active trips before deletion
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [ ] 1.8 Implement driver service and routes (Hour 3-3.5, 30 min)
  - Create `backend/src/services/driver.service.js`
  - Create `backend/src/controllers/driver.controller.js`
  - Create `backend/src/routes/driver.routes.js`
  - Implement all CRUD endpoints with pagination and expiring_soon filter
  - Add validation: future license expiry, safety score 0-100
  - Add RBAC: Fleet Manager and Safety Officer for create/update
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ] 1.9 Implement trip service and routes (Hour 3.5-4.5, 60 min)
  - Create `backend/src/services/trip.service.js`
  - Create `backend/src/controllers/trip.controller.js`
  - Create `backend/src/routes/trip.routes.js`
  - Implement all endpoints with pagination and filters
  - Validate cargo weight <= vehicle capacity (return 400 with message)
  - Validate driver license not expired (return 400 with message)
  - Validate vehicle status is "Available"
  - Update vehicle status to "On Trip" in transaction
  - Implement complete and cancel endpoints
  - Add RBAC: Dispatcher and Fleet Manager
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 5.1, 5.2, 5.3_

- [ ] 1.10 Implement maintenance and expense services (Hour 4.5-5, 30 min)
  - Create `backend/src/services/maintenance.service.js` and routes
  - Create `backend/src/services/expense.service.js` and routes
  - Implement maintenance endpoints with vehicle status updates
  - Implement expense endpoints with fuel_liters validation
  - Add RBAC: Fleet Manager for maintenance, Financial Analyst for expenses
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 7.1, 7.2, 7.5_

- [ ] 1.11 Implement dashboard and analytics (Hour 5-5.5, 30 min)
  - Create `backend/src/services/analytics.service.js`
  - Create `backend/src/controllers/dashboard.controller.js`
  - Create `backend/src/routes/dashboard.routes.js`
  - Implement GET /api/dashboard/kpis (vehicle counts, utilization rate)
  - Implement GET /api/dashboard/alerts (license expiry, maintenance due)
  - Calculate utilization rate: (vehicles on trip / total available) * 100
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 8.4, 6.6_

- [ ] 1.12 Implement WebSocket server (Hour 5.5-6, 30 min)
  - Create `backend/src/utils/websocket.js`
  - Initialize WebSocket server with ws library
  - Implement JWT authentication for WebSocket connections
  - Implement broadcast() method for events
  - Define event types: vehicle_status_changed, trip_created, trip_completed, kpi_update
  - Integrate broadcasts in trip, maintenance, and vehicle services
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 2.5, 5.4_

- [ ] 1.13 Create main server and seed data (Hour 6-6.5, 30 min)
  - Create `backend/src/server.js`
  - Configure Express app with CORS, body parser, rate limiter
  - Mount all route modules
  - Configure error handler middleware (must be last)
  - Start HTTP server and WebSocket server
  - Create `backend/src/db/seed.sql` with test users, vehicles, drivers, trips
  - Document test credentials in README
  - _Requirements: 11.8, 18.2, 17.4_

- [ ] 1.14 Backend testing and checkpoint (Hour 6.5-7, 30 min)
  - Start backend server and verify all endpoints respond
  - Test authentication flow with Postman/curl
  - Test trip creation with all validations
  - Test WebSocket connection and events
  - Load seed data
  - Fix any critical bugs
  - Ensure backend is fully functional for frontend integration
  - _Requirements: All backend requirements_

---

## Person 2 (Frontend Friend): Frontend Lead - ALL Frontend Work

### Hours 0-2: React Setup + Mock UI (Parallel with Backend)

- [ ] 2.1 Initialize React project (Hour 0, 30 min)
  - Create `frontend/` directory
  - Initialize React app: `npx create-react-app frontend` or use Vite
  - Install dependencies: react-router-dom, axios
  - Create directory structure (components, pages, services, hooks, context, utils)
  - Create `.env.example` with REACT_APP_API_URL, REACT_APP_WS_URL
  - Configure proxy to backend in development
  - _Requirements: 17.3, 17.4, 18.3_

- [ ] 2.2 Create common UI components (Hour 0.5-1.5, 60 min)
  - Create `frontend/src/components/common/Button.jsx`
  - Create `frontend/src/components/common/Input.jsx` with validation display
  - Create `frontend/src/components/common/Table.jsx` with pagination
  - Create `frontend/src/components/common/Modal.jsx`
  - Create `frontend/src/components/common/LoadingSpinner.jsx`
  - Add basic CSS styling for each component
  - _Requirements: 14.2, 14.3, 14.4, 14.5, 14.6_

- [ ] 2.3 Create layout and authentication UI (Hour 1.5-2, 30 min)
  - Create `frontend/src/components/layout/Header.jsx` with user info and logout
  - Create `frontend/src/components/layout/Sidebar.jsx` with navigation menu
  - Create `frontend/src/components/layout/Layout.jsx` wrapper
  - Create `frontend/src/pages/LoginPage.jsx` with form
  - Add responsive CSS for mobile, tablet, desktop
  - Use mock data for now (no API calls yet)
  - _Requirements: 14.1, 1.2, 1.3_

### Hour 2: Receive API Contract and Setup Integration

- [ ] 2.4 Create API service layer (Hour 2, 30 min)
  - Review API_CONTRACT.md from Person 1
  - Create `frontend/src/services/api.js` with Axios instance
  - Add request interceptor to attach JWT token from localStorage
  - Add response interceptor for error handling (401 redirect to login)
  - Create `frontend/src/context/AuthContext.jsx` with login/logout/register
  - Create `frontend/src/hooks/useAuth.js` hook
  - Create `frontend/src/services/auth.service.js` with API calls
  - _Requirements: 1.2, 1.3_

### Hours 2-5: Build All Pages with API Integration

- [ ] 2.5 Implement login and authentication flow (Hour 2.5-3, 30 min)
  - Update LoginPage to call real auth API
  - Store JWT token in localStorage
  - Display loading spinner during submission
  - Display error messages from API
  - Redirect to dashboard on successful login
  - Add form validation (required fields)
  - _Requirements: 1.2, 1.3, 14.2, 14.3, 14.4, 14.5_

- [ ] 2.6 Create vehicle pages and integration (Hour 3-4, 60 min)
  - Create `frontend/src/services/vehicle.service.js` with all API calls
  - Create `frontend/src/components/vehicles/VehicleList.jsx` with table and pagination
  - Create `frontend/src/components/vehicles/VehicleForm.jsx` for create/edit
  - Create `frontend/src/pages/VehiclesPage.jsx`
  - Display vehicle status with color coding
  - Handle validation errors from API
  - Add loading states
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [ ] 2.7 Create driver pages and integration (Hour 4-4.5, 30 min)
  - Create `frontend/src/services/driver.service.js` with all API calls
  - Create `frontend/src/components/drivers/DriverList.jsx`
  - Create `frontend/src/components/drivers/DriverForm.jsx`
  - Create `frontend/src/pages/DriversPage.jsx`
  - Highlight drivers with expiring licenses (within 30 days)
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ] 2.8 Create trip pages and integration (Hour 4.5-5.5, 60 min)
  - Create `frontend/src/services/trip.service.js` with all API calls
  - Create `frontend/src/components/trips/TripList.jsx`
  - Create `frontend/src/components/trips/TripForm.jsx` with dropdowns for driver/vehicle selection
  - Create `frontend/src/pages/TripsPage.jsx`
  - Display validation errors inline (cargo capacity, license expiry)
  - Add "Complete Trip" button for in-progress trips
  - Handle all error cases gracefully
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.8, 5.1, 5.2, 14.5_

- [ ] 2.9 Create dashboard with KPIs (Hour 5.5-6, 30 min)
  - Create `frontend/src/services/dashboard.service.js` with API calls
  - Create `frontend/src/components/dashboard/KPICard.jsx`
  - Create `frontend/src/components/dashboard/StatusChart.jsx` (simple counts)
  - Create `frontend/src/pages/DashboardPage.jsx`
  - Display vehicle status counts, utilization rate, maintenance alerts, pending trips
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 2.10 Create maintenance and expense pages (Hour 6-6.5, 30 min)
  - Create `frontend/src/services/maintenance.service.js` and `expense.service.js`
  - Create `frontend/src/pages/MaintenancePage.jsx` with list and form
  - Create `frontend/src/pages/ExpensesPage.jsx` with list and form
  - Add "Complete Maintenance" button
  - Validate fuel_liters required for Fuel expenses
  - _Requirements: 6.1, 6.2, 6.4, 7.1, 7.2_

- [ ] 2.11 Implement WebSocket for real-time updates (Hour 6.5-7, 30 min)
  - Create `frontend/src/services/websocket.service.js`
  - Create `frontend/src/hooks/useWebSocket.js`
  - Connect to WebSocket server with JWT token
  - Listen for events: vehicle_status_changed, trip_created, trip_completed, kpi_update
  - Implement reconnection logic on disconnect
  - Update dashboard KPIs when kpi_update event received
  - Show toast notifications for trip events
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 2.5, 2.6_

- [ ] 2.12 Create routing and final polish (Hour 7-7.5, 30 min)
  - Create `frontend/src/App.jsx` with React Router
  - Define all routes with protected route wrapper
  - Redirect to login if not authenticated
  - Update Sidebar with navigation links
  - Add error boundaries for graceful error handling
  - Add success/error toast notifications
  - Add empty states for lists with no data
  - _Requirements: 1.2, 1.3, 14.1_

---

## Team Integration Tasks (Hours 5-8)

- [ ] 3.1 Hour 5 Integration Checkpoint (Both team members)
  - Backend: Confirm all endpoints working and seed data loaded
  - Frontend: Confirm all pages built and API calls working
  - Test end-to-end authentication flow together
  - Test vehicle CRUD operations together
  - Test trip creation with validation errors
  - Identify and fix any API contract mismatches
  - _Requirements: 1.2, 1.3, 3.1, 4.1_

- [ ] 3.2 Hours 5-7: Integration testing and bug fixes (Both team members)
  - Test complete user workflows:
    - Login as Fleet Manager
    - Create a vehicle
    - Create a driver
    - Create a trip (test validation errors: cargo capacity, license expiry)
    - Complete a trip
    - Log maintenance
    - View dashboard with real-time updates
  - Test WebSocket connection and events across multiple browser tabs
  - Test all role-based access controls
  - Test responsive design on mobile, tablet, desktop
  - Fix any bugs discovered during testing
  - _Requirements: 1.4, 1.5, 2.5, 13.2, 13.3, 14.1_

- [ ] 3.3 Hours 7-8: Final polish and demo prep (Both team members)
  - Add responsive styling polish
  - Add loading states to all data fetching
  - Verify all error messages display correctly
  - Test edge cases (empty lists, network errors, invalid tokens)
  - Prepare demo script with test credentials
  - Create README.md with:
    - Project overview and features
    - Technology stack
    - Setup instructions (database, backend, frontend)
    - Environment variables required
    - How to run the application
    - Test credentials for demo
    - Known limitations
  - Practice demo flow
  - _Requirements: 17.4, 14.1, 14.2, 14.3_

---

## Notes

- Tasks marked with `*` are optional and can be skipped if time is tight
- Each task references specific requirements for traceability
- Hour estimates are approximate - adjust based on actual progress
- Backend must be fully functional by Hour 5 for frontend integration
- Use Git commits frequently with descriptive messages
- Communicate blockers immediately
- Test incrementally - don't wait until the end

## Priority Matrix

### Must Have (Core Demo Features)
- Authentication and RBAC (Tasks 1.4, 2.4, 2.5)
- Database schema and models (Tasks 1.1, 1.2, 1.3)
- Vehicle CRUD (Tasks 1.7, 2.6)
- Trip creation with validation (Tasks 1.9, 2.8)
- Dashboard with KPIs (Tasks 1.11, 2.9)
- Basic real-time updates (Tasks 1.12, 2.11)

### Should Have (Enhanced Demo)
- Driver management (Tasks 1.8, 2.7)
- Maintenance tracking (Tasks 1.10, 2.10)
- Expense tracking (Tasks 1.10, 2.10)
- Seed data for demo (Task 1.13)
- Responsive UI (Task 2.12)

### Nice to Have (If Time Permits)
- Advanced analytics and charts
- Email notifications for alerts
- CSV export for reports

## Risk Mitigation

### Backend Delays (Person 1)
- If behind schedule, prioritize auth + vehicles + trips + dashboard
- Skip maintenance and expense endpoints initially
- WebSocket can be simplified to just vehicle status updates
- Seed data is optional - can use Postman/curl for demo

### Frontend Delays (Person 2)
- If behind schedule, prioritize login + dashboard + vehicles + trips
- Use simple HTML forms instead of fancy components
- Skip responsive design polish
- Real-time updates can be manual refresh initially

### Integration Issues
- If API contract changes, communicate immediately
- Frontend can use mock data temporarily if backend is delayed
- Backend can test with Postman/curl if frontend is delayed

## Communication Protocol

- **Hour 0**: Kickoff - confirm task assignments and tech stack
- **Hour 2**: API contract handoff - Person 1 shares API_CONTRACT.md with Person 2
- **Hour 5**: Integration checkpoint - test workflows together
- **Hour 7**: Final polish and demo prep
- **Continuous**: Slack/Discord for immediate blockers and questions
  - Create `backend/src/db/schema.sql` file
  - Define all 6 tables: users, vehicles, drivers, trips, maintenance, expenses
  - Add all foreign key constraints with ON DELETE rules
  - Add all CHECK constraints (positive values, status enums, date validations)
  - Add all UNIQUE constraints (license plates, driver licenses, usernames, emails)
  - Add all NOT NULL constraints on required fields
  - Create all indexes on foreign keys and frequently queried columns
  - Create update_updated_at trigger function and apply to vehicles/drivers tables
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 3.7, 8.6_

- [ ] 1.3 Create database connection pool module (Hour 1-1.5, 30 min)
  - Create `backend/src/config/database.js`
  - Initialize pg Pool with connection string from environment
  - Configure connection pool settings (max 20 connections)
  - Add connection error handling and logging
  - Export pool instance for use in models
  - Test database connectivity
  - _Requirements: 13.7, 16.2_

- [ ] 1.4 Implement User model with authentication queries (Hour 1.5-2, 30 min)
  - Create `backend/src/models/user.model.js`
  - Implement create() method with parameterized queries
  - Implement findByUsername() for login
  - Implement findById() for token verification
  - Use parameterized queries to prevent SQL injection
  - _Requirements: 1.1, 1.2, 11.2_

- [ ] 1.5 Implement Vehicle model with CRUD operations (Hour 2-2.5, 30 min)
  - Create `backend/src/models/vehicle.model.js`
  - Implement create(), findAll(), findById(), update(), delete()
  - Implement hasActiveTrips() helper for deletion validation
  - Add pagination support in findAll() with offset/limit
  - Use parameterized queries for all operations
  - _Requirements: 3.1, 3.2, 3.4, 3.5, 3.6, 13.6_

- [ ] 1.6 Implement Driver model with validation queries (Hour 2.5-3, 30 min)
  - Create `backend/src/models/driver.model.js`
  - Implement create(), findAll(), findById(), update(), delete()
  - Implement isLicenseValid() helper for trip validation
  - Add expiring_soon filter in findAll() (30 days)
  - Use parameterized queries for all operations
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 4.3_
