using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GeoTrees.Api.Migrations
{
    /// <inheritdoc />
    public partial class Added_Versioning : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Version",
                table: "Plots",
                type: "integer",
                nullable: false,
                defaultValue: 1
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "Version", table: "Plots");
        }
    }
}
