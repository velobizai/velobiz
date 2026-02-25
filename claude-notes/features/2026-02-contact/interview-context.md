# Feature 6: Contact Page - Interview Context

**Generated from CLAUDE.md specifications**
**Date**: 2026-02-20
**Status**: AUTO-APPROVED

## Round 1: Context

### 1. What is the business problem this feature solves? Who are the target users?
**Answer**: The Contact page enables potential clients to reach out to Velobiz for consultations, inquiries, and service requests. Target users are business owners, operations managers, and decision-makers interested in AI automation services.

### 2. What are the success criteria? How will you measure if this feature is working?
**Answer**:
- Form submissions successfully save to database
- Confirmation emails sent to submitters
- Notification emails sent to site owner
- All validation rules enforced (frontend and backend)
- Zero spam submissions (via honeypot field)
- Form submission success rate > 95%

### 3. Are there any existing systems, APIs, or databases this integrates with?
**Answer**:
- MySQL database (Contact entity already exists in ApplicationDbContext)
- MailKit email service for sending emails
- Email configuration via appsettings.json (SMTP settings)
- FluentValidation for backend validation

## Round 2: Requirements

### 4. What are the core capabilities this feature needs?
**Answer**:
- Accept contact form submissions with validation
- Store contact submissions in MySQL database
- Send confirmation email to submitter
- Send notification email to site owner (configured email address)
- Prevent spam via honeypot hidden field
- Return structured API response (success/error)
- Display success/error messages in frontend

### 5. What data does this feature create, read, update, or delete?
**Answer**:
**Contact Entity** (already exists in Models/Contact.cs):
- Id: int (primary key, auto-increment)
- Name: string (required)
- Email: string (required, email format)
- Company: string (optional)
- Phone: string (optional)
- Message: string (required, min 10 characters)
- ServiceInterest: string (required, dropdown selection)
- Status: string (default: "new")
- CreatedAt: DateTime (auto-set to UTC)

**Operations**:
- CREATE: New contact submissions
- READ: Not exposed via API (admin feature for future)

### 6. What API endpoints do you envision?
**Answer**:
**POST /api/contact**
- Request Body: ContactRequestDto
- Response: ApiResponse<object> with success boolean and message
- Status Codes: 201 (Created), 400 (Validation Error), 500 (Server Error)

## Round 3: UI/UX

### 7. Does this feature have a user interface? If yes, describe the screens/pages.
**Answer**:
Yes, the Contact page is accessible at `/contact` route. The page includes:
- Page header with title and description
- Contact information cards (email, phone, office location)
- Full contact form with all fields
- Success/error message display
- Loading state during submission

**Current Status**: Frontend UI already implemented in `src/app/features/contact/contact-page.component.ts` but using simulated API call.

### 8. What UI components are needed?
**Answer**:
- Reactive form with validation (Angular FormGroup)
- Text inputs: Name, Email, Company (optional), Phone (optional)
- Textarea: Message (min 10 characters)
- Dropdown: Service Interest (8 services + "Not sure yet")
- Hidden honeypot field for spam protection
- Submit button with loading state
- Success toast/message display
- Error message display
- Form field error messages (inline validation)

### 9. Are there any specific design requirements?
**Answer**:
- Dark luxury theme (consistent with site-wide design)
- Form fields with subtle borders and accent glow on focus
- ScrollReveal animation on form card
- Responsive design (mobile-first)
- WCAG 2.1 AA accessibility compliance
- Loading spinner during submission

## Round 4: Constraints

### 10. What are the non-functional requirements?
**Answer**:
- **Performance**: Form submission response < 3 seconds
- **Security**: Input validation on frontend and backend, SQL injection prevention via EF Core parameterized queries
- **Email Delivery**: Confirmation email sent within 5 seconds of submission
- **Spam Prevention**: Honeypot field (no CAPTCHA initially)
- **Error Handling**: Graceful error messages, no stack traces exposed to users
- **Logging**: All submissions logged with structured logging (Serilog)

### 11. Are there any technical constraints or preferences?
**Answer**:
- **Backend**: .NET Core 8, EF Core, FluentValidation, MailKit
- **Email Config**: All email settings in appsettings.json (Mail:Host, Mail:Port, Mail:Username, Mail:Password, Mail:From, Mail:ToOwner)
- **Frontend**: Angular 19, Reactive Forms, Angular signals for state
- **Validation**: FluentValidation rules must mirror Angular form validation exactly
- **API Response**: Must use generic ApiResponse<T> wrapper class
- **Database**: EF Core repository pattern, async/await for all I/O

## Round 5: Confirmation

### 12. Is there anything else important that we haven't covered?
**Answer**:
- Service Interest dropdown must list all 8 services from the Services table + "Not sure yet" option
- Form should NOT use CAPTCHA (use honeypot instead)
- Email templates should be professional and brand-aligned
- Both confirmation and notification emails should include all form data
- Backend validation must use ContactRequestValidator (FluentValidation)
- Frontend must handle network errors gracefully

### 13. Summary Confirmation
**Answer**: AUTO-APPROVED - All requirements captured from CLAUDE.md specification for Feature 6.

## Additional Context

### Existing Backend Files (Need Implementation):
- ✅ Models/Contact.cs (exists)
- ✅ Repositories/IContactRepository.cs (exists)
- ✅ Repositories/ContactRepository.cs (exists)
- ✅ Services/IContactService.cs (exists)
- ✅ Services/ContactService.cs (exists)
- ⚠️ Controllers/ContactController.cs (exists, returns 501 Not Implemented)
- ❌ DTOs/ContactRequestDto.cs (needs creation)
- ❌ Validators/ContactRequestValidator.cs (needs creation)
- ❌ Services/IEmailService.cs (needs creation)
- ❌ Services/MailKitEmailService.cs (needs creation)

### Existing Frontend Files (Need API Integration):
- ✅ features/contact/contact-page.component.ts (exists, using simulated API)
- ✅ features/contact/contact-page.component.html (exists)
- ✅ features/contact/contact-page.component.scss (exists)
- ❌ core/services/contact.service.ts (needs creation for HTTP calls)
- ❌ core/models/contact-request.model.ts (needs creation)

### Email Template Requirements:
1. **Confirmation Email** (to submitter):
   - Subject: "Thank you for contacting Velobiz"
   - Body: Professional message confirming receipt, expected response time
   - Include summary of submitted information

2. **Notification Email** (to site owner):
   - Subject: "New Contact Form Submission - [Service Interest]"
   - Body: All form field data formatted clearly
   - Include contact details for quick follow-up

### Service Interest Dropdown Options:
1. AI Voice Agent — Inbound Support
2. AI Voice Agent — Outbound Collection
3. Email Management AI Agent
4. Marketing Campaign AI Agent
5. Social Media Scheduling & Management
6. Paid Ads AI Agent
7. GEO — Generative Engine Optimisation
8. SDLC AI Agent Suite
9. Not sure yet

## Dependencies
- MySQL database configured and accessible
- SMTP email server credentials configured in appsettings.json
- EF Core migrations applied (Contact table already exists from InitialCreate migration)

## Success Metrics
- Form validation works on both frontend and backend
- Submissions save to database successfully
- Both confirmation and notification emails sent
- Honeypot spam protection working
- Error handling graceful and user-friendly
- 95%+ submission success rate
