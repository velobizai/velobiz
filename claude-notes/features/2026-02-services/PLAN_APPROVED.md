# Plan Approval Record

**Feature:** FEATURE 3: Services Page
**Plan Version:** 1.0
**Approved By:** User (AUTO APPROVE mode)
**Approved Date:** 2026-02-20
**Status:** ✅ LOCKED

---

## Approval Summary

The complete Services Page specification includes:
- ✅ interview-context.md (13 questions answered via agent-plan-prompt.md)
- ✅ requirements.md (user stories, functional/non-functional requirements, acceptance criteria)
- ✅ design.md (component breakdown, visual design, responsive behavior, animations)
- ✅ api-contract.md (GET /api/services endpoint specification, request/response schemas)
- ✅ db-schema.md (seed data migration, EF Core configuration)
- ✅ tasks.md (12 tasks with estimates and dependencies)
- ✅ test-plan.md (comprehensive test strategy - deferred per user instruction)

**Total Estimated Implementation Time:** 8-10 hours (~1 working day)

---

## Implementation Scope

This feature creates the Services Page at route `/services` with:

### What's Included ✅

**Backend:**
- GET /api/services endpoint (repository → service → controller pattern)
- EF Core migration to seed 8 services via HasData()
- ServicesRepository with query optimization (AsNoTracking, composite index)
- Global exception handling and logging

**Frontend:**
- ServicesPageComponent (container with loading/error/success states)
- ServiceCardComponent (reusable card with hover reveal of long description)
- ServicesService (HTTP client with signal-based caching)
- Responsive CSS Grid layout (1/2/3 columns based on viewport)
- Scroll reveal animations via ScrollRevealDirective
- CTA banner linking to /contact page
- Lazy-loaded route configuration
- SEO meta tags (title, description, Open Graph)

**Design:**
- Dark luxury theme (teal accents, card glow on hover)
- Mobile: Tap to expand cards, 1 column layout
- Tablet: 2 column grid, 24px gap
- Desktop: 3 column grid, 32px gap, hover animations
- Accessibility: WCAG 2.1 AA compliance, keyboard navigation, screen reader support

### What's NOT Included ❌

- ❌ Admin panel for managing services (future feature)
- ❌ Service detail pages (e.g., /services/voice-agent-inbound)
- ❌ Search/filter functionality
- ❌ Customer testimonials per service
- ❌ Pricing information on cards
- ❌ "Request this service" buttons
- ❌ Unit/integration tests (deferred per user instruction in CLAUDE.md)
- ❌ E2E tests (deferred)
- ❌ Design documentation HTML (deferred)

---

## Technical Approach

### No Schema Changes
- Service entity already exists from Feature 0
- This feature ONLY adds seed data (8 services) via migration
- No new tables, columns, or indexes

### Single Chunk Implementation
All 12 tasks completed as one cohesive chunk:
1. **Database Engineer** (Tasks 3.1-3.2): Add seed data, generate migration
2. **DotNet Architect** (Tasks 3.3-3.5): Implement repository → service → controller
3. **Angular Expert** (Tasks 3.6-3.10): Frontend service, components, routing
4. **Lead Agent** (Tasks 3.11-3.12): QA and build verification

**Why single chunk?**
- Small scope (8-10 hours)
- No complex integrations
- All tasks are sequential (DB → API → Frontend)
- Can be completed in 1 working day

---

## Task Breakdown

| Task | Title | Layer | Agent | Estimate | Status |
|------|-------|-------|-------|----------|--------|
| 3.1 | Add seed data to ApplicationDbContext | DB | Database Engineer | 45 min | ⏸️ Pending |
| 3.2 | Generate and apply EF Core migration | DB | Database Engineer | 15 min | ⏸️ Pending |
| 3.3 | Implement ServicesRepository | API | DotNet Architect | 30 min | ⏸️ Pending |
| 3.4 | Implement ServicesService | API | DotNet Architect | 20 min | ⏸️ Pending |
| 3.5 | Update ServicesController and register DI | API | DotNet Architect | 30 min | ⏸️ Pending |
| 3.6 | Create Angular ServicesService | Frontend | Angular Expert | 45 min | ⏸️ Pending |
| 3.7 | Create ServiceCardComponent | Frontend | Angular Expert | 1h 30min | ⏸️ Pending |
| 3.8 | Create ServicesPageComponent | Frontend | Angular Expert | 1h 30min | ⏸️ Pending |
| 3.9 | Add responsive CSS Grid styling | Frontend | Angular Expert | 45 min | ⏸️ Pending |
| 3.10 | Configure lazy-loaded route | Frontend | Angular Expert | 15 min | ⏸️ Pending |
| 3.11 | Manual QA and accessibility audit | QA | Lead Agent | 1h | ⏸️ Pending |
| 3.12 | Build verification and linting | CI | Lead Agent | 15 min | ⏸️ Pending |

**Total:** 12 tasks, 8-10 hours estimated

---

## Success Criteria

### Functional
- ✅ All 8 services load from GET /api/services
- ✅ Services display in responsive grid (1/2/3 columns)
- ✅ Card hover reveals long description (desktop)
- ✅ Card tap toggles long description (mobile)
- ✅ Loading spinner shown during API call
- ✅ Error state with retry button works
- ✅ CTA banner links to /contact page
- ✅ ScrollRevealDirective applies staggered fade-up animation

### Non-Functional
- ✅ Page load <3 seconds on 3G
- ✅ Lighthouse performance score ≥90
- ✅ Lighthouse accessibility score ≥90 (WCAG 2.1 AA)
- ✅ API response time <200ms
- ✅ Animations run at 60 FPS (no jank)
- ✅ No console errors or warnings
- ✅ Fully responsive (320px to 1440px)

### Technical
- ✅ dotnet build succeeds with 0 errors
- ✅ ng lint passes with 0 errors
- ✅ ng build --configuration production succeeds
- ✅ Route is lazy-loaded
- ✅ Meta tags set for SEO

---

## Data Source

The 8 services are defined in agent-plan-prompt.md (lines 126-164):

1. **AI Voice Agent — Inbound Support** (icon: phone)
2. **AI Voice Agent — Outbound Collection** (icon: signal)
3. **Email Management AI Agent** (icon: mail)
4. **Marketing Campaign AI Agent** (icon: megaphone)
5. **Social Media Scheduling & Management** (icon: share)
6. **Paid Ads AI Agent** (icon: target)
7. **GEO — Generative Engine Optimisation** (icon: brain)
8. **SDLC AI Agent Suite** (icon: code)

All content (title, short description, long description) is finalized and ready for seed data.

---

## Implementation Clearance

This feature is now ready for implementation. The following agents are cleared to proceed:

- **Database Engineer** (Tasks 3.1-3.2): Seed data + migration
- **DotNet Architect** (Tasks 3.3-3.5): Backend API stack
- **Angular Expert** (Tasks 3.6-3.10): Frontend components + routing
- **Lead Agent** (Tasks 3.11-3.12): QA + build verification

**Next Command:** `/agent-build services` to begin implementation

---

## Change Control

⚠️ **This plan is now locked.** Any changes to requirements, design, or tasks must:
1. Be documented in a revision request
2. Get user approval
3. Update the plan version number
4. Record the change in this file

---

## Dependencies

### Must Be Complete
- ✅ **Feature 0:** Infrastructure (Service entity, EF Core, ApiService, ScrollRevealDirective)
- ✅ **Feature 1:** Layout (Navbar + Footer)

### Unblocks
- ⏭️ **Feature 5:** FAQ Page (uses similar architecture)
- ⏭️ **Feature 6:** Contact Page (service interest dropdown references these 8 services)

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| API timeout | Users see error state | Retry button, frontend caching, backend query optimization |
| Mobile performance | Slow page load | Lazy-loaded route, SVG icons, CSS-only animations |
| Content changes | Seed data becomes outdated | Document migration process, future admin panel |
| Accessibility violations | WCAG compliance failure | Lighthouse audit, screen reader testing, semantic HTML |

---

## Files Created/Modified

### New Files (Expected)

**Backend:**
- `backend/VelocityAI.Api/Repositories/IServicesRepository.cs`
- `backend/VelocityAI.Api/Repositories/ServicesRepository.cs`
- `backend/VelocityAI.Api/Services/IServicesService.cs`
- `backend/VelocityAI.Api/Services/ServicesService.cs`
- `backend/VelocityAI.Api/Migrations/YYYYMMDDHHMMSS_SeedServicesData.cs`

**Frontend:**
- `frontend/src/app/core/services/services.service.ts`
- `frontend/src/app/core/models/service.model.ts`
- `frontend/src/app/features/services/service-card/service-card.component.ts`
- `frontend/src/app/features/services/service-card/service-card.component.html`
- `frontend/src/app/features/services/service-card/service-card.component.scss`
- `frontend/src/app/features/services/services-page.component.ts`
- `frontend/src/app/features/services/services-page.component.html`
- `frontend/src/app/features/services/services-page.component.scss`

### Modified Files (Expected)

**Backend:**
- `backend/VelocityAI.Api/Data/ApplicationDbContext.cs` (add seed data method)
- `backend/VelocityAI.Api/Controllers/ServicesController.cs` (replace 501 stub)
- `backend/VelocityAI.Api/Program.cs` (register DI services)

**Frontend:**
- `frontend/src/app/app.routes.ts` (add /services route)

---

## Acceptance Checklist

Before marking this feature as complete, verify:

- ✅ All 12 tasks completed
- ✅ All files created/modified as expected
- ✅ Database has 8 services seeded
- ✅ API endpoint returns 200 OK with 8 services
- ✅ Frontend loads services dynamically
- ✅ Responsive layout works at all breakpoints
- ✅ Hover/tap animations work smoothly
- ✅ Loading and error states display correctly
- ✅ Lighthouse performance ≥90
- ✅ Lighthouse accessibility ≥90
- ✅ No console errors or warnings
- ✅ dotnet build succeeds
- ✅ ng lint passes
- ✅ ng build --configuration production succeeds
- ✅ All code committed to feature branch
- ✅ Ready for `/agent-commit` (when user requests)

---

## Revision History

| Version | Date | Approved By | Changes |
|---------|------|-------------|---------|
| 1.0 | 2026-02-20 | User (AUTO APPROVE) | Initial approval |

---

## Notes

- **Testing deferred:** Per CLAUDE.md user instruction, no tests or documentation will be written during implementation. Tests can be added later when user requests.
- **Single chunk:** All 12 tasks will be completed in one cohesive chunk since they're sequential and interdependent.
- **Content finalized:** All 8 service descriptions are final and ready for seed data (no pending copywriting).
- **Design system:** Follows VelocityAI dark luxury theme from Features 0, 1, 2.

---

**Status:** ✅ **APPROVED AND LOCKED**

**Ready to proceed with:** `/agent-build services`
