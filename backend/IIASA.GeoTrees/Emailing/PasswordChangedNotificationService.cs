using Volo.Abp.DependencyInjection;
using Volo.Abp.Emailing;
using Volo.Abp.TextTemplating;

namespace IIASA.GeoTrees.Emailing;

public class PasswordChangedNotificationService : ITransientDependency
{
    private readonly ITemplateRenderer _templateRenderer;
    private readonly IEmailSender _emailSender;

    public PasswordChangedNotificationService(
        ITemplateRenderer templateRenderer,
        IEmailSender emailSender)
    {
        _templateRenderer = templateRenderer;
        _emailSender = emailSender;
    }

    public async Task SendAsync(string email, string userName)
    {
        var body = await _templateRenderer.RenderAsync(
            GeoTreesEmailTemplates.PasswordChangedEmail,
            new
            {
                UserName = userName,
                ChangedAt = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss UTC"),
            }
        );

        await _emailSender.SendAsync(
            email,
            "Your GeoTrees Password Has Been Changed",
            body
        );
    }
}
