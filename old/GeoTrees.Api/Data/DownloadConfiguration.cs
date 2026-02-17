using GeoTrees.Api.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GeoTrees.Api.Data
{
    public class DownloadConfiguration : IEntityTypeConfiguration<Download>
    {
        public void Configure(EntityTypeBuilder<Download> builder)
        {
            builder.HasKey(d => d.Id);
            builder.Property(d => d.Id).UseIdentityAlwaysColumn();
        }
    }
}
