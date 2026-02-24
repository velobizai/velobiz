Project Name: VelocityAI
Project Type: Marketing/Agency Website — Full Stack (Angular 19 + .NET Core 8 + MySQL 8 + Entity Framework Core)
Purpose: A premium AI automation agency website that showcases our services, attracts leads, and books consultations. Similar look and feel to a dark-themed SaaS agency site with a modern, high-end aesthetic.

--- FEATURE ARCHITECTURE INSTRUCTION (READ FIRST) ---

This project must be structured as individual features — one feature per page or major functional area. Do NOT treat this as a single monolithic spec. Each feature must get its own dedicated spec folder under claude-notes/features/[YYYY-MM]-[feature-name]/ and must contain its own:
  - requirements.md       (what the feature does, user stories, acceptance criteria)
  - design.md             (UI layout, component breakdown, animations, responsive behaviour)
  - api-contract.md       (endpoints consumed or exposed, request/response shapes)
  - db-schema.md          (EF Core entity classes, DbContext configuration, and migrations relevant to this feature)
  - tasks.md              (breakdown of DB → API → UI tasks in dependency order)
  - test-plan.md          (unit, integration, and e2e test cases for this feature)

The Lead Agent must:
  1. Create the feature folder and all 6 documents above before any code is written for that feature.
  2. Present the completed spec to the user for approval before routing tasks to sub-agents.
  3. Build and test each feature in isolation before moving to the next.
  4. Only merge feature work into the main branch after the feature passes its own test plan.
  5. Never mix tasks from two different features in the same build cycle.

Features must be specced and built in the dependency order listed in the FEATURE LIST section below. Infrastructure (database, backend scaffold, shared layout) must be completed first as it is a dependency of all page features.

--- FEATURE LIST AND BUILD ORDER ---

FEATURE 0: Infrastructure & Shared Foundation
  Folder: claude-notes/features/[YYYY-MM]-infrastructure/
  Scope: Everything that all other features depend on. Must be completed and verified before any page feature begins.
  Includes:
    - .NET Core 8 Web API project scaffold with clean folder structure
    - MySQL 8 database setup and connection string configuration in appsettings.json
    - Entity Framework Core setup: ApplicationDbContext, all 4 entity classes, initial migration generated and applied
    - EF Core seed data configured in ApplicationDbContext.OnModelCreating using HasData() for all 8 services and 6 FAQs
    - Global middleware: exception handler, CORS policy, request validation pipeline
    - Shared API response wrapper (ApiResponse<T> generic class in C#)
    - Angular 19 project scaffold with Angular Material theme
    - proxy.conf.json for local API forwarding (/api/* → https://localhost:5001)
    - Shared CSS custom properties (color theme variables)
    - Core Angular services: ApiService (HttpClient wrapper), ToastService
    - Reusable shared components: LoadingSpinnerComponent, ToastComponent
    - Environment files (appsettings.Development.json, appsettings.Production.json, Angular environment.ts / environment.prod.ts)
    - README with local setup, EF Core migration workflow, and deployment instructions

  Note on EF Core with MySQL: Entity Framework Core is used for all database access — schema definition, migrations, seeding, and runtime queries. The MySQL provider is Pomelo.EntityFrameworkCore.MySql, which is the community-maintained standard for MySQL + EF Core and supports all MySQL 8 features. ApplicationDbContext is the single source of truth for the database schema. Migrations are managed via the dotnet ef CLI. No separate seeding script or external tooling is required — seed data lives in OnModelCreating using HasData() and is applied automatically during dotnet ef database update.

FEATURE 1: Layout (Navbar + Footer)
  Folder: claude-notes/features/[YYYY-MM]-layout/
  Scope: Persistent shell components that wrap all pages. Built immediately after infrastructure.
  Includes:
    - Fixed frosted-glass navbar with logo, nav links, and CTA button
    - Mobile hamburger menu with slide-in/out animation
    - Navbar opacity transition on scroll
    - Multi-column footer with brand, services, company, and legal link columns
    - Social icons row and copyright bar
    - Active link highlighting based on scroll position (scrollspy)
  Note: No API dependency. Static content only.

FEATURE 2: Home / Landing Page
  Folder: claude-notes/features/[YYYY-MM]-home/
  Scope: The main entry point of the site. A single-page view composed of multiple sections, all living under the / root route. Each section below is a separate Angular standalone component but they are all part of this one feature.
  Sections included in this feature:
    - Hero section (animated badge, serif headline, CTA buttons, background glow orbs, grid overlay)
    - Stats / Social Proof bar (4 animated counter metrics)
    - How It Works / Process section (4-step numbered process with connector line)
    - Industries section (8 industry tiles with emoji icons)
    - CTA banner section (full-width dark card with contact CTA)
  Note: No API dependency for this feature. All content is static. Stats counter animation triggers on scroll into view via IntersectionObserver.

FEATURE 3: Services Page
  Folder: claude-notes/features/[YYYY-MM]-services/
  Scope: Dedicated /services route displaying all 8 AI automation services. Data-driven from the backend.
  Includes:
    - Services grid (8 cards with icon, title, short description, hover reveal of long description)
    - Card hover glow animation
    - GET /api/services endpoint (.NET Core 8 controller action + EF Core LINQ query against MySQL)
    - Service entity seeded via HasData() in ApplicationDbContext with all 8 service entries
    - Angular ServicesService to fetch and cache the services list
    - Loading state and error state handling in the UI
  API contract: GET /api/services → { success: true, data: Service[], message: string }

FEATURE 4: Pricing Page
  Folder: claude-notes/features/[YYYY-MM]-pricing/
  Scope: Dedicated /pricing route displaying the 3 pricing tiers.
  Includes:
    - 3 pricing cards: Starter ($1,500/mo), Growth ($4,500/mo — featured), Enterprise (Custom)
    - Feature checklist per card
    - CTA button per card linking to the contact form
    - Featured card visual treatment (highlighted border, accent background)
  Note: No API dependency. Static content only.

FEATURE 5: FAQ Page
  Folder: claude-notes/features/[YYYY-MM]-faq/
  Scope: Dedicated /faq route with accordion-style FAQ list. Data-driven from the backend.
  Includes:
    - Accordion FAQ list (click to expand/collapse with smooth animation)
    - GET /api/faqs endpoint (.NET Core 8 controller action + EF Core LINQ query ordered by DisplayOrder)
    - Faq entity seeded via HasData() in ApplicationDbContext with all 6 FAQ entries
    - Angular FaqService to fetch and cache the FAQ list
    - Loading state and error state handling
  API contract: GET /api/faqs → { success: true, data: Faq[], message: string }

FEATURE 6: Contact Page
  Folder: claude-notes/features/[YYYY-MM]-contact/
  Scope: Dedicated /contact route with a full contact form wired to the backend.
  Includes:
    - Reactive contact form: Full Name, Email, Company (optional), Phone (optional), Message, Service Interest dropdown (8 services + "Not sure yet")
    - Honeypot hidden field for spam protection
    - Frontend validation: required fields, email format, min length on message
    - POST /api/contact endpoint (.NET Core 8 controller action + FluentValidation + EF Core insert)
    - MailKit: confirmation email to submitter + notification email to site owner (configured via appsettings)
    - Success toast on submission, error toast on failure
    - Backend FluentValidation rules mirror all frontend validation rules
  API contract: POST /api/contact → { success: boolean, data: null, message: string, errors?: string[] }
  Configuration keys required: Mail:Host, Mail:Port, Mail:Username, Mail:Password, Mail:From, Mail:ToOwner

--- DESIGN & VISUAL DIRECTION (APPLIES TO ALL FEATURES) ---

Design style: Dark luxury theme. Dark backgrounds (#0a0a0f range), vibrant accent color (electric teal #00e5a0), subtle grid overlays, glowing blurred radial lights, smooth scroll reveal animations on all cards and sections. Typography: Playfair Display (serif) for headings, DM Sans for body text. Cards with subtle borders and accent glow on hover. Fully responsive, mobile-first.

Scroll reveal: Every section and card uses IntersectionObserver with staggered fade-up. This behaviour lives in a shared ScrollRevealDirective in the shared/ folder and is reused across all page features.

Color theme: All colors defined as CSS custom properties in a global :root block. No hardcoded hex values in component stylesheets.

--- SERVICES CONTENT (FOR EF CORE SEED DATA) ---

Service 1: AI Voice Agent — Inbound Support
Icon: phone
Short: 24/7 intelligent inbound call handling with sentiment detection and automatic human escalation.
Long: Full inbound call automation including sentiment detection to flag frustrated callers early, automatic escalation with context handoff to human agents, CRM logging, voicemail transcription, multi-language support, and daily performance summaries categorised by issue type, resolution rate, and escalation rate. GDPR/TCPA compliant with built-in consent layer.

Service 2: AI Voice Agent — Outbound Collection
Icon: signal
Short: Automated outbound calls for information collection with full compliance built in.
Long: Outbound call automation for data collection and follow-ups. Includes mandatory AI disclosure, opt-out mechanism with permanent preference storage, timezone-aware call scheduling, configurable retry logic with attempt limits, and adaptive conversational branching to handle unexpected responses gracefully. Warm leads only recommended approach.

Service 3: Email Management AI Agent
Icon: mail
Short: Intelligent email triage, classification, and response drafting with SLA tracking.
Long: Automated email management including triage and classification by category (support, billing, complaint, sales), draft-and-review mode before any auto-send, full thread awareness to avoid contradictions, attachment processing for invoices and documents, SLA breach alerting, and a prioritised daily brief with recommended actions and deadlines grouped by urgency.

Service 4: Marketing Campaign AI Agent
Icon: megaphone
Short: End-to-end email marketing automation with segmentation, A/B testing, and drip sequences.
Long: Full email marketing automation covering audience segmentation and personalisation, A/B testing of subject lines and body copy with auto-optimisation on open and click rates, multi-touch drip sequences (welcome, nurture, re-engagement), deliverability monitoring, branded sender address management, frictionless in-email feedback collection, and full CAN-SPAM/GDPR compliance with automated unsubscribe handling.

Service 5: Social Media Scheduling & Management
Icon: share
Short: AI-powered content drafting, scheduling, and tiered comment management across all platforms.
Long: Cross-platform content creation and scheduling automation with tiered comment handling — auto-reply to simple positive comments, draft responses for questions and complaints submitted for human approval. Includes real-time negative sentiment monitoring and crisis alerting, content performance analytics feeding back into content generation, and platform policy compliance checks before posting.

Service 6: Paid Ads AI Agent
Icon: target
Short: AI-driven ad creative generation, budget optimisation, and cross-platform attribution.
Long: Full paid advertising automation covering ad copy and headline generation, audience targeting and lookalike audience building from existing customer data, automated budget reallocation toward better-performing ad sets, cross-platform attribution across Facebook, Google, and TikTok, and pre-submission compliance review against each platform's advertising policies.

Service 7: GEO — Generative Engine Optimisation
Icon: brain
Short: Optimise your brand's visibility in AI-powered search engines like ChatGPT and Perplexity.
Long: Forward-looking brand optimisation for AI search surfaces including structured data and entity consistency audits, citation-worthy original content strategy, AI search mention monitoring across ChatGPT, Gemini, and Perplexity, and integration with traditional SEO fundamentals. GEO is additive to SEO — both are maintained in parallel.

Service 8: SDLC AI Agent Suite
Icon: code
Short: A full team of specialised AI development agents to accelerate your software delivery pipeline.
Long: A coordinated suite of development sub-agents: Requirements Analyst (parses PRDs, generates acceptance criteria), Code Generator (implements features from specs), Code Reviewer (automated PR reviews and security scanning), Test Generator (unit, integration, and regression tests), Documentation Agent (maintains technical docs and changelogs), and DevOps Agent (monitors deployments, auto-rollback on failure). Humans remain in the loop for all production deployments.

--- FAQ CONTENT (FOR EF CORE SEED DATA) ---

Q1: How long does it take to deploy an AI agent?
A: Most single-agent deployments take 2–4 weeks from kickoff to go-live. More complex multi-agent systems typically take 6–8 weeks. We always start with a human-in-the-loop phase before granting full autonomy.

Q2: Will the AI sound robotic to my customers?
A: No. We use the latest NLP and voice synthesis to create conversational, brand-aligned agents. We customise the tone, vocabulary, and personality to match your brand.

Q3: What happens if the AI can't handle a question?
A: Every agent has intelligent escalation built in. If the AI detects confusion, repeated questions, or negative sentiment, it seamlessly transfers to a human agent with full context so the customer never has to repeat themselves.

Q4: Is my data secure?
A: Yes. We follow industry-standard practices including encryption at rest and in transit, SOC 2 compliance readiness, and strict access controls. Enterprise clients can opt for on-premises deployment.

Q5: Can I start with one agent and add more later?
A: Absolutely — that's what we recommend. Start with the highest-impact use case, prove the ROI, then expand. Every agent plugs into the same shared CRM, analytics, and compliance infrastructure.

Q6: Do you integrate with my existing CRM and tools?
A: Yes — Salesforce, HubSpot, Zoho, Twilio, SendGrid, Slack, Google Workspace, Microsoft 365, and more. For custom systems, we build tailored API integrations.

--- TECHNICAL REQUIREMENTS ---

Frontend: Angular 19+, Angular Material 3+, standalone components, signals for state management, lazy-loaded routes — one route per page feature.

Backend: .NET Core 8 Web API written in C#. Project structure follows clean architecture conventions with Controllers, Services, Repositories, Models, DTOs, and Validators as distinct layers. Key NuGet packages:
  - Pomelo.EntityFrameworkCore.MySql (MySQL 8 provider for EF Core — community standard)
  - Microsoft.EntityFrameworkCore (core EF package)
  - Microsoft.EntityFrameworkCore.Design (required for dotnet ef CLI tooling)
  - Microsoft.EntityFrameworkCore.Tools (migration scaffolding)
  - FluentValidation.AspNetCore (request validation)
  - MailKit (email sending — confirmation and owner notification)
  - Microsoft.Extensions.Configuration (appsettings.json for all config)
  All configuration via appsettings.json and appsettings.Production.json — no hardcoded values anywhere.

Database: MySQL 8 hosted on Railway (managed MySQL service with free dev tier and easy production scaling). ORM: Entity Framework Core with Pomelo MySQL provider for all schema management, migrations, seeding, and runtime queries. ApplicationDbContext is the single source of truth for the entire database schema. No separate migration tooling or external scripts required — everything is managed through the dotnet ef CLI and runs entirely within the .NET ecosystem.

EF Core entity classes:

  public class Contact
  {
      public int Id { get; set; }
      public string Name { get; set; } = string.Empty;
      public string Email { get; set; } = string.Empty;
      public string? Company { get; set; }
      public string? Phone { get; set; }
      public string Message { get; set; } = string.Empty;
      public string ServiceInterest { get; set; } = string.Empty;
      public string Status { get; set; } = "new";
      public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  }

  public class Faq
  {
      public int Id { get; set; }
      public string Question { get; set; } = string.Empty;
      public string Answer { get; set; } = string.Empty;
      public int DisplayOrder { get; set; } = 0;
      public bool IsActive { get; set; } = true;
  }

  public class Service
  {
      public int Id { get; set; }
      public string Title { get; set; } = string.Empty;
      public string Icon { get; set; } = string.Empty;
      public string ShortDescription { get; set; } = string.Empty;
      public string LongDescription { get; set; } = string.Empty;
      public int DisplayOrder { get; set; } = 0;
      public bool IsActive { get; set; } = true;
  }

  public class NewsletterSubscriber
  {
      public int Id { get; set; }
      public string Email { get; set; } = string.Empty;
      public DateTime SubscribedAt { get; set; } = DateTime.UtcNow;
      public bool IsActive { get; set; } = true;
  }

ApplicationDbContext configuration:
  - Use builder.UseAutoIncrementColumns() for MySQL auto-increment IDs
  - Configure HasData() seed blocks in OnModelCreating for all 8 services and 6 FAQs
  - Use ServerVersion.AutoDetect(connectionString) when registering the DbContext in Program.cs
  - Add a unique index on NewsletterSubscriber.Email to enforce deduplication at the DB level

Migration commands:
  - dotnet ef migrations add InitialCreate (generate first migration)
  - dotnet ef database update (apply migrations — works for both dev and production)
  - dotnet ef migrations add [MigrationName] (for all future schema changes)

Deployment: Angular frontend → Vercel. .NET Core 8 API → Railway (include a Dockerfile for containerised deployment and a railway.toml config — Railway also natively hosts the MySQL 8 database in the same project, simplifying connection config). CORS policy in .NET restricted to the Vercel frontend domain in production.

--- FOLDER STRUCTURE ---

Frontend (/frontend):
  /src/app/
    core/              (ApiService, ToastService, interceptors, environment models)
    shared/            (ScrollRevealDirective, LoadingSpinnerComponent, ToastComponent, pipes)
    layout/            (NavbarComponent, FooterComponent)
    features/
      home/            (HeroComponent, StatsBarComponent, ProcessComponent, IndustriesComponent, CtaBannerComponent)
      services/        (ServicesPageComponent, ServiceCardComponent, ServicesService)
      pricing/         (PricingPageComponent, PriceCardComponent)
      faq/             (FaqPageComponent, FaqAccordionComponent, FaqService)
      contact/         (ContactPageComponent, ContactFormComponent, ContactService)
  proxy.conf.json
  environment.ts / environment.prod.ts

Backend (/backend):
  VelocityAI.Api/                     (.NET Core 8 Web API project)
    Controllers/
      ServicesController.cs
      FaqsController.cs
      ContactController.cs
      NewsletterController.cs
    Models/
      Service.cs
      Faq.cs
      Contact.cs
      NewsletterSubscriber.cs
    DTOs/
      ContactRequestDto.cs
      NewsletterRequestDto.cs
      ApiResponse.cs               (generic ApiResponse<T> wrapper class)
    Validators/
      ContactRequestValidator.cs   (FluentValidation)
      NewsletterRequestValidator.cs
    Services/
      IEmailService.cs
      MailKitEmailService.cs
      IContactService.cs
      ContactService.cs
      IFaqService.cs
      FaqService.cs
      IServicesService.cs
      ServicesService.cs
    Repositories/
      IContactRepository.cs
      ContactRepository.cs
      IFaqRepository.cs
      FaqRepository.cs
      IServicesRepository.cs
      ServicesRepository.cs
      INewsletterRepository.cs
      NewsletterRepository.cs
    Data/
      ApplicationDbContext.cs      (EF Core DbContext — registers all DbSets, fluent config, and HasData seed)
    Middleware/
      ExceptionHandlerMiddleware.cs
    Migrations/                    (auto-generated by dotnet ef — do not hand-edit)
    appsettings.json
    appsettings.Development.json
    appsettings.Production.json
    Program.cs                     (app bootstrap, DI registration, EF Core setup, middleware pipeline)
    VelocityAI.Api.csproj

--- CONTACT FORM ---

Fields: Full Name, Email, Company Name (optional), Phone (optional), Message, dropdown for "I'm interested in" (list all 8 services + "Not sure yet").
Validation: Required fields on name, email, message. Email format validation. Submit triggers POST /api/contact. Show success toast on submission, error toast on failure.
No Captcha initially — honeypot hidden field for spam protection.
FluentValidation rules in ContactRequestValidator.cs mirror all Angular reactive form validation rules exactly.
On successful submission, MailKit sends a confirmation email to the submitter and a notification email to the site owner. Both recipient addresses configured in appsettings.json under the Mail section.

--- ANIMATIONS & INTERACTIONS ---

Scroll reveal animations on all section cards (IntersectionObserver, staggered fade-up).
FAQ accordion smooth expand/collapse.
Navbar background becomes more opaque on scroll.
Button hover states with subtle lift (translateY) and glow box-shadow.
Stats counter animation (count up from 0 when scrolled into view).
Mobile menu slide-in/out animation.

--- CONTENT TONE ---

Professional, confident, and forward-thinking. Not overly technical. The audience is business owners and operations managers, not developers. Use outcome-focused language: "reduce costs", "scale without hiring", "respond instantly", "never miss a lead".

--- GLOBAL TASK PRIORITY ORDER ---

The Lead Agent must follow this order strictly. Do not begin a feature until the previous feature's tasks.md has been completed and tests have passed.

Phase 0 — Infrastructure (FEATURE 0):
  0.1   .NET Core 8 Web API project scaffolded: folder structure, Program.cs, VelocityAI.Api.csproj with all NuGet packages
  0.2   Railway MySQL 8 database provisioned, connection string added to appsettings.Development.json under ConnectionStrings:DefaultConnection
  0.3   Pomelo EF Core MySQL provider registered in Program.cs using AddDbContext with ServerVersion.AutoDetect
  0.4   All 4 entity classes created in /Models (Contact, Faq, Service, NewsletterSubscriber)
  0.5   ApplicationDbContext.cs created with all 4 DbSet properties, fluent entity configuration, and HasData() seed blocks for all 8 services and 6 FAQs in OnModelCreating
  0.6   Unique index on NewsletterSubscriber.Email configured in OnModelCreating
  0.7   Initial EF Core migration generated: dotnet ef migrations add InitialCreate
  0.8   Migration applied to development database: dotnet ef database update — verify all tables and seed data present
  0.9   Generic ApiResponse<T> class created in /DTOs, used consistently across all controllers
  0.10  Global ExceptionHandlerMiddleware created and registered in Program.cs
  0.11  CORS policy configured in Program.cs, restricted to Angular dev origin (http://localhost:4200) in development
  0.12  FluentValidation registered globally in Program.cs via AddFluentValidationAutoValidation
  0.13  All repository interfaces and classes scaffolded with EF Core constructor injection of ApplicationDbContext
  0.14  All service interfaces and classes scaffolded with constructor injection of their respective repositories
  0.15  Angular project scaffolded: Angular Material theme, routing, proxy.conf.json pointing to https://localhost:5001
  0.16  CSS custom properties defined in global Angular styles (full color theme as variables)
  0.17  Shared Angular services created: ApiService (HttpClient wrapper with typed response handling), ToastService
  0.18  Shared Angular components created: LoadingSpinnerComponent, ToastComponent
  0.19  ScrollRevealDirective created in shared/ and ready for use in all features
  0.20  appsettings.json written with all required configuration sections: ConnectionStrings, Mail, Cors
  0.21  README written covering local dev setup, EF Core migration workflow, dotnet run, and deployment steps

Phase 1 — Layout (FEATURE 1):
  1.1  NavbarComponent built with frosted glass style, scroll opacity transition, mobile hamburger menu
  1.2  FooterComponent built with 4-column layout and social icons row
  1.3  Layout shell wired into Angular app root with router-outlet

Phase 2 — Home Page (FEATURE 2):
  2.1  HeroComponent — animated badge, serif headline, subtext, CTA buttons, background glow orbs, grid overlay
  2.2  StatsBarComponent — 4 metrics with IntersectionObserver counter animation (count from 0)
  2.3  ProcessComponent — 4-step numbered process with desktop connector line
  2.4  IndustriesComponent — 8 industry tiles with emoji icons and descriptions
  2.5  CtaBannerComponent — full-width dark CTA card with contact link
  2.6  HomePageComponent assembled from all sub-components, registered on / root route

Phase 3 — Services Page (FEATURE 3):
  3.1  ServicesRepository.cs — EF Core LINQ query: context.Services.Where(s => s.IsActive).OrderBy(s => s.DisplayOrder).ToListAsync()
  3.2  ServicesService.cs — calls repository, returns IEnumerable<Service>
  3.3  ServicesController.cs — GET /api/services action, returns ApiResponse<IEnumerable<Service>> with 200 OK
  3.4  Angular ServicesService — HTTP GET with typed response, error handling, and in-memory caching via signal
  3.5  ServiceCardComponent — icon, title, short description, CSS hover reveal of long description
  3.6  ServicesPageComponent — data-driven grid assembled from ServiceCardComponents, loading and error states
  3.7  /services route registered and lazy-loaded

Phase 4 — Pricing Page (FEATURE 4):
  4.1  PriceCardComponent — feature checklist, featured card visual treatment, CTA button routing to /contact
  4.2  PricingPageComponent — 3 PriceCards assembled with static data, /pricing route registered and lazy-loaded

Phase 5 — FAQ Page (FEATURE 5):
  5.1  FaqRepository.cs — EF Core LINQ query: context.Faqs.Where(f => f.IsActive).OrderBy(f => f.DisplayOrder).ToListAsync()
  5.2  FaqService.cs — calls repository, returns IEnumerable<Faq>
  5.3  FaqsController.cs — GET /api/faqs action, returns ApiResponse<IEnumerable<Faq>> with 200 OK
  5.4  Angular FaqService — HTTP GET with typed response and error handling
  5.5  FaqAccordionComponent — smooth CSS expand/collapse animation per FAQ item
  5.6  FaqPageComponent — data-driven accordion list, loading and error states
  5.7  /faq route registered and lazy-loaded

Phase 6 — Contact Page (FEATURE 6):
  6.1  ContactRequestDto.cs and ContactRequestValidator.cs (FluentValidation — mirrors all Angular form rules)
  6.2  ContactRepository.cs — EF Core insert: context.Contacts.Add(contact); await context.SaveChangesAsync()
  6.3  ContactService.cs — calls repository, then triggers email notifications via IEmailService
  6.4  MailKitEmailService.cs — sends confirmation email to submitter and notification to site owner using MailKit SmtpClient
  6.5  ContactController.cs — POST /api/contact with FluentValidation pipeline, returns ApiResponse<object>
  6.6  NewsletterRepository.cs — EF Core upsert: check for existing email by unique index, insert or reactivate subscriber
  6.7  NewsletterController.cs — POST /api/newsletter with FluentValidation and upsert via repository
  6.8  Angular ContactService — typed POST with ContactRequestDto interface matching backend DTO
  6.9  ContactFormComponent — Angular reactive form, all fields, honeypot hidden field, inline validation messages
  6.10 ContactPageComponent assembled, /contact route registered and lazy-loaded

Phase 7 — Polish & QA (ALL FEATURES):
  7.1  ScrollRevealDirective applied to all section cards across all page features
  7.2  Mobile responsiveness audit across all pages (320px, 768px, 1024px, 1440px breakpoints)
  7.3  Accessibility audit: aria-labels, keyboard navigation, semantic HTML, focus management
  7.4  SEO: Angular Meta service used to set meta tags and Open Graph tags on all routes

Phase 8 — Testing (ALL FEATURES):
  8.1  Angular unit tests for all components (Karma + Jasmine)
  8.2  Angular service tests using HttpClientTestingModule to mock HTTP responses
  8.3  .NET controller unit tests using xUnit + Moq (mock IServicesService, IFaqService, IContactService)
  8.4  .NET integration tests using WebApplicationFactory<Program> + EF Core in-memory provider to test full HTTP pipeline
  8.5  FluentValidation unit tests for ContactRequestValidator and NewsletterRequestValidator
  8.6  Repository unit tests using EF Core in-memory database provider (Microsoft.EntityFrameworkCore.InMemory)
  8.7  MailKit email service unit tests using mock ISmtpClient

Phase 9 — Deploy:
  9.1  Conventional commits per feature branch, PR-ready state
  9.2  Dockerfile written for .NET Core 8 API (multi-stage: mcr.microsoft.com/dotnet/sdk:8.0 build → mcr.microsoft.com/dotnet/aspnet:8.0 runtime)
  9.3  railway.toml configured for containerised .NET API deployment on Railway
  9.4  EF Core migration applied to production MySQL database: dotnet ef database update — run as a Railway deploy command or startup task
  9.5  Vercel deployment configured for Angular frontend (ng build --configuration production as build command, dist/velocity-ai as output directory)
  9.6  All environment variables set in Railway (connection string, mail config, CORS origin) and Vercel (API URL)
  9.7  Production smoke test: all API endpoints return 200, contact form submits successfully, confirmation email received, seed data renders on Services and FAQ pages

--- ADDITIONAL NOTES ---

- Entity Framework Core with Pomelo.EntityFrameworkCore.MySql is the single data access layer — no Dapper, no raw SQL, no external migration tools. All schema changes must go through dotnet ef migrations add followed by dotnet ef database update.
- ApplicationDbContext is the single source of truth for schema, relationships, indexes, and seed data. Never modify the Migrations/ folder by hand.
- Seed data for services and FAQs must use static IDs in HasData() to keep migrations idempotent. Do not use auto-generated IDs in seed blocks.
- Register ApplicationDbContext in Program.cs with AddDbContext using Scoped lifetime (the EF Core default). Register all repositories and services as Scoped to match DbContext lifetime.
- All .NET configuration (connection strings, mail settings, CORS origins) must be in appsettings.json sections — never hardcoded. Use environment variable overrides (ConnectionStrings__DefaultConnection, Mail__Host, etc.) for production values injected at deploy time.
- The production connection string for Railway MySQL must use the internal Railway private network URL (not the public URL) when the .NET API and MySQL database are in the same Railway project, to avoid latency and egress costs.
- Use CSS custom properties for all Angular component colors — no hardcoded hex values in component stylesheets.
- No third-party UI libraries beyond Angular Material — keep frontend dependencies lean.
- Angular routes must be lazy-loaded for all page features to keep the initial bundle size small.
- proxy.conf.json must forward all /api/* requests to https://localhost:5001 during local development.
- The Dockerfile must use a multi-stage build to keep the final runtime image small: build in the SDK image, copy only the published output into the aspnet runtime image.
- appsettings.json must include a Mail section with keys: Host, Port, Username, Password, From, ToOwner.
- Run dotnet build and dotnet test in CI before any deployment to catch compilation and test failures early.
- Each feature branch must be merged only after its own test plan passes — no exceptions.