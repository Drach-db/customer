import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqZXl4ZnBnd2djaW5yb211dXRmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTEzMjg2NSwiZXhwIjoyMDc2NzA4ODY1fQ.gmZLs7Atn_seo17Ile-plnlg6LrJ6ltBZ0x-fhHUZ70';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addMessagesToTicket() {
  console.log('Adding messages to ticket 5680d1ac-2dc8-4d9e-ac9e-ba49a0bcda76...\n');

  const ticketId = '5680d1ac-2dc8-4d9e-ac9e-ba49a0bcda76';

  try {
    // Get ticket info
    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .select('*, customer:customers(*), project:projects(*)')
      .eq('id', ticketId)
      .single();

    if (ticketError || !ticket) {
      console.error('Ticket not found:', ticketError);
      return;
    }

    console.log('Found ticket:', ticket.subject);
    console.log('Customer:', ticket.customer?.name);

    // Get workspace owner (agent)
    const { data: workspace } = await supabase
      .from('workspaces')
      .select('owner_id')
      .eq('id', ticket.project.workspace_id)
      .single();

    const agentId = workspace?.owner_id;
    const customerId = ticket.customer_id;

    // Create conversation messages
    const messages = [
      // Initial customer message
      {
        ticket_id: ticketId,
        sender_type: 'customer',
        sender_id: customerId,
        content: 'Hi, I\'m having trouble accessing my account. Every time I try to login, it says my password is incorrect, but I\'m sure it\'s right.',
        is_internal_note: false,
        created_at: new Date(Date.now() - 3600000 * 24).toISOString()
      },
      // Agent response
      {
        ticket_id: ticketId,
        sender_type: 'agent',
        sender_id: agentId,
        content: 'Hello! I\'m sorry to hear you\'re having trouble logging in. Let me help you with that. Can you tell me which email address you\'re using to log in?',
        is_internal_note: false,
        created_at: new Date(Date.now() - 3600000 * 23.5).toISOString()
      },
      // Customer
      {
        ticket_id: ticketId,
        sender_type: 'customer',
        sender_id: customerId,
        content: `I'm using ${ticket.customer?.email}. I've been using this account for months without any issues.`,
        is_internal_note: false,
        created_at: new Date(Date.now() - 3600000 * 23).toISOString()
      },
      // Agent
      {
        ticket_id: ticketId,
        sender_type: 'agent',
        sender_id: agentId,
        content: 'Thank you for confirming. I can see your account in our system. Have you tried resetting your password using the "Forgot Password" link?',
        is_internal_note: false,
        created_at: new Date(Date.now() - 3600000 * 22.5).toISOString()
      },
      // Customer
      {
        ticket_id: ticketId,
        sender_type: 'customer',
        sender_id: customerId,
        content: 'Yes, I tried that yesterday, but I never received the reset email. I checked my spam folder too.',
        is_internal_note: false,
        created_at: new Date(Date.now() - 3600000 * 22).toISOString()
      },
      // Agent
      {
        ticket_id: ticketId,
        sender_type: 'agent',
        sender_id: agentId,
        content: 'I see. Let me check the email logs on our end. One moment please...',
        is_internal_note: false,
        created_at: new Date(Date.now() - 3600000 * 21.5).toISOString()
      },
      // Agent
      {
        ticket_id: ticketId,
        sender_type: 'agent',
        sender_id: agentId,
        content: 'I found the issue. It looks like our email service had a temporary outage yesterday. I\'m sending you a password reset link right now.',
        is_internal_note: false,
        created_at: new Date(Date.now() - 3600000 * 21).toISOString()
      },
      // Customer
      {
        ticket_id: ticketId,
        sender_type: 'customer',
        sender_id: customerId,
        content: 'Great, thank you! Should I receive it at the same email address?',
        is_internal_note: false,
        created_at: new Date(Date.now() - 3600000 * 20.5).toISOString()
      },
      // Agent
      {
        ticket_id: ticketId,
        sender_type: 'agent',
        sender_id: agentId,
        content: 'Yes, exactly. You should receive it within the next 5 minutes. The email will come from noreply@oursystem.com',
        is_internal_note: false,
        created_at: new Date(Date.now() - 3600000 * 20).toISOString()
      },
      // Customer
      {
        ticket_id: ticketId,
        sender_type: 'customer',
        sender_id: customerId,
        content: 'Perfect! I\'ll keep an eye on my inbox.',
        is_internal_note: false,
        created_at: new Date(Date.now() - 3600000 * 19.5).toISOString()
      },
      // Customer
      {
        ticket_id: ticketId,
        sender_type: 'customer',
        sender_id: customerId,
        content: 'Just received it! Let me try resetting my password now.',
        is_internal_note: false,
        created_at: new Date(Date.now() - 3600000 * 19).toISOString()
      },
      // Agent
      {
        ticket_id: ticketId,
        sender_type: 'agent',
        sender_id: agentId,
        content: 'Excellent! Take your time. Let me know if you encounter any issues during the reset process.',
        is_internal_note: false,
        created_at: new Date(Date.now() - 3600000 * 18.5).toISOString()
      },
      // Customer
      {
        ticket_id: ticketId,
        sender_type: 'customer',
        sender_id: customerId,
        content: 'Hmm, when I click the link, it says "This reset link has expired or is invalid"',
        is_internal_note: false,
        created_at: new Date(Date.now() - 3600000 * 18).toISOString()
      },
      // Agent
      {
        ticket_id: ticketId,
        sender_type: 'agent',
        sender_id: agentId,
        content: 'That\'s strange. Let me generate a fresh link for you with an extended expiration time. I\'m also going to temporarily unlock your account.',
        is_internal_note: false,
        created_at: new Date(Date.now() - 3600000 * 17.5).toISOString()
      },
      // Agent
      {
        ticket_id: ticketId,
        sender_type: 'agent',
        sender_id: agentId,
        content: 'I\'ve sent you a new password reset link that will be valid for 24 hours. Please check your email again.',
        is_internal_note: false,
        created_at: new Date(Date.now() - 3600000 * 17).toISOString()
      },
      // Customer
      {
        ticket_id: ticketId,
        sender_type: 'customer',
        sender_id: customerId,
        content: 'Got the new email! The link worked this time. I\'m on the password reset page now.',
        is_internal_note: false,
        created_at: new Date(Date.now() - 3600000 * 16.5).toISOString()
      },
      // Customer
      {
        ticket_id: ticketId,
        sender_type: 'customer',
        sender_id: customerId,
        content: 'What are the password requirements? I want to make sure I create a strong one.',
        is_internal_note: false,
        created_at: new Date(Date.now() - 3600000 * 16).toISOString()
      },
      // Agent
      {
        ticket_id: ticketId,
        sender_type: 'agent',
        sender_id: agentId,
        content: 'Good question! Your password should be:\n- At least 8 characters long\n- Include at least one uppercase letter\n- Include at least one lowercase letter\n- Include at least one number\n- Include at least one special character (!@#$%^&*)',
        is_internal_note: false,
        created_at: new Date(Date.now() - 3600000 * 15.5).toISOString()
      },
      // Customer
      {
        ticket_id: ticketId,
        sender_type: 'customer',
        sender_id: customerId,
        content: 'Thanks! I\'ve created a new password following those requirements.',
        is_internal_note: false,
        created_at: new Date(Date.now() - 3600000 * 15).toISOString()
      },
      // Customer
      {
        ticket_id: ticketId,
        sender_type: 'customer',
        sender_id: customerId,
        content: 'Success! I\'m logged in now! Thank you so much for your help.',
        is_internal_note: false,
        created_at: new Date(Date.now() - 3600000 * 14.5).toISOString()
      },
      // Agent
      {
        ticket_id: ticketId,
        sender_type: 'agent',
        sender_id: agentId,
        content: 'Wonderful! I\'m glad we got that sorted out for you. Is there anything else I can help you with today?',
        is_internal_note: false,
        created_at: new Date(Date.now() - 3600000 * 14).toISOString()
      },
      // Customer
      {
        ticket_id: ticketId,
        sender_type: 'customer',
        sender_id: customerId,
        content: 'Actually, yes. Now that I\'m logged in, I notice my subscription shows as "inactive". But I paid for it last month.',
        is_internal_note: false,
        created_at: new Date(Date.now() - 3600000 * 13.5).toISOString()
      },
      // Agent
      {
        ticket_id: ticketId,
        sender_type: 'agent',
        sender_id: agentId,
        content: 'Let me look into your subscription status right away. Can you tell me which plan you\'re subscribed to?',
        is_internal_note: false,
        created_at: new Date(Date.now() - 3600000 * 13).toISOString()
      },
      // Customer
      {
        ticket_id: ticketId,
        sender_type: 'customer',
        sender_id: customerId,
        content: 'I have the Professional plan, billed monthly. I usually get charged on the 15th of each month.',
        is_internal_note: false,
        created_at: new Date(Date.now() - 3600000 * 12.5).toISOString()
      },
      // Agent
      {
        ticket_id: ticketId,
        sender_type: 'agent',
        sender_id: agentId,
        content: 'I\'m checking your payment history now. I can see your last successful payment was on October 15th for $29.99.',
        is_internal_note: false,
        created_at: new Date(Date.now() - 3600000 * 12).toISOString()
      },
      // Agent
      {
        ticket_id: ticketId,
        sender_type: 'agent',
        sender_id: agentId,
        content: 'It appears there was an attempt to charge your card on November 15th, but it was declined. Did you perhaps get a new card recently?',
        is_internal_note: false,
        created_at: new Date(Date.now() - 3600000 * 11.5).toISOString()
      },
      // Customer
      {
        ticket_id: ticketId,
        sender_type: 'customer',
        sender_id: customerId,
        content: 'Oh! Yes, I did get a new card last week because my old one was compromised. I forgot to update it here.',
        is_internal_note: false,
        created_at: new Date(Date.now() - 3600000 * 11).toISOString()
      },
      // Agent
      {
        ticket_id: ticketId,
        sender_type: 'agent',
        sender_id: agentId,
        content: 'No problem at all! That happens. You can update your payment method in Account Settings > Billing > Payment Methods. Would you like me to guide you through it?',
        is_internal_note: false,
        created_at: new Date(Date.now() - 3600000 * 10.5).toISOString()
      },
      // Customer
      {
        ticket_id: ticketId,
        sender_type: 'customer',
        sender_id: customerId,
        content: 'Yes please, that would be helpful.',
        is_internal_note: false,
        created_at: new Date(Date.now() - 3600000 * 10).toISOString()
      },
      // Agent
      {
        ticket_id: ticketId,
        sender_type: 'agent',
        sender_id: agentId,
        content: 'Sure! Here are the steps:\n1. Click on your profile icon in the top right corner\n2. Select "Account Settings" from the dropdown\n3. Click on the "Billing" tab on the left sidebar\n4. Under "Payment Methods", click "Add New Card"\n5. Enter your new card details and click "Save"',
        is_internal_note: false,
        created_at: new Date(Date.now() - 3600000 * 9.5).toISOString()
      },
      // Customer
      {
        ticket_id: ticketId,
        sender_type: 'customer',
        sender_id: customerId,
        content: 'Found it! I\'m adding my new card now.',
        is_internal_note: false,
        created_at: new Date(Date.now() - 3600000 * 9).toISOString()
      },
      // Customer
      {
        ticket_id: ticketId,
        sender_type: 'customer',
        sender_id: customerId,
        content: 'Done! It says "Payment method added successfully"',
        is_internal_note: false,
        created_at: new Date(Date.now() - 3600000 * 8.5).toISOString()
      },
      // Agent
      {
        ticket_id: ticketId,
        sender_type: 'agent',
        sender_id: agentId,
        content: 'Perfect! Now I\'ll reactivate your subscription. Since the payment was due on the 15th, I\'ll also apply a prorated credit for the days you couldn\'t access your account.',
        is_internal_note: false,
        created_at: new Date(Date.now() - 3600000 * 8).toISOString()
      },
      // Agent
      {
        ticket_id: ticketId,
        sender_type: 'agent',
        sender_id: agentId,
        content: 'Your subscription is now active! I\'ve added a $3.87 credit to your account for the 4 days of interrupted service. This will be applied to your next invoice.',
        is_internal_note: false,
        created_at: new Date(Date.now() - 3600000 * 7.5).toISOString()
      },
      // Customer
      {
        ticket_id: ticketId,
        sender_type: 'customer',
        sender_id: customerId,
        content: 'Wow, thank you so much! I really appreciate the credit. You\'ve been incredibly helpful!',
        is_internal_note: false,
        created_at: new Date(Date.now() - 3600000 * 7).toISOString()
      },
      // Agent
      {
        ticket_id: ticketId,
        sender_type: 'agent',
        sender_id: agentId,
        content: 'You\'re very welcome! I\'m happy I could help resolve both issues for you today. Before we close this ticket, I wanted to mention that we have two-factor authentication available for added security. Would you be interested in setting that up?',
        is_internal_note: false,
        created_at: new Date(Date.now() - 3600000 * 6.5).toISOString()
      },
      // Customer
      {
        ticket_id: ticketId,
        sender_type: 'customer',
        sender_id: customerId,
        content: 'That sounds like a good idea, especially after my card was compromised. How does it work?',
        is_internal_note: false,
        created_at: new Date(Date.now() - 3600000 * 6).toISOString()
      },
      // Agent
      {
        ticket_id: ticketId,
        sender_type: 'agent',
        sender_id: agentId,
        content: 'With 2FA enabled, after entering your password, you\'ll receive a 6-digit code via SMS or an authenticator app. You\'ll need to enter this code to complete the login. It adds an extra layer of security even if someone has your password.',
        is_internal_note: false,
        created_at: new Date(Date.now() - 3600000 * 5.5).toISOString()
      },
      // Customer
      {
        ticket_id: ticketId,
        sender_type: 'customer',
        sender_id: customerId,
        content: 'That sounds great. I\'ll set it up right after this. Thank you again for all your help today!',
        is_internal_note: false,
        created_at: new Date(Date.now() - 3600000 * 5).toISOString()
      },
      // Agent
      {
        ticket_id: ticketId,
        sender_type: 'agent',
        sender_id: agentId,
        content: 'You\'re welcome! If you need any help with the 2FA setup or anything else, feel free to reach out. Have a wonderful day!',
        is_internal_note: false,
        created_at: new Date(Date.now() - 3600000 * 4.5).toISOString()
      },
      // Customer
      {
        ticket_id: ticketId,
        sender_type: 'customer',
        sender_id: customerId,
        content: 'You too! Thanks again! 😊',
        is_internal_note: false,
        created_at: new Date(Date.now() - 3600000 * 4).toISOString()
      }
    ];

    // Insert all messages
    const { data: insertedMessages, error: insertError } = await supabase
      .from('messages')
      .insert(messages)
      .select();

    if (insertError) {
      console.error('Error inserting messages:', insertError);
      return;
    }

    console.log(`\n✅ Successfully added ${insertedMessages.length} messages to ticket!`);
    console.log('The chat should now be scrollable with a long conversation history.');

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

addMessagesToTicket();