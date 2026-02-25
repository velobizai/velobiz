# Feature Planning Interview — Services Page

**Feature Name:** Services Page
**Interview Date:** 2026-02-20
**Interviewed By:** Lead Agent (Auto-spec mode)
**Context Source:** agent-plan-prompt.md

---

## Round 1: Context

### 1. What is the business problem this feature solves? Who are the target users?

**Problem:** Potential clients need to understand the full range of AI automation services Velobiz offers. The home page shows 8 industry tiles but doesn't detail the actual service offerings. This feature provides a dedicated services catalog page.

**Target Users:** Business owners, operations managers, and decision-makers researching AI automation solutions for their companies. They need detailed service descriptions to understand which solutions fit their needs before booking a consultation.

### 2. What are the success criteria? How will you measure if this feature is working?

**Success Criteria:**
- All 8 services load dynamically from the backend API
- Each service card displays icon, title, short description (always visible), and long description (revealed on hover)
- Page loads in <3 seconds on 3G
- Responsive layout works at all breakpoints (320px, 768px, 1024px, 1440px)
- Loading and error states handled gracefully
- Lighthouse performance score ≥90
- Lighthouse accessibility score ≥90 (WCAG 2.1 AA)

**Metrics:**
- API response time for GET /api/services
- Frontend rendering performance (no layout shifts, 60 FPS animations)
- User engagement (time on page, scroll depth)

### 3. Are there any existing systems, APIs, or databases this integrates with?

**Existing Infrastructure (Feature 0):**
- MySQL 8 database with Service entity already defined
- Entity Framework Core with Pomelo MySQL provider
- ApplicationDbContext with DbSet<Service>
- Service model: Id, Title, Icon, ShortDescription, LongDescription, DisplayOrder, IsActive
- ApiResponse<T> generic wrapper for consistent API responses
- Angular ApiService (HttpClient wrapper with error handling)
- ScrollRevealDirective for fade-up animations on scroll

**Dependencies:**
- Backend: EF Core, ApplicationDbContext
- Frontend: ApiService, ScrollRevealDirective, Angular Material, Tailwind CSS

---

## Round 2: Requirements

### 4. What are the core capabilities this feature needs? (List the must-haves)

**Must-Haves:**
1. **Backend API endpoint:** GET /api/services returns all active services ordered by DisplayOrder
2. **Database seeding:** All 8 services populated via EF Core HasData() in ApplicationDbContext
3. **Frontend service layer:** Angular ServicesService fetches and caches the services list
4. **Service card component:** Reusable ServiceCardComponent displays icon, title, short/long descriptions with hover reveal
5. **Services page component:** ServicesPageComponent renders 8 service cards in a responsive grid
6. **Loading state:** Spinner shown while API call is in progress
7. **Error state:** User-friendly error message if API fails, with retry option
8. **Responsive grid:** 1 column (mobile), 2 columns (tablet), 3-4 columns (desktop)
9. **Hover animations:** Card lift + glow effect on hover (desktop), tap to expand on mobile
10. **Scroll reveal:** Staggered fade-up animation using ScrollRevealDirective

### 5. What data does this feature create, read, update, or delete? Describe the entities.

**Entity: Service (already defined in Feature 0)**

```csharp
public class Service
{
    public int Id { get; set; }                          // Primary key, auto-increment
    public string Title { get; set; } = string.Empty;    // e.g., "AI Voice Agent — Inbound Support"
    public string Icon { get; set; } = string.Empty;     // Lucide icon name (e.g., "phone", "mail")
    public string ShortDescription { get; set; } = string.Empty;  // 1-2 sentence summary
    public string LongDescription { get; set; } = string.Empty;   // Full paragraph with details
    public int DisplayOrder { get; set; } = 0;           // Sort order (1-8)
    public bool IsActive { get; set; } = true;           // Soft delete flag
}
```

**CRUD Operations:**
- **Create:** Seeded via HasData() in ApplicationDbContext (8 services, static IDs 1-8)
- **Read:** GET /api/services queries all active services ordered by DisplayOrder
- **Update:** Not in scope for this feature (future admin panel)
- **Delete:** Not in scope (IsActive flag used for soft deletes)

**Data Source:** The 8 services are defined in the agent-plan-prompt.md document (lines 126-164):
1. AI Voice Agent — Inbound Support (icon: phone)
2. AI Voice Agent — Outbound Collection (icon: signal)
3. Email Management AI Agent (icon: mail)
4. Marketing Campaign AI Agent (icon: megaphone)
5. Social Media Scheduling & Management (icon: share)
6. Paid Ads AI Agent (icon: target)
7. GEO — Generative Engine Optimisation (icon: brain)
8. SDLC AI Agent Suite (icon: code)

### 6. What API endpoints do you envision?

**API Contract:**

```
GET /api/services
```

**Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "AI Voice Agent — Inbound Support",
      "icon": "phone",
      "shortDescription": "24/7 intelligent inbound call handling...",
      "longDescription": "Full inbound call automation including sentiment detection...",
      "displayOrder": 1,
      "isActive": true
    },
    ...7 more services
  ],
  "message": "Services retrieved successfully"
}
```

**Response (Error):**
```json
{
  "success": false,
  "data": null,
  "message": "Failed to retrieve services"
}
```

**HTTP Status Codes:**
- 200 OK: Services retrieved successfully
- 500 Internal Server Error: Database connection failed or query error

---

## Round 3: UI/UX

### 7. Does this feature have a user interface? If yes, describe the screens/pages.

**Yes — Single Page: /services**

**Layout Structure:**
```
┌─────────────────────────────────────────────┐
│           Navbar (Feature 1)                │
├─────────────────────────────────────────────┤
│                                             │
│  [Page Header]                              │
│  "Our AI Automation Services"               │
│  Subtitle text                              │
│                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ Service  │ │ Service  │ │ Service  │   │
│  │  Card 1  │ │  Card 2  │ │  Card 3  │   │
│  └──────────┘ └──────────┘ └──────────┘   │
│                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ Service  │ │ Service  │ │ Service  │   │
│  │  Card 4  │ │  Card 5  │ │  Card 6  │   │
│  └──────────┘ └──────────┘ └──────────┘   │
│                                             │
│  ┌──────────┐ ┌──────────┐                 │
│  │ Service  │ │ Service  │                 │
│  │  Card 7  │ │  Card 8  │                 │
│  └──────────┘ └──────────┘                 │
│                                             │
│  [CTA Banner]                               │
│  "Ready to automate? Contact us"            │
│                                             │
├─────────────────────────────────────────────┤
│           Footer (Feature 1)                │
└─────────────────────────────────────────────┘
```

**Service Card (Default State):**
- Large icon (Lucide icon, 48px, teal accent color)
- Service title (24px, bold, white)
- Short description (16px, gray-300, 2-3 lines)
- Subtle border glow

**Service Card (Hover State):**
- Card lifts (translateY -8px)
- Border glow intensifies (teal accent)
- Long description fades in, replacing short description
- Smooth transition (300ms ease-out)

**Mobile Behavior:**
- Cards stack vertically (1 column)
- Tap to expand (toggles long description visibility)
- Expanded card shows "Read less" link

### 8. What UI components are needed?

**Components:**
1. **ServicesPageComponent** (container)
   - Page header with title and subtitle
   - Grid layout for service cards
   - Loading spinner (when data is being fetched)
   - Error message (if API fails, with "Retry" button)
   - CTA banner at bottom

2. **ServiceCardComponent** (reusable)
   - Icon display (uses Lucide Angular library)
   - Title
   - Short description (always visible)
   - Long description (hover reveal on desktop, tap toggle on mobile)
   - Hover animations (lift + glow)
   - Scroll reveal directive applied

**Shared Components (from Feature 0):**
- LoadingSpinnerComponent (shown while fetching)
- ToastComponent (error notifications)

**Directives:**
- ScrollRevealDirective (fade-up on scroll into view)

### 9. Are there any specific design requirements?

**Design System (from agent-plan-prompt.md):**
- **Dark luxury theme:** Background #0a0a0f, card backgrounds #14141a
- **Accent color:** Electric teal #00e5a0 (for icons, borders, glow effects)
- **Typography:**
  - Headings: Playfair Display (serif)
  - Body: DM Sans (sans-serif)
- **Card styling:**
  - Subtle border: 1px solid rgba(255,255,255,0.1)
  - Hover glow: box-shadow with teal accent
  - Border radius: 12px
  - Padding: 32px
- **Responsive grid:**
  - Mobile (<768px): 1 column, 16px gap
  - Tablet (768-1023px): 2 columns, 24px gap
  - Desktop (≥1024px): 3 columns, 32px gap
- **Animations:**
  - Scroll reveal: fade-up, 600ms ease-out, staggered 100ms delay per card
  - Hover transition: 300ms ease-out
  - Icon pulse on hover (scale 1.05)

**Accessibility:**
- Semantic HTML: <article> for cards, <h2> for titles
- aria-label on icon-only elements
- Focus visible styles for keyboard navigation
- Sufficient color contrast (WCAG AA)
- Prefers-reduced-motion support (disable animations if user prefers)

---

## Round 4: Constraints

### 10. What are the non-functional requirements?

**Performance:**
- API response time: <200ms for GET /api/services
- Time to interactive: <3 seconds on 3G
- Lighthouse performance score: ≥90
- No layout shifts (CLS = 0)
- Animations run at 60 FPS

**Scalability:**
- API can handle 100+ concurrent requests
- Frontend caches services in memory (no repeated API calls on navigation)

**Security:**
- No authentication required (public endpoint)
- CORS policy restricts API access to Vercel domain
- No sensitive data exposed

**Accessibility:**
- WCAG 2.1 AA compliance
- Lighthouse accessibility score: ≥90
- Screen reader compatible
- Keyboard navigable

**SEO:**
- Angular Meta service sets page title: "AI Automation Services | Velobiz"
- Meta description: "Discover our 8 AI automation services..."
- Open Graph tags for social sharing

**Browser Support:**
- Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ (Angular 19 baseline)

### 11. Are there any technical constraints or preferences?

**Stack (fixed by Feature 0):**
- Backend: .NET Core 8, Entity Framework Core, Pomelo MySQL provider
- Frontend: Angular 19, Angular Material 3, Tailwind CSS, Lucide icons
- Database: MySQL 8 on Railway

**Architecture Patterns:**
- Repository pattern for data access
- Service layer for business logic
- Dependency injection for all services
- OnPush change detection strategy
- Signals for reactive state management

**Coding Standards:**
- C# 4-space indentation, nullable reference types enabled
- TypeScript 2-space indentation, strict mode
- Async/await for all I/O operations
- Descriptive variable names

**Constraints:**
- No external UI libraries beyond Angular Material
- All colors via CSS custom properties (no hardcoded hex values)
- Lazy-loaded routes for all pages
- No third-party state management (use Angular Signals)

---

## Round 5: Confirmation

### 12. Is there anything else important that we haven't covered?

**Database Seeding:**
The 8 services must be seeded via EF Core HasData() in ApplicationDbContext.OnModelCreating. Use static IDs (1-8) to keep migrations idempotent. The seed data is defined in agent-plan-prompt.md lines 126-164.

**Migration Strategy:**
- Feature 0 already created the Service entity and initial migration
- This feature will add a new migration to seed the 8 services: `dotnet ef migrations add SeedServicesData`
- Migration must be applied to dev database before testing: `dotnet ef database update`

**Frontend Existing Code:**
- ServicesPageComponent already exists at `frontend/src/app/features/services/services-page.component.ts`
- Currently uses hardcoded data (SERVICES array in component file)
- This feature will replace hardcoded data with API-driven data
- Existing UI structure can be preserved, just wire it to the backend

**Backend Stub:**
- ServicesController already exists but returns 501 Not Implemented
- This feature will implement the full repository → service → controller stack

**No Admin Panel:**
- CRUD operations (create/update/delete services) are out of scope
- Services are managed via database migrations and HasData() seeding
- Future feature could add an admin panel

### 13. Does this accurately capture your requirements?

**Summary:**
- ✅ Build GET /api/services endpoint with repository + service layers
- ✅ Seed all 8 services via EF Core HasData() migration
- ✅ Create Angular ServicesService with API integration and caching
- ✅ Refactor existing ServicesPageComponent to use API data
- ✅ Add loading/error states with retry functionality
- ✅ Ensure responsive grid (1/2/3 columns) and hover animations
- ✅ Apply ScrollRevealDirective for staggered fade-up
- ✅ Meet performance (≥90 Lighthouse) and accessibility (WCAG AA) targets

**Approved:** ✅ AUTO-APPROVED (user instruction)

---

## Next Steps

1. ✅ Interview complete
2. ⏭️ Generate all 6 specification documents:
   - requirements.md
   - design.md
   - api-contract.md
   - db-schema.md
   - tasks.md
   - test-plan.md
3. ⏭️ Lock plan and proceed to `/agent-build`
