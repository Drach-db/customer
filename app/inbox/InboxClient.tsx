'use client';

import Navbar from '@/components/Navbar';
import TicketsList from '@/components/TicketsList';
import TicketDetails from '@/components/TicketDetails';
import Chat from '@/components/Chat';
import { useUIStore } from '@/lib/store/ui-store';
import { useEffect } from 'react';

export default function InboxClient() {
  const { isNavbarExpanded, selectedTicketId, setSelectedTicketId } = useUIStore();

  // Hydrate Zustand persist store on client mount
  useEffect(() => {
    useUIStore.persist.rehydrate();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <Navbar />

      {/* Main Content - adjusted for navbar width */}
      <div
        className={`
          flex flex-1 gap-4 p-4 transition-all duration-300
          ${isNavbarExpanded ? 'ml-[224px]' : 'ml-[72px]'}
        `}
      >
        {/* Tickets List */}
        <TicketsList onTicketSelect={setSelectedTicketId} selectedTicketId={selectedTicketId} />

        {/* Chat */}
        <Chat ticketId={selectedTicketId} />

        {/* Ticket Details */}
        <TicketDetails ticketId={selectedTicketId} />
      </div>
    </div>
  );
}
