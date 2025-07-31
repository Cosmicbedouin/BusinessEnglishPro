import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Configure axios defaults
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
        const response = await axios.get(`${API}/auth/me`);
        setUser(response.data);
        setToken(savedToken);
      } catch (error) {
        console.error('Token validation failed:', error);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API}/auth/login`, {
        email,
        password
      });
      
      const { access_token, user: userData } = response.data;
      
      localStorage.setItem('token', access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      setUser(userData);
      setToken(access_token);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed' 
      };
    }
  };

  const signup = async (email, firstName, password) => {
    try {
      const response = await axios.post(`${API}/auth/register`, {
        email,
        firstName,
        password
      });
      
      const { access_token, user: userData } = response.data;
      
      localStorage.setItem('token', access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      setUser(userData);
      setToken(access_token);
      
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateUserProgress = async (lessonId, points, newAchievements = []) => {
    try {
      await axios.post(`${API}/progress/lesson/${lessonId}`, {
        lessonId,
        points,
        achievements: newAchievements
      });
      
      // Refresh user data
      const response = await axios.get(`${API}/auth/me`);
      setUser(response.data);
    } catch (error) {
      console.error('Progress update failed:', error);
    }
  };

  const submitQuizResults = async (lessonId, answers, score, totalQuestions) => {
    try {
      const response = await axios.post(`${API}/progress/quiz/${lessonId}`, {
        lessonId,
        answers,
        score,
        totalQuestions
      });
      
      // Refresh user data
      const userResponse = await axios.get(`${API}/auth/me`);
      setUser(userResponse.data);
      
      return response.data;
    } catch (error) {
      console.error('Quiz submission failed:', error);
      return null;
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateUserProgress,
    submitQuizResults
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};