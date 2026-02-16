using Volo.Abp.Application.Services;
using IIASA.GeoTrees.Localization;

namespace IIASA.GeoTrees.Services;

/* Inherit your application services from this class. */
public abstract class GeoTreesAppService : ApplicationService
{
    protected GeoTreesAppService()
    {
        LocalizationResource = typeof(GeoTreesResource);
    }
}