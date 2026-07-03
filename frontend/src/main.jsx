import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';

// Validate and recover from corrupted localStorage keys before booting the React application
try {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    if (value) {
      try {
        JSON.parse(value);
      } catch {
        console.warn(`Corrupted localStorage key "${key}" detected. Clearing to prevent crash.`);
        localStorage.removeItem(key);
      }
    }
  }
} catch (e) {
  console.error('Error validating or recovering localStorage keys', e);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
