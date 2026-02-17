namespace GeoTrees.Api.Models;

public class PaginatedResponse<T>
{
    public required List<T> Items { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalItems { get; set; }
    public int TotalPages { get; set; }
}
