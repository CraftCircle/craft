export const loginNotificationTemplate = (
  name: string,
  time: string,
  ip?: string,
) => ({
  subject: `🛡️ Login Notification`,
  html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Hello ${name},</h2>
        <p>This is a confirmation that your account was accessed on:</p>
        <ul>
          <li><strong>Time:</strong> ${time}</li>
          ${ip ? `<li><strong>IP Address:</strong> ${ip}</li>` : ''}
        </ul>
        <p>If this was you, no action is needed.</p>
        <p>If you did <strong>not</strong> log in, please <a href="https://craftcirclehq.com/reset-password" style="color: red;">reset your password immediately</a>.</p>
      </div>
    `,
});
