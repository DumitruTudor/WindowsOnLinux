import React from 'react';
import ReactDOM from 'react-dom/client';
import './Style.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import Register from './Register';
import Dashboard from './Dashboard';  
import VerifySuccess from './VerifySuccess';
import VerifyFail from './VerifyFail';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/verify-success" element={<VerifySuccess />} />
        <Route path="/verify-fail" element={<VerifyFail />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
