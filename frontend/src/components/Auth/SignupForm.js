import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContextProvider';
import '../../styles/SignupForm.css'; // Import the CSS file

const SignupForm = ({ signup }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    profilePicture: null // Add profilePicture field
  });
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState([]);
  const [success, setSuccess] = useState(false);

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData(f => ({
      ...f,
      [name]: value
    }));
  };

  const handleFileChange = (evt) => {
    setFormData(f => ({
      ...f,
      profilePicture: evt.target.files[0] // Set the selected file
    }));
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const username = formData.username;
      const token = await signup(data); // Send the FormData object
      localStorage.setItem('token', token);
      setUser({ username });
      setSuccess(true);
      setFormErrors([]);
      navigate('/');
    } catch (errors) {
      setFormErrors(errors);
      setSuccess(false);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <h1 className="signup-title">Sign Up</h1>
        <div className="signup-field">
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="signup-field">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="signup-field">
          <label htmlFor="firstName">First Name:</label>
          <input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="signup-field">
          <label htmlFor="lastName">Last Name:</label>
          <input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="signup-field">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="signup-field">
          <label htmlFor="profilePicture">Profile Picture:</label>
          <input
            type="file"
            id="profilePicture"
            name="profilePicture"
            onChange={handleFileChange}
            accept="image/*" // Accept image files only
          />
        </div>
        {formErrors.length > 0 && (
          <div className="signup-errors">
            {formErrors.map((error, index) => (
              <p key={index} className="error-text">
                {error}
              </p>
            ))}
          </div>
        )}
        {success && (
          <p className="success-text">Signup successful!</p>
        )}
        <button className="signup-button" type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignupForm;