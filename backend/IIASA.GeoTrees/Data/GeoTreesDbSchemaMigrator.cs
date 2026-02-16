using Volo.Abp.DependencyInjection;
using Microsoft.EntityFrameworkCore;

namespace IIASA.GeoTrees.Data;

public class GeoTreesDbSchemaMigrator : ITransientDependency
{
    private readonly IServiceProvider _serviceProvider;

    public GeoTreesDbSchemaMigrator(
        IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public async Task MigrateAsync()
    {
        
        /* We intentionally resolving the GeoTreesDbContext
         * from IServiceProvider (instead of directly injecting it)
         * to properly get the connection string of the current tenant in the
         * current scope.
         */

        await _serviceProvider
            .GetRequiredService<GeoTreesDbContext>()
            .Database
            .MigrateAsync();

    }
}
