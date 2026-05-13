import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success' | 'error' | null
  const [errorMessage, setErrorMessage] = useState('');
  
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (selectedFile) => {
    if (selectedFile.type !== 'application/pdf') {
      setUploadStatus('error');
      setErrorMessage('Please upload a valid PDF file.');
      return;
    }
    setFile(selectedFile);
    setUploadStatus(null);
    setErrorMessage('');
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadStatus(null);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed. Server responded with an error.');
      }
      
      const data = await res.json();
      console.log('Upload success:', data);
      setUploadStatus('success');
      setFile(null); // Clear after upload
      if(fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error(err);
      setUploadStatus('error');
      setErrorMessage(err.message || 'An error occurred during upload.');
    } finally {
      setIsUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setUploadStatus(null);
    if(fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-4xl mb-4">
          Knowledge <span className="text-gradient">Ingestion</span>
        </h1>
        <p className="text-secondary text-lg">
          Upload new PDF documents to expand the database.
        </p>
      </div>

      <div className="glass-panel p-8">
        {!file ? (
          <div 
            className={`upload-area ${isDragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              accept=".pdf" 
              onChange={handleChange}
            />
            
            <div className="upload-icon-container">
              <UploadCloud size={40} />
            </div>
            
            <h3 className="text-xl font-semibold mb-2">
              Drag & Drop your PDF here
            </h3>
            <p className="text-secondary mb-6">
              or click to browse from your computer
            </p>
            
            <button className="btn-primary" onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}>
              Select File
            </button>
          </div>
        ) : (
          <div className="animate-fade-in text-center py-6">
            <div className="mx-auto w-20 h-20 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/30">
              <FileText className="text-accent-primary" size={40} />
            </div>
            
            <h3 className="text-xl font-semibold mb-2 truncate max-w-[80%] mx-auto">
              {file.name}
            </h3>
            <p className="text-secondary mb-8">
              {(file.size / (1024 * 1024)).toFixed(2)} MB • PDF Document
            </p>
            
            <div className="flex gap-4 justify-center">
              <button 
                className="btn-primary" 
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Uploading...
                  </>
                ) : (
                  <>
                    <UploadCloud size={20} />
                    Process Document
                  </>
                )}
              </button>
              <button 
                className="btn-primary" 
                style={{ background: 'rgba(255, 255, 255, 0.1)', color: 'white', boxShadow: 'none' }}
                onClick={clearFile}
                disabled={isUploading}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Status Messages */}
        {uploadStatus === 'success' && (
          <div className="mt-8 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center justify-center gap-3 text-green-400 animate-fade-in">
            <CheckCircle size={20} />
            <p>Document successfully uploaded and processed!</p>
          </div>
        )}

        {uploadStatus === 'error' && (
          <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-center gap-3 text-red-400 animate-fade-in">
            <AlertCircle size={20} />
            <p>{errorMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
