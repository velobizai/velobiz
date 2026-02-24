# Database Schema — FAQ Page

**Feature ID:** FEATURE-5
**Database:** MySQL 8.x
**ORM:** Entity Framework Core 6+ with Pomelo MySQL Provider
**Migration Strategy:** Code-First with EF Core Migrations

---

## Overview

This feature does NOT introduce new database tables or migrations. The `Faq` entity was already created in Feature 0 (Infrastructure), and the seed data for all 6 FAQs was already added in the initial migration. This feature only implements the backend repository/service layer and frontend integration to consume the existing database data.

---

## Existing Entity

### Faq Entity

**File:** `backend/VelocityAI.Api/Models/Faq.cs` (ALREADY EXISTS)

**Entity Class:**

```csharp
namespace VelocityAI.Api.Models;

public class Faq
{
    public int Id { get; set; }
    public string Question { get; set; } = string.Empty;
    public string Answer { get; set; } = string.Empty;
    public int DisplayOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;
}
```

**MySQL Table Schema:**

```sql
CREATE TABLE `Faqs` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Question` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Answer` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `DisplayOrder` int NOT NULL DEFAULT '0',
  `IsActive` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`Id`),
  KEY `IX_Faqs_IsActive_DisplayOrder` (`IsActive`, `DisplayOrder`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

**Field Details:**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `Id` | INT | No | AUTO_INCREMENT | Primary key |
| `Question` | VARCHAR(500) | No | - | FAQ question text (e.g., "How long does it take to deploy an AI agent?") |
| `Answer` | TEXT | No | - | Full answer paragraph |
| `DisplayOrder` | INT | No | 0 | Sort order for display (1-6) |
| `IsActive` | TINYINT(1) | No | 1 | Soft delete flag (1 = active, 0 = inactive) |

**Indexes:**

| Index Name | Columns | Type | Purpose |
|------------|---------|------|---------|
| `PRIMARY` | `Id` | PRIMARY KEY | Unique identifier |
| `IX_Faqs_IsActive_DisplayOrder` | `IsActive, DisplayOrder` | COMPOSITE | Optimize query: WHERE IsActive = 1 ORDER BY DisplayOrder |

---

## EF Core Configuration

### DbContext Configuration

**File:** `backend/VelocityAI.Api/Data/ApplicationDbContext.cs` (ALREADY EXISTS)

**Existing DbSet:**

```csharp
public DbSet<Faq> Faqs => Set<Faq>();
```

**Fluent API Configuration (OnModelCreating):**

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);

    // Faq entity configuration
    modelBuilder.Entity<Faq>(entity =>
    {
        entity.HasKey(e => e.Id);

        entity.Property(e => e.Question)
            .IsRequired()
            .HasMaxLength(500);

        entity.Property(e => e.Answer)
            .IsRequired();

        entity.Property(e => e.DisplayOrder)
            .HasDefaultValue(0);

        entity.Property(e => e.IsActive)
            .HasDefaultValue(true);

        // Composite index for optimized query performance
        entity.HasIndex(e => new { e.IsActive, e.DisplayOrder })
            .HasDatabaseName("IX_Faqs_IsActive_DisplayOrder");
    });

    // Seed data (already exists)
    modelBuilder.Entity<Faq>().HasData(GetFaqsSeedData());
}

private static Faq[] GetFaqsSeedData()
{
    return new[]
    {
        new Faq
        {
            Id = 1,
            Question = "How long does it take to deploy an AI agent?",
            Answer = "Most single-agent deployments take 2–4 weeks from kickoff to go-live. More complex multi-agent systems typically take 6–8 weeks. We always start with a human-in-the-loop phase before granting full autonomy.",
            DisplayOrder = 1,
            IsActive = true
        },
        new Faq
        {
            Id = 2,
            Question = "Will the AI sound robotic to my customers?",
            Answer = "No. We use the latest NLP and voice synthesis to create conversational, brand-aligned agents. We customise the tone, vocabulary, and personality to match your brand.",
            DisplayOrder = 2,
            IsActive = true
        },
        new Faq
        {
            Id = 3,
            Question = "What happens if the AI can't handle a question?",
            Answer = "Every agent has intelligent escalation built in. If the AI detects confusion, repeated questions, or negative sentiment, it seamlessly transfers to a human agent with full context so the customer never has to repeat themselves.",
            DisplayOrder = 3,
            IsActive = true
        },
        new Faq
        {
            Id = 4,
            Question = "Is my data secure?",
            Answer = "Yes. We follow industry-standard practices including encryption at rest and in transit, SOC 2 compliance readiness, and strict access controls. Enterprise clients can opt for on-premises deployment.",
            DisplayOrder = 4,
            IsActive = true
        },
        new Faq
        {
            Id = 5,
            Question = "Can I start with one agent and add more later?",
            Answer = "Absolutely — that's what we recommend. Start with the highest-impact use case, prove the ROI, then expand. Every agent plugs into the same shared CRM, analytics, and compliance infrastructure.",
            DisplayOrder = 5,
            IsActive = true
        },
        new Faq
        {
            Id = 6,
            Question = "Do you integrate with my existing CRM and tools?",
            Answer = "Yes — Salesforce, HubSpot, Zoho, Twilio, SendGrid, Slack, Google Workspace, Microsoft 365, and more. For custom systems, we build tailored API integrations.",
            DisplayOrder = 6,
            IsActive = true
        }
    };
}
```

---

## Seed Data Details

### All 6 FAQs (Already Seeded)

| ID | DisplayOrder | Question | Answer (truncated) |
|----|--------------|----------|--------------------|
| 1 | 1 | How long does it take to deploy an AI agent? | Most single-agent deployments take 2–4 weeks... |
| 2 | 2 | Will the AI sound robotic to my customers? | No. We use the latest NLP and voice synthesis... |
| 3 | 3 | What happens if the AI can't handle a question? | Every agent has intelligent escalation built in... |
| 4 | 4 | Is my data secure? | Yes. We follow industry-standard practices... |
| 5 | 5 | Can I start with one agent and add more later? | Absolutely — that's what we recommend... |
| 6 | 6 | Do you integrate with my existing CRM and tools? | Yes — Salesforce, HubSpot, Zoho... |

**All FAQs have:**
- `IsActive = true`
- Static IDs (1-6) for idempotent migrations
- DisplayOrder matching ID (1-6) for simplicity

---

## Database Queries

### Primary Query (Used by FaqRepository.GetAllActiveAsync)

```sql
SELECT `Id`, `Question`, `Answer`, `DisplayOrder`, `IsActive`
FROM `Faqs`
WHERE `IsActive` = 1
ORDER BY `DisplayOrder` ASC;
```

**Expected Result:** 6 rows (all FAQs)

**Performance:**
- Index used: `IX_Faqs_IsActive_DisplayOrder`
- Query time: <10ms (indexed query on 6 rows)

### Verification Query (Manual Testing)

```sql
-- Check all FAQs in database
SELECT * FROM Faqs ORDER BY DisplayOrder;

-- Check active FAQs only (matches API behavior)
SELECT * FROM Faqs WHERE IsActive = 1 ORDER BY DisplayOrder;

-- Count FAQs
SELECT COUNT(*) FROM Faqs WHERE IsActive = 1;  -- Expected: 6
```

---

## Migration History

### Initial Migration (Already Applied)

**Migration Name:** `InitialCreate` (or similar)
**Applied:** During Feature 0 (Infrastructure setup)
**Changes:**
- Created `Faqs` table
- Created indexes
- Seeded 6 FAQ records

**No new migrations needed for Feature 5** — data and schema are already in place.

---

## Database Maintenance

### Future Schema Changes

If additional fields are needed (e.g., Category, Tags, LastUpdated), follow this process:

1. Update `Faq.cs` entity model
2. Generate migration: `dotnet ef migrations add AddCategoryToFaqs`
3. Review migration file
4. Apply migration: `dotnet ef database update`
5. Update seed data in `ApplicationDbContext.cs`
6. Generate data migration: `dotnet ef migrations add UpdateFaqSeedData`
7. Apply to production

### Soft Delete Pattern

FAQs use soft delete via `IsActive` flag:
- **To "delete" an FAQ:** Set `IsActive = false` (hides from API but preserves in DB)
- **To restore an FAQ:** Set `IsActive = true`
- **Hard delete:** Not recommended (use only for GDPR compliance if needed)

### Data Integrity Rules

1. **DisplayOrder must be unique** (optional constraint, not enforced at DB level)
2. **Question must not be empty** (enforced by EF Core Required attribute)
3. **Answer must not be empty** (enforced by EF Core Required attribute)
4. **IsActive defaults to true** (new FAQs are active by default)

---

## Performance Optimization

### Index Strategy

The composite index `IX_Faqs_IsActive_DisplayOrder` optimizes the most common query:

```sql
WHERE IsActive = 1 ORDER BY DisplayOrder
```

**Query Plan:**
1. Seek on `IsActive = 1` using index
2. Scan results in DisplayOrder order (already sorted by index)
3. No additional sorting needed

**Benchmarks (estimated):**
- 6 rows: <1ms
- 50 rows: <5ms
- 500 rows: <20ms

### Query Optimization

**EF Core Query:**

```csharp
return await _context.Faqs
    .Where(f => f.IsActive)
    .OrderBy(f => f.DisplayOrder)
    .AsNoTracking()  // ← Critical for read-only performance
    .ToListAsync();
```

**AsNoTracking() benefits:**
- No change tracking overhead
- Reduced memory usage
- Faster query execution (10-30% improvement)

---

## Data Migration Strategy

### Current Status
✅ Schema created
✅ Indexes created
✅ Seed data inserted
✅ Database accessible from backend

### If Seed Data Needs Updating

**Option 1: Create new migration**
```bash
# 1. Update GetFaqsSeedData() in ApplicationDbContext.cs
# 2. Generate migration
dotnet ef migrations add UpdateFaqContent

# 3. Review migration file (should show data updates)
# 4. Apply to dev database
dotnet ef database update

# 5. Apply to production (Railway)
# (Run migration command in Railway deployment)
```

**Option 2: Manual SQL update (quick fix)**
```sql
UPDATE Faqs
SET Answer = 'Updated answer text here'
WHERE Id = 1;
```

---

## Database Access Credentials

**Development (Local):**
- Connection string in `appsettings.Development.json`
- Typically: `Server=localhost;Database=VelocityAI;User=root;Password=...;`

**Production (Railway):**
- Connection string in Railway environment variables
- Format: `Server=containers-us-west-XXX.railway.app;Port=XXXX;Database=railway;User=root;Password=...;`

---

## Rollback Plan

If a data migration fails:

```bash
# Rollback to previous migration
dotnet ef database update PreviousMigrationName

# Or rollback all migrations (nuclear option)
dotnet ef database update 0
```

---

## Schema Validation Checklist

Before deploying FAQ feature:

- ✅ `Faqs` table exists in database
- ✅ All 6 FAQs are seeded with correct data
- ✅ `IX_Faqs_IsActive_DisplayOrder` index exists
- ✅ EF Core can query Faqs successfully
- ✅ Connection string is correct for environment (dev/prod)
- ✅ No pending migrations
- ✅ No data inconsistencies (all IsActive = true, DisplayOrder 1-6)
```

---