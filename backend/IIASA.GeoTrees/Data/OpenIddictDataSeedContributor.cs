using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using OpenIddict.Abstractions;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;

namespace IIASA.GeoTrees.Data;

public class OpenIddictDataSeedContributor : IDataSeedContributor, ITransientDependency
{
    private readonly IOpenIddictApplicationManager _applicationManager;
    private readonly IOpenIddictScopeManager _scopeManager;

    public OpenIddictDataSeedContributor(
        IOpenIddictApplicationManager applicationManager,
        IOpenIddictScopeManager scopeManager
    )
    {
        _applicationManager = applicationManager;
        _scopeManager = scopeManager;
    }

    public async Task SeedAsync(DataSeedContext context)
    {
        await CreateScopesAsync();
        await CreateApplicationsAsync();
    }

    private async Task CreateScopesAsync()
    {
        if (await _scopeManager.FindByNameAsync("GeoTrees") is null)
        {
            await _scopeManager.CreateAsync(
                new OpenIddictScopeDescriptor
                {
                    Name = "GeoTrees",
                    DisplayName = "GeoTrees API",
                    Resources = { "GeoTrees" },
                }
            );
        }
    }

    private async Task CreateApplicationsAsync()
    {
        const string clientId = "GeoTrees_React";

        var existingApp = await _applicationManager.FindByClientIdAsync(clientId);
        if (existingApp is not null)
        {
            await _applicationManager.DeleteAsync(existingApp);
        }

        var redirectUris = new List<string>
        {
            "http://localhost:3000/auth/callback",
            "https://geo-trees.nodes.iiasa.ac.at/auth/callback",
            "https://data.geo-trees.org/auth/callback",
        };

        var postLogoutRedirectUris = new List<string>
        {
            "http://localhost:3000",
            "https://geo-trees.nodes.iiasa.ac.at",
            "https://data.geo-trees.org",
        };

        var descriptor = new OpenIddictApplicationDescriptor
        {
            ClientId = clientId,
            ClientType = OpenIddictConstants.ClientTypes.Public,
            ConsentType = OpenIddictConstants.ConsentTypes.Implicit,
            DisplayName = "GeoTrees React Application",
            ApplicationType = OpenIddictConstants.ApplicationTypes.Web,
            Permissions =
            {
                OpenIddictConstants.Permissions.Endpoints.Authorization,
                OpenIddictConstants.Permissions.Endpoints.Token,
                OpenIddictConstants.Permissions.Endpoints.EndSession,
                OpenIddictConstants.Permissions.Endpoints.Revocation,
                OpenIddictConstants.Permissions.GrantTypes.AuthorizationCode,
                OpenIddictConstants.Permissions.GrantTypes.RefreshToken,
                OpenIddictConstants.Permissions.ResponseTypes.Code,
                OpenIddictConstants.Permissions.Scopes.Email,
                OpenIddictConstants.Permissions.Scopes.Profile,
                OpenIddictConstants.Permissions.Scopes.Roles,
                OpenIddictConstants.Permissions.Prefixes.Scope + "offline_access",
                OpenIddictConstants.Permissions.Prefixes.Scope + "GeoTrees",
            },
        };

        foreach (var uri in redirectUris)
        {
            descriptor.RedirectUris.Add(new Uri(uri));
        }

        foreach (var uri in postLogoutRedirectUris)
        {
            descriptor.PostLogoutRedirectUris.Add(new Uri(uri));
        }

        await _applicationManager.CreateAsync(descriptor);
    }
}
