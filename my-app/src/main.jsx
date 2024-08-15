import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
// import { ThemeProvider } from '@material-tailwind/react';
import App from './App';
import './style/tailwind.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
        <App />
    </Router>
  </React.StrictMode>
);
