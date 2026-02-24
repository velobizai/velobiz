# Skill: .NET Core API Generation

## Purpose
Generate ASP.NET Core 6 API components following clean architecture and project conventions.

## Template: Controller
```csharp
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace {{ServiceName}}.API.Controllers;

/// <summary>
/// Manages {{EntityPlural}} resources
/// </summary>
[ApiController]
[Route("api/v1/[controller]")]
[Produces("application/json")]
[Authorize]
public class {{EntityPlural}}Controller : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<{{EntityPlural}}Controller> _logger;

    public {{EntityPlural}}Controller(IMediator mediator, ILogger<{{EntityPlural}}Controller> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>Get paginated list of {{entityPlural}}</summary>
    [HttpGet]
    [ProducesResponseType(typeof(PaginatedList<{{Entity}}Dto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PaginatedList<{{Entity}}Dto>>> GetAll(
        [FromQuery] Get{{EntityPlural}}Query query, CancellationToken ct)
    {
        _logger.LogInformation("Getting {{entityPlural}} with page {Page}", query.Page);
        return Ok(await _mediator.Send(query, ct));
    }

    /// <summary>Get {{entity}} by ID</summary>
    [HttpGet("{id:long}")]
    [ProducesResponseType(typeof({{Entity}}Dto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<{{Entity}}Dto>> GetById(long id, CancellationToken ct)
    {
        var result = await _mediator.Send(new Get{{Entity}}ByIdQuery(id), ct);
        return result is null ? NotFound() : Ok(result);
    }

    /// <summary>Create a new {{entity}}</summary>
    [HttpPost]
    [ProducesResponseType(typeof({{Entity}}Dto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<{{Entity}}Dto>> Create(
        [FromBody] Create{{Entity}}Command command, CancellationToken ct)
    {
        var result = await _mediator.Send(command, ct);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    /// <summary>Update an existing {{entity}}</summary>
    [HttpPut("{id:long}")]
    [ProducesResponseType(typeof({{Entity}}Dto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<{{Entity}}Dto>> Update(
        long id, [FromBody] Update{{Entity}}Command command, CancellationToken ct)
    {
        command.Id = id;
        var result = await _mediator.Send(command, ct);
        return result is null ? NotFound() : Ok(result);
    }

    /// <summary>Delete a {{entity}}</summary>
    [HttpDelete("{id:long}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> Delete(long id, CancellationToken ct)
    {
        var deleted = await _mediator.Send(new Delete{{Entity}}Command(id), ct);
        return deleted ? NoContent() : NotFound();
    }
}
```

## Template: Command Handler (CQRS)
```csharp
using AutoMapper;
using FluentValidation;
using MediatR;

namespace {{ServiceName}}.Application.Features.{{EntityPlural}}.Commands;

// Command
public record Create{{Entity}}Command : IRequest<{{Entity}}Dto>
{
    public string Name { get; init; } = default!;
    public string? Description { get; init; }
}

// Validator
public class Create{{Entity}}CommandValidator : AbstractValidator<Create{{Entity}}Command>
{
    public Create{{Entity}}CommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required")
            .MaximumLength(255).WithMessage("Name must not exceed 255 characters");
    }
}

// Handler
public class Create{{Entity}}CommandHandler : IRequestHandler<Create{{Entity}}Command, {{Entity}}Dto>
{
    private readonly I{{Entity}}Repository _repository;
    private readonly IMapper _mapper;
    private readonly ILogger<Create{{Entity}}CommandHandler> _logger;

    public Create{{Entity}}CommandHandler(
        I{{Entity}}Repository repository,
        IMapper mapper,
        ILogger<Create{{Entity}}CommandHandler> logger)
    {
        _repository = repository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<{{Entity}}Dto> Handle(
        Create{{Entity}}Command request, CancellationToken cancellationToken)
    {
        var entity = _mapper.Map<{{Entity}}>(request);
        await _repository.AddAsync(entity, cancellationToken);
        _logger.LogInformation("Created {{entity}} with ID {Id}", entity.Id);
        return _mapper.Map<{{Entity}}Dto>(entity);
    }
}
```

## Template: Repository
```csharp
namespace {{ServiceName}}.Infrastructure.Persistence.Repositories;

public class {{Entity}}Repository : I{{Entity}}Repository
{
    private readonly ApplicationDbContext _context;

    public {{Entity}}Repository(ApplicationDbContext context) => _context = context;

    public async Task<{{Entity}}?> GetByIdAsync(long id, CancellationToken ct)
        => await _context.{{EntityPlural}}.FindAsync(new object[] { id }, ct);

    public async Task<PaginatedList<{{Entity}}>> GetPagedAsync(int page, int size, CancellationToken ct)
        => await _context.{{EntityPlural}}
            .AsNoTracking()
            .OrderByDescending(e => e.CreatedAt)
            .ToPaginatedListAsync(page, size, ct);

    public async Task AddAsync({{Entity}} entity, CancellationToken ct)
    {
        await _context.{{EntityPlural}}.AddAsync(entity, ct);
        await _context.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync({{Entity}} entity, CancellationToken ct)
    {
        _context.{{EntityPlural}}.Update(entity);
        await _context.SaveChangesAsync(ct);
    }

    public async Task<bool> SoftDeleteAsync(long id, CancellationToken ct)
    {
        var entity = await _context.{{EntityPlural}}.FindAsync(new object[] { id }, ct);
        if (entity is null) return false;
        entity.IsDeleted = true;
        entity.DeletedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(ct);
        return true;
    }
}
```

## Variables
- `{{ServiceName}}` — Project namespace (e.g., `MyService`)
- `{{Entity}}` — PascalCase singular (e.g., `HealthCheck`)
- `{{entity}}` — camelCase singular (e.g., `healthCheck`)
- `{{EntityPlural}}` — PascalCase plural (e.g., `HealthChecks`)
- `{{entityPlural}}` — camelCase plural (e.g., `healthChecks`)
