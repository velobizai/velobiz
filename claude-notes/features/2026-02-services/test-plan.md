# Test Plan — Services Page

**Feature ID:** FEATURE-3
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

**File:** `backend/VelocityAI.Api.Tests/Repositories/ServicesRepositoryTests.cs`

**Test Cases:**

| Test ID | Test Name | Description | Expected Result |
|---------|-----------|-------------|-----------------|
| BR-01 | GetAllActiveAsync_ReturnsAllActiveServices | Query with 8 active services | Returns 8 services |
| BR-02 | GetAllActiveAsync_FiltersInactiveServices | 6 active, 2 inactive | Returns 6 services |
| BR-03 | GetAllActiveAsync_OrdersByDisplayOrder | Services out of order in DB | Returns services sorted 1-8 |
| BR-04 | GetAllActiveAsync_ReturnsEmptyWhenNoActive | All services inactive | Returns empty list |
| BR-05 | GetAllActiveAsync_UsesNoTracking | Check EF change tracker | Entities not tracked |

**Setup:**
```csharp
private ApplicationDbContext GetInMemoryDbContext()
{
    var options = new DbContextOptionsBuilder<ApplicationDbContext>()
        .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
        .Options;

    var context = new ApplicationDbContext(options);

    // Seed test data
    context.Services.AddRange(
        new Service { Id = 1, Title = "Service 1", Icon = "phone", ShortDescription = "Test", LongDescription = "Test", DisplayOrder = 1, IsActive = true },
        new Service { Id = 2, Title = "Service 2", Icon = "mail", ShortDescription = "Test", LongDescription = "Test", DisplayOrder = 2, IsActive = false }
    );
    context.SaveChanges();

    return context;
}
```

---

### 2. Service Layer Tests

**File:** `backend/VelocityAI.Api.Tests/Services/ServicesServiceTests.cs`

**Test Cases:**

| Test ID | Test Name | Description | Expected Result |
|---------|-----------|-------------|-----------------|
| BS-01 | GetAllActiveServicesAsync_CallsRepository | Verify repository method called | Repository invoked once |
| BS-02 | GetAllActiveServicesAsync_ReturnsRepositoryResult | Returns services from repository | Same list returned |
| BS-03 | GetAllActiveServicesAsync_PropagatesException | Repository throws exception | Exception bubbles up |

**Setup:**
```csharp
[Fact]
public async Task GetAllActiveServicesAsync_CallsRepository()
{
    // Arrange
    var mockRepo = new Mock<IServicesRepository>();
    var expectedServices = new List<Service>
    {
        new Service { Id = 1, Title = "Test", Icon = "phone", ShortDescription = "Test", LongDescription = "Test", DisplayOrder = 1, IsActive = true }
    };
    mockRepo.Setup(r => r.GetAllActiveAsync()).ReturnsAsync(expectedServices);

    var service = new ServicesService(mockRepo.Object);

    // Act
    var result = await service.GetAllActiveServicesAsync();

    // Assert
    result.Should().BeEquivalentTo(expectedServices);
    mockRepo.Verify(r => r.GetAllActiveAsync(), Times.Once);
}
```

---

### 3. Controller Tests

**File:** `backend/VelocityAI.Api.Tests/Controllers/ServicesControllerTests.cs`

**Test Cases:**

| Test ID | Test Name | Description | Expected Result |
|---------|-----------|-------------|-----------------|
| BC-01 | GetAll_ReturnsOk_WhenServicesExist | ✅ Positive: 8 services | 200 OK, ApiResponse.Success = true |
| BC-02 | GetAll_ReturnsEmptyArray_WhenNoServices | ⚠️ Edge: No services | 200 OK, data = [] |
| BC-03 | GetAll_Returns500_WhenServiceThrows | ❌ Negative: Exception | 500 Error, ApiResponse.Success = false |
| BC-04 | GetAll_LogsError_WhenExceptionOccurs | Verify logger called | Logger.LogError invoked |
| BC-05 | GetAll_ReturnsCorrectMessage_OnSuccess | Check response message | Message = "Services retrieved successfully" |

**Setup:**
```csharp
[Fact]
public async Task GetAll_ReturnsOk_WhenServicesExist()
{
    // Arrange
    var mockService = new Mock<IServicesService>();
    var mockLogger = new Mock<ILogger<ServicesController>>();
    var expectedServices = new List<Service>
    {
        new Service { Id = 1, Title = "Test", Icon = "phone", ShortDescription = "Test", LongDescription = "Test", DisplayOrder = 1, IsActive = true }
    };
    mockService.Setup(s => s.GetAllActiveServicesAsync()).ReturnsAsync(expectedServices);

    var controller = new ServicesController(mockService.Object, mockLogger.Object);

    // Act
    var result = await controller.GetAll();

    // Assert
    var okResult = result.Result as OkObjectResult;
    okResult.Should().NotBeNull();
    okResult!.StatusCode.Should().Be(200);

    var apiResponse = okResult.Value as ApiResponse<IEnumerable<Service>>;
    apiResponse.Should().NotBeNull();
    apiResponse!.Success.Should().BeTrue();
    apiResponse.Data.Should().HaveCount(1);
}
```

---

### 4. Integration Tests

**File:** `backend/VelocityAI.Api.Tests/Integration/ServicesEndpointTests.cs`

**Test Cases:**

| Test ID | Test Name | Description | Expected Result |
|---------|-----------|-------------|-----------------|
| BI-01 | GET_Services_Returns200WithData | Full HTTP pipeline test | 200 OK, 8 services in JSON |
| BI-02 | GET_Services_ReturnsCorrectContentType | Check Content-Type header | application/json |
| BI-03 | GET_Services_OrdersByDisplayOrder | Verify sort order | services[0].DisplayOrder < services[1].DisplayOrder |
| BI-04 | GET_Services_OnlyReturnsActiveServices | Seed 6 active, 2 inactive | Returns 6 services |

**Setup:**
```csharp
public class ServicesEndpointTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public ServicesEndpointTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task GET_Services_Returns200WithData()
    {
        // Arrange
        var client = _factory.CreateClient();

        // Act
        var response = await client.GetAsync("/api/services");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var content = await response.Content.ReadAsStringAsync();
        var apiResponse = JsonSerializer.Deserialize<ApiResponse<List<Service>>>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        apiResponse.Should().NotBeNull();
        apiResponse!.Success.Should().BeTrue();
        apiResponse.Data.Should().NotBeNull();
        apiResponse.Data.Should().HaveCount(8);
    }
}
```

---

## Frontend Tests (Deferred)

### 1. ServicesService Tests

**File:** `frontend/src/app/core/services/services.service.spec.ts`

**Test Cases:**

| Test ID | Test Name | Description | Expected Result |
|---------|-----------|-------------|-----------------|
| FS-01 | getServices_FetchesFromAPI_OnFirstCall | ✅ Positive: First call | HTTP GET to /api/services |
| FS-02 | getServices_ReturnsCachedData_OnSecondCall | Cache hit | No HTTP call, returns cached data |
| FS-03 | getServices_UnwrapsApiResponse | Extracts data from ApiResponse | Returns Service[] |
| FS-04 | getServices_ThrowsError_OnHttpFailure | ❌ Negative: 500 error | Observable errors out |
| FS-05 | getServices_LogsError_OnFailure | Console.error called | Error logged to console |
| FS-06 | clearCache_RemovesCachedData | Clear cache, then fetch | HTTP call made on next getServices() |

**Setup:**
```typescript
describe('ServicesService', () => {
  let service: ServicesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ServicesService]
    });

    service = TestBed.inject(ServicesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch services from API on first call', (done) => {
    const mockServices: Service[] = [
      { id: 1, title: 'Test', icon: 'phone', shortDescription: 'Test', longDescription: 'Test', displayOrder: 1, isActive: true }
    ];

    const mockResponse: ApiResponse<Service[]> = {
      success: true,
      data: mockServices,
      message: 'Success'
    };

    service.getServices().subscribe(services => {
      expect(services).toEqual(mockServices);
      done();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/services`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
```

---

### 2. ServiceCardComponent Tests

**File:** `frontend/src/app/features/services/service-card/service-card.component.spec.ts`

**Test Cases:**

| Test ID | Test Name | Description | Expected Result |
|---------|-----------|-------------|-----------------|
| FC-01 | Should_RenderServiceTitle | ✅ Positive: Display title | Title appears in h3 |
| FC-02 | Should_RenderShortDescriptionByDefault | Short desc visible | shortDescription in DOM |
| FC-03 | Should_ShowLongDescription_OnHover | Hover interaction | longDescription visible, short hidden |
| FC-04 | Should_ToggleExpanded_OnMobileTap | Mobile tap | expanded signal toggles |
| FC-05 | Should_RenderLucideIcon | Icon display | lucide-angular component rendered |
| FC-06 | Should_BeKeyboardAccessible | ⚠️ Edge: Enter key | toggleExpanded() called |
| FC-07 | Should_HaveAriaLabel | Accessibility | aria-label attribute present |

**Setup:**
```typescript
describe('ServiceCardComponent', () => {
  let component: ServiceCardComponent;
  let fixture: ComponentFixture<ServiceCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceCardComponent, LucideAngularModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceCardComponent);
    component = fixture.componentInstance;

    component.service = {
      id: 1,
      title: 'Test Service',
      icon: 'phone',
      shortDescription: 'Short test',
      longDescription: 'Long test description',
      displayOrder: 1,
      isActive: true
    };

    fixture.detectChanges();
  });

  it('should render service title', () => {
    const titleElement = fixture.nativeElement.querySelector('.card-title');
    expect(titleElement.textContent).toContain('Test Service');
  });
});
```

---

### 3. ServicesPageComponent Tests

**File:** `frontend/src/app/features/services/services-page.component.spec.ts`

**Test Cases:**

| Test ID | Test Name | Description | Expected Result |
|---------|-----------|-------------|-----------------|
| FP-01 | Should_LoadServices_OnInit | ✅ Positive: ngOnInit | loadServices() called |
| FP-02 | Should_ShowLoadingSpinner_WhileFetching | Loading state | LoadingSpinnerComponent visible |
| FP-03 | Should_RenderServicesGrid_OnSuccess | Success state | 8 ServiceCardComponents rendered |
| FP-04 | Should_ShowErrorMessage_OnFailure | ❌ Negative: API error | Error message displayed |
| FP-05 | Should_RetryOnButtonClick | Retry functionality | loadServices() called again |
| FP-06 | Should_SetMetaTags_OnInit | SEO | Title and description set |
| FP-07 | Should_RenderCTABanner | CTA display | CTA banner with /contact link |
| FP-08 | Should_ApplyScrollRevealDirective | Animation | appScrollReveal on cards |

**Setup:**
```typescript
describe('ServicesPageComponent', () => {
  let component: ServicesPageComponent;
  let fixture: ComponentFixture<ServicesPageComponent>;
  let mockServicesService: jasmine.SpyObj<ServicesService>;

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('ServicesService', ['getServices']);

    await TestBed.configureTestingModule({
      imports: [ServicesPageComponent],
      providers: [
        { provide: ServicesService, useValue: serviceSpy }
      ]
    }).compileComponents();

    mockServicesService = TestBed.inject(ServicesService) as jasmine.SpyObj<ServicesService>;
    fixture = TestBed.createComponent(ServicesPageComponent);
    component = fixture.componentInstance;
  });

  it('should load services on init', () => {
    const mockServices: Service[] = [
      { id: 1, title: 'Test', icon: 'phone', shortDescription: 'Test', longDescription: 'Test', displayOrder: 1, isActive: true }
    ];
    mockServicesService.getServices.and.returnValue(of(mockServices));

    fixture.detectChanges(); // Triggers ngOnInit

    expect(mockServicesService.getServices).toHaveBeenCalled();
    expect(component.services()).toEqual(mockServices);
    expect(component.loading()).toBe(false);
  });
});
```

---

## Manual QA Tests (Deferred)

### Browser Compatibility

| Browser | Version | OS | Status |
|---------|---------|----|---------|
| Chrome | Latest | Windows 11 | ⏸️ Pending |
| Chrome | Latest | macOS | ⏸️ Pending |
| Firefox | Latest | Windows 11 | ⏸️ Pending |
| Safari | Latest | macOS | ⏸️ Pending |
| Safari | Latest | iOS 16+ | ⏸️ Pending |
| Edge | Latest | Windows 11 | ⏸️ Pending |

### Responsive Testing

| Viewport | Resolution | Expected Layout | Status |
|----------|------------|-----------------|--------|
| Mobile (Portrait) | 375x667 | 1 column, tap to expand | ⏸️ Pending |
| Mobile (Landscape) | 667x375 | 1 column | ⏸️ Pending |
| Tablet (Portrait) | 768x1024 | 2 columns | ⏸️ Pending |
| Tablet (Landscape) | 1024x768 | 3 columns | ⏸️ Pending |
| Desktop HD | 1920x1080 | 3 columns | ⏸️ Pending |
| Desktop 4K | 3840x2160 | 3 columns, scales well | ⏸️ Pending |

### Accessibility Testing

| Test | Tool | Expected Result | Status |
|------|------|-----------------|--------|
| Keyboard Navigation | Manual | All cards reachable via Tab | ⏸️ Pending |
| Screen Reader | NVDA/VoiceOver | Cards announce title + description | ⏸️ Pending |
| Focus Indicators | Manual | Visible focus ring on cards | ⏸️ Pending |
| Color Contrast | Wave | WCAG AA compliance | ⏸️ Pending |
| ARIA Labels | axe DevTools | No violations | ⏸️ Pending |
| Reduced Motion | Browser setting | Animations disabled | ⏸️ Pending |

### Performance Testing

| Metric | Tool | Target | Status |
|--------|------|--------|--------|
| Lighthouse Performance | Chrome DevTools | ≥90 | ⏸️ Pending |
| Lighthouse Accessibility | Chrome DevTools | ≥90 | ⏸️ Pending |
| Lighthouse SEO | Chrome DevTools | ≥90 | ⏸️ Pending |
| First Contentful Paint | Lighthouse | <1.5s | ⏸️ Pending |
| Time to Interactive | Lighthouse | <3s | ⏸️ Pending |
| Cumulative Layout Shift | Lighthouse | 0 | ⏸️ Pending |
| API Response Time | Network tab | <200ms | ⏸️ Pending |

### User Flows

| Flow | Steps | Expected Result | Status |
|------|-------|-----------------|--------|
| View Services | 1. Navigate to /services<br>2. Wait for load | 8 service cards displayed | ⏸️ Pending |
| Hover Card (Desktop) | 1. Hover over card<br>2. Observe | Long description revealed, card lifts | ⏸️ Pending |
| Tap Card (Mobile) | 1. Tap card<br>2. Tap again | Long desc shows, then hides | ⏸️ Pending |
| Click CTA | 1. Scroll to bottom<br>2. Click "Get Started" | Navigate to /contact | ⏸️ Pending |
| Retry on Error | 1. Disconnect Wi-Fi<br>2. Navigate to /services<br>3. Reconnect<br>4. Click Retry | Services load successfully | ⏸️ Pending |

---

## Test Coverage Goals (When Implemented)

### Backend Coverage

| Layer | Target Coverage | Critical Paths |
|-------|-----------------|----------------|
| Controllers | 90%+ | GET /api/services (success + error) |
| Services | 100% | All business logic methods |
| Repositories | 90%+ | GetAllActiveAsync with various data states |
| Models | N/A | No logic, just properties |

### Frontend Coverage

| Layer | Target Coverage | Critical Paths |
|-------|-----------------|----------------|
| Components | 80%+ | Service fetch, loading/error states, render logic |
| Services | 90%+ | HTTP calls, caching, error handling |
| Directives | N/A | ScrollRevealDirective tested in Feature 0 |

---

## Test Execution Plan (Future)

When user requests test implementation:

1. **Phase 1: Backend Tests (2 hours)**
   - Repository tests (30 min)
   - Service tests (20 min)
   - Controller tests (40 min)
   - Integration tests (30 min)

2. **Phase 2: Frontend Tests (2 hours)**
   - ServicesService tests (40 min)
   - ServiceCardComponent tests (40 min)
   - ServicesPageComponent tests (40 min)

3. **Phase 3: Manual QA (1 hour)**
   - Browser testing (20 min)
   - Responsive testing (15 min)
   - Accessibility audit (15 min)
   - Performance audit (10 min)

**Total Estimated Time: 5 hours**

---

## Test Data

### Mock Services (for tests)

```typescript
const MOCK_SERVICES: Service[] = [
  {
    id: 1,
    title: 'Test Service 1',
    icon: 'phone',
    shortDescription: 'Short description for testing',
    longDescription: 'Long description for testing with more detail',
    displayOrder: 1,
    isActive: true
  },
  {
    id: 2,
    title: 'Test Service 2',
    icon: 'mail',
    shortDescription: 'Another short description',
    longDescription: 'Another long description',
    displayOrder: 2,
    isActive: false // Inactive for filtering tests
  }
];
```

---

## Conclusion

This test plan is **deferred** per user instruction. When the user requests test implementation, this document provides a comprehensive guide for:

- ✅ What to test (20+ backend tests, 15+ frontend tests, 30+ manual QA checks)
- ✅ How to test (setup code, assertions, tools)
- ✅ Coverage targets (80%+ overall, 90%+ for services/repositories)
- ✅ Test data (mock services, test fixtures)

**For now, proceed to `/agent-build` and implement Feature 3 WITHOUT writing tests.**
