using System.Text.Json.Serialization;

namespace Velobiz.Api.Models;

public class Faq
{
    public int Id { get; set; }
    [JsonIgnore]
    public string AirtableId { get; set; } = string.Empty;
    public string Question { get; set; } = string.Empty;
    public string Answer { get; set; } = string.Empty;
    public int DisplayOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;
}
