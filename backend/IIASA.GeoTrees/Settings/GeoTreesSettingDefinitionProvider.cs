using Volo.Abp.Settings;

namespace IIASA.GeoTrees.Settings;

public class GeoTreesSettingDefinitionProvider : SettingDefinitionProvider
{
    public override void Define(ISettingDefinitionContext context)
    {
        context.Add(
            new SettingDefinition(
                GeoTreesSettings.Registration.TermsAndConditionsUrl,
                defaultValue: "",
                isVisibleToClients: true
            )
        );
    }
}
