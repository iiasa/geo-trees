using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GeoTrees.Api.Entities
{
    public class PlotConfiguration : IEntityTypeConfiguration<Plot>
    {
        public void Configure(EntityTypeBuilder<Plot> builder)
        {
            builder.HasKey(p => new { p.PlotId, p.SubPlotId });
            builder.Property(p => p.Id).UseIdentityAlwaysColumn();
        }
    }
}
