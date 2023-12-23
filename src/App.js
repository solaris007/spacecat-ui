import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Provider, defaultTheme } from '@adobe/react-spectrum';

import Welcome from './components/Welcome';
import Sites from './components/Sites';
import Audits from './components/Audits';
import AuthPrompt from './components/AuthPrompt';
import { getLocalStorageItem } from './utils/localStorageUtil';
import NavigationBar from './components/NavigationBar';
import { ToastContainer } from '@react-spectrum/toast';

function App() {
  const [ environment, setEnvironment ] = useState('');
  const [ isAuthenticated, setIsAuthenticated ] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    const storedEnvironment = getLocalStorageItem('environment');
    const apiKey = getLocalStorageItem(`apiKey_${storedEnvironment}`);

    if (storedEnvironment && apiKey) {
      setIsAuthenticated(true);
      setEnvironment(storedEnvironment);
    } else {
      navigate('/auth');
    }
  }, [navigate]);

  return (
    <Provider theme={defaultTheme} router={{ navigate }}>
      <ToastContainer />
      {isAuthenticated && <NavigationBar currentEnvironment={environment} />}
      <Routes>
        {isAuthenticated ? (
          <>
            <Route path="/" element={<Welcome />} />
            <Route path="/sites" element={<Sites />} />
            <Route path="/audits" element={<Audits />} />
          </>
        ) :
          (<Route path="/auth" element={<AuthPrompt />} />)
        }

        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/auth"} />} />
      </Routes>
    </Provider>
  );
}

const AppWithRouter = () => {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

export default AppWithRouter;
