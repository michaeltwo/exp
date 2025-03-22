import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Check if user is logged in on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        // Set default headers for all axios requests
        axios.defaults.headers.common['Authorization'] = `Token ${token}`;
        
        try {
          // Get user data if needed
          const userData = JSON.parse(localStorage.getItem('user'));
          setUser(userData);
        } catch (error) {
          console.error('Auth error:', error);
          logout();
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);
  
  // Login function
  const login = async (username, password) => {
    try {
      const response = await axios.post('/api/login/', { username, password });
      
      // Store token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.data.user_id,
        username: response.data.username,
        email: response.data.email,
        group: response.data.group,
      }));
      
      // Set auth header for future requests
      axios.defaults.headers.common['Authorization'] = `Token ${response.data.token}`;
      
      setUser({
        id: response.data.user_id,
        username: response.data.username,
        email: response.data.email,
        group: response.data.group,
      });
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.non_field_errors?.[0] || 'Login failed' 
      };
    }
  };
  
  // Signup function
  const signup = async (userData) => {
    try {
      const response = await axios.post('/api/signup/', userData);
      
      // Store token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.data.user_id,
        username: response.data.username,
        email: response.data.email,
        group: response.data.group,
      }));
      
      // Set auth header for future requests
      axios.defaults.headers.common['Authorization'] = `Token ${response.data.token}`;
      
      setUser({
        id: response.data.user_id,
        username: response.data.username,
        email: response.data.email,
        group: response.data.group,
      });
      
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        message: error.response?.data?.username?.[0] || 'Signup failed' 
      };
    }
  };
  
  // Logout function
  const logout = () => {
    // Remove token and user data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Remove auth header
    delete axios.defaults.headers.common['Authorization'];
    
    setUser(null);
    navigate('/login');
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;