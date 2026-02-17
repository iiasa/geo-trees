using Volo.Abp.Identity;
using Volo.Abp.ObjectExtending;
using Volo.Abp.Threading;

namespace IIASA.GeoTrees.Data;

public static class GeoTreesEfCoreEntityExtensionMappings
{
    private static readonly OneTimeRunner OneTimeRunner = new OneTimeRunner();

    public static void Configure()
    {
        GeoTreesGlobalFeatureConfigurator.Configure();
        GeoTreesModuleExtensionConfigurator.Configure();

        OneTimeRunner.Run(() => {
            ObjectExtensionManager.Instance
                .MapEfCoreProperty<IdentityUser, string>(
                    "Institution",
                    (entityBuilder, propertyBuilder) =>
                    {
                        propertyBuilder.HasMaxLength(256);
                    }
                );
            ObjectExtensionManager.Instance
                .MapEfCoreProperty<IdentityUser, string>(
                    "Country",
                    (entityBuilder, propertyBuilder) =>
                    {
                        propertyBuilder.HasMaxLength(128);
                    }
                );
        });
    }
}
