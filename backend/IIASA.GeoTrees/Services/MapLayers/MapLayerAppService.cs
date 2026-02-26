using System;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;
using IIASA.GeoTrees.Entities.MapLayers;
using IIASA.GeoTrees.Permissions;
using IIASA.GeoTrees.Services.Dtos.MapLayers;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace IIASA.GeoTrees.Services.MapLayers;

[AllowAnonymous]
public class MapLayerAppService : ApplicationService, IMapLayerAppService
{
    private readonly IRepository<MapLayer, Guid> _mapLayerRepository;

    public MapLayerAppService(IRepository<MapLayer, Guid> mapLayerRepository)
    {
        _mapLayerRepository = mapLayerRepository;
    }

    public async Task<MapLayerDto> GetAsync(Guid id)
    {
        var entity = await _mapLayerRepository.GetAsync(id);
        return ObjectMapper.Map<MapLayer, MapLayerDto>(entity);
    }

    public async Task<PagedResultDto<MapLayerDto>> GetListAsync(GetMapLayerListDto input)
    {
        var queryable = await _mapLayerRepository.GetQueryableAsync();
        var totalCount = await AsyncExecuter.CountAsync(queryable);

        var query = queryable
            .OrderBy(input.Sorting.IsNullOrWhiteSpace() ? "Order" : input.Sorting)
            .Skip(input.SkipCount)
            .Take(input.MaxResultCount);

        var entities = await AsyncExecuter.ToListAsync(query);
        var dtos = ObjectMapper.Map<
            System.Collections.Generic.List<MapLayer>,
            System.Collections.Generic.List<MapLayerDto>
        >(entities);

        return new PagedResultDto<MapLayerDto>(totalCount, dtos);
    }

    [Authorize(GeoTreesPermissions.MapLayers.Create)]
    public async Task<MapLayerDto> CreateAsync(CreateUpdateMapLayerDto input)
    {
        var entity = ObjectMapper.Map<CreateUpdateMapLayerDto, MapLayer>(input);
        await _mapLayerRepository.InsertAsync(entity, autoSave: true);
        return ObjectMapper.Map<MapLayer, MapLayerDto>(entity);
    }

    [Authorize(GeoTreesPermissions.MapLayers.Edit)]
    public async Task<MapLayerDto> UpdateAsync(Guid id, CreateUpdateMapLayerDto input)
    {
        var entity = await _mapLayerRepository.GetAsync(id);
        ObjectMapper.Map(input, entity);
        await _mapLayerRepository.UpdateAsync(entity, autoSave: true);
        return ObjectMapper.Map<MapLayer, MapLayerDto>(entity);
    }

    [Authorize(GeoTreesPermissions.MapLayers.Delete)]
    public async Task DeleteAsync(Guid id)
    {
        await _mapLayerRepository.DeleteAsync(id);
    }
}
