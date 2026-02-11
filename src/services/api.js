import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
            const { state } = JSON.parse(authStorage);
            if (state.token) {
                config.headers.Authorization = `Bearer ${state.token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    getMe: () => api.get('/auth/me'),
};

// Graph API
export const graphAPI = {
    getGraphs: () => api.get('/graphs'),
    getGraph: (id) => api.get(`/graphs/${id}`),
    createGraph: (graphData) => api.post('/graphs', graphData),
    updateGraph: (id, graphData) => api.put(`/graphs/${id}`, graphData),
    deleteGraph: (id) => api.delete(`/graphs/${id}`),
};

export default api;
