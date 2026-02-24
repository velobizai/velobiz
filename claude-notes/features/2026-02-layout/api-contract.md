# FEATURE 1: Layout (Navbar + Footer) — API Contract Specification

**Feature ID:** FEATURE-001
**Feature Name:** Layout (Navbar + Footer)
**Date:** 2026-02-20
**Status:** No API Required

---

## 1. Summary

**This feature requires NO backend API integration.**

The Navbar and Footer components are purely frontend layout components with static content. All navigation links, social media URLs, and footer content are either:
1. **Hardcoded** in component TypeScript files as constants
2. **Configured** in frontend configuration files (`layout.config.ts`, `environment.ts`)

There is no dynamic data fetching, no user session state, and no database interaction required for this feature.

---

## 2. API Endpoints

**Total API Endpoints:** 0

**Backend Controllers Required:** None

**Backend Services Required:** None

**Database Tables Required:** None

---

## 3. Data Sources

### 3.1 Navigation Links
**Source:** `src/app/layout/layout.config.ts`

**Data Structure:**
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
```

**Usage:** Hardcoded constant array consumed directly by `NavbarComponent` and `FooterComponent`.

**Update Mechanism:** Developers modify `layout.config.ts` and rebuild Angular application. No runtime updates.

---

### 3.2 Social Media Links
**Source:** `src/environments/environment.ts` (development) and `environment.prod.ts` (production)

**Data Structure:**
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api',
  social: {
    linkedin: 'https://linkedin.com/company/velocityai',
    twitter: 'https://twitter.com/velocityai',
    github: 'https://github.com/velocityai'
  }
};
```

**Usage:** Imported directly in `FooterComponent` and `NavbarComponent` (mobile menu).

**Update Mechanism:**
- **Development**: Edit `environment.ts`, restart `ng serve`
- **Production**: Edit `environment.prod.ts`, rebuild with `ng build --configuration production`, redeploy to Vercel

---

### 3.3 Footer Content
**Source:** `src/app/layout/layout.config.ts`

**Data Structure:**
```typescript
export const FOOTER_QUICK_LINKS: NavLink[] = [
  { label: 'Home', route: '/' },
  { label: 'Services', route: '/services' },
  { label: 'Pricing', route: '/pricing' },
  { label: 'FAQ', route: '/faq' },
  { label: 'Contact', route: '/contact' }
];

export const FOOTER_COMPANY_LINKS: NavLink[] = [
  { label: 'About', route: '#' },      // Placeholder
  { label: 'Careers', route: '#' },    // Placeholder
  { label: 'Blog', route: '#' }        // Placeholder
];

export const FOOTER_LEGAL_LINKS: NavLink[] = [
  { label: 'Privacy Policy', route: '#' },      // Placeholder
  { label: 'Terms of Service', route: '#' },    // Placeholder
  { label: 'Cookie Policy', route: '#' }        // Placeholder
];
```

**Usage:** Consumed directly by `FooterComponent` template via component TypeScript.

**Update Mechanism:** Edit `layout.config.ts`, rebuild Angular application.

---

### 3.4 Branding Content (Logo, Tagline, Description)
**Source:** Hardcoded in `footer.component.ts` and `navbar.component.ts`

**Example:**
```typescript
export class FooterComponent {
  readonly companyName = 'VelocityAI';
  readonly tagline = 'AI Automation for Modern Businesses';
  readonly description = 'We build intelligent automation systems that scale your operations without adding headcount.';
  readonly currentYear = new Date().getFullYear();
}
```

**Update Mechanism:** Edit component TypeScript file, rebuild application.

---

## 4. No Backend Dependencies

### 4.1 No API Calls
- Navbar does NOT call any API endpoints
- Footer does NOT call any API endpoints
- No `HttpClient` imports required in Navbar or Footer components
- No loading states, error states, or API response handling needed

### 4.2 No Authentication State
- No user login/logout state tracked in navbar
- No user avatar or profile dropdown
- No protected routes requiring authentication headers
- No session tokens or JWT handling

### 4.3 No Dynamic Content
- No "latest blog posts" in footer (no API call to fetch posts)
- No "notification badge" in navbar (no unread count from API)
- No "shopping cart count" (not an e-commerce site)
- No "announcement banner" fetched from CMS

---

## 5. Client-Side Routing Only

All navigation is handled by **Angular Router** (client-side routing). No server-side redirects or API-based navigation.

### Routing Mechanism
```typescript
import { RouterLink, RouterLinkActive } from '@angular/router';

// In template:
<a routerLink="/" routerLinkActive="active">Home</a>
<a routerLink="/services" routerLinkActive="active">Services</a>
```

**How it works:**
1. User clicks a navigation link
2. Angular Router changes the route (URL) client-side (no page reload)
3. Corresponding page component is lazy-loaded and rendered in `<router-outlet>`
4. `RouterLinkActive` directive adds `.active` class to the link matching the current route

**No API involvement in navigation flow.**

---

## 6. Future API Considerations

### 6.1 Newsletter Signup (Out of Scope for This Feature)
A future feature may add a newsletter signup form in the footer. When implemented, it will require:

**Endpoint:** `POST /api/newsletter`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": null,
  "message": "Thank you for subscribing!"
}
```

**Implementation Note:** This is NOT part of FEATURE 1. Newsletter signup will be added in a separate feature after the backend newsletter endpoint is fully implemented in FEATURE 6 or later.

---

### 6.2 Dynamic Navigation (Out of Scope)
If VelocityAI later requires dynamic navigation (e.g., fetching nav links from a CMS), a future enhancement could add:

**Endpoint:** `GET /api/navigation`

**Response:**
```json
{
  "success": true,
  "data": {
    "navLinks": [
      { "label": "Home", "route": "/" },
      { "label": "Services", "route": "/services" },
      ...
    ]
  },
  "message": "Navigation data retrieved successfully"
}
```

**Implementation Note:** This is NOT needed for initial launch. Hardcoded navigation is sufficient for a marketing website with stable structure.

---

## 7. Configuration File Reference

### File: `src/app/layout/layout.config.ts`
**Purpose:** Central configuration for all navigation and footer links

**Exports:**
- `NAV_LINKS` (Array of NavLink objects for navbar)
- `FOOTER_QUICK_LINKS` (Array of NavLink objects for footer Quick Links column)
- `FOOTER_COMPANY_LINKS` (Array of NavLink objects for footer Company column)
- `FOOTER_LEGAL_LINKS` (Array of NavLink objects for footer Legal column)

**Update Frequency:** Rarely (only when adding/removing pages or changing link labels)

**Access Control:** Developers only (no admin UI for editing navigation)

---

### File: `src/environments/environment.ts`
**Purpose:** Environment-specific configuration (development, staging, production)

**Relevant Properties:**
- `environment.social.linkedin` (string)
- `environment.social.twitter` (string)
- `environment.social.github` (string)

**Update Frequency:** Rarely (only when social media URLs change)

**Override Mechanism:** `environment.prod.ts` overrides values for production builds

---

## 8. Testing Considerations

### 8.1 No API Mocking Required
Since there are no API calls, unit tests for Navbar and Footer do NOT need:
- `HttpClientTestingModule`
- Mock API responses
- `HttpTestingController` assertions

### 8.2 Configuration Testing
Unit tests should verify:
- Navigation links are correctly imported from `layout.config.ts`
- Social links are correctly imported from `environment.ts`
- Clicking a link triggers Angular Router navigation (not HTTP request)

**Example Test:**
```typescript
describe('NavbarComponent', () => {
  it('should load navigation links from config', () => {
    const fixture = TestBed.createComponent(NavbarComponent);
    const component = fixture.componentInstance;

    expect(component.navLinks).toEqual(NAV_LINKS);
    expect(component.navLinks.length).toBe(5);
  });

  it('should navigate to correct route on link click', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    // Trigger link click
    const compiled = fixture.nativeElement;
    const servicesLink = compiled.querySelector('a[href="/services"]');
    servicesLink.click();

    expect(router.navigate).toHaveBeenCalledWith(['/services']);
  });
});
```

---

## 9. Documentation for Future Developers

### How to Add a New Navigation Link

1. **Add route to `layout.config.ts`:**
```typescript
export const NAV_LINKS: NavLink[] = [
  // ... existing links
  { label: 'New Page', route: '/new-page' }
];
```

2. **Create the page component and route:**
```typescript
// In app.routes.ts
{
  path: 'new-page',
  loadComponent: () => import('./features/new-page/new-page.component')
}
```

3. **Rebuild and deploy:**
```bash
ng build --configuration production
# Deploy to Vercel
```

**No backend changes required.**

---

### How to Update Social Media URLs

1. **Edit `environment.prod.ts`:**
```typescript
export const environment = {
  production: true,
  social: {
    linkedin: 'https://linkedin.com/company/new-velocityai',
    twitter: 'https://twitter.com/velocityai_new',
    github: 'https://github.com/velocityai-new'
  }
};
```

2. **Rebuild and deploy:**
```bash
ng build --configuration production
# Deploy to Vercel
```

**No backend changes required.**

---

## 10. Summary Checklist

- ✅ **Zero API endpoints** required for this feature
- ✅ **Zero database tables** required for this feature
- ✅ **Zero backend controllers/services** required for this feature
- ✅ All data is **static/hardcoded** or from **frontend config files**
- ✅ Navigation uses **Angular Router** (client-side routing only)
- ✅ Social links are **external URLs** (no API tracking)
- ✅ No **authentication state** managed in navbar
- ✅ No **dynamic content fetching** in footer
- ✅ **Unit tests** do NOT require `HttpClientTestingModule`
- ✅ Future newsletter signup is **out of scope** for this feature

---

**Document Version:** 1.0
**Last Updated:** 2026-02-20
**API Integration Required:** None
**Backend Work Required:** None
