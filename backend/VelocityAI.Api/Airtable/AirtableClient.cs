using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Options;

namespace VelocityAI.Api.Airtable;

public class AirtableClient
{
    private readonly HttpClient _http;
    private readonly AirtableOptions _options;
    private readonly ILogger<AirtableClient> _logger;

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public AirtableClient(
        HttpClient http,
        IOptions<AirtableOptions> options,
        ILogger<AirtableClient> logger)
    {
        _http = http;
        _options = options.Value;
        _logger = logger;
    }

    /// <summary>
    /// Fetches all records from a table, automatically following pagination
    /// via Airtable's offset token until all pages are consumed.
    /// </summary>
    public async Task<List<AirtableRecord<TFields>>> GetAllAsync<TFields>(
        string tableName,
        string? filterFormula = null,
        string? sortField = null,
        string sortDirection = "asc") where TFields : class
    {
        var allRecords = new List<AirtableRecord<TFields>>();
        string? offset = null;

        do
        {
            var url = BuildListUrl(tableName, filterFormula, sortField, sortDirection, offset);
            _logger.LogDebug("Airtable GET {Url}", url);

            var response = await _http.GetFromJsonAsync<AirtableListResponse<TFields>>(url, JsonOptions);

            if (response is null) break;

            allRecords.AddRange(response.Records);
            offset = response.Offset;

        } while (!string.IsNullOrEmpty(offset));

        return allRecords;
    }

    /// <summary>
    /// Fetches a single record by its Airtable record ID. Returns null on 404.
    /// </summary>
    public async Task<AirtableRecord<TFields>?> GetByRecordIdAsync<TFields>(
        string tableName,
        string recordId) where TFields : class
    {
        var url = $"{_options.BaseId}/{Uri.EscapeDataString(tableName)}/{recordId}";

        try
        {
            return await _http.GetFromJsonAsync<AirtableRecord<TFields>>(url, JsonOptions);
        }
        catch (HttpRequestException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            return null;
        }
    }

    /// <summary>
    /// Creates a new record. Returns the full record including the assigned Airtable record ID.
    /// </summary>
    public async Task<AirtableRecord<TFields>> CreateAsync<TFields>(
        string tableName,
        TFields fields) where TFields : class
    {
        var url = $"{_options.BaseId}/{Uri.EscapeDataString(tableName)}";
        var body = new AirtableWriteRequest<TFields> { Fields = fields };

        var httpResponse = await _http.PostAsJsonAsync(url, body, JsonOptions);
        httpResponse.EnsureSuccessStatusCode();

        var result = await httpResponse.Content.ReadFromJsonAsync<AirtableRecord<TFields>>(JsonOptions);
        return result!;
    }

    /// <summary>
    /// Partially updates a record (PATCH). Returns the updated record.
    /// </summary>
    public async Task<AirtableRecord<TFields>> UpdateAsync<TFields>(
        string tableName,
        string recordId,
        TFields fields) where TFields : class
    {
        var url = $"{_options.BaseId}/{Uri.EscapeDataString(tableName)}/{recordId}";
        var body = new AirtableWriteRequest<TFields> { Fields = fields };

        var request = new HttpRequestMessage(HttpMethod.Patch, url)
        {
            Content = JsonContent.Create(body, options: JsonOptions)
        };

        var httpResponse = await _http.SendAsync(request);
        httpResponse.EnsureSuccessStatusCode();

        var result = await httpResponse.Content.ReadFromJsonAsync<AirtableRecord<TFields>>(JsonOptions);
        return result!;
    }

    /// <summary>
    /// Deletes a record by its Airtable record ID.
    /// </summary>
    public async Task DeleteAsync(string tableName, string recordId)
    {
        var url = $"{_options.BaseId}/{Uri.EscapeDataString(tableName)}/{recordId}";
        var httpResponse = await _http.DeleteAsync(url);
        httpResponse.EnsureSuccessStatusCode();
    }

    private string BuildListUrl(
        string tableName,
        string? filterFormula,
        string? sortField,
        string sortDirection,
        string? offset)
    {
        var sb = new System.Text.StringBuilder();
        sb.Append($"{_options.BaseId}/{Uri.EscapeDataString(tableName)}?");

        if (!string.IsNullOrEmpty(filterFormula))
            sb.Append($"filterByFormula={Uri.EscapeDataString(filterFormula)}&");

        if (!string.IsNullOrEmpty(sortField))
        {
            sb.Append($"sort%5B0%5D%5Bfield%5D={Uri.EscapeDataString(sortField)}&");
            sb.Append($"sort%5B0%5D%5Bdirection%5D={sortDirection}&");
        }

        if (!string.IsNullOrEmpty(offset))
            sb.Append($"offset={Uri.EscapeDataString(offset)}&");

        return sb.ToString().TrimEnd('&', '?');
    }
}
