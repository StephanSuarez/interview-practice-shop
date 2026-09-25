import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { retry } from './07-retry';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe('retry', () => {
  it('returns the first success', async () => {
    const fn = vi.fn().mockResolvedValue('ok');
    await expect(retry(fn, { attempts: 3, baseDelayMs: 100 })).resolves.toBe('ok');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('retries with exponential backoff', async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error('1'))
      .mockRejectedValueOnce(new Error('2'))
      .mockResolvedValue('ok');
    const promise = retry(fn, { attempts: 4, baseDelayMs: 100 });

    await vi.advanceTimersByTimeAsync(0);
    expect(fn).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(99);
    expect(fn).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1);
    expect(fn).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(199);
    expect(fn).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(1);
    await expect(promise).resolves.toBe('ok');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('rejects with the last error after all attempts', async () => {
    let n = 0;
    const fn = vi.fn(async () => {
      throw new Error(`fail ${++n}`);
    });
    const promise = retry(fn, { attempts: 3, baseDelayMs: 10 });
    const assertion = expect(promise).rejects.toThrow('fail 3');
    await vi.runAllTimersAsync();
    await assertion;
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('stops early when shouldRetry says no', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('400 bad request'));
    const promise = retry(fn, { attempts: 5, baseDelayMs: 10, shouldRetry: () => false });
    await expect(promise).rejects.toThrow('400 bad request');
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
