import React, { createContext, useState, useContext, useEffect } from 'react';
import { mockData } from '../data/mock';

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

  useEffect(() => {
    // Check if user is logged in (simulate checking localStorage)
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Mock login - in real app, this would call backend
    const mockUser = mockData.users.find(u => u.email === email);
    if (mockUser) {
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const signup = async (email, firstName, password) => {
    // Mock signup - in real app, this would call backend
    const newUser = {
      id: Date.now(),
      email,
      firstName,
      level: 'Beginner',
      points: 0,
      streak: 0,
      completedLessons: [],
      achievements: []
    };
    
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUserProgress = (lessonId, points, newAchievements = []) => {
    if (user) {
      const updatedUser = {
        ...user,
        points: user.points + points,
        completedLessons: [...user.completedLessons, lessonId],
        achievements: [...user.achievements, ...newAchievements]
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateUserProgress
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};