# Feature Planning Interview — FEATURE 1: Layout (Navbar + Footer)

**Date:** 2026-02-20
**Feature:** Layout (Navbar + Footer)
**Interview Conducted By:** Lead Agent

---

## Round 1: Context

### Q1: What is the business problem this feature solves? Who are the target users?

The Navbar and Footer provide consistent navigation and branding across all pages of the Velobiz website, solving the fundamental UX problem of site navigation and wayfinding.

**Target users:**
- **Potential clients** browsing AI automation services
- **Visitors** seeking company information and contact details
- **General public** exploring service offerings and pricing

**User goals:**
- Navigate between different sections of the website seamlessly
- Access key information (services, pricing, contact) from any page
- Understand the brand identity and value proposition
- Connect via social media or contact form

### Q2: What are the success criteria? How will you measure if this feature is working?

**Success criteria:**
1. ✅ All navigation links route correctly to their respective pages (Home, Services, Pricing, FAQ, Contact)
2. ✅ Mobile responsive on all device widths (320px–1920px+)
3. ✅ WCAG 2.1 AA accessibility compliance (keyboard navigation, ARIA attributes, color contrast)
4. ✅ Navbar scroll transition is smooth (<300ms) and doesn't cause layout jank
5. ✅ Active link highlighting works based on current route/section (scrollspy)
6. ✅ Mobile hamburger menu opens/closes smoothly with backdrop
7. ✅ All social media links open in new tabs with proper security attributes
8. ✅ Footer columns reflow correctly on tablet and mobile breakpoints

**Measurement methods:**
- **Click tracking**: Monitor navigation link click-through rates
- **Lighthouse scores**: Accessibility score ≥90, Performance score ≥90
- **Mobile usability**: Test on real devices (iOS Safari, Android Chrome)
- **User testing**: 5-second test for navigation clarity
- **Analytics**: Bounce rate on pages accessed via navbar links

### Q3: Are there any existing systems, APIs, or databases this integrates with?

**No backend integration required.**

- This is a **brand new website** with purely frontend layout components
- Navbar does **not** fetch dynamic data from backend API (no user session, no cart count, no notifications)
- Footer displays **no dynamic content** (no latest blog posts, no API-driven social links)
- All content is **static/hardcoded** or stored in frontend configuration files

**Configuration approach:**
- Navigation links: Hardcoded in component as TypeScript const array
- Social media URLs: Stored in `environment.ts` config file for easy updates without code changes

---

## Round 2: Requirements

### Q4: What are the core capabilities this feature needs? (List the must-haves)

**Navbar Capabilities:**
- ✅ Logo/branding with click-to-home functionality
- ✅ Navigation links: Home, Services, Pricing, FAQ, Contact
- ✅ Mobile hamburger menu (slide-in drawer from right)
- ✅ Sticky/fixed positioning on scroll (stays at top)
- ✅ Frosted-glass effect on scroll (backdrop-filter: blur with semi-transparent background)
- ✅ Opacity transition: transparent on homepage hero → solid background on scroll
- ✅ Navbar height shrink on scroll for compact appearance
- ✅ "Get Started" CTA button (routes to `/contact`)
- ✅ Active link highlighting based on scroll position (scrollspy) and current route

**Footer Capabilities:**
- ✅ Company branding: Logo, tagline, company description
- ✅ Quick Links column: Home, Services, Pricing, FAQ, Contact
- ✅ Company column: About, Careers, Blog (placeholder links)
- ✅ Legal column: Privacy Policy, Terms of Service, Cookie Policy
- ✅ Social media icons row: LinkedIn, Twitter, GitHub
- ✅ Copyright notice: "© 2026 Velobiz. All rights reserved."
- ✅ Responsive layout: 4 columns (desktop) → 2 columns (tablet) → 1 column (mobile)

### Q5: What data does this feature create, read, update, or delete? Describe the entities.

**No database entities.** All data is static/configuration-based.

**Configuration structures:**

**Navigation Links** (hardcoded in `navbar.component.ts`):
```typescript
const NAV_LINKS = [
  { label: 'Home', route: '/', icon: 'home' },
  { label: 'Services', route: '/services', icon: 'build' },
  { label: 'Pricing', route: '/pricing', icon: 'payment' },
  { label: 'FAQ', route: '/faq', icon: 'help' },
  { label: 'Contact', route: '/contact', icon: 'mail' }
];
```

**Social Links** (stored in `environment.ts`):
```typescript
export const environment = {
  social: {
    linkedin: 'https://linkedin.com/company/velocityai',
    twitter: 'https://twitter.com/velocityai',
    github: 'https://github.com/velocityai'
  }
};
```

**Footer Columns** (hardcoded in `footer.component.ts`):
```typescript
const FOOTER_COLUMNS = {
  quickLinks: [...],
  company: [...],
  legal: [...]
};
```

### Q6: What API endpoints do you envision?

**None.** This feature is purely frontend with no backend integration.

- No API calls from Navbar or Footer components
- All routing is client-side via Angular Router
- Social links are external URLs (no API tracking)

---

## Round 3: UI/UX

### Q7: Does this feature have a user interface? If yes, describe the screens/pages.

**Yes.** This feature creates the persistent shell layout that wraps all pages.

**Navbar Behavior:**
- **Fixed/sticky positioning** — stays at top on all scroll positions
- **State 1 (at top)**: Transparent background (on homepage hero section only)
- **State 2 (scrolled)**: Frosted-glass effect with backdrop-filter: blur(12px) and semi-transparent background
- **Height transition**: Shrinks from 80px to 64px on scroll (smooth transition)
- **Border**: Subtle bottom border appears when scrolled

**Footer Layout:**
- **Desktop (>1024px)**: 4-column grid layout
- **Tablet (768px–1024px)**: 2-column grid layout
- **Mobile (<768px)**: Single column stacked layout
- **Sections**:
  - Column 1: Brand (logo, tagline, description)
  - Column 2: Quick Links (site navigation)
  - Column 3: Company (About, Careers, Blog)
  - Column 4: Legal (Privacy, Terms, Cookies)
- **Bottom bar**: Social icons row + copyright (always full width)

### Q8: What UI components are needed?

**Navbar Components:**
- Logo image + text "Velobiz" (clickable, routes to `/`)
- Desktop: Horizontal menu with 5 nav links
- Mobile: Hamburger icon (Material `mat-icon`: "menu")
- Mobile side drawer: Angular Material `MatSidenav` (slide-in from right, backdrop overlay)
- Primary CTA button: "Get Started" with teal accent background
- Scroll position detector: `@HostListener('window:scroll')` for opacity/size transitions

**Footer Components:**
- Logo (smaller version of navbar logo)
- 4 column sections (responsive grid)
- Link lists (unstyled list with styled anchor tags)
- Social media icon buttons (LinkedIn, Twitter, GitHub) using Material icons
- Copyright text (small, muted color)
- Column headings (DM Sans medium weight)

**Shared Utilities:**
- `RouterLinkActive` directive for active link highlighting
- `IntersectionObserver` for scrollspy (detect which section is in viewport)

### Q9: Are there any specific design requirements?

**Yes — Dark Luxury Theme** (established in FEATURE 0: Infrastructure)

**Navbar Design:**
- **Scroll state 1 (top)**:
  - Background: `transparent` (on homepage hero only)
  - Height: `80px`
  - No border
- **Scroll state 2 (scrolled)**:
  - Background: `rgba(10, 10, 15, 0.8)` with `backdrop-filter: blur(12px)`
  - Height: `64px`
  - Border bottom: `1px solid var(--color-border)` → `rgba(255, 255, 255, 0.1)`
- **Link styles**:
  - Default: `var(--color-text-secondary)` → `#a0a0b0`
  - Hover: `var(--color-accent)` → `#00e5a0` with underline animation
  - Active: `var(--color-accent)` with bold weight
  - Transition: `300ms ease` for all states
- **CTA button**:
  - Background: `var(--color-accent)` → `#00e5a0`
  - Text: `#0a0a0f` (dark text on teal background)
  - Hover: Glowing box-shadow `0 0 20px rgba(0, 229, 160, 0.4)`

**Footer Design:**
- **Background**: `#0a0a0f` (same as body, or slightly darker gradient)
- **Border top**: `1px solid var(--color-border)`
- **Column headings**:
  - Font: `DM Sans`, weight 600, size 16px
  - Color: `var(--color-text-primary)` → `#ffffff`
- **Links**:
  - Default: `var(--color-text-secondary)` → `#a0a0b0`
  - Hover: `var(--color-accent)` with `translateY(-2px)` lift effect
  - Transition: `300ms ease`
- **Social icons**:
  - Circular buttons: `40px × 40px`
  - Border: `1px solid var(--color-border)`
  - Hover: Teal glow `box-shadow: 0 0 12px rgba(0, 229, 160, 0.3)`
- **Copyright**:
  - Font size: `14px`
  - Color: `var(--color-text-secondary)` with 70% opacity

**Typography:**
- Logo text: `Playfair Display`, serif, bold
- Nav links: `DM Sans`, sans-serif, 16px
- Footer headings: `DM Sans`, medium weight, 16px
- Footer links: `DM Sans`, regular weight, 14px

**Responsive Breakpoints:**
- Mobile: <768px (hamburger menu, single column footer)
- Tablet: 768px–1024px (horizontal nav, 2-column footer)
- Desktop: >1024px (full nav, 4-column footer)

---

## Round 4: Constraints

### Q10: What are the non-functional requirements? (performance targets, scalability, security)

**Performance:**
- Navbar scroll detection must be **debounced** to max 50ms intervals (avoid excessive re-renders)
- Mobile menu animation: **<300ms** slide-in/out duration for smooth UX
- Navbar height/opacity transitions: **use CSS transitions** (not JS-driven animations) for GPU acceleration
- **Lazy-load footer**: Consider using IntersectionObserver to defer footer rendering until scrolled near bottom (initial page load optimization)

**Accessibility (WCAG 2.1 AA Compliance):**
- ✅ All links have descriptive text (no "click here" or generic labels)
- ✅ Hamburger menu button: `aria-label="Open navigation menu"`, `aria-expanded="false|true"`
- ✅ Mobile menu: `role="navigation"`, `aria-label="Main navigation"`
- ✅ Keyboard navigation: Tab through all links, Enter to activate, Escape to close mobile menu
- ✅ Focus visible indicator: 2px teal outline with offset
- ✅ Color contrast: 4.5:1 minimum for all text (test with Chrome DevTools)
- ✅ Skip to content link: Hidden but accessible for screen readers (optional but recommended)

**Mobile Responsiveness:**
- Touch-friendly tap targets: **minimum 44px × 44px** for all buttons/links
- Mobile menu: **100vh height** with scrollable content if menu items overflow
- No horizontal scroll on any device width (320px–1920px+)
- Test on real devices: iOS Safari 16+, Android Chrome 120+

**SEO:**
- Semantic HTML: `<nav>`, `<footer>`, `<ul>`, `<a>` tags (not `<div>` with click handlers)
- Proper heading hierarchy: Logo as `<div>` (H1 reserved for page content)
- All social links: `rel="noopener noreferrer"` for external links security
- Footer links: Use `<a href="#">` for placeholder links (not `<a>` without href)

### Q11: Are there any technical constraints or preferences? (specific libraries, patterns, hosting)

**Hard Constraints:**
- Angular 19 **standalone components** (no NgModule for NavbarComponent or FooterComponent)
- **OnPush change detection** strategy for performance optimization
- **Signals** for scroll state management (not RxJS BehaviorSubject)
  - Example: `scrolled = signal<boolean>(false);`
- Angular Material **MatSidenav** for mobile drawer (no custom implementations)
- **RouterLinkActive** directive for active link highlighting
- **@HostListener('window:scroll')** for scroll event detection in NavbarComponent

**Strong Preferences:**
- Store social media URLs in **environment.ts** configuration (not hardcoded in template)
- Navigation links array defined as **const** in component TypeScript (for easy maintenance)
- **No jQuery or vanilla JS DOM manipulation** — all interactions via Angular directives/template syntax
- Footer layout using **CSS Grid** (not Flexbox) for better multi-column control
- Mobile menu backdrop uses Angular Material **MatSidenav backdrop** (no custom overlay component)
- **No third-party animation libraries** (use CSS transitions and Angular animations only)

**Configuration Files:**
- Create `layout.config.ts` in `src/app/layout/` with:
  - `NAV_LINKS` array: `{ label, route, icon? }`
  - `FOOTER_QUICK_LINKS` array
  - `FOOTER_COMPANY_LINKS` array
  - `FOOTER_LEGAL_LINKS` array
- Social links in `environment.ts`: `social: { linkedin, twitter, github }`

**No API Dependencies:**
- All content is static/hardcoded
- No backend calls for this feature
- Social links from `environment.ts` config file (can be overridden in `environment.prod.ts` for production URLs)

---

## Round 5: Confirmation

### Q12: Is there anything else important that we haven't covered?

**Yes, additional critical details:**

**1. Scrollspy for Active Link Highlighting:**
- Use `IntersectionObserver` to detect which page section is currently in viewport (for single-page scroll behavior)
- Update active nav link based on current section ID (e.g., "Services" link glows teal when `#services` section is visible)
- **Fallback**: Use `RouterLinkActive="active"` for multi-page route-based highlighting
- Active link styling: `color: var(--color-accent)` + `font-weight: 600`

**2. Navbar Logo Behavior:**
- Logo should be clickable and route to `/` (homepage)
- Logo can scale down to **90% size** when navbar shrinks on scroll (smooth transition)
- Logo text "Velobiz" uses `Playfair Display` serif font

**3. Mobile Menu UX:**
- Clicking a nav link **closes the mobile menu** automatically (navigate + close animation)
- Clicking backdrop **also closes the menu** (Material Sidenav default behavior)
- Body scroll should be **disabled when menu is open** (prevent background scrolling) — Material Sidenav handles this automatically
- Mobile menu position: `position="end"` (slide from right, not left)
- Mobile menu width: `280px` on mobile, `320px` on tablet

**4. Footer Newsletter Signup:**
- **NOT included in this feature** (will be added in a future feature when backend newsletter endpoint is fully wired)
- For now, footer can have a **placeholder "Stay updated"** text with no input field, or omit this section entirely
- Design should leave space for future newsletter form in Column 1 (below brand description)

**5. Configuration Constants:**
Create `src/app/layout/layout.config.ts`:
```typescript
export const NAV_LINKS = [
  { label: 'Home', route: '/' },
  { label: 'Services', route: '/services' },
  { label: 'Pricing', route: '/pricing' },
  { label: 'FAQ', route: '/faq' },
  { label: 'Contact', route: '/contact' }
];

export const FOOTER_QUICK_LINKS = [...NAV_LINKS];

export const FOOTER_COMPANY_LINKS = [
  { label: 'About', route: '#' },
  { label: 'Careers', route: '#' },
  { label: 'Blog', route: '#' }
];

export const FOOTER_LEGAL_LINKS = [
  { label: 'Privacy Policy', route: '#' },
  { label: 'Terms of Service', route: '#' },
  { label: 'Cookie Policy', route: '#' }
];
```

**6. Testing Requirements:**
- **Unit tests** (Jasmine + Karma):
  - Navbar scroll state detection (scrolled signal updates correctly)
  - Mobile menu open/close state management
  - Active link highlighting logic
  - Router navigation on link clicks
- **Accessibility tests**:
  - Keyboard navigation (Tab, Enter, Escape)
  - ARIA attributes present and correct
  - Focus management when opening/closing mobile menu
- **Visual regression tests** (optional):
  - Screenshot comparison at 320px, 768px, 1024px, 1920px widths

**7. Integration with App Shell:**
- Navbar and Footer should be included in `app.component.html` as:
  ```html
  <app-navbar />
  <main>
    <router-outlet />
  </main>
  <app-footer />
  ```
- Main content area should have `padding-top: 80px` to account for fixed navbar height (adjust to 64px on scroll)

### Q13: Summary — Does this accurately capture your requirements?

**✅ APPROVED** — User confirmed "yes"

**Summary of FEATURE 1: Layout (Navbar + Footer):**

**Business Problem:** Provides consistent navigation and branding across all pages, helping potential clients browse services and navigate the site effectively.

**Target Users:** Potential clients browsing AI automation services, visitors seeking information.

**Success Criteria:**
- ✅ Navigation links route correctly to all pages
- ✅ Mobile responsive (320px–1920px+)
- ✅ WCAG 2.1 AA accessibility compliance
- ✅ Smooth scroll transitions (<300ms)
- ✅ Active link highlighting (scrollspy + RouterLinkActive)
- ✅ Social links open in new tabs with security attributes

**Core Capabilities:**
- Sticky frosted-glass navbar with scroll transitions
- Desktop horizontal menu + mobile hamburger menu with slide-in drawer
- Multi-column responsive footer (4 cols → 2 cols → 1 col)
- Social media icon buttons with hover effects
- Active link highlighting based on route and scroll position
- "Get Started" CTA button routing to contact page

**No API Dependencies:** All content is static/hardcoded or from `environment.ts` config.

**Design:** Dark luxury theme with teal accents (#00e5a0), frosted glass navbar on scroll, DM Sans typography, Playfair Display for logo.

**Technical Stack:** Angular 19 standalone components, Material Sidenav for mobile menu, OnPush change detection, Signals for state, CSS Grid for footer layout.

---

## Interview Status

**Status:** COMPLETED ✅
**Approved By:** User
**Next Step:** Spawn Planner Agent to generate full specification (requirements.md, design.md, api-contract.md, db-schema.md, tasks.md, test-plan.md)
