import axios from "axios";
import { BASE_URL } from "./endpoints/endpoints";

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: BASE_URL, // Your API base URL
  timeout: 60000, // 60 seconds - increased for LLM API calls
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add auth token or other headers
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage, cookie, or state management
    const token = localStorage.getItem("authToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add any other custom headers here
    // config.headers['Custom-Header'] = 'value';

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login, etc.
      console.error("Unauthorized access");
    }

    return Promise.reject(error);
  },
);
