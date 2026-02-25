# Requirements — FEATURE 2: Home / Landing Page

**Feature ID:** 2026-02-home
**Feature Name:** Home / Landing Page
**Date:** 2026-02-20
**Status:** Specification Complete

---

## Business Problem

The Home/Landing Page serves as the primary entry point and conversion funnel for the Velobiz website. It addresses the critical business need to:

- **Establish credibility** for Velobiz as a premium AI automation agency
- **Communicate value proposition** clearly and compellingly to first-time visitors
- **Convert cold traffic** from search engines, social media, and referrals into warm leads
- **Guide visitors** toward high-intent actions (book consultation, view services, contact)
- **Differentiate** Velobiz from competitors through a premium, modern design aesthetic

Without a strong landing page, Velobiz loses potential clients at the first touchpoint, resulting in high bounce rates and low conversion rates.

---

## Target Users

### Primary Users
- **Business Owners** — Small to mid-size business owners seeking operational efficiency
- **Operations Managers** — Decision-makers responsible for process optimization and cost reduction
- **C-Suite Executives** — CEOs, COOs, and CTOs evaluating AI automation vendors

### User Characteristics
- **Pain Points:** Manual processes, high labor costs, slow response times, scaling challenges
- **Goals:** Reduce operational costs, improve customer experience, scale without proportional hiring
- **Behavior:** Browsing multiple AI service providers, comparing offerings, seeking social proof
- **Technical Literacy:** Low to medium — not developers, need clear outcome-focused messaging

### Traffic Sources
- **Organic Search** — Google searches for "AI automation agency", "AI voice agents", etc.
- **Paid Ads** — Google Ads, Facebook/Instagram, LinkedIn sponsored content
- **Referrals** — Word-of-mouth from existing clients
- **Content Marketing** — Blog posts, case studies, webinars

---

## Success Criteria

### Quantitative Metrics
| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Page Load Time (3G) | <3 seconds | Lighthouse CI, WebPageTest |
| Largest Contentful Paint (LCP) | <2.5 seconds | Core Web Vitals, Google Search Console |
| First Input Delay (FID) | <100ms | Real User Monitoring (RUM), Vercel Analytics |
| Cumulative Layout Shift (CLS) | <0.1 | Core Web Vitals |
| Lighthouse Performance Score | ≥90 | Lighthouse CI in build pipeline |
| Lighthouse Accessibility Score | ≥90 | Lighthouse CI in build pipeline |
| Hero CTA Click-Through Rate | >15% | Google Analytics 4 event tracking |
| Average Time on Page | >45 seconds | Google Analytics 4 |
| Scroll Depth (75% of page) | >60% of visitors | Google Analytics 4, Hotjar |
| Mobile Bounce Rate | <50% | Google Analytics 4 |

### Qualitative Metrics
- ✅ Smooth 60 FPS animations with no jank during scroll
- ✅ Stats counter animations trigger correctly on scroll into viewport
- ✅ All interactive elements keyboard accessible
- ✅ Design matches approved "dark luxury" aesthetic
- ✅ Content clearly communicates Velobiz's value proposition
- ✅ Mobile responsiveness verified on iOS Safari and Android Chrome
- ✅ No horizontal scroll on any device width (320px-1920px+)

---

## User Stories

### Story 1: Hero Section — First Impression
**As a** business owner visiting the site for the first time
**I want to** immediately understand what Velobiz does and how it benefits me
**So that** I can decide whether to continue exploring or leave

**Acceptance Criteria:**
- ✅ Hero section loads within 1.5 seconds on 4G connection
- ✅ Headline clearly states the value proposition ("AI Automation that Accelerates Your Business")
- ✅ Animated badge ("Trusted by 100+ businesses") adds credibility with subtle pulse animation
- ✅ Two CTA buttons are visible above the fold: "Get Started" and "View Services"
- ✅ Background glow orbs animate smoothly without impacting performance
- ✅ Scroll indicator prompts user to continue scrolling
- ✅ Mobile: Headline resizes to fit small screens without overflow

---

### Story 2: Stats Bar — Social Proof
**As a** operations manager evaluating AI automation vendors
**I want to** see quantifiable proof that Velobiz has experience and reliability
**So that** I can trust them with my business operations

**Acceptance Criteria:**
- ✅ Stats bar displays 4 key metrics: Clients Served, Hours Saved, Uptime Guarantee, Support Availability
- ✅ Counter animation triggers when stats bar scrolls into viewport using IntersectionObserver
- ✅ Counters count up from 0 to target value over 2 seconds with smooth easing
- ✅ Animation triggers only once per page load (not every time user scrolls past)
- ✅ Large numbers formatted with suffixes (2,000,000 → "2M+")
- ✅ Desktop: 4 metrics in a horizontal row
- ✅ Mobile: 2×2 grid layout

---

### Story 3: Process Section — Understanding the Journey
**As a** decision-maker considering Velobiz's services
**I want to** understand the steps involved in working with Velobiz
**So that** I can set realistic expectations and feel confident moving forward

**Acceptance Criteria:**
- ✅ Section displays 4 clearly numbered steps: Discovery Call, Custom Design, Integration, Optimization
- ✅ Each step has a title and concise description
- ✅ Desktop: Horizontal timeline with visual connector line between steps
- ✅ Mobile: Vertical stacked cards (no horizontal timeline)
- ✅ Section fades up using ScrollRevealDirective when scrolled into view
- ✅ Steps are easy to scan and understand at a glance

---

### Story 4: Industries Section — Relevance Check
**As a** business owner in a specific industry
**I want to** see if Velobiz serves businesses like mine
**So that** I can confirm their services are relevant to my industry

**Acceptance Criteria:**
- ✅ Section displays 8 industry tiles: Healthcare, Financial Services, E-Commerce, Real Estate, Professional Services, Education, Manufacturing, Logistics
- ✅ Each tile has a large emoji icon and industry name
- ✅ Desktop: 4-column grid layout
- ✅ Tablet: 2-column grid layout
- ✅ Mobile: 1-column stacked layout
- ✅ Hover effect: Card lifts and glows with smooth 300ms transition
- ✅ Section fades up using ScrollRevealDirective

---

### Story 5: CTA Banner — Final Conversion Opportunity
**As a** visitor who has read through the entire page
**I want** a clear call-to-action to take the next step
**So that** I can easily schedule a consultation without hunting for a contact form

**Acceptance Criteria:**
- ✅ Full-width dark card with teal accent border stands out from rest of page
- ✅ Headline: "Ready to Automate Your Business?"
- ✅ Subtext: "Book a free 30-minute consultation"
- ✅ Primary CTA button: "Schedule Consultation" routes to `/contact` page
- ✅ Button has hover effect (lift + glow)
- ✅ Section is above the footer and easy to spot while scrolling

---

## Functional Requirements

### FR-1: Hero Section
- **FR-1.1:** Display animated badge with "Trusted by 100+ businesses" text and pulse animation
- **FR-1.2:** Display headline "AI Automation that Accelerates Your Business" in Playfair Display serif font
- **FR-1.3:** Display subheading with value proposition summary
- **FR-1.4:** Render two CTA buttons: Primary ("Get Started" → `/contact`), Secondary ("View Services" → `/services`)
- **FR-1.5:** Render animated gradient glow orbs in background using CSS @keyframes
- **FR-1.6:** Render subtle grid overlay pattern over background
- **FR-1.7:** Display animated scroll indicator (down arrow) at bottom of hero section
- **FR-1.8:** Buttons route to `/contact` and `/services` using Angular Router

### FR-2: Stats Bar
- **FR-2.1:** Display 4 animated counter metrics with values, suffixes, and labels
- **FR-2.2:** Detect when stats bar enters viewport using IntersectionObserver
- **FR-2.3:** Trigger count-up animation from 0 to target value over 2 seconds
- **FR-2.4:** Format large numbers with suffixes ("M+" for millions)
- **FR-2.5:** Store animation trigger state in Signal to prevent re-animation on subsequent scrolls
- **FR-2.6:** Apply frosted glass effect with backdrop blur

### FR-3: Process Section
- **FR-3.1:** Display section heading "How It Works"
- **FR-3.2:** Render 4 process steps with numbered circles, titles, and descriptions
- **FR-3.3:** On desktop: Display horizontal timeline with connector line between steps
- **FR-3.4:** On mobile: Display vertical stacked cards without connector line
- **FR-3.5:** Apply ScrollRevealDirective fade-up animation to section

### FR-4: Industries Section
- **FR-4.1:** Display section heading "Industries We Serve"
- **FR-4.2:** Render 8 industry tiles with emoji icons and names
- **FR-4.3:** Apply responsive grid: 4 columns (desktop), 2 columns (tablet), 1 column (mobile)
- **FR-4.4:** Apply hover effect: Card lift (translateY) and glow box-shadow
- **FR-4.5:** Apply ScrollRevealDirective fade-up animation to section

### FR-5: CTA Banner
- **FR-5.1:** Display full-width dark card with teal accent border
- **FR-5.2:** Display headline "Ready to Automate Your Business?"
- **FR-5.3:** Display subtext "Book a free 30-minute consultation"
- **FR-5.4:** Render primary CTA button "Schedule Consultation" routing to `/contact`
- **FR-5.5:** Apply button hover effect (lift + glow)

### FR-6: Page Container
- **FR-6.1:** HomePageComponent assembles all 5 section components
- **FR-6.2:** Home route `/` registered in Angular routing configuration
- **FR-6.3:** Page loads eagerly (not lazy-loaded) as default route
- **FR-6.4:** All sections rendered in correct order within `<main>` semantic tag

---

## Non-Functional Requirements

### NFR-1: Performance
- **NFR-1.1:** Initial page load completes in <3 seconds on 3G connection
- **NFR-1.2:** Largest Contentful Paint (LCP) occurs within 2.5 seconds
- **NFR-1.3:** First Input Delay (FID) <100ms
- **NFR-1.4:** Cumulative Layout Shift (CLS) <0.1
- **NFR-1.5:** All animations run at 60 FPS with no jank
- **NFR-1.6:** Home page lazy chunk size <200 KB
- **NFR-1.7:** Zero external image dependencies (emoji icons only)

### NFR-2: Accessibility (WCAG 2.1 AA)
- **NFR-2.1:** All interactive elements keyboard accessible (Tab, Enter, Space)
- **NFR-2.2:** All CTA buttons have descriptive `aria-label` attributes
- **NFR-2.3:** Semantic HTML structure with proper heading hierarchy (`<h1>`, `<h2>`)
- **NFR-2.4:** Focus visible indicators on all buttons and links
- **NFR-2.5:** Color contrast ratio ≥4.5:1 for all text
- **NFR-2.6:** Scroll animations respect `prefers-reduced-motion` media query
- **NFR-2.7:** Screen reader announces section headings correctly

### NFR-3: Mobile Responsiveness
- **NFR-3.1:** No horizontal scroll on any device width (320px-1920px+)
- **NFR-3.2:** All tap targets ≥44px × 44px for touch accessibility
- **NFR-3.3:** Hero headline resizes fluidly using `clamp()` CSS function
- **NFR-3.4:** Stats bar switches to 2×2 grid on mobile (<768px)
- **NFR-3.5:** Process section switches to vertical stacked layout on mobile
- **NFR-3.6:** Industries grid switches to 2 columns (tablet), 1 column (mobile)
- **NFR-3.7:** All content readable on smallest screen (320px width)

### NFR-4: SEO
- **NFR-4.1:** Semantic HTML structure with `<header>`, `<main>`, `<section>` tags
- **NFR-4.2:** Single `<h1>` tag for hero headline
- **NFR-4.3:** All sections have `<h2>` tags for section headings
- **NFR-4.4:** Meta tags set via Angular Meta service (title, description, OG tags)
- **NFR-4.5:** Schema.org structured data for Organization and LocalBusiness

### NFR-5: Maintainability
- **NFR-5.1:** Each section is a standalone Angular component
- **NFR-5.2:** All components use OnPush change detection strategy
- **NFR-5.3:** All content hardcoded in component TypeScript (no external config files)
- **NFR-5.4:** All colors reference CSS custom properties (no hardcoded hex values)
- **NFR-5.5:** ScrollRevealDirective reused from Feature 0 shared components
- **NFR-5.6:** All components have unit tests with ≥80% coverage

---

## Dependencies

### Upstream Dependencies (Must Complete First)
- **FEATURE 0: Infrastructure & Shared Foundation** — ScrollRevealDirective, global CSS custom properties, Angular routing setup
- **FEATURE 1: Layout (Navbar + Footer)** — Layout shell, navbar, footer components

### Downstream Dependencies (Blocked Until This Completes)
- None — Other features do not depend on Home Page

### External Dependencies
- None — No API calls, no database queries, no third-party services

---

## Out of Scope

The following are explicitly **NOT** included in this feature:

- ❌ Backend API integration (all content is static/hardcoded)
- ❌ Database queries or data persistence
- ❌ User authentication or personalization
- ❌ Testimonials section (future feature)
- ❌ Video background (future consideration)
- ❌ Blog post previews or news section
- ❌ Live chat widget integration
- ❌ Google Analytics event tracking (may be added in polish phase)
- ❌ A/B testing variants (future optimization)
- ❌ Multi-language support (future consideration)

---

## Assumptions

- ✅ All content (headlines, descriptions, stats, industry names) is final and approved
- ✅ ScrollRevealDirective from Feature 0 is complete and ready to use
- ✅ Dark luxury theme CSS custom properties are defined globally
- ✅ Angular routing is configured and working
- ✅ Navbar from Feature 1 correctly handles fixed positioning and scroll behavior
- ✅ `/contact` and `/services` routes exist (Feature 3, 6) or will be created before Hero CTAs are tested

---

## Risks and Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Glow orb animations cause performance issues on low-end devices | High | Medium | Use CSS animations only (no JS), test on slow devices, add `prefers-reduced-motion` fallback |
| Stats counter animation re-triggers on every scroll past | Medium | Medium | Store triggered state in Signal, check before re-animating |
| Hero headline overflows on very small screens (<320px) | Medium | Low | Use `clamp()` CSS for fluid typography, test on smallest devices |
| Scroll reveal animations feel too slow or too fast | Low | Medium | Make stagger delay configurable in ScrollRevealDirective, A/B test timing |
| Stats numbers become outdated | Low | Medium | Plan for easy content updates via component constants at top of file |

---

## Approval

**Reviewed By:** Lead Agent
**Approved By:** User
**Date:** 2026-02-20
**Status:** APPROVED ✅

**Next Steps:**
1. Generate design.md with component specifications
2. Generate api-contract.md (document "none")
3. Generate db-schema.md (document "none")
4. Generate tasks.md with implementation breakdown
5. Generate test-plan.md with unit/accessibility/performance tests
