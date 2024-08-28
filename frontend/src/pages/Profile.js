// src/pages/Profile.js
import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContextProvider';
import api from '../services/api';
import '../styles/Profile.css';

const Profile = () => {
  const { user, setUser } = useUser();
  const [profilePic, setProfilePic] = useState('');
  const [newPic, setNewPic] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.profilePictureUrl) {
      setProfilePic(user.profilePictureUrl);
    }
  }, [user]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleFileChange = (e) => {
    setNewPic(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!newPic) return;

    const formData = new FormData();
    formData.append('profilePic', newPic);

    setLoading(true);
    try {
      const updatedUser = await api.uploadProfilePic(user.username, formData);
      setProfilePic(updatedUser.profilePictureUrl);
      setUser(updatedUser);
      setLoading(false);
    } catch (err) {
      console.error('Error uploading profile picture:', err);
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <h1 className="profile-header">{user.username}'s Profile</h1>
      {profilePic && (
        <img src={profilePic} alt={`${user.username}'s profile`} className="profile-picture" />
      )}
      <div className="profile-details">
        <p>First Name: {user.firstName}</p>
        <p>Last Name: {user.lastName}</p>
        <p>Email: {user.email}</p>
      </div>
      
      <div className="profile-picture-upload">
        <label htmlFor="profilePic">Upload a new profile picture:</label>
        <input type="file" id="profilePic" onChange={handleFileChange} />
      </div>
      <button onClick={handleUpload} disabled={loading} className="profile-save-button">
        {loading ? 'Uploading...' : 'Upload New Picture'}
      </button>
    </div>
  );
};

export default Profile;