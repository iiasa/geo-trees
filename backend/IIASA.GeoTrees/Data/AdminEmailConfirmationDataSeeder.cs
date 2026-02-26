using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Identity;

namespace IIASA.GeoTrees.Data;

public class AdminEmailConfirmationDataSeeder : IDataSeedContributor, ITransientDependency
{
    private readonly IdentityUserManager _userManager;
    private readonly ILogger<AdminEmailConfirmationDataSeeder> _logger;

    public AdminEmailConfirmationDataSeeder(
        IdentityUserManager userManager,
        ILogger<AdminEmailConfirmationDataSeeder> logger
    )
    {
        _userManager = userManager;
        _logger = logger;
    }

    public async Task SeedAsync(DataSeedContext context)
    {
        var adminUser = await _userManager.FindByNameAsync("admin");
        if (adminUser == null)
        {
            return;
        }

        if (adminUser.EmailConfirmed)
        {
            return;
        }

        var token = await _userManager.GenerateEmailConfirmationTokenAsync(adminUser);
        var result = await _userManager.ConfirmEmailAsync(adminUser, token);

        if (result.Succeeded)
        {
            _logger.LogInformation("Admin user email confirmed during seed.");
        }
        else
        {
            _logger.LogWarning(
                "Failed to confirm admin user email during seed: {Errors}",
                string.Join(", ", result.Errors.Select(e => e.Description))
            );
        }
    }
}
