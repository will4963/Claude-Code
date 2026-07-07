import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types';
import {
  getCurrentUser, setCurrentUser, getUsers, saveUser,
  findUserByEmail, savePassword, verifyPassword,
} from '../utils/storage';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getCurrentUser());

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  async function signup(name: string, email: string, password: string) {
    if (findUserByEmail(email)) throw new Error('An account with this email already exists.');
    if (password.length < 6) throw new Error('Password must be at least 6 characters.');
    const users = getUsers();
    const newUser: User = {
      id: crypto.randomUUID(),
      email: email.trim().toLowerCase(),
      name: name.trim(),
      createdAt: new Date().toISOString(),
      isAdmin: users.length === 0,
    };
    saveUser(newUser);
    savePassword(newUser.id, password);
    setUser(newUser);
  }

  async function login(email: string, password: string) {
    const found = findUserByEmail(email.trim().toLowerCase());
    if (!found) throw new Error('No account found with that email.');
    if (!verifyPassword(found.id, password)) throw new Error('Incorrect password. Try again.');
    setUser(found);
  }

  function logout() {
    setUser(null);
  }

  function updateUser(updates: Partial<User>) {
    if (!user) return;
    const updated = { ...user, ...updates };
    saveUser(updated);
    setUser(updated);
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
