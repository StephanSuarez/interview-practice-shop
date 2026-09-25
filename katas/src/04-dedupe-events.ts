export interface WebhookEvent {
  id: string;
  type: string;
  receivedAt: number;
}

/**
 * A payment provider delivers events "at least once", so the same event id can arrive
 * several times. Keep only the first occurrence of each id, preserving arrival order.
 * Must be O(n), not O(n²).
 */
export function dedupeEvents(events: WebhookEvent[]): WebhookEvent[] {
  throw new Error('Not implemented');
}
