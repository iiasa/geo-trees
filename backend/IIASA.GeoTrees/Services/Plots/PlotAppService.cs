using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using IIASA.GeoTrees.Entities.Plots;
using IIASA.GeoTrees.Permissions;
using IIASA.GeoTrees.Services.Dtos.Plots;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace IIASA.GeoTrees.Services.Plots;

[Authorize(GeoTreesPermissions.Plots.Default)]
public class PlotAppService : ApplicationService, IPlotAppService
{
    private readonly IRepository<Plot, Guid> _plotRepository;
    private readonly IRepository<Download, Guid> _downloadRepository;

    public PlotAppService(
        IRepository<Plot, Guid> plotRepository,
        IRepository<Download, Guid> downloadRepository)
    {
        _plotRepository = plotRepository;
        _downloadRepository = downloadRepository;
    }

    public async Task<PlotDto> GetAsync(Guid id)
    {
        var plot = await _plotRepository.GetAsync(id);
        var dto = ObjectMapper.Map<Plot, PlotDto>(plot);
        dto.RoundLocation = $"{plot.LatCnt}, {plot.LonCnt}";
        return dto;
    }

    public async Task<PagedResultDto<PlotDto>> GetListAsync(GetPlotListDto input)
    {
        var queryable = await _plotRepository.GetQueryableAsync();

        if (input.Version.HasValue)
        {
            queryable = queryable.Where(p => p.Version == input.Version.Value);
        }

        var totalCount = await AsyncExecuter.CountAsync(queryable);

        var query = queryable
            .OrderBy(input.Sorting.IsNullOrWhiteSpace() ? "CreationTime" : input.Sorting)
            .Skip(input.SkipCount)
            .Take(input.MaxResultCount);

        var plots = await AsyncExecuter.ToListAsync(query);

        var dtos = plots.Select(p =>
        {
            var dto = ObjectMapper.Map<Plot, PlotDto>(p);
            dto.RoundLocation = $"{p.LatCnt}, {p.LonCnt}";
            return dto;
        }).ToList();

        return new PagedResultDto<PlotDto>(totalCount, dtos);
    }

    public async Task<PlotDto> GetByPlotIdAsync(string plotId, int? version = null)
    {
        var queryable = await _plotRepository.GetQueryableAsync();

        var query = queryable.Where(p => p.PlotId == plotId);
        if (version.HasValue)
        {
            query = query.Where(p => p.Version == version.Value);
        }

        var plot = await AsyncExecuter.FirstOrDefaultAsync(query);
        if (plot == null)
        {
            throw new UserFriendlyException("Plot not found");
        }

        var plotCount = await AsyncExecuter.CountAsync(query);
        var subPlotArea = plot.PlotArea;
        var plotArea = plot.PlotArea * plotCount;

        var dto = ObjectMapper.Map<Plot, PlotDto>(plot);
        dto.RoundLocation = $"{plot.LatCnt}, {plot.LonCnt}";
        dto.PlotArea = plotArea;
        dto.SubPlotArea = subPlotArea;
        return dto;
    }

    [Authorize(GeoTreesPermissions.Plots.Create)]
    public async Task<PlotDto> CreateAsync(CreateUpdatePlotDto input)
    {
        var queryable = await _plotRepository.GetQueryableAsync();
        var exists = await AsyncExecuter.AnyAsync(
            queryable.Where(p => p.PlotId == input.PlotId && p.SubPlotId == input.SubPlotId));

        if (exists)
        {
            throw new UserFriendlyException("A plot with this PlotId and SubPlotId already exists");
        }

        var plot = ObjectMapper.Map<CreateUpdatePlotDto, Plot>(input);
        if (plot.Version <= 0) plot.Version = 1;

        await _plotRepository.InsertAsync(plot, autoSave: true);

        var dto = ObjectMapper.Map<Plot, PlotDto>(plot);
        dto.RoundLocation = $"{plot.LatCnt}, {plot.LonCnt}";
        return dto;
    }

    [Authorize(GeoTreesPermissions.Plots.Edit)]
    public async Task<PlotDto> UpdateAsync(Guid id, CreateUpdatePlotDto input)
    {
        var plot = await _plotRepository.GetAsync(id);
        ObjectMapper.Map(input, plot);
        await _plotRepository.UpdateAsync(plot, autoSave: true);

        var dto = ObjectMapper.Map<Plot, PlotDto>(plot);
        dto.RoundLocation = $"{plot.LatCnt}, {plot.LonCnt}";
        return dto;
    }

    [Authorize(GeoTreesPermissions.Plots.Delete)]
    public async Task DeleteAsync(Guid id)
    {
        await _plotRepository.DeleteAsync(id);
    }

    [AllowAnonymous]
    public async Task<List<string>> GetAvailableCountriesAsync()
    {
        var queryable = await _plotRepository.GetQueryableAsync();
        var countries = await AsyncExecuter.ToListAsync(
            queryable.Select(p => p.CountryName).Distinct().OrderBy(c => c));
        return countries;
    }

    [AllowAnonymous]
    public async Task<List<int>> GetAvailableVersionsAsync()
    {
        var queryable = await _plotRepository.GetQueryableAsync();
        var versions = await AsyncExecuter.ToListAsync(
            queryable.Select(p => p.Version).Distinct().OrderBy(v => v));
        return versions;
    }

    [AllowAnonymous]
    public async Task<object> GetGeoJsonAsync(string? status = null)
    {
        var queryable = await _plotRepository.GetQueryableAsync();

        if (!string.IsNullOrWhiteSpace(status))
        {
            queryable = queryable.Where(p => p.Status == status);
        }

        var plots = await AsyncExecuter.ToListAsync(queryable);

        var features = plots.Select(p => new
        {
            type = "Feature",
            geometry = new { type = "Point", coordinates = new[] { p.LonCnt ?? 0, p.LatCnt ?? 0 } },
            properties = new
            {
                p.PlotId,
                p.CountryName,
                p.Network,
                p.Institution,
                p.Link,
                p.YearEstablished,
                p.YearCensus,
                p.PiTeam,
                p.Reference,
                p.Confidential,
                p.OtherMeasurements,
                p.BiomassProcessingProtocol,
                p.Status,
                p.SubPlotId,
                p.AgbChave,
                Coordinates = new
                {
                    Center = new { Latitude = p.LatCnt, Longitude = p.LonCnt },
                    NorthEast = new { Latitude = p.LatNe, Longitude = p.LonNe },
                    NorthWest = new { Latitude = p.LatNw, Longitude = p.LonNw },
                    SouthEast = new { Latitude = p.LatSe, Longitude = p.LonSe },
                    SouthWest = new { Latitude = p.LatSw, Longitude = p.LonSw },
                },
                p.Altitude,
                p.SlopeDegree,
                p.PlotArea,
                p.AgbChaveCred25,
                p.AgbChaveCred975,
                p.WoodDensity,
                p.Gsv,
                p.Ba,
                p.Ndens,
                p.PlotShape,
                p.ForestStatus,
                p.MinDbh,
                p.HLoreyLocal,
                p.HLoreyChave,
                p.HLoreyFeldpausch,
                p.HMaxLocal,
                p.HMaxChave,
                p.HMaxFeldpausch,
                p.AgbLocal,
                p.AgbLocalCred25,
                p.AgbLocal975,
                p.AgbFeldpausch,
                p.AgbFeldpauschCred25,
                p.AgbFeldpauschCred975,
            },
        });

        return new { type = "FeatureCollection", features };
    }

    [RemoteService(IsEnabled = false)]
    public async Task<byte[]> GetDownloadBytesAsync(PlotDownloadRequestDto input)
    {
        if (input.Format != "geojson" && input.Format != "csv")
        {
            throw new UserFriendlyException("Invalid download format. Use 'geojson' or 'csv'.");
        }

        var queryable = await _plotRepository.GetQueryableAsync();

        if (!input.Country.Equals("all", StringComparison.OrdinalIgnoreCase))
        {
            queryable = queryable.Where(p => p.CountryName == input.Country);
        }

        var plots = await AsyncExecuter.ToListAsync(queryable);

        if (!plots.Any())
        {
            throw new UserFriendlyException(
                input.Country.Equals("all", StringComparison.OrdinalIgnoreCase)
                    ? "No plots found"
                    : $"No plots found for country: {input.Country}");
        }

        var content = input.Format switch
        {
            "geojson" => GenerateGeoJson(plots),
            "csv" => GenerateCsv(plots),
            _ => throw new ArgumentException("Invalid download format"),
        };

        return await CreateZipFile(content, input.Format);
    }

    private static string GenerateGeoJson(List<Plot> plots)
    {
        var features = plots.Select(p => new
        {
            type = "Feature",
            geometry = new { type = "Point", coordinates = new[] { p.LonCnt ?? 0, p.LatCnt ?? 0 } },
            properties = new
            {
                p.PlotId,
                p.CountryName,
                p.Network,
                p.Institution,
                p.Link,
                p.YearEstablished,
                p.YearCensus,
                p.PiTeam,
                p.Reference,
                p.Confidential,
                p.OtherMeasurements,
                p.BiomassProcessingProtocol,
                p.Status,
                p.SubPlotId,
                p.AgbChave,
                Coordinates = new
                {
                    Center = new { Latitude = p.LatCnt, Longitude = p.LonCnt },
                    NorthEast = new { Latitude = p.LatNe, Longitude = p.LonNe },
                    NorthWest = new { Latitude = p.LatNw, Longitude = p.LonNw },
                    SouthEast = new { Latitude = p.LatSe, Longitude = p.LonSe },
                    SouthWest = new { Latitude = p.LatSw, Longitude = p.LonSw },
                },
                p.Altitude,
                p.SlopeDegree,
                p.PlotArea,
                p.AgbChaveCred25,
                p.AgbChaveCred975,
                p.WoodDensity,
                p.Gsv,
                p.Ba,
                p.Ndens,
                p.PlotShape,
                p.ForestStatus,
                p.MinDbh,
                p.HLoreyLocal,
                p.HLoreyChave,
                p.HLoreyFeldpausch,
                p.HMaxLocal,
                p.HMaxChave,
                p.HMaxFeldpausch,
                p.AgbLocal,
                p.AgbLocalCred25,
                p.AgbLocal975,
                p.AgbFeldpausch,
                p.AgbFeldpauschCred25,
                p.AgbFeldpauschCred975,
            },
        });

        var geoJson = new { type = "FeatureCollection", features };
        return JsonSerializer.Serialize(geoJson);
    }

    private static string GenerateCsv(List<Plot> plots)
    {
        var csv = new StringBuilder();

        csv.AppendLine(
            "Plot_ID,CountryName,Network,Institution,Link,YearEstablished,YearCensus,"
            + "PITeam,Reference,Confidential,OtherMeasurements,BiomassProcessingProtocol,Status,SubPlot_Id,"
            + "AGB_Chave,Lat_Cnt,Lon_Cnt,Lat_NE,Lon_NE,Lat_NW,Lon_NW,Lat_SE,Lon_SE,Lat_SW,Lon_SW,"
            + "Altitude,SlopeDegree,PlotArea,AGBChaveCred25,AGBChaveCred975,WoodDensity,GSV,BA,NDens,"
            + "PlotShape,ForestStatus,MinDBH,HLoreyLocal,HLoreyChave,HLoreyFeldpausch,HMaxLocal,"
            + "HMaxChave,HMaxFeldpausch,AGBLocal,AGBLocalCred25,AGBLocal975,AGBFeldpausch,"
            + "AGBFeldpauschCred25,AGBFeldpauschCred975");

        foreach (var plot in plots)
        {
            csv.AppendLine(
                $"{EscapeCsvField(plot.PlotId)},"
                + $"{EscapeCsvField(plot.CountryName)},"
                + $"{EscapeCsvField(plot.Network)},"
                + $"{EscapeCsvField(plot.Institution)},"
                + $"{EscapeCsvField(plot.Link)},"
                + $"{plot.YearEstablished},"
                + $"{plot.YearCensus},"
                + $"{EscapeCsvField(plot.PiTeam)},"
                + $"{EscapeCsvField(plot.Reference)},"
                + $"{plot.Confidential},"
                + $"{EscapeCsvField(plot.OtherMeasurements)},"
                + $"{EscapeCsvField(plot.BiomassProcessingProtocol)},"
                + $"{EscapeCsvField(plot.Status)},"
                + $"{EscapeCsvField(plot.SubPlotId)},"
                + $"{plot.AgbChave ?? 0},"
                + $"{plot.LatCnt ?? 0},"
                + $"{plot.LonCnt ?? 0},"
                + $"{plot.LatNe ?? 0},"
                + $"{plot.LonNe ?? 0},"
                + $"{plot.LatNw ?? 0},"
                + $"{plot.LonNw ?? 0},"
                + $"{plot.LatSe ?? 0},"
                + $"{plot.LonSe ?? 0},"
                + $"{plot.LatSw ?? 0},"
                + $"{plot.LonSw ?? 0},"
                + $"{plot.Altitude ?? 0},"
                + $"{plot.SlopeDegree ?? 0},"
                + $"{plot.PlotArea ?? 0},"
                + $"{plot.AgbChaveCred25 ?? 0},"
                + $"{plot.AgbChaveCred975 ?? 0},"
                + $"{plot.WoodDensity ?? 0},"
                + $"{plot.Gsv ?? 0},"
                + $"{plot.Ba ?? 0},"
                + $"{plot.Ndens ?? 0},"
                + $"{EscapeCsvField(plot.PlotShape)},"
                + $"{EscapeCsvField(plot.ForestStatus)},"
                + $"{plot.MinDbh ?? 0},"
                + $"{plot.HLoreyLocal ?? 0},"
                + $"{plot.HLoreyChave ?? 0},"
                + $"{plot.HLoreyFeldpausch ?? 0},"
                + $"{plot.HMaxLocal ?? 0},"
                + $"{plot.HMaxChave ?? 0},"
                + $"{plot.HMaxFeldpausch ?? 0},"
                + $"{plot.AgbLocal ?? 0},"
                + $"{plot.AgbLocalCred25 ?? 0},"
                + $"{plot.AgbLocal975 ?? 0},"
                + $"{plot.AgbFeldpausch ?? 0},"
                + $"{plot.AgbFeldpauschCred25 ?? 0},"
                + $"{plot.AgbFeldpauschCred975 ?? 0}");
        }

        return csv.ToString();
    }

    private static string EscapeCsvField(string? field)
    {
        if (string.IsNullOrEmpty(field)) return "";
        return field.Contains(',') ? $"\"{field}\"" : field;
    }

    private static async Task<byte[]> CreateZipFile(string content, string format)
    {
        using var memoryStream = new MemoryStream();

        using (var archive = new ZipArchive(memoryStream, ZipArchiveMode.Create, true))
        {
            var dataFileName = format == "geojson" ? "plots.json" : "plots.csv";
            var dataEntry = archive.CreateEntry(dataFileName);
            using (var entryStream = dataEntry.Open())
            using (var writer = new StreamWriter(entryStream, Encoding.UTF8))
            {
                await writer.WriteAsync(content);
            }

            var termsPdfPath = Path.Combine(
                AppDomain.CurrentDomain.BaseDirectory,
                "Source",
                "GEOTREES_TermsConditions_1.2.pdf");

            if (File.Exists(termsPdfPath))
            {
                var pdfEntry = archive.CreateEntry("GEOTREES_TermsConditions_1.2.pdf");
                using var entryStream = pdfEntry.Open();
                using var fileStream = File.OpenRead(termsPdfPath);
                await fileStream.CopyToAsync(entryStream);
            }
        }

        return memoryStream.ToArray();
    }
}
