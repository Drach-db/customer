import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserState {
  email: string;
  name: string;
  setUser: (email: string, name: string) => void;
  clearUser: () => void;
}

// Use persist to avoid flashing "Guest/Not logged in" on page refresh
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      email: '',
      name: '',
      setUser: (email, name) => set({ email, name }),
      clearUser: () => set({ email: '', name: '' }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
