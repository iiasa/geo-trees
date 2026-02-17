using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace GeoTrees.Api.Endpoints
{
    public static class ExternalDataEndpoint
    {
        public static void MapExternalDataEndpoint(this IEndpointRouteBuilder routes)
        {
            var group = routes.MapGroup("/api/external").WithTags("ExternalData").WithOpenApi();

            group
                .MapGet("/google-sheet-geojson", GetGoogleSheetGeoJson)
                .WithName("GetGoogleSheetGeoJson")
                .WithSummary("Retrieve data from Google Sheet and return as GeoJSON")
                .WithDescription(
                    "Fetches data from a public Google Sheet, expects lat/lng columns, and returns a GeoJSON FeatureCollection."
                )
                .ProducesProblem(500)
                .CacheOutput(policy => policy.Expire(TimeSpan.FromDays(1)))
                .AllowAnonymous();
        }

        private static async Task<IResult> GetGoogleSheetGeoJson(
            [FromServices] IHttpClientFactory httpClientFactory,
            [FromServices] ILogger<Program> logger
        )
        {
            var googleSheetCsvUrl =
                "https://docs.google.com/spreadsheets/d/16qusGlajdZwqx6lX_RIxuWoxmiQqhxf-Guzwe4hI538/gviz/tq?tqx=out:csv&sheet=Datas";
            try
            {
                logger.LogInformation("Fetching CSV from: {Url}", googleSheetCsvUrl);
                var client = httpClientFactory.CreateClient();
                var csv = await client.GetStringAsync(googleSheetCsvUrl);
                logger.LogInformation(
                    "CSV content (first 500 chars): {Csv}",
                    csv.Length > 500 ? csv.Substring(0, 500) : csv
                );
                // Use a CSV parser to handle quoted fields and non-English data
                var reader = new System.IO.StringReader(csv);
                var features = new List<object>();
                var headers = new List<string>();
                using (
                    var csvReader = new CsvHelper.CsvReader(
                        reader,
                        System.Globalization.CultureInfo.InvariantCulture
                    )
                )
                {
                    if (csvReader.Read())
                    {
                        csvReader.ReadHeader();
                        headers = csvReader
                            .HeaderRecord.Take(12)
                            .Select(h => h.Trim().Replace("\"", ""))
                            .ToList();
                        logger.LogInformation(
                            "CSV headers: {Headers}",
                            string.Join(" | ", headers)
                        );
                    }
                    int latIdx = headers.FindIndex(h => h.ToLower() == "latitude");
                    int lngIdx = headers.FindIndex(h => h.ToLower() == "longitude");
                    logger.LogInformation(
                        "Latitude index: {LatIdx}, Longitude index: {LngIdx}",
                        latIdx,
                        lngIdx
                    );
                    if (latIdx == -1 || lngIdx == -1)
                    {
                        logger.LogWarning("Latitude or Longitude column not found");
                        return Results.Problem(
                            "Latitude or Longitude column not found in the CSV data.",
                            statusCode: 400
                        );
                    }
                    while (csvReader.Read())
                    {
                        var row = new List<string>();
                        for (int i = 0; i < headers.Count; i++)
                            row.Add(csvReader.GetField(i));
                        if (
                            double.TryParse(
                                row[latIdx],
                                System.Globalization.NumberStyles.Any,
                                System.Globalization.CultureInfo.InvariantCulture,
                                out var lat
                            )
                            && double.TryParse(
                                row[lngIdx],
                                System.Globalization.NumberStyles.Any,
                                System.Globalization.CultureInfo.InvariantCulture,
                                out var lng
                            )
                        )
                        {
                            var properties = new Dictionary<string, object>();
                            // Translate French property keys to English for GeoJSON
                            var propertyTranslations = new Dictionary<string, string>(
                                System.StringComparer.OrdinalIgnoreCase
                            )
                            {
                                { "Geotrees_Back-CARTO", "Site" },
                                { "Descriptif de la station", "SiteDescription" },
                                { "Nom du pays", "Country" },
                                { "Statut (réalisé / en cours / futur)", "Status" },
                                { "Si réalisé, précision de l'année", "YearPrecision" },
                                { "URL du site de la station", "SiteURL" },
                                { "Mesures ALS (1/0)", "ALS_Measurements" },
                                { "Mesures TLS (1/0)", "TLS_Measurements" },
                                { "Inventaire forestier (1/0)", "ForestInventory" },
                            };
                            for (int j = 0; j < headers.Count; j++)
                            {
                                if (j != latIdx && j != lngIdx)
                                {
                                    var key = headers[j];
                                    var translatedKey = propertyTranslations.ContainsKey(key)
                                        ? propertyTranslations[key]
                                        : key;
                                    properties[translatedKey] = row[j];
                                }
                            }
                            features.Add(
                                new
                                {
                                    type = "Feature",
                                    geometry = new
                                    {
                                        type = "Point",
                                        coordinates = new[] { lng, lat },
                                    },
                                    properties = properties,
                                }
                            );
                        }
                        else
                        {
                            logger.LogWarning(
                                "Skipping line: invalid lat/lng values (lat: {Lat}, lng: {Lng})",
                                row[latIdx],
                                row[lngIdx]
                            );
                        }
                    }
                }
                logger.LogInformation("GeoJSON features count: {Count}", features.Count);
                var geoJson = new { type = "FeatureCollection", features = features };
                var geoJsonString = JsonSerializer.Serialize(geoJson);
                return Results.Content(geoJsonString, "application/geo+json");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error retrieving or processing Google Sheet data");
                return Results.Problem(
                    $"Error retrieving or processing Google Sheet data: {ex.Message}",
                    statusCode: 500
                );
            }
        }
    }
}
