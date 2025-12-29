import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import APILogger from '../lib/logger';

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
    APILogger.request('POST', '/api/v1/auth/login', { username, password: '***' });
    
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
      
      APILogger.response('/api/v1/auth/login', 200, {
        success: true,
        user: { id: newUser.id, username: newUser.username },
        token: 'jwt_token_' + Date.now(),
        message: 'Authentication successful'
      }, 150);
      
      return true;
    }
    
    APILogger.response('/api/v1/auth/login', 401, {
      success: false,
      error: 'Invalid credentials',
      message: 'Username or password is incorrect'
    }, 120);
    
    return false;
  };

  const logout = () => {
    APILogger.request('POST', '/api/v1/auth/logout', { userId: user?.id });
    
    setUser(null);
    localStorage.removeItem('voting_user');
    localStorage.removeItem('voting_data');
    
    APILogger.response('/api/v1/auth/logout', 200, {
      success: true,
      message: 'Session terminated successfully'
    }, 50);
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

