# Feature 6: Contact Page Backend - Requirements

**Feature ID**: F6-CONTACT-BACKEND
**Status**: Ready for Implementation
**Priority**: High
**Estimated Effort**: 8-12 hours

## Business Problem
Enable potential clients to submit contact inquiries through the website, with automated email confirmations and notifications to support business development workflows.

## Target Users
- **Primary**: Business owners, operations managers, decision-makers interested in AI automation services
- **Secondary**: Site administrators receiving notifications

## User Stories

### US1: Contact Form Submission
**As a** potential client
**I want to** submit a contact form with my information
**So that** I can request a consultation or ask questions about services

**Acceptance Criteria:**
- Form accepts required fields: name (min 2 chars), email (valid format), message (min 10 chars), service interest
- Form accepts optional fields: company, phone
- Honeypot field prevents spam submissions
- Validation errors return 400 with clear field-level messages
- Successful submission returns 201 Created with confirmation message
- Form data saved to MySQL Contact table with UTC timestamp

### US2: Email Confirmation to Submitter
**As a** contact form submitter
**I want to** receive an email confirmation
**So that** I know my inquiry was received

**Acceptance Criteria:**
- Confirmation email sent within 5 seconds of successful submission
- Email contains personalized greeting with submitter name
- Email includes summary of submitted information
- Email states expected response time (24 hours during business days)
- Email failure does not block form submission (logged as warning)

### US3: Notification Email to Site Owner
**As a** site administrator
**I want to** receive email notifications of new contact submissions
**So that** I can respond promptly to potential clients

**Acceptance Criteria:**
- Notification email sent to configured owner email address
- Email subject includes service interest for quick triage
- Email body contains all submitted form data formatted clearly
- Email includes contact details (email, phone if provided) for quick follow-up
- Email failure does not block form submission (logged as error)

### US4: Spam Prevention
**As a** site administrator
**I want to** prevent spam submissions
**So that** I only receive legitimate inquiries

**Acceptance Criteria:**
- Honeypot field included in DTO (not displayed to humans)
- Submissions with honeypot data are rejected with 400 error
- Rejection logged for monitoring purposes

### US5: Frontend Integration
**As a** frontend developer
**I want to** integrate the backend API with the Angular contact form
**So that** form submissions use real API instead of simulation

**Acceptance Criteria:**
- ContactService created with HTTP POST method
- ContactRequest model matches backend DTO
- Form component replaces simulateApiCall with ContactService.submit()
- Loading state managed with signals
- Success message displayed for 5 seconds
- Error messages display backend validation errors

## Success Metrics
- **Form submission success rate**: > 95%
- **Email delivery rate**: > 98%
- **Response time**: < 3 seconds for form submission
- **Spam rejection rate**: > 90% of honeypot-triggered submissions
- **Validation accuracy**: 100% match between frontend and backend rules

## Non-Functional Requirements

### Performance
- API response time: < 3 seconds (including email sending)
- Email sending: < 5 seconds per email
- Database write: < 500ms

### Security
- Input validation on both frontend and backend
- SQL injection prevention via EF Core parameterized queries
- XSS prevention via Angular sanitization
- Email injection prevention via MailKit validation
- No sensitive data exposed in error messages

### Reliability
- Email failures do not block form submission
- Structured logging for all operations (Serilog)
- Transaction handling for database writes
- Graceful error messages for users

### Compliance
- GDPR-ready data handling (user consent assumed via form submission)
- Email unsubscribe not required (transactional emails, not marketing)
- Data retention policy: Contact records retained indefinitely (admin cleanup feature TBD)

## Dependencies
- MySQL database (velocityai_dev) configured and accessible
- SMTP email server credentials configured in appsettings.json
- MailKit NuGet package installed
- FluentValidation package already installed
- EF Core migrations applied (Contact table exists)

## Out of Scope
- Admin dashboard to view contact submissions (Future Feature 8)
- Email templates with HTML formatting (plain text only for MVP)
- File attachments in contact form
- CAPTCHA integration (using honeypot instead)
- Multi-language support
