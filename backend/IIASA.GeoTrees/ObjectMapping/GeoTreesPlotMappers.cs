using IIASA.GeoTrees.Entities.Plots;
using IIASA.GeoTrees.Services.Dtos.Plots;
using Riok.Mapperly.Abstractions;
using Volo.Abp.Mapperly;

namespace IIASA.GeoTrees.ObjectMapping;

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public partial class PlotToPlotDtoMapper : MapperBase<Plot, PlotDto>
{
    public override partial PlotDto Map(Plot source);

    public override partial void Map(Plot source, PlotDto destination);
}

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public partial class CreateUpdatePlotDtoToPlotMapper : MapperBase<CreateUpdatePlotDto, Plot>
{
    public override partial Plot Map(CreateUpdatePlotDto source);

    public override partial void Map(CreateUpdatePlotDto source, Plot destination);
}

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public partial class DownloadToDownloadDtoMapper : MapperBase<Download, DownloadDto>
{
    public override partial DownloadDto Map(Download source);

    public override partial void Map(Download source, DownloadDto destination);
}
