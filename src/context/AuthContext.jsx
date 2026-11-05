import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService.js';
import { db } from '../services/db.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load session on startup
  useEffect(() => {
    const session = authService.getCurrentSession();
    if (session) {
      setUser(session);
      // Fetch fresh profile from DB
      if (session.role === 'student') {
        setProfile(db.getStudentByUserId(session.userId));
      } else if (session.role === 'warden') {
        setProfile(db.getWardenByUserId(session.userId));
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (usernameOrEmail, password) => {
    setIsLoading(true);
    try {
      const session = await authService.login(usernameOrEmail, password);
      setUser(session);
      if (session.role === 'student') {
        setProfile(db.getStudentByUserId(session.userId));
      } else if (session.role === 'warden') {
        setProfile(db.getWardenByUserId(session.userId));
      }
      return session;
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = async (role) => {
    setIsLoading(true);
    try {
      const session = await authService.quickLogin(role);
      setUser(session);
      if (session.role === 'student') {
        setProfile(db.getStudentByUserId(session.userId));
      } else if (session.role === 'warden') {
        setProfile(db.getWardenByUserId(session.userId));
      }
      return session;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (formData) => {
    setIsLoading(true);
    try {
      const session = await authService.registerStudent(formData);
      setUser(session);
      setProfile(db.getStudentByUserId(session.userId));
      return session;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setProfile(null);
  };

  const updateCurrentProfile = (newProfile) => {
    setProfile(newProfile);
  };

  const value = {
    user,
    role: user ? user.role : null,
    profile,
    isAuthenticated: !!user,
    isLoading,
    login,
    quickLogin,
    register,
    logout,
    updateCurrentProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
