export function addMinutes(iso: string, minutes: number): string {
  const date = new Date(iso);
  date.setMinutes(date.getMinutes() + minutes);
  return date.toISOString();
}

export function diffMinutes(aIso: string, bIso: string): number {
  const dateA = new Date(aIso).getTime();
  const dateB = new Date(bIso).getTime();
  return (dateB - dateA) / (1000 * 60); // b - a
}

export function formatChatTimestamp(isoString: string, withSeconds = false): string {
    const date = new Date(isoString);
    const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
    };
    if (withSeconds) {
        options.second = '2-digit';
    }
    return date.toLocaleTimeString('it-IT', options);
};