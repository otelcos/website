/**
 * TCI (Telco Capability Index) error calculation utilities
 *
 * NOTE: TCI scores are now pre-calculated server-side and come from the
 * HuggingFace dataset. This file only contains error bar calculation logic.
 *
 * The TCI calculation was moved to a GitHub Action that runs after every
 * HuggingFace sync, using Python's dynamic IRT (Item Response Theory)
 * implementation for consistent cross-model comparisons.
 */

import { TCI_CONFIG } from '../constants/benchmarks';

/**
 * Calculate synthetic error based on score and benchmark difficulty
 *
 * Higher scores have lower error, lower scores have higher error.
 * Each benchmark has a different base error reflecting measurement uncertainty.
 *
 * @param score - The benchmark or TCI score
 * @param benchmarkKey - The benchmark identifier (e.g., 'teleqna', 'tci')
 * @returns Error margin value
 */
export function calculateError(score: number, benchmarkKey: string): number {
  const baseError = TCI_CONFIG.baseErrors[benchmarkKey] || 2.0;

  // Higher scores have lower error, lower scores have higher error
  return Math.round((baseError * (1 + (100 - score) / 200)) * 100) / 100;
}
