using System;
using Volo.Abp.Application.Dtos;

namespace IIASA.GeoTrees.Services.Dtos.Plots;

public class PlotDto : AuditedEntityDto<Guid>
{
    public string? PlotId { get; set; }
    public string SubPlotId { get; set; } = null!;
    public string? CountryName { get; set; }
    public string? Network { get; set; }
    public string? Institution { get; set; }
    public string? Link { get; set; }
    public int? YearEstablished { get; set; }
    public int? YearCensus { get; set; }
    public string? PiTeam { get; set; }
    public string? Reference { get; set; }
    public bool Confidential { get; set; }
    public string? OtherMeasurements { get; set; }
    public string? RoundLocation { get; set; }
    public string? BiomassProcessingProtocol { get; set; }
    public int Version { get; set; }
    public double? Altitude { get; set; }
    public double? SlopeDegree { get; set; }
    public double? PlotArea { get; set; }
    public double? SubPlotArea { get; set; }
    public string? PlotShape { get; set; }
    public string? ForestStatus { get; set; }
    public double? MinDbh { get; set; }
    public double? HLoreyLocal { get; set; }
    public double? HLoreyChave { get; set; }
    public double? HLoreyFeldpausch { get; set; }
    public double? HMaxLocal { get; set; }
    public double? HMaxChave { get; set; }
    public double? HMaxFeldpausch { get; set; }
    public double? AgbLocal { get; set; }
    public double? AgbLocalCred25 { get; set; }
    public double? AgbLocal975 { get; set; }
    public double? AgbFeldpausch { get; set; }
    public double? AgbFeldpauschCred25 { get; set; }
    public double? AgbFeldpauschCred975 { get; set; }
    public double? AgbChave { get; set; }
    public double? AgbChaveCred25 { get; set; }
    public double? AgbChaveCred975 { get; set; }
    public double? WoodDensity { get; set; }
    public double? Gsv { get; set; }
    public double? Ba { get; set; }
    public double? Ndens { get; set; }
    public string? Status { get; set; }
}
