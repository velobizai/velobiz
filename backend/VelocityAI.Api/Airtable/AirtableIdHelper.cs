namespace Velobiz.Api.Airtable;

public static class AirtableIdHelper
{
    /// <summary>
    /// Converts an Airtable string record ID (e.g. "recXXXXXX") to a stable
    /// positive int using FNV-1a 32-bit hash. Deterministic across process restarts.
    /// </summary>
    public static int ToIntId(string airtableRecordId)
    {
        if (string.IsNullOrEmpty(airtableRecordId)) return 0;

        unchecked
        {
            uint hash = 2166136261u;
            foreach (char c in airtableRecordId)
            {
                hash ^= (uint)c;
                hash *= 16777619u;
            }
            return (int)(hash & 0x7FFFFFFF);
        }
    }
}
