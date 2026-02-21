# Requirements Document

## Introduction

This document specifies the requirements for a Fleet Management System designed for an 8-hour hackathon. The system replaces manual logbooks with a centralized digital platform that optimizes delivery fleet lifecycle management, monitors driver safety, and tracks financial performance. The system serves Fleet Managers, Dispatchers, Safety Officers, and Financial Analysts with role-based access control and real-time operational visibility.

## Glossary

- **Fleet_Management_System**: The complete web application for managing delivery fleet operations
- **Vehicle**: A delivery asset with license plate, capacity, odometer, and operational status
- **Driver**: A person authorized to operate vehicles with license and safety profile
- **Trip**: A cargo delivery assignment linking driver, vehicle, origin, destination, and cargo weight
- **Maintenance_Log**: A record of preventative or reactive vehicle service
- **Expense_Record**: A financial transaction associated with a vehicle (fuel, repairs, tolls)
- **User**: An authenticated person with one of four roles: Fleet Manager, Dispatcher, Safety Officer, or Financial Analyst
- **Vehicle_Status**: One of four states: Available, On Trip, In Shop, or Retired
- **Driver_License**: A credential with expiration date that must be valid for trip assignment
- **Cargo_Weight**: The weight in kilograms of goods being transported
- **Max_Load_Capacity**: The maximum cargo weight a vehicle can safely transport
- **Odometer**: The cumulative distance traveled by a vehicle in kilometers
- **Safety_Score**: A numerical rating of driver performance based on incidents and compliance
- **Utilization_Rate**: Percentage of time vehicles spend on active trips vs available time
- **Fuel_Efficiency**: Distance traveled per unit of fuel consumed (km/L)
- **Vehicle_ROI**: Return on investment calculated from revenue minus operational costs
- **RBAC**: Role-Based Access Control restricting features by user role
- **Real_Time_Update**: Live data synchronization using WebSockets or Server-Sent Events

## Requirements

### Requirement 1: User Authentication and Authorization

**User Story:** As a User, I want to securely log in with role-based permissions, so that I can access only the features relevant to my responsibilities.

#### Acceptance Criteria

1. THE Fleet_Management_System SHALL hash all passwords using bcrypt before storage
2. WHEN a User submits valid credentials, THE Fleet_Management_System SHALL generate a JWT or session token
3. WHEN a User submits invalid credentials, THE Fleet_Management_System SHALL return HTTP 401 and reject access
4. THE Fleet_Management_System SHALL enforce RBAC for all protected endpoints
5. WHEN a User attempts to access a feature without proper role permissions, THE Fleet_Management_System SHALL return HTTP 403
6. THE Fleet_Management_System SHALL store no credentials in source code or configuration files
7. THE Fleet_Management_System SHALL load authentication secrets from environment variables

### Requirement 2: Command Center Dashboard

**User Story:** As a Fleet Manager, I want a real-time dashboard showing fleet KPIs, so that I can monitor operational health at a glance.

#### Acceptance Criteria

1. THE Fleet_Management_System SHALL display the count of vehicles in each Vehicle_Status
2. THE Fleet_Management_System SHALL display the count of maintenance alerts for vehicles requiring service
3. THE Fleet_Management_System SHALL calculate and display the current Utilization_Rate
4. THE Fleet_Management_System SHALL display the count of pending cargo assignments
5. WHEN any vehicle or trip data changes, THE Fleet_Management_System SHALL push Real_Time_Updates to connected dashboard clients
6. THE Fleet_Management_System SHALL refresh dashboard metrics within 2 seconds of data changes

### Requirement 3: Vehicle Registry Management

**User Story:** As a Fleet Manager, I want to create, read, update, and delete vehicle records, so that I can maintain an accurate asset inventory.

#### Acceptance Criteria

1. THE Fleet_Management_System SHALL store vehicle records with license plate, Max_Load_Capacity, Odometer, and Vehicle_Status
2. WHEN a Fleet Manager creates a vehicle, THE Fleet_Management_System SHALL validate that the license plate is unique
3. WHEN a Fleet Manager creates a vehicle, THE Fleet_Management_System SHALL set the initial Vehicle_Status to Available
4. THE Fleet_Management_System SHALL prevent deletion of vehicles with active trips
5. WHEN a Fleet Manager updates a vehicle, THE Fleet_Management_System SHALL validate that Max_Load_Capacity is a positive number
6. THE Fleet_Management_System SHALL validate that Odometer values only increase
7. THE Fleet_Management_System SHALL enforce foreign key constraints between vehicles and trips in the database

### Requirement 4: Trip Creation and Validation

**User Story:** As a Dispatcher, I want to create trips with automatic validation, so that I can safely assign cargo to appropriate vehicles and drivers.

#### Acceptance Criteria

1. THE Fleet_Management_System SHALL store trip records with driver, vehicle, origin, destination, Cargo_Weight, and timestamps
2. WHEN a Dispatcher creates a trip, THE Fleet_Management_System SHALL validate that Cargo_Weight is less than or equal to the vehicle's Max_Load_Capacity
3. WHEN a Dispatcher creates a trip, THE Fleet_Management_System SHALL validate that the assigned Driver_License is not expired
4. WHEN a Dispatcher creates a trip with an expired Driver_License, THE Fleet_Management_System SHALL return HTTP 400 with error message "Driver license expired"
5. WHEN a Dispatcher creates a trip, THE Fleet_Management_System SHALL validate that the vehicle Vehicle_Status is Available
6. WHEN a trip is successfully created, THE Fleet_Management_System SHALL update the vehicle Vehicle_Status to On Trip
7. THE Fleet_Management_System SHALL execute trip creation and status update within a single database transaction
8. WHEN a Dispatcher creates a trip with invalid Cargo_Weight, THE Fleet_Management_System SHALL return HTTP 400 with error message "Cargo exceeds vehicle capacity"

### Requirement 5: Trip Completion Workflow

**User Story:** As a Dispatcher, I want to mark trips as completed, so that vehicles become available for new assignments.

#### Acceptance Criteria

1. WHEN a Dispatcher marks a trip as completed, THE Fleet_Management_System SHALL record the completion timestamp
2. WHEN a Dispatcher marks a trip as completed, THE Fleet_Management_System SHALL update the vehicle Vehicle_Status to Available
3. THE Fleet_Management_System SHALL execute trip completion and status update within a single database transaction
4. WHEN a trip is completed, THE Fleet_Management_System SHALL push Real_Time_Updates to the Command Center Dashboard

### Requirement 6: Maintenance Log Management

**User Story:** As a Fleet Manager, I want to log vehicle maintenance, so that I can track service history and trigger automatic status changes.

#### Acceptance Criteria

1. THE Fleet_Management_System SHALL store Maintenance_Log records with vehicle, service type, cost, date, and description
2. WHEN a Fleet Manager creates a Maintenance_Log, THE Fleet_Management_System SHALL automatically update the vehicle Vehicle_Status to In Shop
3. THE Fleet_Management_System SHALL execute maintenance log creation and status update within a single database transaction
4. WHEN a Fleet Manager marks maintenance as completed, THE Fleet_Management_System SHALL update the vehicle Vehicle_Status to Available
5. THE Fleet_Management_System SHALL prevent trip assignment to vehicles with Vehicle_Status In Shop
6. THE Fleet_Management_System SHALL display maintenance alerts for vehicles exceeding preventative maintenance intervals

### Requirement 7: Expense and Fuel Tracking

**User Story:** As a Financial Analyst, I want to log expenses and fuel purchases per vehicle, so that I can calculate operational costs and efficiency metrics.

#### Acceptance Criteria

1. THE Fleet_Management_System SHALL store Expense_Record entries with vehicle, expense type, amount, date, and fuel quantity
2. WHEN a Financial Analyst logs a fuel expense, THE Fleet_Management_System SHALL require fuel quantity in liters
3. THE Fleet_Management_System SHALL calculate Fuel_Efficiency as distance traveled divided by fuel consumed
4. THE Fleet_Management_System SHALL calculate total operational cost per vehicle by summing all Expense_Record amounts
5. THE Fleet_Management_System SHALL validate that expense amounts are positive numbers
6. THE Fleet_Management_System SHALL associate each Expense_Record with exactly one vehicle via foreign key constraint

### Requirement 8: Driver Profile and Compliance Management

**User Story:** As a Safety Officer, I want to manage driver profiles with license expiration and safety scores, so that I can ensure only compliant drivers are assigned to trips.

#### Acceptance Criteria

1. THE Fleet_Management_System SHALL store driver records with name, Driver_License number, license expiration date, and Safety_Score
2. THE Fleet_Management_System SHALL validate Driver_License expiration date is in the future when creating or updating drivers
3. WHEN a Safety Officer updates a driver, THE Fleet_Management_System SHALL validate that Safety_Score is between 0 and 100
4. THE Fleet_Management_System SHALL display alerts for drivers with licenses expiring within 30 days
5. THE Fleet_Management_System SHALL prevent trip assignment to drivers with expired licenses
6. THE Fleet_Management_System SHALL enforce foreign key constraints between drivers and trips in the database

### Requirement 9: Vehicle Lifecycle Status Management

**User Story:** As a Fleet Manager, I want vehicles to transition through defined statuses, so that I can track asset lifecycle and availability.

#### Acceptance Criteria

1. THE Fleet_Management_System SHALL support exactly four Vehicle_Status values: Available, On Trip, In Shop, and Retired
2. WHEN a vehicle is created, THE Fleet_Management_System SHALL set Vehicle_Status to Available
3. WHEN a trip is assigned, THE Fleet_Management_System SHALL transition Vehicle_Status from Available to On Trip
4. WHEN a trip is completed, THE Fleet_Management_System SHALL transition Vehicle_Status from On Trip to Available
5. WHEN maintenance is logged, THE Fleet_Management_System SHALL transition Vehicle_Status to In Shop
6. WHEN a Fleet Manager retires a vehicle, THE Fleet_Management_System SHALL transition Vehicle_Status to Retired
7. THE Fleet_Management_System SHALL prevent trip assignment to vehicles with Vehicle_Status other than Available
8. THE Fleet_Management_System SHALL enforce Vehicle_Status as a database constraint

### Requirement 10: Financial Analytics and Reporting

**User Story:** As a Financial Analyst, I want to generate operational reports with export capability, so that I can analyze fleet performance and costs.

#### Acceptance Criteria

1. THE Fleet_Management_System SHALL calculate Vehicle_ROI as revenue minus total operational costs per vehicle
2. THE Fleet_Management_System SHALL display total fuel spend aggregated by vehicle
3. THE Fleet_Management_System SHALL display maintenance costs aggregated by vehicle
4. THE Fleet_Management_System SHALL calculate average Fuel_Efficiency across the fleet
5. THE Fleet_Management_System SHALL export financial reports in CSV format
6. THE Fleet_Management_System SHALL use database indexes on vehicle_id and date fields for report queries
7. THE Fleet_Management_System SHALL paginate report results to display 50 records per page

### Requirement 11: Input Validation and Security

**User Story:** As a User, I want the system to validate all inputs and prevent security vulnerabilities, so that my data remains safe and consistent.

#### Acceptance Criteria

1. THE Fleet_Management_System SHALL validate all user inputs on the server side before database operations
2. THE Fleet_Management_System SHALL sanitize all text inputs to prevent SQL injection attacks
3. THE Fleet_Management_System SHALL sanitize all text inputs to prevent XSS attacks
4. THE Fleet_Management_System SHALL validate license plate format using regex pattern matching
5. THE Fleet_Management_System SHALL validate email addresses using regex pattern matching
6. WHEN validation fails, THE Fleet_Management_System SHALL return HTTP 400 with descriptive error messages
7. THE Fleet_Management_System SHALL implement CSRF protection for all state-changing operations
8. THE Fleet_Management_System SHALL configure CORS to allow only trusted origins
9. THE Fleet_Management_System SHALL implement rate limiting of 100 requests per minute per IP address

### Requirement 12: Database Design and Integrity

**User Story:** As a Developer, I want a well-designed PostgreSQL database with proper constraints, so that data integrity is maintained automatically.

#### Acceptance Criteria

1. THE Fleet_Management_System SHALL use PostgreSQL as the database engine
2. THE Fleet_Management_System SHALL define foreign key constraints for all relationships between vehicles, drivers, trips, maintenance logs, and expenses
3. THE Fleet_Management_System SHALL define unique constraints on vehicle license plates and driver license numbers
4. THE Fleet_Management_System SHALL define NOT NULL constraints on all required fields
5. THE Fleet_Management_System SHALL define CHECK constraints to enforce positive values for capacity, weight, and costs
6. THE Fleet_Management_System SHALL create indexes on vehicle_id, driver_id, and date columns for query performance
7. THE Fleet_Management_System SHALL use database transactions for all multi-step operations
8. WHEN a database constraint is violated, THE Fleet_Management_System SHALL rollback the transaction and return HTTP 400

### Requirement 13: Real-Time Updates and Performance

**User Story:** As a User, I want live updates without page refresh, so that I can see current fleet status immediately.

#### Acceptance Criteria

1. THE Fleet_Management_System SHALL implement WebSockets or Server-Sent Events for real-time communication
2. WHEN a vehicle status changes, THE Fleet_Management_System SHALL broadcast Real_Time_Updates to all connected clients
3. WHEN a trip is created or completed, THE Fleet_Management_System SHALL broadcast Real_Time_Updates to dashboard clients
4. THE Fleet_Management_System SHALL deliver Real_Time_Updates within 1 second of data changes
5. THE Fleet_Management_System SHALL avoid N+1 query problems by using JOIN operations or eager loading
6. THE Fleet_Management_System SHALL paginate all list views to display 50 records per page
7. THE Fleet_Management_System SHALL use database connection pooling to handle concurrent requests

### Requirement 14: User Interface and Experience

**User Story:** As a User, I want a responsive interface with clear feedback, so that I can efficiently complete my tasks on any device.

#### Acceptance Criteria

1. THE Fleet_Management_System SHALL render all pages responsively on desktop, tablet, and mobile screen sizes
2. WHEN a User submits a form, THE Fleet_Management_System SHALL display a loading indicator until the operation completes
3. WHEN an operation fails, THE Fleet_Management_System SHALL display error messages in the user interface
4. WHEN an operation succeeds, THE Fleet_Management_System SHALL display success confirmation messages
5. THE Fleet_Management_System SHALL display validation errors inline next to the relevant form fields
6. THE Fleet_Management_System SHALL disable submit buttons during form processing to prevent duplicate submissions

### Requirement 15: Logging and Monitoring

**User Story:** As a Developer, I want structured logging of system events, so that I can troubleshoot issues and monitor system health.

#### Acceptance Criteria

1. THE Fleet_Management_System SHALL log all authentication attempts with timestamp, username, and result
2. THE Fleet_Management_System SHALL log all database errors with timestamp, query, and error message
3. THE Fleet_Management_System SHALL log all validation failures with timestamp, endpoint, and validation errors
4. THE Fleet_Management_System SHALL use structured logging format with consistent fields
5. THE Fleet_Management_System SHALL log to standard output for container compatibility
6. THE Fleet_Management_System SHALL include request IDs in all log entries for request tracing

### Requirement 16: Offline-First Development

**User Story:** As a Developer, I want the system to work without internet connectivity, so that I can develop and demo during the hackathon without network dependencies.

#### Acceptance Criteria

1. THE Fleet_Management_System SHALL operate fully without external API dependencies
2. THE Fleet_Management_System SHALL use local PostgreSQL database instance
3. THE Fleet_Management_System SHALL serve all frontend assets from the local server
4. THE Fleet_Management_System SHALL include all required libraries in the project repository or package manager cache
5. WHERE external APIs are used, THE Fleet_Management_System SHALL provide mock implementations for offline development

### Requirement 17: Version Control and Collaboration

**User Story:** As a Team Member, I want meaningful Git commits and clear project structure, so that we can collaborate effectively during the hackathon.

#### Acceptance Criteria

1. THE Fleet_Management_System SHALL use Git for version control
2. THE Fleet_Management_System SHALL include commit messages describing the purpose of each change
3. THE Fleet_Management_System SHALL organize code into separate modules for routes, controllers, models, and services
4. THE Fleet_Management_System SHALL include a README file with setup instructions
5. THE Fleet_Management_System SHALL include a .gitignore file excluding node_modules, environment files, and build artifacts
6. THE Fleet_Management_System SHALL separate business logic from route handlers for testability

### Requirement 18: Environment Configuration

**User Story:** As a Developer, I want environment-based configuration, so that I can deploy to different environments without code changes.

#### Acceptance Criteria

1. THE Fleet_Management_System SHALL load all configuration from environment variables
2. THE Fleet_Management_System SHALL require environment variables for database connection string, JWT secret, and port number
3. THE Fleet_Management_System SHALL include a .env.example file documenting all required environment variables
4. THE Fleet_Management_System SHALL validate that all required environment variables are present at startup
5. WHEN required environment variables are missing, THE Fleet_Management_System SHALL log an error and exit with non-zero status code
6. THE Fleet_Management_System SHALL exclude .env files from version control
