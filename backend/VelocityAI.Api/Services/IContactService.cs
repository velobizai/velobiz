using VelocityAI.Api.DTOs;
using VelocityAI.Api.Models;

namespace VelocityAI.Api.Services;

public interface IContactService
{
    Task<Contact> SubmitContactFormAsync(ContactRequestDto dto);
}
