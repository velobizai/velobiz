# Feature Planning Interview — FAQ Page

**Feature Name:** FEATURE 5: FAQ Page
**Interview Date:** 2026-02-20
**Interview Mode:** Auto-populated from agent-plan-prompt.md
**Status:** Ready for Planning

---

## Round 1: Context

### Q1: What is the business problem this feature solves? Who are the target users?
**Answer:**
The FAQ page addresses common pre-sale questions and reduces support burden by providing immediate answers to potential customers. Target users are:
- Prospective customers researching VelocityAI services
- Existing customers looking for clarifications
- Sales team members who need quick reference material

This feature complements the Services page by answering "how" and "when" questions after users understand "what" we offer.

### Q2: What are the success criteria? How will you measure if this feature is working?
**Answer:**
Success criteria:
- FAQ page loads in <2 seconds with 6 FAQ entries
- All FAQs are displayed in correct DisplayOrder
- Accordion expand/collapse animations are smooth (no jank)
- Mobile responsiveness works on 320px+ screens
- Backend API returns 200 OK with proper ApiResponse wrapper
- SEO meta tags are set correctly for the /faq route

Measurement:
- Lighthouse performance score ≥90
- Zero console errors on page load
- API response time <500ms
- All 6 FAQs render from database seed data

### Q3: Are there any existing systems, APIs, or databases this integrates with?
**Answer:**
Yes, this feature integrates with:
- **MySQL 8 database** (Railway hosted) via Entity Framework Core
- **ApplicationDbContext** already has the Faq entity and seed data for 6 FAQs
- **FaqsController** at GET /api/faqs (returns ApiResponse<IEnumerable<Faq>>)
- **FaqRepository** and **FaqService** already implemented in backend
- Angular frontend has hardcoded FAQ data that needs to be replaced with API calls

The backend is 90% complete. This feature primarily involves:
1. Verifying backend works end-to-end
2. Creating Angular FaqService to consume the API
3. Updating FaqPageComponent to fetch data dynamically
4. Building accordion component with proper accessibility

---

## Round 2: Requirements

### Q4: What are the core capabilities this feature needs? (List the must-haves)
**Answer:**
Must-have capabilities:
1. **Display all active FAQs** ordered by DisplayOrder field
2. **Accordion interaction**: Click to expand, click again to collapse
3. **Smooth animations**: 300ms transition for expand/collapse
4. **Loading state**: Show spinner while fetching data
5. **Error state**: Show error message + Retry button if API fails
6. **Keyboard accessible**: Tab navigation, Enter/Space to toggle
7. **Screen reader friendly**: Proper ARIA labels and roles
8. **Mobile responsive**: Single column layout, touch-friendly tap targets
9. **SEO optimized**: Meta tags for title, description, Open Graph
10. **Data-driven**: All content from backend, zero hardcoded FAQs in frontend

### Q5: What data does this feature create, read, update, or delete? Describe the entities.
**Answer:**
This feature is **READ-ONLY**. No create, update, or delete operations.

**Entity: Faq** (already exists in backend/VelocityAI.Api/Models/Faq.cs)
```csharp
public class Faq
{
    public int Id { get; set; }
    public string Question { get; set; } = string.Empty;
    public string Answer { get; set; } = string.Empty;
    public int DisplayOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;
}
```

**Seed Data** (already in ApplicationDbContext.OnModelCreating):
- 6 FAQ entries (IDs 1-6)
- Questions cover: deployment time, AI voice quality, escalation handling, data security, agent modularity, CRM integrations
- All have IsActive = true
- DisplayOrder ranges from 1 to 6

### Q6: What API endpoints do you envision? (e.g., GET /items, POST /items, etc.)
**Answer:**
**Single endpoint (already implemented):**

`GET /api/faqs`

**Request:** None (no query params)

**Response:** (Status 200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "question": "How long does it take to deploy an AI agent?",
      "answer": "Most single-agent deployments take 2–4 weeks...",
      "displayOrder": 1,
      "isActive": true
    },
    // ... 5 more FAQs
  ],
  "message": "FAQs retrieved successfully",
  "errors": []
}
```

**Error Response:** (Status 500)
```json
{
  "success": false,
  "data": null,
  "message": "An error occurred while retrieving FAQs.",
  "errors": ["Exception message"]
}
```

**Existing backend implementation:**
- FaqsController.GetAll() in backend/VelocityAI.Api/Controllers/FaqsController.cs
- FaqService and FaqRepository already registered in DI

---

## Round 3: UI/UX

### Q7: Does this feature have a user interface? If yes, describe the screens/pages.
**Answer:**
Yes, **single page** at route `/faq`.

**Page Layout:**
1. **Hero Section**
   - H1: "Frequently Asked Questions"
   - Subtitle: "Everything you need to know about our AI automation services"
   - Dark background with subtle grid overlay

2. **FAQ Accordion Section**
   - Vertical list of 6 FAQ items
   - Each item is a clickable card
   - Question visible by default
   - Answer hidden until expanded
   - Only one FAQ can be open at a time (collapse others when opening new one) OR multiple can be open (TBD: choose based on UX preference)

3. **CTA Section**
   - "Still have questions?" heading
   - Subtitle: "Schedule a free consultation with our team"
   - Button linking to /contact

**Visual Style:** Dark luxury theme matching Services page (teal accents, Playfair Display for headings, DM Sans for body)

### Q8: What UI components are needed? (tables, forms, cards, modals, charts, etc.)
**Answer:**
Components needed:
1. **FaqPageComponent** (container)
   - Fetches data
   - Manages loading/error states
   - Renders hero section + accordion + CTA

2. **FaqAccordionComponent** (reusable)
   - Takes array of Faq items as @Input
   - Manages expanded/collapsed state per item
   - Emits events for analytics (optional)

3. **FaqItemComponent** (individual accordion item)
   - Props: question, answer, isExpanded
   - Click handler to toggle expansion
   - CSS transition for smooth animation

4. **LoadingSpinnerComponent** (shared, already exists)

5. **ToastComponent** (shared, already exists) — for error notifications

### Q9: Are there any specific design requirements? (brand colors, existing design system, etc.)
**Answer:**
**Design System:** VelocityAI dark luxury theme (already defined in global CSS custom properties)

**Colors:**
- Background: `var(--bg-primary)` (#0a0a0f)
- Surface: `var(--surface-dark)` (#1a1a2e)
- Border: `var(--border-color)` (#2a2a3e)
- Accent: `var(--accent-teal)` (#00e5a0)
- Text primary: `var(--text-primary)` (#ffffff)
- Text secondary: `var(--text-secondary)` (#b0b0c0)

**Typography:**
- H1: Playfair Display, 48px (mobile: 32px)
- H2 (questions): Playfair Display, 24px, semibold
- Body (answers): DM Sans, 16px, line-height 1.6

**Accordion Animation:**
- Expand/collapse: 300ms ease-in-out
- Content fade-in: opacity 0 → 1 over 200ms
- Icon rotation: chevron rotates 180deg when expanded

**Accessibility:**
- WCAG 2.1 AA compliant
- Color contrast ratio ≥4.5:1
- Focus indicators visible
- Keyboard navigation (Tab, Enter/Space)
- ARIA roles: button, region, expanded state

---

## Round 4: Constraints

### Q10: What are the non-functional requirements? (performance targets, scalability, security)
**Answer:**
**Performance:**
- Page load time: <2 seconds on 3G connection
- API response time: <500ms
- Lighthouse performance score: ≥90
- First Contentful Paint: <1.5s
- Time to Interactive: <3s

**Scalability:**
- Current scope: 6 FAQs (low volume)
- Future-proof for up to 50 FAQs without pagination
- If FAQ count exceeds 50, implement category filtering or search

**Security:**
- Read-only endpoint, no authentication required
- CORS restricted to frontend domain
- No sensitive data in FAQs (all public-facing content)
- XSS protection via Angular's built-in sanitization

**Accessibility:**
- WCAG 2.1 Level AA compliance
- Keyboard navigation support
- Screen reader tested with NVDA/VoiceOver
- Supports prefers-reduced-motion

**Browser Support:**
- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile Safari iOS 14+
- Chrome Android

### Q11: Are there any technical constraints or preferences? (specific libraries, patterns, hosting)
**Answer:**
**Constraints:**
- Must use **Angular 19+** standalone components (no NgModules)
- Must use **Angular Signals** for state management (no NgRx for this simple feature)
- Must use **OnPush change detection** for performance
- Must follow **existing folder structure**: `frontend/src/app/features/faq/`
- Must use **existing ApiService** for HTTP calls (no direct HttpClient usage)
- Must use **ScrollRevealDirective** for scroll-triggered animations
- Backend already complete — frontend implementation only

**Preferences:**
- Single-file components where possible (keep .ts, .html, .scss together in mind, but use separate files)
- Minimal dependencies (use Angular Material accordion if it fits theme, otherwise build custom)
- Reusable components (FaqAccordionComponent should be generic enough for future use)

**Hosting:**
- Frontend: Vercel
- Backend: Railway
- Database: Railway MySQL 8

**No external libraries needed** beyond Angular core + Angular Material (already in project).

---

## Round 5: Confirmation

### Q12: Is there anything else important that we haven't covered?
**Answer:**
**Additional Context:**
1. **Testing deferred**: Per user instruction in CLAUDE.md, focus on DEVELOPMENT only. No tests or documentation until all features are built.
2. **Build order**: FAQ is Feature 5, comes after Services (Feature 3). Pricing (Feature 4) can be done in parallel since it's static.
3. **Agent routing**: This is a simple feature (backend done, frontend only), so can be completed by Angular Expert agent in a single chunk.
4. **Similarity to Services feature**: Follow the same pattern used for Services page (create FaqService, update component to fetch from API, handle loading/error states).

### Q13: [Summary] Does this accurately capture your requirements?
**Answer:**
✅ **AUTO-APPROVED** (per user instruction)

**Summary confirmed:**
- ✅ Backend fully implemented (GET /api/faqs, seed data, repository, service, controller)
- ✅ Frontend partially implemented (hardcoded data, needs API integration)
- ✅ Task scope: Create FaqService, update FaqPageComponent, build FaqAccordionComponent, add loading/error states
- ✅ Success criteria: 6 FAQs render from database, accordion works smoothly, responsive design, WCAG AA compliant
- ✅ No tests/docs per user instruction
- ✅ Ready to proceed to Planner Agent

---

## Next Steps
1. ✅ Interview complete
2. ⏭️ Spawn Planner Agent to generate specification files
3. ⏭️ Generate task breakdown
4. ⏭️ Route tasks to Angular Expert agent
5. ⏭️ Implement and verify
