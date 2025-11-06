'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { Search, SlidersHorizontal, Folder, RefreshCw, AlertCircle } from 'lucide-react';
import { SourceIcon, TICKET_SOURCES } from '@/lib/constants/ticket-sources';
import { TEXT_COLORS } from '@/lib/constants/colors';
import { getTickets, type TicketWithRelations } from '@/lib/services/tickets';
import { useAuth } from '@/lib/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import PlaceholderState from './PlaceholderState';
import Multiselect from './Multiselect';
import { TICKET_STATUS, CONNECTOR_TYPE } from '@/lib/types/enums';

// Tag component using global CSS
interface TagProps {
  children: React.ReactNode;
  className?: string;
}

function Tag({ children, className = '' }: TagProps) {
  return <span className={`tag ${className}`}>{children}</span>;
}

// Types
type FilterStatus = 'all' | 'unread' | 'open' | 'pending' | 'closed' | 'resolved';

// Constants
const STATUS_COLORS = {
  open: 'badge-open',
  pending: 'badge-pending',
  resolved: 'badge-closed',
  closed: 'badge-closed',
} as const;

interface TicketsListProps {
  onTicketSelect: (ticketId: string) => void;
  selectedTicketId?: string;
}

export default function TicketsList({ onTicketSelect, selectedTicketId }: TicketsListProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [tickets, setTickets] = useState<TicketWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [filterProject, setFilterProject] = useState<string[]>([]);
  const [filterSource, setFilterSource] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const { currentWorkspace } = useAuth();

  // Load tickets
  useEffect(() => {
    if (currentWorkspace) {
      loadTickets();
    } else {
      setTickets([]);
      setLoading(false);
    }
  }, [currentWorkspace]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    };

    if (showFilters) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilters]);

  const loadTickets = async () => {
    if (!currentWorkspace) {
      setError('No workspace selected');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getTickets(currentWorkspace.id);
      setTickets(data);
    } catch (err: any) {
      console.error('Error loading tickets:', err);
      setError(err.message || 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  // Memoize filtered tickets to avoid recalculation on every render
  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      // Status filter
      if (filterStatus.length > 0) {
        const hasUnread = filterStatus.includes('unread');
        const otherStatuses = filterStatus.filter(s => s !== 'unread');

        const matchesUnread = hasUnread && !ticket.last_message?.read_at;
        const matchesStatus = otherStatuses.length > 0 && otherStatuses.includes(ticket.status);

        if (!matchesUnread && !matchesStatus) {
          return false;
        }
      }

      // Project filter
      if (filterProject.length > 0 && !filterProject.includes(ticket.project?.id || '')) {
        return false;
      }

      // Source filter
      if (filterSource.length > 0 && !filterSource.includes(ticket.connector?.type || '')) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          ticket.subject.toLowerCase().includes(query) ||
          ticket.customer?.name.toLowerCase().includes(query) ||
          ticket.customer?.email?.toLowerCase().includes(query) ||
          ticket.last_message?.content.toLowerCase().includes(query);

        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [tickets, filterStatus, filterProject, filterSource, searchQuery]);

  const formatTicketTime = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return date;
    }
  };

  // Show empty states instead of the full component
  if (loading && !tickets.length) {
    return (
      <PlaceholderState
        icon={RefreshCw}
        title="Loading tickets"
        description="Please wait"
        animateIcon={true}
        width="w-96"
      />
    );
  }

  if (!currentWorkspace && !loading) {
    return (
      <PlaceholderState
        icon={Folder}
        title="No workspace selected"
        description="Select a workspace to view tickets"
        width="w-96"
      />
    );
  }

  if (error && !loading) {
    return (
      <PlaceholderState
        icon={AlertCircle}
        title="Error loading tickets"
        description={error}
        width="w-96"
      >
        <button
          onClick={loadTickets}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
        >
          Retry
        </button>
      </PlaceholderState>
    );
  }

  if (!loading && !error && currentWorkspace && filteredTickets.length === 0 && tickets.length === 0) {
    return (
      <PlaceholderState
        icon={Search}
        title="No tickets yet"
        description="Tickets will appear here"
        width="w-96"
      />
    );
  }

  return (
    <div className="w-96 panel flex flex-col overflow-hidden relative">
      {/* Search & Filter - прозрачная шапка */}
      <div className="header-section">
        <div className="flex items-center gap-sm">
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${TEXT_COLORS.secondary}`} />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`search-input ${TEXT_COLORS.primary}`}
            />
          </div>
          <button
            onClick={loadTickets}
            disabled={loading}
            className="btn-icon group"
            title="Refresh tickets"
          >
            <RefreshCw className={`w-5 h-5 ${TEXT_COLORS.primary} ${loading ? 'animate-spin' : ''}`} />
          </button>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowFilters(!showFilters);
              }}
              className="btn-icon group relative"
            >
              <SlidersHorizontal className={`w-5 h-5 ${TEXT_COLORS.primary} group-hover:rotate-90 transition-transform duration-300`} />
              {/* Active filters indicator */}
              {(filterStatus.length > 0 || filterProject.length > 0 || filterSource.length > 0) && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
              )}
            </button>

            {/* Filter Dropdown */}
            {showFilters && (
              <div className="filter-dropdown">
                <div className="space-y-3.5">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-gray-800">Filters</h3>
                      {(filterStatus.length > 0 || filterProject.length > 0 || filterSource.length > 0) && (
                        <span className="px-1.5 py-0.5 text-xs bg-orange-100 text-orange-600 rounded-full">
                          {filterStatus.length + filterProject.length + filterSource.length}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Status Filter */}
                  <div className="filter-row">
                    <label className="filter-label">Status</label>
                    <Multiselect
                      options={[
                        { value: 'open', label: 'Open' },
                        { value: 'pending', label: 'Pending' },
                        { value: 'resolved', label: 'Resolved' },
                        { value: 'closed', label: 'Closed' },
                        { value: 'unread', label: 'Unread only' }
                      ]}
                      selectedValues={filterStatus}
                      onChange={setFilterStatus}
                      placeholder="All statuses"
                    />
                  </div>

                  {/* Project Filter */}
                  <div className="filter-row">
                    <label className="filter-label">Project</label>
                    <Multiselect
                      options={[...new Map(tickets.map(t => [t.project?.id, t.project])).values()]
                        .filter(Boolean)
                        .map(project => ({
                          value: project.id,
                          label: project.name
                        }))}
                      selectedValues={filterProject}
                      onChange={setFilterProject}
                      placeholder="All projects"
                    />
                  </div>

                  {/* Source Filter */}
                  <div className="filter-row">
                    <label className="filter-label">Source</label>
                    <Multiselect
                      options={[
                        { value: 'email', label: 'Email' },
                        { value: 'telegram', label: 'Telegram' },
                        { value: 'whatsapp', label: 'WhatsApp' }
                      ]}
                      selectedValues={filterSource}
                      onChange={setFilterSource}
                      placeholder="All sources"
                    />
                  </div>

                  {/* Clear Filters */}
                  {(filterStatus.length > 0 || filterProject.length > 0 || filterSource.length > 0) && (
                    <div className="pt-3">
                      <button
                        onClick={() => {
                          setFilterStatus([]);
                          setFilterProject([]);
                          setFilterSource([]);
                        }}
                        className="w-full px-3 py-2 text-sm text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors font-medium"
                      >
                        Clear all filters
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tickets List - with custom scrollbar */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3 custom-scrollbar">
        {/* Spacer for header */}
        <div className="h-20"></div>

        {/* Show empty state when filtered tickets is empty */}
        {filteredTickets.length === 0 ? (
          <div className="flex items-center justify-center h-full -mt-20">
            <div className="text-center px-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 placeholder-bg">
                <Search className="w-9 h-9 placeholder-icon" strokeWidth={1.5} />
              </div>
              <p className={`text-base font-medium ${TEXT_COLORS.primary} mb-1`}>
                No tickets match your filters
              </p>
              <p className={`text-sm ${TEXT_COLORS.secondary}`}>
                Try adjusting your search or filters
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterStatus('all');
                }}
                className="mt-4 px-4 py-2 text-sm text-blue-500 hover:underline"
              >
                Clear filters
              </button>
            </div>
          </div>
        ) : (
          /* Tickets */
          filteredTickets.map((ticket) => {
          const isUnread = !ticket.last_message?.read_at;
          const connectorType = ticket.connector?.type || 'email';
          const sourceType = TICKET_SOURCES[connectorType as keyof typeof TICKET_SOURCES]
            ? connectorType
            : 'email';

          return (
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
                    isUnread ? 'font-semibold' : ''
                  }`}
                >
                  {ticket.subject}
                </p>
                <span className={`text-xs ${TEXT_COLORS.secondary} flex-shrink-0 ml-2`}>
                  {formatTicketTime(ticket.created_at)}
                </span>
              </div>

              {/* Last message or customer info */}
              <p className={`text-xs ${TEXT_COLORS.secondary} truncate mb-3`}>
                {ticket.last_message?.content ||
                 `From: ${ticket.customer?.name || ticket.customer?.email || 'Unknown'}`}
              </p>

              {/* Bottom row: Project, Source and Status */}
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className={`bg-gray-100 ${TEXT_COLORS.primary}`}>
                  <Folder className="w-3.5 h-3.5" />
                  {ticket.project?.name || 'No Project'}
                </Tag>
                <Tag className={`bg-gray-100 ${TEXT_COLORS.primary}`}>
                  <SourceIcon source={sourceType as any} />
                  {TICKET_SOURCES[sourceType as keyof typeof TICKET_SOURCES]?.label || connectorType}
                </Tag>
                <span className="flex-1"></span>
                <Tag
                  className={`flex-shrink-0 ${
                    isUnread
                      ? 'badge-open'
                      : STATUS_COLORS[ticket.status as keyof typeof STATUS_COLORS] || 'badge-open'
                  }`}
                >
                  {isUnread ? 'unread' : ticket.status}
                </Tag>
              </div>
            </button>
          );
        })
        )}

        {/* Spacer for bottom */}
        <div className="h-4"></div>
      </div>
    </div>
  );
}
