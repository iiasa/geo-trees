namespace GeoTrees.Api.Entities
{
    public class Download : BaseEntity
    {
        public int Id { get; set; }
        public string Email { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string Purpose { get; set; } = null!;
        public string Format { get; set; } = null!;

        public string IpAddress { get; set; } = null!;
        public string UserAgent { get; set; } = null!;
        public string Referer { get; set; } = null!;
        public string Origin { get; set; } = null!;
    }
}
