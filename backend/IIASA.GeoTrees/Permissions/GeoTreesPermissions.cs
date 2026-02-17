namespace IIASA.GeoTrees.Permissions;

public static class GeoTreesPermissions
{
    public const string GroupName = "GeoTrees";

    public static class Plots
    {
        public const string Default = GroupName + ".Plots";
        public const string Create = Default + ".Create";
        public const string Edit = Default + ".Edit";
        public const string Delete = Default + ".Delete";
        public const string Download = Default + ".Download";
    }

    public static class Downloads
    {
        public const string Default = GroupName + ".Downloads";
    }

    public static class MapLayers
    {
        public const string Default = GroupName + ".MapLayers";
        public const string Create = Default + ".Create";
        public const string Edit = Default + ".Edit";
        public const string Delete = Default + ".Delete";
    }
}
