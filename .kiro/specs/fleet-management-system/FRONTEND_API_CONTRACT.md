# Frontend API Contract - Fleet Management System

**Backend Base URL:** `http://localhost:3000/api`  
**WebSocket URL:** `ws://localhost:3000`  
**Auth Header:** `Authorization: Bearer <jwt_token>`

---

## 🎯 Quick Reference

### Standard Response Formats

**Success:**
```json
{ "success": true, "data": {...} }
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": {}
  }
}
```

### HTTP Status Codes
- 200: Success | 201: Created | 400: Validation Error
- 401: Unauthorized | 403: Forbidden | 404: Not Found
- 409: Conflict | 429: Rate Limit

---

## 📊 Data Models (TypeScript)

```typescript
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
  license_expiry: string; // YYYY-MM-DD
  safety_score: number; // 0-100
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

---

## 🔐 Authentication Endpoints

### POST /api/auth/register
```json
// Request
{
  "username": "john_doe",
  "password": "password123",
  "email": "john@example.com",
  "role": "Fleet Manager"
}

// Response (201)
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

### POST /api/auth/login
```json
// Request
{
  "username": "john_doe",
  "password": "password123"
}

// Response (200)
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

### GET /api/auth/me
**Headers:** `Authorization: Bearer <token>`
```json
// Response (200)
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

---

## 🚗 Vehicle Endpoints

### GET /api/vehicles
**Query:** `?page=1&limit=50&status=Available`
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
    "pagination": { "page": 1, "limit": 50, "total": 120, "pages": 3 }
  }
}
```

### GET /api/vehicles/:id
### POST /api/vehicles (Fleet Manager only)
```json
// Request
{
  "license_plate": "ABC-1234",
  "max_capacity_kg": 5000,
  "odometer_km": 0
}
```

### PUT /api/vehicles/:id (Fleet Manager only)
### DELETE /api/vehicles/:id (Fleet Manager only)

---

## 👤 Driver Endpoints

### GET /api/drivers
**Query:** `?page=1&limit=50&expiring_soon=true`

### GET /api/drivers/:id
### POST /api/drivers (Fleet Manager, Safety Officer)
```json
// Request
{
  "name": "John Smith",
  "license_number": "DL123456",
  "license_expiry": "2025-06-30",
  "safety_score": 100
}
```

### PUT /api/drivers/:id
### DELETE /api/drivers/:id (Fleet Manager only)

---

## 🚚 Trip Endpoints

### GET /api/trips
**Query:** `?page=1&limit=50&status=In Progress&vehicle_id=1&driver_id=1`

### GET /api/trips/:id
### POST /api/trips (Dispatcher, Fleet Manager)
```json
// Request
{
  "driver_id": 1,
  "vehicle_id": 1,
  "origin": "Warehouse A",
  "destination": "Customer Site B",
  "cargo_weight_kg": 3500
}

// Validation Errors (400)
// - "Cargo exceeds vehicle capacity"
// - "Driver license expired"
// - "Vehicle not available"
```

### PUT /api/trips/:id/complete
### DELETE /api/trips/:id (cancel)

---

## 🔧 Maintenance Endpoints

### GET /api/maintenance
**Query:** `?page=1&limit=50&vehicle_id=1&status=Scheduled`

### POST /api/maintenance (Fleet Manager)
```json
// Request
{
  "vehicle_id": 1,
  "service_type": "Oil Change",
  "cost": 150.00,
  "service_date": "2024-01-25",
  "description": "Regular maintenance"
}
// Note: Auto-updates vehicle status to "In Shop"
```

### PUT /api/maintenance/:id/complete
// Note: Auto-updates vehicle status to "Available"

---

## 💰 Expense Endpoints

### GET /api/expenses
**Query:** `?page=1&limit=50&vehicle_id=1&expense_type=Fuel&start_date=2024-01-01&end_date=2024-01-31`

### POST /api/expenses (Financial Analyst, Fleet Manager)
```json
// Request
{
  "vehicle_id": 1,
  "expense_type": "Fuel",
  "amount": 85.50,
  "fuel_liters": 50.0,  // Required for Fuel type
  "expense_date": "2024-01-20",
  "description": "Regular refuel"
}
```

---

## 📊 Dashboard Endpoints

### GET /api/dashboard/kpis
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

### GET /api/dashboard/alerts
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
      }
    ]
  }
}
```

---

## 🔄 WebSocket Events

**Connection:** `ws://localhost:3000?token=<jwt_token>`

### Events to Listen For:

**vehicle_status_changed:**
```json
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
```

**trip_created:**
```json
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
```

**trip_completed:**
```json
{
  "event": "trip_completed",
  "data": {
    "trip_id": 1,
    "vehicle_id": 1,
    "duration_hours": 4.5,
    "timestamp": "2024-01-20T15:30:00Z"
  }
}
```

**kpi_update:**
```json
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
```

---

## 💻 Example Code

### Axios Setup (services/api.js)
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default api;
```

### Auth Service (services/auth.service.js)
```javascript
import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    localStorage.setItem('token', response.data.token);
    return response.data;
  },
  logout: () => localStorage.removeItem('token'),
  getCurrentUser: () => api.get('/auth/me')
};
```

### WebSocket Hook (hooks/useWebSocket.js)
```javascript
import { useEffect, useRef, useState } from 'react';

export const useWebSocket = (url, token) => {
  const ws = useRef(null);
  const [lastMessage, setLastMessage] = useState(null);

  useEffect(() => {
    if (!token) return;
    ws.current = new WebSocket(`${url}?token=${token}`);
    ws.current.onmessage = (event) => setLastMessage(JSON.parse(event.data));
    return () => ws.current?.close();
  }, [url, token]);

  return { lastMessage };
};
```

---

## ✅ Your Tasks (from tasks.md)

### Hours 0-2: Setup + Mock UI
- **2.1** Initialize React (Vite or CRA), install react-router-dom & axios
- **2.2** Create common components (Button, Input, Table, Modal, LoadingSpinner)
- **2.3** Create layout (Header, Sidebar, Layout) + LoginPage with mock data

### Hour 2: API Integration
- **2.4** Create API service layer (api.js, AuthContext, useAuth hook)

### Hours 2-5: Build Pages
- **2.5** Login flow with real API (30 min)
- **2.6** Vehicle pages (List, Form, Page) - 60 min
- **2.7** Driver pages - 30 min
- **2.8** Trip pages with validation - 60 min
- **2.9** Dashboard with KPIs - 30 min
- **2.10** Maintenance + Expense pages - 30 min
- **2.11** WebSocket integration - 30 min
- **2.12** Routing + polish - 30 min

### Hours 5-7: Integration Testing
- Test with backend, fix bugs together

### Hours 7-8: Polish & Demo
- Responsive design, loading states, error handling

---

## 🚨 Critical Rules

1. **API is FROZEN** - No endpoint changes allowed
2. **Use mock data Hours 0-2**, real API from Hour 2+
3. **Backend ready at Hour 5** for full integration
4. **Priority:** Login → Dashboard → Vehicles → Trips
5. **Always show loading states and handle errors**

---

## 📅 Timeline

- **Hour 2:** Backend auth ready → Start API integration
- **Hour 5:** Backend fully ready → Integration testing
- **Hour 7-8:** Polish and demo prep

Good luck! 🚀
