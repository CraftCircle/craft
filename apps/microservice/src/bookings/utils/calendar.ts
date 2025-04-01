import { createEvent, EventAttributes } from 'ics';

/**
 * Generates an ICS calendar file as a buffer for download/email.
 */
export function createICSFile({
  title,
  description,
  start,
  end,
  location,
}: {
  title: string;
  description: string;
  start: Date;
  end: Date;
  location?: string;
}): Buffer {
  const startTuple: [number, number, number, number, number] = [
    start.getFullYear(),
    start.getMonth() + 1,
    start.getDate(),
    start.getHours(),
    start.getMinutes(),
  ];

  const endTuple: [number, number, number, number, number] = [
    end.getFullYear(),
    end.getMonth() + 1,
    end.getDate(),
    end.getHours(),
    end.getMinutes(),
  ];

  const event: EventAttributes = {
    start: startTuple,
    end: endTuple,
    title,
    description,
    location: location || '',
    status: 'CONFIRMED', // must be literal: "CONFIRMED" | "TENTATIVE" | "CANCELLED"
    busyStatus: 'BUSY', // must be literal: "BUSY" | "FREE" | "TENTATIVE" | "OOF"
    organizer: {
      name: 'CraftCircle',
      email: 'support@craftcirclehq.com',
    },
  };

  const { error, value } = createEvent(event);
  if (error) throw new Error(`ICS generation failed: ${error}`);

  return Buffer.from(value || '');
}
