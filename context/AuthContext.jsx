// context/AuthContext.jsx
'use client'
import { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();
const AUTH_COOKIE_NAME = 'streamline-user';
const DEFAULT_SESSION_DAYS = 7;

const sanitizeUserData = (userData) => {
  if (!userData || typeof userData !== 'object') return null;

  const { id, username, email } = userData;

  const safeUser = {};

  if (id !== undefined && id !== null) safeUser.id = id;
  if (username) safeUser.username = username;
  if (email) safeUser.email = email;

  const hasSensitiveData = Object.prototype.hasOwnProperty.call(userData, 'password') ||
    Object.prototype.hasOwnProperty.call(userData, 'passwordHash') ||
    Object.prototype.hasOwnProperty.call(userData, 'hashedPassword');

  if (hasSensitiveData || (!safeUser.id && !safeUser.username)) {
    return null;
  }

  return safeUser;
};

const getStoredUser = () => {
  const cookieValue = Cookies.get(AUTH_COOKIE_NAME);

  if (!cookieValue) return null;

  try {
    const parsedUser = JSON.parse(cookieValue);
    const safeUser = sanitizeUserData(parsedUser);

    if (!safeUser) {
      Cookies.remove(AUTH_COOKIE_NAME);
      return null;
    }

    return safeUser;
  } catch (error) {
    Cookies.remove(AUTH_COOKIE_NAME);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const login = (userData, expiresInDays = DEFAULT_SESSION_DAYS) => {
    const safeUser = sanitizeUserData(userData);
    setUser(safeUser);

    if (safeUser) {
      Cookies.set(AUTH_COOKIE_NAME, JSON.stringify(safeUser), {
        expires: expiresInDays,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });
      return;
    }

    Cookies.remove(AUTH_COOKIE_NAME);
  };

  const logout = () => {
    setUser(null);
    Cookies.remove(AUTH_COOKIE_NAME);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
