import { getCurrentUserServer } from '@/lib/supabase/server';
import { UserProvider } from '@/lib/contexts/UserContext';
import InboxClient from './InboxClient';

// Server Component - загружаем user на сервере
export default async function InboxPage() {
  // Получаем user с сервера - это происходит ДО рендера на клиенте
  const user = await getCurrentUserServer();

  return (
    <UserProvider initialUser={user}>
      <InboxClient />
    </UserProvider>
  );
}
