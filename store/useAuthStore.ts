import { create } from 'zustand';
import api from '../services/api';
import { User } from '../types';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (credentials: { email: string; password:string }) => Promise<boolean>;
  hrdLogin: (credentials: { email: string; password: string }) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const token = 'mock-jwt-token-candidate';
      const user: User = { 
        id: '1', 
        name: 'Budi Doremi', 
        email: credentials.email, 
        location: 'Jakarta, Indonesia', 
        onlineStatus: 'online', 
        role: 'candidate',
        avatarUrl: `https://i.pravatar.cc/150?u=${credentials.email}`
      };

      localStorage.setItem('token', token);
      localStorage.setItem('role', 'candidate');
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      set({ isAuthenticated: true, user, token, loading: false });
      return true;
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Login gagal. Periksa kembali email dan password Anda.';
      set({ error: errorMsg, loading: false });
      return false;
    }
  },

  hrdLogin: async (credentials) => {
    set({ loading: true, error: null });
    try {
      // Mocking HRD login to allow frontend to work without a running backend.
      await new Promise(resolve => setTimeout(resolve, 500));
      const token = 'mock-jwt-token-hrd';
      const user: User = {
        id: 'hrd1',
        name: 'HRD Admin',
        email: credentials.email,
        location: 'Kantor Pusat',
        onlineStatus: 'online',
        role: 'hrd',
        avatarUrl: `https://i.pravatar.cc/150?u=${credentials.email}`
      };

      localStorage.setItem('token', token);
      localStorage.setItem('role', 'hrd');
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      set({ isAuthenticated: true, user, token, loading: false });
      return true;
    } catch (err: any) {
      // This catch block will likely not be reached with the mocked implementation,
      // but it is kept for consistency.
      const errorMsg = 'Login HRD Gagal. Akses ditolak.';
      set({ error: errorMsg, loading: false });
      return false;
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ loading: false });
      return true;
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Registrasi gagal. Coba lagi.';
      set({ error: errorMsg, loading: false });
      return false;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    delete api.defaults.headers.common['Authorization'];
    set({ isAuthenticated: false, user: null, token: null });
  },

  checkAuth: () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role') as 'candidate' | 'hrd' | null;
    if (token && role) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        let user: User;
        if (role === 'hrd') {
            user = { id: 'hrd1', name: 'HRD Admin', email: 'hrd@gmail.com', location: 'Kantor Pusat', onlineStatus: 'online', role: 'hrd', avatarUrl: 'https://i.pravatar.cc/150?u=hrd@example.com' };
        } else {
            user = { id: '1', name: 'Budi Doremi', email: 'budi.doremi@gmail.com', location: 'Jakarta, Indonesia', onlineStatus: 'online', role: 'candidate', avatarUrl: 'https://i.pravatar.cc/150?u=budi.doremi@example.com' };
        }
        set({ isAuthenticated: true, token, user });
    }
  }
}));
