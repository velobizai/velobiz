using MailKit.Net.Smtp;
using MimeKit;
using VelocityAI.Api.Models;

namespace VelocityAI.Api.Services;

public class MailKitEmailService : IEmailService
{
    private readonly IConfiguration _config;
    private readonly ILogger<MailKitEmailService> _logger;

    public MailKitEmailService(IConfiguration config, ILogger<MailKitEmailService> logger)
    {
        _config = config;
        _logger = logger;
    }

    public async Task SendConfirmationEmailAsync(Contact contact)
    {
        try
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(
                _config["Mail:FromName"],
                _config["Mail:From"]
            ));
            message.To.Add(MailboxAddress.Parse(contact.Email));
            message.Subject = "Thank you for contacting VelocityAI";

            message.Body = new TextPart("plain")
            {
                Text = $@"Hi {contact.Name},

Thank you for reaching out to VelocityAI! We've received your inquiry about ""{contact.ServiceInterest}"".

Your submission details:
- Name: {contact.Name}
- Email: {contact.Email}
- Company: {contact.Company ?? "Not provided"}
- Phone: {contact.Phone ?? "Not provided"}
- Service Interest: {contact.ServiceInterest}
- Message: {contact.Message}

Our team will review your inquiry and respond within 24 hours during business days.

Best regards,
VelocityAI Team

---
This is an automated confirmation. Please do not reply to this email."
            };

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(
                _config["Mail:Host"],
                int.Parse(_config["Mail:Port"] ?? "587"),
                bool.Parse(_config["Mail:EnableSsl"] ?? "true")
            );
            await smtp.AuthenticateAsync(_config["Mail:Username"], _config["Mail:Password"]);
            await smtp.SendAsync(message);
            await smtp.DisconnectAsync(true);

            _logger.LogInformation(
                "Confirmation email sent to {Email} for ContactId={ContactId}",
                contact.Email, contact.Id
            );
        }
        catch (Exception ex)
        {
            _logger.LogWarning(
                ex,
                "Failed to send confirmation email to {Email}",
                contact.Email
            );
        }
    }

    public async Task SendNotificationEmailAsync(Contact contact)
    {
        try
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(
                _config["Mail:FromName"],
                _config["Mail:From"]
            ));
            message.To.Add(MailboxAddress.Parse(_config["Mail:ToOwner"]));
            message.Subject = $"New Contact Form Submission - {contact.ServiceInterest}";

            message.Body = new TextPart("plain")
            {
                Text = $@"New contact form submission received:

CONTACT DETAILS:
- Name: {contact.Name}
- Email: {contact.Email}
- Company: {contact.Company ?? "Not provided"}
- Phone: {contact.Phone ?? "Not provided"}

SERVICE INTEREST:
{contact.ServiceInterest}

MESSAGE:
{contact.Message}

SUBMITTED AT:
{contact.CreatedAt:yyyy-MM-dd HH:mm:ss UTC}

CONTACT ID: {contact.Id}

---
Quick actions:
- Reply to: {contact.Email}
- Call: {contact.Phone ?? "Not provided"}"
            };

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(
                _config["Mail:Host"],
                int.Parse(_config["Mail:Port"] ?? "587"),
                bool.Parse(_config["Mail:EnableSsl"] ?? "true")
            );
            await smtp.AuthenticateAsync(_config["Mail:Username"], _config["Mail:Password"]);
            await smtp.SendAsync(message);
            await smtp.DisconnectAsync(true);

            _logger.LogInformation(
                "Notification email sent to owner for ContactId={ContactId}",
                contact.Id
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Failed to send notification email for ContactId={ContactId}",
                contact.Id
            );
        }
    }
}
