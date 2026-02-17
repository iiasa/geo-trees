using Volo.Abp.Application.Dtos;

namespace IIASA.GeoTrees.Services.Dtos.Plots;

public class GetPlotListDto : PagedAndSortedResultRequestDto
{
    public int? Version { get; set; }
}
