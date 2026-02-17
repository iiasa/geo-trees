using IIASA.GeoTrees.Entities.Books;
using IIASA.GeoTrees.Entities.Plots;
using Microsoft.EntityFrameworkCore;
using Volo.Abp.AuditLogging.EntityFrameworkCore;
using Volo.Abp.BackgroundJobs.EntityFrameworkCore;
using Volo.Abp.BlobStoring.Database.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore.Modeling;
using Volo.Abp.FeatureManagement.EntityFrameworkCore;
using Volo.Abp.Identity.EntityFrameworkCore;
using Volo.Abp.OpenIddict.EntityFrameworkCore;
using Volo.Abp.PermissionManagement.EntityFrameworkCore;
using Volo.Abp.SettingManagement.EntityFrameworkCore;
using Volo.Abp.TenantManagement.EntityFrameworkCore;
using Volo.CmsKit.EntityFrameworkCore;

namespace IIASA.GeoTrees.Data;

public class GeoTreesDbContext : AbpDbContext<GeoTreesDbContext>
{
    public DbSet<Book> Books { get; set; }
    public DbSet<Plot> Plots { get; set; }
    public DbSet<Download> Downloads { get; set; }

    public const string DbTablePrefix = "App";
    public const string DbSchema = null;

    public GeoTreesDbContext(DbContextOptions<GeoTreesDbContext> options)
        : base(options) { }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        /* Include modules to your migration db context */

        builder.ConfigureSettingManagement();
        builder.ConfigureBackgroundJobs();
        builder.ConfigureAuditLogging();
        builder.ConfigureFeatureManagement();
        builder.ConfigurePermissionManagement();
        builder.ConfigureBlobStoring();
        builder.ConfigureIdentity();
        builder.ConfigureOpenIddict();
        builder.ConfigureTenantManagement();
        builder.ConfigureCmsKit();

        builder.Entity<Book>(b =>
        {
            b.ToTable(DbTablePrefix + "Books", DbSchema);
            b.ConfigureByConvention(); //auto configure for the base class props
            b.Property(x => x.Name).IsRequired().HasMaxLength(128);
        });

        builder.Entity<Plot>(b =>
        {
            b.ToTable(DbTablePrefix + "Plots", DbSchema);
            b.ConfigureByConvention();
            b.Property(x => x.PlotId).IsRequired().HasMaxLength(256);
            b.Property(x => x.SubPlotId).IsRequired().HasMaxLength(256);
            b.Property(x => x.CountryName).IsRequired().HasMaxLength(256);
            b.HasIndex(x => new { x.PlotId, x.SubPlotId }).IsUnique();
            b.HasIndex(x => x.PlotId);
            b.HasIndex(x => x.CountryName);
            b.HasIndex(x => x.Version);
        });

        builder.Entity<Download>(b =>
        {
            b.ToTable(DbTablePrefix + "Downloads", DbSchema);
            b.ConfigureByConvention();
            b.Property(x => x.Email).IsRequired().HasMaxLength(256);
            b.Property(x => x.Name).IsRequired().HasMaxLength(256);
            b.Property(x => x.Purpose).IsRequired().HasMaxLength(1024);
            b.Property(x => x.Format).IsRequired().HasMaxLength(64);
        });

        /* Configure your own entities here */
    }
}
