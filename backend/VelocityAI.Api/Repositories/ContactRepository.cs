using VelocityAI.Api.Airtable;
using VelocityAI.Api.Models;
using Microsoft.Extensions.Options;

namespace VelocityAI.Api.Repositories;

public class ContactRepository : IContactRepository
{
    private readonly AirtableClient _airtable;
    private readonly string _tableName;
    private readonly ILogger<ContactRepository> _logger;

    public ContactRepository(
        AirtableClient airtable,
        IOptions<AirtableOptions> options,
        ILogger<ContactRepository> logger)
    {
        _airtable = airtable;
        _tableName = options.Value.Tables.Contacts;
        _logger = logger;
    }

    public async Task<Contact> AddAsync(Contact contact)
    {
        var fields = new ContactFields
        {
            Name = contact.Name,
            Email = contact.Email,
            Company = contact.Company,
            Phone = contact.Phone,
            Message = contact.Message,
            ServiceInterest = contact.ServiceInterest,
            Status = contact.Status,
            CreatedAt = contact.CreatedAt.ToString("o")
        };

        var record = await _airtable.CreateAsync<ContactFields>(_tableName, fields);

        contact.AirtableId = record.Id;
        contact.Id = AirtableIdHelper.ToIntId(record.Id);

        _logger.LogInformation(
            "Contact saved to Airtable. AirtableId={AirtableId}, Id={Id}",
            contact.AirtableId, contact.Id);

        return contact;
    }

    public async Task<Contact?> GetByIdAsync(int id)
    {
        var records = await _airtable.GetAllAsync<ContactFields>(_tableName);
        var match = records.FirstOrDefault(r => AirtableIdHelper.ToIntId(r.Id) == id);
        return match is null ? null : MapToContact(match);
    }

    public async Task<IEnumerable<Contact>> GetAllAsync()
    {
        var records = await _airtable.GetAllAsync<ContactFields>(_tableName);
        return records.Select(MapToContact);
    }

    public async Task UpdateAsync(Contact contact)
    {
        if (string.IsNullOrEmpty(contact.AirtableId))
            throw new InvalidOperationException("Cannot update Contact without AirtableId.");

        var fields = new ContactFields
        {
            Name = contact.Name,
            Email = contact.Email,
            Company = contact.Company,
            Phone = contact.Phone,
            Message = contact.Message,
            ServiceInterest = contact.ServiceInterest,
            Status = contact.Status,
            CreatedAt = contact.CreatedAt.ToString("o")
        };

        await _airtable.UpdateAsync<ContactFields>(_tableName, contact.AirtableId, fields);
    }

    public async Task DeleteAsync(int id)
    {
        var records = await _airtable.GetAllAsync<ContactFields>(_tableName);
        var match = records.FirstOrDefault(r => AirtableIdHelper.ToIntId(r.Id) == id);
        if (match is not null)
            await _airtable.DeleteAsync(_tableName, match.Id);
    }

    private static Contact MapToContact(AirtableRecord<ContactFields> record)
    {
        var f = record.Fields;
        return new Contact
        {
            Id = AirtableIdHelper.ToIntId(record.Id),
            AirtableId = record.Id,
            Name = f.Name,
            Email = f.Email,
            Company = f.Company,
            Phone = f.Phone,
            Message = f.Message,
            ServiceInterest = f.ServiceInterest,
            Status = f.Status,
            CreatedAt = DateTime.TryParse(f.CreatedAt, out var dt) ? dt.ToUniversalTime() : DateTime.UtcNow
        };
    }
}
