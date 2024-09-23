// pages/FileUploadPage.js
import React, { useState } from 'react';
import GlassCard from '../components/GlassCard';
import '../App.css';

const FileUploadPage = () => {
  const [file, setFile] = useState(null);

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
      </GlassCard>
    </div>
  );
};

export default FileUploadPage;
