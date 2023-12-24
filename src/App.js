import { BrowserRouter } from 'react-router-dom';
import AppWithRouter from './AppWithRouter';

const App = () => {
  return (
    <BrowserRouter>
      <AppWithRouter />
    </BrowserRouter>
  );
};

export default App;
