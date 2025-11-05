'use client';

import { Send, Paperclip, MoreVertical, MessageSquare, RefreshCw } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { TEXT_COLORS } from '@/lib/constants/colors';
import EmptyState from './EmptyState';
import PlaceholderState from './PlaceholderState';
import { getTicketMessages, sendMessage, type MessageWithSender } from '@/lib/services/messages';
import { getTicket, type TicketWithRelations } from '@/lib/services/tickets';
import { useAuth } from '@/lib/hooks/useAuth';
import { format } from 'date-fns';

// Mock data (will be removed after testing)
const mockMessages = [
  {
    id: '1',
    text: 'Hello, I am having trouble completing my payment. The page keeps loading but nothing happens.',
    sender: 'customer',
    time: '10:24',
    senderName: 'John Doe',
  },
  {
    id: '2',
    text: 'Hi John! I am sorry to hear that. Let me help you with this issue. Could you please tell me which payment method you are trying to use?',
    sender: 'agent',
    time: '10:25',
    senderName: 'Support Agent',
  },
  {
    id: '3',
    text: 'I am trying to use my credit card (Visa ending in 4242)',
    sender: 'customer',
    time: '10:26',
    senderName: 'John Doe',
  },
  {
    id: '4',
    text: 'Thank you for the information. I can see the issue now. It looks like there was a temporary problem with our payment processor. Could you please try again?',
    sender: 'agent',
    time: '10:27',
    senderName: 'Support Agent',
  },
  {
    id: '5',
    text: 'Okay, let me try again now.',
    sender: 'customer',
    time: '10:28',
    senderName: 'John Doe',
  },
  {
    id: '6',
    text: 'It still does not work. Same issue - the page just keeps loading.',
    sender: 'customer',
    time: '10:29',
    senderName: 'John Doe',
  },
  {
    id: '7',
    text: 'I understand your frustration. Let me escalate this to our technical team. Could you please clear your browser cache and try again?',
    sender: 'agent',
    time: '10:30',
    senderName: 'Support Agent',
  },
  {
    id: '8',
    text: 'How do I clear the cache?',
    sender: 'customer',
    time: '10:31',
    senderName: 'John Doe',
  },
  {
    id: '9',
    text: 'Sure! For Chrome: Click the three dots in the top right → More tools → Clear browsing data. Then select "Cached images and files" and click Clear data.',
    sender: 'agent',
    time: '10:32',
    senderName: 'Support Agent',
  },
  {
    id: '10',
    text: 'Got it, trying now...',
    sender: 'customer',
    time: '10:33',
    senderName: 'John Doe',
  },
  {
    id: '11',
    text: 'It worked! Thank you so much!',
    sender: 'customer',
    time: '10:35',
    senderName: 'John Doe',
  },
  {
    id: '12',
    text: 'Wonderful! I am so glad we could resolve this for you. Is there anything else I can help you with today?',
    sender: 'agent',
    time: '10:36',
    senderName: 'Support Agent',
  },
  {
    id: '13',
    text: 'No, that is all. Thanks again!',
    sender: 'customer',
    time: '10:37',
    senderName: 'John Doe',
  },
];

interface ChatProps {
  ticketId?: string;
}

export default function Chat({ ticketId }: ChatProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<MessageWithSender[]>([]);
  const [ticket, setTicket] = useState<TicketWithRelations | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load ticket and messages when ticketId changes
  useEffect(() => {
    if (ticketId) {
      loadTicketAndMessages();
    } else {
      setMessages([]);
      setTicket(null);
    }
  }, [ticketId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadTicketAndMessages = async () => {
    if (!ticketId) return;

    setLoading(true);
    try {
      // Load ticket details
      const ticketData = await getTicket(ticketId);
      setTicket(ticketData);

      // Load messages
      const messagesData = await getTicketMessages(ticketId);
      setMessages(messagesData);
    } catch (error) {
      console.error('Error loading chat data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !ticketId || !user || sending) return;

    setSending(true);
    try {
      const newMessage = await sendMessage(
        ticketId,
        message.trim(),
        user.id,
        'agent',
        false
      );

      // Add the new message to the list
      setMessages([...messages, {
        ...newMessage,
        user: {
          id: user.id,
          full_name: user.user_metadata?.full_name || user.email || 'Agent',
          email: user.email || ''
        }
      } as MessageWithSender]);

      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const formatMessageTime = (date: string) => {
    try {
      return format(new Date(date), 'HH:mm');
    } catch {
      return '';
    }
  };

  if (!ticketId) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="No conversation selected"
        description="Choose a ticket from the list to view the conversation"
      />
    );
  }

  if (loading) {
    return (
      <PlaceholderState
        icon={RefreshCw}
        title="Loading conversation"
        description="Please wait"
        animateIcon={true}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col panel overflow-hidden relative">
      {/* Header - абсолютно позиционирована поверх */}
      <div className="header-section flex items-center justify-between">
        <div className="flex items-center gap-md">
          {ticket?.customer && (
            <>
              <div className="avatar-md font-semibold avatar-soft-green flex-shrink-0">
                {ticket.customer.name?.charAt(0)?.toUpperCase() || 'C'}
              </div>
              <div>
                <h3 className={`text-sm font-semibold ${TEXT_COLORS.primary}`}>{ticket.customer.name || 'Customer'}</h3>
                <p className={`text-xs ${TEXT_COLORS.secondary}`}>{ticket.subject}</p>
              </div>
            </>
          )}
        </div>
        <button
          onClick={loadTicketAndMessages}
          className="p-2 hover-peach rounded-lg transition-colors"
          title="Refresh messages"
        >
          <RefreshCw className={`w-5 h-5 ${TEXT_COLORS.primary}`} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-gradient-to-b from-transparent via-transparent to-orange-50/20 custom-scrollbar">
        {/* Spacer for header */}
        <div className="h-14"></div>

        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full -mt-14">
            <div className="text-center">
              <p className={`text-sm ${TEXT_COLORS.secondary}`}>No messages yet</p>
              <p className={`text-xs ${TEXT_COLORS.tertiary} mt-1`}>Start the conversation</p>
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isAgent = msg.sender_type === 'agent';
            const senderName = isAgent
              ? (msg.user?.full_name || msg.user?.email || 'Agent')
              : (msg.customer?.name || msg.customer?.email || 'Customer');

            return (
              <div
                key={msg.id}
                className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex flex-col max-w-md">
                  {!isAgent && (
                    <p className="text-xs font-medium customer-name mb-1 px-1">{senderName}</p>
                  )}
                  <div
                    className={`
                      px-3.5 py-2 rounded-2xl
                      ${
                        isAgent
                          ? 'rounded-br-sm message-outgoing'
                          : `bg-gray-50 ${TEXT_COLORS.primary} rounded-bl-sm border border-gray-200`
                      }
                    `}
                  >
                    <p className={`text-sm leading-relaxed mb-0.5 ${isAgent ? TEXT_COLORS.primary : ''}`}>
                      {msg.content}
                    </p>
                    <p
                      className={`text-[10px] text-right ${
                        isAgent ? TEXT_COLORS.secondary : TEXT_COLORS.tertiary
                      }`}
                    >
                      {formatMessageTime(msg.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        {/* Anchor element for scrolling to bottom */}
        <div ref={messagesEndRef} />
        <div className="h-20"></div>
      </div>

      {/* Input */}
      <div className="absolute bottom-5 left-5 right-5">
        <div className="flex items-center gap-2">
          <button className="h-10 w-10 flex items-center justify-center rounded-lg transition-all duration-200 group flex-shrink-0">
            <Paperclip className={`w-5 h-5 ${TEXT_COLORS.primary} group-hover:rotate-45 transition-transform duration-300`} />
          </button>
          <div className={`flex-1 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg px-4 flex items-center transition-colors shadow-sm`}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className={`w-full bg-transparent text-sm ${TEXT_COLORS.primary} placeholder-gray-400 focus:outline-none resize-none max-h-32 py-2.5`}
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = target.scrollHeight + 'px';
              }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!message.trim() || sending}
            className="h-10 w-10 flex items-center justify-center rounded-lg transition-all duration-200 group flex-shrink-0 disabled:opacity-50"
          >
            <Send className={`w-5 h-5 ${TEXT_COLORS.primary} group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300`} />
          </button>
        </div>
      </div>
    </div>
  );
}
