/**
 * Split a bill of `totalCents` between `people` as evenly as possible.
 *
 * - Return an array of length `people`, in cents (integers).
 * - The parts must add up exactly to `totalCents`.
 * - Leftover cents go to the first people: splitBill(1000, 3) -> [334, 333, 333].
 * - Throw a RangeError if `people` is not a positive integer or `totalCents`
 *   is not a non-negative integer.
 */
export function splitBill(totalCents: number, people: number): number[] {
  if (!Number.isInteger(totalCents) || totalCents < 0) {
    throw new RangeError("total cents must be a positive integer")
  }

  if (!Number.isInteger(people) || people <= 0) {
    throw new RangeError("people must be a non-negative number")
  }

  const countSplited: number[] = []

  const base: number = Math.floor(totalCents / people)
  let leftover: number = totalCents % people

  for (let i = 0; i < people; i++) {
    let valToAdd = base
    if (leftover > 0) {
      valToAdd += 1
      leftover--
    }
    countSplited.push(valToAdd);
  }

  return countSplited;
}
