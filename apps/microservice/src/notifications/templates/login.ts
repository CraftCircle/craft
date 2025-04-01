import { baseEmailLayout } from './baseLayout';

export const loginNotificationTemplate = (
  name: string,
  loginTime: string,
): string => {
  const content = `
    <h1>Login Successful 👋</h1>
    <p>Hello ${name},</p>
    <p>We noticed you logged into your CraftCircle account on ${loginTime}.</p>
    <p>If this wasn’t you, please reset your password immediately.</p>
    <p>
      <a href="https://craftcirclehq.com/" class="button">Go to Dashboard</a>
    </p>
  `;

  return baseEmailLayout('Login Alert', content);
};
