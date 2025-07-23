import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Auth Service ---
export const registerUser = async (userData: object) => {
  const { data } = await apiClient.post('/auth/register', userData);
  return data;
};

export const loginUser = async (credentials: object) => {
  const { data } = await apiClient.post('/auth/login', credentials);
  return data;
};

// --- User Service ---
export const getUserProfile = async () => {
    const { data } = await apiClient.get('/user/profile');
    return data;
};

export const updateUserProfile = async (profileData: object) => {
    const { data } = await apiClient.put('/user/profile', profileData);
    return data;
};

// --- Transaction Service ---
export const addTransaction = async (transactionData: object) => {
  const { data } = await apiClient.post('/transactions', transactionData);
  return data;
};

export const getTransactions = async () => {
  const { data } = await apiClient.get('/transactions');
  return data;
};

// --- AI Service ---
export const getAiInsights = async () => {
    const { data } = await apiClient.get('/ai/insights');
    return data;
};
// client/src/services/api.ts
// ... (keep all existing functions)

// --- Goal Service ---
export const getGoal = async () => {
    const { data } = await apiClient.get('/goals');
    return data;
};

export const setGoal = async (goalData: object) => {
    const { data } = await apiClient.post('/goals', goalData);
    return data;
};
export const deleteTransaction = async (id: string) => {
    const { data } = await apiClient.delete(`/transactions/${id}`);
    return data;
};
export const updateTransaction = async (id: string, transactionData: object) => {
    const { data } = await apiClient.put(`/transactions/${id}`, transactionData);
    return data;
};