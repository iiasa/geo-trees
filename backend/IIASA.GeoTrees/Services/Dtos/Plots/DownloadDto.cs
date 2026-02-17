using System;
using Volo.Abp.Application.Dtos;

namespace IIASA.GeoTrees.Services.Dtos.Plots;

public class DownloadDto : AuditedEntityDto<Guid>
{
    public string Email { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string Purpose { get; set; } = null!;
    public string Format { get; set; } = null!;
}
