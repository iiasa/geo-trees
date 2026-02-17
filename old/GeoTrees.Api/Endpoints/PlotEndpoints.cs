namespace GeoTrees.Api.Endpoints;

using System.IO.Compression;
using System.Text;
using GeoTrees.Api.Data;
using GeoTrees.Api.DTOs;
using GeoTrees.Api.Entities;
using GeoTrees.Api.Mappings;
using GeoTrees.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Features;
using NetTopologySuite.Geometries;

public static class PlotEndpoints
{
    public static void MapPlotEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/plots").WithTags("Plot").WithOpenApi();

        group
            .MapGet("/", GetAllPlots)
            .WithName("GetAllPlots")
            .WithSummary("Retrieve a paginated list of forest plots")
            .WithDescription(
                "Returns a paginated list of forest plots with metadata. Use pageNumber and pageSize query parameters to control pagination. Default page size is 10."
            )
            .Produces<PaginatedResponse<PlotDto>>(200)
            .ProducesProblem(500)
            .Produces(400)
            .RequireAuthorization()
            .CacheOutput(policy => policy.Expire(TimeSpan.FromMinutes(10)));

        group
            .MapGet("/{id:int}", GetPlotById)
            .WithName("GetPlotById")
            .WithSummary("Retrieve detailed information about a specific forest plot")
            .WithDescription(
                "Returns comprehensive metadata for a forest plot based on its internal database ID, including location, measurements, and institutional data."
            )
            .Produces<PlotDto>(200)
            .ProducesProblem(500)
            .Produces(404)
            .RequireAuthorization()
            .CacheOutput(policy => policy.Expire(TimeSpan.FromMinutes(10)));

        group
            .MapGet("/by-plot-id/{plotId}", GetPlotByPlotId)
            .WithName("GetPlotByPlotId")
            .WithSummary("Retrieve a forest plot using its external Plot_ID")
            .WithDescription(
                "Returns plot details using the external Plot_ID identifier. This is the preferred method for external systems to retrieve plot information."
            )
            .Produces<PlotDto>(200)
            .ProducesProblem(500)
            .Produces(404)
            .RequireAuthorization()
            .CacheOutput(policy => policy.Expire(TimeSpan.FromMinutes(10)));

        group
            .MapPost("/", CreatePlot)
            .WithName("CreatePlot")
            .WithSummary("Create a new forest plot entry")
            .WithDescription(
                "Creates a new forest plot with the provided metadata. Requires authentication. The Plot_ID must be unique across the system. Returns the created plot data including the assigned internal ID."
            )
            .RequireAuthorization()
            .Produces<PlotDto>(201)
            .ProducesProblem(500)
            .Produces(409);

        group
            .MapPut("/{id:int}", UpdatePlot)
            .WithName("UpdatePlot")
            .WithSummary("Update an existing forest plot's information")
            .WithDescription(
                "Updates the metadata of an existing forest plot. Requires authentication. All fields in the request body will override existing values. Returns the updated plot data."
            )
            .RequireAuthorization()
            .Produces<PlotDto>(200)
            .ProducesProblem(500)
            .Produces(404);

        group
            .MapDelete("/{id:int}", DeletePlot)
            .WithName("DeletePlot")
            .WithSummary("Delete a forest plot entry")
            .WithDescription(
                "Permanently removes a forest plot from the system. Requires authentication. This action cannot be undone."
            )
            .RequireAuthorization()
            .Produces<string>(200)
            .ProducesProblem(500)
            .Produces(404);

        group
            .MapGet("/download", DownloadPlots)
            .WithName("DownloadPlot")
            .WithSummary("Download forest plots data in specified format")
            .WithDescription(
                "Downloads plot data in either GeoJSON or CSV format as a zip file. The zip file contains the data file and the Geo Trees terms and conditions PDF. The GeoJSON format includes spatial information, while CSV provides tabular data."
            )
            .Produces<byte[]>(200)
            .ProducesProblem(500)
            .Produces(400)
            .RequireAuthorization()
            .CacheOutput(policy => policy.Expire(TimeSpan.FromMinutes(30)));

        group
            .MapGet("/geojson", GetPlotGeoJson)
            .WithName("GetPlotGeoJson")
            .WithSummary("Retrieve all forest plots in GeoJSON format")
            .WithDescription(
                "Returns plots as a GeoJSON FeatureCollection. Optionally filter by status. Each feature includes plot coordinates, boundaries (if available), and associated metadata properties."
            )
            .Produces<string>(200)
            .ProducesProblem(500)
            .Produces(404)
            .CacheOutput(policy => policy.Expire(TimeSpan.FromDays(1)));

        group
            .MapGet("/get-available-countries", GetAvailableCountries)
            .WithName("GetAvailableCountries")
            .WithSummary("Retrieve list of countries with forest plots")
            .WithDescription(
                "Returns an alphabetically sorted array of unique country names where forest plots are located. Useful for filtering and statistics."
            )
            .Produces<string[]>(200)
            .ProducesProblem(500)
            .Produces(404)
            .CacheOutput(policy => policy.Expire(TimeSpan.FromDays(1)));

        group
            .MapGet("/available-versions", GetAvailableVersions)
            .WithName("GetAvailableVersions")
            .WithSummary("Get all available plot versions")
            .WithDescription(
                "Returns a sorted list of all available plot version numbers in the database."
            )
            .Produces<int[]>(200)
            .ProducesProblem(500)
            .CacheOutput(policy => policy.Expire(TimeSpan.FromDays(1)));
    }

    private static async Task<IResult> GetAllPlots(
        GeoTreesDbContext db,
        ILogger<Program> logger,
        int pageNumber = 1,
        int pageSize = 10,
        int? version = null // New optional version parameter
    )
    {
        try
        {
            logger.LogInformation(
                "Retrieving plots with pagination: Page {PageNumber}, Size {PageSize}, Version {Version}",
                pageNumber,
                pageSize,
                version
            );

            if (pageNumber < 1 || pageSize < 1)
            {
                logger.LogWarning(
                    "Invalid pagination parameters: PageNumber={PageNumber}, PageSize={PageSize}",
                    pageNumber,
                    pageSize
                );
                return Results.BadRequest("Invalid pagination parameters");
            }

            var query = db.Plots.AsNoTracking();
            if (version.HasValue)
            {
                query = query.Where(p => p.Version == version.Value);
            }
            query = query.OrderBy(p => p.CreatedAt);
            var totalItems = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .OrderBy(p => p.CreatedAt)
                .Select(p => p.ToDto())
                .ToListAsync();

            var response = new PaginatedResponse<PlotDto>
            {
                Items = items,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalItems = totalItems,
                TotalPages = totalPages,
            };

            logger.LogInformation(
                "Retrieved {Count} plots from page {PageNumber}/{TotalPages} (Version: {Version})",
                items.Count,
                pageNumber,
                totalPages,
                version
            );

            return Results.Ok(response);
        }
        catch (Exception ex)
        {
            logger.LogError(
                ex,
                "Error retrieving plot metadata with pagination: Page {PageNumber}, Size {PageSize}, Version {Version}",
                pageNumber,
                pageSize,
                version
            );
            return Results.Problem("Error retrieving plot metadata", statusCode: 500);
        }
    }

    private static async Task<IResult> GetPlotById(
        int id,
        GeoTreesDbContext db,
        ILogger<Program> logger,
        int? version = null // New optional version parameter
    )
    {
        logger.LogInformation("Retrieving plot with ID {Id} and Version {Version}", id, version);
        try
        {
            Plot? plot;
            if (version.HasValue)
            {
                plot = await db
                    .Plots.AsNoTracking()
                    .FirstOrDefaultAsync(p => p.Id == id && p.Version == version.Value);
            }
            else
            {
                plot = await db.Plots.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);
            }
            return plot is null ? Results.NotFound("Plot not found") : Results.Ok(plot.ToDto());
        }
        catch (Exception ex)
        {
            logger.LogError(
                ex,
                "Error retrieving plot metadata for ID {Id} and Version {Version}",
                id,
                version
            );
            return Results.Problem("Error retrieving plot metadata", statusCode: 500);
        }
    }

    private static async Task<IResult> GetPlotByPlotId(
        string plotId,
        GeoTreesDbContext db,
        ILogger<Program> logger,
        int? version = null // New optional version parameter
    )
    {
        logger.LogInformation(
            "Retrieving plot with Plot_ID {PlotId} and Version {Version}",
            plotId,
            version
        );
        try
        {
            Plot? plot;
            if (version.HasValue)
            {
                plot = await db
                    .Plots.AsNoTracking()
                    .FirstOrDefaultAsync(p => p.PlotId == plotId && p.Version == version.Value);
            }
            else
            {
                plot = await db.Plots.AsNoTracking().FirstOrDefaultAsync(p => p.PlotId == plotId);
            }
            var plotCount = await db
                .Plots.AsNoTracking()
                .CountAsync(p =>
                    p.PlotId == plotId && (!version.HasValue || p.Version == version.Value)
                );
            var subPlotArea = plot?.PlotArea;
            var plotArea = plot?.PlotArea * plotCount;
            if (plot != null)
                plot.PlotArea = plotArea;
            var plotDto = plot?.ToDto();
            if (plotDto != null)
                plotDto.SubPlotArea = subPlotArea;
            return plot is null ? Results.NotFound("Plot not found") : Results.Ok(plotDto);
        }
        catch (Exception ex)
        {
            logger.LogError(
                ex,
                "Error retrieving plot metadata for Plot_ID {PlotId} and Version {Version}",
                plotId,
                version
            );
            return Results.Problem("Error retrieving plot metadata", statusCode: 500);
        }
    }

    private static async Task<IResult> CreatePlot(
        PlotDto plotDto,
        GeoTreesDbContext db,
        ILogger<Program> logger
    )
    {
        logger.LogInformation("Creating new plot with Plot_ID {PlotId}", plotDto.PlotId);
        try
        {
            if (await db.Plots.AnyAsync(p => p.PlotId == plotDto.PlotId))
            {
                return Results.Conflict("Plot ID already exists");
            }

            var createdPlot = new Plot
            {
                PlotId = plotDto.PlotId ?? string.Empty,
                CountryName = plotDto.CountryName ?? string.Empty,
                Network = plotDto.Network ?? string.Empty,
                Institution = plotDto.Institution ?? string.Empty,
                Link = plotDto.Link ?? string.Empty,
                YearEstablished = plotDto.YearEstablished,
                Reference = plotDto.Reference ?? string.Empty,
                Confidential = plotDto.Confidential,
                OtherMeasurements = plotDto.OtherMeasurements ?? string.Empty,
                BiomassProcessingProtocol = plotDto.BiomassProcessingProtocol ?? string.Empty,
                Version = plotDto.Version > 0 ? plotDto.Version : 1, // Apply version from DTO or default to 1
            };

            db.Plots.Add(createdPlot);
            await db.SaveChangesAsync();

            logger.LogInformation("Created new plot with ID {Id}", createdPlot.Id);
            return Results.Created($"/api/plots/{createdPlot.Id}", createdPlot.ToDto());
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error creating plot metadata");
            return Results.Problem("Error creating plot metadata", statusCode: 500);
        }
    }

    private static async Task<IResult> UpdatePlot(
        int id,
        PlotDto plotDto,
        GeoTreesDbContext db,
        ILogger<Program> logger
    )
    {
        logger.LogInformation("Updating plot with ID {Id}", id);
        try
        {
            var Plot = await db.Plots.FindAsync(id);
            if (Plot == null)
                return Results.NotFound("Plot not found");

            // Update properties
            Plot.CountryName = plotDto.CountryName ?? string.Empty;
            Plot.Network = plotDto.Network ?? string.Empty;
            Plot.Institution = plotDto.Institution ?? string.Empty;
            Plot.Link = plotDto.Link ?? string.Empty;
            Plot.YearEstablished = plotDto.YearEstablished;
            Plot.PiTeam = plotDto.PITeam ?? string.Empty;
            Plot.Reference = plotDto.Reference ?? string.Empty;
            Plot.Confidential = plotDto.Confidential;
            Plot.OtherMeasurements = plotDto.OtherMeasurements ?? string.Empty;
            Plot.BiomassProcessingProtocol = plotDto.BiomassProcessingProtocol ?? string.Empty;

            await db.SaveChangesAsync();
            logger.LogInformation("Updated plot with ID {Id}", Plot.Id);
            return Results.Ok(Plot.ToDto());
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error updating plot metadata for ID {Id}", id);
            return Results.Problem("Error updating plot metadata", statusCode: 500);
        }
    }

    private static async Task<IResult> DeletePlot(
        int id,
        GeoTreesDbContext db,
        ILogger<Program> logger
    )
    {
        logger.LogInformation("Deleting plot with ID {Id}", id);
        try
        {
            var Plot = await db.Plots.FindAsync(id);
            if (Plot == null)
                return Results.NotFound("Plot not found");

            db.Plots.Remove(Plot);
            await db.SaveChangesAsync();
            logger.LogInformation("Deleted plot with ID {Id}", id);
            return Results.Ok("Plot deleted successfully");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error deleting plot metadata for ID {Id}", id);
            return Results.Problem("Error deleting plot metadata", statusCode: 500);
        }
    }

    private static async Task<IResult> GetPlotGeoJson(
        GeoTreesDbContext db,
        ILogger<Program> logger,
        string? status = null
    )
    {
        logger.LogInformation(
            "Retrieving plots as GeoJSON with status filter: {Status}",
            status ?? "all"
        );
        try
        {
            var query = db.Plots.AsNoTracking();

            if (!string.IsNullOrWhiteSpace(status))
            {
                query = query.Where(p => p.Status == status);
            }

            var plots = await query.ToListAsync();

            if (!plots.Any())
            {
                return Results.NotFound("No plots found");
            }

            var featureCollection = new FeatureCollection();

            foreach (var plot in plots)
            {
                var feature = new Feature(
                    new Point(new Coordinate((double)plot.LonCnt!, (double)plot.LatCnt!)),
                    new AttributesTable
                    {
                        { "Plot_ID", plot.PlotId },
                        { "Network", plot.Network },
                        { "CensusYear", plot.YearCensus },
                        { "YearEstablished", plot.YearEstablished },
                        { "AGB", plot.AgbChave },
                        { "Status", plot.Status },
                        { "SubPlot_Id", plot.SubPlotId },
                    }
                );

                var coordinates = new Coordinate[5];

                if (
                    plot.LatNe != null
                    && plot.LonNe != null
                    && plot.LatNw != null
                    && plot.LonNw != null
                    && plot.LatSe != null
                    && plot.LonSe != null
                    && plot.LatSw != null
                    && plot.LonSw != null
                )
                {
                    coordinates[0] = new Coordinate((double)plot.LonNw!, (double)plot.LatNw!);
                    coordinates[1] = new Coordinate((double)plot.LonNe!, (double)plot.LatNe!);
                    coordinates[2] = new Coordinate((double)plot.LonSe!, (double)plot.LatSe!);
                    coordinates[3] = new Coordinate((double)plot.LonSw!, (double)plot.LatSw!);
                    coordinates[4] = new Coordinate((double)plot.LonNw!, (double)plot.LatNw!);
                    var factory = new GeometryFactory();
                    var polygon = factory.CreatePolygon(new LinearRing(coordinates));
                    feature.Geometry = polygon;
                }
                featureCollection.Add(feature);
            }
            return Results.Ok(featureCollection);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error retrieving plots as GeoJSON");
            return Results.Problem("Error retrieving plots as GeoJSON", statusCode: 500);
        }
    }

    private static async Task<IResult> GetAvailableCountries(
        GeoTreesDbContext db,
        ILogger<Program> logger
    )
    {
        logger.LogInformation("Retrieving available countries");
        try
        {
            var countries = await db
                .Plots.AsNoTracking()
                .Select(p => p.CountryName)
                .Distinct()
                .OrderBy(c => c)
                .ToArrayAsync();

            return Results.Ok(countries);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error retrieving available countries");
            return Results.Problem("Error retrieving available countries", statusCode: 500);
        }
    }

    private static async Task<IResult> DownloadPlots(
        GeoTreesDbContext db,
        HttpContext httpContext,
        string format,
        string purpose,
        string email,
        string name,
        string country,
        ILogger<Program> logger
    )
    {
        if (string.IsNullOrWhiteSpace(country))
        {
            return Results.BadRequest("Country is required");
        }

        logger.LogInformation(
            "Downloading plots with intended use {IntendedUse}, download type {DownloadType}, and country filter {Country}",
            purpose,
            format,
            country
        );

        if (format != "geojson" && format != "csv")
        {
            return Results.BadRequest("Invalid download type");
        }

        if (string.IsNullOrEmpty(purpose))
        {
            return Results.BadRequest("Intended use is required");
        }

        try
        {
            var query = db.Plots.AsNoTracking();

            // Only apply country filter if not "all"
            if (!country.Equals("all", StringComparison.OrdinalIgnoreCase))
            {
                query = query.Where(p => p.CountryName == country);
            }

            var plots = await query.ToListAsync();

            if (!plots.Any())
            {
                var message = country.Equals("all", StringComparison.OrdinalIgnoreCase)
                    ? "No plots found"
                    : $"No plots found for country: {country}";
                return Results.NotFound(message);
            }

            var content = format switch
            {
                "geojson" => GenerateGeoJson(plots),
                "csv" => GenerateCsv(plots),
                _ => throw new ArgumentException("Invalid download type"),
            };

            var ipAddress = httpContext.Connection.RemoteIpAddress?.ToString();
            var userAgent = httpContext.Request.Headers.UserAgent.ToString();
            var origin = httpContext.Request.Headers.Origin.ToString();
            var referer = httpContext.Request.Headers.Referer.ToString();
            var download = new Download
            {
                Email = email,
                Name = name,
                Purpose = purpose,
                Format = format,
                IpAddress = ipAddress ?? string.Empty,
                UserAgent = userAgent ?? string.Empty,
                Origin = origin ?? string.Empty,
                Referer = referer ?? string.Empty,
            };

            db.Downloads.Add(download);

            await db.SaveChangesAsync();

            // Create zip file with data and terms PDF
            var zipBytes = await CreateZipFile(content, format, logger);

            var fileName = $"plots_{DateTime.UtcNow:yyyyMMdd}_{format}.zip";

            return Results.File(zipBytes, "application/zip", fileName);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error downloading plots");
            return Results.Problem("Error downloading plots", statusCode: 500);
        }
    }

    private static async Task<byte[]> CreateZipFile(
        string content,
        string format,
        ILogger<Program> logger
    )
    {
        using var memoryStream = new MemoryStream();

        using (var archive = new ZipArchive(memoryStream, ZipArchiveMode.Create, true))
        {
            // Add the data file
            var dataFileName = format == "geojson" ? "plots.json" : "plots.csv";
            var dataEntry = archive.CreateEntry(dataFileName);
            using (var entryStream = dataEntry.Open())
            using (var writer = new StreamWriter(entryStream, Encoding.UTF8))
            {
                await writer.WriteAsync(content);
            }

            // Add the terms PDF
            var termsPdfPath = Path.Combine(
                AppDomain.CurrentDomain.BaseDirectory,
                "Source",
                "GEOTREES_TermsConditions_1.2.pdf"
            );
            if (File.Exists(termsPdfPath))
            {
                var pdfEntry = archive.CreateEntry("GEOTREES_TermsConditions_1.2.pdf");
                using (var entryStream = pdfEntry.Open())
                using (var fileStream = File.OpenRead(termsPdfPath))
                {
                    await fileStream.CopyToAsync(entryStream);
                }
                logger.LogInformation("Added terms PDF to zip file");
            }
            else
            {
                logger.LogWarning("Terms PDF file not found at path: {Path}", termsPdfPath);
            }
        }

        return memoryStream.ToArray();
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
        return System.Text.Json.JsonSerializer.Serialize(geoJson);
    }

    private static string GenerateCsv(List<Plot> plots)
    {
        var csv = new StringBuilder();

        // Header
        csv.AppendLine(
            "Plot_ID,CountryName,Network,Institution,Link,YearEstablished,YearCensus,"
                + "PITeam,Reference,Confidential,OtherMeasurements,BiomassProcessingProtocol,Status,SubPlot_Id,"
                + "AGB_Chave,Lat_Cnt,Lon_Cnt,Lat_NE,Lon_NE,Lat_NW,Lon_NW,Lat_SE,Lon_SE,Lat_SW,Lon_SW,"
                + "Altitude,SlopeDegree,PlotArea,AGBChaveCred25,AGBChaveCred975,WoodDensity,GSV,BA,NDens,"
                + "PlotShape,ForestStatus,MinDBH,HLoreyLocal,HLoreyChave,HLoreyFeldpausch,HMaxLocal,"
                + "HMaxChave,HMaxFeldpausch,AGBLocal,AGBLocalCred25,AGBLocal975,AGBFeldpausch,"
                + "AGBFeldpauschCred25,AGBFeldpauschCred975"
        );

        // Data rows
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
                    + $"{plot.AgbFeldpauschCred975 ?? 0}"
            );
        }

        return csv.ToString();
    }

    private static string EscapeCsvField(string? field)
    {
        if (string.IsNullOrEmpty(field))
            return "";
        return field.Contains(',') ? $"\"{field}\"" : field;
    }

    private static async Task<IResult> GetAvailableVersions(
        GeoTreesDbContext db,
        ILogger<Program> logger
    )
    {
        logger.LogInformation("Retrieving all available plot versions");
        try
        {
            var versions = await db
                .Plots.AsNoTracking()
                .Select(p => p.Version)
                .Distinct()
                .OrderBy(v => v)
                .ToArrayAsync();
            return Results.Ok(versions);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error retrieving available plot versions");
            return Results.Problem("Error retrieving available plot versions", statusCode: 500);
        }
    }
}
