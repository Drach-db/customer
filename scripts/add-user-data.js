import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqZXl4ZnBnd2djaW5yb211dXRmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTEzMjg2NSwiZXhwIjoyMDc2NzA4ODY1fQ.gmZLs7Atn_seo17Ile-plnlg6LrJ6ltBZ0x-fhHUZ70';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addUserData() {
  const userEmail = 'drach.db1@gmail.com';
  console.log(`Adding data for user: ${userEmail}\n`);

  try {
    // Step 1: Find user and workspace
    console.log('1. Finding user and workspace...');

    // Get user by email
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();

    if (userError) {
      console.error('Error finding user:', userError);
      return;
    }

    const user = users?.find(u => u.email === userEmail);

    if (!user) {
      console.error(`User with email ${userEmail} not found`);
      return;
    }

    console.log('Found user:', user.id);

    // Find user's workspace
    const { data: workspaces, error: wsError } = await supabase
      .from('workspaces')
      .select('*')
      .eq('owner_id', user.id);

    let workspace;

    if (wsError || !workspaces?.length) {
      // Check if user is a member of any workspace
      const { data: memberWorkspaces, error: memberError } = await supabase
        .from('workspace_members')
        .select('workspace:workspaces(*)')
        .eq('user_id', user.id);

      if (memberError || !memberWorkspaces?.length) {
        console.log('No workspace found for user, creating one...');

        // Create workspace for user
        const { data: newWorkspace, error: createWsError } = await supabase
          .from('workspaces')
          .insert({
            owner_id: user.id,
            name: 'My Company',
            slug: 'my-company-' + Date.now(),
            is_active: true,
            subscription_plan: 'free',
            settings: {}
          })
          .select()
          .single();

        if (createWsError) {
          console.error('Error creating workspace:', createWsError);
          return;
        }

        workspace = newWorkspace;
        console.log('Created workspace:', workspace.name);
      } else {
        workspace = memberWorkspaces[0].workspace;
        console.log('Found member workspace:', workspace.name);
      }
    } else {
      workspace = workspaces[0];
      console.log('Found owned workspace:', workspace.name);
    }

    // Step 2: Create projects
    console.log('\n2. Creating projects...');
    const projectsData = [
      {
        workspace_id: workspace.id,
        name: 'Customer Support',
        description: 'Handling customer inquiries and support tickets',
        created_by: user.id,
        is_active: true,
        settings: {
          priority: 'high',
          auto_assign: false
        }
      },
      {
        workspace_id: workspace.id,
        name: 'Sales Team',
        description: 'Managing sales inquiries and leads',
        created_by: user.id,
        is_active: true,
        settings: {
          priority: 'high',
          auto_assign: true
        }
      },
      {
        workspace_id: workspace.id,
        name: 'Technical Support',
        description: 'Technical issues and bug reports',
        created_by: user.id,
        is_active: true,
        settings: {
          priority: 'medium',
          auto_assign: false
        }
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

    // Step 3: Create connectors (sources)
    console.log('\n3. Creating connectors...');
    const connectorsData = [];

    // For each project, create multiple connectors
    projects.forEach(project => {
      connectorsData.push(
        {
          project_id: project.id,
          type: 'email',
          name: `${project.name} Email`,
          config: {
            address: `${project.name.toLowerCase().replace(/\s+/g, '-')}@company.com`,
            forward_to: userEmail
          },
          status: 'active'
        },
        {
          project_id: project.id,
          type: 'telegram',
          name: `${project.name} Telegram Bot`,
          config: {
            bot_token: `bot_${project.name.toLowerCase().replace(/\s+/g, '_')}_123`,
            bot_username: `@${project.name.toLowerCase().replace(/\s+/g, '_')}_bot`
          },
          status: 'active'
        }
      );

      // Add WhatsApp only for Customer Support
      if (project.name === 'Customer Support') {
        connectorsData.push({
          project_id: project.id,
          type: 'whatsapp',
          name: 'WhatsApp Business',
          config: {
            phone: '+1234567890',
            business_name: 'Company Support'
          },
          status: 'active'
        });
      }
    });

    const { data: connectors, error: connError } = await supabase
      .from('connectors')
      .insert(connectorsData)
      .select();

    if (connError) {
      console.error('Error creating connectors:', connError);
      return;
    }
    console.log('Created', connectors.length, 'connectors');

    // Step 4: Create customers
    console.log('\n4. Creating customers...');
    const customersData = [
      {
        workspace_id: workspace.id,
        email: 'alice.anderson@example.com',
        name: 'Alice Anderson',
        phone: '+1555-0101',
        source_type: 'email',
        metadata: { company: 'Tech Corp', priority: 'high' }
      },
      {
        workspace_id: workspace.id,
        email: 'bob.brown@example.com',
        name: 'Bob Brown',
        phone: '+1555-0102',
        source_type: 'telegram',
        metadata: { company: 'Design Studio', priority: 'medium' }
      },
      {
        workspace_id: workspace.id,
        email: 'carol.chen@example.com',
        name: 'Carol Chen',
        phone: '+1555-0103',
        source_type: 'whatsapp',
        metadata: { company: 'Marketing Agency', priority: 'high' }
      },
      {
        workspace_id: workspace.id,
        email: 'david.davis@example.com',
        name: 'David Davis',
        phone: '+1555-0104',
        source_type: 'email',
        metadata: { company: 'Consulting LLC', priority: 'low' }
      },
      {
        workspace_id: workspace.id,
        email: 'emma.evans@example.com',
        name: 'Emma Evans',
        phone: '+1555-0105',
        source_type: 'telegram',
        metadata: { company: 'Startup Inc', priority: 'medium' }
      },
      {
        workspace_id: workspace.id,
        email: 'frank.foster@example.com',
        name: 'Frank Foster',
        phone: '+1555-0106',
        source_type: 'email',
        metadata: { company: 'Enterprise Solutions', priority: 'high' }
      },
      {
        workspace_id: workspace.id,
        email: 'grace.garcia@example.com',
        name: 'Grace Garcia',
        phone: '+1555-0107',
        source_type: 'whatsapp',
        metadata: { company: 'Small Business', priority: 'medium' }
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

    // Step 5: Create tickets
    console.log('\n5. Creating tickets...');
    const ticketSubjects = [
      'Unable to access dashboard',
      'Feature request: Export to PDF',
      'Payment processing error',
      'Integration with Slack not working',
      'How to set up two-factor authentication?',
      'Bug: Notification emails not sending',
      'Upgrade account to Premium',
      'API rate limiting issues',
      'Mobile app crashes on startup',
      'Data export taking too long',
      'Custom domain setup help',
      'Invoice for last month missing',
      'Password reset not working',
      'Team member cannot access project',
      'Analytics dashboard showing wrong data',
      'Need help with API documentation',
      'Billing address update',
      'Cancel subscription request',
      'Performance issues on large datasets',
      'Feature request: Dark mode'
    ];

    const ticketsData = [];
    const now = Date.now();

    // Distribute tickets across projects
    for (let i = 0; i < ticketSubjects.length; i++) {
      const project = projects[i % projects.length];
      const customer = customers[i % customers.length];
      const connector = connectors.find(c => c.project_id === project.id);

      // Vary statuses - more open/pending, fewer resolved/closed
      const statusWeights = ['open', 'open', 'open', 'pending', 'pending', 'resolved', 'closed'];
      const status = statusWeights[i % statusWeights.length];

      // Vary priorities
      const priorityWeights = ['low', 'medium', 'medium', 'high', 'urgent'];
      const priority = priorityWeights[i % priorityWeights.length];

      // Create tickets with varied creation times (last 7 days)
      const hoursAgo = Math.floor(Math.random() * 168); // 0-168 hours (7 days)
      const createdAt = new Date(now - (hoursAgo * 60 * 60 * 1000));
      const updatedAt = new Date(createdAt.getTime() + (Math.random() * 2 * 60 * 60 * 1000)); // Updated 0-2 hours after creation

      ticketsData.push({
        project_id: project.id,
        customer_id: customer.id,
        connector_id: connector.id,
        subject: ticketSubjects[i],
        status,
        priority,
        tags: [
          project.name.toLowerCase().replace(/\s+/g, '-'),
          priority === 'urgent' ? 'urgent' : null,
          status === 'open' ? 'needs-response' : null
        ].filter(Boolean),
        created_at: createdAt.toISOString(),
        updated_at: updatedAt.toISOString(),
        resolved_at: ['resolved', 'closed'].includes(status)
          ? new Date(updatedAt.getTime() + (Math.random() * 60 * 60 * 1000)).toISOString()
          : null
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

    // Step 6: Create messages for tickets
    console.log('\n6. Creating messages...');
    const messageTemplates = {
      customer: [
        'Hi, I need help with this issue.',
        'This is urgent, please help!',
        'I tried the suggested solution but it didn\'t work.',
        'Can you provide more details?',
        'When will this be resolved?',
        'Thank you for your help!',
        'This is still not working correctly.',
        'I followed the instructions but got an error.',
        'Is there any update on this?',
        'Can we schedule a call to discuss this?'
      ],
      agent: [
        'Thank you for contacting support. I\'ll help you with this.',
        'I understand your concern. Let me look into this.',
        'Can you please provide more information about the issue?',
        'I\'ve escalated this to our technical team.',
        'This has been resolved. Please check and confirm.',
        'Here\'s the solution to your problem...',
        'We\'re working on this. I\'ll update you soon.',
        'Please try the following steps...',
        'I apologize for the inconvenience.',
        'This feature will be available in the next update.'
      ]
    };

    const messagesData = [];

    for (const ticket of tickets) {
      const customer = customers.find(c => c.id === ticket.customer_id);

      // Create 2-5 messages per ticket
      const messageCount = Math.floor(Math.random() * 4) + 2;
      const ticketCreatedAt = new Date(ticket.created_at);

      for (let j = 0; j < messageCount; j++) {
        const isCustomerMessage = j % 2 === 0;
        const messageType = isCustomerMessage ? 'customer' : 'agent';
        const templates = messageTemplates[messageType];
        const content = templates[Math.floor(Math.random() * templates.length)];

        // Messages are created after ticket, with some time gaps
        const messageTime = new Date(ticketCreatedAt.getTime() + (j * 30 * 60 * 1000) + (Math.random() * 15 * 60 * 1000));

        messagesData.push({
          ticket_id: ticket.id,
          sender_type: messageType,
          sender_id: isCustomerMessage ? customer.id : user.id,
          content: content,
          attachments: Math.random() > 0.8 ? [{ name: 'screenshot.png', url: 'https://example.com/file.png' }] : [],
          is_internal_note: false,
          created_at: messageTime.toISOString(),
          read_at: Math.random() > 0.3 ? new Date(messageTime.getTime() + (10 * 60 * 1000)).toISOString() : null
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

    console.log('\n Successfully added data for user:', userEmail);
    console.log('Summary:');
    console.log(`  - Workspace: ${workspace.name}`);
    console.log(`  - ${projects.length} projects`);
    console.log(`  - ${connectors.length} connectors`);
    console.log(`  - ${customers.length} customers`);
    console.log(`  - ${tickets.length} tickets`);
    console.log(`  - ${messages.length} messages`);

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

addUserData();