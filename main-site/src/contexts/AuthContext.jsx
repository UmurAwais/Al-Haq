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
        // Set basic user info immediately to unblock UI
        setUser(prev => ({ ...prev, ...currentUser, uid: currentUser.uid }));
        setLoading(false);

        // Fetch extended data in background
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUser(prev => ({ ...prev, ...userDoc.data(), uid: currentUser.uid }));
          }
        } catch (error) {
          console.error("Error fetching background user data:", error);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
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
