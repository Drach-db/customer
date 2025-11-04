import { useUIStore } from '@/lib/store/ui-store';
import { useUserStore } from '@/lib/store/user-store';
import { useTheme } from '@/contexts/ThemeContext';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Home,
  Inbox,
  Users,
  Settings,
  ChevronLeft,
  MessageSquare,
  BarChart,
  LogOut,
  Sun,
  Moon,
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
  const { theme, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
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
    window.location.href = '/login'; // Force reload to update auth state
  };

  const handleNavbarClick = (e: React.MouseEvent<HTMLElement>) => {
    // Check if click is on a clickable element
    const target = e.target as HTMLElement;
    const isClickable = target.closest('button, a, .navbar-user');

    // If not clickable element, toggle navbar
    if (!isClickable) {
      handleToggle();
    }
  };

  return (
    <nav className="navbar-fixed" onClick={handleNavbarClick}>
      {/* Header */}
      <div className="navbar-header">
        <div className="navbar-logo">
          <div className="navbar-logo-icon">M</div>
          <span className="navbar-logo-text">Marketel</span>
        </div>
        <button onClick={(e) => { e.stopPropagation(); handleToggle(); }} className="navbar-toggle">
          <ChevronLeft className="navbar-toggle-icon" />
        </button>
      </div>

      {/* Navigation Items */}
      <div className="navbar-nav">
        <ul>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className={pathname === item.href ? 'active' : ''}
              >
                <div className="nav-icon">
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="nav-text">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Theme Toggle */}
      <div className="navbar-theme-toggle">
        <button
          onClick={(e) => { e.stopPropagation(); toggleTheme(); }}
          className="theme-toggle-btn"
          aria-label="Toggle theme"
        >
          <div className="nav-icon">
            {theme === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </div>
          <span className="nav-text">
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </span>
        </button>
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