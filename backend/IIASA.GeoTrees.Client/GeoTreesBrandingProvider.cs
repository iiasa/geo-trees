using Volo.Abp.Ui.Branding;
using Volo.Abp.DependencyInjection;
using Microsoft.Extensions.Localization;
using IIASA.GeoTrees.Localization;

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
