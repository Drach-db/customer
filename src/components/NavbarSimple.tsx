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

// Components
interface ToggleButtonProps {
  onClick: (e: React.MouseEvent) => void;
  isExpanded: boolean;
}

function ToggleButton({ onClick, isExpanded }: ToggleButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-1.5 rounded-lg ${SHARED_CLASSES.hover} ${SHARED_CLASSES.transition} ${TEXT_COLORS.primary} hover:text-gray-900 ${isExpanded ? 'flex-shrink-0' : 'mx-auto'}`}
      aria-label={isExpanded ? 'Collapse navbar' : 'Expand navbar'}
    >
      <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${!isExpanded && 'rotate-180'}`} />
    </button>
  );
}

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  isExpanded: boolean;
  isActive: boolean;
}

function NavItem({ icon: Icon, label, href, isExpanded, isActive }: NavItemProps) {
  return (
    <li>
      <a
        href={href}
        className={`flex items-center h-10 rounded-lg ${TEXT_COLORS.primary} hover:text-gray-900 ${SHARED_CLASSES.hover} transition-all duration-200 group ${isActive ? 'active-state' : ''}`}
        title={!isExpanded ? label : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        {isExpanded && (
          <span className="text-sm font-medium whitespace-nowrap overflow-hidden pr-3">
            {label}
          </span>
        )}
      </a>
    </li>
  );
}

export default function NavbarSimple() {
  const { isNavbarExpanded, toggleNavbar } = useUIStore();
  const { email: userEmail, name: userName, setUser, clearUser } = useUserStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Load user data on mount
  useEffect(() => {
    async function loadUser() {
      const user = await getCurrentUser();
      if (user) {
        const email = user.email || '';
        const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
        setUser(email, name);
      }
    }
    loadUser();
  }, [setUser]);

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

  const handleEmptyAreaClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const isClickableElement = target.closest('a, button');

    if (!isClickableElement) {
      toggleNavbar();
    }
  };

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleNavbar();
  };

  const handleLogout = async () => {
    clearUser();
    await signOut();
    router.push('/login');
  };

  return (
    <nav
      className={`
        fixed left-4 top-4 bottom-4
        transition-all duration-300 ease-out
        ${isNavbarExpanded ? 'w-52' : 'w-14'}
        ${SHARED_CLASSES.panel}
        flex flex-col
        z-50
      `}
      onClick={handleEmptyAreaClick}
    >
      {/* Header */}
      <div className={`flex items-center h-16 px-2 ${!isNavbarExpanded ? 'justify-center' : ''}`}>
        {isNavbarExpanded ? (
          <>
            <div className={`w-8 h-8 rounded-lg ${SHARED_CLASSES.avatar} avatar-brand text-sm shadow-sm flex-shrink-0 ml-1`}>
              M
            </div>
            <span className={`font-semibold ${TEXT_COLORS.primary} ml-2 mr-auto`}>Marketel</span>
            <div className="pr-1">
              <ToggleButton onClick={handleToggleClick} isExpanded={isNavbarExpanded} />
            </div>
          </>
        ) : (
          <ToggleButton onClick={handleToggleClick} isExpanded={isNavbarExpanded} />
        )}
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isExpanded={isNavbarExpanded}
              isActive={pathname === item.href}
            />
          ))}
        </ul>
      </div>

      {/* Footer - User Profile */}
      <div className="p-2 relative" ref={userMenuRef}>
        <div
          className={`relative flex items-center h-12 rounded-lg ${SHARED_CLASSES.hover} transition-all duration-200 cursor-pointer`}
          onClick={(e) => {
            e.stopPropagation();
            setShowUserMenu(!showUserMenu);
          }}
        >
          {/* Avatar */}
          <div className="absolute top-1/2 -translate-y-1/2" style={{ left: '20px', transform: 'translateY(-50%) translateX(-50%)' }}>
            <div className={`w-8 h-8 rounded-full ${SHARED_CLASSES.avatar} avatar-soft-blue text-sm flex-shrink-0`}>
              {(userName || 'G').charAt(0).toUpperCase()}
            </div>
          </div>

          {/* User info */}
          {isNavbarExpanded && (
            <div className="flex-1 min-w-0 ml-11 pr-2">
              <p className={`text-sm font-medium ${TEXT_COLORS.primary} truncate`}>{userName || 'Guest'}</p>
              <p className={`text-xs ${TEXT_COLORS.secondary} truncate`}>{userEmail || 'Not logged in'}</p>
            </div>
          )}
        </div>

        {/* Dropdown Menu */}
        {showUserMenu && (
          <div className={`absolute bottom-full mb-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden ${isNavbarExpanded ? 'left-2 right-2' : 'left-2 w-40'}`}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLogout();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 ${SHARED_CLASSES.hover} transition-colors ${TEXT_COLORS.primary} hover:text-gray-900`}
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}