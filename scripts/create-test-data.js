import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqZXl4ZnBnd2djaW5yb211dXRmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTEzMjg2NSwiZXhwIjoyMDc2NzA4ODY1fQ.gmZLs7Atn_seo17Ile-plnlg6LrJ6ltBZ0x-fhHUZ70';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTestData() {
  console.log('Creating test data...\n');

  try {
    // Get first workspace
    const { data: workspaces, error: wsError } = await supabase
      .from('workspaces')
      .select('*')
      .limit(1);

    if (wsError || !workspaces?.length) {
      console.error('No workspace found:', wsError);
      return;
    }

    const workspace = workspaces[0];
    console.log('Using workspace:', workspace.name);

    // Step 1: Create projects
    console.log('\n1. Creating projects...');
    const projectsData = [
      {
        workspace_id: workspace.id,
        name: 'Customer Support',
        description: 'Main customer support project',
        created_by: workspace.owner_id,
        is_active: true,
        settings: {}
      },
      {
        workspace_id: workspace.id,
        name: 'Sales Inquiries',
        description: 'Sales and pricing questions',
        created_by: workspace.owner_id,
        is_active: true,
        settings: {}
      },
      {
        workspace_id: workspace.id,
        name: 'Technical Support',
        description: 'Technical issues and bug reports',
        created_by: workspace.owner_id,
        is_active: true,
        settings: {}
      }
    ];

    const { data: projects, error: projError } = await supabase
      .from('projects')
      .insert(projectsData)
      .select();

    if (projError) {
      console.error('Error creating projects:', projError);
      return;
    }
    console.log('Created', projects.length, 'projects');

    // Step 2: Create connectors
    console.log('\n2. Creating connectors...');
    const connectorTypes = ['email', 'telegram', 'whatsapp'];
    const connectorsData = projects.map((project, idx) => ({
      project_id: project.id,
      type: connectorTypes[idx % connectorTypes.length],
      name: `${connectorTypes[idx % connectorTypes.length].charAt(0).toUpperCase() + connectorTypes[idx % connectorTypes.length].slice(1)} Support`,
      config: {
        address: connectorTypes[idx % connectorTypes.length] === 'email' ? 'support@example.com' : undefined,
        bot_token: connectorTypes[idx % connectorTypes.length] === 'telegram' ? 'bot123' : undefined,
        phone: connectorTypes[idx % connectorTypes.length] === 'whatsapp' ? '+1234567890' : undefined
      },
      status: 'active'
    }));

    const { data: connectors, error: connError } = await supabase
      .from('connectors')
      .insert(connectorsData)
      .select();

    if (connError) {
      console.error('Error creating connectors:', connError);
      return;
    }
    console.log('Created', connectors.length, 'connectors');

    // Step 3: Create customers
    console.log('\n3. Creating customers...');
    const customersData = [
      {
        workspace_id: workspace.id,
        email: 'john.doe@example.com',
        name: 'John Doe',
        phone: '+1234567890',
        source_type: 'email',
        metadata: {}
      },
      {
        workspace_id: workspace.id,
        email: 'jane.smith@example.com',
        name: 'Jane Smith',
        phone: '+1234567891',
        source_type: 'whatsapp',
        metadata: {}
      },
      {
        workspace_id: workspace.id,
        email: 'bob.wilson@example.com',
        name: 'Bob Wilson',
        phone: '+1234567892',
        source_type: 'telegram',
        metadata: {}
      },
      {
        workspace_id: workspace.id,
        email: 'alice.johnson@example.com',
        name: 'Alice Johnson',
        phone: '+1234567893',
        source_type: 'email',
        metadata: {}
      },
      {
        workspace_id: workspace.id,
        email: 'charlie.brown@example.com',
        name: 'Charlie Brown',
        phone: '+1234567894',
        source_type: 'whatsapp',
        metadata: {}
      }
    ];

    const { data: customers, error: custError } = await supabase
      .from('customers')
      .insert(customersData)
      .select();

    if (custError) {
      console.error('Error creating customers:', custError);
      return;
    }
    console.log('Created', customers.length, 'customers');

    // Step 4: Create tickets
    console.log('\n4. Creating tickets...');
    const ticketStatuses = ['open', 'pending', 'resolved', 'closed'];
    const ticketPriorities = ['low', 'medium', 'high', 'urgent'];
    const ticketSubjects = [
      'Cannot login to my account',
      'Payment failed',
      'How to export my data?',
      'Bug in the mobile app',
      'Feature request: Dark mode',
      'Subscription renewal question',
      'API integration help',
      'Account verification issue',
      'Slow performance',
      'Missing invoice',
      'Password reset not working',
      'Pricing question',
      'Refund request',
      'Technical documentation',
      'Account deletion request'
    ];

    const ticketsData = [];
    for (let i = 0; i < 15; i++) {
      const project = projects[i % projects.length];
      const customer = customers[i % customers.length];
      const connector = connectors.find(c => c.project_id === project.id);

      ticketsData.push({
        project_id: project.id,
        customer_id: customer.id,
        connector_id: connector.id,
        subject: ticketSubjects[i],
        status: ticketStatuses[i % ticketStatuses.length],
        priority: ticketPriorities[i % ticketPriorities.length],
        tags: ['test', 'demo'],
        created_at: new Date(Date.now() - (i * 3600000)).toISOString(),
        updated_at: new Date(Date.now() - (i * 1800000)).toISOString()
      });
    }

    const { data: tickets, error: ticketError } = await supabase
      .from('tickets')
      .insert(ticketsData)
      .select();

    if (ticketError) {
      console.error('Error creating tickets:', ticketError);
      return;
    }
    console.log('Created', tickets.length, 'tickets');

    // Step 5: Create messages for each ticket
    console.log('\n5. Creating messages...');
    const messageContents = [
      'Hello, I need help with this issue.',
      'Can you please look into this?',
      'This is urgent, please respond.',
      'Thank you for your help!',
      'Is there any update on this?',
      'I tried the solution but it didn\'t work.',
      'Here are more details about the problem.',
      'When can I expect a resolution?',
      'The issue is still not resolved.',
      'I appreciate your assistance.'
    ];

    const messagesData = [];
    for (const ticket of tickets) {
      // Create 1-3 messages per ticket
      const messageCount = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < messageCount; j++) {
        const isCustomerMessage = j % 2 === 0;
        const customer = customers.find(c => c.id === ticket.customer_id);

        messagesData.push({
          ticket_id: ticket.id,
          sender_type: isCustomerMessage ? 'customer' : 'agent',
          sender_id: isCustomerMessage ? customer.id : workspace.owner_id,
          content: messageContents[Math.floor(Math.random() * messageContents.length)],
          attachments: [],
          is_internal_note: false,
          created_at: new Date(Date.now() - (j * 1800000)).toISOString()
        });
      }
    }

    const { data: messages, error: msgError } = await supabase
      .from('messages')
      .insert(messagesData)
      .select();

    if (msgError) {
      console.error('Error creating messages:', msgError);
      return;
    }
    console.log('Created', messages.length, 'messages');

    console.log('\n Test data created successfully!');
    console.log('Summary:');
    console.log(`  - ${projects.length} projects`);
    console.log(`  - ${connectors.length} connectors`);
    console.log(`  - ${customers.length} customers`);
    console.log(`  - ${tickets.length} tickets`);
    console.log(`  - ${messages.length} messages`);

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createTestData();