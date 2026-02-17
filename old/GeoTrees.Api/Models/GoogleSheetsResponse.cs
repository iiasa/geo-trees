namespace GeoTrees.Api.Models;

public class GoogleSheetsResponse
{
    public string SpreadsheetId { get; set; } = string.Empty;
    public ValueRange[] ValueRanges { get; set; } = Array.Empty<ValueRange>();
}

public class ValueRange
{
    public string Range { get; set; } = string.Empty;
    public string MajorDimension { get; set; } = string.Empty;
    public List<List<string>> Values { get; set; } = new();
}
