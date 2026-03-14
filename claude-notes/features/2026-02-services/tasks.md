# Implementation Tasks — Services Page

**Feature ID:** FEATURE-3
**Total Tasks:** 12
**Estimated Total Time:** 8-10 hours
**Chunk Strategy:** Single chunk (all tasks together)

---

## Task Dependency Order

```
DATABASE LAYER (Tasks 3.1-3.2)
    ↓
BACKEND API (Tasks 3.3-3.5)
    ↓
FRONTEND SERVICE (Task 3.6)
    ↓
FRONTEND COMPONENTS (Tasks 3.7-3.9)
    ↓
ROUTING & INTEGRATION (Task 3.10)
    ↓
POLISH & QA (Tasks 3.11-3.12)
```

---

## Task List

### 🗄️ DATABASE LAYER

---

#### Task 3.1: Add Seed Data to ApplicationDbContext

**Layer:** Database / EF Core
**Estimate:** 45 minutes
**Agent:** Database Engineer
**Dependencies:** None (Feature 0 already created Service entity)

**Description:**
Update `ApplicationDbContext.OnModelCreating()` to seed all 8 services using `HasData()` method.

**Acceptance Criteria:**
- ✅ `GetServicesSeedData()` method created in ApplicationDbContext.cs
- ✅ Method returns array of 8 Service objects with all fields populated
- ✅ Static IDs used (1-8) for idempotent migrations
- ✅ `entity.HasData(GetServicesSeedData())` called in OnModelCreating
- ✅ Seed data matches content from agent-plan-prompt.md lines 126-164

**Files to Modify:**
- `backend/Velobiz.Api/Data/ApplicationDbContext.cs`

**Implementation Notes:**
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
            ShortDescription = "24/7 intelligent inbound call handling...",
            LongDescription = "Full inbound call automation...",
            DisplayOrder = 1,
            IsActive = true
        },
        // ... 7 more services
    };
}
```

**Verification:**
- Code compiles without errors
- No duplicate IDs
- All 8 services present

---

#### Task 3.2: Generate and Apply EF Core Migration

**Layer:** Database / EF Core
**Estimate:** 15 minutes
**Agent:** Database Engineer
**Dependencies:** Task 3.1

**Description:**
Generate EF Core migration to insert seed data into Services table, then apply it to the development database.

**Acceptance Criteria:**
- ✅ Migration generated: `dotnet ef migrations add SeedServicesData`
- ✅ Migration file created in `backend/Velobiz.Api/Migrations/`
- ✅ Migration applied: `dotnet ef database update`
- ✅ Verification query returns 8 rows: `SELECT * FROM Services;`
- ✅ No errors during migration application

**Commands to Run:**
```bash
cd backend/Velobiz.Api
dotnet ef migrations add SeedServicesData
dotnet ef database update
```

**Files Created:**
- `backend/Velobiz.Api/Migrations/YYYYMMDDHHMMSS_SeedServicesData.cs`
- `backend/Velobiz.Api/Migrations/YYYYMMDDHHMMSS_SeedServicesData.Designer.cs`
- `backend/Velobiz.Api/Migrations/ApplicationDbContextModelSnapshot.cs` (updated)

**Verification:**
```sql
-- Run in MySQL Workbench or Railway console
SELECT * FROM Services ORDER BY DisplayOrder;
-- Expected: 8 rows with IDs 1-8
```

---

### 🔧 BACKEND API

---

#### Task 3.3: Implement ServicesRepository

**Layer:** Backend / Repository
**Estimate:** 30 minutes
**Agent:** DotNet Architect
**Dependencies:** Task 3.2

**Description:**
Create repository interface and implementation for querying services from the database using EF Core.

**Acceptance Criteria:**
- ✅ `IServicesRepository` interface created with `GetAllActiveAsync()` method
- ✅ `ServicesRepository` class implements interface
- ✅ Constructor injects `ApplicationDbContext`
- ✅ Query uses `AsNoTracking()` for read-only optimization
- ✅ Query filters by `IsActive = true`
- ✅ Query orders by `DisplayOrder`
- ✅ Method returns `Task<IEnumerable<Service>>`

**Files to Create:**
- `backend/Velobiz.Api/Repositories/IServicesRepository.cs`
- `backend/Velobiz.Api/Repositories/ServicesRepository.cs`

**Implementation:**
```csharp
public class ServicesRepository : IServicesRepository
{
    private readonly ApplicationDbContext _context;

    public ServicesRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Service>> GetAllActiveAsync()
    {
        return await _context.Services
            .Where(s => s.IsActive)
            .OrderBy(s => s.DisplayOrder)
            .AsNoTracking()
            .ToListAsync();
    }
}
```

**Verification:**
- Code compiles without errors
- No nullable reference warnings

---

#### Task 3.4: Implement ServicesService

**Layer:** Backend / Service
**Estimate:** 20 minutes
**Agent:** DotNet Architect
**Dependencies:** Task 3.3

**Description:**
Create service layer interface and implementation that calls the repository. This layer can contain business logic if needed in the future.

**Acceptance Criteria:**
- ✅ `IServicesService` interface created with `GetAllActiveServicesAsync()` method
- ✅ `ServicesService` class implements interface
- ✅ Constructor injects `IServicesRepository`
- ✅ Method delegates to repository
- ✅ Method returns `Task<IEnumerable<Service>>`

**Files to Create:**
- `backend/Velobiz.Api/Services/IServicesService.cs`
- `backend/Velobiz.Api/Services/ServicesService.cs`

**Implementation:**
```csharp
public class ServicesService : IServicesService
{
    private readonly IServicesRepository _repository;

    public ServicesService(IServicesRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<Service>> GetAllActiveServicesAsync()
    {
        return await _repository.GetAllActiveAsync();
    }
}
```

**Verification:**
- Code compiles without errors
- Follows dependency injection pattern

---

#### Task 3.5: Update ServicesController and Register DI

**Layer:** Backend / Controller + DI
**Estimate:** 30 minutes
**Agent:** DotNet Architect
**Dependencies:** Task 3.4

**Description:**
Replace the 501 stub in ServicesController with full implementation. Register repository and service in DI container.

**Acceptance Criteria:**
- ✅ `ServicesController.GetAll()` method calls `_service.GetAllActiveServicesAsync()`
- ✅ Success response wrapped in `ApiResponse<IEnumerable<Service>>.SuccessResponse()`
- ✅ Exception handling with try-catch block
- ✅ Error response returns 500 status with `ApiResponse<T>.ErrorResponse()`
- ✅ Logger injected and used for error logging
- ✅ Repository and service registered in Program.cs as Scoped
- ✅ Swagger XML comments present

**Files to Modify:**
- `backend/Velobiz.Api/Controllers/ServicesController.cs`
- `backend/Velobiz.Api/Program.cs`

**Program.cs DI Registration:**
```csharp
// Add before builder.Build()
builder.Services.AddScoped<IServicesRepository, ServicesRepository>();
builder.Services.AddScoped<IServicesService, ServicesService>();
```

**ServicesController Implementation:**
```csharp
[HttpGet]
public async Task<ActionResult<ApiResponse<IEnumerable<Service>>>> GetAll()
{
    try
    {
        var services = await _service.GetAllActiveServicesAsync();
        return Ok(ApiResponse<IEnumerable<Service>>.SuccessResponse(
            services,
            "Services retrieved successfully"
        ));
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error retrieving services");
        return StatusCode(500, ApiResponse<IEnumerable<Service>>.ErrorResponse(
            "An error occurred while retrieving services. Please try again later.",
            new[] { ex.Message }
        ));
    }
}
```

**Verification:**
- Run backend: `dotnet run`
- Test endpoint: `GET https://localhost:5001/api/services`
- Expected: 200 OK with 8 services in JSON response
- Swagger UI shows updated endpoint documentation

---

### 🎨 FRONTEND SERVICE LAYER

---

#### Task 3.6: Create Angular ServicesService

**Layer:** Frontend / Service
**Estimate:** 45 minutes
**Agent:** Angular Expert
**Dependencies:** Task 3.5 (backend API must be ready)

**Description:**
Create Angular service to fetch services from the backend API with caching and error handling.

**Acceptance Criteria:**
- ✅ `ServicesService` created in `frontend/src/app/core/services/`
- ✅ `getServices()` method returns `Observable<Service[]>`
- ✅ HTTP call uses `ApiService` (from Feature 0)
- ✅ Response unwraps `data` from `ApiResponse<Service[]>`
- ✅ Signal-based caching (fetch once, cache result)
- ✅ `clearCache()` method for future use
- ✅ Error handling with `catchError` operator
- ✅ Service provided in root

**Files to Create:**
- `frontend/src/app/core/services/services.service.ts`
- `frontend/src/app/core/models/service.model.ts`

**Service Model:**
```typescript
export interface Service {
  id: number;
  title: string;
  icon: string;
  shortDescription: string;
  longDescription: string;
  displayOrder: number;
  isActive: boolean;
}
```

**Service Implementation:**
```typescript
@Injectable({ providedIn: 'root' })
export class ServicesService {
  private readonly apiUrl = `${environment.apiUrl}/services`;
  private servicesCache = signal<Service[] | null>(null);

  constructor(private http: HttpClient) {}

  getServices(): Observable<Service[]> {
    const cached = this.servicesCache();
    if (cached) {
      return of(cached);
    }

    return this.http.get<ApiResponse<Service[]>>(this.apiUrl).pipe(
      map(response => response.data || []),
      tap(services => this.servicesCache.set(services)),
      catchError(error => {
        console.error('Error fetching services:', error);
        return throwError(() => new Error('Failed to load services'));
      })
    );
  }

  clearCache(): void {
    this.servicesCache.set(null);
  }
}
```

**Verification:**
- Service compiles without errors
- Can be injected into components
- Type definitions are correct

---

### 🖼️ FRONTEND COMPONENTS

---

#### Task 3.7: Create ServiceCardComponent

**Layer:** Frontend / Component
**Estimate:** 1 hour 30 minutes
**Agent:** Angular Expert
**Dependencies:** Task 3.6

**Description:**
Create reusable service card component that displays icon, title, short/long descriptions with hover reveal animation.

**Acceptance Criteria:**
- ✅ Standalone component with OnPush change detection
- ✅ `@Input() service: Service` input property
- ✅ Lucide icon rendered using `lucide-angular`
- ✅ Short description visible by default
- ✅ Long description revealed on hover (desktop) or tap (mobile)
- ✅ `expanded` signal tracks hover/tap state
- ✅ Hover animation: translateY(-8px), box-shadow glow
- ✅ Icon animation: scale(1.05) on hover
- ✅ Crossfade transition between short/long descriptions (300ms)
- ✅ Mobile: "Tap for details" / "Tap to collapse" hint
- ✅ Keyboard accessible (Enter/Space toggles expansion)
- ✅ ARIA labels for screen readers

**Files to Create:**
- `frontend/src/app/features/services/service-card/service-card.component.ts`
- `frontend/src/app/features/services/service-card/service-card.component.html`
- `frontend/src/app/features/services/service-card/service-card.component.scss`

**Component Logic:**
```typescript
export class ServiceCardComponent {
  @Input() service!: Service;
  expanded = signal<boolean>(false);

  toggleExpanded(): void {
    if (window.innerWidth < 768) {
      this.expanded.update(val => !val);
    }
  }

  onHover(isHovering: boolean): void {
    if (window.innerWidth >= 768) {
      this.expanded.set(isHovering);
    }
  }
}
```

**Verification:**
- Card renders correctly with all fields
- Hover animation works on desktop
- Tap toggle works on mobile (test with Chrome DevTools device emulation)
- Keyboard navigation works (Tab → Enter)
- No console errors

---

#### Task 3.8: Create ServicesPageComponent

**Layer:** Frontend / Component
**Estimate:** 1 hour 30 minutes
**Agent:** Angular Expert
**Dependencies:** Task 3.7

**Description:**
Create container component that fetches services and renders them in a responsive grid.

**Acceptance Criteria:**
- ✅ Standalone component with OnPush change detection
- ✅ `services` signal holds fetched data
- ✅ `loading` signal tracks API call state
- ✅ `error` signal holds error message
- ✅ `ngOnInit()` calls `loadServices()`
- ✅ Loading state shows `LoadingSpinnerComponent`
- ✅ Error state shows error message + "Retry" button
- ✅ Success state shows services grid
- ✅ Grid layout: 1 column (mobile), 2 columns (tablet), 3 columns (desktop)
- ✅ `ScrollRevealDirective` applied to each card with staggered delay
- ✅ CTA banner at bottom with link to `/contact`
- ✅ Page title and subtitle in header
- ✅ Retry button calls `loadServices()` again

**Files to Create:**
- `frontend/src/app/features/services/services-page.component.ts`
- `frontend/src/app/features/services/services-page.component.html`
- `frontend/src/app/features/services/services-page.component.scss`

**Component Logic:**
```typescript
export class ServicesPageComponent implements OnInit {
  services = signal<Service[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor(
    private servicesService: ServicesService,
    private meta: Meta,
    private title: Title
  ) {}

  ngOnInit(): void {
    this.setMetaTags();
    this.loadServices();
  }

  loadServices(): void {
    this.loading.set(true);
    this.error.set(null);

    this.servicesService.getServices().subscribe({
      next: (services) => {
        this.services.set(services);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load services. Please try again.');
        this.loading.set(false);
      }
    });
  }

  retry(): void {
    this.loadServices();
  }

  private setMetaTags(): void {
    this.title.setTitle('AI Automation Services | Velobiz');
    this.meta.updateTag({
      name: 'description',
      content: 'Discover our 8 AI automation services: Voice AI Agents, Email Management, Marketing Automation, and more.'
    });
  }
}
```

**Verification:**
- Page loads without errors
- Loading spinner appears briefly
- Services grid renders with 8 cards
- Responsive layout works at all breakpoints
- Scroll reveal animation triggers
- CTA banner links to /contact

---

#### Task 3.9: Add Responsive CSS Grid Styling

**Layer:** Frontend / Styling
**Estimate:** 45 minutes
**Agent:** Angular Expert
**Dependencies:** Task 3.8

**Description:**
Implement responsive CSS Grid layout and dark luxury theme styling for the services page.

**Acceptance Criteria:**
- ✅ All colors use CSS custom properties (no hardcoded hex)
- ✅ Grid uses `grid-template-columns` with responsive breakpoints
- ✅ Mobile (<768px): 1 column, 16px gap
- ✅ Tablet (768-1023px): 2 columns, 24px gap
- ✅ Desktop (≥1024px): 3 columns, 32px gap
- ✅ Card styling: dark background, subtle border, teal accent glow on hover
- ✅ Typography: Playfair Display for h1, DM Sans for body
- ✅ CTA banner: full-width, teal button with hover lift
- ✅ Loading spinner: centered, teal accent
- ✅ Error state: red text, retry button
- ✅ `prefers-reduced-motion` support (disable animations)

**Files to Modify:**
- `frontend/src/app/features/services/services-page.component.scss`
- `frontend/src/app/features/services/service-card/service-card.component.scss`

**Key CSS:**
```scss
.services-grid {
  display: grid;
  gap: 32px;
  grid-template-columns: repeat(3, 1fr);

  @media (max-width: 1023px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
```

**Verification:**
- Page looks polished at 320px, 768px, 1024px, 1440px
- Colors match Velobiz dark luxury theme
- Hover effects work smoothly
- No layout shifts

---

### 🔗 ROUTING & INTEGRATION

---

#### Task 3.10: Configure Lazy-Loaded Route

**Layer:** Frontend / Routing
**Estimate:** 15 minutes
**Agent:** Angular Expert
**Dependencies:** Task 3.9

**Description:**
Add `/services` route to Angular routing configuration with lazy loading.

**Acceptance Criteria:**
- ✅ Route added to `app.routes.ts`
- ✅ Route uses lazy loading: `loadComponent(() => import(...))`
- ✅ Route path is `/services`
- ✅ Navbar link updated (if not already present)
- ✅ Navigating to `/services` loads the page without errors

**Files to Modify:**
- `frontend/src/app/app.routes.ts`
- `frontend/src/app/layout/navbar/navbar.component.ts` (if navbar links are hardcoded)

**Route Configuration:**
```typescript
export const routes: Routes = [
  { path: '', component: HomePageComponent },
  {
    path: 'services',
    loadComponent: () =>
      import('./features/services/services-page.component').then(
        m => m.ServicesPageComponent
      )
  },
  // ... other routes
];
```

**Verification:**
- Navigate to `http://localhost:4200/services`
- Page loads successfully
- URL updates correctly
- No console errors

---

### ✨ POLISH & QA

---

#### Task 3.11: Manual QA and Accessibility Audit

**Layer:** Full Stack / QA
**Estimate:** 1 hour
**Agent:** Lead Agent (you)
**Dependencies:** Task 3.10

**Description:**
Perform manual testing across devices, browsers, and accessibility tools.

**Test Cases:**
- ✅ **Desktop Chrome:** All features work (hover, scroll reveal, CTA link)
- ✅ **Mobile Safari (iPhone):** Tap to expand works, grid is 1 column
- ✅ **Tablet iPad:** Grid is 2 columns, layout looks balanced
- ✅ **Keyboard navigation:** Tab through cards, Enter expands, focus visible
- ✅ **Screen reader (NVDA/VoiceOver):** Card announces title + description
- ✅ **Network throttling (3G):** Page loads in <3 seconds
- ✅ **Lighthouse audit:** Performance ≥90, Accessibility ≥90
- ✅ **API failure test:** Disconnect Wi-Fi, verify error state shows retry button
- ✅ **Retry functionality:** Click retry, services load successfully
- ✅ **Dark mode (if applicable):** Theme looks correct
- ✅ **Color contrast:** Text meets WCAG AA (4.5:1 ratio)

**Tools:**
- Chrome DevTools (Device Mode, Network Throttling, Lighthouse)
- NVDA or VoiceOver screen reader
- axe DevTools browser extension
- Wave accessibility checker

**Deliverable:**
- Checklist of all test cases (pass/fail)
- List of any bugs found + severity rating
- Lighthouse report screenshot

**Verification:**
- All critical bugs fixed before marking feature complete
- Lighthouse scores meet targets

---

#### Task 3.12: Build Verification and Linting

**Layer:** Full Stack / CI
**Estimate:** 15 minutes
**Agent:** Lead Agent (you)
**Dependencies:** Task 3.11

**Description:**
Run build and lint commands to ensure code quality and no compilation errors.

**Commands to Run:**

**Backend:**
```bash
cd backend/Velobiz.Api
dotnet build
dotnet test  # Run unit tests (if any exist)
```

**Frontend:**
```bash
cd frontend
ng lint
ng build --configuration production
```

**Acceptance Criteria:**
- ✅ `dotnet build` succeeds with 0 warnings
- ✅ `ng lint` reports 0 errors (warnings acceptable if documented)
- ✅ `ng build --configuration production` succeeds
- ✅ No unused imports or variables
- ✅ No console.log statements in production code (remove or guard with environment check)

**Verification:**
- All commands exit with code 0
- Build output folder exists: `frontend/dist/`
- No blocking issues

---

## Task Summary Table

| Task ID | Title | Layer | Agent | Estimate | Status |
|---------|-------|-------|-------|----------|--------|
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

**Total: 12 tasks, ~9 hours**

---

## Chunk Strategy

### Chunk 1: Complete Services Page Implementation

**Why Single Chunk?**
- No database schema changes (only seed data)
- Backend API is simple (1 endpoint, repository + service pattern)
- Frontend components are tightly coupled (card + page)
- No complex business logic or integrations
- Small scope (8 hours), can be completed in 1 working day

**Agents Involved:**
1. **Database Engineer** (Tasks 3.1-3.2): 1 hour
2. **DotNet Architect** (Tasks 3.3-3.5): 1.5 hours
3. **Angular Expert** (Tasks 3.6-3.10): 5 hours
4. **Lead Agent** (Tasks 3.11-3.12): 1.25 hours

**Execution Plan:**
1. Database Engineer completes Tasks 3.1-3.2 (sequential)
2. DotNet Architect completes Tasks 3.3-3.5 (sequential, wait for DB)
3. Angular Expert completes Tasks 3.6-3.10 (sequential, wait for API)
4. Lead Agent performs QA and build verification (wait for frontend)

**Parallel Opportunities:**
- None (tasks are sequential due to dependencies)

**Review Points:**
- After Task 3.2: Verify seed data in database
- After Task 3.5: Test API endpoint with Postman/curl
- After Task 3.10: Full integration test (frontend → API → database)
- After Task 3.12: Final review before marking feature complete

---

## Rollback Plan

If a critical bug is discovered:

1. **Database rollback:**
   ```bash
   dotnet ef database update InitialCreate
   ```

2. **Code rollback:**
   - Revert all commits for Feature 3
   - Remove `/services` route from app.routes.ts
   - Remove DI registrations from Program.cs

3. **Frontend fallback:**
   - Restore hardcoded SERVICES array in ServicesPageComponent
   - Comment out API call

---

## Post-Implementation Checklist

Before marking Feature 3 as complete:

- ✅ All 12 tasks completed and verified
- ✅ Database has 8 services seeded
- ✅ API endpoint returns 200 OK with 8 services
- ✅ Frontend loads services dynamically
- ✅ Responsive layout works (320px, 768px, 1024px, 1440px)
- ✅ Hover/tap animations work smoothly
- ✅ Loading and error states display correctly
- ✅ Lighthouse performance ≥90
- ✅ Lighthouse accessibility ≥90
- ✅ No console errors or warnings
- ✅ `dotnet build` succeeds
- ✅ `ng lint` passes
- ✅ `ng build --configuration production` succeeds
- ✅ All code committed to feature branch
- ✅ Ready for `/agent-review` and `/agent-commit`
