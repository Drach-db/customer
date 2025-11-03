'use client';

import { createContext, useContext, useEffect, useRef } from 'react';
import { useUserStore } from '@/lib/store/user-store';

interface User {
  email: string;
  name: string;
}

interface UserContextType {
  user: User | null;
}

const UserContext = createContext<UserContextType>({ user: null });

export function UserProvider({
  children,
  initialUser
}: {
  children: React.ReactNode;
  initialUser: User | null;
}) {
  const initialized = useRef(false);
  const setUser = useUserStore((state) => state.setUser);

  // Гидрируем Zustand store с данными с сервера СИНХРОННО
  if (!initialized.current && initialUser) {
    useUserStore.setState({
      email: initialUser.email,
      name: initialUser.name,
    });
    initialized.current = true;
  }

  // Также обновляем если initialUser изменился (navigation между страницами)
  useEffect(() => {
    if (initialUser) {
      setUser(initialUser.email, initialUser.name);
    }
  }, [initialUser, setUser]);

  return (
    <UserContext.Provider value={{ user: initialUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
