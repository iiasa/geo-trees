using IIASA.GeoTrees.Localization;
using Volo.Abp.Application.Services;

namespace IIASA.GeoTrees.Services;

/* Inherit your application services from this class. */
public abstract class GeoTreesAppService : ApplicationService
{
    protected GeoTreesAppService()
    {
        LocalizationResource = typeof(GeoTreesResource);
    }
}
