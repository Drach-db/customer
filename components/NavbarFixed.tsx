'use client';

import { useUIStore } from '@/lib/store/ui-store';
import { useUserStore } from '@/lib/store/user-store';
import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Home,
  Inbox,
  Users,
  Settings,
  ChevronLeft,
  MessageSquare,
  BarChart,
  LogOut,
  type LucideIcon
} from 'lucide-react';
import { TEXT_COLORS, SHARED_CLASSES } from '@/lib/constants/colors';
import { signOut, getCurrentUser } from '@/lib/auth/auth';

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Inbox, label: 'Inbox', href: '/inbox' },
  { icon: MessageSquare, label: 'Conversations', href: '/conversations' },
  { icon: Users, label: 'Contacts', href: '/contacts' },
  { icon: BarChart, label: 'Analytics', href: '/analytics' },
  { icon: Settings, label: 'Settings', href: '/settings' },
] as const;

export default function NavbarFixed() {
  const { toggleNavbar } = useUIStore();
  const { email: userEmail, name: userName, setUser, clearUser } = useUserStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Load user data on mount only if not already in store
  useEffect(() => {
    async function loadUser() {
      // Skip if we already have user data (from localStorage)
      if (userEmail || userName) {
        return;
      }

      const user = await getCurrentUser();
      if (user) {
        const email = user.email || '';
        const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
        setUser(email, name);
      }
    }
    loadUser();
  }, [setUser, userEmail, userName]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleToggle = () => {
    toggleNavbar();
    // Toggle CSS class
    document.documentElement.classList.toggle('navbar-collapsed');
  };

  const handleLogout = async () => {
    await signOut();
    clearUser(); // Clear after signOut to ensure localStorage is cleared
    router.push('/login');
  };

  return (
    <nav className="navbar-fixed">
      {/* Header */}
      <div className="navbar-header">
        <div className="navbar-logo">
          <div className="navbar-logo-icon">M</div>
          <span className="navbar-logo-text">Marketel</span>
        </div>
        <button onClick={handleToggle} className="navbar-toggle">
          <ChevronLeft className="navbar-toggle-icon" />
        </button>
      </div>

      {/* Navigation Items */}
      <div className="navbar-nav">
        <ul>
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className={pathname === item.href ? 'active' : ''}
              >
                <div className="nav-icon">
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="nav-text">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer - User Profile */}
      <div className="navbar-footer" ref={userMenuRef}>
        <div
          className="navbar-user"
          onClick={() => setShowUserMenu(!showUserMenu)}
        >
          <div className="navbar-avatar">
            {(userName || 'G').charAt(0).toUpperCase()}
          </div>
          <div className="navbar-user-info">
            <p className="navbar-user-name">{userName || 'Guest'}</p>
            <p className="navbar-user-email">{userEmail || 'Not logged in'}</p>
          </div>
        </div>

        {/* Dropdown Menu */}
        {showUserMenu && (
          <div className="navbar-dropdown">
            <button onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}