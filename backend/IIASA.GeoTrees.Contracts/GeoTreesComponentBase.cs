using IIASA.GeoTrees.Localization;
using Volo.Abp.AspNetCore.Components;

namespace IIASA.GeoTrees;

public abstract class GeoTreesComponentBase : AbpComponentBase
{
    protected GeoTreesComponentBase()
    {
        LocalizationResource = typeof(GeoTreesResource);
    }
}
