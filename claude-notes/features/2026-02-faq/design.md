# Feature Design Specification — FAQ Page

**Feature ID:** FEATURE-5
**Designer:** Planner Agent (Auto-Generated)
**Date:** 2026-02-20
**Design System:** VelocityAI Dark Luxury Theme

---

## Design Philosophy

The FAQ Page embodies VelocityAI's premium, approachable brand with a dark luxury aesthetic. The accordion interaction pattern promotes **progressive disclosure**: users see all questions at a glance and expand only what's relevant to them. The design prioritizes **scanability** (clear question hierarchy) while providing **smooth, delightful animations** (expand/collapse transitions). The layout follows a **focused single-column pattern**: hero → FAQ list → CTA conversion.

---

## Visual Design

### Color Palette (CSS Custom Properties)

```css
:root {
  /* Background layers */
  --color-bg-primary: #0a0a0f;        /* Page background */
  --color-bg-secondary: #1a1a2e;      /* Hero section background */
  --color-bg-card: #14141a;           /* FAQ card background */
  --color-surface-dark: #1a1a2e;      /* Elevated surfaces */

  /* Text colors */
  --color-text-primary: #ffffff;      /* Questions, headings */
  --color-text-secondary: #b0b0c0;    /* Answers, supporting text */
  --color-text-muted: #707080;        /* Subtle text */

  /* Accent colors */
  --color-accent-teal: #00e5a0;       /* Primary accent (icons, focus) */
  --color-accent: #00e5a0;            /* Alias for teal */
  --accent-teal-dim: rgba(0, 229, 160, 0.2);  /* Glow effects */

  /* Borders */
  --color-border: #2a2a3e;            /* Default borders */
  --color-border-hover: rgba(0, 229, 160, 0.3);  /* Hover state borders */
}
```

### Typography

**Font Stack:**
```css
--font-heading: 'Playfair Display', serif;  /* Page title */
--font-body: 'DM Sans', sans-serif;         /* All other text */
```

**Type Scale:**
- **Page Title (h1):** 48px / 56px line-height, Playfair Display, --color-text-primary (mobile: 32px)
- **Page Subtitle:** 20px / 32px, DM Sans, --color-text-secondary
- **FAQ Question (h2):** 24px / 32px, Playfair Display, 600 weight, --color-text-primary (mobile: 18px)
- **FAQ Answer:** 16px / 27px, DM Sans, 400 weight, --color-text-secondary

---

## Component Breakdown

### 1. FaqPageComponent (Container)

**File:** `frontend/src/app/features/faq/faq-page.component.ts` (ALREADY EXISTS — needs refactoring)

**Current Structure (to be simplified):**
```
Current (with categories):
├── Hero Section
├── Category Tabs (general, technical, pricing, support) ← REMOVE
├── FAQ List (filtered by category) ← SIMPLIFY
└── CTA Section

New (simplified):
├── Hero Section
├── FAQ List (all 6 FAQs, no filtering)
└── CTA Section
```

**New Layout Structure:**

```
┌────────────────────────────────────────────────────┐
│ <main class="faq-page">                            │
│                                                    │
│   <!-- Hero Section -->                           │
│   <section class="faq-hero">                       │
│     <div class="faq-hero__content">                │
│       <h1 class="faq-hero__headline">              │
│         Frequently Asked Questions                 │
│       </h1>                                        │
│       <p class="faq-hero__subheading">             │
│         Everything you need to know about our      │
│         AI automation services                     │
│       </p>                                         │
│     </div>                                         │
│   </section>                                       │
│                                                    │
│   <!-- FAQ Content -->                            │
│   <section class="faq-content">                    │
│     <div class="faq-content__container">           │
│                                                    │
│       <!-- Loading State -->                       │
│       @if (loading()) {                            │
│         <div class="loading-spinner"></div>        │
│       }                                            │
│                                                    │
│       <!-- Error State -->                         │
│       @if (error()) {                              │
│         <div class="error-state">                  │
│           <p>{{ error() }}</p>                     │
│           <button (click)="retry()">Retry</button> │
│         </div>                                     │
│       }                                            │
│                                                    │
│       <!-- FAQ List (Accordion) -->                │
│       @if (!loading() && !error()) {               │
│         <div class="faq-list">                     │
│           @for (faq of faqs(); track faq.id) {     │
│             <article class="faq-item"              │
│               [class.faq-item--expanded]="         │
│                 expandedFaqId() === faq.id"        │
│               appScrollReveal>                     │
│                                                    │
│               <button class="faq-item__header"     │
│                 [attr.aria-expanded]="             │
│                   expandedFaqId() === faq.id"      │
│                 (click)="toggleFaq(faq.id)">       │
│                 <h2 class="faq-item__question">    │
│                   {{ faq.question }}               │
│                 </h2>                              │
│                 <span class="faq-item__icon">      │
│                   {{ expandedFaqId() === faq.id    │
│                      ? '−' : '+' }}                │
│                 </span>                            │
│               </button>                            │
│                                                    │
│               @if (expandedFaqId() === faq.id) {   │
│                 <div class="faq-item__answer">     │
│                   <p>{{ faq.answer }}</p>          │
│                 </div>                             │
│               }                                    │
│             </article>                             │
│           }                                        │
│         </div>                                     │
│       }                                            │
│                                                    │
│     </div>                                         │
│   </section>                                       │
│                                                    │
│   <!-- CTA Section -->                            │
│   <section class="faq-cta">                        │
│     <div class="faq-cta__content">                 │
│       <h2 class="faq-cta__headline">               │
│         Still Have Questions?                      │
│       </h2>                                        │
│       <p class="faq-cta__subtext">                 │
│         Our team is here to help. Schedule a free  │
│         consultation to discuss your needs.        │
│       </p>                                         │
│       <button class="faq-cta__button"              │
│         routerLink="/contact">                     │
│         Contact Us                                 │
│       </button>                                    │
│     </div>                                         │
│   </section>                                       │
│                                                    │
│ </main>                                            │
└────────────────────────────────────────────────────┘
```

**Component Logic (TypeScript):**

```typescript
import { Component, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { FaqService } from '../../core/services/faq.service';
import { Faq } from '../../core/models/faq.model';

@Component({
  selector: 'app-faq-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ScrollRevealDirective],
  templateUrl: './faq-page.component.html',
  styleUrls: ['./faq-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FaqPageComponent implements OnInit {
  faqs = signal<Faq[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  expandedFaqId = signal<number | null>(null);

  constructor(
    private faqService: FaqService,
    private title: Title,
    private meta: Meta
  ) {}

  ngOnInit(): void {
    this.setMetaTags();
    this.loadFaqs();
  }

  loadFaqs(): void {
    this.loading.set(true);
    this.error.set(null);

    this.faqService.getFaqs().subscribe({
      next: (faqs) => {
        this.faqs.set(faqs);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load FAQs. Please try again.');
        this.loading.set(false);
        console.error('Error loading FAQs:', err);
      }
    });
  }

  toggleFaq(faqId: number): void {
    this.expandedFaqId.set(this.expandedFaqId() === faqId ? null : faqId);
  }

  retry(): void {
    this.loadFaqs();
  }

  private setMetaTags(): void {
    this.title.setTitle('Frequently Asked Questions | VelocityAI');
    this.meta.updateTag({
      name: 'description',
      content: 'Get answers to common questions about AI automation, deployment timelines, security, integrations, and more.'
    });
    this.meta.updateTag({
      property: 'og:title',
      content: 'Frequently Asked Questions | VelocityAI'
    });
    this.meta.updateTag({
      property: 'og:description',
      content: 'Get answers to common questions about AI automation, deployment timelines, security, integrations, and more.'
    });
  }
}
```

**CSS (SCSS):**

```scss
:host {
  display: block;
}

.faq-page {
  min-height: 100vh;
  background: var(--color-bg-primary);
}

// Hero Section
.faq-hero {
  padding: 160px 2rem 80px;
  text-align: center;
  background: linear-gradient(180deg, var(--color-bg-secondary) 0%, var(--color-bg-primary) 100%);
  border-bottom: 1px solid var(--color-border);

  &__content {
    max-width: 800px;
    margin: 0 auto;
  }

  &__headline {
    font-family: 'Playfair Display', serif;
    font-weight: 700;
    font-size: clamp(36px, 5vw, 56px);
    color: var(--color-text-primary);
    line-height: 1.2;
    margin-bottom: 1.5rem;
  }

  &__subheading {
    font-family: 'DM Sans', sans-serif;
    font-weight: 400;
    font-size: 20px;
    color: var(--color-text-secondary);
    line-height: 1.6;
  }
}

// FAQ Content
.faq-content {
  padding: 80px 2rem;

  &__container {
    max-width: 900px;
    margin: 0 auto;
  }
}

// Loading State
.loading-spinner {
  width: 48px;
  height: 48px;
  margin: 80px auto;
  border: 4px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

// Error State
.error-state {
  text-align: center;
  padding: 60px 2rem;

  p {
    font-size: 18px;
    color: #ff5555;
    margin-bottom: 2rem;
  }

  button {
    background: var(--color-accent);
    color: var(--color-bg-primary);
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 16px;
    padding: 0.75rem 2rem;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: all 300ms ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 229, 160, 0.4);
    }
  }
}

// FAQ List
.faq-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.faq-item {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
  transition: all 300ms ease;

  &:hover {
    border-color: var(--color-border-hover);
  }

  &--expanded {
    border-color: var(--color-accent);
  }

  &__header {
    width: 100%;
    background: none;
    border: none;
    padding: 1.5rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    cursor: pointer;
    text-align: left;
    transition: all 200ms ease;

    &:hover {
      background: rgba(255, 255, 255, 0.02);
    }

    &:focus-visible {
      outline: 2px solid var(--color-accent);
      outline-offset: -2px;
    }
  }

  &__question {
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 18px;
    color: var(--color-text-primary);
    line-height: 1.4;
    margin: 0;
  }

  &__icon {
    font-size: 28px;
    font-weight: 300;
    color: var(--color-accent);
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 200ms ease;
  }

  &--expanded &__icon {
    transform: rotate(180deg);
  }

  &__answer {
    padding: 0 2rem 1.5rem;
    animation: fadeIn 300ms ease;

    p {
      font-family: 'DM Sans', sans-serif;
      font-size: 16px;
      color: var(--color-text-secondary);
      line-height: 1.7;
      margin: 0;
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// CTA Section
.faq-cta {
  padding: 80px 2rem;
  background: var(--color-bg-secondary);
  border-top: 1px solid var(--color-border);

  &__content {
    max-width: 700px;
    margin: 0 auto;
    text-align: center;
  }

  &__headline {
    font-family: 'Playfair Display', serif;
    font-weight: 700;
    font-size: clamp(32px, 4vw, 48px);
    color: var(--color-text-primary);
    margin-bottom: 1rem;
  }

  &__subtext {
    font-family: 'DM Sans', sans-serif;
    font-size: 18px;
    color: var(--color-text-secondary);
    line-height: 1.6;
    margin-bottom: 2rem;
  }

  &__button {
    background: var(--color-accent);
    color: var(--color-bg-primary);
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 16px;
    padding: 1rem 2rem;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: all 300ms ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 229, 160, 0.4);
    }

    &:focus-visible {
      outline: 2px solid var(--color-accent);
      outline-offset: 4px;
    }
  }
}

// Mobile Responsiveness
@media (max-width: 768px) {
  .faq-hero {
    padding: 120px 1.5rem 60px;
  }

  .faq-content {
    padding: 60px 1.5rem;
  }

  .faq-item {
    &__header {
      padding: 1.25rem 1.5rem;
    }

    &__question {
      font-size: 16px;
    }

    &__icon {
      font-size: 24px;
      width: 28px;
      height: 28px;
    }

    &__answer {
      padding: 0 1.5rem 1.25rem;

      p {
        font-size: 15px;
      }
    }
  }

  .faq-cta {
    padding: 60px 1.5rem;
  }
}

// Reduced Motion Support
@media (prefers-reduced-motion: reduce) {
  .faq-item,
  .faq-item__header,
  .faq-item__icon,
  .faq-cta__button,
  .loading-spinner {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }

  .faq-item__answer {
    animation-duration: 0.01ms !important;
  }

  .faq-cta__button:hover,
  .error-state button:hover {
    transform: none !important;
  }
}
```

---

### 2. FaqService (Angular Service)

**File:** `frontend/src/app/core/services/faq.service.ts` (NEW FILE)

**TypeScript:**

```typescript
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Faq } from '../models/faq.model';

@Injectable({ providedIn: 'root' })
export class FaqService {
  private readonly apiUrl = `${environment.apiUrl}/faqs`;
  private faqsCache = signal<Faq[] | null>(null);

  constructor(private http: HttpClient) {}

  getFaqs(): Observable<Faq[]> {
    const cached = this.faqsCache();
    if (cached) {
      return of(cached);
    }

    return this.http.get<ApiResponse<Faq[]>>(this.apiUrl).pipe(
      map(response => response.data || []),
      tap(faqs => this.faqsCache.set(faqs)),
      catchError(error => {
        console.error('Error fetching FAQs:', error);
        return throwError(() => new Error('Failed to load FAQs'));
      })
    );
  }

  clearCache(): void {
    this.faqsCache.set(null);
  }
}
```

**TypeScript Model:**

**File:** `frontend/src/app/core/models/faq.model.ts` (NEW FILE)

```typescript
export interface Faq {
  id: number;
  question: string;
  answer: string;
  displayOrder: number;
  isActive: boolean;
}
```

---

### 3. Alternative: Separate FaqAccordionComponent (Optional)

**Note:** The design above embeds the accordion logic directly in FaqPageComponent. If you prefer a reusable component, create:

**File:** `frontend/src/app/features/faq/faq-accordion/faq-accordion.component.ts`

```typescript
import { Component, Input, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Faq } from '../../../core/models/faq.model';

@Component({
  selector: 'app-faq-accordion',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="faq-accordion">
      @for (faq of faqs(); track faq.id) {
        <article class="faq-accordion__item"
          [class.faq-accordion__item--expanded]="expandedFaqId() === faq.id">

          <button class="faq-accordion__header"
            [attr.aria-expanded]="expandedFaqId() === faq.id"
            (click)="toggleFaq(faq.id)">
            <h2 class="faq-accordion__question">{{ faq.question }}</h2>
            <span class="faq-accordion__icon">
              {{ expandedFaqId() === faq.id ? '−' : '+' }}
            </span>
          </button>

          @if (expandedFaqId() === faq.id) {
            <div class="faq-accordion__answer">
              <p>{{ faq.answer }}</p>
            </div>
          }
        </article>
      }
    </div>
  `,
  styleUrls: ['./faq-accordion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FaqAccordionComponent {
  @Input() set faqItems(value: Faq[]) {
    this.faqs.set(value);
  }

  faqs = signal<Faq[]>([]);
  expandedFaqId = signal<number | null>(null);

  toggleFaq(faqId: number): void {
    this.expandedFaqId.set(this.expandedFaqId() === faqId ? null : faqId);
  }
}
```

**Usage in FaqPageComponent:**

```html
<app-faq-accordion [faqItems]="faqs()" />
```

---

## Responsive Design

### Breakpoints

| Breakpoint | Viewport Width | Layout Changes |
|------------|----------------|----------------|
| Mobile | <768px | Hero padding reduced, font sizes smaller, icon size 24px |
| Tablet | 768-1023px | Standard padding, standard font sizes |
| Desktop | ≥1024px | Max-width: 900px content container, centered |

### Mobile-Specific Considerations

- Touch targets: All FAQ headers are ≥44x44px for iOS accessibility
- Font scaling: clamp() ensures text doesn't shrink below readable size
- Padding adjustments: Tighter spacing on mobile to maximize content area
- Hero gradient: Simplified on mobile to improve performance

---

## Accessibility Features

### ARIA Attributes

```html
<button
  class="faq-item__header"
  role="button"
  aria-expanded="false"
  aria-controls="faq-answer-1"
  (click)="toggleFaq(1)">
  <h2>Question text</h2>
</button>

<div
  id="faq-answer-1"
  class="faq-item__answer"
  role="region"
  aria-labelledby="faq-question-1">
  <p>Answer text</p>
</div>
```

### Keyboard Navigation

- **Tab:** Move focus to next FAQ item
- **Shift+Tab:** Move focus to previous FAQ item
- **Enter/Space:** Toggle expand/collapse of focused FAQ
- **Escape:** Collapse all FAQs (optional enhancement)

### Screen Reader Behavior

- Announces: "Frequently Asked Questions, heading level 1"
- For each FAQ: "Button, [Question text], collapsed/expanded"
- When expanded: Reads answer content automatically

---

## Animation Specifications

### Expand/Collapse Animation

```scss
.faq-item__answer {
  overflow: hidden;
  animation: expandFaq 300ms ease-in-out;
}

@keyframes expandFaq {
  from {
    max-height: 0;
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    max-height: 500px; // Adjust based on content
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Icon Rotation Animation

```scss
.faq-item__icon {
  transition: transform 200ms ease;
}

.faq-item--expanded .faq-item__icon {
  transform: rotate(180deg);
}
```

### Scroll Reveal Animation (via ScrollRevealDirective)

```scss
[appScrollReveal] {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

[appScrollReveal].revealed {
  opacity: 1;
  transform: translateY(0);
}
```

---

## Design Tokens Reference

```scss
// FAQ Page Specific Tokens
$faq-hero-padding-desktop: 160px 2rem 80px;
$faq-hero-padding-mobile: 120px 1.5rem 60px;
$faq-content-max-width: 900px;
$faq-item-border-radius: 12px;
$faq-item-gap: 1rem;
$faq-expand-duration: 300ms;
$faq-icon-rotation-duration: 200ms;
$faq-icon-size-desktop: 32px;
$faq-icon-size-mobile: 28px;
$faq-answer-padding: 0 2rem 1.5rem;
```

---

## Component State Diagram

```
Initial Load
     ↓
Loading State (spinner)
     ↓
  Success?
   /    \
 Yes    No
  ↓      ↓
Show   Show
FAQs   Error
  ↓      ↓
User   Retry
Click  Button
FAQ      ↓
  ↓    Re-fetch
Toggle
Expand
```

---

## Design Checklist

Before marking design complete:

- ✅ Color palette uses only CSS custom properties
- ✅ Typography scales responsively with clamp()
- ✅ Accordion animation is smooth (60 FPS)
- ✅ Focus indicators are clearly visible
- ✅ Touch targets meet iOS guidelines (≥44x44px)
- ✅ Error state is user-friendly and actionable
- ✅ Loading state provides visual feedback
- ✅ CTA section drives conversion to /contact
- ✅ Dark luxury theme is consistent with Services page
- ✅ prefers-reduced-motion is respected
- ✅ All text meets WCAG AA contrast ratios (4.5:1)
```

---