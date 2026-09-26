/**
 * Call `fn` until it succeeds, at most `attempts` times in total.
 *
 * - Wait between attempts with exponential backoff: baseDelayMs, then 2x, then 4x...
 *   (attempts: 4, baseDelayMs: 100 -> waits 100, 200, 400).
 * - Do not wait after the last failure.
 * - If every attempt fails, reject with the LAST error.
 * - If `shouldRetry(error)` is given and returns false, reject immediately with that error.
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: { attempts: number; baseDelayMs: number; shouldRetry?: (error: unknown) => boolean },
): Promise<T> {
  // reintentar promesa con timeout
  let lastError: unknown
  for(let i=0; i< options.attempts; i++){
    try{
      const result = await fn();
      return result
    }catch(e){
      
    }
  } 

  throw lastError
}