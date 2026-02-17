using System;
using System.Threading.Tasks;
using IIASA.GeoTrees.Entities.MapLayers;
using Microsoft.Extensions.Logging;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Guids;

namespace IIASA.GeoTrees.Data;

public class MapLayerDataSeederContributor : IDataSeedContributor, ITransientDependency
{
    private readonly IRepository<MapLayer, Guid> _mapLayerRepository;
    private readonly IGuidGenerator _guidGenerator;
    private readonly ILogger<MapLayerDataSeederContributor> _logger;

    public MapLayerDataSeederContributor(
        IRepository<MapLayer, Guid> mapLayerRepository,
        IGuidGenerator guidGenerator,
        ILogger<MapLayerDataSeederContributor> logger)
    {
        _mapLayerRepository = mapLayerRepository;
        _guidGenerator = guidGenerator;
        _logger = logger;
    }

    public async Task SeedAsync(DataSeedContext context)
    {
        if (await _mapLayerRepository.GetCountAsync() > 0)
        {
            return;
        }

        _logger.LogInformation("Seeding map layers...");

        await _mapLayerRepository.InsertAsync(new MapLayer(_guidGenerator.Create())
        {
            Name = "GEO TREES Plot Data",
            Type = MapLayerType.BackendGeoJson,
            SourceEndpoint = "plot-geojson",
            GroupName = "GEO TREES Data",
            IsVisible = true,
            Order = 1,
        }, autoSave: true);

        await _mapLayerRepository.InsertAsync(new MapLayer(_guidGenerator.Create())
        {
            Name = "GEO TREES BHM Data",
            Type = MapLayerType.BackendGeoJson,
            SourceEndpoint = "external-data-geojson",
            GroupName = "GEO TREES Data",
            IsVisible = true,
            Order = 2,
        }, autoSave: true);

        await _mapLayerRepository.InsertAsync(new MapLayer(_guidGenerator.Create())
        {
            Name = "CCI Biomass Map 2018",
            Type = MapLayerType.WMS,
            Url = "https://geoservice.dlr.de/eoc/land/wms",
            Layers = "GlobBiomass_global_2018",
            Format = "image/png",
            GroupName = "Supported Datasets",
            IsVisible = false,
            Order = 3,
            Attribution = "ESA CCI Biomass",
        }, autoSave: true);

        await _mapLayerRepository.InsertAsync(new MapLayer(_guidGenerator.Create())
        {
            Name = "CCI+ Biomass Map 2020",
            Type = MapLayerType.WMS,
            Url = "https://geoservice.dlr.de/eoc/land/wms",
            Layers = "GlobBiomass_global_2020",
            Format = "image/png",
            GroupName = "Supported Datasets",
            IsVisible = false,
            Order = 4,
            Attribution = "ESA CCI+ Biomass",
        }, autoSave: true);

        _logger.LogInformation("Map layers seeded successfully.");
    }
}
