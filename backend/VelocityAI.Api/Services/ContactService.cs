using Velobiz.Api.DTOs;
using Velobiz.Api.Models;
using Velobiz.Api.Repositories;

namespace Velobiz.Api.Services;

public class ContactService : IContactService
{
    private readonly IContactRepository _repository;
    private readonly IEmailService _emailService;
    private readonly ILogger<ContactService> _logger;

    public ContactService(
        IContactRepository repository,
        IEmailService emailService,
        ILogger<ContactService> logger)
    {
        _repository = repository;
        _emailService = emailService;
        _logger = logger;
    }

    public async Task<Contact> SubmitContactFormAsync(ContactRequestDto dto)
    {
        var contact = new Contact
        {
            Name = dto.Name,
            Email = dto.Email,
            Company = dto.Company,
            Phone = dto.Phone,
            Message = dto.Message,
            ServiceInterest = dto.ServiceInterest,
            Status = "new",
            CreatedAt = DateTime.UtcNow
        };

        var savedContact = await _repository.AddAsync(contact);

        _logger.LogInformation(
            "Contact form submitted: Id={ContactId}, Email={Email}, ServiceInterest={ServiceInterest}",
            savedContact.Id, savedContact.Email, savedContact.ServiceInterest
        );

        // Send emails asynchronously (don't await to avoid blocking)
        _ = Task.Run(async () => await _emailService.SendConfirmationEmailAsync(savedContact));
        _ = Task.Run(async () => await _emailService.SendNotificationEmailAsync(savedContact));

        return savedContact;
    }
}
