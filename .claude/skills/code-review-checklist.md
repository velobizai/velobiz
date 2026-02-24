# Skill: Cross-Stack Code Review Checklist

## Purpose
Systematic checklist for reviewing full-stack features across Angular, .NET Core, and MySQL layers.

## Backend (.NET Core) Checklist

### Security
- [ ] No hardcoded secrets, keys, or connection strings
- [ ] All endpoints have appropriate `[Authorize]` attributes
- [ ] Input validation via FluentValidation on all commands/queries
- [ ] No raw SQL queries (unless absolutely necessary and parameterized)
- [ ] Sensitive data not logged (PII, passwords, tokens)
- [ ] JWT validation configured correctly (issuer, audience, expiry)
- [ ] CORS configured restrictively (not `AllowAnyOrigin` in production)

### API Design
- [ ] Correct HTTP methods (GET=read, POST=create, PUT=update, DELETE=delete)
- [ ] Correct status codes (200, 201, 204, 400, 401, 403, 404, 500)
- [ ] Consistent response format (DTOs, not entities)
- [ ] ProblemDetails format for errors (RFC 7807)
- [ ] Pagination for list endpoints
- [ ] Swagger XML documentation on all public endpoints
- [ ] CancellationToken accepted on all async methods

### Code Quality
- [ ] SOLID principles followed
- [ ] No async void (always async Task)
- [ ] Proper exception handling (not catching generic Exception)
- [ ] Structured logging with ILogger<T>
- [ ] Dependency injection (no `new` for services)
- [ ] AutoMapper profiles for all DTO mappings
- [ ] No business logic in controllers

## Frontend (Angular) Checklist

### Component Design
- [ ] Standalone components (no NgModules)
- [ ] OnPush change detection on all components
- [ ] Smart/Dumb component separation
- [ ] No `any` types (TypeScript strict mode)
- [ ] All subscriptions cleaned up (takeUntilDestroyed, async pipe, or signals)
- [ ] inject() function used instead of constructor injection

### UX Quality
- [ ] Loading states shown during data fetch
- [ ] Error states with user-friendly messages and retry option
- [ ] Empty states with helpful guidance
- [ ] Form validation with inline error messages
- [ ] Responsive design (mobile + tablet + desktop)
- [ ] Keyboard navigable (Tab, Enter, Escape)
- [ ] ARIA attributes on interactive elements

### Performance
- [ ] Lazy loaded feature routes
- [ ] trackBy on @for loops
- [ ] No unnecessary re-renders (check OnPush compliance)
- [ ] Images optimized and lazy loaded
- [ ] Bundle size checked (no unnecessary imports)

## Database (MySQL) Checklist
- [ ] All tables have id, created_at, updated_at, is_deleted columns
- [ ] Foreign key constraints defined
- [ ] Indexes on FK columns and frequently queried columns
- [ ] Unique constraints on natural keys
- [ ] DECIMAL type for monetary values (not FLOAT)
- [ ] DATETIME(6) for timestamps
- [ ] Soft delete via is_deleted flag with global query filter
- [ ] Migration file generates correct SQL

## Testing Checklist
- [ ] Unit tests exist for all new production code
- [ ] Each test file has positive + negative + edge case
- [ ] Coverage ≥ 80%
- [ ] Tests are independent (no order dependency)
- [ ] External dependencies mocked
- [ ] Integration tests for API endpoints
- [ ] Test names describe the scenario clearly
