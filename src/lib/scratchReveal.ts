export const SCRATCH_REVEAL_THRESHOLD = 0.35;
const TRANSPARENT_ALPHA_CUTOFF = 10;

/** Fraction (0-1) of the given alpha channel that is effectively transparent. */
export function computeClearedRatio(alphaChannel: Uint8ClampedArray): number {
  if (alphaChannel.length === 0) return 0;
  let clearedCount = 0;
  for (let i = 0; i < alphaChannel.length; i++) {
    if (alphaChannel[i] < TRANSPARENT_ALPHA_CUTOFF) clearedCount++;
  }
  return clearedCount / alphaChannel.length;
}

export function isScratchRevealed(
  alphaChannel: Uint8ClampedArray,
  threshold: number = SCRATCH_REVEAL_THRESHOLD
): boolean {
  return computeClearedRatio(alphaChannel) >= threshold;
}
