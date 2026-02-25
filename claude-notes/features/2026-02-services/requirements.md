# Feature Requirements — Services Page

**Feature ID:** FEATURE-3
**Feature Name:** Services Page
**Status:** ✅ Approved
**Priority:** High (Core marketing content)
**Dependencies:** Feature 0 (Infrastructure), Feature 1 (Layout)

---

## Executive Summary

The Services Page is a dedicated `/services` route that displays Velobiz's 8 AI automation service offerings in a responsive grid layout. Unlike the home page which shows industry applications, this page details the actual services (Voice AI Agents, Email Management, Marketing Automation, etc.) with both short and long descriptions. Data is dynamically fetched from the MySQL database via a RESTful API, ensuring content can be managed through database updates rather than code changes.

---

## Business Objectives

1. **Educate prospects** on the full range of AI automation services offered
2. **Improve SEO** with dedicated service content pages
3. **Enable content management** via database-driven approach (future admin panel ready)
4. **Drive conversions** by providing detailed service information before contact form submission
5. **Support sales conversations** with shareable URLs for specific services

---

## Target Users

### Primary Personas

**1. Business Owner / CEO**
- **Goal:** Understand ROI and applicability of AI automation to their business
- **Pain Point:** Too much jargon, not enough outcome-focused messaging
- **Need:** Clear descriptions of what each service does and the business problems it solves

**2. Operations Manager**
- **Goal:** Evaluate which service to pilot first
- **Pain Point:** Overwhelmed by too many options, unclear where to start
- **Need:** Comparison of services with practical use cases

**3. Technical Decision Maker (CTO/IT Director)**
- **Goal:** Understand technical feasibility and integration requirements
- **Pain Point:** Vague marketing speak without technical details
- **Need:** Long descriptions with implementation details

---

## User Stories

### Epic: View Services Catalog

**US-3.1:** As a **prospective client**, I want to **see all available AI automation services in one place**, so that I can **compare options and choose the best fit for my business**.

**Acceptance Criteria:**
- ✅ All 8 services load from the backend API
- ✅ Services display in a responsive grid (1/2/3 columns based on viewport)
- ✅ Each card shows icon, title, and short description by default
- ✅ Page loads in <3 seconds on 3G connection
- ✅ No console errors or warnings

**US-3.2:** As a **prospective client**, I want to **see detailed information about each service on hover/tap**, so that I can **understand the full capabilities without leaving the page**.

**Acceptance Criteria:**
- ✅ Hovering a card (desktop) reveals the long description
- ✅ Tapping a card (mobile) toggles the long description
- ✅ Transition is smooth (300ms ease-out)
- ✅ Card lifts and glows on hover
- ✅ Icon animates (subtle pulse/scale)

**US-3.3:** As a **prospective client**, I want the page to **handle errors gracefully**, so that I can **retry loading services if the initial request fails**.

**Acceptance Criteria:**
- ✅ Loading spinner shown while API call is in progress
- ✅ Error message displayed if API returns 500 or network fails
- ✅ "Retry" button allows user to re-fetch without page reload
- ✅ Error message is user-friendly (no stack traces or technical jargon)

**US-3.4:** As a **mobile user**, I want the **services grid to be fully responsive**, so that I can **read service details comfortably on any device**.

**Acceptance Criteria:**
- ✅ Mobile (<768px): 1 column, full-width cards, 16px gap
- ✅ Tablet (768-1023px): 2 columns, 24px gap
- ✅ Desktop (≥1024px): 3 columns, 32px gap
- ✅ All text is readable without horizontal scrolling
- ✅ Touch targets are ≥44x44px (iOS accessibility guideline)

---

## Functional Requirements

### FR-3.1: Backend API Endpoint

**Requirement:** Implement GET /api/services endpoint

**Details:**
- Endpoint: `GET /api/services`
- Controller: `ServicesController.cs`
- Service Layer: `IServicesService`, `ServicesService`
- Repository Layer: `IServicesRepository`, `ServicesRepository`
- Query: Fetch all services where `IsActive = true`, ordered by `DisplayOrder`
- Response Format: `ApiResponse<IEnumerable<Service>>`
- HTTP Status: 200 OK (success), 500 Internal Server Error (failure)

### FR-3.2: Database Seeding

**Requirement:** Seed all 8 services into MySQL via EF Core migration

**Details:**
- Migration Name: `SeedServicesData`
- Method: `ApplicationDbContext.OnModelCreating()` using `HasData()`
- Static IDs: 1-8 (for idempotent migrations)
- Data Source: agent-plan-prompt.md lines 126-164
- Fields: Id, Title, Icon, ShortDescription, LongDescription, DisplayOrder, IsActive
- Apply Migration: `dotnet ef database update`

### FR-3.3: Frontend Service Layer

**Requirement:** Angular service to fetch and cache services

**Details:**
- Service: `ServicesService` (frontend/src/app/features/services/)
- Method: `getServices(): Observable<Service[]>`
- HTTP Client: Uses `ApiService` (HttpClient wrapper from Feature 0)
- Caching: Store result in a signal, return cached data on subsequent calls
- Error Handling: Catch HTTP errors, return user-friendly error messages

### FR-3.4: Service Card Component

**Requirement:** Reusable component for displaying individual services

**Details:**
- Component: `ServiceCardComponent`
- Inputs: `@Input() service: Service`
- Display:
  - Icon (Lucide Angular library)
  - Title (h3)
  - Short description (always visible)
  - Long description (revealed on hover/tap)
- Animations:
  - Hover: translateY(-8px), box-shadow glow
  - Icon pulse: scale(1.05) on hover
- Responsive: Tap to toggle on mobile, hover on desktop

### FR-3.5: Services Page Component

**Requirement:** Container component that renders the services grid

**Details:**
- Component: `ServicesPageComponent`
- Route: `/services` (lazy-loaded)
- Layout:
  - Page header (title + subtitle)
  - Services grid (CSS Grid layout)
  - Loading state (spinner)
  - Error state (message + retry button)
  - CTA banner (link to /contact)
- Data Binding: Fetches services via `ServicesService.getServices()`
- Scroll Reveal: Apply `ScrollRevealDirective` to each card

### FR-3.6: Loading and Error States

**Requirement:** Handle asynchronous data loading gracefully

**Details:**
- **Loading State:**
  - Show `LoadingSpinnerComponent` (from Feature 0)
  - Grid is hidden until data loads
  - No layout shift (reserve vertical space)
- **Error State:**
  - Display error message: "Failed to load services. Please try again."
  - Show "Retry" button (calls `ServicesService.getServices()` again)
  - Log error to console for debugging
- **Success State:**
  - Hide spinner, show grid
  - Apply staggered fade-up animation

### FR-3.7: Responsive Grid Layout

**Requirement:** Adaptive grid based on viewport width

**Details:**
- Implementation: CSS Grid with `grid-template-columns`
- Breakpoints:
  - Mobile (<768px): `grid-template-columns: 1fr`
  - Tablet (768-1023px): `grid-template-columns: repeat(2, 1fr)`
  - Desktop (≥1024px): `grid-template-columns: repeat(3, 1fr)`
- Gap:
  - Mobile: 16px
  - Tablet: 24px
  - Desktop: 32px

---

## Non-Functional Requirements

### NFR-3.1: Performance

- **Page Load Time:** <3 seconds on 3G (Lighthouse)
- **API Response Time:** <200ms for GET /api/services
- **Time to Interactive (TTI):** <3 seconds
- **First Contentful Paint (FCP):** <1.5 seconds
- **Cumulative Layout Shift (CLS):** 0 (no layout shifts)
- **Animation Frame Rate:** 60 FPS (no jank)
- **Lighthouse Performance Score:** ≥90

### NFR-3.2: Accessibility

- **WCAG Compliance:** 2.1 AA level
- **Lighthouse Accessibility Score:** ≥90
- **Keyboard Navigation:** All interactive elements reachable via Tab
- **Screen Reader Support:** Semantic HTML, ARIA labels where needed
- **Focus Indicators:** Visible focus styles for keyboard users
- **Color Contrast:** Text meets WCAG AA contrast ratios (4.5:1 for body text)
- **Motion Preferences:** Respect `prefers-reduced-motion` media query

### NFR-3.3: SEO

- **Page Title:** "AI Automation Services | Velobiz"
- **Meta Description:** "Discover our 8 AI automation services: Voice AI Agents, Email Management, Marketing Automation, and more. Transform your business with intelligent automation."
- **Open Graph Tags:** og:title, og:description, og:image, og:url
- **Structured Data:** JSON-LD schema for Service items (future enhancement)
- **Semantic HTML:** h1 for page title, h2 for service titles, section/article tags

### NFR-3.4: Browser Support

- **Chrome:** Latest 2 versions
- **Firefox:** Latest 2 versions
- **Safari:** Latest 2 versions (iOS + macOS)
- **Edge:** Latest 2 versions
- **ES Version:** ES2020+ (Angular 19 baseline)

### NFR-3.5: Scalability

- **Concurrent Requests:** API handles 100+ simultaneous requests without degradation
- **Database Query Performance:** Service query executes in <50ms with 8 rows
- **Frontend Caching:** Services cached in memory, API called only once per session
- **Future-Proof:** Architecture supports adding more services (9, 10, etc.) without code changes

### NFR-3.6: Security

- **Authentication:** None required (public endpoint)
- **CORS Policy:** Backend restricts API access to Vercel frontend domain in production
- **Input Validation:** No user input on this page (read-only)
- **SQL Injection:** Protected by EF Core parameterized queries
- **XSS Protection:** Angular sanitizes all HTML by default

---

## Out of Scope

The following items are **NOT** included in this feature:

❌ **Admin panel** for creating/editing/deleting services (future feature)
❌ **Service detail pages** (e.g., /services/voice-agent-inbound) with dedicated URLs
❌ **Search/filter functionality** (not needed for 8 services)
❌ **Service comparison tool** (side-by-side feature comparison)
❌ **Customer testimonials** per service (will be part of separate testimonials feature)
❌ **Pricing information** on service cards (that's the Pricing Page feature)
❌ **Contact form integration** on this page (users navigate to /contact)
❌ **Service request tracking** (e.g., "I'm interested in this service" button)

---

## Success Metrics

### Technical Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| API Response Time | <200ms | Backend logs, Lighthouse |
| Page Load Time | <3s on 3G | Lighthouse throttled test |
| Lighthouse Performance | ≥90 | Chrome DevTools Lighthouse |
| Lighthouse Accessibility | ≥90 | Chrome DevTools Lighthouse |
| Animation FPS | 60 FPS | Chrome DevTools Performance tab |
| HTTP Errors | 0% | Production monitoring (future) |

### User Engagement (Future Analytics)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Avg. Time on Page | >45 seconds | Google Analytics |
| Scroll Depth | >75% reach CTA banner | Google Analytics events |
| Card Hover Rate | >50% of users hover ≥1 card | Custom event tracking |
| Contact Form Conversions | >5% click CTA banner → /contact | Funnel analysis |

---

## Assumptions

1. **Feature 0 is complete:** Service entity, ApplicationDbContext, ApiService, and ScrollRevealDirective are all functional
2. **Backend is running locally:** .NET API runs on https://localhost:5001 during development
3. **Database is accessible:** MySQL 8 instance on Railway is provisioned and connection string is configured
4. **Lucide icons are available:** Angular Lucide library is installed (part of Feature 0)
5. **Seed data is accurate:** The 8 services defined in agent-plan-prompt.md are the final content (no pending copywriting changes)

---

## Dependencies

### Must Be Complete Before This Feature

- ✅ **Feature 0:** Infrastructure (Service entity, EF Core, ApiService, ScrollRevealDirective)
- ✅ **Feature 1:** Layout (Navbar, Footer)

### Unblocks These Features

- ⏭️ **Feature 5:** FAQ Page (uses similar data-driven architecture)
- ⏭️ **Feature 6:** Contact Page (service interest dropdown will reference these 8 services)

---

## Risks and Mitigations

### Risk 1: API Timeout or Failure

**Impact:** Users see error state, cannot view services
**Probability:** Low (simple query, <50ms execution)
**Mitigation:**
- Implement retry mechanism (user-triggered and automatic)
- Cache services in frontend to reduce API dependency
- Add backend health check endpoint for monitoring

### Risk 2: Mobile Performance

**Impact:** Slow page load on 3G, poor user experience
**Probability:** Medium (images, animations could impact performance)
**Mitigation:**
- Use SVG icons (scalable, small file size)
- Lazy-load images (if added in future)
- Test on real mobile devices with network throttling
- Optimize Angular bundle size (lazy-load route)

### Risk 3: Content Changes

**Impact:** Seed data becomes outdated, requires migration
**Probability:** Medium (marketing may revise service descriptions)
**Mitigation:**
- Document migration process in README
- Future feature: Admin panel to update services without migrations
- Version control seed data in ApplicationDbContext

### Risk 4: Accessibility Violations

**Impact:** WCAG compliance failure, potential legal risk
**Probability:** Low (using semantic HTML, Angular Material)
**Mitigation:**
- Run Lighthouse accessibility audit before deployment
- Test with screen reader (NVDA or VoiceOver)
- Ensure keyboard navigation works for all interactions

---

## Acceptance Checklist

Before marking this feature as complete, verify:

- ✅ All 8 services load from GET /api/services
- ✅ Services are seeded in MySQL via EF Core migration
- ✅ ServicesPageComponent renders cards in responsive grid
- ✅ Hover animations work on desktop (lift + glow)
- ✅ Tap to expand works on mobile
- ✅ Loading spinner shown during API call
- ✅ Error state with retry button works
- ✅ ScrollRevealDirective applies staggered fade-up
- ✅ Page is fully responsive (320px to 1440px)
- ✅ Lighthouse performance score ≥90
- ✅ Lighthouse accessibility score ≥90
- ✅ No console errors or warnings
- ✅ Route is lazy-loaded
- ✅ Angular Meta service sets page title and description
- ✅ Code passes linting (ng lint)
- ✅ Backend passes dotnet build
- ✅ All manual tests pass (see test-plan.md)

---

## Appendix: Service Content (Seed Data)

The 8 services to be seeded (source: agent-plan-prompt.md):

1. **AI Voice Agent — Inbound Support** (icon: phone)
2. **AI Voice Agent — Outbound Collection** (icon: signal)
3. **Email Management AI Agent** (icon: mail)
4. **Marketing Campaign AI Agent** (icon: megaphone)
5. **Social Media Scheduling & Management** (icon: share)
6. **Paid Ads AI Agent** (icon: target)
7. **GEO — Generative Engine Optimisation** (icon: brain)
8. **SDLC AI Agent Suite** (icon: code)

See db-schema.md for full seed data with short and long descriptions.
