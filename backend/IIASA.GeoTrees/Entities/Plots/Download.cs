using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace IIASA.GeoTrees.Entities.Plots;

public class Download : AuditedAggregateRoot<Guid>
{
    public string Email { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string Purpose { get; set; } = null!;
    public string Format { get; set; } = null!;
    public string IpAddress { get; set; } = null!;
    public string UserAgent { get; set; } = null!;
    public string Referer { get; set; } = null!;
    public string Origin { get; set; } = null!;
}
