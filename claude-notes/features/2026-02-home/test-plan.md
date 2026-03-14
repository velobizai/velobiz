# Test Plan — FEATURE 2: Home / Landing Page

**Feature ID:** 2026-02-home
**Feature Name:** Home / Landing Page
**Date:** 2026-02-20
**Status:** Specification Complete

---

## Overview

This test plan covers all testing requirements for Feature 2: Home / Landing Page, including unit tests, accessibility tests, performance tests, and visual regression tests.

**Test Coverage Target:** ≥80% code coverage
**Minimum Test Count:** 20 unit tests across all components

---

## Test Categories

### 1. Unit Tests (Angular Components)
### 2. Accessibility Tests (WCAG 2.1 AA)
### 3. Performance Tests (Lighthouse CI)
### 4. Visual Regression Tests (Multiple Breakpoints)
### 5. Integration Tests (Routing)

---

## 1. Unit Tests

### 1.1 HomePageComponent

**File:** `frontend/src/app/features/home/home-page/home-page.component.spec.ts`

#### Test Cases

| Test ID | Test Description | Category | Expected Result |
|---------|------------------|----------|-----------------|
| HOME-1.1 | ✅ Component creates successfully | Positive | Component instance is truthy |
| HOME-1.2 | ✅ Renders all 5 child components | Positive | Hero, StatsBar, Process, Industries, CtaBanner present in template |
| HOME-1.3 | ✅ Uses OnPush change detection | Positive | ChangeDetectionStrategy is OnPush |
| HOME-1.4 | ✅ Wraps content in semantic `<main>` tag | Positive | Main element exists in compiled HTML |

**Example Test:**
```typescript
describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all 5 child components', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-hero')).toBeTruthy();
    expect(compiled.querySelector('app-stats-bar')).toBeTruthy();
    expect(compiled.querySelector('app-process')).toBeTruthy();
    expect(compiled.querySelector('app-industries')).toBeTruthy();
    expect(compiled.querySelector('app-cta-banner')).toBeTruthy();
  });

  it('should use OnPush change detection', () => {
    expect(component).toBeDefined();
    // Check ChangeDetectionStrategy is OnPush via component metadata
  });

  it('should wrap content in semantic main tag', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('main.home-page')).toBeTruthy();
  });
});
```

---

### 1.2 HeroComponent

**File:** `frontend/src/app/features/home/hero/hero.component.spec.ts`

#### Test Cases

| Test ID | Test Description | Category | Expected Result |
|---------|------------------|----------|-----------------|
| HERO-1.1 | ✅ Component creates successfully | Positive | Component instance is truthy |
| HERO-1.2 | ✅ Renders animated badge with correct text | Positive | Badge text is "Trusted by 100+ businesses" |
| HERO-1.3 | ✅ Renders headline with correct text | Positive | Headline is "AI Automation that Accelerates Your Business" |
| HERO-1.4 | ✅ Renders subheading with correct text | Positive | Subheading matches expected content |
| HERO-1.5 | ✅ Primary CTA button routes to /contact | Positive | routerLink attribute is "/contact" |
| HERO-1.6 | ✅ Secondary CTA button routes to /services | Positive | routerLink attribute is "/services" |
| HERO-1.7 | ✅ Renders 3 glow orbs | Positive | 3 elements with class "glow-orb" exist |
| HERO-1.8 | ✅ Renders grid overlay | Positive | Element with class "grid-overlay" exists |
| HERO-1.9 | ✅ Renders scroll indicator | Positive | Element with class "scroll-indicator" exists |
| HERO-1.10 | ✅ CTA buttons have correct ARIA labels | Positive | aria-label attributes are descriptive |

**Example Test:**
```typescript
describe('HeroComponent', () => {
  let component: HeroComponent;
  let fixture: ComponentFixture<HeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroComponent, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render animated badge with correct text', () => {
    const compiled = fixture.nativeElement;
    const badge = compiled.querySelector('.hero-badge');
    expect(badge.textContent).toContain('Trusted by 100+ businesses');
  });

  it('should render headline with correct text', () => {
    const compiled = fixture.nativeElement;
    const headline = compiled.querySelector('.hero-headline');
    expect(headline.textContent).toContain('AI Automation that Accelerates Your Business');
  });

  it('should have primary CTA button routing to /contact', () => {
    const compiled = fixture.nativeElement;
    const primaryBtn = compiled.querySelector('.btn-primary');
    expect(primaryBtn.getAttribute('routerLink')).toBe('/contact');
  });

  it('should have secondary CTA button routing to /services', () => {
    const compiled = fixture.nativeElement;
    const secondaryBtn = compiled.querySelector('.btn-secondary');
    expect(secondaryBtn.getAttribute('routerLink')).toBe('/services');
  });

  it('should render 3 glow orbs', () => {
    const compiled = fixture.nativeElement;
    const glowOrbs = compiled.querySelectorAll('.glow-orb');
    expect(glowOrbs.length).toBe(3);
  });
});
```

---

### 1.3 StatsBarComponent

**File:** `frontend/src/app/features/home/stats-bar/stats-bar.component.spec.ts`

#### Test Cases

| Test ID | Test Description | Category | Expected Result |
|---------|------------------|----------|-----------------|
| STATS-1.1 | ✅ Component creates successfully | Positive | Component instance is truthy |
| STATS-1.2 | ✅ Renders 4 stat items | Positive | 4 elements with class "stat-item" exist |
| STATS-1.3 | ✅ Counter animation counts from 0 to target value | Positive | animateValue() updates Signal correctly |
| STATS-1.4 | ✅ Large numbers formatted with "M" suffix | Positive | 2,000,000 becomes "2.0M+" |
| STATS-1.5 | ✅ Animation triggers only once | Positive | hasAnimated Signal prevents re-trigger |
| STATS-1.6 | ✅ IntersectionObserver detects viewport entry | Positive | Mock IntersectionObserver triggers animation |
| STATS-1.7 | 🚫 Handles zero values gracefully | Edge | 0 displays as "0" without errors |
| STATS-1.8 | 🚫 Handles missing format property | Edge | Stats without format display raw number |

**Example Test:**
```typescript
describe('StatsBarComponent', () => {
  let component: StatsBarComponent;
  let fixture: ComponentFixture<StatsBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsBarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(StatsBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render 4 stat items', () => {
    const compiled = fixture.nativeElement;
    const statItems = compiled.querySelectorAll('.stat-item');
    expect(statItems.length).toBe(4);
  });

  it('should format large numbers with M suffix', () => {
    const stat = { value: 2000000, suffix: '+', label: 'Hours Saved', format: 'M' as const };
    component.animatedValues.update(values => {
      const newValues = new Map(values);
      newValues.set('Hours Saved', 2000000);
      return newValues;
    });

    const formatted = component.animatedValue(stat);
    expect(formatted).toBe('2.0M');
  });

  it('should trigger animation only once', () => {
    component.hasAnimated.set(false);

    // First trigger
    component.animateCounters();
    expect(component.hasAnimated()).toBe(true);

    // Second trigger should not re-animate
    spyOn(component, 'animateValue');
    component.ngAfterViewInit(); // Simulate re-entry
    expect(component.animateValue).not.toHaveBeenCalled();
  });

  it('should handle zero values gracefully', () => {
    const stat = { value: 0, suffix: '', label: 'Test' };
    component.animatedValues.update(values => {
      const newValues = new Map(values);
      newValues.set('Test', 0);
      return newValues;
    });

    const formatted = component.animatedValue(stat);
    expect(formatted).toBe('0');
  });
});
```

---

### 1.4 ProcessComponent

**File:** `frontend/src/app/features/home/process/process.component.spec.ts`

#### Test Cases

| Test ID | Test Description | Category | Expected Result |
|---------|------------------|----------|-----------------|
| PROC-1.1 | ✅ Component creates successfully | Positive | Component instance is truthy |
| PROC-1.2 | ✅ Renders section heading "How It Works" | Positive | Section heading text matches |
| PROC-1.3 | ✅ Renders all 4 process steps | Positive | 4 elements with class "process-step" exist |
| PROC-1.4 | ✅ Each step has correct number, title, description | Positive | All step content matches PROCESS_STEPS data |
| PROC-1.5 | ✅ Step numbers are rendered inside circles | Positive | Elements with class "step-number" contain 1-4 |
| PROC-1.6 | 🚫 Handles empty steps array gracefully | Edge | No errors if PROCESS_STEPS is empty |

**Example Test:**
```typescript
describe('ProcessComponent', () => {
  let component: ProcessComponent;
  let fixture: ComponentFixture<ProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render section heading "How It Works"', () => {
    const compiled = fixture.nativeElement;
    const heading = compiled.querySelector('.section-heading');
    expect(heading.textContent).toContain('How It Works');
  });

  it('should render all 4 process steps', () => {
    const compiled = fixture.nativeElement;
    const steps = compiled.querySelectorAll('.process-step');
    expect(steps.length).toBe(4);
  });

  it('should render correct step numbers (1-4)', () => {
    const compiled = fixture.nativeElement;
    const stepNumbers = compiled.querySelectorAll('.step-number');

    expect(stepNumbers[0].textContent).toContain('1');
    expect(stepNumbers[1].textContent).toContain('2');
    expect(stepNumbers[2].textContent).toContain('3');
    expect(stepNumbers[3].textContent).toContain('4');
  });

  it('should render correct step titles', () => {
    const compiled = fixture.nativeElement;
    const stepTitles = compiled.querySelectorAll('.step-title');

    expect(stepTitles[0].textContent).toContain('Discovery Call');
    expect(stepTitles[1].textContent).toContain('Custom Design');
    expect(stepTitles[2].textContent).toContain('Integration');
    expect(stepTitles[3].textContent).toContain('Optimization');
  });
});
```

---

### 1.5 IndustriesComponent

**File:** `frontend/src/app/features/home/industries/industries.component.spec.ts`

#### Test Cases

| Test ID | Test Description | Category | Expected Result |
|---------|------------------|----------|-----------------|
| IND-1.1 | ✅ Component creates successfully | Positive | Component instance is truthy |
| IND-1.2 | ✅ Renders section heading "Industries We Serve" | Positive | Section heading text matches |
| IND-1.3 | ✅ Renders all 8 industry tiles | Positive | 8 elements with class "industry-tile" exist |
| IND-1.4 | ✅ Each tile has emoji icon and name | Positive | All tiles contain icon and name elements |
| IND-1.5 | ✅ Healthcare tile has 🏥 icon | Positive | First tile icon is "🏥" |
| IND-1.6 | ✅ Financial Services tile has 🏦 icon | Positive | Second tile icon is "🏦" |
| IND-1.7 | 🚫 Handles empty industries array gracefully | Edge | No errors if INDUSTRIES is empty |

**Example Test:**
```typescript
describe('IndustriesComponent', () => {
  let component: IndustriesComponent;
  let fixture: ComponentFixture<IndustriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndustriesComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(IndustriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render section heading "Industries We Serve"', () => {
    const compiled = fixture.nativeElement;
    const heading = compiled.querySelector('.section-heading');
    expect(heading.textContent).toContain('Industries We Serve');
  });

  it('should render all 8 industry tiles', () => {
    const compiled = fixture.nativeElement;
    const tiles = compiled.querySelectorAll('.industry-tile');
    expect(tiles.length).toBe(8);
  });

  it('should render emoji icons correctly', () => {
    const compiled = fixture.nativeElement;
    const icons = compiled.querySelectorAll('.industry-icon');

    expect(icons[0].textContent).toContain('🏥'); // Healthcare
    expect(icons[1].textContent).toContain('🏦'); // Financial Services
    expect(icons[2].textContent).toContain('🛒'); // E-Commerce
  });

  it('should render industry names correctly', () => {
    const compiled = fixture.nativeElement;
    const names = compiled.querySelectorAll('.industry-name');

    expect(names[0].textContent).toContain('Healthcare');
    expect(names[1].textContent).toContain('Financial Services');
    expect(names[7].textContent).toContain('Logistics');
  });
});
```

---

### 1.6 CtaBannerComponent

**File:** `frontend/src/app/features/home/cta-banner/cta-banner.component.spec.ts`

#### Test Cases

| Test ID | Test Description | Category | Expected Result |
|---------|------------------|----------|-----------------|
| CTA-1.1 | ✅ Component creates successfully | Positive | Component instance is truthy |
| CTA-1.2 | ✅ Renders headline "Ready to Automate Your Business?" | Positive | Headline text matches |
| CTA-1.3 | ✅ Renders subtext with consultation details | Positive | Subtext contains "30-minute consultation" |
| CTA-1.4 | ✅ CTA button routes to /contact | Positive | routerLink attribute is "/contact" |
| CTA-1.5 | ✅ CTA button has correct ARIA label | Positive | aria-label is descriptive |

**Example Test:**
```typescript
describe('CtaBannerComponent', () => {
  let component: CtaBannerComponent;
  let fixture: ComponentFixture<CtaBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CtaBannerComponent, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(CtaBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render headline "Ready to Automate Your Business?"', () => {
    const compiled = fixture.nativeElement;
    const headline = compiled.querySelector('.cta-headline');
    expect(headline.textContent).toContain('Ready to Automate Your Business?');
  });

  it('should render subtext with consultation details', () => {
    const compiled = fixture.nativeElement;
    const subtext = compiled.querySelector('.cta-subtext');
    expect(subtext.textContent).toContain('30-minute consultation');
  });

  it('should have CTA button routing to /contact', () => {
    const compiled = fixture.nativeElement;
    const button = compiled.querySelector('.btn-primary');
    expect(button.getAttribute('routerLink')).toBe('/contact');
  });
});
```

---

## 2. Accessibility Tests

### 2.1 Keyboard Navigation

**Test Cases:**

| Test ID | Test Description | Expected Result |
|---------|------------------|-----------------|
| A11Y-1.1 | Tab through all CTA buttons in hero section | Focus moves to primary CTA, then secondary CTA |
| A11Y-1.2 | Tab through CTA banner button | Focus moves to "Schedule Consultation" button |
| A11Y-1.3 | Press Enter on focused hero primary CTA | Navigates to /contact route |
| A11Y-1.4 | Press Enter on focused hero secondary CTA | Navigates to /services route |
| A11Y-1.5 | Visible focus indicators on all buttons | Blue outline (2px) with 4px offset |

**Manual Test Steps:**
1. Load home page in browser
2. Press Tab key repeatedly
3. Verify focus moves through all interactive elements in logical order
4. Verify focus indicators are clearly visible (2px outline, 4px offset)
5. Press Enter on each focused button
6. Verify correct navigation occurs

---

### 2.2 ARIA Labels and Semantic HTML

**Test Cases:**

| Test ID | Test Description | Expected Result |
|---------|------------------|-----------------|
| A11Y-2.1 | Hero section has semantic `<section>` tag | Section element with aria-labelledby exists |
| A11Y-2.2 | Hero headline uses `<h1>` tag | Single h1 tag on page |
| A11Y-2.3 | Section headings use `<h2>` tags | All section headings are h2 |
| A11Y-2.4 | CTA buttons have descriptive aria-labels | "Schedule a free consultation", "View our AI automation services" |
| A11Y-2.5 | Stats bar has hidden heading for screen readers | SR-only h2: "Our Track Record" |

**Automated Test (axe-core):**
```typescript
import { axe, toHaveNoViolations } from 'jasmine-axe';

describe('Home Page Accessibility', () => {
  it('should have no WCAG 2.1 AA violations', async () => {
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });
});
```

---

### 2.3 Color Contrast

**Test Cases:**

| Test ID | Test Description | Expected Result |
|---------|------------------|-----------------|
| A11Y-3.1 | Hero headline (#ffffff on #0a0a0f) | Contrast ratio ≥4.5:1 |
| A11Y-3.2 | Hero subheading (#a0a0b0 on #0a0a0f) | Contrast ratio ≥4.5:1 |
| A11Y-3.3 | Primary CTA button (#0a0a0f on #00e5a0) | Contrast ratio ≥4.5:1 |
| A11Y-3.4 | Stats labels (muted color on dark bg) | Contrast ratio ≥4.5:1 |

**Verification Tool:** Chrome DevTools Lighthouse or WebAIM Contrast Checker

---

### 2.4 Reduced Motion

**Test Case:**

| Test ID | Test Description | Expected Result |
|---------|------------------|-----------------|
| A11Y-4.1 | prefers-reduced-motion media query respected | All animations disabled or reduced to <10ms |

**Manual Test:**
1. Enable "Reduce Motion" in OS accessibility settings
2. Load home page
3. Verify glow orb animations are disabled
4. Verify counter animation is instant (no count-up)
5. Verify scroll reveal animations are instant (no fade-up)

---

## 3. Performance Tests

### 3.1 Lighthouse CI

**Test Cases:**

| Test ID | Metric | Target | Test Method |
|---------|--------|--------|-------------|
| PERF-1.1 | Performance Score | ≥90 | Lighthouse CI in build pipeline |
| PERF-1.2 | Accessibility Score | ≥90 | Lighthouse CI in build pipeline |
| PERF-1.3 | Best Practices Score | ≥90 | Lighthouse CI in build pipeline |
| PERF-1.4 | SEO Score | ≥90 | Lighthouse CI in build pipeline |

**Lighthouse CI Configuration:**
```json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:4200/"],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "first-contentful-paint": ["warn", {"maxNumericValue": 2000}],
        "largest-contentful-paint": ["error", {"maxNumericValue": 2500}],
        "cumulative-layout-shift": ["error", {"maxNumericValue": 0.1}]
      }
    }
  }
}
```

---

### 3.2 Core Web Vitals

**Test Cases:**

| Test ID | Metric | Target | Test Method |
|---------|--------|--------|-------------|
| PERF-2.1 | Largest Contentful Paint (LCP) | <2.5s | Lighthouse, WebPageTest |
| PERF-2.2 | First Input Delay (FID) | <100ms | Real User Monitoring (RUM) |
| PERF-2.3 | Cumulative Layout Shift (CLS) | <0.1 | Lighthouse, RUM |
| PERF-2.4 | First Contentful Paint (FCP) | <2.0s | Lighthouse, WebPageTest |

---

### 3.3 Bundle Size

**Test Case:**

| Test ID | Metric | Target | Test Method |
|---------|--------|--------|-------------|
| PERF-3.1 | Initial Bundle Size | <500 KB | ng build --prod, analyze bundle |
| PERF-3.2 | Home Page Chunk Size | <200 KB | webpack-bundle-analyzer |

**Command:**
```bash
ng build --configuration production --stats-json
npx webpack-bundle-analyzer dist/velocity-ai/stats.json
```

---

### 3.4 Animation Performance

**Test Case:**

| Test ID | Test Description | Target | Test Method |
|---------|------------------|--------|-------------|
| PERF-4.1 | Glow orb animations run at 60 FPS | No dropped frames | Chrome DevTools Performance tab |
| PERF-4.2 | Counter animation runs at 60 FPS | No dropped frames | Chrome DevTools Performance tab |
| PERF-4.3 | Scroll reveal animations run at 60 FPS | No dropped frames | Chrome DevTools Performance tab |

**Manual Test:**
1. Open Chrome DevTools → Performance tab
2. Click "Record" and scroll through page
3. Stop recording
4. Verify all animations stay above 60 FPS (no red bars in timeline)

---

## 4. Visual Regression Tests

### 4.1 Screenshot Comparisons

**Test Cases:**

| Test ID | Breakpoint | Resolution | Test Method |
|---------|------------|------------|-------------|
| VR-1.1 | Mobile | 375px × 667px | Percy, Chromatic, or Playwright |
| VR-1.2 | Tablet | 768px × 1024px | Percy, Chromatic, or Playwright |
| VR-1.3 | Desktop | 1440px × 900px | Percy, Chromatic, or Playwright |
| VR-1.4 | Large Desktop | 1920px × 1080px | Percy, Chromatic, or Playwright |

**Playwright Visual Regression Test:**
```typescript
import { test, expect } from '@playwright/test';

test('home page visual regression - mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('http://localhost:4200/');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('home-mobile.png');
});

test('home page visual regression - desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:4200/');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('home-desktop.png');
});
```

---

## 5. Integration Tests (Routing)

### 5.1 Home Route

**Test Cases:**

| Test ID | Test Description | Expected Result |
|---------|------------------|-----------------|
| INT-1.1 | Navigate to / route | HomePageComponent loads |
| INT-1.2 | Click hero primary CTA | Navigates to /contact route |
| INT-1.3 | Click hero secondary CTA | Navigates to /services route |
| INT-1.4 | Click CTA banner button | Navigates to /contact route |
| INT-1.5 | Page title is set correctly | Document title is "Velobiz - AI Automation..." |

**Example Test:**
```typescript
describe('Home Page Routing', () => {
  let router: Router;
  let location: Location;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes), AppComponent]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(AppComponent);
  });

  it('should navigate to home page on root route', async () => {
    await router.navigate(['/']);
    expect(location.path()).toBe('');
  });

  it('should navigate to contact page when hero primary CTA is clicked', async () => {
    await router.navigate(['/']);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const primaryBtn = compiled.querySelector('.hero .btn-primary');
    primaryBtn.click();

    await fixture.whenStable();
    expect(location.path()).toBe('/contact');
  });

  it('should set page title correctly', async () => {
    await router.navigate(['/']);
    fixture.detectChanges();

    expect(document.title).toBe('Velobiz - AI Automation that Accelerates Your Business');
  });
});
```

---

## Test Execution Schedule

### Phase 1: Unit Tests (During Development)
- Run unit tests after each component is built
- Command: `ng test --watch=false --browsers=ChromeHeadless`
- All tests must pass before moving to next component

### Phase 2: Coverage Report (After All Components Complete)
- Generate coverage report for all 6 components
- Command: `ng test --code-coverage --watch=false --browsers=ChromeHeadless`
- Verify ≥80% coverage
- View report: `frontend/coverage/index.html`

### Phase 3: Accessibility Tests (After Unit Tests Pass)
- Run axe-core automated tests
- Manual keyboard navigation testing
- Color contrast verification
- Reduced motion testing

### Phase 4: Performance Tests (After Feature Complete)
- Run Lighthouse CI in local development
- Analyze bundle size with webpack-bundle-analyzer
- Record Chrome DevTools Performance profile during scroll

### Phase 5: Visual Regression Tests (Before Feature Sign-Off)
- Capture baseline screenshots for all 4 breakpoints
- Run visual diff comparison
- Approve or reject changes

### Phase 6: Integration Tests (Before Merging to Main)
- Test routing between home and contact/services pages
- Verify page title and meta tags set correctly

---

## Test Data

### Mock Data (Not Applicable)

This feature uses hardcoded static data, so no mock data is required.

---

## Continuous Integration

### GitHub Actions Workflow

```yaml
name: Home Page Tests

on:
  push:
    branches: [feature/2026-02-home]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        working-directory: ./frontend
        run: npm ci

      - name: Run unit tests with coverage
        working-directory: ./frontend
        run: npm run test:ci

      - name: Run Lighthouse CI
        working-directory: ./frontend
        run: |
          npm install -g @lhci/cli
          lhci autorun

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./frontend/coverage/lcov.info
```

---

## Definition of Done (Testing)

Feature 2 testing is complete when:

- ✅ All 20+ unit tests passing
- ✅ Code coverage ≥80% for all 6 components
- ✅ Lighthouse Performance Score ≥90
- ✅ Lighthouse Accessibility Score ≥90
- ✅ No axe-core WCAG 2.1 AA violations
- ✅ All CTA buttons keyboard accessible
- ✅ Color contrast ratios verified ≥4.5:1
- ✅ Reduced motion preferences respected
- ✅ Visual regression tests pass for all 4 breakpoints
- ✅ Routing tests pass
- ✅ No console errors or warnings
- ✅ Bundle size within target (<200 KB)
- ✅ Animations run at 60 FPS

---

## Approval

**Reviewed By:** Lead Agent
**Approved By:** User
**Date:** 2026-02-20
**Status:** APPROVED ✅

**Next Steps:**
1. Route tasks to Angular Expert Agent
2. Route testing tasks to Tester Agent
3. Execute tests as components are built
4. Generate HTML design docs after feature completion
