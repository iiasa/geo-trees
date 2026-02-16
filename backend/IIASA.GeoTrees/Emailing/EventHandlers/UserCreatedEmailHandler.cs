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

    public UserCreatedEmailHandler(
        ITemplateRenderer templateRenderer,
        IEmailSender emailSender,
        ILogger<UserCreatedEmailHandler> logger)
    {
        _templateRenderer = templateRenderer;
        _emailSender = emailSender;
        _logger = logger;
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
            var body = await _templateRenderer.RenderAsync(
                GeoTreesEmailTemplates.WelcomeEmail,
                new
                {
                    UserName = user.UserName ?? user.Email,
                    EmailAddress = user.Email,
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
