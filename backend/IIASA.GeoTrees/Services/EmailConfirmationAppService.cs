using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Identity;

namespace IIASA.GeoTrees.Services;

public class EmailConfirmationAppService : GeoTreesAppService
{
    private readonly IdentityUserManager _userManager;

    public EmailConfirmationAppService(IdentityUserManager userManager)
    {
        _userManager = userManager;
    }

    [AllowAnonymous]
    public async Task ConfirmAsync(ConfirmEmailInput input)
    {
        var user = await _userManager.FindByIdAsync(input.UserId);
        if (user == null)
        {
            throw new UserFriendlyException("Invalid confirmation link.");
        }

        var result = await _userManager.ConfirmEmailAsync(user, input.Token);
        if (!result.Succeeded)
        {
            throw new UserFriendlyException(
                "Email confirmation failed. The link may have expired or already been used."
            );
        }
    }
}

public class ConfirmEmailInput
{
    [Required]
    public string UserId { get; set; } = "";

    [Required]
    public string Token { get; set; } = "";
}
