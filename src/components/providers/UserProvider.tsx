'use client';

import { useRef } from 'react';
import { useUserStore } from '@/lib/store/user-store';

interface UserProviderProps {
  initialUser: {
    email: string;
    name: string;
  } | null;
  children: React.ReactNode;
}

export default function UserProvider({ initialUser, children }: UserProviderProps) {
  const initialized = useRef(false);

  // Устанавливаем данные синхронно ДО первого рендера
  if (!initialized.current && initialUser) {
    useUserStore.setState({
      email: initialUser.email,
      name: initialUser.name,
    });
    initialized.current = true;
  }

  return <>{children}</>;
}
