import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';
import { getLocalStorageItem, setLocalStorageItem } from '../utils/localStorageUtil';

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [environment, setEnvironment] = useState('');
  const navigate = useNavigate();

  const checkAuthentication = useCallback((env) => {
    const apiKey = getLocalStorageItem(`apiKey_${env}`);
    setIsAuthenticated(!!apiKey);
    setEnvironment(env);
    if (!apiKey) {
      navigate('/auth');
    }
  }, [navigate]);

  useEffect(() => {
    const storedEnvironment = getLocalStorageItem('environment');
    checkAuthentication(storedEnvironment);
  }, [checkAuthentication]);


  const switchEnvironment = () => {
    const newEnvironment = environment === 'development' ? 'production' : 'development';
    setLocalStorageItem('environment', newEnvironment);
    checkAuthentication(newEnvironment);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, environment, setEnvironment, switchEnvironment }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
