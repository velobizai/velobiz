using VelocityAI.Api.Airtable;
using VelocityAI.Api.Models;
using Microsoft.Extensions.Options;

namespace VelocityAI.Api.Repositories;

public class FaqRepository : IFaqRepository
{
    private readonly AirtableClient _airtable;
    private readonly string _tableName;

    public FaqRepository(AirtableClient airtable, IOptions<AirtableOptions> options)
    {
        _airtable = airtable;
        _tableName = options.Value.Tables.Faqs;
    }

    public async Task<IEnumerable<Faq>> GetAllActiveAsync()
    {
        var records = await _airtable.GetAllAsync<FaqFields>(
            _tableName,
            filterFormula: "{IsActive}=TRUE()",
            sortField: "DisplayOrder",
            sortDirection: "asc");

        return records.Select(MapToFaq);
    }

    public async Task<Faq?> GetByIdAsync(int id)
    {
        var records = await _airtable.GetAllAsync<FaqFields>(
            _tableName,
            filterFormula: "{IsActive}=TRUE()");

        var match = records.FirstOrDefault(r => AirtableIdHelper.ToIntId(r.Id) == id);
        return match is null ? null : MapToFaq(match);
    }

    public async Task<Faq> AddAsync(Faq faq)
    {
        var fields = new FaqFields
        {
            Question = faq.Question,
            Answer = faq.Answer,
            DisplayOrder = faq.DisplayOrder,
            IsActive = faq.IsActive
        };

        var record = await _airtable.CreateAsync<FaqFields>(_tableName, fields);
        return MapToFaq(record);
    }

    public async Task UpdateAsync(Faq faq)
    {
        if (string.IsNullOrEmpty(faq.AirtableId))
            throw new InvalidOperationException("Cannot update Faq without AirtableId.");

        var fields = new FaqFields
        {
            Question = faq.Question,
            Answer = faq.Answer,
            DisplayOrder = faq.DisplayOrder,
            IsActive = faq.IsActive
        };

        await _airtable.UpdateAsync<FaqFields>(_tableName, faq.AirtableId, fields);
    }

    public async Task DeleteAsync(int id)
    {
        var records = await _airtable.GetAllAsync<FaqFields>(_tableName);
        var match = records.FirstOrDefault(r => AirtableIdHelper.ToIntId(r.Id) == id);
        if (match is null) return;

        // Soft delete: set IsActive = false to preserve the Airtable record
        var fields = new FaqFields
        {
            Question = match.Fields.Question,
            Answer = match.Fields.Answer,
            DisplayOrder = match.Fields.DisplayOrder,
            IsActive = false
        };

        await _airtable.UpdateAsync<FaqFields>(_tableName, match.Id, fields);
    }

    private static Faq MapToFaq(AirtableRecord<FaqFields> record)
    {
        var f = record.Fields;
        return new Faq
        {
            Id = AirtableIdHelper.ToIntId(record.Id),
            AirtableId = record.Id,
            Question = f.Question,
            Answer = f.Answer,
            DisplayOrder = f.DisplayOrder,
            IsActive = f.IsActive
        };
    }
}
