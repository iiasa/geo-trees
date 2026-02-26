using IIASA.GeoTrees.Entities.MapLayers;
using IIASA.GeoTrees.Services.Dtos.MapLayers;
using Riok.Mapperly.Abstractions;
using Volo.Abp.Mapperly;

namespace IIASA.GeoTrees.ObjectMapping;

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public partial class MapLayerToMapLayerDtoMapper : MapperBase<MapLayer, MapLayerDto>
{
    public override partial MapLayerDto Map(MapLayer source);

    public override partial void Map(MapLayer source, MapLayerDto destination);
}

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public partial class CreateUpdateMapLayerDtoToMapLayerMapper
    : MapperBase<CreateUpdateMapLayerDto, MapLayer>
{
    public override partial MapLayer Map(CreateUpdateMapLayerDto source);

    public override partial void Map(CreateUpdateMapLayerDto source, MapLayer destination);
}
