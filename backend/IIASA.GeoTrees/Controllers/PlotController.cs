using System;
using System.Threading.Tasks;
using IIASA.GeoTrees.Entities.Plots;
using IIASA.GeoTrees.Permissions;
using IIASA.GeoTrees.Services.Dtos.Plots;
using IIASA.GeoTrees.Services.Plots;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.Domain.Repositories;

namespace IIASA.GeoTrees.Controllers;

[Route("api/app/plot")]
public class PlotController : AbpController
{
    private readonly IPlotAppService _plotAppService;
    private readonly IRepository<Download, Guid> _downloadRepository;

    public PlotController(
        IPlotAppService plotAppService,
        IRepository<Download, Guid> downloadRepository
    )
    {
        _plotAppService = plotAppService;
        _downloadRepository = downloadRepository;
    }

    [HttpGet("download")]
    [Authorize(GeoTreesPermissions.Plots.Download)]
    public async Task<IActionResult> DownloadAsync(
        [FromQuery] string format,
        [FromQuery] string purpose,
        [FromQuery] string email,
        [FromQuery] string name,
        [FromQuery] string country
    )
    {
        var input = new PlotDownloadRequestDto
        {
            Format = format,
            Purpose = purpose,
            Email = email,
            Name = name,
            Country = country,
        };

        var download = new Download
        {
            Email = email ?? string.Empty,
            Name = name ?? string.Empty,
            Purpose = purpose ?? string.Empty,
            Format = format ?? string.Empty,
            IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? string.Empty,
            UserAgent = Request.Headers.UserAgent.ToString(),
            Origin = Request.Headers.Origin.ToString(),
            Referer = Request.Headers.Referer.ToString(),
        };

        await _downloadRepository.InsertAsync(download, autoSave: true);

        var zipBytes = await _plotAppService.GetDownloadBytesAsync(input);
        var fileName = $"plots_{DateTime.UtcNow:yyyyMMdd}_{format}.zip";
        return File(zipBytes, "application/zip", fileName);
    }
}
