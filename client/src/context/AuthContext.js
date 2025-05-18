import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async (token) => {
    try {
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      const res = await axios.get('/api/auth/user', config);
      setUser(res.data);
    } catch (err) {
      localStorage.removeItem('token');
      setUser(null);
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      await loadUser(res.data.token);
      return true;
    } catch (err) {
      throw err.response.data.msg;
    }
  };

  const register = async (username, email, password) => {
    try {
      const res = await axios.post('/api/auth/register', { username, email, password });
      localStorage.setItem('token', res.data.token);
      await loadUser(res.data.token);
      return true;
    } catch (err) {
      if (err.response && err.response.data) {
        if (err.response.data.error) {
          throw new Error(err.response.data.error);
        }
        if (err.response.data.errors && err.response.data.errors.length > 0) {
          throw new Error(err.response.data.errors[0]);
        }
        if (err.response.data.msg) {
          throw new Error(err.response.data.msg);
        }
      }
      throw new Error("Ошибка регистрации");
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
