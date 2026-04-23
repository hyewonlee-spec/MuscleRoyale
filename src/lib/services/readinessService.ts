import type { DailyCheckin } from '../types';

type ReadinessLabel = 'low' | 'moderate' | 'good' | 'high';

function normalise(value?: number): number {
  return value ?? 3;
}

export const readinessService = {
  calculateReadiness(input: Partial<DailyCheckin>): { score: number; label: ReadinessLabel; message: string } {
    const energy = normalise(input.energy);
    const sleep = normalise(input.sleepQuality);
    const stress = 6 - normalise(input.stress);
    const soreness = 6 - normalise(input.soreness);
    const motivation = normalise(input.motivation);

    let score = Math.round(((energy + sleep + stress + soreness + motivation) / 25) * 100);

    if (input.painPresent) score -= 10;
    score = Math.max(0, Math.min(100, score));

    let label: ReadinessLabel = 'moderate';
    if (score >= 80) label = 'high';
    else if (score >= 65) label = 'good';
    else if (score < 45) label = 'low';

    return {
      score,
      label,
      message: this.getMessage(label, !!input.painPresent),
    };
  },

  getMessage(label: ReadinessLabel, painPresent: boolean): string {
    if (painPresent) return 'Pain is flagged today. Train with more care and fewer risks.';
    if (label === 'high') return 'Good for a normal session. Lean into quality work today.';
    if (label === 'good') return 'You should be fine for a steady session today.';
    if (label === 'moderate') return 'Keep it simple and adjust as you warm up.';
    return 'Lower energy today. Reduce intensity and keep the session tidy.';
  },
};
