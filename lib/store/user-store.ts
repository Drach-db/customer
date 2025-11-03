import { create } from 'zustand';

interface UserState {
  email: string;
  name: string;
  setUser: (email: string, name: string) => void;
  clearUser: () => void;
}

// Данные приходят с сервера через SSR, persist не нужен
export const useUserStore = create<UserState>()((set) => ({
  email: '',
  name: '',
  setUser: (email, name) => set({ email, name }),
  clearUser: () => set({ email: '', name: '' }),
}));
