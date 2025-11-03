'use client';

import { ClipboardList } from 'lucide-react';
import { TEXT_COLORS, SHARED_CLASSES } from '@/lib/constants/colors';
import EmptyState from './EmptyState';

interface TicketDetailsProps {
  ticketId?: string;
}

export default function TicketDetails({ ticketId }: TicketDetailsProps) {
  if (!ticketId) {
    return (
      <div className={`w-96 h-full ${SHARED_CLASSES.panel} flex flex-col overflow-hidden`}>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 placeholder-bg">
              <ClipboardList className="w-7 h-7 placeholder-icon" strokeWidth={1.5} />
            </div>
            <p className={`text-sm font-medium ${TEXT_COLORS.primary} mb-1`}>No ticket selected</p>
            <p className={`text-xs ${TEXT_COLORS.secondary}`}>Select a ticket to view details</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-96 ${SHARED_CLASSES.panel} flex flex-col overflow-hidden`}>
      <div className="p-5">
        <p className={`text-sm ${TEXT_COLORS.secondary}`}>Ticket Details</p>
      </div>
    </div>
  );
}
