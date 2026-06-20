/**
 * Authentication Context Provider for session tracking and JWT emulation.
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Employee } from '../types';
import { apiClient } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  updateProfile: (data: Partial<Employee>) => Promise<void>;
  changePassword: (oldPw: string, newPw: string) => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Attempt session restoration on startup
    const storedUser = localStorage.getItem('ems_current_user');
    const token = localStorage.getItem('ems_jwt_token');

    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        // Corrupt local state, clean up
        localStorage.removeItem('ems_current_user');
        localStorage.removeItem('ems_jwt_token');
      }
    }
    setIsLoading(false);

    // Dynamic session listening for API token expiration trigger
    const handleAuthExpired = () => {
      setUser(null);
      setError('Your dynamic session has expired. Please sign in again.');
    };

    window.addEventListener('auth-expired', handleAuthExpired);
    return () => {
      window.removeEventListener('auth-expired', handleAuthExpired);
    };
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<{ token: string; user: User }>('/auth/login', {
        email: email.trim().toLowerCase(),
        password,
      });

      localStorage.setItem('ems_jwt_token', response.data.token);
      localStorage.setItem('ems_current_user', JSON.stringify(response.data.user));
      setUser(response.data.user);
      return response.data.user;
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || 'Invalid email or password';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('ems_jwt_token');
    localStorage.removeItem('ems_current_user');
    setUser(null);
  };

  const updateProfile = async (data: Partial<Employee>): Promise<void> => {
    if (!user) throw new Error('Unauthenticated user context');
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Update user state
        const updatedUser: User = {
          ...user,
          firstName: data.firstName || user.firstName,
          lastName: data.lastName || user.lastName,
          email: data.email || user.email,
        };
        setUser(updatedUser);
        localStorage.setItem('ems_current_user', JSON.stringify(updatedUser));

        resolve();
      }, 500);
    });
  };

  const changePassword = async (oldPw: string, newPw: string): Promise<void> => {
    if (!user) throw new Error('Unauthenticated user context');
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!oldPw || !newPw) {
          reject(new Error('Passwords cannot be empty'));
          return;
        }
        resolve();
      }, 600);
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      updateProfile,
      changePassword,
      error
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be called inside an AuthProvider scope');
  }
  return context;
}
