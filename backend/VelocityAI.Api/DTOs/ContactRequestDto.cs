namespace Velobiz.Api.DTOs;

/// <summary>
/// Contact form submission request
/// </summary>
public class ContactRequestDto
{
    /// <summary>
    /// Full name of the contact
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Email address of the contact
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Company name (optional)
    /// </summary>
    public string? Company { get; set; }

    /// <summary>
    /// Phone number (optional)
    /// </summary>
    public string? Phone { get; set; }

    /// <summary>
    /// Message from the contact
    /// </summary>
    public string Message { get; set; } = string.Empty;

    /// <summary>
    /// Service the contact is interested in
    /// </summary>
    public string ServiceInterest { get; set; } = string.Empty;

    /// <summary>
    /// Honeypot field for spam prevention (must be empty)
    /// </summary>
    public string? Honeypot { get; set; }
}
