import NavbarFixed from '@/components/NavbarFixed';
import TicketsList from '@/components/TicketsList';
import TicketDetails from '@/components/TicketDetails';
import Chat from '@/components/Chat';
import { useUIStore } from '@/lib/store/ui-store';

export default function InboxPage() {
  const { selectedTicketId, setSelectedTicketId } = useUIStore();

  return (
    <div className="flex h-screen overflow-hidden">
      <NavbarFixed />

      {/* Main Content - adjusted for navbar width */}
      <div className="inbox-content flex flex-1 gap-4 p-4 transition-all duration-300">
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