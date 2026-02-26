using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace IIASA.GeoTrees.Entities.MapLayers;

public class MapLayer : AuditedAggregateRoot<Guid>
{
    public MapLayer() { }

    public MapLayer(Guid id)
        : base(id) { }

    public string Name { get; set; } = null!;
    public MapLayerType Type { get; set; }
    public string? Url { get; set; }
    public string? SourceEndpoint { get; set; }
    public string? Layers { get; set; }
    public string? Format { get; set; }
    public bool IsVisible { get; set; }
    public string? LegendUrl { get; set; }
    public string? Attribution { get; set; }
    public int Order { get; set; }
    public string GroupName { get; set; } = null!;
}
