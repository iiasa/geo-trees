using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IIASA.GeoTrees.Migrations
{
    /// <inheritdoc />
    public partial class AddUserInstitutionAndCountry : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Country",
                table: "AbpUsers",
                type: "character varying(128)",
                maxLength: 128,
                nullable: true
            );

            migrationBuilder.AddColumn<string>(
                name: "Institution",
                table: "AbpUsers",
                type: "character varying(256)",
                maxLength: 256,
                nullable: true
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "Country", table: "AbpUsers");

            migrationBuilder.DropColumn(name: "Institution", table: "AbpUsers");
        }
    }
}
