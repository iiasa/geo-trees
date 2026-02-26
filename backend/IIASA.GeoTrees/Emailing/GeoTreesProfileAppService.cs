using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Volo.Abp.Account;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Identity;
using Volo.Abp.Users;

namespace IIASA.GeoTrees.Emailing;

[Dependency(ReplaceServices = true)]
[ExposeServices(
    typeof(IProfileAppService),
    typeof(ProfileAppService),
    typeof(GeoTreesProfileAppService)
)]
public class GeoTreesProfileAppService : ProfileAppService
{
    // Property injection: base ProfileAppService constructor is constrained
    public PasswordChangedNotificationService PasswordChangedNotificationService { get; set; } =
        null!;

    public GeoTreesProfileAppService(
        IdentityUserManager userManager,
        IOptions<IdentityOptions> identityOptions
    )
        : base(userManager, identityOptions) { }

    public override async Task ChangePasswordAsync(ChangePasswordInput input)
    {
        await base.ChangePasswordAsync(input);

        try
        {
            var user = await UserManager.GetByIdAsync(CurrentUser.GetId());
            if (!string.IsNullOrWhiteSpace(user.Email))
            {
                await PasswordChangedNotificationService.SendAsync(
                    user.Email,
                    user.UserName ?? user.Email
                );
            }
        }
        catch (Exception ex)
        {
            Logger.LogWarning(ex, "Failed to send password changed notification email");
        }
    }
}
