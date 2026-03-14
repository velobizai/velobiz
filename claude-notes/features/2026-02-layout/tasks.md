# FEATURE 1: Layout (Navbar + Footer) — Task Breakdown

**Feature ID:** FEATURE-001
**Feature Name:** Layout (Navbar + Footer)
**Date:** 2026-02-20
**Status:** Ready for Implementation

---

## 1. Task Summary

| Layer | Task Count | Estimated Time |
|-------|-----------|----------------|
| **Infrastructure** | 1 | 30 minutes |
| **UI (Navbar)** | 3 | 4 hours |
| **UI (Footer)** | 2 | 2.5 hours |
| **Integration** | 1 | 1 hour |
| **Testing** | 2 | 3 hours |
| **TOTAL** | **9 tasks** | **11 hours** |

---

## 2. Task Dependency Graph

```
TASK 1.1 (Config)
    │
    ├───► TASK 1.2 (NavbarComponent Desktop)
    │         │
    │         └───► TASK 1.3 (NavbarComponent Mobile)
    │                   │
    │                   └───► TASK 1.5 (Integration)
    │                             │
    └───► TASK 1.4 (FooterComponent) ───┘
                                        │
                                        └───► TASK 1.6 (Unit Tests Navbar)
                                        │
                                        └───► TASK 1.7 (Unit Tests Footer)
```

**Critical Path:** Task 1.1 → 1.2 → 1.3 → 1.5 → 1.6/1.7
**Parallelization Opportunity:** Tasks 1.6 and 1.7 (unit tests) can run in parallel after Task 1.5 is complete.

---

## 3. Detailed Task Breakdown

### TASK 1.1: Create Layout Configuration File

**Task ID:** TASK-001-01
**Title:** Create layout.config.ts with navigation and footer link constants
**Layer:** Infrastructure
**Estimate:** 30 minutes
**Dependencies:** None (can start immediately)
**Assigned Agent:** Angular Expert

**Description:**
Create a centralized configuration file for all navigation and footer links. This file will be the single source of truth for link data used in Navbar and Footer components.

**Files to Create:**
- `src/app/layout/layout.config.ts`

**Files to Modify:**
- `src/environments/environment.ts` (add social media URLs)
- `src/environments/environment.prod.ts` (add production social media URLs)

**Implementation Steps:**
1. Create `src/app/layout/` directory if it doesn't exist
2. Create `layout.config.ts` with:
   - `NavLink` interface definition
   - `NAV_LINKS` constant array (5 links)
   - `FOOTER_QUICK_LINKS` constant array (same as NAV_LINKS)
   - `FOOTER_COMPANY_LINKS` constant array (3 placeholder links)
   - `FOOTER_LEGAL_LINKS` constant array (3 placeholder links)
3. Update `environment.ts` with:
   - `social.linkedin` URL
   - `social.twitter` URL
   - `social.github` URL
4. Update `environment.prod.ts` with same structure (can be identical URLs for now)

**Acceptance Criteria:**
- [ ] `layout.config.ts` exports all 4 link arrays as constants
- [ ] `NavLink` interface has `label`, `route`, and optional `icon` properties
- [ ] `NAV_LINKS` array contains exactly 5 items (Home, Services, Pricing, FAQ, Contact)
- [ ] `FOOTER_COMPANY_LINKS` and `FOOTER_LEGAL_LINKS` use `#` as placeholder routes
- [ ] `environment.ts` and `environment.prod.ts` include `social` object with 3 URLs
- [ ] All TypeScript compiles without errors

**Test Strategy:**
- Manual verification: Import constants in test file, verify structure
- No unit tests needed for pure data files

---

### TASK 1.2: Build NavbarComponent Desktop Version

**Task ID:** TASK-001-02
**Title:** Create NavbarComponent with desktop navigation and scroll detection
**Layer:** UI (Angular Component)
**Estimate:** 2 hours
**Dependencies:** TASK 1.1 (needs layout.config.ts)
**Assigned Agent:** Angular Expert

**Description:**
Create the NavbarComponent as a standalone component with desktop horizontal navigation, logo, and scroll state detection. Includes smooth transitions between transparent and frosted-glass states.

**Files to Create:**
- `src/app/layout/navbar/navbar.component.ts`
- `src/app/layout/navbar/navbar.component.html`
- `src/app/layout/navbar/navbar.component.scss`
- `src/app/layout/navbar/navbar.component.spec.ts`

**Implementation Steps:**
1. Generate component using Angular CLI (standalone):
   ```bash
   ng generate component layout/navbar --standalone
   ```
2. Implement component TypeScript:
   - Import `NAV_LINKS` from `layout.config.ts`
   - Import `OnPush` change detection strategy
   - Create `scrolled` signal to track scroll state (boolean)
   - Add `@HostListener('window:scroll')` with debounce (50ms)
   - Update `scrolled` signal based on `window.pageYOffset > 100`
3. Implement template:
   - Logo section (clickable, routes to `/`)
   - Desktop navigation: horizontal `<nav>` with links
   - Use `RouterLink` and `RouterLinkActive="active"` for each link
   - "Get Started" CTA button (routes to `/contact`)
   - Apply `[class.navbar--scrolled]="scrolled()"` for state-based styling
4. Implement styles:
   - Fixed positioning: `position: fixed; top: 0; width: 100%; z-index: 1000;`
   - Two state classes: `.navbar--top` and `.navbar--scrolled`
   - Frosted glass effect: `backdrop-filter: blur(12px)`
   - Height transition: 80px → 64px
   - Link hover effects with underline animation
   - CTA button styling with hover glow
   - Hide mobile hamburger on desktop (`@media (min-width: 768px)`)

**Acceptance Criteria:**
- [ ] Component is standalone (no NgModule)
- [ ] Uses OnPush change detection
- [ ] Scroll state updates correctly when scrolling past 100px
- [ ] Scroll event is debounced to prevent performance issues
- [ ] Logo is clickable and routes to `/`
- [ ] All 5 navigation links are visible and route correctly
- [ ] Active link is highlighted with teal color
- [ ] "Get Started" button routes to `/contact`
- [ ] Navbar transitions smoothly between transparent and frosted glass states (300ms)
- [ ] Navbar height shrinks from 80px to 64px on scroll
- [ ] Bottom border appears when scrolled
- [ ] All styles use CSS custom properties (no hardcoded hex values)

**Test Strategy:**
- Unit tests will be written in TASK 1.6

---

### TASK 1.3: Add Mobile Hamburger Menu to NavbarComponent

**Task ID:** TASK-001-03
**Title:** Implement mobile hamburger menu with MatSidenav drawer
**Layer:** UI (Angular Component)
**Estimate:** 2 hours
**Dependencies:** TASK 1.2 (needs NavbarComponent base)
**Assigned Agent:** Angular Expert

**Description:**
Extend NavbarComponent with mobile hamburger menu functionality using Angular Material MatSidenav. Menu slides in from the right with backdrop overlay.

**Files to Modify:**
- `src/app/layout/navbar/navbar.component.ts`
- `src/app/layout/navbar/navbar.component.html`
- `src/app/layout/navbar/navbar.component.scss`

**Implementation Steps:**
1. Import Angular Material modules in component:
   - `MatSidenavModule`
   - `MatIconModule`
2. Update component TypeScript:
   - Add `menuOpen` signal (boolean, default false)
   - Add `toggleMenu()` method to toggle `menuOpen` signal
   - Add `closeMenu()` method (called when link is clicked)
   - Add `@HostListener('document:keydown.escape')` to close menu on Escape key
3. Update template:
   - Add hamburger button (visible only on mobile):
     ```html
     <button class="hamburger-button"
             aria-label="Open navigation menu"
             [attr.aria-expanded]="menuOpen()"
             (click)="toggleMenu()">
       <mat-icon>menu</mat-icon>
     </button>
     ```
   - Add `MatSidenav` container:
     ```html
     <mat-sidenav-container>
       <mat-sidenav #drawer
                    position="end"
                    [opened]="menuOpen()"
                    (closed)="menuOpen.set(false)"
                    role="navigation"
                    aria-label="Main navigation">
         <!-- Mobile nav links (vertical) -->
         <!-- Close button -->
         <!-- Get Started button -->
         <!-- Social icons (optional) -->
       </mat-sidenav>
     </mat-sidenav-container>
     ```
   - Wire up link clicks to call `closeMenu()`
4. Update styles:
   - Hide hamburger button on desktop: `display: none; @media (max-width: 768px) { display: block; }`
   - Hide desktop nav on mobile: `@media (max-width: 768px) { display: none; }`
   - Style mobile drawer: dark background, vertical link list, padding
   - Drawer width: 280px (mobile), 320px (tablet)
   - Mobile link styles: larger tap targets (44px min height), full width, hover background

**Acceptance Criteria:**
- [ ] Hamburger icon is visible only on screens <768px
- [ ] Desktop horizontal navigation is hidden on screens <768px
- [ ] Clicking hamburger opens drawer from right side
- [ ] Drawer has semi-transparent backdrop overlay
- [ ] Clicking backdrop closes drawer
- [ ] Pressing Escape key closes drawer
- [ ] Clicking any navigation link closes drawer AND navigates
- [ ] Mobile links are vertically stacked with proper spacing
- [ ] Active link is highlighted in mobile menu
- [ ] "Get Started" button is visible in mobile menu
- [ ] Body scroll is disabled when drawer is open (handled by MatSidenav)
- [ ] Drawer animation completes in <300ms
- [ ] Hamburger button has proper ARIA attributes

**Test Strategy:**
- Unit tests will be written in TASK 1.6

---

### TASK 1.4: Build FooterComponent

**Task ID:** TASK-001-04
**Title:** Create FooterComponent with responsive multi-column layout
**Layer:** UI (Angular Component)
**Estimate:** 2.5 hours
**Dependencies:** TASK 1.1 (needs layout.config.ts)
**Assigned Agent:** Angular Expert

**Description:**
Create the FooterComponent as a standalone component with 4-column responsive layout (4 cols → 2 cols → 1 col). Includes brand section, link columns, social icons, and copyright notice.

**Files to Create:**
- `src/app/layout/footer/footer.component.ts`
- `src/app/layout/footer/footer.component.html`
- `src/app/layout/footer/footer.component.scss`
- `src/app/layout/footer/footer.component.spec.ts`

**Implementation Steps:**
1. Generate component using Angular CLI (standalone):
   ```bash
   ng generate component layout/footer --standalone
   ```
2. Implement component TypeScript:
   - Import all footer link arrays from `layout.config.ts`
   - Import `environment` from `src/environments/environment`
   - Import OnPush change detection strategy
   - Define readonly properties:
     - `companyName = 'Velobiz'`
     - `tagline = 'AI Automation for Modern Businesses'`
     - `description = '...'`
     - `currentYear = new Date().getFullYear()`
     - `socialLinks = environment.social`
3. Implement template:
   - Footer top section with CSS Grid (4 columns):
     - Column 1: Brand (logo, tagline, description)
     - Column 2: Quick Links (use `FOOTER_QUICK_LINKS` array with `*ngFor` and `RouterLink`)
     - Column 3: Company (use `FOOTER_COMPANY_LINKS` array)
     - Column 4: Legal (use `FOOTER_LEGAL_LINKS` array)
   - Footer bottom section:
     - Social icons row (LinkedIn, Twitter, GitHub) with `target="_blank"` and `rel="noopener noreferrer"`
     - Copyright notice: `© {{ currentYear }} {{ companyName }}. All rights reserved.`
4. Implement styles:
   - CSS Grid layout: `grid-template-columns: 2fr 1fr 1fr 1fr;` (desktop)
   - Media query for tablet: `grid-template-columns: 1fr 1fr;` (768px–1024px)
   - Media query for mobile: `grid-template-columns: 1fr;` (<768px)
   - Column heading styles (DM Sans, semi-bold, teal or white)
   - Link hover effects (color change + translateX)
   - Social icon button styles (circular, border, hover glow)
   - Footer bottom bar: flexbox with space-between, responsive wrap

**Acceptance Criteria:**
- [ ] Component is standalone (no NgModule)
- [ ] Uses OnPush change detection
- [ ] Footer displays 4 columns on desktop (>1024px)
- [ ] Footer displays 2 columns on tablet (768px–1024px)
- [ ] Footer displays 1 column on mobile (<768px)
- [ ] All Quick Links route correctly using Angular Router
- [ ] Company and Legal links use `#` placeholder routes
- [ ] Social icons open in new tabs with `rel="noopener noreferrer"`
- [ ] Social URLs are imported from `environment.ts`
- [ ] Copyright displays current year dynamically
- [ ] All link hover effects work correctly
- [ ] Social icon hover effects include teal glow
- [ ] Footer uses CSS Grid (not Flexbox) for column layout
- [ ] All styles use CSS custom properties (no hardcoded hex values)
- [ ] Footer has top border to separate from page content

**Test Strategy:**
- Unit tests will be written in TASK 1.7

---

### TASK 1.5: Integrate Navbar and Footer into App Shell

**Task ID:** TASK-001-05
**Title:** Wire Navbar and Footer into app.component.html with proper spacing
**Layer:** Integration
**Estimate:** 1 hour
**Dependencies:** TASK 1.2, TASK 1.3, TASK 1.4 (needs completed components)
**Assigned Agent:** Angular Expert

**Description:**
Integrate NavbarComponent and FooterComponent into the main application shell (`app.component.html`) with proper layout structure and spacing to account for fixed navbar.

**Files to Modify:**
- `src/app/app.component.ts`
- `src/app/app.component.html`
- `src/app/app.component.scss`

**Implementation Steps:**
1. Update `app.component.ts`:
   - Import `NavbarComponent` and `FooterComponent`
   - Add to component's `imports` array (standalone components)
2. Update `app.component.html`:
   - Replace existing content with layout structure:
     ```html
     <app-navbar />
     <main class="main-content">
       <router-outlet />
     </main>
     <app-footer />
     ```
3. Update `app.component.scss`:
   - Add padding-top to `.main-content` to account for fixed navbar:
     ```scss
     .main-content {
       padding-top: 80px;  // Match navbar height
       min-height: calc(100vh - 80px);  // Ensure footer stays at bottom
       transition: padding-top 300ms ease;
     }
     ```
   - Consider adding a class for scrolled state if navbar height changes dynamically
4. Test integration:
   - Run `ng serve` and verify layout renders correctly
   - Navigate to different routes and verify navbar/footer persist
   - Scroll down and verify navbar transition works without covering content

**Acceptance Criteria:**
- [ ] Navbar is visible at the top of all pages
- [ ] Footer is visible at the bottom of all pages
- [ ] Main content area has correct top padding (80px) to account for fixed navbar
- [ ] Router outlet content changes when navigating, but navbar and footer remain
- [ ] Scrolling works correctly without navbar covering page content
- [ ] Footer is always at the bottom (even if page content is short)
- [ ] No layout jank or content jumping during scroll transitions

**Test Strategy:**
- Manual testing: Navigate to all routes, verify layout consistency
- Visual regression testing (optional): Screenshot comparison at different scroll positions

---

### TASK 1.6: Write Unit Tests for NavbarComponent

**Task ID:** TASK-001-06
**Title:** Unit tests for NavbarComponent (scroll detection, mobile menu, routing)
**Layer:** Testing
**Estimate:** 1.5 hours
**Dependencies:** TASK 1.5 (needs integrated component)
**Assigned Agent:** Tester Agent

**Description:**
Write comprehensive unit tests for NavbarComponent covering scroll state, mobile menu interactions, routing, and accessibility.

**Files to Modify:**
- `src/app/layout/navbar/navbar.component.spec.ts`

**Test Cases to Implement:**

**1. Positive Scenarios (Happy Path):**
- ✅ Component initializes with `scrolled` signal = false
- ✅ Navigation links are loaded from `layout.config.ts` correctly (5 links)
- ✅ Logo click triggers router navigation to `/`
- ✅ "Get Started" button click triggers router navigation to `/contact`
- ✅ Each nav link routes to correct path when clicked

**2. Negative Scenarios (Error/Failure Handling):**
- ❌ Scroll event with `pageYOffset = NaN` does not break component
- ❌ Missing `environment.ts` does not cause runtime error (graceful degradation)

**3. Edge Cases:**
- 🚫 Scrolling to exactly 100px triggers state change
- 🚫 Scrolling to 99px does NOT trigger state change
- 🚫 Scrolling up from 200px to 50px resets state correctly

**4. Scroll Detection Tests:**
- Test that scrolling past 100px sets `scrolled` signal to true
- Test that scrolling back to top sets `scrolled` signal to false
- Test that scroll event is debounced (doesn't fire excessively)

**5. Mobile Menu Tests:**
- Test that `menuOpen` signal initializes to false
- Test that `toggleMenu()` switches `menuOpen` state
- Test that `closeMenu()` sets `menuOpen` to false
- Test that clicking a nav link calls `closeMenu()`
- Test that pressing Escape key closes menu

**6. Accessibility Tests:**
- Test that hamburger button has `aria-label` attribute
- Test that hamburger button has `aria-expanded` attribute matching `menuOpen` state
- Test that mobile drawer has `role="navigation"` attribute

**Implementation Steps:**
1. Set up TestBed with required imports (RouterTestingModule, MatSidenavModule, MatIconModule)
2. Mock `window.scroll` events using `dispatchEvent`
3. Mock `Router.navigate` using Jasmine spy
4. Write test specs using Jasmine `describe/it` blocks
5. Ensure 80%+ code coverage for NavbarComponent

**Acceptance Criteria:**
- [ ] At least 15 test specs written
- [ ] All tests pass (`ng test --watch=false --browsers=ChromeHeadless`)
- [ ] Code coverage for NavbarComponent is ≥80%
- [ ] Tests include at least 1 positive, 1 negative, and 1 edge case scenario
- [ ] Tests verify scroll detection logic
- [ ] Tests verify mobile menu state management
- [ ] Tests verify routing behavior
- [ ] Tests verify ARIA attributes

---

### TASK 1.7: Write Unit Tests for FooterComponent

**Task ID:** TASK-001-07
**Title:** Unit tests for FooterComponent (links, social icons, responsive layout)
**Layer:** Testing
**Estimate:** 1.5 hours
**Dependencies:** TASK 1.5 (needs integrated component)
**Assigned Agent:** Tester Agent

**Description:**
Write comprehensive unit tests for FooterComponent covering link rendering, social media links, copyright year, and responsive layout.

**Files to Modify:**
- `src/app/layout/footer/footer.component.spec.ts`

**Test Cases to Implement:**

**1. Positive Scenarios (Happy Path):**
- ✅ Component initializes correctly
- ✅ Footer link columns are loaded from `layout.config.ts` correctly
- ✅ Quick Links array contains 5 items
- ✅ Company Links array contains 3 items
- ✅ Legal Links array contains 3 items
- ✅ Social links are loaded from `environment.ts` correctly
- ✅ Copyright displays current year dynamically

**2. Negative Scenarios (Error/Failure Handling):**
- ❌ Missing social link URL does not break template rendering
- ❌ Invalid route in link array does not cause runtime error

**3. Edge Cases:**
- 🚫 Copyright year updates correctly when year changes (mock `Date`)
- 🚫 Empty link arrays render without errors

**4. Link Rendering Tests:**
- Test that all Quick Links are rendered in template
- Test that all Company Links are rendered in template
- Test that all Legal Links are rendered in template
- Test that Quick Links use `routerLink` directive
- Test that Company and Legal Links use `href="#"` placeholder

**5. Social Icons Tests:**
- Test that all 3 social icons (LinkedIn, Twitter, GitHub) are rendered
- Test that social links have `target="_blank"` attribute
- Test that social links have `rel="noopener noreferrer"` attribute
- Test that social URLs match `environment.social` values

**6. Copyright Tests:**
- Test that copyright text includes company name "Velobiz"
- Test that copyright text includes current year
- Test that copyright year updates dynamically (mock `new Date()`)

**7. Responsive Layout Tests (Optional - Integration Level):**
- Test that footer has CSS Grid layout classes
- Test that grid changes based on breakpoints (requires resize simulation)

**Implementation Steps:**
1. Set up TestBed with required imports (RouterTestingModule, MatIconModule)
2. Mock `environment.ts` values if needed
3. Write test specs using Jasmine `describe/it` blocks
4. Ensure 80%+ code coverage for FooterComponent

**Acceptance Criteria:**
- [ ] At least 12 test specs written
- [ ] All tests pass (`ng test --watch=false --browsers=ChromeHeadless`)
- [ ] Code coverage for FooterComponent is ≥80%
- [ ] Tests include at least 1 positive, 1 negative, and 1 edge case scenario
- [ ] Tests verify link rendering from config arrays
- [ ] Tests verify social icon attributes (target, rel)
- [ ] Tests verify copyright year is dynamic
- [ ] Tests verify all link arrays are correctly imported

---

## 4. Chunk Strategy

This feature consists of **1 chunk** (all tasks completed together):

**Chunk 1: Layout Shell (All Tasks)**
- TASK 1.1: Configuration
- TASK 1.2: NavbarComponent Desktop
- TASK 1.3: NavbarComponent Mobile
- TASK 1.4: FooterComponent
- TASK 1.5: Integration
- TASK 1.6: Unit Tests (Navbar)
- TASK 1.7: Unit Tests (Footer)

**Rationale:** Layout components are tightly coupled and must work together as a cohesive shell. It doesn't make sense to deploy a navbar without a footer or vice versa.

---

## 5. Testing Strategy Summary

| Test Type | Tool | Target | Coverage Goal |
|-----------|------|--------|---------------|
| Unit Tests | Jasmine + Karma | NavbarComponent, FooterComponent | 80%+ |
| Accessibility Tests | Manual + Lighthouse | Keyboard nav, ARIA, contrast | WCAG 2.1 AA |
| Visual Regression | Manual | Responsive layout at breakpoints | 100% |
| Integration Tests | Manual | App shell navigation | All routes |

**No API tests or E2E tests required for this feature** (no backend interaction).

---

## 6. Estimated Timeline

### If Working Sequentially (Single Developer)
- **Day 1 (4 hours)**: TASK 1.1, TASK 1.2
- **Day 2 (4 hours)**: TASK 1.3, TASK 1.4
- **Day 3 (3 hours)**: TASK 1.5, TASK 1.6, TASK 1.7

**Total: 11 hours (~1.5 working days)**

### If Working in Parallel (2 Developers)
- **Developer A**: TASK 1.1 → TASK 1.2 → TASK 1.3 → TASK 1.6 (6 hours)
- **Developer B**: TASK 1.1 (wait) → TASK 1.4 → TASK 1.7 (4 hours)
- **Both**: TASK 1.5 (integration, 1 hour)

**Total: 7 hours (~1 working day)**

---

## 7. Definition of Done (DoD) Checklist

A task is considered "Done" when:
- [ ] All code is written and committed to feature branch
- [ ] All acceptance criteria are met
- [ ] Unit tests are written and passing (80%+ coverage)
- [ ] No TypeScript compilation errors
- [ ] No linting errors (`ng lint` passes)
- [ ] Code follows Angular style guide and project conventions
- [ ] All styles use CSS custom properties (no hardcoded hex values)
- [ ] Components are standalone (no NgModule)
- [ ] Components use OnPush change detection
- [ ] Manual testing on Chrome, Firefox, Safari (desktop and mobile)
- [ ] Accessibility checklist completed (keyboard nav, ARIA, contrast)
- [ ] Code reviewed by Reviewer Agent
- [ ] Documentation updated (if applicable)

---

## 8. Rollback Plan

If this feature needs to be rolled back:
1. Remove `<app-navbar />` and `<app-footer />` from `app.component.html`
2. Delete `src/app/layout/` directory
3. Revert changes to `app.component.ts`, `app.component.html`, `app.component.scss`
4. Revert changes to `environment.ts` and `environment.prod.ts`
5. Rebuild and redeploy

**No database rollback required** (no database changes in this feature).

**No API rollback required** (no backend changes in this feature).

---

## 9. Post-Implementation Checklist

After completing all tasks:
- [ ] Run full test suite: `ng test --code-coverage --watch=false --browsers=ChromeHeadless`
- [ ] Verify code coverage is ≥80% for NavbarComponent and FooterComponent
- [ ] Run Lighthouse accessibility audit (score ≥90)
- [ ] Test on real devices: iOS Safari, Android Chrome
- [ ] Test all navigation links route correctly
- [ ] Test mobile menu on touchscreen devices
- [ ] Verify scroll transitions are smooth (no jank)
- [ ] Verify social links open in new tabs
- [ ] Take screenshots for documentation (desktop, tablet, mobile)
- [ ] Update FEATURE 1 status to "Complete" in feature tracker
- [ ] Notify Lead Agent that layout shell is ready for FEATURE 2 (Home Page)

---

**Document Version:** 1.0
**Last Updated:** 2026-02-20
**Total Tasks:** 9
**Total Estimated Time:** 11 hours
**Ready for Agent Assignment:** Yes
