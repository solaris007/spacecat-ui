import { Navigate, Route, Routes } from 'react-router-dom';
import { defaultTheme, Flex, Provider, View } from '@adobe/react-spectrum';
import { ToastContainer } from '@react-spectrum/toast';
import NavigationBar from './components/NavigationBar';
import Welcome from './components/Welcome';
import Sites from './components/pages/Sites';
import SitesDetails from './components/SiteDetail';
import Audits from './components/pages/Audits';
import AuthPrompt from './components/AuthPrompt';
import AuthProvider from './auth/AuthProvider';
import Footer from './components/Footer';

const AppWithRouter = () => {
  return (
    <AuthProvider>
      <Provider theme={defaultTheme}>
        <ToastContainer/>
        <Flex direction="column" minHeight="100vh" gap="size-150">
          <NavigationBar/>
          <View flexGrow>
            <Routes>
              <Route path="/" element={<Welcome/>}/>
              <Route path="/sites" element={<Sites/>}/>
              <Route path="/sites/:siteId" element={<SitesDetails/>}/>
              <Route path="/audits" element={<Audits/>}/>
              <Route path="/auth" element={<AuthPrompt/>}/>
              <Route path="*" element={<Navigate to="/"/>}/>
            </Routes>
          </View>
          <Footer/>
        </Flex>
      </Provider>
    </AuthProvider>
  );
};

export default AppWithRouter;
