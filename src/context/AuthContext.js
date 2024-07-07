import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { openDB, deleteDB } from 'idb';

const DB_NAME = 'authDB';
const STORE_NAME = 'authStore';

const users = [
  { username: 'admin', password: 'admin@123', role: 'admin' },
  { username: 'user', password: 'user@123', role: 'user' },
];

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      },
    }).then(db => {
      db.get(STORE_NAME, 'authenticated').then(value => {
        if (value) {
          setAuthenticated(true);
        }
        setLoading(false);
      });
    });
  }, []);

  const login = (username, password) => {
    const user = users.find(u => u.username === username);
    if (user && password === user.password) {
      setAuthenticated(true);
      openDB(DB_NAME, 1).then(db => {
        db.put(STORE_NAME, { id: 'authenticated', value: true });
      });
      router.push('/');
    } else {
      console.log('Authentication failed');
    }
  };

  const logout = async () => {
    try {
      setAuthenticated(false);
      await deleteDB(DB_NAME);
      router.push('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ authenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthProvider, useAuth };
