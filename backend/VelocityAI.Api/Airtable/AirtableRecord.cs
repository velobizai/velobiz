using System.Text.Json.Serialization;

namespace VelocityAI.Api.Airtable;

public class AirtableRecord<TFields> where TFields : class
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("createdTime")]
    public string CreatedTime { get; set; } = string.Empty;

    [JsonPropertyName("fields")]
    public TFields Fields { get; set; } = default!;
}

public class AirtableListResponse<TFields> where TFields : class
{
    [JsonPropertyName("records")]
    public List<AirtableRecord<TFields>> Records { get; set; } = new();

    [JsonPropertyName("offset")]
    public string? Offset { get; set; }
}

public class AirtableWriteRequest<TFields> where TFields : class
{
    [JsonPropertyName("fields")]
    public TFields Fields { get; set; } = default!;
}

// ─── Per-entity field classes ────────────────────────────────────────────────

public class ContactFields
{
    [JsonPropertyName("Name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("Email")]
    public string Email { get; set; } = string.Empty;

    [JsonPropertyName("Company")]
    public string? Company { get; set; }

    [JsonPropertyName("Phone")]
    public string? Phone { get; set; }

    [JsonPropertyName("Message")]
    public string Message { get; set; } = string.Empty;

    [JsonPropertyName("ServiceInterest")]
    public string ServiceInterest { get; set; } = string.Empty;

    [JsonPropertyName("Status")]
    public string Status { get; set; } = "new";

    [JsonPropertyName("CreatedAt")]
    public string CreatedAt { get; set; } = string.Empty;
}

public class FaqFields
{
    [JsonPropertyName("Question")]
    public string Question { get; set; } = string.Empty;

    [JsonPropertyName("Answer")]
    public string Answer { get; set; } = string.Empty;

    [JsonPropertyName("DisplayOrder")]
    public int DisplayOrder { get; set; }

    [JsonPropertyName("IsActive")]
    public bool IsActive { get; set; }
}

public class ServiceFields
{
    [JsonPropertyName("Title")]
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("Icon")]
    public string Icon { get; set; } = string.Empty;

    [JsonPropertyName("ShortDescription")]
    public string ShortDescription { get; set; } = string.Empty;

    [JsonPropertyName("LongDescription")]
    public string LongDescription { get; set; } = string.Empty;

    [JsonPropertyName("DisplayOrder")]
    public int DisplayOrder { get; set; }

    [JsonPropertyName("IsActive")]
    public bool IsActive { get; set; }
}

public class NewsletterSubscriberFields
{
    [JsonPropertyName("Email")]
    public string Email { get; set; } = string.Empty;

    [JsonPropertyName("SubscribedAt")]
    public string SubscribedAt { get; set; } = string.Empty;

    [JsonPropertyName("IsActive")]
    public bool IsActive { get; set; }
}
