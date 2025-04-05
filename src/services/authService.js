/**
 * Authentication service for user login, registration and token management
 */

const API_URL = 'http://localhost:2000/api';

// Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Login a user and get token
export const loginUser = async (credentials) => {
  try {
    // UPDATED: Use email as username for login
    const loginPayload = {
      username: credentials.username, // This should be the email address
      password: credentials.password
    };

    const response = await fetch(`${API_URL}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();

    // Store token in localStorage
    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Get current user profile
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
      }
      throw new Error('Failed to get user profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Get user profile error:', error);
    throw error;
  }
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem('token');
};

// Check if user is logged in
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Get authentication token
export const getToken = () => {
  return localStorage.getItem('token');
};