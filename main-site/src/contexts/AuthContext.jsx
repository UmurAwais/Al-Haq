import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('last_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(!localStorage.getItem('last_user'));

  useEffect(() => {
    if (user) {
      localStorage.setItem('last_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('last_user');
    }
  }, [user]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUser({ ...currentUser, ...userDoc.data(), uid: currentUser.uid });
          } else {
            // Keep existing user state if available from cache, otherwise fallback
            setUser(prev => prev || currentUser);
          }
        } catch (error) {
          console.error("Error fetching user data (offline or error):", error);
          // Don't overwrite state with basic currentUser if we already have cached data
          // This prevents data "disappearing" when network is flaky
          setUser(prev => prev || currentUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = () => auth.signOut();

  const value = {
    user,
    setUser,
    loading,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
