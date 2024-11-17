import ReactDOM from 'react-dom/client';
import {onLCP, onINP, onCLS} from 'web-vitals';
import App from './App';
import './critical.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <App />
);

onCLS(console.log);
onINP(console.log);
onLCP(console.log);
