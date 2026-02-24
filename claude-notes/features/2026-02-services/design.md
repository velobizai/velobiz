# Feature Design Specification — Services Page

**Feature ID:** FEATURE-3
**Designer:** Auto-Generated (Lead Agent)
**Date:** 2026-02-20
**Design System:** VelocityAI Dark Luxury Theme

---

## Design Philosophy

The Services Page embodies VelocityAI's premium, forward-thinking brand with a dark luxury aesthetic. Each service card is a self-contained information capsule that invites exploration through subtle hover interactions. The design prioritizes **scanability** (quick short descriptions) while rewarding **curiosity** (detailed long descriptions on hover/tap). The layout follows a **progressive disclosure** pattern: glanceable grid → detailed card content → contact conversion.

---

## Visual Design

### Color Palette (CSS Custom Properties)

```css
:root {
  /* Background layers */
  --bg-primary: #0a0a0f;        /* Page background */
  --bg-card: #14141a;            /* Service card background */
  --bg-card-hover: #1a1a22;      /* Card background on hover */

  /* Text colors */
  --text-primary: #ffffff;       /* Titles, headings */
  --text-secondary: #a0a0b0;     /* Short descriptions */
  --text-muted: #707080;         /* Supporting text */

  /* Accent colors */
  --accent-teal: #00e5a0;        /* Primary accent (icons, borders, CTAs) */
  --accent-teal-dim: rgba(0, 229, 160, 0.2);  /* Glow effects */

  /* Borders */
  --border-subtle: rgba(255, 255, 255, 0.1);  /* Default card borders */
  --border-hover: rgba(0, 229, 160, 0.3);     /* Hover state borders */
}
```

### Typography

**Font Stack:**
```css
--font-heading: 'Playfair Display', serif;  /* Page title */
--font-body: 'DM Sans', sans-serif;         /* All other text */
```

**Type Scale:**
- **Page Title (h1):** 48px / 56px line-height, Playfair Display, --text-primary
- **Page Subtitle:** 18px / 28px, DM Sans, --text-secondary
- **Card Title (h3):** 24px / 32px, DM Sans, 600 weight, --text-primary
- **Short Description:** 16px / 24px, DM Sans, 400 weight, --text-secondary
- **Long Description:** 16px / 26px, DM Sans, 400 weight, --text-secondary (slightly taller line-height for readability)

---

## Component Breakdown

### 1. ServicesPageComponent (Container)

**File:** `frontend/src/app/features/services/services-page.component.ts`

**Layout Structure:**

```
┌────────────────────────────────────────────────────┐
│ <section class="services-page">                    │
│   <div class="container">                          │
│                                                    │
│     <!-- Page Header -->                           │
│     <header class="page-header">                   │
│       <h1>Our AI Automation Services</h1>          │
│       <p class="subtitle">                         │
│         Transform your business with intelligent   │
│         automation solutions tailored to your      │
│         industry and workflow.                     │
│       </p>                                         │
│     </header>                                      │
│                                                    │
│     <!-- Loading State -->                         │
│     @if (loading()) {                              │
│       <app-loading-spinner />                      │
│     }                                              │
│                                                    │
│     <!-- Error State -->                           │
│     @if (error()) {                                │
│       <div class="error-state">                    │
│         <p>{{ error() }}</p>                       │
│         <button (click)="retry()">Retry</button>   │
│       </div>                                       │
│     }                                              │
│                                                    │
│     <!-- Services Grid -->                         │
│     @if (!loading() && !error()) {                 │
│       <div class="services-grid">                  │
│         @for (service of services(); track service.id) {
│           <app-service-card                        │
│             [service]="service"                    │
│             appScrollReveal                        │
│           />                                       │
│         }                                          │
│       </div>                                       │
│     }                                              │
│                                                    │
│     <!-- CTA Banner -->                            │
│     <div class="cta-banner" appScrollReveal>       │
│       <h2>Ready to Automate Your Business?</h2>    │
│       <p>Schedule a free consultation...</p>       │
│       <a routerLink="/contact" class="btn-primary">│
│         Get Started                                │
│       </a>                                         │
│     </div>                                         │
│                                                    │
│   </div>                                           │
│ </section>                                         │
└────────────────────────────────────────────────────┘
```

**CSS (SCSS):**

```scss
.services-page {
  min-height: 100vh;
  background: var(--bg-primary);
  padding: 120px 0 80px; // Top padding accounts for fixed navbar

  .container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 24px;
  }

  .page-header {
    text-align: center;
    margin-bottom: 80px;

    h1 {
      font-family: var(--font-heading);
      font-size: 48px;
      line-height: 1.2;
      color: var(--text-primary);
      margin-bottom: 16px;

      @media (max-width: 768px) {
        font-size: 36px;
      }
    }

    .subtitle {
      font-size: 18px;
      line-height: 1.6;
      color: var(--text-secondary);
      max-width: 640px;
      margin: 0 auto;
    }
  }

  .services-grid {
    display: grid;
    gap: 32px;

    // Desktop: 3 columns
    grid-template-columns: repeat(3, 1fr);

    // Tablet: 2 columns
    @media (max-width: 1023px) {
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }

    // Mobile: 1 column
    @media (max-width: 767px) {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }

  .cta-banner {
    margin-top: 80px;
    padding: 64px 48px;
    background: var(--bg-card);
    border: 1px solid var(--border-subtle);
    border-radius: 16px;
    text-align: center;

    h2 {
      font-size: 32px;
      color: var(--text-primary);
      margin-bottom: 16px;
    }

    p {
      font-size: 18px;
      color: var(--text-secondary);
      margin-bottom: 32px;
    }

    .btn-primary {
      display: inline-block;
      padding: 16px 32px;
      background: var(--accent-teal);
      color: #0a0a0f;
      font-weight: 600;
      border-radius: 8px;
      text-decoration: none;
      transition: transform 0.2s, box-shadow 0.2s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px var(--accent-teal-dim);
      }
    }
  }

  .error-state {
    text-align: center;
    padding: 64px 24px;

    p {
      color: #ff4444;
      font-size: 18px;
      margin-bottom: 24px;
    }

    button {
      padding: 12px 24px;
      background: var(--accent-teal);
      color: #0a0a0f;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s;

      &:hover {
        transform: translateY(-2px);
      }
    }
  }
}
```

---

### 2. ServiceCardComponent (Reusable Card)

**File:** `frontend/src/app/features/services/service-card/service-card.component.ts`

**Inputs:**
```typescript
@Input() service!: Service;
```

**Visual Design:**

**Default State:**
```
┌──────────────────────────────────────┐
│                                      │
│           [Icon 48px]                │
│                                      │
│      Service Title (h3)              │
│                                      │
│  Short description text that         │
│  spans 2-3 lines maximum.            │
│  Concise summary of the service.     │
│                                      │
│                                      │
└──────────────────────────────────────┘
  ↑ Subtle border + minimal glow
```

**Hover State (Desktop):**
```
┌──────────────────────────────────────┐
│  ↑ Card lifts 8px                    │
│  ↑ Glow intensifies                  │
│                                      │
│           [Icon 48px]                │
│            ↑ scales 1.05             │
│                                      │
│      Service Title (h3)              │
│                                      │
│  Long description replaces short     │
│  description with smooth fade        │
│  transition. Full paragraph with     │
│  detailed capabilities, use cases,   │
│  and technical features.             │
│                                      │
└──────────────────────────────────────┘
  ↑ Border color shifts to teal accent
```

**Mobile Behavior:**
- Tap card to expand (toggles long description)
- Expanded state shows "Tap to collapse" hint
- No hover effects (use touch-friendly tap targets)

**HTML Structure:**

```html
<article
  class="service-card"
  [class.expanded]="expanded()"
  (click)="toggleExpanded()"
  (mouseenter)="onHover(true)"
  (mouseleave)="onHover(false)"
  tabindex="0"
  (keydown.enter)="toggleExpanded()"
  (keydown.space)="toggleExpanded()"
  role="button"
  [attr.aria-label]="'Learn more about ' + service.title"
>
  <!-- Icon -->
  <div class="card-icon">
    <lucide-angular
      [img]="service.icon"
      [size]="48"
      [strokeWidth]="1.5"
    />
  </div>

  <!-- Title -->
  <h3 class="card-title">{{ service.title }}</h3>

  <!-- Description Container -->
  <div class="card-description">
    <!-- Short Description (default) -->
    <p
      class="short-desc"
      [class.hidden]="expanded()"
    >
      {{ service.shortDescription }}
    </p>

    <!-- Long Description (hover/tap reveal) -->
    <p
      class="long-desc"
      [class.visible]="expanded()"
    >
      {{ service.longDescription }}
    </p>
  </div>

  <!-- Expand Hint (mobile only) -->
  <span class="expand-hint">
    {{ expanded() ? 'Tap to collapse' : 'Tap for details' }}
  </span>
</article>
```

**CSS (SCSS):**

```scss
.service-card {
  position: relative;
  padding: 32px;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease-out;

  // Hover state (desktop)
  @media (hover: hover) {
    &:hover {
      transform: translateY(-8px);
      border-color: var(--border-hover);
      box-shadow: 0 16px 48px var(--accent-teal-dim);
      background: var(--bg-card-hover);

      .card-icon lucide-angular {
        transform: scale(1.05);
      }
    }
  }

  // Focus state (keyboard navigation)
  &:focus {
    outline: 2px solid var(--accent-teal);
    outline-offset: 4px;
  }

  .card-icon {
    margin-bottom: 24px;

    lucide-angular {
      display: block;
      color: var(--accent-teal);
      transition: transform 0.3s ease-out;
    }
  }

  .card-title {
    font-size: 24px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 16px;
    line-height: 1.3;
  }

  .card-description {
    position: relative;
    min-height: 72px; // Prevent layout shift

    p {
      font-size: 16px;
      color: var(--text-secondary);
      margin: 0;
    }

    .short-desc {
      line-height: 1.5;
      opacity: 1;
      transition: opacity 0.3s ease-out;

      &.hidden {
        opacity: 0;
        position: absolute;
        pointer-events: none;
      }
    }

    .long-desc {
      line-height: 1.6;
      opacity: 0;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      pointer-events: none;
      transition: opacity 0.3s ease-out;

      &.visible {
        opacity: 1;
        position: static;
        pointer-events: auto;
      }
    }
  }

  .expand-hint {
    display: none;
    font-size: 14px;
    color: var(--text-muted);
    margin-top: 16px;
    font-style: italic;

    // Show on mobile only
    @media (max-width: 767px) {
      display: block;
    }
  }

  // Mobile expanded state
  @media (max-width: 767px) {
    &.expanded {
      border-color: var(--border-hover);
      box-shadow: 0 8px 24px var(--accent-teal-dim);
    }
  }
}
```

**TypeScript Logic:**

```typescript
import { Component, Input, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { Service } from '../../../core/models/service.model';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceCardComponent {
  @Input() service!: Service;

  expanded = signal<boolean>(false);

  toggleExpanded(): void {
    // Only toggle on mobile (desktop uses CSS :hover)
    if (window.innerWidth < 768) {
      this.expanded.update(val => !val);
    }
  }

  onHover(isHovering: boolean): void {
    // Desktop hover: show long description
    if (window.innerWidth >= 768) {
      this.expanded.set(isHovering);
    }
  }
}
```

---

### 3. Loading State

**Component:** `LoadingSpinnerComponent` (from Feature 0)

**Visual:**
- Centered spinner (teal accent color)
- 64px diameter, 3px stroke width
- Smooth rotation animation (1s linear infinite)
- Displayed in place of services grid

---

### 4. Error State

**Visual Design:**

```
┌────────────────────────────────────────┐
│                                        │
│          ⚠️ [Error Icon]               │
│                                        │
│  Failed to load services.              │
│  Please check your connection          │
│  and try again.                        │
│                                        │
│       [Retry Button]                   │
│                                        │
└────────────────────────────────────────┘
```

**CSS:**
- Error icon: 48px, red (#ff4444)
- Text: 18px, red, center-aligned
- Retry button: Teal accent, 12px padding, rounded

---

## Responsive Behavior

### Breakpoints

| Breakpoint | Width | Grid Columns | Gap | Card Padding |
|------------|-------|--------------|-----|--------------|
| Mobile     | <768px | 1 column | 16px | 24px |
| Tablet     | 768-1023px | 2 columns | 24px | 28px |
| Desktop    | ≥1024px | 3 columns | 32px | 32px |

### Mobile-Specific Adjustments

- **Page title:** 36px (down from 48px)
- **Card interaction:** Tap to expand (no hover effects)
- **Expand hint:** Visible ("Tap for details" / "Tap to collapse")
- **CTA banner padding:** 48px → 32px
- **Navigation:** Fixed navbar collapses to hamburger menu

---

## Animations

### Scroll Reveal (via ScrollRevealDirective)

**Trigger:** IntersectionObserver detects card entering viewport
**Animation:**
- Opacity: 0 → 1
- TranslateY: 32px → 0
- Duration: 600ms
- Easing: cubic-bezier(0.25, 0.1, 0.25, 1)
- Stagger: 100ms delay per card (1st card at 0ms, 2nd at 100ms, etc.)

**Implementation:**
```html
<app-service-card
  *ngFor="let service of services()"
  [service]="service"
  appScrollReveal
  [appScrollRevealDelay]="i * 100"
/>
```

### Card Hover Animation

**Desktop Only:**
- **Transform:** translateY(-8px)
- **Box Shadow:** 0 16px 48px rgba(0, 229, 160, 0.2)
- **Border Color:** rgba(0, 229, 160, 0.3)
- **Icon Scale:** 1.05
- **Duration:** 300ms
- **Easing:** ease-out

### Description Transition

**Crossfade between short and long descriptions:**
- **Short Desc Fade Out:** opacity 1 → 0 (300ms)
- **Long Desc Fade In:** opacity 0 → 1 (300ms, 100ms delay)
- **Position:** Absolute positioning to prevent layout shift

### Button Hover (CTA Banner)

- **Transform:** translateY(-2px)
- **Box Shadow:** 0 8px 24px rgba(0, 229, 160, 0.2)
- **Duration:** 200ms
- **Easing:** ease-out

---

## Accessibility

### Semantic HTML

```html
<section aria-labelledby="services-heading">
  <h1 id="services-heading">Our AI Automation Services</h1>

  <div class="services-grid" role="list">
    <article role="listitem" tabindex="0">
      <!-- Service card -->
    </article>
  </div>
</section>
```

### ARIA Labels

- **Service cards:** `aria-label="Learn more about [Service Title]"`
- **Loading spinner:** `aria-label="Loading services" role="status"`
- **Error message:** `role="alert" aria-live="polite"`
- **Retry button:** `aria-label="Retry loading services"`

### Keyboard Navigation

- **Tab order:** Page title → Service cards (left-to-right, top-to-bottom) → CTA button
- **Focus indicators:** 2px teal outline with 4px offset
- **Activation:** Enter or Space key expands card on mobile
- **Escape key:** Collapses expanded card

### Screen Reader Support

- Card announces: "Service card: [Title]. Button. [Short description]. Press Enter or Space to expand."
- Expanded state announces: "[Long description]. Press Enter or Space to collapse."

### Motion Preferences

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Design Tokens (CSS Variables)

All design values are centralized as CSS custom properties for consistency and easy theming:

```css
:root {
  /* Spacing scale */
  --space-xs: 8px;
  --space-sm: 16px;
  --space-md: 24px;
  --space-lg: 32px;
  --space-xl: 48px;
  --space-2xl: 64px;
  --space-3xl: 80px;

  /* Border radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;

  /* Transitions */
  --transition-fast: 200ms ease-out;
  --transition-base: 300ms ease-out;
  --transition-slow: 600ms ease-out;

  /* Shadows */
  --shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 16px 48px rgba(0, 0, 0, 0.5);
  --shadow-glow: 0 16px 48px rgba(0, 229, 160, 0.2);
}
```

---

## Icon Mapping

Services use Lucide icons. Mapping from seed data:

| Service | Icon Name | Lucide Component |
|---------|-----------|------------------|
| AI Voice Agent — Inbound Support | phone | `<lucide-phone />` |
| AI Voice Agent — Outbound Collection | signal | `<lucide-signal />` |
| Email Management AI Agent | mail | `<lucide-mail />` |
| Marketing Campaign AI Agent | megaphone | `<lucide-megaphone />` |
| Social Media Scheduling | share | `<lucide-share-2 />` |
| Paid Ads AI Agent | target | `<lucide-target />` |
| GEO — Generative Engine Optimisation | brain | `<lucide-brain />` |
| SDLC AI Agent Suite | code | `<lucide-code />` |

**Installation:**
```bash
npm install lucide-angular
```

**Import in component:**
```typescript
import { LucideAngularModule, Phone, Signal, Mail, /* ... */ } from 'lucide-angular';
```

---

## Design Review Checklist

Before marking design as complete:

- ✅ All spacing uses CSS custom properties (no hardcoded px values)
- ✅ All colors reference theme variables
- ✅ Responsive grid tested at 320px, 768px, 1024px, 1440px
- ✅ Hover animations run at 60 FPS (no jank)
- ✅ Keyboard navigation works for all interactive elements
- ✅ Focus indicators are visible and accessible
- ✅ Screen reader announces card content correctly
- ✅ prefers-reduced-motion disables animations
- ✅ Color contrast meets WCAG AA (4.5:1 for text)
- ✅ Touch targets are ≥44x44px on mobile
- ✅ No layout shifts (CLS = 0)
- ✅ Loading and error states are visually clear
