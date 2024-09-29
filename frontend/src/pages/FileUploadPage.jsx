// pages/FileUploadPage.js
import React, { useState } from 'react';
import GlassCard from '../components/GlassCard';
import '../App.css';
import { useAuth0 } from "@auth0/auth0-react";
const FileUploadPage = () => {
  const [file, setFile] = useState(null);
  const { logout } = useAuth0();
    const { user, isAuthenticated } = useAuth0();
    if(isAuthenticated){
        console.log(user);
        
    }

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      alert('Please select a file');
      return;
    }
    console.log('Uploading file:', file.name);
    // Perform file upload action
  };

  return (
    <div className="file-upload-container">
      <GlassCard>
        <h2>Upload File</h2>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
        <button onClick={() => logout({ logoutParams: { returnTo: "http://localhost:3000/login" } })}>
      Log Out
    </button>
      </GlassCard>
    </div>
  );
};

export default FileUploadPage;
