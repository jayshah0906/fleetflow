# Database Setup Instructions

This document provides instructions for setting up the PostgreSQL database for the Fleet Management System.

## Option 1: Local PostgreSQL Installation

### macOS (using Homebrew):
```bash
# Install PostgreSQL
brew install postgresql@14

# Start PostgreSQL service
brew services start postgresql@14

# Create database
createdb fleet_management_dev

# Initialize schema
psql -d fleet_management_dev -f backend/src/db/schema.sql
```

### Ubuntu/Debian:
```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Switch to postgres user and create database
sudo -u postgres psql

# In psql:
CREATE DATABASE fleet_management_dev;
\q

# Initialize schema
sudo -u postgres psql -d fleet_management_dev -f backend/src/db/schema.sql
```

### Windows:
1. Download PostgreSQL installer from https://www.postgresql.org/download/windows/
2. Run the installer and follow the setup wizard
3. Open pgAdmin or use psql command line
4. Create database: `CREATE DATABASE fleet_management_dev;`
5. Run schema file: `psql -U postgres -d fleet_management_dev -f backend/src/db/schema.sql`

## Option 2: Docker (Recommended for Development)

### Using Docker Compose:

1. Create a `docker-compose.yml` file in the project root:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    container_name: fleet_db
    environment:
      POSTGRES_USER: fleet_user
      POSTGRES_PASSWORD: fleet_password
      POSTGRES_DB: fleet_management_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backend/src/db/schema.sql:/docker-entrypoint-initdb.d/schema.sql

volumes:
  postgres_data:
```

2. Start the database:
```bash
docker-compose up -d
```

3. Update your `.env` file:
```
DATABASE_URL=postgresql://fleet_user:fleet_password@localhost:5432/fleet_management_dev
```

### Using Docker CLI:

```bash
# Run PostgreSQL container
docker run --name fleet_db \
  -e POSTGRES_USER=fleet_user \
  -e POSTGRES_PASSWORD=fleet_password \
  -e POSTGRES_DB=fleet_management_dev \
  -p 5432:5432 \
  -d postgres:14-alpine

# Wait a few seconds for the database to start, then initialize schema
docker exec -i fleet_db psql -U fleet_user -d fleet_management_dev < backend/src/db/schema.sql
```

## Verify Database Setup

After setting up the database, verify it's working:

```bash
# Connect to the database
psql -U fleet_user -d fleet_management_dev
# Or if using default postgres user:
psql -d fleet_management_dev

# List all tables
\dt

# You should see:
# - users
# - vehicles
# - drivers
# - trips
# - maintenance
# - expenses

# Exit psql
\q
```

## Environment Configuration

Update your `.env` file with the correct database connection string:

**Local PostgreSQL:**
```
DATABASE_URL=postgresql://username:password@localhost:5432/fleet_management_dev
```

**Docker:**
```
DATABASE_URL=postgresql://fleet_user:fleet_password@localhost:5432/fleet_management_dev
```

Replace `username` and `password` with your PostgreSQL credentials.

## Troubleshooting

### Connection Refused Error:
- Ensure PostgreSQL service is running
- Check if port 5432 is available
- Verify DATABASE_URL in .env file

### Authentication Failed:
- Check username and password in DATABASE_URL
- Ensure the user has access to the database

### Schema Initialization Failed:
- Ensure the database exists before running schema.sql
- Check PostgreSQL version (requires v14+)
- Verify file path to schema.sql

### Docker Issues:
- Ensure Docker is running
- Check container status: `docker ps`
- View logs: `docker logs fleet_db`

## Next Steps

After database setup:
1. Verify `.env` configuration
2. Run `npm run dev` to start the server
3. Check server logs for successful database connection
4. Test the health endpoint: `curl http://localhost:3000/health`
