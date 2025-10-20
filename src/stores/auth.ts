import { create } from 'zustand';
import { supabase } from '@/services/supabase';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  department: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Mock user data for demo
        const mockUser: User = {
          id: data.user.id,
          email: data.user.email || '',
          name: '管理员',
          role: 'admin',
          department: '信息宣传部',
        };
        set({ user: mockUser, isAuthenticated: true });
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await supabase.auth.signOut();
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  checkAuth: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const mockUser: User = {
          id: user.id,
          email: user.email || '',
          name: '管理员',
          role: 'admin',
          department: '信息宣传部',
        };
        set({ user: mockUser, isAuthenticated: true });
      }
    } catch (error) {
      console.error('Auth check error:', error);
    }
  },
}));