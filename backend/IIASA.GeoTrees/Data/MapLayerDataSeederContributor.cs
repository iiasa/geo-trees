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
        ILogger<MapLayerDataSeederContributor> logger
    )
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

        // GEO-TREES Data group
        await _mapLayerRepository.InsertAsync(
            new MapLayer(_guidGenerator.Create())
            {
                Name = "GEO-TREES Plot Data",
                Type = MapLayerType.BackendGeoJson,
                SourceEndpoint = "plot-geojson",
                GroupName = "GEO-TREES Data",
                IsVisible = true,
                Order = 1,
            },
            autoSave: true
        );

        await _mapLayerRepository.InsertAsync(
            new MapLayer(_guidGenerator.Create())
            {
                Name = "GEO-TREES ALS Data",
                Type = MapLayerType.WMS,
                Url = "https://geoserver.iiasa.ac.at/geoserver/geotrees/wms?TILED=true",
                Layers =
                    "geotrees:AfriSAR_Lope_AGB_50m,geotrees:AfriSAR_Mabounie_AGB_50m,geotrees:AfriSAR_Mondah_AGB_50m,geotrees:AfriSAR_Rabi_AGB_50m",
                Format = "image/png",
                GroupName = "GEO-TREES Data",
                IsVisible = false,
                Order = 2,
            },
            autoSave: true
        );

        // Supplementary Data group
        await _mapLayerRepository.InsertAsync(
            new MapLayer(_guidGenerator.Create())
            {
                Name = "CCI Biomass Map (AGB)",
                Type = MapLayerType.WMS,
                Url = "https://geoserver.iiasa.ac.at/geoserver/GeoWiki/wms?tiled=true",
                Layers = "GeoWiki:ESACCI_BIOMASS_100m_2020_v51",
                Format = "image/png",
                GroupName = "Supplementary Data",
                IsVisible = false,
                Order = 3,
                Attribution =
                    "Santoro, M., et al., (2021) The global forest above-ground biomass pool for 2010 estimated from high-resolution satellite observations, Earth Syst. Sci. Data, 13, 3927–3950, https://doi.org/10.5194/essd-13-3927-2021, CCI Biomass 2020 v.5.1.",
            },
            autoSave: true
        );

        await _mapLayerRepository.InsertAsync(
            new MapLayer(_guidGenerator.Create())
            {
                Name = "GEDI Biomass Map (AGB)",
                Type = MapLayerType.WMS,
                Url = "https://geoserver.iiasa.ac.at/geoserver/GeoWiki/wms?tiled=true",
                Layers = "GeoWiki:GEDI04_B_MW019MW223_02_002_02_R01000M_MU_cog",
                Format = "image/png",
                GroupName = "Supplementary Data",
                IsVisible = false,
                Order = 4,
            },
            autoSave: true
        );

        _logger.LogInformation("Map layers seeded successfully.");
    }
}
