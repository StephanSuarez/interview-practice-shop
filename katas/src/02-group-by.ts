/**
 * Group items by the key returned from `keyOf`.
 *
 * groupBy([{ s: 'paid' }, { s: 'pending' }, { s: 'paid' }], (o) => o.s)
 *   -> { paid: [{ s: 'paid' }, { s: 'paid' }], pending: [{ s: 'pending' }] }
 *
 * Keep the original order inside each group. Do not use Object.groupBy / Map.groupBy.
 */
export function groupBy<T>(items: T[], keyOf: (item: T) => string): Record<string, T[]> {
  // throw new Error('Not implemented');
  const group: Record<string, T[]> = {};

  for(const item of items){
    const key: string = keyOf(item)
    if(!Object.hasOwn(group, key)){
      group[key] = []
    }
    group[key].push(item)
  }

  return group
}
