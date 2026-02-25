# Task Breakdown — FEATURE 2: Home / Landing Page

**Feature ID:** 2026-02-home
**Feature Name:** Home / Landing Page
**Date:** 2026-02-20
**Status:** Specification Complete

---

## Overview

This feature consists of **8 primary tasks** to build 6 components and configure routing. All tasks are frontend-only (Angular 19).

**Estimated Total Time:** 8-12 hours

---

## Dependencies

### Upstream Dependencies (Must Complete First)
✅ **FEATURE 0: Infrastructure & Shared Foundation**
- ScrollRevealDirective must be implemented
- Global CSS custom properties must be defined
- Angular routing must be configured

✅ **FEATURE 1: Layout (Navbar + Footer)**
- Layout shell with router-outlet must be complete
- Navbar and Footer components must be functional

### Downstream Dependencies (Blocked by This Feature)
- None (other features do not depend on Home Page)

---

## Task List

### Task 1: Create HomePageComponent Container

**Assigned To:** Angular Expert Agent
**Estimated Time:** 30 minutes
**Priority:** High (blocking all other tasks)

**Description:**
Create the main container component that assembles all 5 section components.

**Acceptance Criteria:**
- ✅ Create `frontend/src/app/features/home/home-page/home-page.component.ts`
- ✅ Standalone component with imports for all 5 section components
- ✅ OnPush change detection strategy
- ✅ Template renders all 5 sections in correct order
- ✅ Semantic `<main>` wrapper tag
- ✅ Component creates successfully in unit test

**Files Created:**
- `frontend/src/app/features/home/home-page/home-page.component.ts`
- `frontend/src/app/features/home/home-page/home-page.component.html`
- `frontend/src/app/features/home/home-page/home-page.component.spec.ts`

**Dependencies:**
- None (this is the first task)

---

### Task 2: Implement HeroComponent with Glow Orbs

**Assigned To:** Angular Expert Agent
**Estimated Time:** 2 hours
**Priority:** High

**Description:**
Create the hero section with animated badge, headline, CTAs, glow orbs, and grid overlay.

**Acceptance Criteria:**
- ✅ Create `frontend/src/app/features/home/hero/hero.component.ts`
- ✅ Standalone component, OnPush change detection
- ✅ Hardcoded content constant at top of file
- ✅ Animated badge with pulse animation (CSS @keyframes)
- ✅ Headline uses Playfair Display with `clamp()` for responsive sizing
- ✅ Two CTA buttons with routerLink to `/contact` and `/services`
- ✅ 3 glow orbs with CSS animations (float @keyframes)
- ✅ Grid overlay using CSS background-image
- ✅ Scroll indicator with bounce animation
- ✅ Responsive: Full viewport height on desktop, min-height on mobile
- ✅ Accessible: Semantic HTML, ARIA labels on buttons
- ✅ Unit test: Component creates, renders content, buttons have correct routes

**Files Created:**
- `frontend/src/app/features/home/hero/hero.component.ts`
- `frontend/src/app/features/home/hero/hero.component.html`
- `frontend/src/app/features/home/hero/hero.component.scss`
- `frontend/src/app/features/home/hero/hero.component.spec.ts`

**Dependencies:**
- Task 1 (HomePageComponent)

---

### Task 3: Implement StatsBarComponent with Counter Animation

**Assigned To:** Angular Expert Agent
**Estimated Time:** 2 hours
**Priority:** High

**Description:**
Create the stats bar with 4 animated counters that trigger on scroll into viewport.

**Acceptance Criteria:**
- ✅ Create `frontend/src/app/features/home/stats-bar/stats-bar.component.ts`
- ✅ Standalone component, OnPush change detection
- ✅ Hardcoded stats data constant at top of file
- ✅ IntersectionObserver detects when stats bar enters viewport
- ✅ Counter animation counts from 0 to target value over 2 seconds
- ✅ Use Signal to store animated values and trigger state
- ✅ Animation triggers only once per page load
- ✅ Format large numbers with suffixes ("2M+", "500+")
- ✅ Frosted glass effect with backdrop-filter
- ✅ Responsive: 4 columns (desktop), 2×2 grid (mobile)
- ✅ Accessible: Hidden heading for screen readers
- ✅ Unit test: Component creates, animation logic works, formatting correct

**Files Created:**
- `frontend/src/app/features/home/stats-bar/stats-bar.component.ts`
- `frontend/src/app/features/home/stats-bar/stats-bar.component.html`
- `frontend/src/app/features/home/stats-bar/stats-bar.component.scss`
- `frontend/src/app/features/home/stats-bar/stats-bar.component.spec.ts`

**Dependencies:**
- Task 1 (HomePageComponent)

**Technical Notes:**
- Use `requestAnimationFrame` for smooth counter animation
- Store triggered state in Signal: `hasAnimated = signal(false)`
- IntersectionObserver threshold: 0.5 (50% visible)

---

### Task 4: Implement ProcessComponent with Timeline

**Assigned To:** Angular Expert Agent
**Estimated Time:** 1.5 hours
**Priority:** Medium

**Description:**
Create the "How It Works" section with 4-step process and timeline connector.

**Acceptance Criteria:**
- ✅ Create `frontend/src/app/features/home/process/process.component.ts`
- ✅ Standalone component, OnPush change detection
- ✅ Hardcoded process steps constant at top of file
- ✅ Section heading: "How It Works" (Playfair Display)
- ✅ 4 step cards with numbered circles, titles, descriptions
- ✅ Desktop: Horizontal timeline with connector line (CSS ::before pseudo-element)
- ✅ Mobile: Vertical stacked layout, no connector line
- ✅ Responsive: 4 columns (desktop), 1 column (mobile)
- ✅ Apply ScrollRevealDirective from Feature 0
- ✅ Accessible: Semantic heading structure
- ✅ Unit test: Component creates, renders all 4 steps, content matches data

**Files Created:**
- `frontend/src/app/features/home/process/process.component.ts`
- `frontend/src/app/features/home/process/process.component.html`
- `frontend/src/app/features/home/process/process.component.scss`
- `frontend/src/app/features/home/process/process.component.spec.ts`

**Dependencies:**
- Task 1 (HomePageComponent)
- Feature 0 (ScrollRevealDirective)

---

### Task 5: Implement IndustriesComponent with Grid

**Assigned To:** Angular Expert Agent
**Estimated Time:** 1 hour
**Priority:** Medium

**Description:**
Create the "Industries We Serve" section with 8 industry tiles in responsive grid.

**Acceptance Criteria:**
- ✅ Create `frontend/src/app/features/home/industries/industries.component.ts`
- ✅ Standalone component, OnPush change detection
- ✅ Hardcoded industries data constant at top of file
- ✅ Section heading: "Industries We Serve" (Playfair Display)
- ✅ 8 industry tiles with emoji icons and names
- ✅ Responsive grid: 4 columns (desktop), 2 columns (tablet), 1 column (mobile)
- ✅ Hover effect: Card lift (translateY -8px) and glow box-shadow
- ✅ Apply ScrollRevealDirective from Feature 0
- ✅ Accessible: Semantic HTML
- ✅ Unit test: Component creates, renders all 8 industries, hover effect CSS present

**Files Created:**
- `frontend/src/app/features/home/industries/industries.component.ts`
- `frontend/src/app/features/home/industries/industries.component.html`
- `frontend/src/app/features/home/industries/industries.component.scss`
- `frontend/src/app/features/home/industries/industries.component.spec.ts`

**Dependencies:**
- Task 1 (HomePageComponent)
- Feature 0 (ScrollRevealDirective)

---

### Task 6: Implement CtaBannerComponent

**Assigned To:** Angular Expert Agent
**Estimated Time:** 45 minutes
**Priority:** Medium

**Description:**
Create the final CTA banner section with consultation call-to-action.

**Acceptance Criteria:**
- ✅ Create `frontend/src/app/features/home/cta-banner/cta-banner.component.ts`
- ✅ Standalone component, OnPush change detection
- ✅ Full-width dark card with teal accent border
- ✅ Headline: "Ready to Automate Your Business?"
- ✅ Subtext: "Book a free 30-minute consultation..."
- ✅ Primary CTA button: "Schedule Consultation" routes to `/contact`
- ✅ Button hover effect (lift + glow)
- ✅ Responsive: Adjust padding and font sizes for mobile
- ✅ Apply ScrollRevealDirective from Feature 0
- ✅ Accessible: Semantic heading, ARIA label on button
- ✅ Unit test: Component creates, button routes to `/contact`

**Files Created:**
- `frontend/src/app/features/home/cta-banner/cta-banner.component.ts`
- `frontend/src/app/features/home/cta-banner/cta-banner.component.html`
- `frontend/src/app/features/home/cta-banner/cta-banner.component.scss`
- `frontend/src/app/features/home/cta-banner/cta-banner.component.spec.ts`

**Dependencies:**
- Task 1 (HomePageComponent)
- Feature 0 (ScrollRevealDirective)

---

### Task 7: Configure Home Route

**Assigned To:** Angular Expert Agent
**Estimated Time:** 15 minutes
**Priority:** High (blocking integration testing)

**Description:**
Register the HomePageComponent on the root `/` route in Angular routing configuration.

**Acceptance Criteria:**
- ✅ Edit `frontend/src/app/app.routes.ts`
- ✅ Add route: `{ path: '', component: HomePageComponent, title: '...' }`
- ✅ Set page title: "Velobiz - AI Automation that Accelerates Your Business"
- ✅ Add meta description in route data
- ✅ Eager load (not lazy-loaded)
- ✅ Verify route works: `ng serve` and navigate to `http://localhost:4200/`
- ✅ Unit test: Router navigates to HomePageComponent on `/` route

**Files Modified:**
- `frontend/src/app/app.routes.ts`

**Dependencies:**
- Task 1 (HomePageComponent)

---

### Task 8: Write Unit Tests for All Components

**Assigned To:** Tester Agent
**Estimated Time:** 2 hours
**Priority:** High

**Description:**
Write comprehensive unit tests for all 6 components (5 sections + 1 container) with minimum 80% coverage.

**Acceptance Criteria:**
- ✅ Minimum **20 total tests** across all 6 components
- ✅ Each component: "should create" test
- ✅ HeroComponent: Test CTA button routes, content renders
- ✅ StatsBarComponent: Test counter animation logic, number formatting
- ✅ ProcessComponent: Test all 4 steps render, correct titles and descriptions
- ✅ IndustriesComponent: Test all 8 industries render, correct icons and names
- ✅ CtaBannerComponent: Test button routes to `/contact`
- ✅ HomePageComponent: Test imports all 5 child components
- ✅ Routing test: Test `/` route loads HomePageComponent
- ✅ Accessibility test: Test keyboard navigation on CTA buttons
- ✅ All tests pass: `ng test --watch=false --browsers=ChromeHeadless`
- ✅ Coverage ≥80%: `ng test --code-coverage --watch=false --browsers=ChromeHeadless`

**Test Categories:**
- ✅ Positive: Components render correctly with expected content
- ❌ Negative: (Not applicable — no error states in this feature)
- 🚫 Edge: Counter animation handles large numbers, empty content constants gracefully

**Files Modified:**
- `frontend/src/app/features/home/hero/hero.component.spec.ts`
- `frontend/src/app/features/home/stats-bar/stats-bar.component.spec.ts`
- `frontend/src/app/features/home/process/process.component.spec.ts`
- `frontend/src/app/features/home/industries/industries.component.spec.ts`
- `frontend/src/app/features/home/cta-banner/cta-banner.component.spec.ts`
- `frontend/src/app/features/home/home-page/home-page.component.spec.ts`

**Dependencies:**
- All previous tasks (Tasks 1-7)

---

## Task Execution Order

### Chunk 1: Foundation (Tasks 1-2)
**Duration:** 2.5 hours

1. Task 1: Create HomePageComponent container (30 min)
2. Task 2: Implement HeroComponent with glow orbs (2 hours)

**Deliverable:** Hero section visible at `http://localhost:4200/`

---

### Chunk 2: Stats & Process (Tasks 3-4)
**Duration:** 3.5 hours

3. Task 3: Implement StatsBarComponent with counter animation (2 hours)
4. Task 4: Implement ProcessComponent with timeline (1.5 hours)

**Deliverable:** Hero + Stats + Process sections visible

---

### Chunk 3: Industries & CTA (Tasks 5-6)
**Duration:** 1.75 hours

5. Task 5: Implement IndustriesComponent with grid (1 hour)
6. Task 6: Implement CtaBannerComponent (45 minutes)

**Deliverable:** All 5 sections visible, full page complete

---

### Chunk 4: Routing & Tests (Tasks 7-8)
**Duration:** 2.25 hours

7. Task 7: Configure home route (15 minutes)
8. Task 8: Write unit tests for all components (2 hours)

**Deliverable:** Route configured, all tests passing with ≥80% coverage

---

## Build and Test Commands

### Development Server
```bash
cd frontend
ng serve
# Visit http://localhost:4200/
```

### Build
```bash
cd frontend
ng build
```

### Run Tests
```bash
cd frontend
ng test --watch=false --browsers=ChromeHeadless
```

### Run Tests with Coverage
```bash
cd frontend
ng test --code-coverage --watch=false --browsers=ChromeHeadless
# View coverage report: frontend/coverage/index.html
```

### Lint
```bash
cd frontend
ng lint
```

---

## Definition of Done

A task is considered complete when:

- ✅ All acceptance criteria met
- ✅ Component(s) created with correct file structure
- ✅ Code follows Angular style guide and project standards
- ✅ TypeScript strict mode enabled, no `any` types
- ✅ OnPush change detection strategy used
- ✅ All colors reference CSS custom properties (no hardcoded hex)
- ✅ Responsive design works on mobile, tablet, desktop
- ✅ Accessibility requirements met (semantic HTML, ARIA labels, keyboard nav)
- ✅ Unit tests written and passing
- ✅ No console errors or warnings
- ✅ Linter passes with no errors
- ✅ Code reviewed by Reviewer Agent (after chunk completion)

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Glow orb animations cause performance issues | High | Use CSS animations only, test on low-end devices, add prefers-reduced-motion fallback |
| ScrollRevealDirective from Feature 0 not complete | High | Block this feature until Feature 0 is verified complete |
| Counter animation re-triggers on every scroll | Medium | Use Signal to store triggered state, prevent re-animation |
| Hero headline overflows on small screens | Medium | Use `clamp()` CSS for fluid typography, test on 320px width |
| CTA routes broken if `/contact` route doesn't exist yet | Low | Stub out `/contact` route early, or test with mock routes |

---

## Approval

**Reviewed By:** Lead Agent
**Approved By:** User
**Date:** 2026-02-20
**Status:** APPROVED ✅

**Total Estimated Time:** 8-12 hours

**Next Steps:**
1. Generate test-plan.md
2. Route tasks to Angular Expert Agent (Tasks 1-7)
3. Route testing tasks to Tester Agent (Task 8)
4. Review completed chunks with Reviewer Agent
