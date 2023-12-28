import { BrowserRouter } from 'react-router-dom';
import AppWithRouter from './AppWithRouter';

const App = () => {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <AppWithRouter/>
    </BrowserRouter>
  );
};

export default App;
