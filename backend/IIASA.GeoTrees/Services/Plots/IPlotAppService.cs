using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using IIASA.GeoTrees.Services.Dtos.Plots;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace IIASA.GeoTrees.Services.Plots;

public interface IPlotAppService : IApplicationService
{
    Task<PlotDto> GetAsync(Guid id);
    Task<PagedResultDto<PlotDto>> GetListAsync(GetPlotListDto input);
    Task<PlotDto> GetByPlotIdAsync(string plotId, int? version = null);
    Task<PlotDto> CreateAsync(CreateUpdatePlotDto input);
    Task<PlotDto> UpdateAsync(Guid id, CreateUpdatePlotDto input);
    Task DeleteAsync(Guid id);
    Task<List<string>> GetAvailableCountriesAsync();
    Task<List<int>> GetAvailableVersionsAsync();
    Task<object> GetGeoJsonAsync(string? status = null);
    Task<byte[]> GetDownloadBytesAsync(PlotDownloadRequestDto input);
}
