using System.ComponentModel.DataAnnotations;

namespace IIASA.GeoTrees.Services.Dtos.Plots;

public class PlotDownloadRequestDto
{
    [Required]
    public string Format { get; set; } = null!;

    [Required]
    public string Purpose { get; set; } = null!;

    [Required]
    public string Email { get; set; } = null!;

    [Required]
    public string Name { get; set; } = null!;

    [Required]
    public string Country { get; set; } = null!;
}
