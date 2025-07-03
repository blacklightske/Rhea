import React, { useState, useRef } from 'react';

interface PhotoUploadProps {
  jobId?: string;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ jobId }) => {
  const [beforePhoto, setBeforePhoto] = useState<File | null>(null);
  const [afterPhoto, setAfterPhoto] = useState<File | null>(null);
  const [beforePreview, setBeforePreview] = useState<string | null>(null);
  const [afterPreview, setAfterPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [description, setDescription] = useState('');
  
  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File, type: 'before' | 'after') => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (type === 'before') {
          setBeforePhoto(file);
          setBeforePreview(result);
        } else {
          setAfterPhoto(file);
          setAfterPreview(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBeforeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0], 'before');
    }
  };

  const handleAfterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0], 'after');
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, type: 'before' | 'after') => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0], type);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removePhoto = (type: 'before' | 'after') => {
    if (type === 'before') {
      setBeforePhoto(null);
      setBeforePreview(null);
      if (beforeInputRef.current) beforeInputRef.current.value = '';
    } else {
      setAfterPhoto(null);
      setAfterPreview(null);
      if (afterInputRef.current) afterInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!beforePhoto || !afterPhoto) {
      alert('Please select both before and after photos');
      return;
    }

    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      alert(`Photos uploaded successfully!\nJob ID: ${jobId || 'N/A'}\nBefore: ${beforePhoto.name}\nAfter: ${afterPhoto.name}\nDescription: ${description}`);
      // Reset form
      setBeforePhoto(null);
      setAfterPhoto(null);
      setBeforePreview(null);
      setAfterPreview(null);
      setDescription('');
      if (beforeInputRef.current) beforeInputRef.current.value = '';
      if (afterInputRef.current) afterInputRef.current.value = '';
    }, 2000);
  };

  const UploadArea: React.FC<{ type: 'before' | 'after'; photo: File | null; preview: string | null }> = ({ type, photo, preview }) => (
    <div className="col-md-6">
      <div className="card">
        <h4 className="text-center mb-3">{type === 'before' ? '📷 Before Photo' : '✨ After Photo'}</h4>
        
        <div
          className="upload-area"
          style={{
            border: '2px dashed #007bff',
            borderRadius: '8px',
            padding: '2rem',
            textAlign: 'center',
            backgroundColor: preview ? '#f8f9fa' : '#ffffff',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            minHeight: '300px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onDrop={(e) => handleDrop(e, type)}
          onDragOver={handleDragOver}
          onClick={() => type === 'before' ? beforeInputRef.current?.click() : afterInputRef.current?.click()}
        >
          {preview ? (
            <div style={{ position: 'relative', width: '100%' }}>
              <img 
                src={preview} 
                alt={`${type} preview`} 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '200px', 
                  borderRadius: '4px',
                  objectFit: 'cover'
                }} 
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removePhoto(type);
                }}
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
              <p className="mt-2 mb-0" style={{ fontSize: '0.875rem', color: '#666' }}>
                {photo?.name}
              </p>
            </div>
          ) : (
            <>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#007bff' }}>📁</div>
              <p style={{ margin: '0.5rem 0', fontWeight: '500' }}>Drop your {type} photo here</p>
              <p style={{ margin: '0.5rem 0', color: '#666', fontSize: '0.875rem' }}>or click to browse</p>
              <p style={{ margin: 0, color: '#999', fontSize: '0.75rem' }}>Supports: JPG, PNG, GIF (Max 10MB)</p>
            </>
          )}
        </div>
        
        <input
          ref={type === 'before' ? beforeInputRef : afterInputRef}
          type="file"
          accept="image/*"
          onChange={type === 'before' ? handleBeforeChange : handleAfterChange}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );

  return (
    <div className="container">
      <div className="mb-4 text-center">
        <h1>📸 Upload Before & After Photos</h1>
        <p>Document your work progress for client verification and dispute resolution</p>
        {jobId && (
          <div className="card" style={{ display: 'inline-block', padding: '0.5rem 1rem' }}>
            <strong>Job ID:</strong> {jobId}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row mb-4">
          <UploadArea type="before" photo={beforePhoto} preview={beforePreview} />
          <UploadArea type="after" photo={afterPhoto} preview={afterPreview} />
        </div>

        <div className="row mb-4">
          <div className="col-md-12">
            <div className="card">
              <h4>📝 Work Description</h4>
              <div className="form-group">
                <label htmlFor="description" className="form-label">Describe the work completed</label>
                <textarea
                  id="description"
                  className="form-control"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what work was completed, any challenges faced, materials used, etc."
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button 
            type="submit" 
            className="btn btn-success"
            style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}
            disabled={!beforePhoto || !afterPhoto || isUploading}
          >
            {isUploading ? (
              <>
                <span className="loading"></span>
                <span style={{ marginLeft: '0.5rem' }}>Uploading Photos...</span>
              </>
            ) : (
              '📤 Submit Photos'
            )}
          </button>
        </div>

        {(!beforePhoto || !afterPhoto) && (
          <div className="text-center mt-3">
            <p style={{ color: '#dc3545', fontSize: '0.875rem' }}>
              ⚠️ Both before and after photos are required
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default PhotoUpload;