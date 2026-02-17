using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IIASA.GeoTrees.Migrations
{
    /// <inheritdoc />
    public partial class AddMapLayer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppMapLayers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Url = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: true),
                    SourceEndpoint = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    Layers = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    Format = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: true),
                    IsVisible = table.Column<bool>(type: "boolean", nullable: false),
                    LegendUrl = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: true),
                    Attribution = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: true),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    GroupName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    ExtraProperties = table.Column<string>(type: "text", nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uuid", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    LastModifierId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppMapLayers", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppMapLayers_Order",
                table: "AppMapLayers",
                column: "Order");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppMapLayers");
        }
    }
}
