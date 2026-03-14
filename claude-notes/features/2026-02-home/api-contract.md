# API Contract — FEATURE 2: Home / Landing Page

**Feature ID:** 2026-02-home
**Feature Name:** Home / Landing Page
**Date:** 2026-02-20
**Status:** Specification Complete

---

## Overview

**FEATURE 2: Home / Landing Page has NO API dependencies.**

This feature is purely frontend with all content hardcoded in component TypeScript files. No backend API calls are made from any Home page component.

---

## API Endpoints

**None.**

---

## Routing

### Angular Client-Side Routes

All routing is handled by Angular Router with client-side navigation.

#### Home Route

**Route:** `/`
**Component:** `HomePageComponent`
**Lazy Loading:** No (eager load as default route)
**Route Guards:** None
**Title:** `Velobiz - AI Automation that Accelerates Your Business`

**Route Definition:**
```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    title: 'Velobiz - AI Automation that Accelerates Your Business',
    data: {
      metaDescription: 'Transform your business with AI automation. 24/7 intelligent agents, instant scaling, 99% uptime. Trusted by 500+ businesses.',
      ogImage: '/assets/og-home.jpg'
    }
  }
];
```

#### CTA Button Routes

**Hero Primary CTA:**
- Button Text: "Get Started"
- Route: `/contact`
- Navigation: Client-side via `routerLink="/contact"`

**Hero Secondary CTA:**
- Button Text: "View Services"
- Route: `/services`
- Navigation: Client-side via `routerLink="/services"`

**CTA Banner Button:**
- Button Text: "Schedule Consultation"
- Route: `/contact`
- Navigation: Client-side via `routerLink="/contact"`

---

## Data Flow

### Data Source

All content is **static** and **hardcoded** in component TypeScript files as constants:

```typescript
// hero.component.ts
const HERO_CONTENT = {
  badge: 'Trusted by 100+ businesses',
  headline: 'AI Automation that Accelerates Your Business',
  subheading: 'Transform your operations with intelligent AI agents that work 24/7, scale instantly, and never miss a beat.',
  primaryCTA: { label: 'Get Started', route: '/contact' },
  secondaryCTA: { label: 'View Services', route: '/services' }
};

// stats-bar.component.ts
const STATS = [
  { value: 500, suffix: '+', label: 'Clients Served' },
  { value: 2000000, suffix: '+', label: 'Hours Saved', format: 'M' },
  { value: 99, suffix: '%', label: 'Uptime Guarantee' },
  { value: 24, suffix: '/7', label: 'Support Availability' }
];

// process.component.ts
const PROCESS_STEPS = [
  { number: 1, title: 'Discovery Call', description: '...' },
  { number: 2, title: 'Custom Design', description: '...' },
  { number: 3, title: 'Integration', description: '...' },
  { number: 4, title: 'Optimization', description: '...' }
];

// industries.component.ts
const INDUSTRIES = [
  { icon: '🏥', name: 'Healthcare' },
  { icon: '🏦', name: 'Financial Services' },
  // ... 6 more industries
];
```

### Data Mutations

**No data mutations.** This feature does not create, update, or delete any data.

---

## External Dependencies

**None.**

- No HTTP calls to backend APIs
- No third-party API integrations
- No external data sources

---

## Future API Integration (Out of Scope)

The following are **NOT** included in this feature but may be added in future:

### Analytics Event Tracking

Future consideration: Send analytics events to Google Analytics 4 or similar.

**Example (not implemented):**
```typescript
// Future: Track CTA clicks
trackEvent('cta_click', {
  button_text: 'Get Started',
  button_location: 'hero',
  destination: '/contact'
});
```

### A/B Testing

Future consideration: Fetch headline/CTA variants from backend for A/B testing.

**Example (not implemented):**
```typescript
// Future: GET /api/experiments/home-hero
// Response: { headline: string, ctaText: string }
```

### Dynamic Content

Future consideration: Move stats numbers to backend for easier updates.

**Example (not implemented):**
```typescript
// Future: GET /api/stats/homepage
// Response: { clientsServed: number, hoursSaved: number, ... }
```

---

## Configuration

### Environment Variables

**None required.**

All content is hardcoded in component files. No environment-specific configuration needed.

---

## Error Handling

**Not applicable.**

Since there are no API calls, there are no API errors to handle.

---

## Authentication

**Not applicable.**

Home page is publicly accessible with no authentication required.

---

## Rate Limiting

**Not applicable.**

No API calls means no rate limiting concerns.

---

## Testing

### API Testing

**Not applicable.** No API endpoints to test.

### Routing Testing

**Angular Router Tests:**

```typescript
describe('Home Routing', () => {
  it('should navigate to home page on root route', async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)]
    }).compileComponents();

    const router = TestBed.inject(Router);
    const fixture = TestBed.createComponent(AppComponent);

    await router.navigate(['/']);

    expect(router.url).toBe('/');
  });

  it('should navigate to contact page when hero primary CTA is clicked', async () => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');

    const compiled = fixture.nativeElement;
    const ctaButton = compiled.querySelector('.btn-primary');
    ctaButton.click();

    expect(navigateSpy).toHaveBeenCalledWith(['/contact']);
  });

  it('should navigate to services page when hero secondary CTA is clicked', async () => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');

    const compiled = fixture.nativeElement;
    const ctaButton = compiled.querySelector('.btn-secondary');
    ctaButton.click();

    expect(navigateSpy).toHaveBeenCalledWith(['/services']);
  });
});
```

---

## Approval

**Reviewed By:** Lead Agent
**Approved By:** User
**Date:** 2026-02-20
**Status:** APPROVED ✅

**Summary:**
- ✅ No API endpoints required
- ✅ All content static/hardcoded
- ✅ Client-side routing only (Angular Router)
- ✅ No backend dependencies
- ✅ No authentication required
- ✅ Publicly accessible

**Next Steps:**
1. Generate db-schema.md
2. Generate tasks.md
3. Generate test-plan.md
