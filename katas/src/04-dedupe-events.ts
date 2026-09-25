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

  const clearEvents: WebhookEvent[] = [];
  const set: Set<string> = new Set();

  for(const e of events){
    const eventId: string = e.id.toString()
    
    if(!set.has(e.id)){
      set.add(e.id)
      clearEvents.push(e)
    }
  }
  
  return clearEvents;
}
