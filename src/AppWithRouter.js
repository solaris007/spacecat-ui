import { Navigate, Route, Routes } from 'react-router-dom';
import { defaultTheme, Provider } from '@adobe/react-spectrum';
import { ToastContainer } from '@react-spectrum/toast';
import NavigationBar from './components/NavigationBar';
import Welcome from './components/Welcome';
import Sites from './components/Sites';
import SitesDetails from './components/SitesDetails';
import Audits from './components/Audits';
import AuthPrompt from './components/AuthPrompt';
import AuthProvider from './auth/AuthProvider';

const AppWithRouter = () => {
  return (
    <AuthProvider>
      <Provider theme={defaultTheme}>
        <ToastContainer/>
        <NavigationBar/>
        <Routes>
          <Route path="/" element={<Welcome/>}/>
          <Route path="/sites" element={<Sites/>}/>
          <Route path="/sites/:siteId" element={<SitesDetails/>}/>
          <Route path="/audits" element={<Audits/>}/>
          <Route path="/auth" element={<AuthPrompt/>}/>
          <Route path="*" element={<Navigate to="/"/>}/>
        </Routes>
      </Provider>
    </AuthProvider>
  );
};

export default AppWithRouter;
