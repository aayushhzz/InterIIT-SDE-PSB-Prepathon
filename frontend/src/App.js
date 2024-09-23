import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FileUploadPage from './pages/FileUploadPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <div className="video-background">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="background-video"
            width={"100%"}
          >
            <source src="https://www.youtube.com/watch?v=SDxmkJwrbno&ab_channel=KarenHovsepyan" type="video/mp4" />
          </video>
        </div>
        
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<FileUploadPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
