using IIASA.GeoTrees.Localization;
using Microsoft.Extensions.Localization;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Ui.Branding;

namespace IIASA.GeoTrees;

[Dependency(ReplaceServices = true)]
public class GeoTreesBrandingProvider : DefaultBrandingProvider
{
    private IStringLocalizer<GeoTreesResource> _localizer;

    public GeoTreesBrandingProvider(IStringLocalizer<GeoTreesResource> localizer)
    {
        _localizer = localizer;
    }

    public override string AppName => _localizer["AppName"];
}
