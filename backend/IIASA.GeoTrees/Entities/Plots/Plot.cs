using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace IIASA.GeoTrees.Entities.Plots;

public class Plot : AuditedAggregateRoot<Guid>
{
    public Plot() { }

    public Plot(Guid id)
        : base(id) { }

    public string PlotId { get; set; } = null!;
    public string SubPlotId { get; set; } = null!;
    public string CountryName { get; set; } = null!;
    public string? Network { get; set; }
    public string? Institution { get; set; }
    public string? Link { get; set; }
    public int? YearEstablished { get; set; }
    public int? YearCensus { get; set; }
    public string? PiTeam { get; set; }
    public bool Confidential { get; set; }
    public double? LatCnt { get; set; }
    public double? LonCnt { get; set; }
    public double? LatSw { get; set; }
    public double? LonSw { get; set; }
    public double? LatNw { get; set; }
    public double? LonNw { get; set; }
    public double? LatSe { get; set; }
    public double? LonSe { get; set; }
    public double? LatNe { get; set; }
    public double? LonNe { get; set; }
    public double? Altitude { get; set; }
    public double? SlopeDegree { get; set; }
    public double? PlotArea { get; set; }
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
    public string? Reference { get; set; }
    public string? OtherMeasurements { get; set; }
    public string? BiomassProcessingProtocol { get; set; }
    public string? Status { get; set; }
    public int Version { get; set; } = 1;
}
