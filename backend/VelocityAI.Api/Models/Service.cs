using System.Text.Json.Serialization;

namespace Velobiz.Api.Models;

public class Service
{
    public int Id { get; set; }
    [JsonIgnore]
    public string AirtableId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string LongDescription { get; set; } = string.Empty;
    public int DisplayOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;
}
