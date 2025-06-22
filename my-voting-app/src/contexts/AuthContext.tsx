import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hardcoded credentials for demo
const DEMO_CREDENTIALS = [
  { username: 'admin', password: 'admin123' },
  { username: 'voter1', password: 'vote123' },
  { username: 'demo', password: 'demo123' }
];

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('voting_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (username: string, password: string): boolean => {
    const validCredential = DEMO_CREDENTIALS.find(
      cred => cred.username === username && cred.password === password
    );

    if (validCredential) {
      const newUser: User = {
        id: Date.now().toString(),
        username,
        isAuthenticated: true
      };
      setUser(newUser);
      localStorage.setItem('voting_user', JSON.stringify(newUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('voting_user');
    localStorage.removeItem('voting_data');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

