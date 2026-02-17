using Volo.Abp.Emailing.Templates;
using Volo.Abp.TextTemplating;
using Volo.Abp.TextTemplating.Scriban;

namespace IIASA.GeoTrees.Emailing;

public class GeoTreesEmailTemplateDefinitionProvider : TemplateDefinitionProvider
{
    public override void Define(ITemplateDefinitionContext context)
    {
        // Override ABP's standard email layout with GeoTrees branding.
        // This affects ALL emails sent by ABP (password reset, email confirmation, etc.)
        var standardLayout = context.GetOrNull(StandardEmailTemplates.Layout);
        standardLayout?
            .WithVirtualFilePath("/Emailing/Templates/Layout.tpl", isInlineLocalized: true)
            .WithScribanEngine();

        // Override ABP's standard message template to use Scriban
        var standardMessage = context.GetOrNull(StandardEmailTemplates.Message);
        standardMessage?
            .WithVirtualFilePath("/Emailing/Templates/Message.tpl", isInlineLocalized: true)
            .WithScribanEngine();

        // Custom GeoTrees templates
        context.Add(
            new TemplateDefinition(
                GeoTreesEmailTemplates.WelcomeEmail,
                layout: StandardEmailTemplates.Layout
            )
            .WithVirtualFilePath("/Emailing/Templates/WelcomeEmail.tpl", isInlineLocalized: true)
            .WithScribanEngine()
        );

        context.Add(
            new TemplateDefinition(
                GeoTreesEmailTemplates.PasswordChangedEmail,
                layout: StandardEmailTemplates.Layout
            )
            .WithVirtualFilePath("/Emailing/Templates/PasswordChangedEmail.tpl", isInlineLocalized: true)
            .WithScribanEngine()
        );
    }
}
