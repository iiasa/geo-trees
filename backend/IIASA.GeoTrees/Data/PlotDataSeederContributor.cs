using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Threading.Tasks;
using IIASA.GeoTrees.Entities.Plots;
using Microsoft.Extensions.Logging;
using OfficeOpenXml;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Guids;

namespace IIASA.GeoTrees.Data;

public class PlotDataSeederContributor : IDataSeedContributor, ITransientDependency
{
    private readonly IRepository<Plot, Guid> _plotRepository;
    private readonly IGuidGenerator _guidGenerator;
    private readonly ILogger<PlotDataSeederContributor> _logger;

    public PlotDataSeederContributor(
        IRepository<Plot, Guid> plotRepository,
        IGuidGenerator guidGenerator,
        ILogger<PlotDataSeederContributor> logger
    )
    {
        _plotRepository = plotRepository;
        _guidGenerator = guidGenerator;
        _logger = logger;
    }

    public async Task SeedAsync(DataSeedContext context)
    {
        if (await _plotRepository.GetCountAsync() > 0)
        {
            return;
        }

        var excelFilePath = Path.Combine(
            AppDomain.CurrentDomain.BaseDirectory,
            "Source",
            "plot_data.xlsx"
        );

        if (!File.Exists(excelFilePath))
        {
            _logger.LogWarning("Plot data Excel file not found at: {Path}", excelFilePath);
            return;
        }

        ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

        try
        {
            using var package = new ExcelPackage(new FileInfo(excelFilePath));
            var worksheet = package.Workbook.Worksheets[0];

            if (!IsValidExcelFile(worksheet))
            {
                _logger.LogError("Invalid Excel file format or missing required columns");
                return;
            }

            var plots = new List<Plot>();
            int rowCount = worksheet.Dimension.Rows;
            var headerRow = worksheet.Cells[1, 1, 1, worksheet.Dimension.Columns];
            var columnMappings = CreateColumnMappings(headerRow);

            for (int row = 2; row <= rowCount; row++)
            {
                var plot = new Plot(_guidGenerator.Create())
                {
                    PlotId =
                        GetCellValue(worksheet, row, columnMappings["Plot_ID"]) ?? string.Empty,
                    SubPlotId =
                        GetCellValue(worksheet, row, columnMappings["Sub-plot_ID"]) ?? string.Empty,
                    CountryName =
                        GetCellValue(worksheet, row, columnMappings["Country_Name"])
                        ?? string.Empty,
                    Network = GetCellValue(worksheet, row, columnMappings["Network"]),
                    Institution = GetCellValue(worksheet, row, columnMappings["Institution"]),
                    Link = GetCellValue(worksheet, row, columnMappings["Link"]),
                    YearEstablished = ParseIntOrNull(
                        GetCellValue(worksheet, row, columnMappings["Year_Established"])
                    ),
                    YearCensus = ParseIntOrNull(
                        GetCellValue(worksheet, row, columnMappings["Year_Census"])
                    ),
                    PiTeam = GetCellValue(worksheet, row, columnMappings["PI_team"]),
                    Confidential = ParseYesNo(
                        GetCellValue(worksheet, row, columnMappings["Confidential"])
                    ),
                    LatCnt = ParseDoubleOrNull(
                        GetCellValue(worksheet, row, columnMappings["Lat_cnt"])
                    ),
                    LonCnt = ParseDoubleOrNull(
                        GetCellValue(worksheet, row, columnMappings["Lon_cnt"])
                    ),
                    LatSw = ParseDoubleOrNull(
                        GetCellValue(worksheet, row, columnMappings["Lat_sw"])
                    ),
                    LonSw = ParseDoubleOrNull(
                        GetCellValue(worksheet, row, columnMappings["Lon_sw"])
                    ),
                    LatNw = ParseDoubleOrNull(
                        GetCellValue(worksheet, row, columnMappings["Lat_nw"])
                    ),
                    LonNw = ParseDoubleOrNull(
                        GetCellValue(worksheet, row, columnMappings["Lon_nw"])
                    ),
                    LatSe = ParseDoubleOrNull(
                        GetCellValue(worksheet, row, columnMappings["Lat_se"])
                    ),
                    LonSe = ParseDoubleOrNull(
                        GetCellValue(worksheet, row, columnMappings["Lon_se"])
                    ),
                    LatNe = ParseDoubleOrNull(
                        GetCellValue(worksheet, row, columnMappings["Lat_ne"])
                    ),
                    LonNe = ParseDoubleOrNull(
                        GetCellValue(worksheet, row, columnMappings["Lon_ne"])
                    ),
                    PlotArea = ParseDoubleOrNull(
                        GetCellValue(worksheet, row, columnMappings["Plot_area"])
                    ),
                    AgbChave = ParseDoubleOrNull(
                        GetCellValue(worksheet, row, columnMappings["AGB_Chave"])
                    ),
                    AgbChaveCred25 = ParseDoubleOrNull(
                        GetCellValue(worksheet, row, columnMappings["AGB_ChaveCred_2.5"])
                    ),
                    AgbChaveCred975 = ParseDoubleOrNull(
                        GetCellValue(worksheet, row, columnMappings["AGB_ChaveCred_97.5"])
                    ),
                    AgbFeldpausch = ParseDoubleOrNull(
                        GetCellValue(worksheet, row, columnMappings["AGB_Feldpausch"])
                    ),
                    AgbFeldpauschCred25 = ParseDoubleOrNull(
                        GetCellValue(worksheet, row, columnMappings["AGB_Feldpausch_Cred_2.5"])
                    ),
                    AgbFeldpauschCred975 = ParseDoubleOrNull(
                        GetCellValue(worksheet, row, columnMappings["AGB_Feldpausch_Cred_97.5"])
                    ),
                    AgbLocal = ParseDoubleOrNull(
                        GetCellValue(worksheet, row, columnMappings["AGB_local"])
                    ),
                    AgbLocalCred25 = ParseDoubleOrNull(
                        GetCellValue(worksheet, row, columnMappings["AGB_local_Cred_2.5"])
                    ),
                    AgbLocal975 = ParseDoubleOrNull(
                        GetCellValue(worksheet, row, columnMappings["AGB_local_97.5"])
                    ),
                    Altitude = ParseDoubleOrNull(
                        GetCellValue(worksheet, row, columnMappings["Altitude"])
                    ),
                    BiomassProcessingProtocol = GetCellValue(
                        worksheet,
                        row,
                        columnMappings["Biomass_processing_protocol"]
                    ),
                    ForestStatus = GetCellValue(worksheet, row, columnMappings["Forest_status"]),
                    Ba = ParseDoubleOrNull(GetCellValue(worksheet, row, columnMappings["Ba"])),
                    Gsv = ParseDoubleOrNull(GetCellValue(worksheet, row, columnMappings["Gsv"])),
                    HLoreyChave = ParseDoubleOrNull(
                        GetCellValue(worksheet, row, columnMappings["H_Lorey_Chave"])
                    ),
                    HLoreyFeldpausch = ParseDoubleOrNull(
                        GetCellValue(worksheet, row, columnMappings["H_Lorey_Feldpausch"])
                    ),
                    HLoreyLocal = ParseDoubleOrNull(
                        GetCellValue(worksheet, row, columnMappings["H_Lorey_local"])
                    ),
                    HMaxChave = ParseDoubleOrNull(
                        GetCellValue(worksheet, row, columnMappings["H_max_Chave"])
                    ),
                    HMaxFeldpausch = ParseDoubleOrNull(
                        GetCellValue(worksheet, row, columnMappings["H_max_Feldpausch"])
                    ),
                    HMaxLocal = ParseDoubleOrNull(
                        GetCellValue(worksheet, row, columnMappings["H_max_Local"])
                    ),
                    MinDbh = ParseDoubleOrNull(
                        GetCellValue(worksheet, row, columnMappings["Min_DBH"])
                    ),
                    Ndens = ParseDoubleOrNull(
                        GetCellValue(worksheet, row, columnMappings["Ndens"])
                    ),
                    OtherMeasurements = GetCellValue(
                        worksheet,
                        row,
                        columnMappings["Other_measurements"]
                    ),
                    PlotShape = GetCellValue(worksheet, row, columnMappings["Plot_shape"]),
                    Reference = GetCellValue(worksheet, row, columnMappings["Reference"]),
                    SlopeDegree = ParseDoubleOrNull(
                        GetCellValue(worksheet, row, columnMappings["Slope_degree"])
                    ),
                    Status = GetCellValue(worksheet, row, columnMappings["Status"]),
                    WoodDensity = ParseDoubleOrNull(
                        GetCellValue(worksheet, row, columnMappings["Wood_density"])
                    ),
                };

                plots.Add(plot);
            }

            _logger.LogInformation("Found {Count} records in Excel file", plots.Count);

            await _plotRepository.InsertManyAsync(plots, autoSave: true);

            _logger.LogInformation("Successfully seeded {Count} plot records", plots.Count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding plot data from Excel file");
        }
    }

    private bool IsValidExcelFile(ExcelWorksheet worksheet)
    {
        var expectedColumns = new[] { "Plot_ID", "Country_Name", "Lat_cnt", "Lon_cnt" };
        var headerRow = worksheet.Cells[1, 1, 1, worksheet.Dimension.Columns];

        foreach (var column in expectedColumns)
        {
            bool found = false;
            foreach (var cell in headerRow)
            {
                if (cell.Text.Trim().Equals(column, StringComparison.OrdinalIgnoreCase))
                {
                    found = true;
                    break;
                }
            }

            if (!found)
            {
                _logger.LogError("Missing required column: {Column}", column);
                return false;
            }
        }

        return true;
    }

    private static Dictionary<string, int> CreateColumnMappings(ExcelRange headerRow)
    {
        var mappings = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
        int column = 1;
        foreach (var cell in headerRow)
        {
            mappings[cell.Text.Trim()] = column++;
        }
        return mappings;
    }

    private static string? GetCellValue(ExcelWorksheet worksheet, int row, int column)
    {
        var cell = worksheet.Cells[row, column];
        if (cell.Value == null)
            return null;
        return cell.Value is double number
            ? number.ToString(CultureInfo.InvariantCulture)
            : cell.Text;
    }

    private static int? ParseIntOrNull(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return null;
        return int.TryParse(value, out int result) ? result : null;
    }

    private static double? ParseDoubleOrNull(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return null;
        return double.TryParse(
            value,
            NumberStyles.Any,
            CultureInfo.InvariantCulture,
            out double result
        )
            ? result
            : null;
    }

    private static bool ParseYesNo(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return false;
        return value.Trim().Equals("yes", StringComparison.OrdinalIgnoreCase);
    }
}
