namespace VelocityAI.Api.Airtable;

public class AirtableOptions
{
    public const string SectionName = "Airtable";

    public string BaseId { get; set; } = string.Empty;
    public string PersonalAccessToken { get; set; } = string.Empty;
    public TableNames Tables { get; set; } = new();

    public class TableNames
    {
        public string Contacts { get; set; } = "Contacts";
        public string Faqs { get; set; } = "FAQs";
        public string Services { get; set; } = "Services";
        public string NewsletterSubscribers { get; set; } = "NewsletterSubscribers";
    }
}
