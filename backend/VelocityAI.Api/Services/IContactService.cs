using Velobiz.Api.DTOs;
using Velobiz.Api.Models;

namespace Velobiz.Api.Services;

public interface IContactService
{
    Task<Contact> SubmitContactFormAsync(ContactRequestDto dto);
}
