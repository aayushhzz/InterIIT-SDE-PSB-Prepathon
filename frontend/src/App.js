import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FileUploadPage from './pages/FileUploadPage';
import Login2FA from './pages/Login2FA';
import Register2FA from './pages/Register2FA';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginPage />} />{
            <Route path="/login/2fa" element={<Login2FA />} />
          }
          <Route path="/register" element={<RegisterPage />} />{
            <Route path="/register/2fa" element={<Register2FA />} />
          }
          <Route path="/" element={<FileUploadPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
