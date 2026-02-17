using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Entities.Events;
using Volo.Abp.Emailing;
using Volo.Abp.EventBus;
using Volo.Abp.Identity;
using Volo.Abp.TextTemplating;

namespace IIASA.GeoTrees.Emailing.EventHandlers;

public class UserCreatedEmailHandler
    : ILocalEventHandler<EntityCreatedEventData<IdentityUser>>, ITransientDependency
{
    private readonly ITemplateRenderer _templateRenderer;
    private readonly IEmailSender _emailSender;
    private readonly ILogger<UserCreatedEmailHandler> _logger;
    private readonly IdentityUserManager _userManager;
    private readonly IConfiguration _configuration;

    public UserCreatedEmailHandler(
        ITemplateRenderer templateRenderer,
        IEmailSender emailSender,
        ILogger<UserCreatedEmailHandler> logger,
        IdentityUserManager userManager,
        IConfiguration configuration)
    {
        _templateRenderer = templateRenderer;
        _emailSender = emailSender;
        _logger = logger;
        _userManager = userManager;
        _configuration = configuration;
    }

    public async Task HandleEventAsync(EntityCreatedEventData<IdentityUser> eventData)
    {
        var user = eventData.Entity;

        if (string.IsNullOrWhiteSpace(user.Email))
        {
            return;
        }

        try
        {
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var frontendUrl = _configuration["App:FrontendUrl"] ?? "http://localhost:3000";
            var confirmationLink = $"{frontendUrl}/auth/confirm-email?userId={user.Id}&confirmationToken={Uri.EscapeDataString(token)}";

            var body = await _templateRenderer.RenderAsync(
                GeoTreesEmailTemplates.WelcomeEmail,
                new
                {
                    UserName = user.UserName ?? user.Email,
                    EmailAddress = user.Email,
                    ConfirmationLink = confirmationLink,
                }
            );

            await _emailSender.SendAsync(
                user.Email,
                "Welcome to IIASA GeoTrees",
                body
            );
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to send welcome email to {Email}", user.Email);
        }
    }
}
