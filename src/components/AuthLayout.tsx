import { Outlet, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NavbarFixed from './NavbarFixed';
import { getCurrentUser } from '@/lib/auth/auth';
import { useUserStore } from '@/lib/store/user-store';

export default function AuthLayout() {
  const { email: userEmail } = useUserStore();

  // Start with optimistic auth if we have user data in localStorage
  const [authState, setAuthState] = useState<'loading' | 'authenticated' | 'unauthenticated'>(
    userEmail ? 'authenticated' : 'loading'
  );

  useEffect(() => {
    // Always verify auth with server
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const user = await getCurrentUser();
    setAuthState(user ? 'authenticated' : 'unauthenticated');
  };

  // If unauthenticated, redirect immediately
  if (authState === 'unauthenticated') {
    return <Navigate to="/login" replace />;
  }

  // Always show the layout with navbar for loading and authenticated states
  return (
    <div className="flex h-screen overflow-hidden">
      <NavbarFixed />

      {/* Main Content - adjusted for navbar width */}
      <div className="inbox-content flex flex-1 transition-all duration-300">
        {authState === 'loading' && (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-gray-600">Loading...</div>
          </div>
        )}
        {authState === 'authenticated' && <Outlet />}
      </div>
    </div>
  );
}