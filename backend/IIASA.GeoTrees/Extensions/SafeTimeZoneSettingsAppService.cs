using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TimeZoneConverter;
using Volo.Abp;
using Volo.Abp.SettingManagement;
using Volo.Abp.Timing;

namespace IIASA.GeoTrees.Extensions;

/// <summary>
/// Overrides the default TimeZoneSettingsAppService to handle deprecated
/// IANA timezone IDs (e.g. "Africa/Asmera") that TimeZoneConverter cannot resolve.
/// </summary>
public class SafeTimeZoneSettingsAppService : TimeZoneSettingsAppService
{
    public SafeTimeZoneSettingsAppService(
        ISettingManager settingManager,
        ITimezoneProvider timezoneProvider
    )
        : base(settingManager, timezoneProvider) { }

    public override Task<List<NameValue>> GetTimezonesAsync()
    {
        var timezones = new List<NameValue>();

        foreach (var tz in TimeZoneInfo.GetSystemTimeZones())
        {
            try
            {
                var tzInfo = TZConvert.GetTimeZoneInfo(tz.Id);
                timezones.Add(new NameValue(tzInfo.DisplayName, tz.Id));
            }
            catch (TimeZoneNotFoundException)
            {
                // Skip deprecated/unrecognized timezone IDs
            }
        }

        return Task.FromResult(timezones);
    }
}
