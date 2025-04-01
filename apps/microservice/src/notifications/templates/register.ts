import { baseEmailLayout } from './baseLayout';

export const registrationEmailTemplate = (name: string, magicLink?: string): string => {
  const safeName = name || 'there';
  const actionUrl = magicLink || 'https://craftcirclehq.com/';
  const content = `
    <h1>🎉🎉Welcome to CraftCircle 🎉🎉</h1>
    <p>Hey ${safeName},</p>
    <p>We’re thrilled to have you! Your journey starts here.</p>
    <p>
      <a href="${actionUrl}" class="button">Log in now</a>
    </p>
  `;

  return baseEmailLayout('🎉 Welcome to CraftCircle🎉', content);
};
