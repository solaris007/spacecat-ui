import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLocalStorageItem } from '../utils/localStorageUtil';

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEnvironment = getLocalStorageItem('environment');
    const apiKey = getLocalStorageItem(`apiKey_${storedEnvironment}`);
    setIsAuthenticated(!!(storedEnvironment && apiKey));

    if (!(storedEnvironment && apiKey)) {
      navigate('/auth');
    }
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
