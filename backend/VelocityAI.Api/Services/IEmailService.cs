using Velobiz.Api.Models;

namespace Velobiz.Api.Services;

/// <summary>
/// Email service for sending contact form emails
/// </summary>
public interface IEmailService
{
    /// <summary>
    /// Send confirmation email to contact submitter
    /// </summary>
    Task SendConfirmationEmailAsync(Contact contact);

    /// <summary>
    /// Send notification email to site owner
    /// </summary>
    Task SendNotificationEmailAsync(Contact contact);
}
