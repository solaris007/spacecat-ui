import { createContext } from 'react';

const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  environment: '',
  setEnvironment: () => {},
  switchEnvironment: () => {}
});

export default AuthContext;
