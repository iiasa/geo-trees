using GeoTrees.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace GeoTrees.Api.Data
{
    public class GeoTreesDbContext : DbContext
    {
        public GeoTreesDbContext(DbContextOptions<GeoTreesDbContext> options)
            : base(options) { }

        public DbSet<Plot> Plots { get; set; }

        public DbSet<Download> Downloads { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new PlotConfiguration());
            modelBuilder.ApplyConfiguration(new DownloadConfiguration());
            modelBuilder.HasPostgresExtension("postgis");

            // Setup BaseEntity configuration for all entities that inherit from it. also set the default value for the properties
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                if (typeof(BaseEntity).IsAssignableFrom(entityType.ClrType))
                {
                    modelBuilder
                        .Entity(entityType.ClrType)
                        .Property<DateTime>("CreatedAt")
                        .HasDefaultValueSql("now()")
                        .ValueGeneratedOnAdd();
                    modelBuilder
                        .Entity(entityType.ClrType)
                        .Property<DateTime>("UpdatedAt")
                        .HasDefaultValueSql("now()")
                        .ValueGeneratedOnAddOrUpdate();
                }
            }
        }
    }
}
