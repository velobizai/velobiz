# Skill: Test Generation Patterns

## Purpose
Generate consistent, high-quality tests for both .NET (xUnit) and Angular (Jasmine) following the project's testing standards.

## Pattern: xUnit Test Class Structure
```csharp
using FluentAssertions;
using Moq;
using Xunit;

namespace {{ServiceName}}.Tests.{{Layer}};

public class {{ClassName}}Tests
{
    // Dependencies
    private readonly Mock<IDependency> _dependencyMock;
    private readonly {{ClassName}} _sut;

    public {{ClassName}}Tests()
    {
        _dependencyMock = new Mock<IDependency>();
        _sut = new {{ClassName}}(_dependencyMock.Object);
    }

    // ✅ POSITIVE: Happy path
    [Fact]
    public async Task {{Method}}_WithValidInput_Returns{{Expected}}()
    {
        // Arrange
        // Act
        // Assert
    }

    // ❌ NEGATIVE: Error handling
    [Fact]
    public async Task {{Method}}_WithInvalidInput_Throws{{Exception}}()
    {
        // Arrange
        // Act
        var act = () => _sut.{{Method}}(invalidInput);

        // Assert
        await act.Should().ThrowAsync<{{Exception}}>();
    }

    // 🚫 EDGE CASE: Null/empty/boundary
    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public async Task {{Method}}_WithNullOrEmptyInput_ThrowsArgumentException(string? input)
    {
        // Arrange
        // Act & Assert
        var act = () => _sut.{{Method}}(input!);
        await act.Should().ThrowAsync<ArgumentException>();
    }
}
```

## Pattern: Angular Component Test
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

describe('{{ComponentName}}', () => {
  let component: {{ComponentName}};
  let fixture: ComponentFixture<{{ComponentName}}>;
  let serviceSpy: jasmine.SpyObj<{{ServiceName}}>;

  beforeEach(async () => {
    serviceSpy = jasmine.createSpyObj('{{ServiceName}}', ['getItems', 'createItem']);

    await TestBed.configureTestingModule({
      imports: [{{ComponentName}}, HttpClientTestingModule],
      providers: [{ provide: {{ServiceName}}, useValue: serviceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent({{ComponentName}});
    component = fixture.componentInstance;
  });

  // ✅ POSITIVE: Renders with data
  it('should display items when data is loaded', () => {
    serviceSpy.getItems.and.returnValue(of([{ id: 1, name: 'Test Item' }]));
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('[data-testid="item"]');
    expect(items.length).toBe(1);
    expect(items[0].textContent).toContain('Test Item');
  });

  // ❌ NEGATIVE: Handles errors
  it('should show error message when API fails', () => {
    serviceSpy.getItems.and.returnValue(throwError(() => new Error('Server Error')));
    fixture.detectChanges();

    const error = fixture.nativeElement.querySelector('[data-testid="error-state"]');
    expect(error).toBeTruthy();
  });

  // 🚫 EDGE CASE: Empty data
  it('should show empty state when no items exist', () => {
    serviceSpy.getItems.and.returnValue(of([]));
    fixture.detectChanges();

    const empty = fixture.nativeElement.querySelector('[data-testid="empty-state"]');
    expect(empty).toBeTruthy();
  });
});
```

## Pattern: Angular Service Test
```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('{{ServiceName}}', () => {
  let service: {{ServiceName}};
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{{ServiceName}}]
    });
    service = TestBed.inject({{ServiceName}});
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify()); // Ensure no outstanding requests

  it('should fetch items successfully', () => {
    const mockItems = [{ id: 1, name: 'Test' }];
    service.getItems().subscribe(items => {
      expect(items).toEqual(mockItems);
    });
    const req = httpMock.expectOne('/api/v1/items');
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockItems });
  });

  it('should handle server error', () => {
    service.getItems().subscribe({
      error: (err) => expect(err.status).toBe(500)
    });
    const req = httpMock.expectOne('/api/v1/items');
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
  });
});
```

## Coverage Checklist
For every production class, verify tests cover:
- [ ] Happy path (valid input → expected output)
- [ ] Validation failure (invalid input → proper error)
- [ ] Not found (missing resource → 404 or null)
- [ ] Null/empty input (boundary → proper handling)
- [ ] Authorization (unauthorized → 401/403)
- [ ] Concurrent access (if applicable → proper conflict handling)
