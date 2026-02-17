using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace GeoTrees.Api.Migrations
{
    /// <inheritdoc />
    public partial class Init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase().Annotation("Npgsql:PostgresExtension:postgis", ",,");

            migrationBuilder.CreateTable(
                name: "Downloads",
                columns: table => new
                {
                    Id = table
                        .Column<int>(type: "integer", nullable: false)
                        .Annotation(
                            "Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityAlwaysColumn
                        ),
                    Email = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Purpose = table.Column<string>(type: "text", nullable: false),
                    Format = table.Column<string>(type: "text", nullable: false),
                    IpAddress = table.Column<string>(type: "text", nullable: false),
                    UserAgent = table.Column<string>(type: "text", nullable: false),
                    Referer = table.Column<string>(type: "text", nullable: false),
                    Origin = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: false,
                        defaultValueSql: "now()"
                    ),
                    UpdatedAt = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: false,
                        defaultValueSql: "now()"
                    ),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Downloads", x => x.Id);
                }
            );

            migrationBuilder.CreateTable(
                name: "Plots",
                columns: table => new
                {
                    PlotId = table.Column<string>(type: "text", nullable: false),
                    SubPlotId = table.Column<string>(type: "text", nullable: false),
                    Id = table
                        .Column<int>(type: "integer", nullable: false)
                        .Annotation(
                            "Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityAlwaysColumn
                        ),
                    CountryName = table.Column<string>(type: "text", nullable: false),
                    Network = table.Column<string>(type: "text", nullable: true),
                    Institution = table.Column<string>(type: "text", nullable: true),
                    Link = table.Column<string>(type: "text", nullable: true),
                    YearEstablished = table.Column<int>(type: "integer", nullable: true),
                    YearCensus = table.Column<int>(type: "integer", nullable: true),
                    PiTeam = table.Column<string>(type: "text", nullable: true),
                    Confidential = table.Column<bool>(type: "boolean", nullable: false),
                    LatCnt = table.Column<double>(type: "double precision", nullable: true),
                    LonCnt = table.Column<double>(type: "double precision", nullable: true),
                    LatSw = table.Column<double>(type: "double precision", nullable: true),
                    LonSw = table.Column<double>(type: "double precision", nullable: true),
                    LatNw = table.Column<double>(type: "double precision", nullable: true),
                    LonNw = table.Column<double>(type: "double precision", nullable: true),
                    LatSe = table.Column<double>(type: "double precision", nullable: true),
                    LonSe = table.Column<double>(type: "double precision", nullable: true),
                    LatNe = table.Column<double>(type: "double precision", nullable: true),
                    LonNe = table.Column<double>(type: "double precision", nullable: true),
                    Altitude = table.Column<double>(type: "double precision", nullable: true),
                    SlopeDegree = table.Column<double>(type: "double precision", nullable: true),
                    PlotArea = table.Column<double>(type: "double precision", nullable: true),
                    PlotShape = table.Column<string>(type: "text", nullable: true),
                    ForestStatus = table.Column<string>(type: "text", nullable: true),
                    MinDbh = table.Column<double>(type: "double precision", nullable: true),
                    HLoreyLocal = table.Column<double>(type: "double precision", nullable: true),
                    HLoreyChave = table.Column<double>(type: "double precision", nullable: true),
                    HLoreyFeldpausch = table.Column<double>(
                        type: "double precision",
                        nullable: true
                    ),
                    HMaxLocal = table.Column<double>(type: "double precision", nullable: true),
                    HMaxChave = table.Column<double>(type: "double precision", nullable: true),
                    HMaxFeldpausch = table.Column<double>(type: "double precision", nullable: true),
                    AgbLocal = table.Column<double>(type: "double precision", nullable: true),
                    AgbLocalCred25 = table.Column<double>(type: "double precision", nullable: true),
                    AgbLocal975 = table.Column<double>(type: "double precision", nullable: true),
                    AgbFeldpausch = table.Column<double>(type: "double precision", nullable: true),
                    AgbFeldpauschCred25 = table.Column<double>(
                        type: "double precision",
                        nullable: true
                    ),
                    AgbFeldpauschCred975 = table.Column<double>(
                        type: "double precision",
                        nullable: true
                    ),
                    AgbChave = table.Column<double>(type: "double precision", nullable: true),
                    AgbChaveCred25 = table.Column<double>(type: "double precision", nullable: true),
                    AgbChaveCred975 = table.Column<double>(
                        type: "double precision",
                        nullable: true
                    ),
                    WoodDensity = table.Column<double>(type: "double precision", nullable: true),
                    Gsv = table.Column<double>(type: "double precision", nullable: true),
                    Ba = table.Column<double>(type: "double precision", nullable: true),
                    Ndens = table.Column<double>(type: "double precision", nullable: true),
                    Reference = table.Column<string>(type: "text", nullable: true),
                    OtherMeasurements = table.Column<string>(type: "text", nullable: true),
                    BiomassProcessingProtocol = table.Column<string>(type: "text", nullable: true),
                    Status = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: false,
                        defaultValueSql: "now()"
                    ),
                    UpdatedAt = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: false,
                        defaultValueSql: "now()"
                    ),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Plots", x => new { x.PlotId, x.SubPlotId });
                }
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "Downloads");

            migrationBuilder.DropTable(name: "Plots");
        }
    }
}
