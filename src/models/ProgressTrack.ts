import { ChallengeTier } from "./ChallengeTier";

export type ProgressTrack = {
  name: string;
  challengeTier: ChallengeTier;
  ticks: number;
};

export const PROGRESS_TRACK_BOXES = 10;
export const PROGRESS_TRACK_TICKS_PER_BOX = 4;
export const PROGRESS_TRACK_TICKS_MIN = 0;
export const PROGRESS_TRACK_TICKS_MAX =
  PROGRESS_TRACK_BOXES * PROGRESS_TRACK_TICKS_PER_BOX;

export function markTicks(track: ProgressTrack): number {
  return Math.min(
    PROGRESS_TRACK_TICKS_MAX,
    track.ticks + getChallengeTierMarkValue(track.challengeTier)
  );
}

export function unmarkTicks(track: ProgressTrack): number {
  return Math.max(
    PROGRESS_TRACK_TICKS_MIN,
    track.ticks - getChallengeTierMarkValue(track.challengeTier)
  );
}

function getChallengeTierMarkValue(tier: ChallengeTier): number {
  switch (tier) {
    case ChallengeTier.Troublesome:
      return 12;
    case ChallengeTier.Dangerous:
      return 8;
    case ChallengeTier.Formiddable:
      return 4;
    case ChallengeTier.Extreme:
      return 2;
    case ChallengeTier.Epic:
      return 1;
    default:
      throw new TypeError(`Expected tier to be of type ChallengeTier`);
  }
}
