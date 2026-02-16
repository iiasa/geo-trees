<h2 style="color: #333333; margin: 0 0 16px;">Welcome to GeoTrees!</h2>
<p style="color: #51545e; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
    Hi <strong>{{ model.user_name }}</strong>,
</p>
<p style="color: #51545e; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
    Your account has been created with the email address <strong>{{ model.email_address }}</strong>.
</p>
<p style="color: #51545e; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
    Please click the button below to verify your email address:
</p>
<table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 0 24px;">
    <tr>
        <td align="center" style="border-radius: 6px; background-color: #22c55e;">
            <a href="{{ model.confirmation_link }}" target="_blank"
               style="display: inline-block; padding: 12px 24px; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Verify Email Address
            </a>
        </td>
    </tr>
</table>
<p style="color: #51545e; font-size: 14px; line-height: 1.6; margin: 0 0 16px;">
    If the button above doesn't work, copy and paste this link into your browser:
    <br />
    <a href="{{ model.confirmation_link }}" style="color: #22c55e; word-break: break-all;">{{ model.confirmation_link }}</a>
</p>
<p style="color: #51545e; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
    Welcome to the IIASA GeoTrees platform. You can now explore our global tree measurement data and contribute to forest research.
</p>
<p style="color: #51545e; font-size: 16px; line-height: 1.6; margin: 0;">
    If you did not create this account, please disregard this email.
</p>
