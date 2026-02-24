# FEATURE 1: Layout (Navbar + Footer) — Database Schema Specification

**Feature ID:** FEATURE-001
**Feature Name:** Layout (Navbar + Footer)
**Date:** 2026-02-20
**Status:** No Database Changes Required

---

## 1. Summary

**This feature requires NO database schema changes.**

The Navbar and Footer components are purely frontend layout components with static content. They do not:
- Store any data in the database
- Read any data from the database
- Modify any existing database tables
- Create any new database tables

All navigation links, social media URLs, and footer content are managed through frontend configuration files and do not require database storage.

---

## 2. Database Tables

**Total Tables Required:** 0

**Total Migrations Required:** 0

**Entity Framework Core Entities Required:** 0

---

## 3. No Database Entities

### 3.1 No Navigation Table
**Why not needed:**
- Navigation links are static and change infrequently (only when adding/removing pages)
- No requirement for admin users to dynamically add/remove navigation items via UI
- Hardcoded navigation in `layout.config.ts` is simpler and more performant (no DB query on every page load)

**If this changes in the future:**
A `Navigation` table could be added with columns:
- `Id` (int, primary key)
- `Label` (string)
- `Route` (string)
- `DisplayOrder` (int)
- `IsActive` (bool)
- `ParentId` (int?, nullable for nested menus)

**Current Decision:** Not needed for MVP. Hardcoded navigation is sufficient.

---

### 3.2 No Social Links Table
**Why not needed:**
- Social media URLs rarely change (company accounts are stable)
- No requirement for multiple social profiles or conditional display
- Storing in `environment.ts` allows easy overrides per environment (dev vs. prod)

**If this changes in the future:**
A `SocialLink` table could be added with columns:
- `Id` (int, primary key)
- `Platform` (string, e.g., "LinkedIn", "Twitter")
- `Url` (string)
- `Icon` (string)
- `DisplayOrder` (int)
- `IsActive` (bool)

**Current Decision:** Not needed. Environment config is simpler.

---

### 3.3 No Footer Content Table
**Why not needed:**
- Footer content (company description, tagline, legal links) is static
- No requirement for CMS-style editing of footer content
- Hardcoded content ensures consistency and performance (no DB query)

**If this changes in the future:**
A `FooterContent` table could be added with columns:
- `Id` (int, primary key)
- `Key` (string, e.g., "CompanyDescription", "Tagline")
- `Value` (string, text)
- `LastUpdated` (DateTime)

**Current Decision:** Not needed for marketing website. Content managed in code.

---

## 4. No EF Core Migrations

### 4.1 Migration Status
**Initial Migration:** `InitialCreate` (created in FEATURE 0: Infrastructure)
- This migration includes tables for: `Contact`, `Service`, `Faq`, `NewsletterSubscriber`
- No changes needed for FEATURE 1

**Additional Migrations:** None required for this feature

---

### 4.2 ApplicationDbContext Changes
**Changes Required:** None

The `ApplicationDbContext.cs` file remains unchanged. No new `DbSet` properties need to be added.

**Current ApplicationDbContext structure (from FEATURE 0):**
```csharp
public class ApplicationDbContext : DbContext
{
    public DbSet<Contact> Contacts { get; set; }
    public DbSet<Service> Services { get; set; }
    public DbSet<Faq> Faqs { get; set; }
    public DbSet<NewsletterSubscriber> NewsletterSubscribers { get; set; }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Service seed data (8 services)
        // Faq seed data (6 FAQs)
        // No navigation or footer content seeding needed
    }
}
```

**No modifications required for FEATURE 1.**

---

## 5. No Database Queries

### 5.1 No Repository Pattern Usage
The Navbar and Footer components do NOT inject or use:
- `IServicesRepository`
- `IFaqRepository`
- `IContactRepository`
- `INewsletterRepository`

**Reason:** No data fetching from database is required.

---

### 5.2 No Service Layer Usage
The Navbar and Footer components do NOT inject or use:
- `IServicesService`
- `IFaqService`
- `IContactService`

**Reason:** No business logic or data access layer interaction is required.

---

## 6. No API Endpoints (Database-Related)

Since there are no database entities for navigation or footer content, there are no corresponding API endpoints.

**Endpoints NOT created for this feature:**
- `GET /api/navigation` (not needed)
- `GET /api/footer` (not needed)
- `GET /api/social-links` (not needed)

**Existing API endpoints (from FEATURE 0/3/5/6) remain unchanged:**
- `GET /api/services` (returns all active services)
- `GET /api/faqs` (returns all active FAQs)
- `POST /api/contact` (creates a contact submission)
- `POST /api/newsletter` (creates a newsletter subscriber)

**None of these endpoints are called by Navbar or Footer components.**

---

## 7. Data Flow Diagram

### Current Architecture (FEATURE 1)

```
┌──────────────────────────────────────────────────────────────┐
│                     Angular Frontend                          │
│                                                               │
│  ┌────────────────┐       ┌────────────────┐                │
│  │ NavbarComponent│       │ FooterComponent│                │
│  └────────┬───────┘       └────────┬───────┘                │
│           │                        │                         │
│           ├─── Imports ───────────►├─── Imports ─────────┐  │
│           │                        │                      │  │
│  ┌────────▼────────────────────────▼──────┐   ┌──────────▼──────┐
│  │       layout.config.ts                 │   │  environment.ts │
│  │  - NAV_LINKS                           │   │  - social.      │
│  │  - FOOTER_QUICK_LINKS                  │   │    linkedin     │
│  │  - FOOTER_COMPANY_LINKS                │   │    twitter      │
│  │  - FOOTER_LEGAL_LINKS                  │   │    github       │
│  └────────────────────────────────────────┘   └─────────────────┘
│                                                               │
│  No HTTP Calls                                               │
│  No Database Access                                          │
│  No API Interaction                                          │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                    .NET Core Backend                          │
│                                                               │
│  ApplicationDbContext (unchanged)                            │
│  - Contacts                                                  │
│  - Services                                                  │
│  - Faqs                                                      │
│  - NewsletterSubscribers                                     │
│                                                               │
│  No new tables added for FEATURE 1                          │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                      MySQL Database                           │
│                                                               │
│  Tables (from FEATURE 0):                                    │
│  - contacts                                                  │
│  - services                                                  │
│  - faqs                                                      │
│  - newsletter_subscribers                                    │
│                                                               │
│  No new tables added for FEATURE 1                          │
└──────────────────────────────────────────────────────────────┘
```

**Key Observation:** Navbar and Footer components operate entirely within the Angular frontend. They do not interact with the backend or database at all.

---

## 8. Future Database Considerations

### 8.1 If Dynamic Navigation is Required (Future Enhancement)

**Scenario:** Client wants to add/remove navigation links via an admin panel without redeploying the application.

**Database Schema:**
```sql
CREATE TABLE navigation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    label VARCHAR(50) NOT NULL,
    route VARCHAR(255) NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    parent_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES navigation(id) ON DELETE CASCADE,
    INDEX idx_display_order (display_order),
    INDEX idx_is_active (is_active)
);
```

**EF Core Entity:**
```csharp
public class Navigation
{
    public int Id { get; set; }
    public string Label { get; set; } = string.Empty;
    public string Route { get; set; } = string.Empty;
    public int DisplayOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    public int? ParentId { get; set; }
    public Navigation? Parent { get; set; }
    public ICollection<Navigation> Children { get; set; } = new List<Navigation>();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
```

**API Endpoint:**
- `GET /api/navigation` (returns all active navigation items ordered by DisplayOrder)

**Impact:**
- NavbarComponent would need to call API on initialization
- Would require loading state, error state, and HttpClient injection
- Performance impact: Additional API call on every page load (mitigated by caching)

**Decision:** Not implemented for MVP. Hardcoded navigation is sufficient for a marketing website with stable structure.

---

### 8.2 If Social Links Become Dynamic (Future Enhancement)

**Scenario:** Client wants to add multiple social profiles or toggle social links on/off without redeploying.

**Database Schema:**
```sql
CREATE TABLE social_links (
    id INT AUTO_INCREMENT PRIMARY KEY,
    platform VARCHAR(50) NOT NULL,
    url VARCHAR(255) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_display_order (display_order),
    INDEX idx_is_active (is_active)
);
```

**EF Core Entity:**
```csharp
public class SocialLink
{
    public int Id { get; set; }
    public string Platform { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public int DisplayOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
```

**API Endpoint:**
- `GET /api/social-links` (returns all active social links ordered by DisplayOrder)

**Impact:**
- FooterComponent would need to call API on initialization
- Would require loading state and error handling

**Decision:** Not implemented for MVP. Environment config is simpler and more performant.

---

## 9. Testing Considerations

### 9.1 No Database Mocking Required
Since there are no database queries, unit tests for Navbar and Footer do NOT need:
- In-memory EF Core database (`Microsoft.EntityFrameworkCore.InMemory`)
- Mock repositories
- Mock `ApplicationDbContext`

### 9.2 No Integration Tests Required
Integration tests (using `WebApplicationFactory`) are NOT needed for this feature because:
- No API endpoints are involved
- No database queries are executed
- All data is static/hardcoded

**Testing Strategy:**
- **Unit tests**: Test component logic, scroll detection, menu state management
- **Accessibility tests**: Test keyboard navigation, ARIA attributes
- **Visual regression tests**: Test responsive layout at different breakpoints

---

## 10. Summary Checklist

- ✅ **Zero database tables** required for this feature
- ✅ **Zero EF Core entities** required for this feature
- ✅ **Zero EF Core migrations** required for this feature
- ✅ **Zero database queries** executed by Navbar or Footer components
- ✅ **Zero Repository pattern usage** in this feature
- ✅ **Zero Service layer usage** in this feature
- ✅ **ApplicationDbContext remains unchanged** (no new DbSet properties)
- ✅ **No seed data** needed in `OnModelCreating` for navigation or footer
- ✅ **No API endpoints** created for navigation or footer content
- ✅ **No database mocking** required in unit tests
- ✅ **No integration tests** required (no backend interaction)

---

## 11. Documentation for Future Developers

### How to Keep Navigation Static (Current Approach)
1. Edit `src/app/layout/layout.config.ts` to add/remove navigation links
2. Rebuild Angular application: `ng build --configuration production`
3. Deploy to Vercel
4. **No backend or database changes required**

**Pros:**
- Simple, fast, performant (no API call overhead)
- No admin UI needed
- No database maintenance required

**Cons:**
- Requires code changes and redeployment to update navigation
- Not suitable if non-technical users need to manage navigation

---

### When to Add a Navigation Database Table
Consider adding a `Navigation` table if:
1. Client wants an admin panel to manage navigation without developer involvement
2. Navigation structure changes frequently (e.g., seasonal promotions, temporary pages)
3. Multi-tenant application where each client has different navigation

**For a marketing website with stable structure (like VelocityAI), hardcoded navigation is the right choice.**

---

**Document Version:** 1.0
**Last Updated:** 2026-02-20
**Database Changes Required:** None
**Migrations Required:** None
