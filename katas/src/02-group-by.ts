/**
 * Group items by the key returned from `keyOf`.
 *
 * groupBy([{ s: 'paid' }, { s: 'pending' }, { s: 'paid' }], (o) => o.s)
 *   -> { paid: [{ s: 'paid' }, { s: 'paid' }], pending: [{ s: 'pending' }] }
 *
 * Keep the original order inside each group. Do not use Object.groupBy / Map.groupBy.
 */
export function groupBy<T>(items: T[], keyOf: (item: T) => string): Record<string, T[]> {
  const groupByList: Record<string, T[]> = {}

  for(const item of items){
    const key = keyOf(item);
    if(!Object.hasOwn(groupByList, key)){
      groupByList[key] = []
    }

    groupByList[key].push(item)
  }

  return groupByList;
}
