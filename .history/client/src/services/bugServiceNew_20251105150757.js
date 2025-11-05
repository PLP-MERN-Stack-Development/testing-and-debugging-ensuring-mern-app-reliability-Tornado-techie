import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const bugService = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
bugService.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for debugging
bugService.interceptors.response.use(
  (response) => {
    console.log(`Response received:`, response.status, response.data);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const bugAPI = {
  // Get all bugs with optional filtering
  getBugs: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    
    const response = await bugService.get(`/bugs?${params}`);
    return response.data;
  },

  // Get a single bug by ID
  getBug: async (id) => {
    const response = await bugService.get(`/bugs/${id}`);
    return response.data;
  },

  // Create a new bug
  createBug: async (bugData) => {
    const response = await bugService.post('/bugs', bugData);
    return response.data;
  },

  // Update an existing bug
  updateBug: async (id, bugData) => {
    const response = await bugService.put(`/bugs/${id}`, bugData);
    return response.data;
  },

  // Delete a bug
  deleteBug: async (id) => {
    const response = await bugService.delete(`/bugs/${id}`);
    return response.data;
  },

  // Search bugs
  searchBugs: async (query) => {
    const response = await bugService.get(`/bugs/search?q=${encodeURIComponent(query)}`);
    return response.data;
  }
};

export default bugService;