using IIASA.GeoTrees.Localization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Localization;
using Volo.Abp.MultiTenancy;

namespace IIASA.GeoTrees.Permissions;

public class GeoTreesPermissionDefinitionProvider : PermissionDefinitionProvider
{
    public override void Define(IPermissionDefinitionContext context)
    {
        var myGroup = context.AddGroup(GeoTreesPermissions.GroupName);

        var plotsPermission = myGroup.AddPermission(
            GeoTreesPermissions.Plots.Default,
            L("Permission:Plots")
        );
        plotsPermission.AddChild(GeoTreesPermissions.Plots.Create, L("Permission:Plots.Create"));
        plotsPermission.AddChild(GeoTreesPermissions.Plots.Edit, L("Permission:Plots.Edit"));
        plotsPermission.AddChild(GeoTreesPermissions.Plots.Delete, L("Permission:Plots.Delete"));
        plotsPermission.AddChild(
            GeoTreesPermissions.Plots.Download,
            L("Permission:Plots.Download")
        );

        myGroup.AddPermission(GeoTreesPermissions.Downloads.Default, L("Permission:Downloads"));

        var mapLayersPermission = myGroup.AddPermission(
            GeoTreesPermissions.MapLayers.Default,
            L("Permission:MapLayers")
        );
        mapLayersPermission.AddChild(
            GeoTreesPermissions.MapLayers.Create,
            L("Permission:MapLayers.Create")
        );
        mapLayersPermission.AddChild(
            GeoTreesPermissions.MapLayers.Edit,
            L("Permission:MapLayers.Edit")
        );
        mapLayersPermission.AddChild(
            GeoTreesPermissions.MapLayers.Delete,
            L("Permission:MapLayers.Delete")
        );
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<GeoTreesResource>(name);
    }
}
