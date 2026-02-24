# FEATURE 1: Layout (Navbar + Footer) — Test Plan

**Feature ID:** FEATURE-001
**Feature Name:** Layout (Navbar + Footer)
**Date:** 2026-02-20
**Status:** Ready for Testing

---

## 1. Test Strategy Overview

| Test Type | Tool/Framework | Coverage Goal | Priority |
|-----------|----------------|---------------|----------|
| Unit Tests | Jasmine + Karma | 80%+ | P0 (Critical) |
| Accessibility Tests | Lighthouse + Manual | WCAG 2.1 AA | P0 (Critical) |
| Visual Regression | Manual + Screenshots | 100% breakpoints | P1 (High) |
| Integration Tests | Manual | All routes | P1 (High) |
| Cross-Browser Tests | BrowserStack / Manual | 95%+ compatibility | P2 (Medium) |

---

## 2. Unit Test Plan

### 2.1 NavbarComponent Unit Tests

**File:** `src/app/layout/navbar/navbar.component.spec.ts`
**Framework:** Jasmine + Karma
**Test Count:** 15+ specs
**Coverage Goal:** 80%+

#### Test Suite 1: Component Initialization
```typescript
describe('NavbarComponent - Initialization', () => {
  it('should create the component', () => { ... });
  it('should initialize scrolled signal to false', () => { ... });
  it('should initialize menuOpen signal to false', () => { ... });
  it('should load navigation links from layout.config.ts', () => { ... });
  it('should have exactly 5 navigation links', () => { ... });
});
```

**Test Cases:**
| Test ID | Description | Type | Expected Result |
|---------|-------------|------|-----------------|
| NAV-UT-001 | Component creates successfully | ✅ Positive | Component instance is truthy |
| NAV-UT-002 | scrolled signal initializes to false | ✅ Positive | scrolled() === false |
| NAV-UT-003 | menuOpen signal initializes to false | ✅ Positive | menuOpen() === false |
| NAV-UT-004 | Navigation links loaded from config | ✅ Positive | navLinks === NAV_LINKS |
| NAV-UT-005 | Navigation links array has 5 items | ✅ Positive | navLinks.length === 5 |

---

#### Test Suite 2: Scroll Detection
```typescript
describe('NavbarComponent - Scroll Detection', () => {
  it('should set scrolled to true when scrolling past 100px', () => { ... });
  it('should set scrolled to false when scrolling back to top', () => { ... });
  it('should handle scroll at exactly 100px', () => { ... });
  it('should debounce scroll events', () => { ... });
  it('should not break on NaN scroll position', () => { ... });
});
```

**Test Cases:**
| Test ID | Description | Type | Expected Result |
|---------|-------------|------|-----------------|
| NAV-UT-006 | Scrolling to 150px sets scrolled = true | ✅ Positive | scrolled() === true |
| NAV-UT-007 | Scrolling to 50px sets scrolled = false | ✅ Positive | scrolled() === false |
| NAV-UT-008 | Scrolling to exactly 100px sets scrolled = true | 🚫 Edge Case | scrolled() === true |
| NAV-UT-009 | Scrolling to 99px keeps scrolled = false | 🚫 Edge Case | scrolled() === false |
| NAV-UT-010 | Scroll event is debounced (not called excessively) | ✅ Positive | onScroll called max 1x per 50ms |
| NAV-UT-011 | NaN scroll position does not throw error | ❌ Negative | No error thrown |

**Implementation Example:**
```typescript
it('should set scrolled to true when scrolling past 100px', () => {
  const fixture = TestBed.createComponent(NavbarComponent);
  const component = fixture.componentInstance;

  // Simulate scroll past 100px
  Object.defineProperty(window, 'pageYOffset', { value: 150, writable: true });
  window.dispatchEvent(new Event('scroll'));
  fixture.detectChanges();

  expect(component.scrolled()).toBe(true);
});
```

---

#### Test Suite 3: Mobile Menu Interactions
```typescript
describe('NavbarComponent - Mobile Menu', () => {
  it('should toggle menuOpen state when toggleMenu is called', () => { ... });
  it('should set menuOpen to false when closeMenu is called', () => { ... });
  it('should close menu when nav link is clicked', () => { ... });
  it('should close menu when Escape key is pressed', () => { ... });
});
```

**Test Cases:**
| Test ID | Description | Type | Expected Result |
|---------|-------------|------|-----------------|
| NAV-UT-012 | toggleMenu() switches menuOpen from false to true | ✅ Positive | menuOpen() === true |
| NAV-UT-013 | toggleMenu() switches menuOpen from true to false | ✅ Positive | menuOpen() === false |
| NAV-UT-014 | closeMenu() sets menuOpen to false | ✅ Positive | menuOpen() === false |
| NAV-UT-015 | Clicking nav link calls closeMenu() | ✅ Positive | closeMenu spy called |
| NAV-UT-016 | Pressing Escape key closes menu | ✅ Positive | menuOpen() === false |

**Implementation Example:**
```typescript
it('should close menu when Escape key is pressed', () => {
  const fixture = TestBed.createComponent(NavbarComponent);
  const component = fixture.componentInstance;

  component.menuOpen.set(true);
  expect(component.menuOpen()).toBe(true);

  const event = new KeyboardEvent('keydown', { key: 'Escape' });
  document.dispatchEvent(event);
  fixture.detectChanges();

  expect(component.menuOpen()).toBe(false);
});
```

---

#### Test Suite 4: Router Navigation
```typescript
describe('NavbarComponent - Router Navigation', () => {
  it('should navigate to / when logo is clicked', () => { ... });
  it('should navigate to /contact when "Get Started" is clicked', () => { ... });
  it('should navigate to correct route when nav link is clicked', () => { ... });
});
```

**Test Cases:**
| Test ID | Description | Type | Expected Result |
|---------|-------------|------|-----------------|
| NAV-UT-017 | Logo click navigates to / | ✅ Positive | router.navigate(['/']) called |
| NAV-UT-018 | "Get Started" button navigates to /contact | ✅ Positive | router.navigate(['/contact']) called |
| NAV-UT-019 | Services link navigates to /services | ✅ Positive | router.navigate(['/services']) called |

**Implementation Example:**
```typescript
it('should navigate to /contact when "Get Started" is clicked', () => {
  const fixture = TestBed.createComponent(NavbarComponent);
  const router = TestBed.inject(Router);
  spyOn(router, 'navigate');

  const compiled = fixture.nativeElement;
  const ctaButton = compiled.querySelector('.cta-button');
  ctaButton.click();

  expect(router.navigate).toHaveBeenCalledWith(['/contact']);
});
```

---

#### Test Suite 5: Accessibility Attributes
```typescript
describe('NavbarComponent - Accessibility', () => {
  it('should have aria-label on hamburger button', () => { ... });
  it('should have aria-expanded on hamburger button', () => { ... });
  it('should update aria-expanded when menuOpen changes', () => { ... });
  it('should have role="navigation" on mobile drawer', () => { ... });
});
```

**Test Cases:**
| Test ID | Description | Type | Expected Result |
|---------|-------------|------|-----------------|
| NAV-UT-020 | Hamburger button has aria-label | ✅ Positive | aria-label="Open navigation menu" |
| NAV-UT-021 | Hamburger button has aria-expanded="false" initially | ✅ Positive | aria-expanded="false" |
| NAV-UT-022 | Hamburger aria-expanded updates when menu opens | ✅ Positive | aria-expanded="true" |
| NAV-UT-023 | Mobile drawer has role="navigation" | ✅ Positive | role="navigation" |

---

### 2.2 FooterComponent Unit Tests

**File:** `src/app/layout/footer/footer.component.spec.ts`
**Framework:** Jasmine + Karma
**Test Count:** 12+ specs
**Coverage Goal:** 80%+

#### Test Suite 1: Component Initialization
```typescript
describe('FooterComponent - Initialization', () => {
  it('should create the component', () => { ... });
  it('should load Quick Links from layout.config.ts', () => { ... });
  it('should load Company Links from layout.config.ts', () => { ... });
  it('should load Legal Links from layout.config.ts', () => { ... });
  it('should load social links from environment.ts', () => { ... });
  it('should display current year in copyright', () => { ... });
});
```

**Test Cases:**
| Test ID | Description | Type | Expected Result |
|---------|-------------|------|-----------------|
| FOOT-UT-001 | Component creates successfully | ✅ Positive | Component instance is truthy |
| FOOT-UT-002 | Quick Links loaded from config | ✅ Positive | quickLinks === FOOTER_QUICK_LINKS |
| FOOT-UT-003 | Company Links loaded from config | ✅ Positive | companyLinks === FOOTER_COMPANY_LINKS |
| FOOT-UT-004 | Legal Links loaded from config | ✅ Positive | legalLinks === FOOTER_LEGAL_LINKS |
| FOOT-UT-005 | Social links loaded from environment | ✅ Positive | socialLinks === environment.social |
| FOOT-UT-006 | Current year is displayed dynamically | ✅ Positive | currentYear === new Date().getFullYear() |

---

#### Test Suite 2: Link Rendering
```typescript
describe('FooterComponent - Link Rendering', () => {
  it('should render all Quick Links in template', () => { ... });
  it('should render all Company Links in template', () => { ... });
  it('should render all Legal Links in template', () => { ... });
  it('should use routerLink for Quick Links', () => { ... });
  it('should use href="#" for placeholder links', () => { ... });
});
```

**Test Cases:**
| Test ID | Description | Type | Expected Result |
|---------|-------------|------|-----------------|
| FOOT-UT-007 | All 5 Quick Links rendered in DOM | ✅ Positive | 5 links found in Quick Links column |
| FOOT-UT-008 | All 3 Company Links rendered in DOM | ✅ Positive | 3 links found in Company column |
| FOOT-UT-009 | All 3 Legal Links rendered in DOM | ✅ Positive | 3 links found in Legal column |
| FOOT-UT-010 | Quick Links have routerLink directive | ✅ Positive | routerLink attribute present |
| FOOT-UT-011 | Company Links have href="#" | ✅ Positive | href="#" attribute present |

**Implementation Example:**
```typescript
it('should render all Quick Links in template', () => {
  const fixture = TestBed.createComponent(FooterComponent);
  fixture.detectChanges();

  const compiled = fixture.nativeElement;
  const quickLinks = compiled.querySelectorAll('.quick-links a');

  expect(quickLinks.length).toBe(5);
});
```

---

#### Test Suite 3: Social Icons
```typescript
describe('FooterComponent - Social Icons', () => {
  it('should render all 3 social icons', () => { ... });
  it('should have target="_blank" on social links', () => { ... });
  it('should have rel="noopener noreferrer" on social links', () => { ... });
  it('should use correct social URLs from environment', () => { ... });
});
```

**Test Cases:**
| Test ID | Description | Type | Expected Result |
|---------|-------------|------|-----------------|
| FOOT-UT-012 | All 3 social icons rendered (LinkedIn, Twitter, GitHub) | ✅ Positive | 3 social links in DOM |
| FOOT-UT-013 | Social links have target="_blank" | ✅ Positive | target="_blank" on all social links |
| FOOT-UT-014 | Social links have rel="noopener noreferrer" | ✅ Positive | rel="noopener noreferrer" on all social links |
| FOOT-UT-015 | LinkedIn URL matches environment.social.linkedin | ✅ Positive | href === environment.social.linkedin |

**Implementation Example:**
```typescript
it('should have rel="noopener noreferrer" on social links', () => {
  const fixture = TestBed.createComponent(FooterComponent);
  fixture.detectChanges();

  const compiled = fixture.nativeElement;
  const socialLinks = compiled.querySelectorAll('.social-icon-button');

  socialLinks.forEach((link: HTMLAnchorElement) => {
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
  });
});
```

---

#### Test Suite 4: Copyright Text
```typescript
describe('FooterComponent - Copyright', () => {
  it('should display company name in copyright', () => { ... });
  it('should display current year in copyright', () => { ... });
  it('should update year dynamically when date changes', () => { ... });
});
```

**Test Cases:**
| Test ID | Description | Type | Expected Result |
|---------|-------------|------|-----------------|
| FOOT-UT-016 | Copyright includes "VelocityAI" | ✅ Positive | Copyright text contains "VelocityAI" |
| FOOT-UT-017 | Copyright includes current year | ✅ Positive | Copyright text contains "2026" (or current year) |
| FOOT-UT-018 | Year updates when Date is mocked | 🚫 Edge Case | Mocking Date returns correct year |

---

## 3. Accessibility Test Plan

### 3.1 Keyboard Navigation Tests

**Tool:** Manual Testing
**Priority:** P0 (Critical)
**WCAG Requirement:** WCAG 2.1 AA - Keyboard Accessible (2.1.1)

| Test ID | Test Case | Expected Result | Pass/Fail |
|---------|-----------|-----------------|-----------|
| ACC-001 | Tab key moves focus to logo | Logo receives focus outline | [ ] |
| ACC-002 | Tab key moves through all nav links | Focus moves in logical order | [ ] |
| ACC-003 | Tab key reaches "Get Started" button | Button receives focus outline | [ ] |
| ACC-004 | Tab key reaches hamburger button (mobile) | Button receives focus outline | [ ] |
| ACC-005 | Enter key activates focused link | Navigation occurs | [ ] |
| ACC-006 | Enter key on hamburger opens menu | Mobile menu opens | [ ] |
| ACC-007 | Escape key closes mobile menu | Menu closes, focus returns to hamburger | [ ] |
| ACC-008 | Tab inside mobile menu moves through links | Focus moves in logical order | [ ] |
| ACC-009 | Shift+Tab moves focus backward | Focus moves in reverse order | [ ] |
| ACC-010 | Tab key reaches all footer links | All links are keyboard accessible | [ ] |
| ACC-011 | Tab key reaches all social icons | All social icons are keyboard accessible | [ ] |

**Test Environment:**
- Chrome (keyboard only, no mouse)
- Firefox (keyboard only, no mouse)
- Safari (keyboard only, no mouse)

---

### 3.2 Screen Reader Tests

**Tool:** NVDA (Windows), JAWS (Windows), VoiceOver (macOS)
**Priority:** P1 (High)
**WCAG Requirement:** WCAG 2.1 AA - Name, Role, Value (4.1.2)

| Test ID | Test Case | Expected Announcement | Pass/Fail |
|---------|-----------|----------------------|-----------|
| ACC-012 | Screen reader on logo | "VelocityAI, link, home" | [ ] |
| ACC-013 | Screen reader on nav link | "Services, link" | [ ] |
| ACC-014 | Screen reader on "Get Started" button | "Get Started, button, link" | [ ] |
| ACC-015 | Screen reader on hamburger button | "Open navigation menu, button, not expanded" | [ ] |
| ACC-016 | Screen reader on hamburger (menu open) | "Open navigation menu, button, expanded" | [ ] |
| ACC-017 | Screen reader on mobile drawer | "Main navigation, navigation" | [ ] |
| ACC-018 | Screen reader on social icon | "Visit VelocityAI on LinkedIn, link" | [ ] |
| ACC-019 | Screen reader on footer link | "Privacy Policy, link" | [ ] |

**Test Procedure:**
1. Enable screen reader (NVDA, JAWS, or VoiceOver)
2. Navigate to website with keyboard (Tab key)
3. Listen to announcements for each interactive element
4. Verify announcements match expected text and include role (link, button, navigation)

---

### 3.3 Color Contrast Tests

**Tool:** Chrome DevTools Contrast Checker + Lighthouse
**Priority:** P0 (Critical)
**WCAG Requirement:** WCAG 2.1 AA - Contrast (Minimum) (1.4.3)

| Test ID | Element | Foreground | Background | Ratio | Requirement | Pass/Fail |
|---------|---------|------------|------------|-------|-------------|-----------|
| ACC-020 | Nav link (default) | #a0a0b0 | #0a0a0f | 8.2:1 | 4.5:1 (AA) | [ ] |
| ACC-021 | Nav link (active) | #00e5a0 | #0a0a0f | 10.5:1 | 4.5:1 (AA) | [ ] |
| ACC-022 | CTA button text | #0a0a0f | #00e5a0 | 10.5:1 | 4.5:1 (AA) | [ ] |
| ACC-023 | Footer link | #a0a0b0 | #0a0a0f | 8.2:1 | 4.5:1 (AA) | [ ] |
| ACC-024 | Copyright text | #a0a0b0 (70%) | #0a0a0f | 5.8:1 | 4.5:1 (AA) | [ ] |
| ACC-025 | Footer heading | #ffffff | #0a0a0f | 21:1 | 4.5:1 (AA) | [ ] |

**Test Procedure:**
1. Open Chrome DevTools → Accessibility tab
2. Inspect each text element
3. Verify contrast ratio meets WCAG AA minimum (4.5:1 for body text, 3:1 for large text)
4. Run Lighthouse accessibility audit (target score ≥90)

---

### 3.4 Focus Indicator Tests

**Tool:** Manual Visual Inspection
**Priority:** P1 (High)
**WCAG Requirement:** WCAG 2.1 AA - Focus Visible (2.4.7)

| Test ID | Test Case | Expected Result | Pass/Fail |
|---------|-----------|-----------------|-----------|
| ACC-026 | Focus outline is visible on all links | 2px teal outline with 4px offset | [ ] |
| ACC-027 | Focus outline is visible on buttons | 2px teal outline with 4px offset | [ ] |
| ACC-028 | Focus outline is NOT hidden by CSS | outline: none is NOT present | [ ] |
| ACC-029 | Focus indicator has sufficient contrast | Contrast ratio ≥3:1 against background | [ ] |

---

### 3.5 Touch Target Size Tests (Mobile)

**Tool:** Chrome DevTools Device Mode + Real Devices
**Priority:** P1 (High)
**WCAG Requirement:** WCAG 2.1 AA - Target Size (2.5.5)

| Test ID | Element | Width | Height | Requirement | Pass/Fail |
|---------|---------|-------|--------|-------------|-----------|
| ACC-030 | Mobile nav link | ≥44px | ≥44px | 44×44px min | [ ] |
| ACC-031 | Hamburger button | ≥44px | ≥44px | 44×44px min | [ ] |
| ACC-032 | "Get Started" button | ≥44px | ≥44px | 44×44px min | [ ] |
| ACC-033 | Footer link | ≥44px | ≥44px | 44×44px min | [ ] |
| ACC-034 | Social icon button | ≥44px | ≥44px | 44×44px min | [ ] |

**Test Procedure:**
1. Open Chrome DevTools → Device Mode
2. Select mobile device (iPhone 12, Pixel 5)
3. Inspect each interactive element
4. Verify width and height are both ≥44px
5. Test on real touchscreen device (tap with finger, not stylus)

---

## 4. Visual Regression Test Plan

### 4.1 Responsive Layout Tests

**Tool:** Manual + Screenshot Comparison
**Priority:** P1 (High)

| Test ID | Breakpoint | Screen Width | Expected Layout | Pass/Fail |
|---------|-----------|--------------|-----------------|-----------|
| VIS-001 | Mobile | 320px | Hamburger menu, 1-column footer | [ ] |
| VIS-002 | Mobile | 375px (iPhone SE) | Hamburger menu, 1-column footer | [ ] |
| VIS-003 | Mobile | 414px (iPhone 12) | Hamburger menu, 1-column footer | [ ] |
| VIS-004 | Tablet | 768px | Horizontal nav, 2-column footer | [ ] |
| VIS-005 | Tablet | 820px (iPad) | Horizontal nav, 2-column footer | [ ] |
| VIS-006 | Desktop | 1024px | Horizontal nav, 4-column footer | [ ] |
| VIS-007 | Desktop | 1440px | Horizontal nav, 4-column footer (centered) | [ ] |
| VIS-008 | Large Desktop | 1920px | Horizontal nav, 4-column footer (centered) | [ ] |

**Test Procedure:**
1. Open website in Chrome DevTools Device Mode
2. Set viewport width to test size
3. Take screenshot of navbar and footer
4. Compare against design mockups
5. Verify no horizontal scroll
6. Verify no layout breaks or overlaps

---

### 4.2 Navbar Scroll State Tests

**Tool:** Manual Visual Inspection
**Priority:** P0 (Critical)

| Test ID | Test Case | Expected Visual Result | Pass/Fail |
|---------|-----------|------------------------|-----------|
| VIS-009 | Navbar at top of homepage (scroll = 0) | Transparent background, height 80px | [ ] |
| VIS-010 | Navbar scrolled 150px on homepage | Frosted glass background, height 64px | [ ] |
| VIS-011 | Navbar on Services page (not homepage) | Solid background (no transparent state) | [ ] |
| VIS-012 | Scroll transition animation | Smooth 300ms transition (no jank) | [ ] |
| VIS-013 | Logo scale animation on scroll | Logo scales to 90% smoothly | [ ] |
| VIS-014 | Bottom border appears on scroll | 1px white border visible (10% opacity) | [ ] |

---

### 4.3 Mobile Menu Tests

**Tool:** Manual Visual Inspection
**Priority:** P0 (Critical)

| Test ID | Test Case | Expected Visual Result | Pass/Fail |
|---------|-----------|------------------------|-----------|
| VIS-015 | Mobile menu closed | Drawer not visible | [ ] |
| VIS-016 | Mobile menu opening animation | Drawer slides in from right (300ms) | [ ] |
| VIS-017 | Mobile menu open | Drawer visible, backdrop overlay present | [ ] |
| VIS-018 | Mobile menu links | Links stacked vertically, proper spacing | [ ] |
| VIS-019 | Mobile menu closing animation | Drawer slides out to right (300ms) | [ ] |
| VIS-020 | Backdrop click | Menu closes, backdrop fades out | [ ] |

---

## 5. Integration Test Plan

### 5.1 Cross-Page Navigation Tests

**Tool:** Manual Testing
**Priority:** P0 (Critical)

| Test ID | Test Case | Expected Result | Pass/Fail |
|---------|-----------|-----------------|-----------|
| INT-001 | Navigate from Home to Services via navbar | Services page loads, navbar persists | [ ] |
| INT-002 | Navigate from Services to Pricing via navbar | Pricing page loads, navbar persists | [ ] |
| INT-003 | Navigate from Pricing to FAQ via navbar | FAQ page loads, navbar persists | [ ] |
| INT-004 | Navigate from FAQ to Contact via navbar | Contact page loads, navbar persists | [ ] |
| INT-005 | Click logo on any page | Returns to homepage | [ ] |
| INT-006 | Click "Get Started" on any page | Navigates to Contact page | [ ] |
| INT-007 | Use browser back button | Navbar and footer remain visible | [ ] |
| INT-008 | Use browser forward button | Navbar and footer remain visible | [ ] |

---

### 5.2 Active Link Highlighting Tests

**Tool:** Manual Testing
**Priority:** P1 (High)

| Test ID | Test Case | Expected Result | Pass/Fail |
|---------|-----------|-----------------|-----------|
| INT-009 | On homepage, "Home" link is active | "Home" has teal color and bold weight | [ ] |
| INT-010 | On Services page, "Services" link is active | "Services" has teal color and bold weight | [ ] |
| INT-011 | On Pricing page, "Pricing" link is active | "Pricing" has teal color and bold weight | [ ] |
| INT-012 | On FAQ page, "FAQ" link is active | "FAQ" has teal color and bold weight | [ ] |
| INT-013 | On Contact page, "Contact" link is active | "Contact" has teal color and bold weight | [ ] |

---

### 5.3 Footer Link Tests

**Tool:** Manual Testing
**Priority:** P1 (High)

| Test ID | Test Case | Expected Result | Pass/Fail |
|---------|-----------|-----------------|-----------|
| INT-014 | Click "Home" in footer Quick Links | Navigates to homepage | [ ] |
| INT-015 | Click "Services" in footer Quick Links | Navigates to Services page | [ ] |
| INT-016 | Click "Privacy Policy" in footer | Navigates to # placeholder (no error) | [ ] |
| INT-017 | Click "About" in footer | Navigates to # placeholder (no error) | [ ] |
| INT-018 | Click LinkedIn icon in footer | Opens LinkedIn page in new tab | [ ] |
| INT-019 | Click Twitter icon in footer | Opens Twitter page in new tab | [ ] |
| INT-020 | Click GitHub icon in footer | Opens GitHub page in new tab | [ ] |

---

## 6. Cross-Browser Test Plan

### 6.1 Browser Compatibility Tests

**Tool:** BrowserStack or Manual Testing
**Priority:** P2 (Medium)

| Test ID | Browser | Version | OS | Expected Result | Pass/Fail |
|---------|---------|---------|----|-----------------|-----------|
| CROSS-001 | Chrome | 120+ | Windows 11 | All features work | [ ] |
| CROSS-002 | Chrome | 120+ | macOS Sonoma | All features work | [ ] |
| CROSS-003 | Firefox | 120+ | Windows 11 | All features work | [ ] |
| CROSS-004 | Firefox | 120+ | macOS Sonoma | All features work | [ ] |
| CROSS-005 | Safari | 16+ | macOS Sonoma | All features work | [ ] |
| CROSS-006 | Safari | 16+ | iOS 17 (iPhone) | All features work | [ ] |
| CROSS-007 | Edge | 120+ | Windows 11 | All features work | [ ] |
| CROSS-008 | Chrome | 120+ | Android 13 | All features work | [ ] |

**Features to Test:**
- Navbar scroll transition (backdrop-filter: blur)
- Mobile menu slide animation
- Router navigation
- Focus indicators
- Hover effects

**Known Issues:**
- Older browsers may not support `backdrop-filter` (graceful degradation: solid background instead of blur)

---

### 6.2 Mobile Device Tests

**Tool:** Real Devices
**Priority:** P1 (High)

| Test ID | Device | OS | Screen Size | Pass/Fail |
|---------|--------|----|-----------|-----------|
| MOB-001 | iPhone 12 | iOS 17 | 390×844 | [ ] |
| MOB-002 | iPhone SE | iOS 17 | 375×667 | [ ] |
| MOB-003 | iPhone 14 Pro | iOS 17 | 393×852 | [ ] |
| MOB-004 | Samsung Galaxy S21 | Android 13 | 360×800 | [ ] |
| MOB-005 | Google Pixel 6 | Android 13 | 412×915 | [ ] |
| MOB-006 | iPad Air | iOS 17 | 820×1180 | [ ] |
| MOB-007 | Samsung Galaxy Tab | Android 13 | 800×1280 | [ ] |

**Test Checklist for Each Device:**
- [ ] Hamburger menu opens/closes smoothly
- [ ] Touch targets are large enough (44×44px min)
- [ ] No horizontal scroll on any page
- [ ] Footer columns reflow correctly
- [ ] All links are tappable
- [ ] Scroll transitions are smooth (no jank)

---

## 7. Performance Test Plan

### 7.1 Lighthouse Audit

**Tool:** Chrome Lighthouse
**Priority:** P1 (High)
**Target Scores:**
- Performance: ≥90
- Accessibility: ≥90
- Best Practices: ≥90
- SEO: ≥90

| Test ID | Page | Performance | Accessibility | Best Practices | SEO | Pass/Fail |
|---------|------|-------------|---------------|----------------|-----|-----------|
| PERF-001 | Home | ≥90 | ≥90 | ≥90 | ≥90 | [ ] |
| PERF-002 | Services | ≥90 | ≥90 | ≥90 | ≥90 | [ ] |
| PERF-003 | Pricing | ≥90 | ≥90 | ≥90 | ≥90 | [ ] |
| PERF-004 | FAQ | ≥90 | ≥90 | ≥90 | ≥90 | [ ] |
| PERF-005 | Contact | ≥90 | ≥90 | ≥90 | ≥90 | [ ] |

---

### 7.2 Scroll Performance Tests

**Tool:** Chrome DevTools Performance Profiler
**Priority:** P2 (Medium)

| Test ID | Test Case | Expected Result | Pass/Fail |
|---------|-----------|-----------------|-----------|
| PERF-006 | Scroll event frequency | Max 1 event per 50ms (debounced) | [ ] |
| PERF-007 | Scroll transition frame rate | 60fps (no dropped frames) | [ ] |
| PERF-008 | Navbar re-render count | Max 1 re-render per scroll state change | [ ] |

**Test Procedure:**
1. Open Chrome DevTools → Performance tab
2. Start recording
3. Scroll page from top to bottom
4. Stop recording
5. Analyze frame rate (target: 60fps)
6. Verify scroll events are debounced

---

## 8. Security Test Plan

### 8.1 External Link Security

**Tool:** Manual Inspection
**Priority:** P1 (High)

| Test ID | Test Case | Expected Result | Pass/Fail |
|---------|-----------|-----------------|-----------|
| SEC-001 | All social links have target="_blank" | target="_blank" attribute present | [ ] |
| SEC-002 | All social links have rel="noopener noreferrer" | rel="noopener noreferrer" attribute present | [ ] |
| SEC-003 | No external links missing security attributes | All external links secured | [ ] |

**Why This Matters:**
- `target="_blank"` without `rel="noopener"` allows opened page to access `window.opener` (security risk)
- `rel="noopener noreferrer"` prevents reverse tabnabbing attacks

---

## 9. Test Execution Schedule

### Phase 1: Unit Tests (Day 1)
- Run all NavbarComponent unit tests (TASK 1.6)
- Run all FooterComponent unit tests (TASK 1.7)
- Verify 80%+ code coverage
- Fix any failing tests

### Phase 2: Accessibility Tests (Day 2)
- Keyboard navigation tests (ACC-001 to ACC-011)
- Screen reader tests (ACC-012 to ACC-019)
- Color contrast tests (ACC-020 to ACC-025)
- Focus indicator tests (ACC-026 to ACC-029)
- Touch target tests (ACC-030 to ACC-034)
- Run Lighthouse accessibility audit

### Phase 3: Visual Regression Tests (Day 2)
- Responsive layout tests at all breakpoints (VIS-001 to VIS-008)
- Navbar scroll state tests (VIS-009 to VIS-014)
- Mobile menu tests (VIS-015 to VIS-020)

### Phase 4: Integration Tests (Day 3)
- Cross-page navigation tests (INT-001 to INT-008)
- Active link highlighting tests (INT-009 to INT-013)
- Footer link tests (INT-014 to INT-020)

### Phase 5: Cross-Browser Tests (Day 3)
- Browser compatibility tests (CROSS-001 to CROSS-008)
- Mobile device tests (MOB-001 to MOB-007)

### Phase 6: Performance Tests (Day 3)
- Lighthouse audits (PERF-001 to PERF-005)
- Scroll performance tests (PERF-006 to PERF-008)

### Phase 7: Security Tests (Day 3)
- External link security tests (SEC-001 to SEC-003)

---

## 10. Bug Reporting Template

When a test fails, create a bug report using this template:

**Bug ID:** BUG-[Feature]-[Number]
**Test ID:** [Test ID that failed]
**Severity:** Critical / High / Medium / Low
**Priority:** P0 / P1 / P2 / P3
**Environment:** Browser, OS, Device
**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3
**Expected Result:** [What should happen]
**Actual Result:** [What actually happened]
**Screenshot/Video:** [Attach if applicable]
**Notes:** [Any additional context]

---

## 11. Test Coverage Summary

| Test Category | Test Count | Estimated Time | Priority |
|---------------|-----------|----------------|----------|
| Unit Tests | 30+ specs | 3 hours | P0 |
| Accessibility Tests | 34 tests | 2 hours | P0 |
| Visual Regression Tests | 20 tests | 2 hours | P1 |
| Integration Tests | 20 tests | 1.5 hours | P0 |
| Cross-Browser Tests | 15 tests | 2 hours | P2 |
| Performance Tests | 8 tests | 1 hour | P1 |
| Security Tests | 3 tests | 30 minutes | P1 |
| **TOTAL** | **130+ tests** | **12 hours** | - |

---

## 12. Exit Criteria

This feature is considered **FULLY TESTED** and ready for production when:
- [ ] All P0 (Critical) tests pass (Unit + Accessibility + Integration)
- [ ] All P1 (High) tests pass (Visual Regression + Performance)
- [ ] Code coverage is ≥80% for NavbarComponent and FooterComponent
- [ ] Lighthouse Accessibility score is ≥90 on all pages
- [ ] No critical or high-severity bugs remain open
- [ ] All external links have proper security attributes
- [ ] Navbar and footer work correctly on all supported browsers and devices
- [ ] Test execution report is reviewed and approved by Lead Agent

---

**Document Version:** 1.0
**Last Updated:** 2026-02-20
**Total Test Cases:** 130+
**Estimated Testing Time:** 12 hours
**Ready for Execution:** Yes
