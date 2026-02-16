using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace IIASA.GeoTrees.Data;

public class GeoTreesDbContextFactory : IDesignTimeDbContextFactory<GeoTreesDbContext>
{
    public GeoTreesDbContext CreateDbContext(string[] args)
    {
        GeoTreesGlobalFeatureConfigurator.Configure();
        GeoTreesModuleExtensionConfigurator.Configure();
        
        // https://www.npgsql.org/efcore/release-notes/6.0.html#opting-out-of-the-new-timestamp-mapping-logic
        AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
        
        var configuration = BuildConfiguration();

        var builder = new DbContextOptionsBuilder<GeoTreesDbContext>()
            .UseNpgsql(configuration.GetConnectionString("Default"));

        return new GeoTreesDbContext(builder.Options);
    }

    private static IConfigurationRoot BuildConfiguration()
    {
        var builder = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false)
            .AddEnvironmentVariables();

        return builder.Build();
    }
}