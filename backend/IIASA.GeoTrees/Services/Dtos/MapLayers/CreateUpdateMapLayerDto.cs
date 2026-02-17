using System.ComponentModel.DataAnnotations;
using IIASA.GeoTrees.Entities.MapLayers;

namespace IIASA.GeoTrees.Services.Dtos.MapLayers;

public class CreateUpdateMapLayerDto
{
    [Required]
    [StringLength(256)]
    public string Name { get; set; } = null!;

    [Required]
    public MapLayerType Type { get; set; }

    [StringLength(1024)]
    public string? Url { get; set; }

    [StringLength(256)]
    public string? SourceEndpoint { get; set; }

    [StringLength(256)]
    public string? Layers { get; set; }

    [StringLength(64)]
    public string? Format { get; set; }

    public bool IsVisible { get; set; }

    [StringLength(1024)]
    public string? LegendUrl { get; set; }

    [StringLength(512)]
    public string? Attribution { get; set; }

    public int Order { get; set; }

    [Required]
    [StringLength(256)]
    public string GroupName { get; set; } = null!;
}
