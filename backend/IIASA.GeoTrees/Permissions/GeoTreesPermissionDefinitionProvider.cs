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

        var booksPermission = myGroup.AddPermission(
            GeoTreesPermissions.Books.Default,
            L("Permission:Books")
        );
        booksPermission.AddChild(GeoTreesPermissions.Books.Create, L("Permission:Books.Create"));
        booksPermission.AddChild(GeoTreesPermissions.Books.Edit, L("Permission:Books.Edit"));
        booksPermission.AddChild(GeoTreesPermissions.Books.Delete, L("Permission:Books.Delete"));

        var plotsPermission = myGroup.AddPermission(
            GeoTreesPermissions.Plots.Default,
            L("Permission:Plots")
        );
        plotsPermission.AddChild(GeoTreesPermissions.Plots.Create, L("Permission:Plots.Create"));
        plotsPermission.AddChild(GeoTreesPermissions.Plots.Edit, L("Permission:Plots.Edit"));
        plotsPermission.AddChild(GeoTreesPermissions.Plots.Delete, L("Permission:Plots.Delete"));
        plotsPermission.AddChild(GeoTreesPermissions.Plots.Download, L("Permission:Plots.Download"));

        myGroup.AddPermission(
            GeoTreesPermissions.Downloads.Default,
            L("Permission:Downloads")
        );
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<GeoTreesResource>(name);
    }
}
