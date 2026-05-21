using IIASA.GeoTrees.Entities.Plots;
using IIASA.GeoTrees.Services.Dtos.Plots;
using Riok.Mapperly.Abstractions;
using Volo.Abp.Mapperly;

namespace IIASA.GeoTrees.ObjectMapping;

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public partial class PlotToPlotDtoMapper : MapperBase<Plot, PlotDto>
{
    [MapperIgnoreTarget(nameof(PlotDto.RoundLocation))]
    [MapperIgnoreTarget(nameof(PlotDto.SubPlotArea))]
    public override partial PlotDto Map(Plot source);

    [MapperIgnoreTarget(nameof(PlotDto.RoundLocation))]
    [MapperIgnoreTarget(nameof(PlotDto.SubPlotArea))]
    public override partial void Map(Plot source, PlotDto destination);
}

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public partial class CreateUpdatePlotDtoToPlotMapper : MapperBase<CreateUpdatePlotDto, Plot>
{
    [MapperIgnoreTarget(nameof(Plot.CreationTime))]
    [MapperIgnoreTarget(nameof(Plot.CreatorId))]
    [MapperIgnoreTarget(nameof(Plot.LastModificationTime))]
    [MapperIgnoreTarget(nameof(Plot.LastModifierId))]
    [MapperIgnoreTarget(nameof(Plot.ConcurrencyStamp))]
    public override partial Plot Map(CreateUpdatePlotDto source);

    [MapperIgnoreTarget(nameof(Plot.CreationTime))]
    [MapperIgnoreTarget(nameof(Plot.CreatorId))]
    [MapperIgnoreTarget(nameof(Plot.LastModificationTime))]
    [MapperIgnoreTarget(nameof(Plot.LastModifierId))]
    [MapperIgnoreTarget(nameof(Plot.ConcurrencyStamp))]
    public override partial void Map(CreateUpdatePlotDto source, Plot destination);
}

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public partial class DownloadToDownloadDtoMapper : MapperBase<Download, DownloadDto>
{
    public override partial DownloadDto Map(Download source);

    public override partial void Map(Download source, DownloadDto destination);
}
