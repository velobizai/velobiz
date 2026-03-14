# Database Schema — Services Page

**Feature ID:** FEATURE-3
**Database:** MySQL 8.x
**ORM:** Entity Framework Core 6+ with Pomelo MySQL Provider
**Migration Strategy:** Code-First with EF Core Migrations

---

## Overview

This feature does NOT introduce new database tables. The `Service` entity was already created in Feature 0 (Infrastructure). This feature adds a **data migration** to seed all 8 services into the `Services` table using EF Core's `HasData()` method.

---

## Existing Entity

### Service Entity

**File:** `backend/Velobiz.Api/Models/Service.cs`

**Entity Class (Already Exists):**

```csharp
namespace Velobiz.Api.Models;

public class Service
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string LongDescription { get; set; } = string.Empty;
    public int DisplayOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;
}
```

**MySQL Table Schema:**

```sql
CREATE TABLE `Services` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Icon` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ShortDescription` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `LongDescription` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `DisplayOrder` int NOT NULL DEFAULT '0',
  `IsActive` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`Id`),
  KEY `IX_Services_IsActive_DisplayOrder` (`IsActive`, `DisplayOrder`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

**Field Details:**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `Id` | INT | No | AUTO_INCREMENT | Primary key |
| `Title` | VARCHAR(255) | No | - | Service name (e.g., "AI Voice Agent — Inbound Support") |
| `Icon` | VARCHAR(50) | No | - | Lucide icon name (e.g., "phone", "mail") |
| `ShortDescription` | TEXT | No | - | Brief 1-2 sentence summary |
| `LongDescription` | TEXT | No | - | Full paragraph with details |
| `DisplayOrder` | INT | No | 0 | Sort order for display (1-8) |
| `IsActive` | TINYINT(1) | No | 1 | Soft delete flag (1 = active, 0 = inactive) |

**Indexes:**

| Index Name | Columns | Type | Purpose |
|------------|---------|------|---------|
| `PRIMARY` | `Id` | PRIMARY KEY | Unique identifier |
| `IX_Services_IsActive_DisplayOrder` | `IsActive, DisplayOrder` | COMPOSITE | Optimize query: WHERE IsActive = 1 ORDER BY DisplayOrder |

---

## EF Core Configuration

### DbContext Configuration

**File:** `backend/Velobiz.Api/Data/ApplicationDbContext.cs`

**Existing DbSet:**

```csharp
public DbSet<Service> Services { get; set; } = null!;
```

**Fluent API Configuration (OnModelCreating):**

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);

    // Service entity configuration
    modelBuilder.Entity<Service>(entity =>
    {
        entity.HasKey(e => e.Id);

        entity.Property(e => e.Title)
            .IsRequired()
            .HasMaxLength(255);

        entity.Property(e => e.Icon)
            .IsRequired()
            .HasMaxLength(50);

        entity.Property(e => e.ShortDescription)
            .IsRequired()
            .HasColumnType("text");

        entity.Property(e => e.LongDescription)
            .IsRequired()
            .HasColumnType("text");

        entity.Property(e => e.DisplayOrder)
            .IsRequired()
            .HasDefaultValue(0);

        entity.Property(e => e.IsActive)
            .IsRequired()
            .HasDefaultValue(true);

        // Composite index for optimized queries
        entity.HasIndex(e => new { e.IsActive, e.DisplayOrder })
            .HasDatabaseName("IX_Services_IsActive_DisplayOrder");

        // Seed data (8 services)
        entity.HasData(GetServicesSeedData());
    });
}
```

---

## Seed Data

### Seed Data Method

**Location:** `backend/Velobiz.Api/Data/ApplicationDbContext.cs`

**Implementation:**

```csharp
private static Service[] GetServicesSeedData()
{
    return new[]
    {
        new Service
        {
            Id = 1,
            Title = "AI Voice Agent — Inbound Support",
            Icon = "phone",
            ShortDescription = "24/7 intelligent inbound call handling with sentiment detection and automatic human escalation.",
            LongDescription = "Full inbound call automation including sentiment detection to flag frustrated callers early, automatic escalation with context handoff to human agents, CRM logging, voicemail transcription, multi-language support, and daily performance summaries categorised by issue type, resolution rate, and escalation rate. GDPR/TCPA compliant with built-in consent layer.",
            DisplayOrder = 1,
            IsActive = true
        },
        new Service
        {
            Id = 2,
            Title = "AI Voice Agent — Outbound Collection",
            Icon = "signal",
            ShortDescription = "Automated outbound calls for information collection with full compliance built in.",
            LongDescription = "Outbound call automation for data collection and follow-ups. Includes mandatory AI disclosure, opt-out mechanism with permanent preference storage, timezone-aware call scheduling, configurable retry logic with attempt limits, and adaptive conversational branching to handle unexpected responses gracefully. Warm leads only recommended approach.",
            DisplayOrder = 2,
            IsActive = true
        },
        new Service
        {
            Id = 3,
            Title = "Email Management AI Agent",
            Icon = "mail",
            ShortDescription = "Intelligent email triage, classification, and response drafting with SLA tracking.",
            LongDescription = "Automated email management including triage and classification by category (support, billing, complaint, sales), draft-and-review mode before any auto-send, full thread awareness to avoid contradictions, attachment processing for invoices and documents, SLA breach alerting, and a prioritised daily brief with recommended actions and deadlines grouped by urgency.",
            DisplayOrder = 3,
            IsActive = true
        },
        new Service
        {
            Id = 4,
            Title = "Marketing Campaign AI Agent",
            Icon = "megaphone",
            ShortDescription = "End-to-end email marketing automation with segmentation, A/B testing, and drip sequences.",
            LongDescription = "Full email marketing automation covering audience segmentation and personalisation, A/B testing of subject lines and body copy with auto-optimisation on open and click rates, multi-touch drip sequences (welcome, nurture, re-engagement), deliverability monitoring, branded sender address management, frictionless in-email feedback collection, and full CAN-SPAM/GDPR compliance with automated unsubscribe handling.",
            DisplayOrder = 4,
            IsActive = true
        },
        new Service
        {
            Id = 5,
            Title = "Social Media Scheduling & Management",
            Icon = "share",
            ShortDescription = "AI-powered content drafting, scheduling, and tiered comment management across all platforms.",
            LongDescription = "Cross-platform content creation and scheduling automation with tiered comment handling — auto-reply to simple positive comments, draft responses for questions and complaints submitted for human approval. Includes real-time negative sentiment monitoring and crisis alerting, content performance analytics feeding back into content generation, and platform policy compliance checks before posting.",
            DisplayOrder = 5,
            IsActive = true
        },
        new Service
        {
            Id = 6,
            Title = "Paid Ads AI Agent",
            Icon = "target",
            ShortDescription = "AI-driven ad creative generation, budget optimisation, and cross-platform attribution.",
            LongDescription = "Full paid advertising automation covering ad copy and headline generation, audience targeting and lookalike audience building from existing customer data, automated budget reallocation toward better-performing ad sets, cross-platform attribution across Facebook, Google, and TikTok, and pre-submission compliance review against each platform's advertising policies.",
            DisplayOrder = 6,
            IsActive = true
        },
        new Service
        {
            Id = 7,
            Title = "GEO — Generative Engine Optimisation",
            Icon = "brain",
            ShortDescription = "Optimise your brand's visibility in AI-powered search engines like ChatGPT and Perplexity.",
            LongDescription = "Forward-looking brand optimisation for AI search surfaces including structured data and entity consistency audits, citation-worthy original content strategy, AI search mention monitoring across ChatGPT, Gemini, and Perplexity, and integration with traditional SEO fundamentals. GEO is additive to SEO — both are maintained in parallel.",
            DisplayOrder = 7,
            IsActive = true
        },
        new Service
        {
            Id = 8,
            Title = "SDLC AI Agent Suite",
            Icon = "code",
            ShortDescription = "A full team of specialised AI development agents to accelerate your software delivery pipeline.",
            LongDescription = "A coordinated suite of development sub-agents: Requirements Analyst (parses PRDs, generates acceptance criteria), Code Generator (implements features from specs), Code Reviewer (automated PR reviews and security scanning), Test Generator (unit, integration, and regression tests), Documentation Agent (maintains technical docs and changelogs), and DevOps Agent (monitors deployments, auto-rollback on failure). Humans remain in the loop for all production deployments.",
            DisplayOrder = 8,
            IsActive = true
        }
    };
}
```

**Why Static IDs?**

Using static IDs (1-8) ensures:
1. **Idempotent migrations:** Running the migration multiple times won't create duplicate records
2. **Referential integrity:** Future features can reference services by ID
3. **Consistent ordering:** DisplayOrder values match ID values for simplicity

---

## Migration Plan

### Migration #1: Add Seed Data

**Migration Name:** `SeedServicesData`

**Command to Generate:**

```bash
cd backend/Velobiz.Api
dotnet ef migrations add SeedServicesData
```

**Migration File (Auto-Generated):**

`backend/Velobiz.Api/Migrations/YYYYMMDDHHMMSS_SeedServicesData.cs`

**Migration Up Method:**

```csharp
protected override void Up(MigrationBuilder migrationBuilder)
{
    migrationBuilder.InsertData(
        table: "Services",
        columns: new[] { "Id", "Title", "Icon", "ShortDescription", "LongDescription", "DisplayOrder", "IsActive" },
        values: new object[,]
        {
            { 1, "AI Voice Agent — Inbound Support", "phone", "24/7 intelligent inbound call handling...", "Full inbound call automation...", 1, true },
            { 2, "AI Voice Agent — Outbound Collection", "signal", "Automated outbound calls...", "Outbound call automation...", 2, true },
            // ... 6 more rows
        }
    );
}
```

**Migration Down Method:**

```csharp
protected override void Down(MigrationBuilder migrationBuilder)
{
    migrationBuilder.DeleteData(
        table: "Services",
        keyColumn: "Id",
        keyValues: new object[] { 1, 2, 3, 4, 5, 6, 7, 8 }
    );
}
```

**Apply Migration (Development):**

```bash
dotnet ef database update
```

**Apply Migration (Production):**

```bash
# Option 1: Railway deploy command
dotnet ef database update --connection "$DATABASE_URL"

# Option 2: Startup check in Program.cs
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    db.Database.Migrate(); // Apply pending migrations
}
```

---

## Data Validation

### Constraints

| Constraint | Rule | Enforced By |
|------------|------|-------------|
| Title NOT NULL | Required | MySQL + EF Core |
| Icon NOT NULL | Required | MySQL + EF Core |
| ShortDescription NOT NULL | Required | MySQL + EF Core |
| LongDescription NOT NULL | Required | MySQL + EF Core |
| DisplayOrder >= 0 | Non-negative integer | Application logic |
| IsActive IN (0,1) | Boolean flag | MySQL TINYINT(1) |

### Business Rules

1. **Unique Display Order:** Each service should have a unique DisplayOrder (1-8)
   - Currently enforced by seed data design
   - Future: Add unique index if admin panel is implemented

2. **Icon Name Validation:** Icon values must match Lucide icon names
   - Valid: "phone", "mail", "signal", "megaphone", "share", "target", "brain", "code"
   - Enforced by frontend (component will fail to render if icon is invalid)

3. **Active Flag:** Only active services (IsActive = true) are returned by API
   - Enforced by repository query: `.Where(s => s.IsActive)`

---

## Query Performance

### Expected Query Performance

**Query:** `SELECT * FROM Services WHERE IsActive = 1 ORDER BY DisplayOrder`

**Expected Execution Time:** <50ms

**Rows Returned:** 8 (or fewer if some services are inactive)

### Index Usage

**Query Execution Plan:**

```sql
EXPLAIN SELECT * FROM Services WHERE IsActive = 1 ORDER BY DisplayOrder;
```

**Expected Plan:**

| id | select_type | table | type | possible_keys | key | key_len | ref | rows | Extra |
|----|-------------|-------|------|---------------|-----|---------|-----|------|-------|
| 1 | SIMPLE | Services | ref | IX_Services_IsActive_DisplayOrder | IX_Services_IsActive_DisplayOrder | 1 | const | 8 | Using index condition |

**Optimization Notes:**

1. **Composite Index:** `(IsActive, DisplayOrder)` covers both WHERE clause and ORDER BY
2. **AsNoTracking():** EF Core query disables change tracking for read-only operations
3. **Small Result Set:** Only 8 rows, no pagination needed

---

## Database Backup and Recovery

### Seed Data Backup

**Seed data is version-controlled** in ApplicationDbContext.cs, so it can be recreated by:

1. Drop database: `dotnet ef database drop`
2. Recreate: `dotnet ef database update`

No separate backup script is needed.

### Production Backup (Railway)

**Railway MySQL automatic backups:**
- Daily snapshots (retained for 7 days on paid plans)
- Manual snapshot via Railway dashboard

**Manual Export (if needed):**

```bash
mysqldump -h <railway-host> -u <user> -p <database> Services > services_backup.sql
```

---

## Testing Data

### Test Data for Unit Tests

**In-Memory Database (EF Core InMemory Provider):**

```csharp
// Test setup
var options = new DbContextOptionsBuilder<ApplicationDbContext>()
    .UseInMemoryDatabase(databaseName: "TestDb")
    .Options;

using var context = new ApplicationDbContext(options);

// Seed test data
context.Services.AddRange(
    new Service { Id = 1, Title = "Test Service 1", Icon = "phone", ShortDescription = "Test", LongDescription = "Test", DisplayOrder = 1, IsActive = true },
    new Service { Id = 2, Title = "Test Service 2", Icon = "mail", ShortDescription = "Test", LongDescription = "Test", DisplayOrder = 2, IsActive = true }
);
context.SaveChanges();
```

---

## Rollback Plan

### Rollback Migration

**Command:**

```bash
dotnet ef database update <PreviousMigrationName>
```

**Example:**

```bash
# Rollback to state before SeedServicesData
dotnet ef database update InitialCreate
```

**Effect:** Deletes all 8 seed records from Services table

---

## Data Integrity Checks

### Verification Queries

**Check if seed data was applied:**

```sql
SELECT COUNT(*) FROM Services;
-- Expected: 8

SELECT * FROM Services ORDER BY DisplayOrder;
-- Expected: 8 rows with IDs 1-8, DisplayOrder 1-8
```

**Check for duplicates:**

```sql
SELECT DisplayOrder, COUNT(*)
FROM Services
GROUP BY DisplayOrder
HAVING COUNT(*) > 1;
-- Expected: 0 rows (no duplicates)
```

**Check for orphaned records (IsActive = false but no admin panel exists yet):**

```sql
SELECT * FROM Services WHERE IsActive = 0;
-- Expected: 0 rows (all services should be active initially)
```

---

## Future Schema Changes

### Potential Enhancements (Out of Scope for Feature 3)

1. **Add CreatedAt / UpdatedAt columns:**
   ```csharp
   public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
   public DateTime? UpdatedAt { get; set; }
   ```

2. **Add Category column** (for grouping services):
   ```csharp
   public string Category { get; set; } = "automation"; // "automation", "marketing", "development"
   ```

3. **Add PriceRange column** (for displaying pricing hints):
   ```csharp
   public string PriceRange { get; set; } = ""; // "$1,500 - $5,000/mo"
   ```

4. **Add SlugUrl column** (for dedicated service detail pages):
   ```csharp
   public string SlugUrl { get; set; } = ""; // "voice-agent-inbound-support"
   ```

5. **Add unique constraint on DisplayOrder:**
   ```csharp
   entity.HasIndex(e => e.DisplayOrder).IsUnique();
   ```

---

## Documentation References

- [EF Core Migrations](https://learn.microsoft.com/en-us/ef/core/managing-schemas/migrations/)
- [EF Core Data Seeding](https://learn.microsoft.com/en-us/ef/core/modeling/data-seeding)
- [Pomelo EF Core MySQL Provider](https://github.com/PomeloFoundation/Pomelo.EntityFrameworkCore.MySql)
- [MySQL 8.0 Reference Manual](https://dev.mysql.com/doc/refman/8.0/en/)

---

## Checklist

Before marking database work as complete:

- ✅ Service entity exists with all required properties
- ✅ ApplicationDbContext has DbSet<Service> registered
- ✅ Fluent API configuration includes entity constraints
- ✅ Composite index on (IsActive, DisplayOrder) is defined
- ✅ GetServicesSeedData() method returns all 8 services
- ✅ HasData() is called in OnModelCreating
- ✅ Migration generated: `dotnet ef migrations add SeedServicesData`
- ✅ Migration applied to dev database: `dotnet ef database update`
- ✅ Verification query returns 8 rows
- ✅ No duplicate DisplayOrder values
- ✅ All services have IsActive = true
- ✅ Query performance is <50ms
