# Implementation Tasks — FAQ Page

**Feature ID:** FEATURE-5
**Total Tasks:** 7
**Estimated Total Time:** 4-5 hours
**Chunk Strategy:** Single chunk (all tasks together)

---

## Task Dependency Order

```
BACKEND IMPLEMENTATION (Tasks 5.1-5.3)
    ↓
FRONTEND SERVICE (Task 5.4)
    ↓
FRONTEND COMPONENT REFACTOR (Task 5.5)
    ↓
TESTING & QA (Tasks 5.6-5.7)
```

---

## Task List

### 🔧 BACKEND API LAYER

---

#### Task 5.1: Implement FaqRepository.GetAllActiveAsync()

**Layer:** Backend / Repository
**Estimate:** 20 minutes
**Agent:** DotNet Architect
**Dependencies:** None (database already seeded)

**Description:**
Implement the `GetAllActiveAsync()` method in FaqRepository to query active FAQs from the database.

**Acceptance Criteria:**
- ✅ Method queries `_context.Faqs` using EF Core
- ✅ Filters by `IsActive = true`
- ✅ Orders by `DisplayOrder` ascending
- ✅ Uses `AsNoTracking()` for read-only optimization
- ✅ Returns `Task<IEnumerable<Faq>>`
- ✅ No errors or warnings on compilation

**Files to Modify:**
- `backend/Velobiz.Api/Repositories/FaqRepository.cs`

**Implementation:**

```csharp
public async Task<IEnumerable<Faq>> GetAllActiveAsync()
{
    return await _context.Faqs
        .Where(f => f.IsActive)
        .OrderBy(f => f.DisplayOrder)
        .AsNoTracking()
        .ToListAsync();
}
```

**Verification:**
- Code compiles without errors
- Method signature matches interface
- Uses async/await pattern correctly

---

#### Task 5.2: Implement FaqService.GetAllActiveFaqsAsync()

**Layer:** Backend / Service
**Estimate:** 10 minutes
**Agent:** DotNet Architect
**Dependencies:** Task 5.1

**Description:**
Implement the `GetAllActiveFaqsAsync()` method in FaqService to delegate to the repository.

**Acceptance Criteria:**
- ✅ Method calls `_repository.GetAllActiveAsync()`
- ✅ Returns result directly (no business logic needed)
- ✅ Method returns `Task<IEnumerable<Faq>>`
- ✅ No errors or warnings on compilation

**Files to Modify:**
- `backend/Velobiz.Api/Services/FaqService.cs`

**Implementation:**

```csharp
public async Task<IEnumerable<Faq>> GetAllActiveFaqsAsync()
{
    return await _repository.GetAllActiveAsync();
}
```

**Verification:**
- Code compiles without errors
- Follows dependency injection pattern
- Method signature matches interface

---

#### Task 5.3: Update FaqsController.GetAll() Implementation

**Layer:** Backend / Controller
**Estimate:** 25 minutes
**Agent:** DotNet Architect
**Dependencies:** Task 5.2

**Description:**
Replace the 501 stub in FaqsController with full implementation that calls the service layer and returns ApiResponse wrapper.

**Acceptance Criteria:**
- ✅ Remove 501 StatusCode stub
- ✅ `GetAll()` method calls `_service.GetAllActiveFaqsAsync()`
- ✅ Success response wrapped in `ApiResponse<IEnumerable<Faq>>.SuccessResponse()`
- ✅ Exception handling with try-catch block
- ✅ Error response returns 500 status with `ApiResponse<T>.ErrorResponse()`
- ✅ Logger used for error logging
- ✅ Swagger XML comments present
- ✅ Constructor injects ILogger (if not already present)

**Files to Modify:**
- `backend/Velobiz.Api/Controllers/FaqsController.cs`

**Implementation:**

```csharp
using Microsoft.AspNetCore.Mvc;
using Velobiz.Api.DTOs;
using Velobiz.Api.Models;
using Velobiz.Api.Services;

namespace Velobiz.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class FaqsController : ControllerBase
{
    private readonly IFaqService _service;
    private readonly ILogger<FaqsController> _logger;

    public FaqsController(IFaqService service, ILogger<FaqsController> logger)
    {
        _service = service;
        _logger = logger;
    }

    /// <summary>
    /// Get all active FAQs ordered by display order
    /// </summary>
    /// <returns>List of active FAQs</returns>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<Faq>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<Faq>>), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<IEnumerable<Faq>>>> GetAll()
    {
        try
        {
            var faqs = await _service.GetAllActiveFaqsAsync();
            return Ok(ApiResponse<IEnumerable<Faq>>.SuccessResponse(
                faqs,
                "FAQs retrieved successfully"
            ));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving FAQs");
            return StatusCode(500, ApiResponse<IEnumerable<Faq>>.ErrorResponse(
                "An error occurred while retrieving FAQs. Please try again later.",
                new[] { ex.Message }
            ));
        }
    }
}
```

**Verification:**
- Run backend: `dotnet run` (from backend/Velobiz.Api)
- Test endpoint: `GET https://localhost:5001/api/faqs`
- Expected: 200 OK with 6 FAQs in JSON response
- Swagger UI shows updated endpoint documentation at https://localhost:5001/swagger

---

### 🎨 FRONTEND SERVICE & MODEL

---

#### Task 5.4: Create Angular FaqService and Faq Model

**Layer:** Frontend / Service + Model
**Estimate:** 30 minutes
**Agent:** Angular Expert
**Dependencies:** Task 5.3 (backend API must be functional)

**Description:**
Create Angular service to fetch FAQs from backend API with caching and error handling. Also create TypeScript model for Faq interface.

**Acceptance Criteria:**
- ✅ `FaqService` created in `frontend/src/app/core/services/`
- ✅ `Faq` interface created in `frontend/src/app/core/models/`
- ✅ `getFaqs()` method returns `Observable<Faq[]>`
- ✅ HTTP call uses `HttpClient` directly
- ✅ Response unwraps `data` from `ApiResponse<Faq[]>`
- ✅ Signal-based caching (fetch once, cache result)
- ✅ `clearCache()` method for future use
- ✅ Error handling with `catchError` operator
- ✅ Service provided in root

**Files to Create:**
- `frontend/src/app/core/services/faq.service.ts`
- `frontend/src/app/core/models/faq.model.ts`

**Faq Model (faq.model.ts):**

```typescript
export interface Faq {
  id: number;
  question: string;
  answer: string;
  displayOrder: number;
  isActive: boolean;
}
```

**FaqService (faq.service.ts):**

```typescript
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Faq } from '../models/faq.model';

@Injectable({ providedIn: 'root' })
export class FaqService {
  private readonly apiUrl = `${environment.apiUrl}/faqs`;
  private faqsCache = signal<Faq[] | null>(null);

  constructor(private http: HttpClient) {}

  getFaqs(): Observable<Faq[]> {
    const cached = this.faqsCache();
    if (cached) {
      return of(cached);
    }

    return this.http.get<ApiResponse<Faq[]>>(this.apiUrl).pipe(
      map(response => response.data || []),
      tap(faqs => this.faqsCache.set(faqs)),
      catchError(error => {
        console.error('Error fetching FAQs:', error);
        return throwError(() => new Error('Failed to load FAQs'));
      })
    );
  }

  clearCache(): void {
    this.faqsCache.set(null);
  }
}
```

**Verification:**
- Service compiles without errors
- Can be injected into components
- Type definitions are correct
- HttpClient is imported from @angular/common/http

---

### 🖼️ FRONTEND COMPONENT REFACTOR

---

#### Task 5.5: Refactor FaqPageComponent to Use API

**Layer:** Frontend / Component
**Estimate:** 1 hour 30 minutes
**Agent:** Angular Expert
**Dependencies:** Task 5.4

**Description:**
Refactor existing FaqPageComponent to remove hardcoded FAQ data and category filtering, then integrate with FaqService to fetch data from API.

**Acceptance Criteria:**
- ✅ Remove `FAQ_ITEMS` hardcoded array
- ✅ Remove `categories` array and category filtering logic
- ✅ Remove `activeCategory` signal
- ✅ Remove `setCategory()` method
- ✅ Remove `filteredFaqs` getter
- ✅ Remove category tabs from HTML template
- ✅ Add `faqs` signal to hold API data
- ✅ Add `loading` signal for loading state
- ✅ Add `error` signal for error state
- ✅ Add `ngOnInit()` to call `loadFaqs()` on page load
- ✅ Add `loadFaqs()` method to fetch FAQs from FaqService
- ✅ Add `retry()` method for error recovery
- ✅ Update HTML template to show loading/error/success states
- ✅ Update component imports (add Title, Meta, FaqService)
- ✅ Add SEO meta tags in `setMetaTags()` method
- ✅ Keep existing `toggleFaq()` accordion logic
- ✅ Keep existing HTML structure (hero, FAQ list, CTA)
- ✅ Keep existing SCSS styles (may need minor adjustments)

**Files to Modify:**
- `frontend/src/app/features/faq/faq-page.component.ts`
- `frontend/src/app/features/faq/faq-page.component.html`
- `frontend/src/app/features/faq/faq-page.component.scss` (optional adjustments)

**TypeScript (faq-page.component.ts):**

```typescript
import { Component, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { FaqService } from '../../core/services/faq.service';
import { Faq } from '../../core/models/faq.model';

@Component({
  selector: 'app-faq-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ScrollRevealDirective],
  templateUrl: './faq-page.component.html',
  styleUrls: ['./faq-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FaqPageComponent implements OnInit {
  faqs = signal<Faq[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  expandedFaqId = signal<number | null>(null);

  constructor(
    private faqService: FaqService,
    private title: Title,
    private meta: Meta
  ) {}

  ngOnInit(): void {
    this.setMetaTags();
    this.loadFaqs();
  }

  loadFaqs(): void {
    this.loading.set(true);
    this.error.set(null);

    this.faqService.getFaqs().subscribe({
      next: (faqs) => {
        this.faqs.set(faqs);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load FAQs. Please try again.');
        this.loading.set(false);
        console.error('Error loading FAQs:', err);
      }
    });
  }

  toggleFaq(faqId: number): void {
    this.expandedFaqId.set(this.expandedFaqId() === faqId ? null : faqId);
  }

  retry(): void {
    this.loadFaqs();
  }

  private setMetaTags(): void {
    this.title.setTitle('Frequently Asked Questions | Velobiz');
    this.meta.updateTag({
      name: 'description',
      content: 'Get answers to common questions about AI automation, deployment timelines, security, integrations, and more.'
    });
    this.meta.updateTag({
      property: 'og:title',
      content: 'Frequently Asked Questions | Velobiz'
    });
    this.meta.updateTag({
      property: 'og:description',
      content: 'Get answers to common questions about AI automation, deployment timelines, security, integrations, and more.'
    });
  }
}
```

**HTML Template Changes (faq-page.component.html):**

Remove category tabs section:
```html
<!-- REMOVE THIS ENTIRE SECTION -->
<div class="faq-tabs">
  @for (category of categories; track category.id) {
    <button class="faq-tab" ...>
      {{ category.label }}
    </button>
  }
</div>
```

Add loading and error states:
```html
<section class="faq-content">
  <div class="faq-content__container">
    
    <!-- Loading State -->
    @if (loading()) {
      <div class="loading-spinner"></div>
    }

    <!-- Error State -->
    @if (error()) {
      <div class="error-state">
        <p>{{ error() }}</p>
        <button (click)="retry()">Retry</button>
      </div>
    }

    <!-- FAQ List -->
    @if (!loading() && !error()) {
      <div class="faq-list">
        @for (faq of faqs(); track faq.id) {
          <article class="faq-item" [class.faq-item--expanded]="expandedFaqId() === faq.id" appScrollReveal>
            <!-- Rest of FAQ item HTML unchanged -->
          </article>
        }
      </div>
    }

  </div>
</section>
```

**SCSS Adjustments (if needed):**

Remove category tab styles (if not used elsewhere):
```scss
// REMOVE (if not used by other components)
.faq-tabs { ... }
.faq-tab { ... }
```

Add loading/error styles (if not already present):
```scss
.loading-spinner {
  width: 48px;
  height: 48px;
  margin: 80px auto;
  border: 4px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-state {
  text-align: center;
  padding: 60px 2rem;

  p {
    font-size: 18px;
    color: #ff5555;
    margin-bottom: 2rem;
  }

  button {
    background: var(--color-accent);
    color: var(--color-bg-primary);
    font-weight: 600;
    padding: 0.75rem 2rem;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: all 300ms ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 229, 160, 0.4);
    }
  }
}
```

**Verification:**
- Page loads without errors
- Loading spinner appears briefly during API call
- 6 FAQs render in correct order (DisplayOrder 1-6)
- No category tabs visible
- Accordion expand/collapse works
- Retry button works on error
- SEO meta tags are set correctly
- No console errors

---

### ✨ TESTING & QA

---

#### Task 5.6: Manual QA and Accessibility Audit

**Layer:** Full Stack / QA
**Estimate:** 45 minutes
**Agent:** Lead Agent
**Dependencies:** Task 5.5

**Description:**
Perform manual testing across devices, browsers, and accessibility tools to ensure the FAQ page works correctly.

**Test Cases:**

- ✅ **Backend API Test (Postman/curl):**
  - GET https://localhost:5001/api/faqs returns 200 OK
  - Response has 6 FAQs
  - FAQs are ordered by DisplayOrder (1-6)
  - All FAQs have IsActive = true

- ✅ **Frontend Integration:**
  - Navigate to http://localhost:4200/faq
  - Page loads without console errors
  - Loading spinner appears briefly
  - 6 FAQs render correctly

- ✅ **Accordion Interaction:**
  - Click FAQ 1 → expands and shows answer
  - Click FAQ 1 again → collapses
  - Click FAQ 2 → FAQ 2 expands (FAQ 1 stays open OR collapses based on design decision)
  - Icon rotates 180deg when expanded

- ✅ **Error Handling:**
  - Stop backend server
  - Refresh page
  - Error message displays: "Failed to load FAQs. Please try again."
  - Retry button appears
  - Click retry → shows loading spinner
  - Start backend server
  - FAQs load successfully after retry

- ✅ **Keyboard Navigation:**
  - Tab through FAQ items
  - Enter/Space toggles expand/collapse
  - Focus indicators are visible

- ✅ **Screen Reader (NVDA/VoiceOver):**
  - Page announces: "Frequently Asked Questions"
  - FAQ items announce: "Button, [Question], collapsed/expanded"
  - Answer content is read when expanded

- ✅ **Responsive Design:**
  - Mobile (375px): Single column, touch-friendly
  - Tablet (768px): Single column, optimized padding
  - Desktop (1024px): Centered, max-width 900px

- ✅ **Performance:**
  - Lighthouse Performance: ≥90
  - Lighthouse Accessibility: ≥90
  - API response time: <500ms
  - Page load time: <2s

- ✅ **Cross-Browser:**
  - Chrome: Works correctly
  - Firefox: Works correctly
  - Safari: Works correctly

**Deliverable:**
- Checklist of all test cases (pass/fail)
- List of any bugs found + severity
- Lighthouse report screenshot

**Verification:**
- All critical bugs fixed
- Lighthouse scores meet targets

---

#### Task 5.7: Build Verification and Linting

**Layer:** Full Stack / CI
**Estimate:** 10 minutes
**Agent:** Lead Agent
**Dependencies:** Task 5.6

**Description:**
Run build and lint commands to ensure code quality and no compilation errors.

**Commands to Run:**

**Backend:**
```bash
cd backend/Velobiz.Api
dotnet build
# Expected: Build succeeded with 0 warnings
```

**Frontend:**
```bash
cd frontend
ng lint
# Expected: All files pass linting

ng build --configuration production
# Expected: Build succeeds, dist/ folder created
```

**Acceptance Criteria:**
- ✅ `dotnet build` succeeds with 0 warnings
- ✅ `ng lint` reports 0 errors
- ✅ `ng build --configuration production` succeeds
- ✅ No unused imports or variables
- ✅ No console.log statements in production code

**Verification:**
- All commands exit with code 0
- Build output folder exists: `frontend/dist/`
- No blocking issues

---

## Task Summary Table

| Task ID | Title | Layer | Agent | Estimate | Status |
|---------|-------|-------|-------|----------|--------|
| 5.1 | Implement FaqRepository.GetAllActiveAsync() | Backend | DotNet Architect | 20 min | ⏸️ Pending |
| 5.2 | Implement FaqService.GetAllActiveFaqsAsync() | Backend | DotNet Architect | 10 min | ⏸️ Pending |
| 5.3 | Update FaqsController.GetAll() | Backend | DotNet Architect | 25 min | ⏸️ Pending |
| 5.4 | Create FaqService and Faq model | Frontend | Angular Expert | 30 min | ⏸️ Pending |
| 5.5 | Refactor FaqPageComponent to use API | Frontend | Angular Expert | 1h 30min | ⏸️ Pending |
| 5.6 | Manual QA and accessibility audit | QA | Lead Agent | 45 min | ⏸️ Pending |
| 5.7 | Build verification and linting | CI | Lead Agent | 10 min | ⏸️ Pending |

**Total: 7 tasks, ~4 hours**

---

## Chunk Strategy

### Chunk 1: Complete FAQ Page Implementation

**Why Single Chunk?**
- No database changes (schema and seed data already exist)
- Backend implementation is simple (repository + service + controller)
- Frontend refactor is straightforward (remove categories, add API integration)
- Small scope (4 hours), can be completed in half a working day
- No complex business logic or integrations

**Agents Involved:**
1. **DotNet Architect** (Tasks 5.1-5.3): 55 minutes
2. **Angular Expert** (Tasks 5.4-5.5): 2 hours
3. **Lead Agent** (Tasks 5.6-5.7): 55 minutes

**Execution Plan:**
1. DotNet Architect completes Tasks 5.1-5.3 (sequential)
2. Angular Expert completes Tasks 5.4-5.5 (sequential, wait for backend)
3. Lead Agent performs QA and build verification (wait for frontend)

**Parallel Opportunities:**
- None (tasks are sequential due to dependencies)

**Review Points:**
- After Task 5.3: Test API endpoint with Postman (verify 6 FAQs returned)
- After Task 5.5: Full integration test (frontend → API → database)
- After Task 5.7: Final review before marking feature complete

---

## Rollback Plan

If a critical bug is discovered:

1. **Backend rollback:**
   - Revert FaqsController, FaqService, FaqRepository to 501 stub state
   - No database changes needed (data remains intact)

2. **Frontend rollback:**
   - Restore hardcoded FAQ_ITEMS array in FaqPageComponent
   - Restore category filtering logic
   - Comment out FaqService.getFaqs() call

3. **Git rollback:**
   - Revert all commits for Feature 5
   - Remove FaqService files (faq.service.ts, faq.model.ts)

---

## Post-Implementation Checklist

Before marking Feature 5 as complete:

- ✅ All 7 tasks completed and verified
- ✅ Backend: FaqRepository.GetAllActiveAsync() queries database successfully
- ✅ Backend: FaqService.GetAllActiveFaqsAsync() delegates to repository
- ✅ Backend: FaqsController.GetAll() returns 200 OK with 6 FAQs
- ✅ Frontend: FaqService created and fetches from API
- ✅ Frontend: FaqPageComponent refactored (no hardcoded data, no categories)
- ✅ Frontend: Loading and error states display correctly
- ✅ Accordion expand/collapse animations work smoothly
- ✅ All 6 FAQs display in correct order (DisplayOrder 1-6)
- ✅ Page is fully responsive (320px, 768px, 1024px)
- ✅ Keyboard navigation works (Tab, Enter/Space)
- ✅ Screen reader announces FAQ state correctly
- ✅ Lighthouse performance ≥90
- ✅ Lighthouse accessibility ≥90
- ✅ No console errors or warnings
- ✅ `dotnet build` succeeds
- ✅ `ng lint` passes
- ✅ `ng build --configuration production` succeeds
- ✅ All code committed to feature branch
- ✅ Ready for `/agent-review` and `/agent-commit`
```

---