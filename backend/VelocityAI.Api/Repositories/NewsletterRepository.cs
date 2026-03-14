using Velobiz.Api.Airtable;
using Velobiz.Api.Models;
using Microsoft.Extensions.Options;

namespace Velobiz.Api.Repositories;

public class NewsletterRepository : INewsletterRepository
{
    private readonly AirtableClient _airtable;
    private readonly string _tableName;

    public NewsletterRepository(AirtableClient airtable, IOptions<AirtableOptions> options)
    {
        _airtable = airtable;
        _tableName = options.Value.Tables.NewsletterSubscribers;
    }

    public async Task<NewsletterSubscriber?> GetByEmailAsync(string email)
    {
        var formula = $"{{Email}}=\"{EscapeFormulaString(email)}\"";
        var records = await _airtable.GetAllAsync<NewsletterSubscriberFields>(_tableName, filterFormula: formula);
        var match = records.FirstOrDefault();
        return match is null ? null : MapToSubscriber(match);
    }

    public async Task<IEnumerable<NewsletterSubscriber>> GetAllActiveAsync()
    {
        var records = await _airtable.GetAllAsync<NewsletterSubscriberFields>(
            _tableName,
            filterFormula: "{IsActive}=TRUE()");

        return records.Select(MapToSubscriber);
    }

    public async Task<NewsletterSubscriber> AddAsync(NewsletterSubscriber subscriber)
    {
        var existing = await GetByEmailAsync(subscriber.Email);
        if (existing is not null)
            throw new InvalidOperationException($"Email '{subscriber.Email}' is already subscribed.");

        var fields = new NewsletterSubscriberFields
        {
            Email = subscriber.Email,
            SubscribedAt = subscriber.SubscribedAt.ToString("o"),
            IsActive = subscriber.IsActive
        };

        var record = await _airtable.CreateAsync<NewsletterSubscriberFields>(_tableName, fields);
        return MapToSubscriber(record);
    }

    public async Task UpdateAsync(NewsletterSubscriber subscriber)
    {
        if (string.IsNullOrEmpty(subscriber.AirtableId))
            throw new InvalidOperationException("Cannot update NewsletterSubscriber without AirtableId.");

        var fields = new NewsletterSubscriberFields
        {
            Email = subscriber.Email,
            SubscribedAt = subscriber.SubscribedAt.ToString("o"),
            IsActive = subscriber.IsActive
        };

        await _airtable.UpdateAsync<NewsletterSubscriberFields>(_tableName, subscriber.AirtableId, fields);
    }

    public async Task DeleteAsync(int id)
    {
        var records = await _airtable.GetAllAsync<NewsletterSubscriberFields>(_tableName);
        var match = records.FirstOrDefault(r => AirtableIdHelper.ToIntId(r.Id) == id);
        if (match is null) return;

        var fields = new NewsletterSubscriberFields
        {
            Email = match.Fields.Email,
            SubscribedAt = match.Fields.SubscribedAt,
            IsActive = false
        };

        await _airtable.UpdateAsync<NewsletterSubscriberFields>(_tableName, match.Id, fields);
    }

    private static NewsletterSubscriber MapToSubscriber(AirtableRecord<NewsletterSubscriberFields> record)
    {
        var f = record.Fields;
        return new NewsletterSubscriber
        {
            Id = AirtableIdHelper.ToIntId(record.Id),
            AirtableId = record.Id,
            Email = f.Email,
            SubscribedAt = DateTime.TryParse(f.SubscribedAt, out var dt) ? dt.ToUniversalTime() : DateTime.UtcNow,
            IsActive = f.IsActive
        };
    }

    private static string EscapeFormulaString(string value)
        => value.Replace("\\", "\\\\").Replace("\"", "\\\"");
}
