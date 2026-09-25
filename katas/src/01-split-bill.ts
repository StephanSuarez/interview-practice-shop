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
  // throw new Error('Not implemented');

  if(Number.isInteger(totalCents) && totalCents == 0 && Number.isInteger(people) && people == 0){
    throw new RangeError("people and cents must a positive integer")
  }

  if(!Number.isInteger(totalCents)){
    throw new RangeError("total cents must be integer")
  }

  if(!Number.isInteger(people)){
    throw new RangeError("people cents must be integer")
  }

  if(Number.isInteger(totalCents) && totalCents < 0){
    throw new RangeError("total centst must be positive")
  }

  if(Number.isInteger(people) && people < 0){
    throw new RangeError("peoplemust be positive")
  }

  if(Number.isInteger(totalCents) && totalCents > 0 && Number.isInteger(people) && people <= 0){
    throw new RangeError("can not divide 0")
  }
  
  // find base and leftover
  let base = Math.floor(totalCents/people);
  let leftover = totalCents%people;

  // calc array
  let billSplited = []
  for(let i=0; i<people; i++){
    let value = base + (leftover>0 ? 1 : 0)
    leftover--;
    billSplited.push(value)
  }

  return billSplited;
}
