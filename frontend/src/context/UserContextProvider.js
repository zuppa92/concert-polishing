// src/context/UserContextProvider.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import ConcertApi from '../services/api';

const UserContext = createContext();

export const UserProvider = ({ children, initialUser }) => {
  const [user, setUser] = useState(initialUser || null);

  useEffect(() => {
    async function fetchUser() {
      if (!user) {
        try {
          const currentUser = await ConcertApi.getCurrentUser();
          setUser(currentUser);
        } catch (err) {
          console.error('Failed to fetch current user:', err);
          setUser(null);
        }
      }
    }

    fetchUser();
  }, [user]);

  console.log('UserProvider user:', user); // Debugging statement

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};