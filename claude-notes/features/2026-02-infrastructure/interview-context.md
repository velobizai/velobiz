# Feature Planning Interview — FEATURE 0: Infrastructure & Shared Foundation

**Date:** 2026-02-19
**Feature:** Infrastructure & Shared Foundation
**Interview Conducted By:** Lead Agent

---

## Round 1: Context

### Q1: What is the business problem this feature solves? Who are the target users?

The Infrastructure feature solves the foundational technical problem of establishing a robust, production-ready full-stack development environment. The target users are:
- **Developers** (primary): Need a clean, maintainable codebase with clear separation of concerns
- **End users** (indirect): Benefit from fast, secure, reliable website performance
- **Business stakeholders**: Require a scalable platform that can grow with the business

This infrastructure enables rapid development of all subsequent features while ensuring quality, security, and maintainability from day one.

### Q2: What are the success criteria? How will you measure if this feature is working?

Success criteria:
1. ✅ Backend API runs successfully on `dotnet run` with all middleware configured
2. ✅ Angular frontend runs on `ng serve` and proxies API calls correctly
3. ✅ MySQL database connection established, all migrations applied, seed data present
4. ✅ All 4 entity classes (Contact, Faq, Service, NewsletterSubscriber) mapped in EF Core
5. ✅ Shared components (ApiService, ToastService, LoadingSpinner, Toast) functional and tested
6. ✅ CORS policy allows Angular dev origin, blocks others
7. ✅ README documentation enables any developer to set up locally in <15 minutes

### Q3: Are there any existing systems, APIs, or databases this integrates with?

**External integrations:**
- **Railway** (MySQL 8 hosting — managed database service)
- **MailKit** (SMTP email sending library for contact form and notifications)

**Technology stack dependencies:**
- Pomelo.EntityFrameworkCore.MySql (EF Core provider for MySQL)
- FluentValidation (request validation)
- Angular Material 3+ (UI component library)

No existing legacy systems to integrate with — this is a greenfield project.

---

## Round 2: Requirements

### Q4: What are the core capabilities this feature needs? (List the must-haves)

**Backend capabilities:**
- ASP.NET Core 8 Web API with clean architecture (Controllers, Services, Repositories, Models, DTOs, Validators)
- EF Core 6+ with Pomelo MySQL provider configured
- ApplicationDbContext with all 4 entities and seed data via HasData()
- Generic `ApiResponse<T>` wrapper for consistent API responses
- Global exception handling middleware
- CORS policy configuration (dev + production)
- FluentValidation integration
- All repository and service interfaces/classes scaffolded

**Frontend capabilities:**
- Angular 19 with standalone components
- Angular Material 3+ theme configured
- Proxy configuration for local API calls
- Core services: ApiService (HTTP wrapper), ToastService
- Shared components: LoadingSpinnerComponent, ToastComponent
- ScrollRevealDirective for animations
- CSS custom properties for theme variables

**Database capabilities:**
- MySQL 8 connection via Railway
- Initial migration with all 4 tables
- Seed data for 8 services and 6 FAQs
- Unique index on NewsletterSubscriber.Email

**Documentation:**
- README with setup instructions, migration workflow, and deployment steps

### Q5: What data does this feature create, read, update, or delete? Describe the entities.

This feature defines the schema but doesn't implement CRUD operations yet (those come in later features). Here are the 4 entities:

**1. Contact**
- Purpose: Store contact form submissions
- Fields: Id, Name, Email, Company (nullable), Phone (nullable), Message, ServiceInterest, Status (default "new"), CreatedAt
- Relationships: None (standalone)

**2. Faq**
- Purpose: Store frequently asked questions
- Fields: Id, Question, Answer, DisplayOrder, IsActive
- Relationships: None
- Seed data: 6 FAQ entries via HasData()

**3. Service**
- Purpose: Store AI automation service offerings
- Fields: Id, Title, Icon, ShortDescription, LongDescription, DisplayOrder, IsActive
- Relationships: None
- Seed data: 8 service entries via HasData()

**4. NewsletterSubscriber**
- Purpose: Store newsletter email signups
- Fields: Id, Email (unique index), SubscribedAt, IsActive
- Relationships: None

### Q6: What API endpoints do you envision? (e.g., GET /items, POST /items, etc.)

**This feature establishes the API structure but doesn't implement endpoints yet.** The scaffolding includes:

**Controllers created (empty/scaffolded):**
- `ServicesController` (future: GET /api/services)
- `FaqsController` (future: GET /api/faqs)
- `ContactController` (future: POST /api/contact)
- `NewsletterController` (future: POST /api/newsletter)

**Repository methods scaffolded (no implementations yet):**
- `IServicesRepository`, `IFaqRepository`, `IContactRepository`, `INewsletterRepository`

**Service layer scaffolded (no implementations yet):**
- `IServicesService`, `IFaqService`, `IContactService`

The actual endpoint implementations come in FEATURE 3 (Services), FEATURE 5 (FAQ), and FEATURE 6 (Contact).

---

## Round 3: UI/UX

### Q7: Does this feature have a user interface? If yes, describe the screens/pages.

**No user-facing pages in this feature.** However, it establishes the UI foundation:

**Visual infrastructure:**
- Global CSS custom properties (`:root` block with color theme)
- Dark luxury theme variables: backgrounds (#0a0a0f range), accent teal (#00e5a0)
- Typography: Playfair Display (serif headings), DM Sans (body)
- Angular Material theme configured

**Reusable UI components created:**
1. **LoadingSpinnerComponent** — animated spinner for loading states
2. **ToastComponent** — notification toast for success/error messages

These components will be used by all subsequent features.

### Q8: What UI components are needed? (tables, forms, cards, modals, charts, etc.)

**Shared components (created in this feature):**
- LoadingSpinnerComponent (spinner animation)
- ToastComponent (notification system)

**Shared directive:**
- ScrollRevealDirective (IntersectionObserver-based fade-up animation for cards/sections)

**Angular Material modules needed:**
- MatProgressSpinnerModule (for LoadingSpinner)
- MatSnackBarModule (for Toast notifications)
- MatButtonModule (for future features)
- MatFormFieldModule, MatInputModule (for future forms)
- MatIconModule (for icons across the site)

### Q9: Are there any specific design requirements? (brand colors, existing design system, etc.)

**Design system established in this feature:**

**Color palette (CSS custom properties):**
```css
:root {
  --color-bg-primary: #0a0a0f;
  --color-bg-secondary: #131318;
  --color-accent: #00e5a0;
  --color-text-primary: #ffffff;
  --color-text-secondary: #a0a0b0;
  --color-border: rgba(255, 255, 255, 0.1);
}
```

**Typography:**
- Headings: Playfair Display (serif), imported via Google Fonts
- Body: DM Sans (sans-serif), imported via Google Fonts

**Spacing and layout:**
- Mobile-first responsive design
- Breakpoints: 320px (mobile), 768px (tablet), 1024px (desktop), 1440px (large desktop)

**Animations:**
- Scroll reveal: staggered fade-up with IntersectionObserver
- Transitions: 300ms ease for hover states, 500ms ease for page transitions

**Accessibility:**
- WCAG 2.1 AA compliance target
- Semantic HTML required
- Proper aria-labels on all interactive elements

---

## Round 4: Constraints

### Q10: What are the non-functional requirements? (performance targets, scalability, security)

**Performance:**
- Initial page load <3 seconds (measured on 3G)
- API response time <200ms for read operations, <500ms for write operations
- Angular bundle size <500KB (initial), lazy-loaded routes for all features

**Scalability:**
- Database connection pooling configured (default EF Core pool size: 100)
- Stateless API design (no server-side session state)
- Railway MySQL can scale vertically up to 8GB RAM as traffic grows

**Security:**
- HTTPS enforced in production (Vercel + Railway both provide SSL)
- CORS restricted to frontend domain only
- SQL injection protection via EF Core parameterized queries
- XSS protection via Angular sanitization
- CSRF protection via SameSite cookie policy (future authentication)
- No secrets in code — all config via appsettings.json + environment variables

**Reliability:**
- Global exception handler catches all unhandled errors
- Database migrations versioned and reversible
- Graceful error messages returned to frontend (never leak stack traces)

### Q11: Are there any technical constraints or preferences? (specific libraries, patterns, hosting)

**Hard constraints (non-negotiable):**
- .NET Core 8 (not 6, not 9)
- Angular 19+ with standalone components (no NgModules)
- MySQL 8 via Railway (not PostgreSQL, not local MySQL)
- Pomelo.EntityFrameworkCore.MySql (community standard for MySQL + EF Core)
- Entity Framework Core for ALL data access (no Dapper, no raw SQL)
- FluentValidation for request validation
- MailKit for email (not System.Net.Mail, not SendGrid SDK)

**Strong preferences:**
- Clean architecture pattern (Controllers → Services → Repositories → EF Core)
- Repository pattern for data access
- Dependency injection for all services
- Async/await for all I/O operations
- 4-space indentation for C#, 2-space for TypeScript
- Nullable reference types enabled in C#

**Hosting:**
- Frontend: Vercel (Angular build)
- Backend: Railway (containerized .NET API via Dockerfile)
- Database: Railway MySQL (same project as backend API)

**Testing framework:**
- Backend: xUnit + Moq + FluentAssertions
- Frontend: Jasmine + Karma + Angular Testing Library

---

## Round 5: Confirmation

### Q12: Is there anything else important that we haven't covered?

**Additional critical details:**

1. **Seed data IDs must be static** — HasData() in ApplicationDbContext must use hardcoded IDs (1-8 for services, 1-6 for FAQs) to keep migrations idempotent. Auto-generated IDs will cause migration conflicts.

2. **Proxy configuration critical** — `proxy.conf.json` must forward `/api/*` to `https://localhost:5001` (HTTPS, not HTTP) to match the .NET dev server.

3. **Railway internal networking** — Production connection string should use Railway's private network URL (not public) when API and database are in the same Railway project, to reduce latency and avoid egress costs.

4. **EF Core lifetime scoping** — ApplicationDbContext must be registered as Scoped (default), and all repositories/services must also be Scoped to match the DbContext lifetime.

5. **Environment variable overrides** — appsettings.json keys can be overridden via environment variables using double-underscore syntax: `ConnectionStrings__DefaultConnection`, `Mail__Host`, etc.

6. **No modifications to Migrations/** — Migrations folder is auto-generated by `dotnet ef`. Never hand-edit migration files.

### Q13: Summary approved?

✅ **APPROVED** — User confirmed "all good, go ahead"

---

## Interview Status

**Status:** COMPLETED
**Approved By:** User
**Next Step:** Spawn Planner Agent to generate full specification
