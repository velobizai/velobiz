# Test Plan — FAQ Page

**Feature ID:** FEATURE-5
**Test Strategy:** Deferred (per user instruction)
**Coverage Target:** 80%+ (when tests are implemented)

---

## ⚠️ IMPORTANT NOTE

Per user instruction in CLAUDE.md:
> "No tests or documentation until all the features gets developed. If I want, I will ask manually to do so. For now, just focus on DEVELOPING features ONLY."

**This test plan outlines what WILL BE tested** when the user requests test implementation. For now, **test execution is deferred** and this feature will proceed to implementation without writing tests.

---

## Test Strategy

When testing is enabled, this feature will include:

1. **Backend Unit Tests** (xUnit + Moq + FluentAssertions)
2. **Backend Integration Tests** (WebApplicationFactory + EF Core InMemory)
3. **Frontend Unit Tests** (Jasmine + Karma + Angular TestBed)
4. **Frontend Service Tests** (HttpClientTestingModule)
5. **Manual QA Tests** (cross-browser, responsive, accessibility)

---

## Backend Tests (Deferred)

### 1. Repository Tests

**File:** `backend/VelocityAI.Api.Tests/Repositories/FaqRepositoryTests.cs`

**Test Cases:**

| Test ID | Test Name | Description | Expected Result |
|---------|-----------|-------------|-----------------|
| BR-01 | GetAllActiveAsync_ReturnsAllActiveFaqs | Query with 6 active FAQs | Returns 6 FAQs |
| BR-02 | GetAllActiveAsync_FiltersInactiveFaqs | 4 active, 2 inactive | Returns 4 FAQs |
| BR-03 | GetAllActiveAsync_OrdersByDisplayOrder | FAQs out of order in DB | Returns FAQs sorted 1-6 |
| BR-04 | GetAllActiveAsync_ReturnsEmptyWhenNoActive | All FAQs inactive | Returns empty list |
| BR-05 | GetAllActiveAsync_UsesNoTracking | Check EF change tracker | Entities not tracked |

**Example Test:**

```csharp
[Fact]
public async Task GetAllActiveAsync_ReturnsAllActiveFaqs()
{
    // Arrange
    var context = GetInMemoryDbContext();
    var repository = new FaqRepository(context);

    // Act
    var result = await repository.GetAllActiveAsync();

    // Assert
    result.Should().HaveCount(6);
    result.Should().BeInAscendingOrder(f => f.DisplayOrder);
    result.Should().AllSatisfy(f => f.IsActive.Should().BeTrue());
}
```

---

### 2. Service Layer Tests

**File:** `backend/VelocityAI.Api.Tests/Services/FaqServiceTests.cs`

**Test Cases:**

| Test ID | Test Name | Description | Expected Result |
|---------|-----------|-------------|-----------------|
| BS-01 | GetAllActiveFaqsAsync_CallsRepository | Verify repository method called | Repository invoked once |
| BS-02 | GetAllActiveFaqsAsync_ReturnsRepositoryResult | Returns FAQs from repository | Same list returned |
| BS-03 | GetAllActiveFaqsAsync_PropagatesException | Repository throws exception | Exception bubbles up |

**Example Test:**

```csharp
[Fact]
public async Task GetAllActiveFaqsAsync_CallsRepository()
{
    // Arrange
    var mockRepo = new Mock<IFaqRepository>();
    var expectedFaqs = new List<Faq>
    {
        new Faq { Id = 1, Question = "Test?", Answer = "Test.", DisplayOrder = 1, IsActive = true }
    };
    mockRepo.Setup(r => r.GetAllActiveAsync()).ReturnsAsync(expectedFaqs);
    var service = new FaqService(mockRepo.Object);

    // Act
    var result = await service.GetAllActiveFaqsAsync();

    // Assert
    result.Should().BeEquivalentTo(expectedFaqs);
    mockRepo.Verify(r => r.GetAllActiveAsync(), Times.Once);
}
```

---

### 3. Controller Tests

**File:** `backend/VelocityAI.Api.Tests/Controllers/FaqsControllerTests.cs`

**Test Cases:**

| Test ID | Test Name | Description | Expected Result |
|---------|-----------|-------------|-----------------|
| BC-01 | GetAll_ReturnsOkWithFaqs | Service returns 6 FAQs | 200 OK, ApiResponse with 6 FAQs |
| BC-02 | GetAll_ReturnsEmptyListWhenNoFaqs | Service returns empty list | 200 OK, ApiResponse with empty array |
| BC-03 | GetAll_Returns500OnException | Service throws exception | 500 Error, ApiResponse with error message |
| BC-04 | GetAll_LogsErrorOnException | Service throws exception | Logger.LogError called once |

**Example Test:**

```csharp
[Fact]
public async Task GetAll_ReturnsOkWithFaqs()
{
    // Arrange
    var mockService = new Mock<IFaqService>();
    var mockLogger = new Mock<ILogger<FaqsController>>();
    var expectedFaqs = new List<Faq>
    {
        new Faq { Id = 1, Question = "Test?", Answer = "Test.", DisplayOrder = 1, IsActive = true }
    };
    mockService.Setup(s => s.GetAllActiveFaqsAsync()).ReturnsAsync(expectedFaqs);
    var controller = new FaqsController(mockService.Object, mockLogger.Object);

    // Act
    var result = await controller.GetAll();

    // Assert
    result.Result.Should().BeOfType<OkObjectResult>();
    var okResult = result.Result as OkObjectResult;
    var apiResponse = okResult!.Value as ApiResponse<IEnumerable<Faq>>;
    apiResponse!.Success.Should().BeTrue();
    apiResponse.Data.Should().HaveCount(1);
}
```

---

### 4. Integration Tests

**File:** `backend/VelocityAI.Api.Tests/Integration/FaqsApiTests.cs`

**Test Cases:**

| Test ID | Test Name | Description | Expected Result |
|---------|-----------|-------------|-----------------|
| BI-01 | GetFaqs_ReturnsOkWithFaqs | GET /api/faqs with seeded DB | 200 OK, 6 FAQs in response |
| BI-02 | GetFaqs_ReturnsJsonContentType | GET /api/faqs | Content-Type: application/json |
| BI-03 | GetFaqs_FaqsOrderedByDisplayOrder | GET /api/faqs | FAQs sorted 1-6 |

**Example Test:**

```csharp
[Fact]
public async Task GetFaqs_ReturnsOkWithFaqs()
{
    // Arrange
    var client = _factory.CreateClient();

    // Act
    var response = await client.GetAsync("/api/faqs");

    // Assert
    response.StatusCode.Should().Be(HttpStatusCode.OK);
    var content = await response.Content.ReadAsStringAsync();
    var apiResponse = JsonSerializer.Deserialize<ApiResponse<List<Faq>>>(content);
    apiResponse!.Success.Should().BeTrue();
    apiResponse.Data.Should().HaveCount(6);
}
```

---

## Frontend Tests (Deferred)

### 1. FaqService Tests

**File:** `frontend/src/app/core/services/faq.service.spec.ts`

**Test Cases:**

| Test ID | Test Name | Description | Expected Result |
|---------|-----------|-------------|-----------------|
| FS-01 | getFaqs_FetchesFromApi | First call | HTTP GET to /api/faqs |
| FS-02 | getFaqs_ReturnsCachedData | Second call | No HTTP request, returns cached data |
| FS-03 | getFaqs_UnwrapsApiResponse | API returns ApiResponse | Returns data array only |
| FS-04 | getFaqs_HandlesError | API returns 500 | Throws error, logs to console |
| FS-05 | clearCache_ClearsCache | Call clearCache() then getFaqs() | Makes new HTTP request |

**Example Test:**

```typescript
it('should fetch FAQs from API', (done) => {
  const mockFaqs: Faq[] = [
    { id: 1, question: 'Test?', answer: 'Test.', displayOrder: 1, isActive: true }
  ];

  const mockResponse: ApiResponse<Faq[]> = {
    success: true,
    data: mockFaqs,
    message: 'Success'
  };

  service.getFaqs().subscribe(faqs => {
    expect(faqs).toEqual(mockFaqs);
    done();
  });

  const req = httpMock.expectOne(`${environment.apiUrl}/faqs`);
  expect(req.request.method).toBe('GET');
  req.flush(mockResponse);
});
```

---

### 2. FaqPageComponent Tests

**File:** `frontend/src/app/features/faq/faq-page.component.spec.ts`

**Test Cases:**

| Test ID | Test Name | Description | Expected Result |
|---------|-----------|-------------|-----------------|
| FC-01 | ngOnInit_LoadsFaqs | Component initialization | loadFaqs() called |
| FC-02 | loadFaqs_SetsLoadingState | API call in progress | loading() = true |
| FC-03 | loadFaqs_SetsSuccessState | API returns FAQs | faqs() populated, loading() = false |
| FC-04 | loadFaqs_SetsErrorState | API returns error | error() set, loading() = false |
| FC-05 | toggleFaq_ExpandsFaq | Click FAQ 1 | expandedFaqId() = 1 |
| FC-06 | toggleFaq_CollapsesFaq | Click FAQ 1 twice | expandedFaqId() = null |
| FC-07 | retry_CallsLoadFaqs | Click retry button | loadFaqs() called again |
| FC-08 | setMetaTags_SetsTitle | Component init | Page title = "Frequently Asked Questions | VelocityAI" |

**Example Test:**

```typescript
it('should load FAQs on init', () => {
  const mockFaqs: Faq[] = [
    { id: 1, question: 'Test?', answer: 'Test.', displayOrder: 1, isActive: true }
  ];

  faqService.getFaqs.and.returnValue(of(mockFaqs));

  component.ngOnInit();

  expect(component.loading()).toBe(false);
  expect(component.faqs()).toEqual(mockFaqs);
  expect(component.error()).toBeNull();
});
```

---

## Manual QA Test Cases (Required)

### Functional Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| MQ-01 | FAQ page loads successfully | Navigate to /faq | Page loads, 6 FAQs visible |
| MQ-02 | Loading spinner appears | Refresh page | Spinner shows briefly during load |
| MQ-03 | Accordion expands on click | Click FAQ 1 question | Answer reveals with animation |
| MQ-04 | Accordion collapses on re-click | Click FAQ 1 again | Answer hides with animation |
| MQ-05 | Icon rotates when expanded | Click FAQ 1 | Icon rotates 180deg |
| MQ-06 | Error state displays on failure | Stop backend, refresh page | Error message + Retry button shown |
| MQ-07 | Retry button works | Click Retry | Loading spinner → FAQs load |
| MQ-08 | CTA button links to contact | Click "Contact Us" | Navigates to /contact |

---

### Responsive Design Tests

| Test ID | Test Case | Viewport | Expected Result |
|---------|-----------|----------|-----------------|
| MR-01 | Mobile layout (320px) | iPhone SE | Single column, text readable, no horizontal scroll |
| MR-02 | Mobile layout (375px) | iPhone 12 | Single column, touch targets ≥44px |
| MR-03 | Tablet layout (768px) | iPad | Single column, optimized padding |
| MR-04 | Desktop layout (1024px) | Desktop | Centered, max-width 900px |
| MR-05 | Large desktop (1440px) | Large monitor | Content centered, no stretching |

---

### Accessibility Tests

| Test ID | Test Case | Tool | Expected Result |
|---------|-----------|------|-----------------|
| MA-01 | Keyboard navigation | Tab key | Can focus all FAQ items |
| MA-02 | Keyboard toggle | Enter/Space | Toggles expand/collapse |
| MA-03 | Focus indicators | Visual inspection | Clear focus outline on all interactive elements |
| MA-04 | Screen reader support | NVDA/VoiceOver | Announces question, answer, expanded state |
| MA-05 | ARIA attributes | DevTools | aria-expanded, role="button" present |
| MA-06 | Color contrast | Lighthouse/axe | All text meets WCAG AA (4.5:1) |
| MA-07 | Reduced motion | Set prefers-reduced-motion | Animations disabled/reduced |

---

### Performance Tests

| Test ID | Test Case | Tool | Expected Result |
|---------|-----------|------|-----------------|
| MP-01 | Lighthouse Performance | Chrome Lighthouse | Score ≥90 |
| MP-02 | Lighthouse Accessibility | Chrome Lighthouse | Score ≥90 |
| MP-03 | API response time | Network tab | <500ms |
| MP-04 | Page load time (3G) | Lighthouse throttled | <2 seconds |
| MP-05 | Animation frame rate | Performance tab | 60 FPS, no jank |

---

### Cross-Browser Tests

| Test ID | Browser | Expected Result |
|---------|---------|-----------------|
| MB-01 | Chrome (latest) | All features work correctly |
| MB-02 | Firefox (latest) | All features work correctly |
| MB-03 | Safari (macOS) | All features work correctly |
| MB-04 | Safari (iOS) | Touch interactions work, layout correct |
| MB-05 | Edge (latest) | All features work correctly |

---

## Test Data

### Seed Data for Tests

```csharp
private static List<Faq> GetTestFaqs()
{
    return new List<Faq>
    {
        new Faq { Id = 1, Question = "Question 1?", Answer = "Answer 1.", DisplayOrder = 1, IsActive = true },
        new Faq { Id = 2, Question = "Question 2?", Answer = "Answer 2.", DisplayOrder = 2, IsActive = true },
        new Faq { Id = 3, Question = "Question 3?", Answer = "Answer 3.", DisplayOrder = 3, IsActive = false },
    };
}
```

---

## Test Execution Plan (When Enabled)

1. **Backend Unit Tests:** `dotnet test` (should run in <5 seconds)
2. **Frontend Unit Tests:** `ng test --watch=false --browsers=ChromeHeadless` (should run in <30 seconds)
3. **Backend Integration Tests:** `dotnet test --filter FullyQualifiedName~Integration` (should run in <10 seconds)
4. **Manual QA:** Complete all MQ, MR, MA, MP, MB test cases (estimate: 1 hour)
5. **Lighthouse Audit:** Run on /faq page (estimate: 5 minutes)
6. **Accessibility Audit:** Run axe DevTools + screen reader test (estimate: 15 minutes)

---

## Coverage Target

**Backend:**
- Repository: 100% coverage (simple LINQ query)
- Service: 100% coverage (single method delegation)
- Controller: 80%+ coverage (happy path + error handling)

**Frontend:**
- FaqService: 80%+ coverage (API call + caching + error handling)
- FaqPageComponent: 80%+ coverage (lifecycle + user interactions)

**Overall Target:** 80%+

---

## Acceptance Criteria for Test Plan

When tests are implemented, verify:

- ✅ All backend unit tests pass
- ✅ All frontend unit tests pass
- ✅ All integration tests pass
- ✅ Code coverage ≥80%
- ✅ All manual QA test cases pass
- ✅ Lighthouse performance ≥90
- ✅ Lighthouse accessibility ≥90
- ✅ No console errors or warnings
- ✅ Cross-browser compatibility verified
```

---

### Critical Files for Implementation

Based on the comprehensive exploration and planning, here are the 5 most critical files for implementing Feature 5: FAQ Page:

1. **C:\Users\jparekh\project\RND\Agency\Website\backend\VelocityAI.Api\Repositories\FaqRepository.cs**
   - Reason: Core data access logic to implement — needs GetAllActiveAsync() method to query FAQs from database

2. **C:\Users\jparekh\project\RND\Agency\Website\backend\VelocityAI.Api\Controllers\FaqsController.cs**
   - Reason: API endpoint to implement — replace 501 stub with full implementation using service layer and ApiResponse wrapper

3. **C:\Users\jparekh\project\RND\Agency\Website\frontend\src\app\core\services\faq.service.ts**
   - Reason: NEW FILE to create — Angular service for fetching FAQs from API with signal-based caching

4. **C:\Users\jparekh\project\RND\Agency\Website\frontend\src\app\features\faq\faq-page.component.ts**
   - Reason: Major refactor required — remove hardcoded FAQ data (12 FAQs), remove category filtering, integrate with FaqService to fetch 6 FAQs from API

5. **C:\Users\jparekh\project\RND\Agency\Website\frontend\src\app\features\faq\faq-page.component.html**
   - Reason: Template refactor required — remove category tabs section, add loading/error states, update FAQ list to use API data

---

## Summary

I have generated comprehensive specification files for Feature 5: FAQ Page, following the same structure and quality level as the Services feature. The specifications cover:

1. **requirements.md** - Complete user stories, functional/non-functional requirements, acceptance criteria
2. **design.md** - Detailed component breakdown, visual design, animations, accessibility features
3. **api-contract.md** - Full API specification for GET /api/faqs with implementation code
4. **db-schema.md** - Database schema documentation (already complete, no changes needed)
5. **tasks.md** - 7 implementation tasks with estimates, dependencies, and detailed instructions
6. **test-plan.md** - Comprehensive test strategy (deferred per user instruction)

**Key Finding:** The backend structure is ready (entities, DI registration, seed data) but all methods throw NotImplementedException. This is actually beneficial as the scaffolding is complete and just needs implementation.

**Implementation Scope:** 4-5 hours total, single chunk, primarily backend method implementation and frontend refactoring (removing hardcoded data/categories, adding API integration).

agentId: a1756c7 (for resuming to continue this agent's work if needed)
<usage>total_tokens: 96621
tool_uses: 38
duration_ms: 552312</usage>