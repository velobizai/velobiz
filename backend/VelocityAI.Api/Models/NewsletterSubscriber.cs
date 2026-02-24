using System.Text.Json.Serialization;

namespace VelocityAI.Api.Models;

public class NewsletterSubscriber
{
    public int Id { get; set; }
    [JsonIgnore]
    public string AirtableId { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime SubscribedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
}
