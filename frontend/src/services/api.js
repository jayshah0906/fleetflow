const API_BASE_URL = 'http://localhost:3000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  setAuthToken(token) {
    localStorage.setItem('authToken', token);
  }

  removeAuthToken() {
    localStorage.removeItem('authToken');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    console.log('API Request:', { url, method: config.method || 'GET', body: options.body });

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      console.log('API Response:', { status: response.status, data });

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.success && response.data.token) {
      this.setAuthToken(response.data.token);
    }
    
    return response;
  }

  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  logout() {
    this.removeAuthToken();
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
  }

  // Vehicle endpoints
  async getVehicles(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/vehicles${queryString ? `?${queryString}` : ''}`);
  }

  async getVehicle(id) {
    return this.request(`/vehicles/${id}`);
  }

  async createVehicle(vehicleData) {
    return this.request('/vehicles', {
      method: 'POST',
      body: JSON.stringify(vehicleData),
    });
  }

  async updateVehicle(id, vehicleData) {
    return this.request(`/vehicles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vehicleData),
    });
  }

  async deleteVehicle(id) {
    return this.request(`/vehicles/${id}`, {
      method: 'DELETE',
    });
  }

  // Driver endpoints
  async getDrivers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/drivers${queryString ? `?${queryString}` : ''}`);
  }

  async getDriver(id) {
    return this.request(`/drivers/${id}`);
  }

  async createDriver(driverData) {
    return this.request('/drivers', {
      method: 'POST',
      body: JSON.stringify(driverData),
    });
  }

  async updateDriver(id, driverData) {
    return this.request(`/drivers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(driverData),
    });
  }

  async deleteDriver(id) {
    return this.request(`/drivers/${id}`, {
      method: 'DELETE',
    });
  }

  // Trip endpoints
  async getTrips(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/trips${queryString ? `?${queryString}` : ''}`);
  }

  async getTrip(id) {
    return this.request(`/trips/${id}`);
  }

  async createTrip(tripData) {
    return this.request('/trips', {
      method: 'POST',
      body: JSON.stringify(tripData),
    });
  }

  async completeTrip(id, data) {
    return this.request(`/trips/${id}/complete`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTrip(id) {
    return this.request(`/trips/${id}`, {
      method: 'DELETE',
    });
  }

  // Maintenance endpoints
  async getMaintenance(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/maintenance${queryString ? `?${queryString}` : ''}`);
  }

  async createMaintenance(maintenanceData) {
    return this.request('/maintenance', {
      method: 'POST',
      body: JSON.stringify(maintenanceData),
    });
  }

  async completeMaintenance(id, data) {
    return this.request(`/maintenance/${id}/complete`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Expense endpoints
  async getExpenses(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/expenses${queryString ? `?${queryString}` : ''}`);
  }

  async createExpense(expenseData) {
    return this.request('/expenses', {
      method: 'POST',
      body: JSON.stringify(expenseData),
    });
  }

  // Dashboard endpoints
  async getDashboardKPIs() {
    return this.request('/dashboard/kpis');
  }

  async getDashboardAlerts() {
    return this.request('/dashboard/alerts');
  }

  async getFinancialSummary() {
    return this.request('/dashboard/financial');
  }
}

export default new ApiService();
