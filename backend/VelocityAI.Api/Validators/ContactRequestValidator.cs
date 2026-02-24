using FluentValidation;
using VelocityAI.Api.DTOs;

namespace VelocityAI.Api.Validators;

public class ContactRequestValidator : AbstractValidator<ContactRequestDto>
{
    private static readonly string[] ValidServiceInterests = new[]
    {
        "AI Voice Agent — Inbound Support",
        "AI Voice Agent — Outbound Collection",
        "Email Management AI Agent",
        "Marketing Campaign AI Agent",
        "Social Media Scheduling & Management",
        "Paid Ads AI Agent",
        "GEO — Generative Engine Optimisation",
        "SDLC AI Agent Suite",
        "Not sure yet"
    };

    public ContactRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required")
            .MinimumLength(2).WithMessage("Name must be at least 2 characters long")
            .MaximumLength(100).WithMessage("Name cannot exceed 100 characters");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Email is not a valid email address")
            .MaximumLength(255).WithMessage("Email cannot exceed 255 characters");

        RuleFor(x => x.Company)
            .MaximumLength(200).WithMessage("Company name cannot exceed 200 characters")
            .When(x => !string.IsNullOrEmpty(x.Company));

        RuleFor(x => x.Phone)
            .MaximumLength(50).WithMessage("Phone number cannot exceed 50 characters")
            .When(x => !string.IsNullOrEmpty(x.Phone));

        RuleFor(x => x.Message)
            .NotEmpty().WithMessage("Message is required")
            .MinimumLength(10).WithMessage("Message must be at least 10 characters long")
            .MaximumLength(2000).WithMessage("Message cannot exceed 2000 characters");

        RuleFor(x => x.ServiceInterest)
            .NotEmpty().WithMessage("Service Interest is required")
            .Must(si => ValidServiceInterests.Contains(si))
            .WithMessage($"Service Interest must be one of: {string.Join(", ", ValidServiceInterests)}");

        RuleFor(x => x.Honeypot)
            .Must(h => string.IsNullOrEmpty(h))
            .WithMessage("Invalid submission detected");
    }
}
