# FEATURE 1: Layout (Navbar + Footer) — Design Specification

**Feature ID:** FEATURE-001
**Feature Name:** Layout (Navbar + Footer)
**Date:** 2026-02-20
**Status:** Design Complete

---

## 1. Design Philosophy

The Velobiz layout components follow a **Dark Luxury** aesthetic with:
- **Dark backgrounds** (#0a0a0f range) for premium, modern feel
- **Vibrant teal accent** (#00e5a0) for CTAs and highlights
- **Frosted glass effects** for depth and visual hierarchy
- **Smooth transitions** for scroll and interaction states
- **Typography contrast**: Playfair Display (serif) for branding, DM Sans (sans-serif) for UI elements

The layout shell must feel **lightweight and non-intrusive** while maintaining **constant accessibility** to navigation and key actions.

---

## 2. Component Architecture

### High-Level Structure

```
app.component.html
├── <app-navbar /> (NavbarComponent - Fixed at top)
├── <main>
│   └── <router-outlet /> (Dynamic page content)
├── <app-footer /> (FooterComponent - Bottom of page)
```

### Component Breakdown

#### 2.1 NavbarComponent
- **Selector**: `app-navbar`
- **Type**: Standalone Component
- **Change Detection**: OnPush
- **State Management**: Angular Signals
- **Dependencies**: Angular Material (MatSidenav, MatIcon), RouterLink, RouterLinkActive

**Sub-components/Elements:**
- Logo (image + text "Velobiz")
- Desktop Navigation (horizontal list of links)
- Mobile Hamburger Icon (Material "menu" icon)
- Mobile Drawer (MatSidenav with vertical link list)
- "Get Started" CTA Button (teal accent, routes to `/contact`)

---

#### 2.2 FooterComponent
- **Selector**: `app-footer`
- **Type**: Standalone Component
- **Change Detection**: OnPush
- **State Management**: None (static content)
- **Dependencies**: RouterLink, MatIcon

**Sub-components/Elements:**
- Brand Section (logo, tagline, description)
- Quick Links Column (site navigation)
- Company Column (About, Careers, Blog)
- Legal Column (Privacy, Terms, Cookies)
- Social Icons Row (LinkedIn, Twitter, GitHub)
- Copyright Bar (year + company name)

---

### 2.3 Configuration Module
**File**: `src/app/layout/layout.config.ts`

```typescript
export interface NavLink {
  label: string;
  route: string;
  icon?: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', route: '/' },
  { label: 'Services', route: '/services' },
  { label: 'Pricing', route: '/pricing' },
  { label: 'FAQ', route: '/faq' },
  { label: 'Contact', route: '/contact' }
];

export const FOOTER_QUICK_LINKS = [...NAV_LINKS];

export const FOOTER_COMPANY_LINKS: NavLink[] = [
  { label: 'About', route: '#' },
  { label: 'Careers', route: '#' },
  { label: 'Blog', route: '#' }
];

export const FOOTER_LEGAL_LINKS: NavLink[] = [
  { label: 'Privacy Policy', route: '#' },
  { label: 'Terms of Service', route: '#' },
  { label: 'Cookie Policy', route: '#' }
];
```

**Social Links** stored in `environment.ts`:
```typescript
export const environment = {
  production: false,
  social: {
    linkedin: 'https://linkedin.com/company/velocityai',
    twitter: 'https://twitter.com/velocityai',
    github: 'https://github.com/velocityai'
  }
};
```

---

## 3. Visual Design System

### 3.1 Color Palette

All colors are defined as CSS custom properties in `src/styles.scss`:

```scss
:root {
  /* Primary Colors */
  --color-bg-primary: #0a0a0f;           /* Main background */
  --color-bg-secondary: #12121a;         /* Secondary surfaces */
  --color-bg-card: #1a1a24;              /* Card backgrounds */

  /* Accent Colors */
  --color-accent: #00e5a0;               /* Teal - primary accent */
  --color-accent-hover: #00ffc8;         /* Lighter teal on hover */
  --color-accent-rgb: 0, 229, 160;       /* RGB for rgba() usage */

  /* Text Colors */
  --color-text-primary: #ffffff;         /* Headings, high emphasis */
  --color-text-secondary: #a0a0b0;       /* Body text, low emphasis */
  --color-text-muted: #6a6a7a;           /* Captions, disabled states */

  /* Border & Divider */
  --color-border: rgba(255, 255, 255, 0.1);
  --color-border-hover: rgba(0, 229, 160, 0.3);

  /* Overlay & Backdrop */
  --color-overlay: rgba(0, 0, 0, 0.5);
  --color-frosted-glass: rgba(10, 10, 15, 0.8);
}
```

### 3.2 Typography

**Font Families:**
- **Headings/Logo**: `'Playfair Display', serif` (Elegant, premium serif)
- **Body/UI**: `'DM Sans', sans-serif` (Modern, highly legible sans-serif)

**Font Sizes:**
```scss
:root {
  /* Navbar */
  --font-logo: 28px;
  --font-nav-link: 16px;
  --font-cta-button: 15px;

  /* Footer */
  --font-footer-heading: 16px;
  --font-footer-link: 14px;
  --font-footer-copyright: 13px;
}
```

**Font Weights:**
- Logo: 700 (Bold)
- Nav Links: 400 (Regular), 600 (Semi-bold when active)
- Footer Headings: 600 (Semi-bold)
- Footer Links: 400 (Regular)
- CTA Button: 600 (Semi-bold)

---

## 4. Navbar Design

### 4.1 Desktop Navbar (≥768px)

#### Layout
```
┌────────────────────────────────────────────────────────────────┐
│  [Logo] Velobiz    Home  Services  Pricing  FAQ  Contact    │
│                                                   [Get Started] │
└────────────────────────────────────────────────────────────────┘
```

#### Dimensions
- **Height (scroll position 0)**: 80px
- **Height (scrolled)**: 64px
- **Max width**: 1440px (centered with horizontal padding)
- **Horizontal padding**: 32px (desktop), 24px (tablet)
- **Logo + nav items**: Flexbox with `space-between` alignment

---

### 4.2 Navbar States

#### State 1: Top of Page (Transparent)
**Applies only on homepage hero section**

```scss
.navbar--top {
  background: transparent;
  border-bottom: none;
  height: 80px;

  .logo {
    color: var(--color-text-primary);
  }

  .nav-link {
    color: var(--color-text-secondary);
  }
}
```

**Visual Result:**
- Fully transparent background
- Logo and links float over hero background
- No border

---

#### State 2: Scrolled (Frosted Glass)
**Applies after scrolling >100px**

```scss
.navbar--scrolled {
  background: var(--color-frosted-glass);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
  height: 64px;

  .logo {
    transform: scale(0.9);
    transition: transform 300ms ease;
  }
}
```

**Visual Result:**
- Semi-transparent dark background with blur effect
- Subtle bottom border appears
- Logo slightly scales down (90%)
- Height shrinks to 64px

---

### 4.3 Navigation Links

#### Link States
```scss
.nav-link {
  color: var(--color-text-secondary);
  font-size: var(--font-nav-link);
  font-family: 'DM Sans', sans-serif;
  font-weight: 400;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 300ms ease;
  position: relative;

  /* Hover State */
  &:hover {
    color: var(--color-accent);
  }

  /* Active State (RouterLinkActive) */
  &.active {
    color: var(--color-accent);
    font-weight: 600;
  }

  /* Focus State (Keyboard Navigation) */
  &:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 4px;
  }
}
```

#### Underline Animation on Hover
```scss
.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 16px;
  right: 16px;
  height: 2px;
  background: var(--color-accent);
  transform: scaleX(0);
  transition: transform 300ms ease;
}

.nav-link:hover::after {
  transform: scaleX(1);
}
```

---

### 4.4 CTA Button ("Get Started")

```scss
.cta-button {
  background: var(--color-accent);
  color: var(--color-bg-primary);  /* Dark text on teal */
  font-size: var(--font-cta-button);
  font-weight: 600;
  padding: 12px 28px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 300ms ease;
  text-decoration: none;
  display: inline-block;

  /* Hover State */
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 20px rgba(var(--color-accent-rgb), 0.4),
                0 4px 12px rgba(0, 0, 0, 0.3);
  }

  /* Focus State */
  &:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 4px;
  }

  /* Active State */
  &:active {
    transform: translateY(0);
  }
}
```

**Visual Result:**
- Teal background with dark text for high contrast
- Subtle lift and glow on hover
- Smooth transition (300ms)

---

### 4.5 Mobile Navbar (<768px)

#### Layout
```
┌────────────────────────────────────┐
│  [Logo] Velobiz        [☰]     │
└────────────────────────────────────┘
```

#### Mobile Menu (MatSidenav Drawer)

**Drawer Configuration:**
- **Position**: `end` (slides from right)
- **Width**: 280px (mobile), 320px (tablet)
- **Height**: 100vh
- **Backdrop**: Semi-transparent overlay
- **Animation**: Slide-in/out (300ms ease)

**Drawer Content:**
```
┌───────────────────┐
│  [X] Close        │
│                   │
│  Home             │
│  Services         │
│  Pricing          │
│  FAQ              │
│  Contact          │
│                   │
│  [Get Started]    │
│                   │
│  ──────────────   │
│                   │
│  LinkedIn         │
│  Twitter          │
│  GitHub           │
└───────────────────┘
```

**Mobile Menu Styles:**
```scss
.mobile-drawer {
  background: var(--color-bg-secondary);
  padding: 24px;

  .mobile-nav-link {
    display: block;
    padding: 16px 20px;
    color: var(--color-text-primary);
    font-size: 18px;
    font-weight: 500;
    text-decoration: none;
    border-radius: 8px;
    transition: all 200ms ease;

    &:hover {
      background: var(--color-bg-card);
      color: var(--color-accent);
    }

    &.active {
      background: var(--color-bg-card);
      color: var(--color-accent);
      font-weight: 600;
    }
  }

  .mobile-cta {
    margin-top: 20px;
    width: 100%;
    text-align: center;
  }

  .mobile-social-icons {
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid var(--color-border);
    display: flex;
    gap: 16px;
    justify-content: center;
  }
}
```

**Hamburger Icon:**
```scss
.hamburger-button {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: var(--color-text-primary);

  mat-icon {
    font-size: 28px;
    width: 28px;
    height: 28px;
  }

  &:hover {
    color: var(--color-accent);
  }

  &:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 4px;
  }
}
```

---

## 5. Footer Design

### 5.1 Desktop Footer (≥1024px)

#### Layout (4 Columns)
```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo]                Quick Links      Company         Legal    │
│  Velobiz            Home             About           Privacy  │
│  Tagline...            Services         Careers         Terms    │
│  Description text...   Pricing          Blog            Cookies  │
│                        FAQ                                       │
│                        Contact                                   │
│                                                                  │
│  ──────────────────────────────────────────────────────────────  │
│                                                                  │
│  [LinkedIn] [Twitter] [GitHub]          © 2026 Velobiz.      │
│                                         All rights reserved.     │
└─────────────────────────────────────────────────────────────────┘
```

**Grid Configuration:**
```scss
.footer-columns {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;  /* Brand gets 2x width */
  gap: 48px;
  padding: 80px 32px 40px;
  max-width: 1440px;
  margin: 0 auto;
}
```

---

### 5.2 Tablet Footer (768px–1024px)

#### Layout (2 Columns)
```
┌─────────────────────────────────────────┐
│  [Logo]                Quick Links       │
│  Velobiz            Home              │
│  Tagline...            Services          │
│  Description...        Pricing           │
│                        FAQ               │
│                        Contact           │
│                                          │
│  Company               Legal             │
│  About                 Privacy           │
│  Careers               Terms             │
│  Blog                  Cookies           │
│                                          │
│  ────────────────────────────────────   │
│                                          │
│  [LinkedIn] [Twitter] [GitHub]          │
│  © 2026 Velobiz. All rights...       │
└─────────────────────────────────────────┘
```

**Grid Configuration:**
```scss
@media (max-width: 1024px) {
  .footer-columns {
    grid-template-columns: 1fr 1fr;
    gap: 32px;
    padding: 60px 24px 32px;
  }
}
```

---

### 5.3 Mobile Footer (<768px)

#### Layout (1 Column)
```
┌─────────────────────────┐
│  [Logo]                 │
│  Velobiz             │
│  Tagline...             │
│  Description...         │
│                         │
│  Quick Links            │
│  Home                   │
│  Services               │
│  ...                    │
│                         │
│  Company                │
│  About                  │
│  Careers                │
│  Blog                   │
│                         │
│  Legal                  │
│  Privacy                │
│  Terms                  │
│  Cookies                │
│                         │
│  ───────────────────    │
│                         │
│  [LinkedIn] [Twitter]   │
│  [GitHub]               │
│                         │
│  © 2026 Velobiz.     │
│  All rights reserved.   │
└─────────────────────────┘
```

**Grid Configuration:**
```scss
@media (max-width: 768px) {
  .footer-columns {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 48px 20px 24px;
  }
}
```

---

### 5.4 Footer Component Styles

#### Brand Section
```scss
.footer-brand {
  .footer-logo {
    font-family: 'Playfair Display', serif;
    font-size: 24px;
    font-weight: 700;
    color: var(--color-text-primary);
    margin-bottom: 12px;
  }

  .footer-tagline {
    font-size: 14px;
    color: var(--color-accent);
    margin-bottom: 16px;
    font-weight: 500;
  }

  .footer-description {
    font-size: 14px;
    color: var(--color-text-secondary);
    line-height: 1.6;
    max-width: 320px;
  }
}
```

---

#### Link Columns
```scss
.footer-column {
  .footer-column-heading {
    font-family: 'DM Sans', sans-serif;
    font-size: var(--font-footer-heading);
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: 20px;
  }

  .footer-link-list {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      margin-bottom: 12px;
    }
  }

  .footer-link {
    font-size: var(--font-footer-link);
    color: var(--color-text-secondary);
    text-decoration: none;
    transition: all 200ms ease;
    display: inline-block;

    &:hover {
      color: var(--color-accent);
      transform: translateX(4px);
    }

    &:focus-visible {
      outline: 2px solid var(--color-accent);
      outline-offset: 4px;
    }
  }
}
```

---

#### Social Icons Row
```scss
.footer-bottom {
  border-top: 1px solid var(--color-border);
  padding: 32px 32px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;

  .social-icons {
    display: flex;
    gap: 16px;
  }

  .social-icon-button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid var(--color-border);
    background: transparent;
    color: var(--color-text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 300ms ease;

    &:hover {
      color: var(--color-accent);
      border-color: var(--color-accent);
      box-shadow: 0 0 12px rgba(var(--color-accent-rgb), 0.3);
    }

    &:focus-visible {
      outline: 2px solid var(--color-accent);
      outline-offset: 4px;
    }
  }

  .copyright {
    font-size: var(--font-footer-copyright);
    color: var(--color-text-secondary);
    opacity: 0.7;
  }
}

@media (max-width: 768px) {
  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }
}
```

---

## 6. Animations and Interactions

### 6.1 Navbar Scroll Transition
```scss
.navbar {
  transition: height 300ms ease,
              background 300ms ease,
              border-color 300ms ease;
}

.navbar .logo {
  transition: transform 300ms ease;
}
```

**JavaScript (Angular Signal):**
```typescript
scrolled = signal<boolean>(false);

@HostListener('window:scroll')
onWindowScroll() {
  const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
  this.scrolled.set(scrollPosition > 100);
}
```

---

### 6.2 Mobile Menu Animation
```scss
.mobile-drawer {
  transition: transform 300ms cubic-bezier(0.4, 0.0, 0.2, 1);

  &.opening {
    animation: slideInRight 300ms ease;
  }

  &.closing {
    animation: slideOutRight 300ms ease;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
}
```

---

### 6.3 Link Hover Effects

**Desktop Nav Link Underline:**
- Animated pseudo-element `::after` scales from 0 to 1 on hover
- 300ms ease transition

**Footer Link Slide:**
- `translateX(4px)` on hover
- 200ms ease transition

**Social Icon Glow:**
- Border color changes to teal
- Box-shadow appears with teal glow
- 300ms ease transition

---

### 6.4 Scrollspy Active Link Detection

**Using IntersectionObserver:**
```typescript
private setupScrollspy() {
  const sections = document.querySelectorAll('section[id]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.activeSectionId.set(entry.target.id);
      }
    });
  }, {
    rootMargin: '-100px 0px -66%',
    threshold: 0
  });

  sections.forEach(section => observer.observe(section));
}
```

---

## 7. Responsive Behavior Summary

| Breakpoint | Navbar | Footer |
|------------|--------|--------|
| **Mobile** (<768px) | Hamburger menu, full CTA button | 1 column stacked layout |
| **Tablet** (768px–1024px) | Horizontal nav, standard CTA | 2 columns (Brand+Quick / Company+Legal) |
| **Desktop** (≥1024px) | Full horizontal nav with spacing | 4 columns (Brand 2x width, 3 single columns) |
| **Large Desktop** (≥1440px) | Max width 1440px centered | Max width 1440px centered |

---

## 8. Accessibility Design

### 8.1 Keyboard Navigation
- **Tab Order**: Logo → Nav Links → CTA Button → Mobile Hamburger (if visible)
- **Enter Key**: Activates focused link
- **Escape Key**: Closes mobile menu (if open)
- **Focus Visible**: 2px teal outline, 4px offset, no default browser outline

### 8.2 ARIA Attributes
```html
<!-- Hamburger Button -->
<button class="hamburger-button"
        aria-label="Open navigation menu"
        [attr.aria-expanded]="menuOpen()"
        (click)="toggleMenu()">
  <mat-icon>menu</mat-icon>
</button>

<!-- Mobile Drawer -->
<mat-sidenav role="navigation"
             aria-label="Main navigation"
             [opened]="menuOpen()">
  <!-- Nav links -->
</mat-sidenav>

<!-- Social Links -->
<a href="{{ environment.social.linkedin }}"
   target="_blank"
   rel="noopener noreferrer"
   aria-label="Visit Velobiz on LinkedIn">
  <mat-icon>linkedin</mat-icon>
</a>
```

### 8.3 Color Contrast Requirements
| Element | Color | Background | Contrast Ratio | Pass |
|---------|-------|------------|----------------|------|
| Nav Link (default) | #a0a0b0 | #0a0a0f | 8.2:1 | ✅ AAA |
| Nav Link (active) | #00e5a0 | #0a0a0f | 10.5:1 | ✅ AAA |
| CTA Button Text | #0a0a0f | #00e5a0 | 10.5:1 | ✅ AAA |
| Footer Link | #a0a0b0 | #0a0a0f | 8.2:1 | ✅ AAA |
| Copyright Text | #a0a0b0 (70% opacity) | #0a0a0f | 5.8:1 | ✅ AA |

All text elements meet WCAG 2.1 AA minimum (4.5:1) and most achieve AAA (7:1).

---

## 9. Implementation Notes

### 9.1 CSS Variables Usage
- **All component styles MUST use CSS custom properties** (no hardcoded hex values)
- Example: `color: var(--color-accent);` NOT `color: #00e5a0;`
- This allows for future theming and easier maintenance

### 9.2 Configuration Constants
- Nav links defined in `layout.config.ts` as `const` arrays
- Social URLs defined in `environment.ts` for environment-specific overrides
- No hardcoded links directly in templates

### 9.3 Performance Optimizations
- Scroll event debounced to 50ms using RxJS `debounceTime` or manual throttle
- CSS transitions handled by GPU (transform, opacity properties)
- OnPush change detection to minimize re-renders
- Mobile menu uses Angular Material's optimized MatSidenav

### 9.4 Browser Compatibility
- Frosted glass effect (`backdrop-filter: blur()`) works on all modern browsers
- Fallback for older browsers: semi-transparent solid background without blur
- Test on: Chrome 120+, Firefox 120+, Safari 16+, Edge 120+

---

## 10. Design Assets Required

### 10.1 Logo
- **Format**: SVG (scalable vector)
- **Dimensions**: Height 32px (navbar), 24px (footer)
- **Color**: White (#ffffff) or teal (#00e5a0) variants

### 10.2 Icons
- **Source**: Material Icons (CDN or NPM package)
- **Icons Needed**:
  - `menu` (hamburger)
  - `close` (close mobile menu)
  - `linkedin` (social)
  - `twitter` (social - use "X" icon if available)
  - `github` (social)

### 10.3 Fonts
- **Playfair Display**: Google Fonts (weights: 400, 700)
- **DM Sans**: Google Fonts (weights: 400, 500, 600)

**Import in global styles:**
```scss
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
```

---

## 11. Component File Structure

```
src/app/layout/
├── layout.config.ts                 (Navigation and footer link constants)
├── navbar/
│   ├── navbar.component.ts          (Component logic, scroll detection, menu state)
│   ├── navbar.component.html        (Template with desktop/mobile nav)
│   ├── navbar.component.scss        (Styles using CSS variables)
│   └── navbar.component.spec.ts     (Unit tests)
└── footer/
    ├── footer.component.ts          (Component logic, social links from environment)
    ├── footer.component.html        (Template with responsive grid)
    ├── footer.component.scss        (Styles using CSS variables)
    └── footer.component.spec.ts     (Unit tests)
```

---

**Document Version:** 1.0
**Last Updated:** 2026-02-20
**Status:** Ready for Implementation
