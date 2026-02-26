using System.Threading.Tasks;
using IIASA.GeoTrees.Settings;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Services;
using Volo.Abp.Settings;

namespace IIASA.GeoTrees.Services;

public class RegistrationSettingsAppService : ApplicationService
{
    private readonly ISettingProvider _settingProvider;

    public RegistrationSettingsAppService(ISettingProvider settingProvider)
    {
        _settingProvider = settingProvider;
    }

    [AllowAnonymous]
    public async Task<RegistrationSettingsDto> GetAsync()
    {
        var termsUrl = await _settingProvider.GetOrNullAsync(
            GeoTreesSettings.Registration.TermsAndConditionsUrl
        );

        return new RegistrationSettingsDto { TermsAndConditionsUrl = termsUrl ?? "" };
    }
}

public class RegistrationSettingsDto
{
    public string TermsAndConditionsUrl { get; set; } = "";
}
