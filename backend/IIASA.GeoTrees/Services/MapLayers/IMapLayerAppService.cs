using System;
using IIASA.GeoTrees.Services.Dtos.MapLayers;
using Volo.Abp.Application.Services;

namespace IIASA.GeoTrees.Services.MapLayers;

public interface IMapLayerAppService :
    ICrudAppService<MapLayerDto, Guid, GetMapLayerListDto, CreateUpdateMapLayerDto>
{
}
