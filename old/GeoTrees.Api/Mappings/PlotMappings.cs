using GeoTrees.Api.DTOs;
using GeoTrees.Api.Entities;

namespace GeoTrees.Api.Mappings;

public static class PlotMappings
{
    public static PlotDto ToDto(this Plot plot)
    {
        return new PlotDto
        {
            Id = plot.Id,
            PlotId = plot.PlotId,
            SubPlotId = plot.SubPlotId,
            CountryName = plot.CountryName,
            Network = plot.Network,
            Institution = plot.Institution,
            Link = plot.Link,
            YearEstablished = plot.YearEstablished,
            YearCensus = plot.YearCensus,
            PITeam = plot.PiTeam,
            Reference = plot.Reference,
            Confidential = plot.Confidential,
            OtherMeasurements = plot.OtherMeasurements,
            BiomassProcessingProtocol = plot.BiomassProcessingProtocol,
            Altitude = plot.Altitude,
            SlopeDegree = plot.SlopeDegree,
            PlotArea = plot.PlotArea,
            PlotShape = plot.PlotShape,
            ForestStatus = plot.ForestStatus,
            MinDbh = plot.MinDbh,
            HLoreyLocal = plot.HLoreyLocal,
            HLoreyChave = plot.HLoreyChave,
            AgbChave = plot.AgbChave,
            WoodDensity = plot.WoodDensity,
            Gsv = plot.Gsv,
            Ba = plot.Ba,
            Ndens = plot.Ndens,
            Status = plot.Status,
            AgbFeldpausch = plot.AgbFeldpausch,
            AgbLocal = plot.AgbLocal,
            HLoreyFeldpausch = plot.HLoreyFeldpausch,
            HMaxLocal = plot.HMaxLocal,
            HMaxChave = plot.HMaxChave,
            HMaxFeldpausch = plot.HMaxFeldpausch,
            RoundLocation = $"{plot.LatCnt}, {plot.LonCnt}",
            Version = plot.Version,
        };
    }
}
