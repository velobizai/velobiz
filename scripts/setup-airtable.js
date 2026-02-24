/**
 * Airtable Setup Script
 * Creates tables and populates seed data for VelocityAI
 *
 * Prerequisites:
 * - npm install node-fetch
 *
 * Usage:
 * node scripts/setup-airtable.js
 */

const BASE_ID = 'appHYrysGW1ozoHqS';
const airtableaccess = '';
const AIRTABLE_API_BASE = 'https://api.airtable.com/v0';
const AIRTABLE_META_API_BASE = 'https://api.airtable.com/v0/meta/bases';

// Helper function to make API calls
async function airtableRequest(url, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${airtableaccess}`,
      'Content-Type': 'application/json'
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Airtable API Error (${response.status}): ${errorText}`);
  }

  return await response.json();
}

// Table schemas based on C# models
const tableSchemas = [
  {
    name: 'Contacts',
    description: 'Contact form submissions from website visitors',
    fields: [
      { name: 'Name', type: 'singleLineText' },
      { name: 'Email', type: 'email' },
      { name: 'Company', type: 'singleLineText' },
      { name: 'Phone', type: 'phoneNumber' },
      { name: 'Message', type: 'multilineText' },
      { name: 'ServiceInterest', type: 'singleLineText' },
      { name: 'Status', type: 'singleSelect', options: { choices: [
        { name: 'new' },
        { name: 'contacted' },
        { name: 'qualified' },
        { name: 'converted' },
        { name: 'closed' }
      ]}},
      { name: 'CreatedAt', type: 'dateTime', options: { dateFormat: { name: 'iso' }, timeFormat: { name: '24hour' }, timeZone: 'utc' }}
    ]
  },
  {
    name: 'FAQs',
    description: 'Frequently Asked Questions displayed on the website',
    fields: [
      { name: 'Question', type: 'singleLineText' },
      { name: 'Answer', type: 'multilineText' },
      { name: 'DisplayOrder', type: 'number', options: { precision: 0 }},
      { name: 'IsActive', type: 'checkbox', options: { icon: 'check', color: 'greenBright' }}
    ]
  },
  {
    name: 'Services',
    description: 'AI Services offered by VelocityAI',
    fields: [
      { name: 'Title', type: 'singleLineText' },
      { name: 'Icon', type: 'singleLineText' },
      { name: 'ShortDescription', type: 'multilineText' },
      { name: 'LongDescription', type: 'multilineText' },
      { name: 'DisplayOrder', type: 'number', options: { precision: 0 }},
      { name: 'IsActive', type: 'checkbox', options: { icon: 'check', color: 'greenBright' }}
    ]
  },
  {
    name: 'NewsletterSubscribers',
    description: 'Email addresses subscribed to the newsletter',
    fields: [
      { name: 'Email', type: 'email' },
      { name: 'SubscribedAt', type: 'dateTime', options: { dateFormat: { name: 'iso' }, timeFormat: { name: '24hour' }, timeZone: 'utc' }},
      { name: 'IsActive', type: 'checkbox', options: { icon: 'check', color: 'greenBright' }}
    ]
  }
];

// Seed data from ApplicationDbContext.cs
const seedData = {
  Services: [
    {
      fields: {
        Title: "AI Voice Agent — Inbound Support",
        Icon: "phone",
        ShortDescription: "24/7 intelligent inbound call handling with sentiment detection and automatic human escalation.",
        LongDescription: "Full inbound call automation including sentiment detection to flag frustrated callers early, automatic escalation with context handoff to human agents, CRM logging, voicemail transcription, multi-language support, and daily performance summaries categorised by issue type, resolution rate, and escalation rate. GDPR/TCPA compliant with built-in consent layer.",
        DisplayOrder: 1,
        IsActive: true
      }
    },
    {
      fields: {
        Title: "AI Voice Agent — Outbound Collection",
        Icon: "signal",
        ShortDescription: "Automated outbound calls for information collection with full compliance built in.",
        LongDescription: "Outbound call automation for data collection and follow-ups. Includes mandatory AI disclosure, opt-out mechanism with permanent preference storage, timezone-aware call scheduling, configurable retry logic with attempt limits, and adaptive conversational branching to handle unexpected responses gracefully. Warm leads only recommended approach.",
        DisplayOrder: 2,
        IsActive: true
      }
    },
    {
      fields: {
        Title: "Email Management AI Agent",
        Icon: "mail",
        ShortDescription: "Intelligent email triage, classification, and response drafting with SLA tracking.",
        LongDescription: "Automated email management including triage and classification by category (support, billing, complaint, sales), draft-and-review mode before any auto-send, full thread awareness to avoid contradictions, attachment processing for invoices and documents, SLA breach alerting, and a prioritised daily brief with recommended actions and deadlines grouped by urgency.",
        DisplayOrder: 3,
        IsActive: true
      }
    },
    {
      fields: {
        Title: "Marketing Campaign AI Agent",
        Icon: "megaphone",
        ShortDescription: "End-to-end email marketing automation with segmentation, A/B testing, and drip sequences.",
        LongDescription: "Full email marketing automation covering audience segmentation and personalisation, A/B testing of subject lines and body copy with auto-optimisation on open and click rates, multi-touch drip sequences (welcome, nurture, re-engagement), deliverability monitoring, branded sender address management, frictionless in-email feedback collection, and full CAN-SPAM/GDPR compliance with automated unsubscribe handling.",
        DisplayOrder: 4,
        IsActive: true
      }
    },
    {
      fields: {
        Title: "Social Media Scheduling & Management",
        Icon: "share",
        ShortDescription: "AI-powered content drafting, scheduling, and tiered comment management across all platforms.",
        LongDescription: "Cross-platform content creation and scheduling automation with tiered comment handling — auto-reply to simple positive comments, draft responses for questions and complaints submitted for human approval. Includes real-time negative sentiment monitoring and crisis alerting, content performance analytics feeding back into content generation, and platform policy compliance checks before posting.",
        DisplayOrder: 5,
        IsActive: true
      }
    },
    {
      fields: {
        Title: "Paid Ads AI Agent",
        Icon: "target",
        ShortDescription: "AI-driven ad creative generation, budget optimisation, and cross-platform attribution.",
        LongDescription: "Full paid advertising automation covering ad copy and headline generation, audience targeting and lookalike audience building from existing customer data, automated budget reallocation toward better-performing ad sets, cross-platform attribution across Facebook, Google, and TikTok, and pre-submission compliance review against each platform's advertising policies.",
        DisplayOrder: 6,
        IsActive: true
      }
    },
    {
      fields: {
        Title: "GEO — Generative Engine Optimisation",
        Icon: "brain",
        ShortDescription: "Optimise your brand's visibility in AI-powered search engines like ChatGPT and Perplexity.",
        LongDescription: "Forward-looking brand optimisation for AI search surfaces including structured data and entity consistency audits, citation-worthy original content strategy, AI search mention monitoring across ChatGPT, Gemini, and Perplexity, and integration with traditional SEO fundamentals. GEO is additive to SEO — both are maintained in parallel.",
        DisplayOrder: 7,
        IsActive: true
      }
    },
    {
      fields: {
        Title: "SDLC AI Agent Suite",
        Icon: "code",
        ShortDescription: "A full team of specialised AI development agents to accelerate your software delivery pipeline.",
        LongDescription: "A coordinated suite of development sub-agents: Requirements Analyst (parses PRDs, generates acceptance criteria), Code Generator (implements features from specs), Code Reviewer (automated PR reviews and security scanning), Test Generator (unit, integration, and regression tests), Documentation Agent (maintains technical docs and changelogs), and DevOps Agent (monitors deployments, auto-rollback on failure). Humans remain in the loop for all production deployments.",
        DisplayOrder: 8,
        IsActive: true
      }
    }
  ],
  FAQs: [
    {
      fields: {
        Question: "How long does it take to deploy an AI agent?",
        Answer: "Most single-agent deployments take 2–4 weeks from kickoff to go-live. More complex multi-agent systems typically take 6–8 weeks. We always start with a human-in-the-loop phase before granting full autonomy.",
        DisplayOrder: 1,
        IsActive: true
      }
    },
    {
      fields: {
        Question: "Will the AI sound robotic to my customers?",
        Answer: "No. We use the latest NLP and voice synthesis to create conversational, brand-aligned agents. We customise the tone, vocabulary, and personality to match your brand.",
        DisplayOrder: 2,
        IsActive: true
      }
    },
    {
      fields: {
        Question: "What happens if the AI can't handle a question?",
        Answer: "Every agent has intelligent escalation built in. If the AI detects confusion, repeated questions, or negative sentiment, it seamlessly transfers to a human agent with full context so the customer never has to repeat themselves.",
        DisplayOrder: 3,
        IsActive: true
      }
    },
    {
      fields: {
        Question: "Is my data secure?",
        Answer: "Yes. We follow industry-standard practices including encryption at rest and in transit, SOC 2 compliance readiness, and strict access controls. Enterprise clients can opt for on-premises deployment.",
        DisplayOrder: 4,
        IsActive: true
      }
    },
    {
      fields: {
        Question: "Can I start with one agent and add more later?",
        Answer: "Absolutely — that's what we recommend. Start with the highest-impact use case, prove the ROI, then expand. Every agent plugs into the same shared CRM, analytics, and compliance infrastructure.",
        DisplayOrder: 5,
        IsActive: true
      }
    },
    {
      fields: {
        Question: "Do you integrate with my existing CRM and tools?",
        Answer: "Yes — Salesforce, HubSpot, Zoho, Twilio, SendGrid, Slack, Google Workspace, Microsoft 365, and more. For custom systems, we build tailored API integrations.",
        DisplayOrder: 6,
        IsActive: true
      }
    }
  ]
};

async function createTable(schema) {
  console.log(`\n📋 Creating table: ${schema.name}...`);

  try {
    const result = await airtableRequest(
      `${AIRTABLE_META_API_BASE}/${BASE_ID}/tables`,
      'POST',
      {
        name: schema.name,
        description: schema.description,
        fields: schema.fields
      }
    );

    console.log(`✅ Table "${schema.name}" created successfully (ID: ${result.id})`);
    return result;
  } catch (error) {
    // Check if table already exists
    if (error.message.includes('DUPLICATE_OR_EMPTY_TABLE_NAME') ||
        error.message.includes('already exists')) {
      console.log(`⚠️  Table "${schema.name}" already exists, skipping...`);
      return { id: 'existing', name: schema.name, skipped: true };
    }
    console.error(`❌ Error creating table "${schema.name}":`, error.message);
    throw error;
  }
}

async function insertSeedData(tableName, records) {
  console.log(`\n🌱 Inserting seed data into ${tableName}...`);

  // Airtable allows max 10 records per request
  const batchSize = 10;
  let totalInserted = 0;

  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);

    try {
      const result = await airtableRequest(
        `${AIRTABLE_API_BASE}/${BASE_ID}/${tableName}`,
        'POST',
        { records: batch }
      );

      totalInserted += result.records.length;
      console.log(`  ✓ Inserted ${result.records.length} records`);
    } catch (error) {
      console.error(`  ✗ Error inserting batch:`, error.message);
      throw error;
    }
  }

  console.log(`✅ Total ${totalInserted} records inserted into ${tableName}`);
}

async function main() {
  console.log('🚀 Starting Airtable Setup for VelocityAI');
  console.log(`📦 Base ID: ${BASE_ID}`);
  console.log('=' .repeat(60));

  try {
    // Step 1: Create all tables
    console.log('\n📋 STEP 1: Creating Tables');
    console.log('-'.repeat(60));

    const createdTables = [];
    for (const schema of tableSchemas) {
      const table = await createTable(schema);
      createdTables.push({ name: schema.name, id: table.id });

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Step 2: Insert seed data
    console.log('\n\n🌱 STEP 2: Inserting Seed Data');
    console.log('-'.repeat(60));

    // Insert Services
    if (seedData.Services) {
      await insertSeedData('Services', seedData.Services);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Insert FAQs
    if (seedData.FAQs) {
      await insertSeedData('FAQs', seedData.FAQs);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Success summary
    console.log('\n\n✅ SETUP COMPLETE!');
    console.log('=' .repeat(60));
    console.log('\n📊 Summary:');
    console.log(`  • Tables Created: ${createdTables.length}`);
    createdTables.forEach(t => console.log(`    - ${t.name} (${t.id})`));
    console.log(`  • Services Seeded: ${seedData.Services.length} records`);
    console.log(`  • FAQs Seeded: ${seedData.FAQs.length} records`);
    console.log('\n🎉 Your Airtable base is ready to use!');
    console.log(`\n🔗 View your base at: https://airtable.com/${BASE_ID}`);

  } catch (error) {
    console.error('\n\n❌ SETUP FAILED');
    console.error('=' .repeat(60));
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Import fetch for Node.js < 18
(async () => {
  if (typeof fetch === 'undefined') {
    const nodeFetch = await import('node-fetch');
    global.fetch = nodeFetch.default;
  }
  main();
})();
