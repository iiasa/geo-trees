using Volo.Abp.GlobalFeatures;
using Volo.Abp.Threading;
using Volo.CmsKit;

namespace IIASA.GeoTrees;

public static class GeoTreesGlobalFeatureConfigurator
{
    private static readonly OneTimeRunner OneTimeRunner = new OneTimeRunner();

    public static void Configure()
    {
        OneTimeRunner.Run(() => {
            GlobalFeatureManager.Instance.Modules.CmsKit(cmsKit =>
            {
                cmsKit.Pages.Enable();
            });
        });
    }
}
