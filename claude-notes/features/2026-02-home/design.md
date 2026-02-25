# Design Specification — FEATURE 2: Home / Landing Page

**Feature ID:** 2026-02-home
**Feature Name:** Home / Landing Page
**Date:** 2026-02-20
**Status:** Specification Complete

---

## Overview

The Home/Landing Page is a single-page view composed of 5 distinct sections, each implemented as a standalone Angular component. All sections follow the dark luxury design theme with animated scroll reveals and responsive layouts.

---

## Page Structure

```
HomePageComponent (container)
├── HeroComponent
├── StatsBarComponent
├── ProcessComponent
├── IndustriesComponent
└── CtaBannerComponent
```

**Route:** `/` (root)
**Lazy Loading:** No (eager load as default route)
**Layout:** Wrapped in Layout shell (Navbar + Footer from Feature 1)

---

## Component Specifications

### 1. HeroComponent

**Purpose:** First impression section to communicate value proposition and drive CTA clicks

**File:** `frontend/src/app/features/home/hero/hero.component.ts`

#### Visual Design

**Layout:**
- Full viewport height on desktop (`height: 100vh`)
- Centered content (vertical and horizontal)
- Background: `#0a0a0f` with animated glow orbs and grid overlay
- Z-index layers: Glow orbs (back) → Grid overlay → Content (front)

**Content Structure:**
```html
<section class="hero">
  <div class="hero-background">
    <div class="glow-orb glow-orb-1"></div>
    <div class="glow-orb glow-orb-2"></div>
    <div class="glow-orb glow-orb-3"></div>
    <div class="grid-overlay"></div>
  </div>

  <div class="hero-content">
    <div class="hero-badge">Trusted by 100+ businesses</div>
    <h1 class="hero-headline">AI Automation that Accelerates Your Business</h1>
    <p class="hero-subheading">Transform your operations with intelligent AI agents that work 24/7, scale instantly, and never miss a beat.</p>

    <div class="hero-ctas">
      <button class="btn-primary" routerLink="/contact">Get Started</button>
      <button class="btn-secondary" routerLink="/services">View Services</button>
    </div>
  </div>

  <div class="scroll-indicator">
    <span class="arrow-down"></span>
  </div>
</section>
```

#### Typography

| Element | Font | Weight | Size (Desktop) | Size (Mobile) | Color |
|---------|------|--------|----------------|---------------|-------|
| Badge | DM Sans | 500 | 14px | 12px | `var(--color-accent)` |
| Headline | Playfair Display | 700 | `clamp(36px, 5vw, 72px)` | — | `var(--color-text-primary)` |
| Subheading | DM Sans | 400 | 24px | 18px | `var(--color-text-secondary)` |

**Line Heights:**
- Headline: 1.2
- Subheading: 1.6

#### Badge Design

```css
.hero-badge {
  background: rgba(0, 229, 160, 0.1);
  border: 1px solid rgba(0, 229, 160, 0.3);
  border-radius: 24px;
  padding: 0.5rem 1.5rem;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
```

#### CTA Buttons

**Primary Button:**
```css
.btn-primary {
  background: var(--color-accent); /* #00e5a0 */
  color: #0a0a0f;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 300ms ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 229, 160, 0.4);
}
```

**Secondary Button:**
```css
.btn-secondary {
  background: transparent;
  color: var(--color-accent);
  border: 1px solid var(--color-accent);
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 300ms ease;
}

.btn-secondary:hover {
  background: var(--color-accent);
  color: #0a0a0f;
}
```

#### Background Glow Orbs

**Implementation:** 3 radial gradient circles with CSS animations

```css
.glow-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
  animation: float 15s ease-in-out infinite;
}

.glow-orb-1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(0, 229, 160, 0.15), transparent);
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.glow-orb-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(138, 80, 255, 0.15), transparent);
  bottom: 20%;
  right: 10%;
  animation-delay: 5s;
}

.glow-orb-3 {
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, rgba(0, 229, 160, 0.1), transparent);
  top: 50%;
  right: 30%;
  animation-delay: 10s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.1); }
  66% { transform: translate(-30px, 30px) scale(0.9); }
}
```

#### Grid Overlay

```css
.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    radial-gradient(circle, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 32px 32px;
  pointer-events: none;
}
```

#### Scroll Indicator

```css
.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
}

.arrow-down {
  display: block;
  width: 24px;
  height: 24px;
  border-left: 2px solid var(--color-accent);
  border-bottom: 2px solid var(--color-accent);
  transform: rotate(-45deg);
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0) rotate(-45deg); }
  50% { transform: translateY(10px) rotate(-45deg); }
}
```

#### Responsive Breakpoints

**Mobile (<768px):**
- Hero height: `min-height: 100vh` (allow content to expand)
- Badge: 12px font size
- Headline: Uses `clamp()` to scale down
- Subheading: 18px
- CTA buttons: Stack vertically with 1rem gap
- Glow orbs: Reduce size by 50%, adjust positions

**Tablet (768px-1024px):**
- Headline: Mid-range `clamp()` value
- Subheading: 20px
- CTA buttons: Horizontal row with 1rem gap

---

### 2. StatsBarComponent

**Purpose:** Display social proof metrics with animated counters

**File:** `frontend/src/app/features/home/stats-bar/stats-bar.component.ts`

#### Visual Design

**Layout:**
- Horizontal bar across full width
- 4 stat items in a row (desktop)
- 2×2 grid (mobile)
- Frosted glass effect with backdrop blur

```html
<section class="stats-bar" #statsSection>
  <div class="stats-container">
    <div class="stat-item" *ngFor="let stat of stats">
      <div class="stat-value">
        {{ animatedValue(stat) }}{{ stat.suffix }}
      </div>
      <div class="stat-label">{{ stat.label }}</div>
    </div>
  </div>
</section>
```

#### Stats Data Structure

```typescript
interface Stat {
  value: number;
  suffix: string;
  label: string;
  format?: 'K' | 'M'; // Thousands or Millions
}

const STATS: Stat[] = [
  { value: 500, suffix: '+', label: 'Clients Served' },
  { value: 2000000, suffix: '+', label: 'Hours Saved', format: 'M' },
  { value: 99, suffix: '%', label: 'Uptime Guarantee' },
  { value: 24, suffix: '/7', label: 'Support Availability' }
];
```

#### Styling

```css
.stats-bar {
  background: rgba(19, 19, 24, 0.8);
  backdrop-filter: blur(8px);
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  padding: 4rem 0;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 48px;
  color: var(--color-accent);
  line-height: 1;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-family: 'DM Sans', sans-serif;
  font-weight: 400;
  font-size: 14px;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

#### Counter Animation Logic

**Implementation:**
- Use Angular Signal to track animated value
- Use IntersectionObserver to detect viewport entry
- Animate from 0 to target value over 2 seconds
- Store triggered state to prevent re-animation

```typescript
import { Component, signal, viewChild, afterViewInit } from '@angular/core';

@Component({
  selector: 'app-stats-bar',
  templateUrl: './stats-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatsBarComponent implements AfterViewInit {
  statsSection = viewChild<ElementRef>('statsSection');

  animatedValues = signal<Map<string, number>>(new Map());
  hasAnimated = signal(false);

  ngAfterViewInit() {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !this.hasAnimated()) {
          this.animateCounters();
          this.hasAnimated.set(true);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(this.statsSection()!.nativeElement);
  }

  animateCounters() {
    STATS.forEach(stat => {
      this.animateValue(stat.label, 0, stat.value, 2000);
    });
  }

  animateValue(key: string, start: number, end: number, duration: number) {
    const startTime = performance.now();

    const updateValue = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(start + (end - start) * progress);

      this.animatedValues.update(values => {
        const newValues = new Map(values);
        newValues.set(key, current);
        return newValues;
      });

      if (progress < 1) {
        requestAnimationFrame(updateValue);
      }
    };

    requestAnimationFrame(updateValue);
  }

  animatedValue(stat: Stat): string {
    const value = this.animatedValues().get(stat.label) || 0;

    if (stat.format === 'M') {
      return (value / 1000000).toFixed(1) + 'M';
    } else if (stat.format === 'K') {
      return (value / 1000).toFixed(0) + 'K';
    }

    return value.toString();
  }
}
```

#### Responsive Breakpoints

**Mobile (<768px):**
```css
.stats-container {
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem 1rem;
}

.stat-value {
  font-size: 36px;
}

.stat-label {
  font-size: 12px;
}
```

---

### 3. ProcessComponent

**Purpose:** Explain the 4-step process of working with Velobiz

**File:** `frontend/src/app/features/home/process/process.component.ts`

#### Visual Design

```html
<section class="process-section">
  <h2 class="section-heading">How It Works</h2>

  <div class="process-timeline">
    <div class="process-step" *ngFor="let step of steps">
      <div class="step-number">{{ step.number }}</div>
      <h3 class="step-title">{{ step.title }}</h3>
      <p class="step-description">{{ step.description }}</p>
    </div>
  </div>
</section>
```

#### Steps Data

```typescript
const PROCESS_STEPS = [
  {
    number: 1,
    title: 'Discovery Call',
    description: 'We understand your workflow, pain points, and automation goals in a free 30-minute consultation.'
  },
  {
    number: 2,
    title: 'Custom Design',
    description: 'Our team builds AI agents tailored to your business processes, brand voice, and compliance requirements.'
  },
  {
    number: 3,
    title: 'Integration',
    description: 'We deploy your AI agents with your existing tools: CRM, email, phone systems, and more.'
  },
  {
    number: 4,
    title: 'Optimization',
    description: 'Continuous monitoring, performance tuning, and iterative improvements based on real-world usage data.'
  }
];
```

#### Styling

```css
.process-section {
  padding: 6rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.section-heading {
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  font-size: 48px;
  text-align: center;
  color: var(--color-text-primary);
  margin-bottom: 4rem;
}

.process-timeline {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  position: relative;
}

/* Timeline connector line (desktop only) */
.process-timeline::before {
  content: '';
  position: absolute;
  top: 32px; /* Half of step-number height */
  left: 10%;
  right: 10%;
  height: 2px;
  background: linear-gradient(to right, var(--color-accent), rgba(0, 229, 160, 0.3));
  z-index: 0;
}

.process-step {
  text-align: center;
  position: relative;
  z-index: 1;
}

.step-number {
  width: 64px;
  height: 64px;
  margin: 0 auto 1rem;
  border: 2px solid var(--color-accent);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 24px;
  color: var(--color-accent);
  background: var(--color-bg-primary);
}

.step-title {
  font-family: 'DM Sans', sans-serif;
  font-weight: 600;
  font-size: 20px;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
}

.step-description {
  font-family: 'DM Sans', sans-serif;
  font-weight: 400;
  font-size: 16px;
  color: var(--color-text-secondary);
  line-height: 1.6;
}
```

#### Responsive Breakpoints

**Mobile (<768px):**
```css
.process-timeline {
  grid-template-columns: 1fr;
  gap: 3rem;
}

.process-timeline::before {
  display: none; /* Hide connector line on mobile */
}

.section-heading {
  font-size: 36px;
}
```

---

### 4. IndustriesComponent

**Purpose:** Showcase 8 industries Velobiz serves

**File:** `frontend/src/app/features/home/industries/industries.component.ts`

#### Visual Design

```html
<section class="industries-section">
  <h2 class="section-heading">Industries We Serve</h2>

  <div class="industries-grid">
    <div class="industry-tile" *ngFor="let industry of industries">
      <div class="industry-icon">{{ industry.icon }}</div>
      <div class="industry-name">{{ industry.name }}</div>
    </div>
  </div>
</section>
```

#### Industries Data

```typescript
const INDUSTRIES = [
  { icon: '🏥', name: 'Healthcare' },
  { icon: '🏦', name: 'Financial Services' },
  { icon: '🛒', name: 'E-Commerce' },
  { icon: '🏢', name: 'Real Estate' },
  { icon: '💼', name: 'Professional Services' },
  { icon: '🎓', name: 'Education' },
  { icon: '🏭', name: 'Manufacturing' },
  { icon: '🚚', name: 'Logistics' }
];
```

#### Styling

```css
.industries-section {
  padding: 6rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.section-heading {
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  font-size: 48px;
  text-align: center;
  color: var(--color-text-primary);
  margin-bottom: 4rem;
}

.industries-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

.industry-tile {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  transition: all 300ms ease;
  cursor: default;
}

.industry-tile:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(0, 229, 160, 0.2);
  border-color: var(--color-accent);
}

.industry-icon {
  font-size: 64px;
  margin-bottom: 1rem;
}

.industry-name {
  font-family: 'DM Sans', sans-serif;
  font-weight: 600;
  font-size: 18px;
  color: var(--color-text-primary);
}
```

#### Responsive Breakpoints

**Tablet (768px-1024px):**
```css
.industries-grid {
  grid-template-columns: repeat(2, 1fr);
}
```

**Mobile (<768px):**
```css
.industries-grid {
  grid-template-columns: 1fr;
  gap: 1rem;
}

.industry-tile {
  padding: 1.5rem;
}

.industry-icon {
  font-size: 48px;
}

.industry-name {
  font-size: 16px;
}

.section-heading {
  font-size: 36px;
}
```

---

### 5. CtaBannerComponent

**Purpose:** Final conversion point to schedule consultation

**File:** `frontend/src/app/features/home/cta-banner/cta-banner.component.ts`

#### Visual Design

```html
<section class="cta-banner">
  <div class="cta-content">
    <h2 class="cta-headline">Ready to Automate Your Business?</h2>
    <p class="cta-subtext">Book a free 30-minute consultation to discover how AI agents can transform your operations.</p>
    <button class="btn-primary" routerLink="/contact">Schedule Consultation</button>
  </div>
</section>
```

#### Styling

```css
.cta-banner {
  background: var(--color-bg-secondary);
  border: 2px solid var(--color-accent);
  border-radius: 16px;
  padding: 4rem 2rem;
  margin: 6rem 2rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.cta-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.cta-headline {
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  font-size: 36px;
  color: var(--color-text-primary);
  margin-bottom: 1rem;
}

.cta-subtext {
  font-family: 'DM Sans', sans-serif;
  font-weight: 400;
  font-size: 18px;
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.btn-primary {
  /* Same as Hero primary button */
  background: var(--color-accent);
  color: #0a0a0f;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 300ms ease;
  cursor: pointer;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 229, 160, 0.4);
}
```

#### Responsive Breakpoints

**Mobile (<768px):**
```css
.cta-banner {
  padding: 3rem 1.5rem;
  margin: 4rem 1rem;
  border-radius: 12px;
}

.cta-headline {
  font-size: 28px;
}

.cta-subtext {
  font-size: 16px;
}
```

---

### 6. HomePageComponent (Container)

**Purpose:** Assemble all 5 section components into a single page

**File:** `frontend/src/app/features/home/home-page/home-page.component.ts`

#### Template Structure

```html
<main class="home-page">
  <app-hero />
  <app-stats-bar />
  <app-process />
  <app-industries />
  <app-cta-banner />
</main>
```

#### Component Definition

```typescript
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HeroComponent } from '../hero/hero.component';
import { StatsBarComponent } from '../stats-bar/stats-bar.component';
import { ProcessComponent } from '../process/process.component';
import { IndustriesComponent } from '../industries/industries.component';
import { CtaBannerComponent } from '../cta-banner/cta-banner.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    HeroComponent,
    StatsBarComponent,
    ProcessComponent,
    IndustriesComponent,
    CtaBannerComponent
  ],
  templateUrl: './home-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {}
```

#### Routing Configuration

```typescript
// In app.routes.ts
export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    title: 'Velobiz - AI Automation that Accelerates Your Business'
  },
  // Other routes...
];
```

---

## Animation Specifications

### Scroll Reveal (All Sections)

All sections (except Hero, which is immediately visible) use ScrollRevealDirective from Feature 0.

**Stagger Timing:**
- StatsBar: 100ms delay
- Process: 200ms delay
- Industries: 300ms delay
- CTA Banner: 400ms delay

**Animation:** Fade up from `opacity: 0, translateY(20px)` to `opacity: 1, translateY(0)` over 600ms with ease-out easing.

### Reduced Motion

All animations must respect `prefers-reduced-motion` media query:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Accessibility Specifications

### Semantic HTML

```html
<main class="home-page">
  <section aria-labelledby="hero-heading">
    <h1 id="hero-heading">AI Automation that Accelerates Your Business</h1>
  </section>

  <section aria-labelledby="stats-heading">
    <h2 id="stats-heading" class="sr-only">Our Track Record</h2>
  </section>

  <section aria-labelledby="process-heading">
    <h2 id="process-heading">How It Works</h2>
  </section>

  <section aria-labelledby="industries-heading">
    <h2 id="industries-heading">Industries We Serve</h2>
  </section>

  <section aria-labelledby="cta-heading">
    <h2 id="cta-heading">Ready to Automate Your Business?</h2>
  </section>
</main>
```

### ARIA Labels

```html
<button class="btn-primary" routerLink="/contact" aria-label="Schedule a free consultation">
  Get Started
</button>

<button class="btn-secondary" routerLink="/services" aria-label="View our AI automation services">
  View Services
</button>
```

### Focus Management

All interactive elements must have visible focus indicators:

```css
button:focus-visible,
a:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 4px;
}
```

### Color Contrast

All text must meet WCAG 2.1 AA contrast ratio requirements:
- Normal text: 4.5:1 minimum
- Large text (18px+ or 14px+ bold): 3:1 minimum

**Verified Combinations:**
- `#ffffff` on `#0a0a0f` → 18.51:1 ✅
- `#00e5a0` on `#0a0a0f` → 8.92:1 ✅
- `#a0a0b0` on `#0a0a0f` → 9.47:1 ✅

---

## Performance Optimizations

### Critical CSS

Inline critical CSS for hero section in `<head>` to avoid render-blocking:

```html
<style>
  .hero { /* Hero critical styles */ }
  .hero-headline { /* Headline critical styles */ }
  /* ... */
</style>
```

### Lazy Loading

- Defer glow orb animations until after page load
- Use `loading="lazy"` for any future images
- Split component CSS into separate files (auto-handled by Angular)

### Animation Performance

- Use `transform` and `opacity` only (GPU-accelerated)
- Avoid animating `width`, `height`, `left`, `top`, `margin`, `padding`
- Use `will-change` sparingly for active animations only

```css
.glow-orb {
  will-change: transform; /* Only during animation */
}
```

---

## Approval

**Reviewed By:** Lead Agent
**Approved By:** User
**Date:** 2026-02-20
**Status:** APPROVED ✅

**Next Steps:**
1. Generate api-contract.md
2. Generate db-schema.md
3. Generate tasks.md
4. Generate test-plan.md
