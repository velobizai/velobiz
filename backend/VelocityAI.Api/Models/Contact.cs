using System.Text.Json.Serialization;

namespace Velobiz.Api.Models;

public class Contact
{
    public int Id { get; set; }
    [JsonIgnore]
    public string AirtableId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Company { get; set; }
    public string? Phone { get; set; }
    public string Message { get; set; } = string.Empty;
    public string ServiceInterest { get; set; } = string.Empty;
    public string Status { get; set; } = "new";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
