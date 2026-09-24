import axios from 'axios';

// Defaults to '/api' for Vite dev proxy, or environment URL / direct backend
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for handling error responses uniformly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMsg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred. Please try again.';
    return Promise.reject({
      ...error,
      customMessage: errorMsg,
      status: error.response?.status,
    });
  }
);

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
};

export const employeeService = {
  getProfile: async (id) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },
  getLeaveBalance: async (id) => {
    const response = await api.get(`/employees/${id}/leave-balance`);
    return response.data;
  },
  getLeaveHistory: async (id) => {
    const response = await api.get(`/employees/${id}/leaves`);
    return response.data;
  },
  getAllEmployees: async () => {
    const response = await api.get('/employees');
    return response.data;
  },
  createEmployee: async (employeeData) => {
    const response = await api.post('/employees', employeeData);
    return response.data;
  },
};

export const leaveService = {
  applyLeave: async (leaveData) => {
    const response = await api.post('/leaves', leaveData);
    return response.data;
  },
  getAllLeaves: async () => {
    const response = await api.get('/leaves');
    return response.data;
  },
  getEmployeeLeaves: async (employeeId) => {
    const response = await api.get(`/leaves/employee/${employeeId}`);
    return response.data;
  },
  approveLeave: async (id) => {
    const response = await api.put(`/leaves/${id}/approve`);
    return response.data;
  },
  rejectLeave: async (id, reason) => {
    const response = await api.put(`/leaves/${id}/reject`, { rejectionReason: reason });
    return response.data;
  },
  getDashboardStats: async () => {
    const response = await api.get('/leaves/dashboard-stats');
    return response.data;
  },
};

export default api;
