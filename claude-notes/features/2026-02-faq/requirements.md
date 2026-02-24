# Feature Requirements — FAQ Page

**Feature ID:** FEATURE-5
**Feature Name:** FAQ Page
**Status:** ✅ Ready for Implementation
**Priority:** Medium (Marketing content)
**Dependencies:** Feature 0 (Infrastructure)

---

## Executive Summary

The FAQ Page is a dedicated `/faq` route that displays VelocityAI's frequently asked questions in an accordion layout. The page dynamically fetches 6 FAQs from the MySQL database via a RESTful API (GET /api/faqs). Unlike the current frontend implementation which has 12 hardcoded FAQs with category filtering, the production version will be simpler: a single vertical list of 6 database-driven FAQs with expand/collapse functionality.

---

## Business Objectives

1. **Reduce support burden** by answering common questions proactively
2. **Improve conversion rates** by addressing concerns before contact form submission
3. **Enhance SEO** with FAQ-rich content and potential schema markup
4. **Enable content management** via database (future admin panel ready)
5. **Complement Services page** by answering "how" and "when" questions

---

## Target Users

### Primary Personas

**1. Prospective Customer (Pre-Sale)**
- **Goal:** Understand deployment timeline, pricing, and technical feasibility before committing
- **Pain Point:** Too many unknowns, hesitant to contact sales without basic info
- **Need:** Quick answers to common questions (deployment time, AI quality, escalation, security)

**2. Technical Evaluator (CTO/IT Director)**
- **Goal:** Assess technical integration requirements and data security
- **Pain Point:** Marketing sites often lack technical depth
- **Need:** Answers about CRM integrations, security compliance, data handling

**3. Existing Customer**
- **Goal:** Clarify features or policies after initial engagement
- **Pain Point:** Waiting for support response for simple questions
- **Need:** Self-service knowledge base for quick lookups

---

## User Stories

### Epic: View FAQ Content

**US-5.1:** As a **prospective customer**, I want to **see answers to common questions about AI agents**, so that I can **decide if VelocityAI is right for my business without contacting sales first**.

**Acceptance Criteria:**
- ✅ All 6 FAQs load from the backend API
- ✅ FAQs display in correct order (sorted by DisplayOrder field)
- ✅ Page loads in <2 seconds on 3G connection
- ✅ No console errors or warnings

**US-5.2:** As a **prospective customer**, I want to **expand/collapse individual FAQ items**, so that I can **focus on questions relevant to me without scrolling through all answers**.

**Acceptance Criteria:**
- ✅ Click a collapsed FAQ → it expands and reveals the answer
- ✅ Click an expanded FAQ → it collapses and hides the answer
- ✅ Multiple FAQs can be open simultaneously
- ✅ Transition is smooth (300ms ease-in-out)
- ✅ Icon rotates 180deg when expanded (chevron or +/- symbol)

**US-5.3:** As a **prospective customer**, I want the **FAQ page to handle errors gracefully**, so that I can **retry loading FAQs if the initial request fails**.

**Acceptance Criteria:**
- ✅ Loading spinner shown while API call is in progress
- ✅ Error message displayed if API returns 500 or network fails
- ✅ "Retry" button allows user to re-fetch without page reload
- ✅ Error message is user-friendly (no stack traces)

**US-5.4:** As a **mobile user**, I want the **FAQ accordion to be fully responsive**, so that I can **read questions and answers comfortably on any device**.

**Acceptance Criteria:**
- ✅ Mobile (<768px): Single column, full-width cards, touch-friendly tap targets (≥44x44px)
- ✅ Tablet (768-1023px): Single column, optimized padding
- ✅ Desktop (≥1024px): Single column (max-width: 900px, centered)
- ✅ All text is readable without horizontal scrolling
- ✅ Tap targets meet iOS accessibility guidelines

**US-5.5:** As a **keyboard user**, I want to **navigate and expand FAQs using only my keyboard**, so that I can **use the page without a mouse**.

**Acceptance Criteria:**
- ✅ Tab key moves focus between FAQ items
- ✅ Enter/Space key toggles expand/collapse
- ✅ Focus indicators are clearly visible
- ✅ Screen reader announces question, answer, and expanded state

---

## Functional Requirements

### FR-5.1: Backend API Endpoint

**Requirement:** Implement GET /api/faqs endpoint

**Details:**
- Endpoint: `GET /api/faqs`
- Controller: `FaqsController.cs` (already exists, currently returns 501)
- Service Layer: `IFaqService`, `FaqService` (already exist, throw NotImplementedException)
- Repository Layer: `IFaqRepository`, `FaqRepository` (already exist, throw NotImplementedException)
- Query: Fetch all FAQs where `IsActive = true`, ordered by `DisplayOrder`
- Response Format: `ApiResponse<IEnumerable<Faq>>`
- HTTP Status: 200 OK (success), 500 Internal Server Error (failure)

### FR-5.2: Database Seeding (Already Complete)

**Requirement:** 6 FAQs already seeded in MySQL via EF Core

**Details:**
- Seed data already exists in `ApplicationDbContext.OnModelCreating()`
- Static IDs: 1-6
- Fields: Id, Question, Answer, DisplayOrder, IsActive
- No new migration needed (data already in production database)

**Existing Seed Data:**
1. "How long does it take to deploy an AI agent?" (DisplayOrder: 1)
2. "Will the AI sound robotic to my customers?" (DisplayOrder: 2)
3. "What happens if the AI can't handle a question?" (DisplayOrder: 3)
4. "Is my data secure?" (DisplayOrder: 4)
5. "Can I start with one agent and add more later?" (DisplayOrder: 5)
6. "Do you integrate with my existing CRM and tools?" (DisplayOrder: 6)

### FR-5.3: Frontend Service Layer

**Requirement:** Angular service to fetch and cache FAQs

**Details:**
- Service: `FaqService` (frontend/src/app/core/services/faq.service.ts) — NEW FILE
- Method: `getFaqs(): Observable<Faq[]>`
- HTTP Client: Uses `HttpClient` directly (following ServicesService pattern)
- Caching: Store result in a signal, return cached data on subsequent calls
- Error Handling: Catch HTTP errors, return user-friendly error messages

### FR-5.4: FAQ Accordion Component

**Requirement:** Reusable accordion component for displaying FAQ list

**Details:**
- Component: `FaqAccordionComponent` (NEW FILE)
- Inputs: `@Input() faqs: Faq[]`
- State: Each FAQ item has an `expanded` signal
- Display:
  - Question (always visible, clickable)
  - Answer (revealed when expanded)
  - Icon (chevron or +/-)
- Animations:
  - Expand/collapse: max-height transition (300ms ease-in-out)
  - Icon rotation: 180deg when expanded
  - Content fade-in: opacity 0 → 1 over 200ms
- Behavior: Click question → toggle expanded state

### FR-5.5: FAQ Page Component

**Requirement:** Update existing FaqPageComponent to fetch from API

**Details:**
- Component: `FaqPageComponent` (ALREADY EXISTS — needs refactoring)
- Route: `/faq` (already configured)
- Changes:
  - Remove hardcoded FAQ_ITEMS array
  - Remove category filtering logic (general, technical, pricing, support)
  - Remove filteredFaqs getter
  - Add `faqs` signal (fetched from API)
  - Add `loading` signal
  - Add `error` signal
  - Add `ngOnInit()` to fetch FAQs on page load
  - Add retry() method for error recovery
- Layout:
  - Hero section (title + subtitle)
  - FAQ accordion (renders FaqAccordionComponent OR inline accordion)
  - CTA banner (link to /contact)
- Data Binding: Fetches FAQs via `FaqService.getFaqs()`
- SEO: Set page title and meta description

### FR-5.6: Loading and Error States

**Requirement:** Handle asynchronous data loading gracefully

**Details:**
- **Loading State:**
  - Show loading spinner (can reuse LoadingSpinnerComponent if available, or simple CSS spinner)
  - Accordion is hidden until data loads
  - No layout shift
- **Error State:**
  - Display error message: "Failed to load FAQs. Please try again."
  - Show "Retry" button (calls `FaqService.getFaqs()` again)
  - Log error to console for debugging
- **Success State:**
  - Hide spinner, show accordion
  - Apply scroll reveal animation (if ScrollRevealDirective is used)

### FR-5.7: Simplify Frontend (Remove Categories)

**Requirement:** Remove category-based filtering from frontend

**Details:**
- Current implementation has 4 category tabs: general, technical, pricing, support
- New implementation: Single vertical list, no categories
- Rationale: Database only has 6 FAQs (no category field), categories add unnecessary complexity
- If categories are needed in future, add `Category` field to Faq entity and update API

---

## Non-Functional Requirements

### NFR-5.1: Performance

- **Page Load Time:** <2 seconds on 3G (Lighthouse)
- **API Response Time:** <500ms for GET /api/faqs
- **Time to Interactive (TTI):** <3 seconds
- **First Contentful Paint (FCP):** <1.5 seconds
- **Cumulative Layout Shift (CLS):** 0 (no layout shifts)
- **Animation Frame Rate:** 60 FPS (no jank)
- **Lighthouse Performance Score:** ≥90

### NFR-5.2: Accessibility

- **WCAG Compliance:** 2.1 AA level
- **Lighthouse Accessibility Score:** ≥90
- **Keyboard Navigation:** All FAQ items reachable via Tab, Enter/Space toggles expand
- **Screen Reader Support:** 
  - ARIA roles: `button` for question, `region` for answer
  - `aria-expanded` attribute reflects state
  - `aria-controls` links button to answer panel
- **Focus Indicators:** Visible focus styles for keyboard users
- **Color Contrast:** Text meets WCAG AA contrast ratios (4.5:1 for body text)
- **Motion Preferences:** Respect `prefers-reduced-motion` media query

### NFR-5.3: SEO

- **Page Title:** "Frequently Asked Questions | VelocityAI"
- **Meta Description:** "Get answers to common questions about AI automation, deployment timelines, security, integrations, and more."
- **Open Graph Tags:** og:title, og:description, og:image, og:url
- **Structured Data:** JSON-LD schema for FAQPage (future enhancement)
- **Semantic HTML:** h1 for page title, h2 for FAQ questions, section/article tags

### NFR-5.4: Browser Support

- **Chrome:** Latest 2 versions
- **Firefox:** Latest 2 versions
- **Safari:** Latest 2 versions (iOS + macOS)
- **Edge:** Latest 2 versions
- **ES Version:** ES2020+ (Angular 19 baseline)

### NFR-5.5: Scalability

- **Concurrent Requests:** API handles 100+ simultaneous requests without degradation
- **Database Query Performance:** FAQ query executes in <50ms with 6 rows
- **Frontend Caching:** FAQs cached in memory, API called only once per session
- **Future-Proof:** Architecture supports adding more FAQs (7, 8, 9...) without code changes

### NFR-5.6: Security

- **Authentication:** None required (public endpoint)
- **CORS Policy:** Backend restricts API access to Vercel frontend domain in production
- **Input Validation:** No user input on this page (read-only)
- **SQL Injection:** Protected by EF Core parameterized queries
- **XSS Protection:** Angular sanitizes all HTML by default

---

## Out of Scope

The following items are **NOT** included in this feature:

❌ **Category filtering** (general, technical, pricing, support) — database FAQs have no Category field
❌ **Search functionality** (not needed for 6 FAQs)
❌ **FAQ voting** (thumbs up/down for helpful/unhelpful)
❌ **Admin panel** for creating/editing/deleting FAQs (future feature)
❌ **FAQ detail pages** (e.g., /faq/how-long-deployment) with dedicated URLs
❌ **Related questions** sidebar
❌ **"Was this helpful?" feedback form** on each FAQ
❌ **Contact form integration** on this page (users navigate to /contact via CTA banner)

---

## Success Metrics

### Technical Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| API Response Time | <500ms | Backend logs, Lighthouse |
| Page Load Time | <2s on 3G | Lighthouse throttled test |
| Lighthouse Performance | ≥90 | Chrome DevTools Lighthouse |
| Lighthouse Accessibility | ≥90 | Chrome DevTools Lighthouse |
| Animation FPS | 60 FPS | Chrome DevTools Performance tab |
| HTTP Errors | 0% | Production monitoring (future) |

### User Engagement (Future Analytics)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Avg. Time on Page | >30 seconds | Google Analytics |
| Scroll Depth | >50% reach CTA banner | Google Analytics events |
| FAQ Expand Rate | >60% of users expand ≥1 FAQ | Custom event tracking |
| Contact Form Conversions | >3% click CTA banner → /contact | Funnel analysis |

---

## Assumptions

1. **Feature 0 is complete:** Faq entity, ApplicationDbContext, and HttpClient setup are functional
2. **Backend is running locally:** .NET API runs on https://localhost:5001 during development
3. **Database is accessible:** MySQL 8 instance on Railway is provisioned and FAQs are seeded
4. **Seed data is accurate:** The 6 FAQs defined in ApplicationDbContext are the final content
5. **No category field:** FAQs do not have categories; all 6 are shown in a single list

---

## Dependencies

### Must Be Complete Before This Feature

- ✅ **Feature 0:** Infrastructure (Faq entity, EF Core, HttpClient)

### Unblocks These Features

- ⏭️ **Feature 6:** Contact Page (FAQ page CTA links to /contact)
- ⏭️ **Feature 8:** Admin Panel (future: CRUD operations on FAQs)

---

## Risks and Mitigations

### Risk 1: API Timeout or Failure

**Impact:** Users see error state, cannot view FAQs
**Probability:** Low (simple query, <50ms execution)
**Mitigation:**
- Implement retry mechanism (user-triggered and automatic)
- Cache FAQs in frontend to reduce API dependency
- Add backend health check endpoint for monitoring

### Risk 2: Content Staleness

**Impact:** FAQ answers become outdated, require code changes to update
**Probability:** Medium (business policies and features evolve)
**Mitigation:**
- Document how to update seed data via EF Core migration
- Future feature: Admin panel to update FAQs without code changes
- Version control seed data in ApplicationDbContext

### Risk 3: Mobile Performance

**Impact:** Slow page load on 3G, poor user experience
**Probability:** Low (text-only content, no images)
**Mitigation:**
- Test on real mobile devices with network throttling
- Optimize Angular bundle size (lazy-load route if not already done)
- Minimize animation overhead (CSS transitions, not JS-based)

### Risk 4: Accessibility Violations

**Impact:** WCAG compliance failure, potential legal risk
**Probability:** Low (using semantic HTML, ARIA attributes)
**Mitigation:**
- Run Lighthouse accessibility audit before deployment
- Test with screen reader (NVDA or VoiceOver)
- Ensure keyboard navigation works for all interactions

---

## Acceptance Checklist

Before marking this feature as complete, verify:

- ✅ Backend: FaqRepository.GetAllActiveAsync() implemented and queries database
- ✅ Backend: FaqService.GetAllActiveFaqsAsync() delegates to repository
- ✅ Backend: FaqsController.GetAll() returns 200 OK with 6 FAQs
- ✅ Frontend: FaqService.getFaqs() fetches from API and caches result
- ✅ Frontend: FaqPageComponent removed hardcoded FAQ_ITEMS array
- ✅ Frontend: FaqPageComponent removed category filtering logic
- ✅ Frontend: Loading spinner shown during API call
- ✅ Frontend: Error state with retry button works
- ✅ Frontend: Accordion expand/collapse animations work smoothly
- ✅ Frontend: All 6 FAQs display in correct order (DisplayOrder 1-6)
- ✅ Page is fully responsive (320px to 1440px)
- ✅ Keyboard navigation works (Tab, Enter/Space)
- ✅ Screen reader announces FAQ state correctly
- ✅ Lighthouse performance score ≥90
- ✅ Lighthouse accessibility score ≥90
- ✅ No console errors or warnings
- ✅ Angular Meta service sets page title and description
- ✅ Code passes linting (ng lint)
- ✅ Backend passes dotnet build
- ✅ All manual tests pass (see test-plan.md)

---

## Appendix: FAQ Content (Seed Data)

The 6 FAQs already seeded in database (source: ApplicationDbContext.cs):

1. **How long does it take to deploy an AI agent?**
   - Answer: Most single-agent deployments take 2–4 weeks from kickoff to go-live. More complex multi-agent systems typically take 6–8 weeks. We always start with a human-in-the-loop phase before granting full autonomy.

2. **Will the AI sound robotic to my customers?**
   - Answer: No. We use the latest NLP and voice synthesis to create conversational, brand-aligned agents. We customise the tone, vocabulary, and personality to match your brand.

3. **What happens if the AI can't handle a question?**
   - Answer: Every agent has intelligent escalation built in. If the AI detects confusion, repeated questions, or negative sentiment, it seamlessly transfers to a human agent with full context so the customer never has to repeat themselves.

4. **Is my data secure?**
   - Answer: Yes. We follow industry-standard practices including encryption at rest and in transit, SOC 2 compliance readiness, and strict access controls. Enterprise clients can opt for on-premises deployment.

5. **Can I start with one agent and add more later?**
   - Answer: Absolutely — that's what we recommend. Start with the highest-impact use case, prove the ROI, then expand. Every agent plugs into the same shared CRM, analytics, and compliance infrastructure.

6. **Do you integrate with my existing CRM and tools?**
   - Answer: Yes — Salesforce, HubSpot, Zoho, Twilio, SendGrid, Slack, Google Workspace, Microsoft 365, and more. For custom systems, we build tailored API integrations.
```

---