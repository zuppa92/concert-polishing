import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Homepage from './pages/Home';
import ArtistList from './components/Artists/ArtistList';
import Profile from './pages/Profile';
import LoginForm from './components/Auth/LoginForm';
import SignupForm from './components/Auth/SignupForm';
import SearchForm from './components/SearchForm';
import ConcertApi from './services/api';
import { UserProvider } from './context/UserContextProvider';
import useLocalStorage from './hooks/useLocalStorage';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useLocalStorage('token', null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchCurrentUser() {
      if (token) {
        try {
          ConcertApi.token = token;
          const currentUser = await ConcertApi.getCurrentUser();
          setUser(currentUser);
        } catch (err) {
          console.error('Failed to fetch current user:', err);
          setUser(null);
        }
      }
    }
    fetchCurrentUser();
  }, [token]);

  const login = async (formData) => {
    try {
      const { token: newToken } = await ConcertApi.login(formData);
      setToken(newToken);
      ConcertApi.token = newToken;
      const currentUser = await ConcertApi.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      console.error('Login failed:', err);
      throw err;
    }
  };

  const signup = async (formData) => {
    try {
      const { token: newToken } = await ConcertApi.register(formData);
      setToken(newToken);
      ConcertApi.token = newToken;
      const currentUser = await ConcertApi.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      console.error('Signup failed:', err);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    ConcertApi.token = null;
    clearSearchTerm();
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const clearSearchTerm = () => {
    setSearchTerm('');
  };

  return (
    <UserProvider user={user} setUser={setUser}>
      <Router>
        <NavBar logout={logout} />
        <Routes>
          <Route path="/" element={user ? <Homepage /> : <Navigate to="/login" />} />
          <Route
            path="/artists"
            element={
              user ? (
                <>
                  <SearchForm onSearch={handleSearch} />
                  <ArtistList key={searchTerm} searchTerm={searchTerm} clearSearchTerm={clearSearchTerm} />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/login" element={<LoginForm login={login} />} />
          <Route path="/signup" element={<SignupForm signup={signup} />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;