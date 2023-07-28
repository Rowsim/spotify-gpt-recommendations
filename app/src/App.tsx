import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AppProvider } from './AppContext';

const HomePage = lazy(() => import("./pages/home"));
const CallbackPage = lazy(() => import("./pages/callback"));

function App() {
  return (
    <AppProvider>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/callback" element={<CallbackPage />} />
          </Routes>
        </Suspense>
      </Router>
    </AppProvider>
  );
}

export default App;
