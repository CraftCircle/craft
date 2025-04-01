// templates/event.ts
import { baseEmailLayout } from './baseLayout';

export const eventCreationTemplate = (
  name: string,
  eventTitle: string,
  eventUrl: string,
): string => {
  const content = `
    <h1>Your event is now live 🎉</h1>
    <p>Hey ${name},</p>
    <p>Your event <strong>"${eventTitle}"</strong> has been successfully published on CraftCircle.</p>
    <p>
      <a href="${eventUrl}" class="button">View Event</a>
    </p>
  `;

  return baseEmailLayout('Your Event is Live', content);
};
