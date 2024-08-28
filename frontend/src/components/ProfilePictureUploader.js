import React, { useState } from 'react';
import { useUser } from '../context/UserContextProvider';
import ConcertApi from '../services/api';
import '../styles/ProfilePictureUploader.css';

const ProfilePictureUploader = () => {
  const { user, setUser } = useUser();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('No file selected.');
      return;
    }

    const formData = new FormData();
    formData.append('profilePicture', selectedFile);

    try {
      const response = await ConcertApi.uploadProfilePicture(user.username, formData);
      setUser({ ...user, profilePictureUrl: response.profilePictureUrl });
      setUploadSuccess(true);
      setUploadError(null);
    } catch (error) {
      setUploadError('Failed to upload profile picture.');
      setUploadSuccess(false);
    }
  };

  return (
    <div className="profile-picture-uploader">
      <h2>Upload Profile Picture</h2>
      {preview && <img src={preview} alt="Profile Preview" className="profile-preview" />}
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {uploadError && <p className="error-message">{uploadError}</p>}
      {uploadSuccess && <p className="success-message">Profile picture uploaded successfully!</p>}
    </div>
  );
};

export default ProfilePictureUploader;