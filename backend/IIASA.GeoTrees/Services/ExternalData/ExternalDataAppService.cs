using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Volo.Abp;
using Volo.Abp.Application.Services;

namespace IIASA.GeoTrees.Services.ExternalData;

[AllowAnonymous]
public class ExternalDataAppService : ApplicationService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;

    public ExternalDataAppService(
        IHttpClientFactory httpClientFactory,
        IConfiguration configuration
    )
    {
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
    }

    public async Task<object> GetGoogleSheetGeoJsonAsync()
    {
        var googleSheetCsvUrl = _configuration["ExternalData:GoogleSheetCsvUrl"];
        if (string.IsNullOrWhiteSpace(googleSheetCsvUrl))
        {
            throw new UserFriendlyException("Google Sheet CSV URL is not configured.");
        }

        var client = _httpClientFactory.CreateClient();
        var csv = await client.GetStringAsync(googleSheetCsvUrl);

        var reader = new System.IO.StringReader(csv);
        var features = new List<object>();
        var headers = new List<string>();

        using (var csvReader = new CsvHelper.CsvReader(reader, CultureInfo.InvariantCulture))
        {
            if (csvReader.Read())
            {
                csvReader.ReadHeader();
                headers = csvReader
                    .HeaderRecord!.Take(12)
                    .Select(h => h.Trim().Replace("\"", ""))
                    .ToList();
            }

            int latIdx = headers.FindIndex(h =>
                h.Equals("latitude", StringComparison.OrdinalIgnoreCase)
            );
            int lngIdx = headers.FindIndex(h =>
                h.Equals("longitude", StringComparison.OrdinalIgnoreCase)
            );

            if (latIdx == -1 || lngIdx == -1)
            {
                throw new UserFriendlyException(
                    "Latitude or Longitude column not found in the CSV data."
                );
            }

            var propertyTranslations = new Dictionary<string, string>(
                StringComparer.OrdinalIgnoreCase
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

            while (csvReader.Read())
            {
                var row = new List<string>();
                for (int i = 0; i < headers.Count; i++)
                    row.Add(csvReader.GetField(i) ?? string.Empty);

                if (
                    double.TryParse(
                        row[latIdx],
                        NumberStyles.Any,
                        CultureInfo.InvariantCulture,
                        out var lat
                    )
                    && double.TryParse(
                        row[lngIdx],
                        NumberStyles.Any,
                        CultureInfo.InvariantCulture,
                        out var lng
                    )
                )
                {
                    var properties = new Dictionary<string, object>();
                    for (int j = 0; j < headers.Count; j++)
                    {
                        if (j != latIdx && j != lngIdx)
                        {
                            var key = headers[j];
                            var translatedKey = propertyTranslations.TryGetValue(
                                key,
                                out var translated
                            )
                                ? translated
                                : key;
                            properties[translatedKey] = row[j];
                        }
                    }

                    features.Add(
                        new
                        {
                            type = "Feature",
                            geometry = new { type = "Point", coordinates = new[] { lng, lat } },
                            properties,
                        }
                    );
                }
                else
                {
                    Logger.LogWarning(
                        "Skipping line: invalid lat/lng values (lat: {Lat}, lng: {Lng})",
                        row[latIdx],
                        row[lngIdx]
                    );
                }
            }
        }

        return new { type = "FeatureCollection", features };
    }
}
