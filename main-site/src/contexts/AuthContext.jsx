import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

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
    let snapshotUnsubscribe = null;

    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      // Clean up previous snapshot listener if it exists
      if (snapshotUnsubscribe) {
        snapshotUnsubscribe();
        snapshotUnsubscribe = null;
      }

      if (currentUser) {
        // Set basic user info immediately from Firebase Auth
        setUser(prev => ({ 
          ...prev, 
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL
        }));
        setLoading(false);

        // Listen for real-time updates for extended data (referenceNumber, etc)
        const userDocRef = doc(db, 'users', currentUser.uid);
        snapshotUnsubscribe = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            setUser(prev => ({ ...prev, ...doc.data(), uid: currentUser.uid }));
          }
        }, (error) => {
          // Suppress "offline" errors as they are handled by Firestore's persistence
          if (error.code !== 'unavailable' && !error.message.includes('offline')) {
            console.error("Error in user data listener:", error);
          }
        });
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      if (snapshotUnsubscribe) snapshotUnsubscribe();
    }
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
