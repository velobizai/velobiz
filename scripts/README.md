# Airtable Setup Script

This script creates the required tables in your Airtable base and populates them with seed data.

## Prerequisites

- Node.js 14+ installed
- Airtable Base ID and Personal Access Token configured in `appsettings.Development.json`
- PAT must have the following scopes:
  - `schema.bases:write` (to create tables)
  - `data.records:write` (to insert records)
  - `data.records:read` (optional, for verification)

## What This Script Does

1. **Creates 4 Tables** in your Airtable base:
   - **Contacts** - Contact form submissions from website visitors
   - **FAQs** - Frequently Asked Questions (with 6 seeded records)
   - **Services** - AI Services offered (with 8 seeded records)
   - **NewsletterSubscribers** - Email newsletter subscriptions

2. **Defines Fields** for each table matching your C# models:
   - Contacts: Name, Email, Company, Phone, Message, ServiceInterest, Status, CreatedAt
   - FAQs: Question, Answer, DisplayOrder, IsActive
   - Services: Title, Icon, ShortDescription, LongDescription, DisplayOrder, IsActive
   - NewsletterSubscribers: Email, SubscribedAt, IsActive

3. **Inserts Seed Data**:
   - 8 Services (AI Voice Agents, Email Management, Marketing, Social Media, Paid Ads, GEO, SDLC Suite)
   - 6 FAQs (deployment timeline, AI quality, escalation, security, scalability, integrations)

## Installation

```bash
cd scripts
npm install
```

## Usage

```bash
npm run setup
```

Or directly:

```bash
node setup-airtable.js
```

## Expected Output

```
🚀 Starting Airtable Setup for VelocityAI
📦 Base ID: appHYrysGW1ozoHqS
============================================================

📋 STEP 1: Creating Tables
------------------------------------------------------------

📋 Creating table: Contacts...
✅ Table "Contacts" created successfully (ID: tblXXXXXXXXXX)

📋 Creating table: FAQs...
✅ Table "FAQs" created successfully (ID: tblXXXXXXXXXX)

... (and so on for all 4 tables)

🌱 STEP 2: Inserting Seed Data
------------------------------------------------------------

🌱 Inserting seed data into Services...
  ✓ Inserted 8 records
✅ Total 8 records inserted into Services

🌱 Inserting seed data into FAQs...
  ✓ Inserted 6 records
✅ Total 6 records inserted into FAQs


✅ SETUP COMPLETE!
============================================================

📊 Summary:
  • Tables Created: 4
    - Contacts (tblXXXXXXXXXX)
    - FAQs (tblXXXXXXXXXX)
    - Services (tblXXXXXXXXXX)
    - NewsletterSubscribers (tblXXXXXXXXXX)
  • Services Seeded: 8 records
  • FAQs Seeded: 6 records

🎉 Your Airtable base is ready to use!

🔗 View your base at: https://airtable.com/appHYrysGW1ozoHqS
```

## Troubleshooting

### Error: "INVALID_PERMISSIONS_OR_MODEL_NOT_FOUND"
- Ensure your PAT has `schema.bases:write` scope
- Regenerate your PAT in Airtable with all required scopes

### Error: "NOT_FOUND" or "Invalid base ID"
- Verify the Base ID in `appsettings.Development.json` is correct
- Ensure you have access to the base

### Error: "INVALID_REQUEST"
- The table might already exist - check your Airtable base
- You may need to delete existing tables first if re-running

### Rate Limiting
- The script includes 500ms delays between requests to avoid rate limits
- If you still hit limits, increase the delay values in the script

## Notes

- **Idempotency**: This script is NOT idempotent. Running it multiple times will attempt to create duplicate tables, which will fail. If you need to re-run, delete the tables from Airtable first.
- **Table IDs**: After creation, Airtable assigns unique IDs to each table (e.g., `tblXXXXX`). You may want to save these for future reference.
- **Data Sync**: This script only creates tables and initial seed data. For ongoing sync between your .NET API and Airtable, you'll need to implement the Airtable repository pattern in your backend code.

## Next Steps

After running this script successfully:

1. ✅ Verify tables in Airtable web interface
2. ✅ Update your backend to use the new table IDs (if needed)
3. ✅ Test your API endpoints that interact with Airtable
4. ✅ Implement Airtable repository layer in your .NET backend
