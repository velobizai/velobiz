# FEATURE 1: Layout (Navbar + Footer) — Requirements Specification

**Feature ID:** FEATURE-001
**Feature Name:** Layout (Navbar + Footer)
**Date:** 2026-02-20
**Status:** Planning Complete
**Dependencies:** FEATURE 0 (Infrastructure)

---

## 1. Business Problem

VelocityAI website visitors need a consistent, intuitive way to navigate between different pages and sections. Without a persistent navigation shell, users would struggle to:
- Find key information (services, pricing, contact)
- Understand the brand identity
- Navigate back to the homepage
- Access social media channels or legal information

The Navbar and Footer components solve this fundamental UX challenge by providing:
- **Wayfinding**: Clear navigation across all pages
- **Brand consistency**: Persistent logo and visual identity
- **Call-to-action**: Easy access to contact/conversion points
- **Trust signals**: Legal links, social proof, professional polish

---

## 2. Target Users

### Primary Users
- **Potential clients** browsing AI automation services
- **Business owners** and operations managers exploring VelocityAI's offerings
- **Visitors** seeking company information and contact details

### User Goals
- Navigate between Services, Pricing, FAQ, and Contact pages seamlessly
- Access key information from any page via persistent navigation
- Understand the brand identity and value proposition through consistent branding
- Connect via social media or contact form
- Find legal/compliance information (privacy policy, terms)

---

## 3. Success Criteria

### Functional Success Criteria
1. ✅ All navigation links route correctly to their respective pages (Home, Services, Pricing, FAQ, Contact)
2. ✅ "Get Started" CTA button routes to `/contact` page
3. ✅ Logo clicks return users to homepage (`/`)
4. ✅ Active link highlighting works based on current route (via `RouterLinkActive`)
5. ✅ Scrollspy detects which section is in viewport and highlights corresponding nav link
6. ✅ Mobile hamburger menu opens/closes smoothly with backdrop overlay
7. ✅ Clicking any navigation link in mobile menu closes the drawer automatically
8. ✅ All social media links open in new tabs with `rel="noopener noreferrer"` security attributes
9. ✅ Footer columns reflow correctly on tablet and mobile breakpoints

### Performance Success Criteria
10. ✅ Navbar scroll transition completes in <300ms
11. ✅ Mobile menu animation completes in <300ms
12. ✅ No layout jank during navbar height/opacity transitions
13. ✅ Scroll event is debounced to max 50ms intervals (no performance degradation)

### Accessibility Success Criteria (WCAG 2.1 AA)
14. ✅ All links have descriptive text (no generic "click here")
15. ✅ Hamburger menu has `aria-label="Open navigation menu"` and `aria-expanded` state
16. ✅ Mobile menu has `role="navigation"` and `aria-label="Main navigation"`
17. ✅ Keyboard navigation works: Tab through links, Enter to activate, Escape to close menu
18. ✅ Focus visible indicators have 2px teal outline with offset
19. ✅ Color contrast meets 4.5:1 minimum for all text
20. ✅ Touch targets are minimum 44px × 44px on mobile

### Measurement Methods
- **Click tracking**: Monitor navigation link click-through rates via analytics
- **Lighthouse scores**: Accessibility ≥90, Performance ≥90
- **Mobile usability**: Test on iOS Safari 16+, Android Chrome 120+
- **User testing**: 5-second test for navigation clarity
- **Analytics**: Bounce rate on pages accessed via navbar links

---

## 4. User Stories

### US-001: Desktop Navigation
**As a** potential client visiting the VelocityAI website on desktop,
**I want** a sticky navigation bar with clear links to all main pages,
**So that** I can easily explore services, pricing, and contact information without scrolling back to the top.

**Acceptance Criteria:**
- Navbar is fixed at the top and remains visible on scroll
- Navigation links (Home, Services, Pricing, FAQ, Contact) are visible and clickable
- Current page is visually highlighted in the navbar
- Clicking the logo returns to the homepage

---

### US-002: Mobile Navigation
**As a** mobile user browsing on a smartphone,
**I want** a collapsible hamburger menu,
**So that** I can access all navigation links without cluttering the small screen.

**Acceptance Criteria:**
- Hamburger icon is visible on screens <768px
- Tapping hamburger opens a slide-in drawer from the right
- Drawer displays all navigation links vertically
- Tapping a link navigates to the page AND closes the drawer
- Tapping the backdrop closes the drawer
- Pressing Escape key closes the drawer

---

### US-003: Scroll State Transition
**As a** user scrolling down the homepage,
**I want** the navbar to transition from transparent to frosted glass,
**So that** the hero section is fully visible while still maintaining navigation access.

**Acceptance Criteria:**
- Navbar starts transparent on the homepage hero section
- After scrolling 100px, navbar gains semi-transparent background with blur effect
- Navbar height shrinks from 80px to 64px on scroll
- A subtle border appears at the bottom of the navbar when scrolled
- Transition is smooth (<300ms) with no layout jank

---

### US-004: Call-to-Action Access
**As a** visitor interested in VelocityAI's services,
**I want** a prominent "Get Started" button in the navbar,
**So that** I can easily navigate to the contact form from any page.

**Acceptance Criteria:**
- "Get Started" CTA button is visible on all pages in the navbar
- Button uses teal accent color (#00e5a0) with dark text
- Clicking the button navigates to `/contact` page
- Button has a glowing hover effect

---

### US-005: Footer Information Access
**As a** visitor exploring the website,
**I want** a comprehensive footer with quick links and company information,
**So that** I can access legal policies, social media, and navigate to other pages from the bottom of any page.

**Acceptance Criteria:**
- Footer displays company branding (logo, tagline, description)
- Footer includes Quick Links column (Home, Services, Pricing, FAQ, Contact)
- Footer includes Company column (About, Careers, Blog)
- Footer includes Legal column (Privacy Policy, Terms, Cookie Policy)
- Footer includes social media icons (LinkedIn, Twitter, GitHub) that open in new tabs
- Footer displays copyright notice: "© 2026 VelocityAI. All rights reserved."
- Footer layout is responsive (4 columns → 2 columns → 1 column)

---

### US-006: Accessibility and Keyboard Navigation
**As a** keyboard-only user,
**I want** full keyboard access to all navigation elements,
**So that** I can navigate the site without a mouse.

**Acceptance Criteria:**
- Tab key moves focus through all navbar links in logical order
- Enter key activates the focused link
- Escape key closes the mobile menu if open
- Focus indicators are clearly visible with teal outline
- Screen readers announce link labels and menu state correctly

---

## 5. Functional Requirements

### FR-001: Navbar Core Functionality
- Navbar must be fixed/sticky at the top of all pages
- Logo/branding must be clickable and route to `/`
- Navigation links must route to: Home (`/`), Services (`/services`), Pricing (`/pricing`), FAQ (`/faq`), Contact (`/contact`)
- "Get Started" CTA button must route to `/contact`
- Current page must be highlighted using Angular `RouterLinkActive` directive

### FR-002: Navbar Scroll Behavior
- Navbar scroll state must be tracked using `@HostListener('window:scroll')` and Angular Signal
- On homepage hero section (scroll position = 0), navbar background is transparent
- After scrolling >100px, navbar gains frosted-glass effect: `backdrop-filter: blur(12px)` with `rgba(10, 10, 15, 0.8)` background
- Navbar height transitions from 80px to 64px on scroll
- A 1px bottom border (`rgba(255, 255, 255, 0.1)`) appears when scrolled

### FR-003: Mobile Hamburger Menu
- On screens <768px, horizontal navigation is replaced with hamburger icon
- Hamburger icon uses Material icon "menu"
- Mobile menu is implemented using Angular Material `MatSidenav` with `position="end"` (slides from right)
- Mobile menu displays all navigation links vertically
- Clicking any link navigates AND closes the drawer
- Clicking backdrop or pressing Escape closes the drawer
- Body scroll is disabled when menu is open (handled by Material Sidenav)

### FR-004: Scrollspy Active Link Highlighting
- Use `IntersectionObserver` to detect which page section is in viewport (for single-page scrolling)
- Update active nav link based on current section ID (e.g., "Services" link highlights when `#services` section is visible)
- Fallback: Use `RouterLinkActive="active"` for multi-page route-based highlighting
- Active link styling: `color: var(--color-accent)` and `font-weight: 600`

### FR-005: Footer Core Functionality
- Footer must display 4 columns on desktop (>1024px):
  - Column 1: Brand (logo, tagline, description)
  - Column 2: Quick Links (Home, Services, Pricing, FAQ, Contact)
  - Column 3: Company (About, Careers, Blog)
  - Column 4: Legal (Privacy Policy, Terms of Service, Cookie Policy)
- Footer layout must collapse to 2 columns on tablet (768px–1024px)
- Footer layout must collapse to 1 column on mobile (<768px)
- Footer must include social media icons row (LinkedIn, Twitter, GitHub)
- Social links must open in new tabs with `target="_blank"` and `rel="noopener noreferrer"`
- Footer must display copyright notice: "© 2026 VelocityAI. All rights reserved."

### FR-006: Configuration Management
- Navigation links array must be defined as const in `src/app/layout/layout.config.ts`
- Social media URLs must be stored in `environment.ts` configuration file
- Footer link columns must be defined as const in `layout.config.ts`
- No hardcoded URLs or links directly in templates

---

## 6. Non-Functional Requirements

### NFR-001: Performance
- Navbar scroll event must be debounced to maximum 50ms intervals to prevent excessive re-renders
- Mobile menu animation duration must be <300ms for smooth UX
- Navbar height/opacity transitions must use CSS transitions (not JavaScript animations) for GPU acceleration
- No layout jank or content jumping during scroll transitions

### NFR-002: Accessibility (WCAG 2.1 AA Compliance)
- All links must have descriptive text (no "click here" or generic labels)
- Hamburger menu button must include `aria-label="Open navigation menu"` and `aria-expanded="false|true"`
- Mobile menu must include `role="navigation"` and `aria-label="Main navigation"`
- Keyboard navigation: Tab through all links, Enter to activate, Escape to close mobile menu
- Focus visible indicators: 2px teal outline with offset
- Color contrast: minimum 4.5:1 for all text elements
- Touch-friendly tap targets: minimum 44px × 44px for all buttons and links

### NFR-003: Mobile Responsiveness
- No horizontal scroll on any device width (320px–1920px+)
- Touch targets minimum 44px × 44px for mobile devices
- Mobile menu: 100vh height with scrollable content if menu items overflow
- Mobile menu width: 280px on mobile (<768px), 320px on tablet (768px–1024px)
- Test on real devices: iOS Safari 16+, Android Chrome 120+

### NFR-004: SEO and Semantic HTML
- Use semantic HTML: `<nav>`, `<footer>`, `<ul>`, `<a>` tags (not `<div>` with click handlers)
- Logo as `<div>` (H1 reserved for page content)
- All external links include `rel="noopener noreferrer"` for security
- Footer placeholder links use `<a href="#">` (not `<a>` without href)

### NFR-005: Code Quality
- Angular 19 standalone components (no NgModule)
- OnPush change detection strategy for performance
- Signals for scroll state management (not RxJS BehaviorSubject)
- No jQuery or vanilla JS DOM manipulation
- Footer layout using CSS Grid (not Flexbox)
- All component styles use CSS custom properties (no hardcoded hex values)

---

## 7. Out of Scope

The following are explicitly NOT included in this feature:

1. **Newsletter signup form in footer** — Will be added in a future feature when backend newsletter endpoint is fully implemented
2. **User authentication/login** — No user session or authentication state in navbar
3. **Shopping cart or notification badges** — No dynamic counters in navbar
4. **Search functionality** — No search bar in navbar
5. **Mega menu dropdowns** — Simple flat navigation only (no nested menus)
6. **Breadcrumb navigation** — Not part of persistent layout shell
7. **Blog or latest posts** — No dynamic content fetching in footer
8. **Language switcher** — Single language only (English)
9. **Dark mode toggle** — Theme is fixed (dark luxury theme)
10. **Analytics tracking code** — Integration deferred to separate analytics feature

---

## 8. Dependencies

### Upstream Dependencies (Must Complete First)
- **FEATURE 0: Infrastructure**
  - Angular 19 project scaffold with Angular Material theme
  - CSS custom properties defined in global styles (color theme variables)
  - Shared Angular services: ToastService, ApiService
  - ScrollRevealDirective created (though not heavily used in this feature)
  - Routing configured in `app.routes.ts`

### Downstream Dependencies (Depend on This Feature)
- **FEATURE 2: Home/Landing Page** — Uses navbar and footer shell
- **FEATURE 3: Services Page** — Uses navbar and footer shell
- **FEATURE 4: Pricing Page** — Uses navbar and footer shell
- **FEATURE 5: FAQ Page** — Uses navbar and footer shell
- **FEATURE 6: Contact Page** — Receives navigation from "Get Started" CTA

---

## 9. Risks and Assumptions

### Assumptions
1. All navigation links route to Angular routes defined in `app.routes.ts` (no external URLs)
2. Social media URLs in `environment.ts` are valid and maintained by client
3. Legal links (Privacy, Terms, Cookies) point to placeholder `#` routes initially (pages not yet built)
4. The homepage has a hero section at the top where transparent navbar makes sense
5. Scroll events fire reliably across all supported browsers

### Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Scroll performance degradation on low-end mobile devices | Medium | Debounce scroll events to 50ms max, use CSS transitions for GPU acceleration |
| Mobile menu not closing on link click (user gets stuck) | High | Explicitly close drawer in click handler, add backdrop click listener |
| Navbar covers content on small screens | Medium | Ensure main content has `padding-top: 80px` to account for fixed navbar |
| Color contrast fails WCAG on certain backgrounds | Medium | Test all text colors with Chrome DevTools contrast checker, use CSS variables |
| Social media URLs become outdated | Low | Store in environment.ts for easy updates without code changes |
| Navbar transparent state causes readability issues | Medium | Only apply transparent state on homepage hero; default to solid background on all other pages |

---

## 10. Acceptance Testing Checklist

### Desktop Navigation
- [ ] Navbar is fixed at top of all pages
- [ ] Logo click navigates to `/`
- [ ] All nav links navigate to correct routes
- [ ] "Get Started" button navigates to `/contact`
- [ ] Active link is highlighted with teal color
- [ ] Navbar transitions from transparent to frosted glass on scroll (homepage only)
- [ ] Navbar height shrinks from 80px to 64px on scroll
- [ ] Bottom border appears when scrolled

### Mobile Navigation
- [ ] Hamburger icon is visible on screens <768px
- [ ] Tapping hamburger opens drawer from right
- [ ] Drawer displays all navigation links vertically
- [ ] Tapping a link navigates and closes drawer
- [ ] Tapping backdrop closes drawer
- [ ] Pressing Escape closes drawer
- [ ] Body scroll is disabled when menu is open

### Footer
- [ ] Footer displays 4 columns on desktop (>1024px)
- [ ] Footer displays 2 columns on tablet (768px–1024px)
- [ ] Footer displays 1 column on mobile (<768px)
- [ ] All Quick Links route correctly
- [ ] Social icons (LinkedIn, Twitter, GitHub) open in new tabs
- [ ] Social links include `rel="noopener noreferrer"`
- [ ] Copyright notice displays current year (2026)

### Accessibility
- [ ] Tab key navigates through all links in logical order
- [ ] Enter key activates focused link
- [ ] Escape key closes mobile menu
- [ ] Focus indicators are visible with 2px teal outline
- [ ] Hamburger button has `aria-label` and `aria-expanded`
- [ ] Mobile menu has `role="navigation"` and `aria-label`
- [ ] Color contrast is 4.5:1 minimum for all text
- [ ] Touch targets are minimum 44px × 44px on mobile

### Performance
- [ ] Navbar scroll transition completes in <300ms
- [ ] Mobile menu animation completes in <300ms
- [ ] No layout jank during transitions
- [ ] Scroll events are debounced (no excessive re-renders)
- [ ] Lighthouse Accessibility score ≥90
- [ ] Lighthouse Performance score ≥90

---

## 11. Glossary

- **Frosted Glass Effect**: A visual design technique using `backdrop-filter: blur()` to create a semi-transparent, blurred background
- **Scrollspy**: Navigation pattern that highlights the current section based on scroll position using IntersectionObserver
- **Hamburger Menu**: Three horizontal lines icon that opens a mobile navigation drawer
- **RouterLinkActive**: Angular directive that adds a CSS class to a link when its route is active
- **OnPush Change Detection**: Angular optimization strategy that only checks component for changes when input properties change or events fire
- **Signal**: Angular 19 reactive primitive for state management (alternative to RxJS BehaviorSubject)
- **MatSidenav**: Angular Material component for slide-in/slide-out drawer panels

---

**Document Version:** 1.0
**Last Updated:** 2026-02-20
**Next Step:** Generate design.md, api-contract.md, db-schema.md, tasks.md, test-plan.md
