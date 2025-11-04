'use client';

import { Send, Paperclip, MoreVertical, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { TEXT_COLORS, SHARED_CLASSES } from '@/lib/constants/colors';
import EmptyState from './EmptyState';

// Types
interface Message {
  id: string;
  text: string;
  sender: 'customer' | 'agent';
  time: string;
  senderName: string;
}

// Mock data
const mockMessages: Message[] = [
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

  if (!ticketId) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="No conversation selected"
        description="Choose a ticket from the list to view the conversation"
      />
    );
  }

  return (
    <div className={`flex-1 flex flex-col ${SHARED_CLASSES.panel} overflow-hidden relative`}>
      {/* Header - абсолютно позиционирована поверх */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-white/40 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${SHARED_CLASSES.avatar} avatar-soft-green flex-shrink-0`}>
            J
          </div>
          <div>
            <h3 className={`text-sm font-semibold ${TEXT_COLORS.primary}`}>John Doe</h3>
            <p className={`text-xs ${TEXT_COLORS.secondary}`}>Payment Issue</p>
          </div>
        </div>
        <button className={`p-2 ${SHARED_CLASSES.hover} rounded-lg ${SHARED_CLASSES.transition}`}>
          <MoreVertical className={`w-5 h-5 ${TEXT_COLORS.primary}`} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-gradient-to-b from-transparent via-transparent to-orange-50/20 custom-scrollbar">
        {/* Spacer for header */}
        <div className="h-14"></div>

        {mockMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
          >
            <div className="flex flex-col max-w-md">
              {msg.sender === 'customer' && (
                <p className="text-xs font-medium customer-name mb-1 px-1">{msg.senderName}</p>
              )}
              <div
                className={`
                  px-3.5 py-2 rounded-2xl
                  ${
                    msg.sender === 'agent'
                      ? 'rounded-br-sm message-outgoing'
                      : `bg-gray-50 ${TEXT_COLORS.primary} rounded-bl-sm border border-gray-200`
                  }
                `}
              >
                <p className={`text-sm leading-relaxed mb-0.5 ${msg.sender === 'agent' ? TEXT_COLORS.primary : ''}`}>{msg.text}</p>
                <p
                  className={`text-[10px] text-right ${
                    msg.sender === 'agent' ? TEXT_COLORS.secondary : TEXT_COLORS.tertiary
                  }`}
                >
                  {msg.time}
                </p>
              </div>
            </div>
          </div>
        ))}
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
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = target.scrollHeight + 'px';
              }}
            />
          </div>
          <button className="h-10 w-10 flex items-center justify-center rounded-lg transition-all duration-200 group flex-shrink-0">
            <Send className={`w-5 h-5 ${TEXT_COLORS.primary} group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300`} />
          </button>
        </div>
      </div>
    </div>
  );
}
