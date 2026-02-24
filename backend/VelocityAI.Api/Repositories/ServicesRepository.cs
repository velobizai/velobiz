using VelocityAI.Api.Airtable;
using VelocityAI.Api.Models;
using Microsoft.Extensions.Options;

namespace VelocityAI.Api.Repositories;

public class ServicesRepository : IServicesRepository
{
    private readonly AirtableClient _airtable;
    private readonly string _tableName;

    public ServicesRepository(AirtableClient airtable, IOptions<AirtableOptions> options)
    {
        _airtable = airtable;
        _tableName = options.Value.Tables.Services;
    }

    public async Task<IEnumerable<Service>> GetAllActiveAsync()
    {
        var records = await _airtable.GetAllAsync<ServiceFields>(
            _tableName,
            filterFormula: "{IsActive}=TRUE()",
            sortField: "DisplayOrder",
            sortDirection: "asc");

        return records.Select(MapToService);
    }

    public async Task<Service?> GetByIdAsync(int id)
    {
        var records = await _airtable.GetAllAsync<ServiceFields>(_tableName);
        var match = records.FirstOrDefault(r => AirtableIdHelper.ToIntId(r.Id) == id);
        return match is null ? null : MapToService(match);
    }

    public async Task<Service> AddAsync(Service service)
    {
        var fields = new ServiceFields
        {
            Title = service.Title,
            Icon = service.Icon,
            ShortDescription = service.ShortDescription,
            LongDescription = service.LongDescription,
            DisplayOrder = service.DisplayOrder,
            IsActive = service.IsActive
        };

        var record = await _airtable.CreateAsync<ServiceFields>(_tableName, fields);
        return MapToService(record);
    }

    public async Task UpdateAsync(Service service)
    {
        if (string.IsNullOrEmpty(service.AirtableId))
            throw new InvalidOperationException("Cannot update Service without AirtableId.");

        var fields = new ServiceFields
        {
            Title = service.Title,
            Icon = service.Icon,
            ShortDescription = service.ShortDescription,
            LongDescription = service.LongDescription,
            DisplayOrder = service.DisplayOrder,
            IsActive = service.IsActive
        };

        await _airtable.UpdateAsync<ServiceFields>(_tableName, service.AirtableId, fields);
    }

    public async Task DeleteAsync(int id)
    {
        var records = await _airtable.GetAllAsync<ServiceFields>(_tableName);
        var match = records.FirstOrDefault(r => AirtableIdHelper.ToIntId(r.Id) == id);
        if (match is null) return;

        // Soft delete: preserve the seed data record in Airtable
        var fields = new ServiceFields
        {
            Title = match.Fields.Title,
            Icon = match.Fields.Icon,
            ShortDescription = match.Fields.ShortDescription,
            LongDescription = match.Fields.LongDescription,
            DisplayOrder = match.Fields.DisplayOrder,
            IsActive = false
        };

        await _airtable.UpdateAsync<ServiceFields>(_tableName, match.Id, fields);
    }

    private static Service MapToService(AirtableRecord<ServiceFields> record)
    {
        var f = record.Fields;
        return new Service
        {
            Id = AirtableIdHelper.ToIntId(record.Id),
            AirtableId = record.Id,
            Title = f.Title,
            Icon = f.Icon,
            ShortDescription = f.ShortDescription,
            LongDescription = f.LongDescription,
            DisplayOrder = f.DisplayOrder,
            IsActive = f.IsActive
        };
    }
}
