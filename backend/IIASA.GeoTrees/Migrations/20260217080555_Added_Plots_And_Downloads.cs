using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IIASA.GeoTrees.Migrations
{
    /// <inheritdoc />
    public partial class Added_Plots_And_Downloads : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppDownloads",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Email = table.Column<string>(
                        type: "character varying(256)",
                        maxLength: 256,
                        nullable: false
                    ),
                    Name = table.Column<string>(
                        type: "character varying(256)",
                        maxLength: 256,
                        nullable: false
                    ),
                    Purpose = table.Column<string>(
                        type: "character varying(1024)",
                        maxLength: 1024,
                        nullable: false
                    ),
                    Format = table.Column<string>(
                        type: "character varying(64)",
                        maxLength: 64,
                        nullable: false
                    ),
                    IpAddress = table.Column<string>(type: "text", nullable: false),
                    UserAgent = table.Column<string>(type: "text", nullable: false),
                    Referer = table.Column<string>(type: "text", nullable: false),
                    Origin = table.Column<string>(type: "text", nullable: false),
                    ExtraProperties = table.Column<string>(type: "text", nullable: false),
                    ConcurrencyStamp = table.Column<string>(
                        type: "character varying(40)",
                        maxLength: 40,
                        nullable: false
                    ),
                    CreationTime = table.Column<DateTime>(
                        type: "timestamp without time zone",
                        nullable: false
                    ),
                    CreatorId = table.Column<Guid>(type: "uuid", nullable: true),
                    LastModificationTime = table.Column<DateTime>(
                        type: "timestamp without time zone",
                        nullable: true
                    ),
                    LastModifierId = table.Column<Guid>(type: "uuid", nullable: true),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppDownloads", x => x.Id);
                }
            );

            migrationBuilder.CreateTable(
                name: "AppPlots",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PlotId = table.Column<string>(
                        type: "character varying(256)",
                        maxLength: 256,
                        nullable: false
                    ),
                    SubPlotId = table.Column<string>(
                        type: "character varying(256)",
                        maxLength: 256,
                        nullable: false
                    ),
                    CountryName = table.Column<string>(
                        type: "character varying(256)",
                        maxLength: 256,
                        nullable: false
                    ),
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
                    Version = table.Column<int>(type: "integer", nullable: false),
                    ExtraProperties = table.Column<string>(type: "text", nullable: false),
                    ConcurrencyStamp = table.Column<string>(
                        type: "character varying(40)",
                        maxLength: 40,
                        nullable: false
                    ),
                    CreationTime = table.Column<DateTime>(
                        type: "timestamp without time zone",
                        nullable: false
                    ),
                    CreatorId = table.Column<Guid>(type: "uuid", nullable: true),
                    LastModificationTime = table.Column<DateTime>(
                        type: "timestamp without time zone",
                        nullable: true
                    ),
                    LastModifierId = table.Column<Guid>(type: "uuid", nullable: true),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppPlots", x => x.Id);
                }
            );

            migrationBuilder.CreateIndex(
                name: "IX_AppPlots_CountryName",
                table: "AppPlots",
                column: "CountryName"
            );

            migrationBuilder.CreateIndex(
                name: "IX_AppPlots_PlotId",
                table: "AppPlots",
                column: "PlotId"
            );

            migrationBuilder.CreateIndex(
                name: "IX_AppPlots_PlotId_SubPlotId",
                table: "AppPlots",
                columns: new[] { "PlotId", "SubPlotId" },
                unique: true
            );

            migrationBuilder.CreateIndex(
                name: "IX_AppPlots_Version",
                table: "AppPlots",
                column: "Version"
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "AppDownloads");

            migrationBuilder.DropTable(name: "AppPlots");
        }
    }
}
