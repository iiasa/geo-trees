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


        var booksPermission = myGroup.AddPermission(GeoTreesPermissions.Books.Default, L("Permission:Books"));
        booksPermission.AddChild(GeoTreesPermissions.Books.Create, L("Permission:Books.Create"));
        booksPermission.AddChild(GeoTreesPermissions.Books.Edit, L("Permission:Books.Edit"));
        booksPermission.AddChild(GeoTreesPermissions.Books.Delete, L("Permission:Books.Delete"));
        
        //Define your own permissions here. Example:
        //myGroup.AddPermission(GeoTreesPermissions.MyPermission1, L("Permission:MyPermission1"));
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<GeoTreesResource>(name);
    }
}
