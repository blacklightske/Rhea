import React, { useState } from 'react';

const PhotoUpload = () => {
  const [beforePhoto, setBeforePhoto] = useState(null);
  const [afterPhoto, setAfterPhoto] = useState(null);

  const handleBeforeChange = (e: React.ChangeEventHandler<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBeforePhoto(e.target.files[0]);
    }
  };

  const handleAfterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAfterPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Upload logic to backend
    alert('Photos submitted!');
  };

  return (
    <div>
      <h2>Upload Before & After Photos</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Before Photo:</label>
          <input type="file" accept="image/*" onChange={handleBeforeChange} />
        </div>
        <div>
          <label>After Photo:</label>
          <input type="file" accept="image/*" onChange={handleAfterChange} />
        </div>
        <button type="submit">Submit Photos</button>
      </form>
    </div>
  );
};

export default PhotoUpload;