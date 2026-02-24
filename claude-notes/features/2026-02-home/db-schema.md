# Database Schema — FEATURE 2: Home / Landing Page

**Feature ID:** 2026-02-home
**Feature Name:** Home / Landing Page
**Date:** 2026-02-20
**Status:** Specification Complete

---

## Overview

**FEATURE 2: Home / Landing Page has NO database dependencies.**

This feature does not create, read, update, or delete any data from the database. All content is static and hardcoded in component files.

---

## Entity Classes

**None.**

No new Entity Framework Core entity classes are required for this feature.

---

## DbContext Changes

**None.**

No changes to `ApplicationDbContext` are required.

---

## Migrations

**None.**

No Entity Framework Core migrations are required for this feature.

---

## Seed Data

**None.**

No seed data is required. All content (hero text, stats numbers, process steps, industry names) is hardcoded in component TypeScript files.

---

## Database Queries

**None.**

No database queries are executed by this feature.

---

## Future Database Integration (Out of Scope)

The following are **NOT** included in this feature but may be added in future:

### Option 1: Dynamic Stats Table

Future consideration: Store homepage stats in database for easier updates without code changes.

**Proposed Entity (not implemented):**
```csharp
public class HomepageStat
{
    public int Id { get; set; }
    public string Key { get; set; } = string.Empty; // "clients_served", "hours_saved", etc.
    public int Value { get; set; }
    public string Suffix { get; set; } = string.Empty; // "+", "%", "/7"
    public string Label { get; set; } = string.Empty;
    public string? Format { get; set; } // "K", "M", null
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
}
```

**Proposed API Endpoint (not implemented):**
```csharp
// GET /api/homepage/stats
[HttpGet("homepage/stats")]
public async Task<ActionResult<ApiResponse<IEnumerable<HomepageStat>>>> GetHomepageStats()
{
    var stats = await _context.HomepageStats
        .Where(s => s.IsActive)
        .OrderBy(s => s.DisplayOrder)
        .ToListAsync();

    return Ok(new ApiResponse<IEnumerable<HomepageStat>>(stats));
}
```

### Option 2: CMS-Managed Content Table

Future consideration: Store all homepage content in a CMS table for non-technical content updates.

**Proposed Entity (not implemented):**
```csharp
public class PageContent
{
    public int Id { get; set; }
    public string PageKey { get; set; } = string.Empty; // "home"
    public string SectionKey { get; set; } = string.Empty; // "hero", "stats", "process"
    public string ContentKey { get; set; } = string.Empty; // "headline", "subheading"
    public string ContentValue { get; set; } = string.Empty;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
```

### Option 3: Analytics Event Logging

Future consideration: Log CTA clicks and scroll depth for analytics.

**Proposed Entity (not implemented):**
```csharp
public class AnalyticsEvent
{
    public int Id { get; set; }
    public string EventType { get; set; } = string.Empty; // "cta_click", "scroll_depth"
    public string PageUrl { get; set; } = string.Empty;
    public string? UserId { get; set; }
    public string? SessionId { get; set; }
    public string EventData { get; set; } = "{}"; // JSON
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
```

---

## Testing

### Database Testing

**Not applicable.** No database queries to test.

---

## Approval

**Reviewed By:** Lead Agent
**Approved By:** User
**Date:** 2026-02-20
**Status:** APPROVED ✅

**Summary:**
- ✅ No database entities required
- ✅ No DbContext changes required
- ✅ No migrations required
- ✅ No seed data required
- ✅ All content hardcoded in component files

**Next Steps:**
1. Generate tasks.md
2. Generate test-plan.md
