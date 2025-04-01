/**
 * Formats a Date object into a readable string for UI/emails.
 * Example: "Monday, Apr 1, 2025 at 10:45 AM"
 */
export function formatDateTime(date: Date): {
  dateStr: string;
  timeStr: string;
} {
  const optionsDate: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const optionsTime: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  return {
    dateStr: date.toLocaleDateString(undefined, optionsDate),
    timeStr: date.toLocaleTimeString(undefined, optionsTime),
  };
}
