'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal, Folder } from 'lucide-react';
import { TicketSource, SourceIcon, TICKET_SOURCES } from '@/lib/constants/ticket-sources';
import { TEXT_COLORS, SHARED_CLASSES } from '@/lib/constants/colors';

// Tag component
const TAG_BASE_CLASS = 'text-xs px-2 py-1 rounded-md flex items-center gap-1.5';

interface TagProps {
  children: React.ReactNode;
  className?: string;
}

function Tag({ children, className = '' }: TagProps) {
  return <span className={`${TAG_BASE_CLASS} ${className}`}>{children}</span>;
}

// Types
interface Ticket {
  id: string;
  subject: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  status: 'open' | 'pending' | 'closed';
  project: string;
  source: TicketSource;
}

// Mock data
const mockTickets: Ticket[] = [
  {
    id: '1',
    subject: 'Payment Issue',
    lastMessage: 'I cannot complete the payment process...',
    time: '2m ago',
    unread: true,
    status: 'open',
    project: 'E-commerce',
    source: 'email',
  },
  {
    id: '2',
    subject: 'Product Question',
    lastMessage: 'What are the shipping options?',
    time: '15m ago',
    unread: true,
    status: 'open',
    project: 'Support',
    source: 'chat',
  },
  {
    id: '3',
    subject: 'Refund Request',
    lastMessage: 'Thank you for your help!',
    time: '1h ago',
    unread: false,
    status: 'pending',
    project: 'E-commerce',
    source: 'telegram',
  },
  {
    id: '4',
    subject: 'Account Access',
    lastMessage: 'I forgot my password',
    time: '3h ago',
    unread: false,
    status: 'open',
    project: 'Support',
    source: 'instagram',
  },
  {
    id: '5',
    subject: 'Feature Request',
    lastMessage: 'Can you add dark mode to the app?',
    time: '5h ago',
    unread: false,
    status: 'open',
    project: 'Product',
    source: 'email',
  },
  {
    id: '6',
    subject: 'Bug Report',
    lastMessage: 'The search function is not working properly',
    time: '6h ago',
    unread: true,
    status: 'open',
    project: 'Technical',
    source: 'chat',
  },
  {
    id: '7',
    subject: 'Billing Question',
    lastMessage: 'When will I be charged?',
    time: '8h ago',
    unread: false,
    status: 'closed',
    project: 'Finance',
    source: 'telegram',
  },
  {
    id: '8',
    subject: 'Account Upgrade',
    lastMessage: 'I want to upgrade to premium',
    time: '10h ago',
    unread: false,
    status: 'pending',
    project: 'Sales',
    source: 'instagram',
  },
  {
    id: '9',
    subject: 'Technical Support',
    lastMessage: 'API integration not working',
    time: '12h ago',
    unread: false,
    status: 'open',
    project: 'Technical',
    source: 'email',
  },
  {
    id: '10',
    subject: 'Data Export',
    lastMessage: 'How can I export my data?',
    time: '14h ago',
    unread: false,
    status: 'closed',
    project: 'Support',
    source: 'chat',
  },
  {
    id: '11',
    subject: 'Password Reset',
    lastMessage: 'Not receiving reset email',
    time: '16h ago',
    unread: true,
    status: 'open',
    project: 'Security',
    source: 'telegram',
  },
  {
    id: '12',
    subject: 'Mobile App Issue',
    lastMessage: 'App crashes on startup',
    time: '18h ago',
    unread: false,
    status: 'pending',
    project: 'Mobile',
    source: 'instagram',
  },
  {
    id: '13',
    subject: 'Order Tracking',
    lastMessage: 'Where is my order?',
    time: '1d ago',
    unread: false,
    status: 'closed',
    project: 'E-commerce',
    source: 'email',
  },
  {
    id: '14',
    subject: 'Subscription Cancel',
    lastMessage: 'I want to cancel my subscription',
    time: '1d ago',
    unread: false,
    status: 'pending',
    project: 'Finance',
    source: 'chat',
  },
  {
    id: '15',
    subject: 'Security Question',
    lastMessage: 'Is my data encrypted?',
    time: '2d ago',
    unread: false,
    status: 'closed',
    project: 'Security',
    source: 'telegram',
  },
];

// Constants
const STATUS_COLORS = {
  open: 'badge-open',
  pending: 'badge-pending',
  closed: 'badge-closed',
} as const;

interface TicketsListProps {
  onTicketSelect: (ticketId: string) => void;
  selectedTicketId?: string;
}

export default function TicketsList({ onTicketSelect, selectedTicketId }: TicketsListProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className={`w-96 ${SHARED_CLASSES.panel} flex flex-col overflow-hidden relative`}>
      {/* Search & Filter - прозрачная шапка */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-white/40 backdrop-blur-md z-10">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${TEXT_COLORS.secondary}`} />
            <input
              type="text"
              placeholder="Search tickets..."
              className={`w-full h-10 pl-9 pr-3 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg text-sm ${TEXT_COLORS.primary} placeholder-gray-400 focus:outline-none transition-colors shadow-sm`}
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="h-10 w-10 flex items-center justify-center rounded-lg transition-all duration-200 group"
            >
              <SlidersHorizontal className={`w-5 h-5 ${TEXT_COLORS.primary} group-hover:rotate-90 transition-transform duration-300`} />
            </button>

            {/* Filter Dropdown */}
            {showFilters && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10">
                <button className={`w-full text-left px-3 py-2 text-sm ${TEXT_COLORS.primary} ${SHARED_CLASSES.hover} rounded-lg ${SHARED_CLASSES.transition}`}>
                  All tickets
                </button>
                <button className={`w-full text-left px-3 py-2 text-sm ${TEXT_COLORS.primary} ${SHARED_CLASSES.hover} rounded-lg ${SHARED_CLASSES.transition}`}>
                  Unread only
                </button>
                <button className={`w-full text-left px-3 py-2 text-sm ${TEXT_COLORS.primary} ${SHARED_CLASSES.hover} rounded-lg ${SHARED_CLASSES.transition}`}>
                  Open
                </button>
                <button className={`w-full text-left px-3 py-2 text-sm ${TEXT_COLORS.primary} ${SHARED_CLASSES.hover} rounded-lg ${SHARED_CLASSES.transition}`}>
                  Pending
                </button>
                <button className={`w-full text-left px-3 py-2 text-sm ${TEXT_COLORS.primary} ${SHARED_CLASSES.hover} rounded-lg ${SHARED_CLASSES.transition}`}>
                  Closed
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tickets List - с кастомным скроллбаром */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3 custom-scrollbar">
        {/* Spacer for header */}
        <div className="h-20"></div>
        {mockTickets.map((ticket) => (
          <button
            key={ticket.id}
            onClick={() => onTicketSelect(ticket.id)}
            className={`
              w-full p-5 text-left rounded-xl
              border border-gray-200
              hover-peach
              ${selectedTicketId === ticket.id ? 'active-state' : 'bg-white'}
            `}
          >
            {/* Subject and Time */}
            <div className="flex items-center justify-between mb-2">
              <p
                className={`text-sm font-medium ${TEXT_COLORS.primary} truncate ${
                  ticket.unread ? 'font-semibold' : ''
                }`}
              >
                {ticket.subject}
              </p>
              <span className={`text-xs ${TEXT_COLORS.secondary} flex-shrink-0 ml-2`}>{ticket.time}</span>
            </div>

            {/* Last message */}
            <p className={`text-xs ${TEXT_COLORS.secondary} truncate mb-3`}>{ticket.lastMessage}</p>

            {/* Bottom row: Project, Source and Status */}
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className={`bg-gray-100 ${TEXT_COLORS.primary}`}>
                <Folder className="w-3.5 h-3.5" />
                {ticket.project}
              </Tag>
              <Tag className={`bg-gray-100 ${TEXT_COLORS.primary}`}>
                <SourceIcon source={ticket.source} />
                {TICKET_SOURCES[ticket.source].label}
              </Tag>
              <span className="flex-1"></span>
              <Tag
                className={`flex-shrink-0 ${
                  ticket.unread
                    ? 'badge-open'
                    : STATUS_COLORS[ticket.status]
                }`}
              >
                {ticket.unread ? 'unread' : ticket.status}
              </Tag>
            </div>
          </button>
        ))}
        {/* Spacer for bottom */}
        <div className="h-4"></div>
      </div>
    </div>
  );
}
