import { ChallengeRank } from "./ChallengeRank";

export type ProgressTrack = {
  name: string;
  challengeRank: ChallengeRank;
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
    track.ticks + getChallengeRankMarkValue(track.challengeRank)
  );
}

export function unmarkTicks(track: ProgressTrack): number {
  return Math.max(
    PROGRESS_TRACK_TICKS_MIN,
    track.ticks - getChallengeRankMarkValue(track.challengeRank)
  );
}

function getChallengeRankMarkValue(rank: ChallengeRank): number {
  switch (rank) {
    case ChallengeRank.Troublesome:
      return 12;
    case ChallengeRank.Dangerous:
      return 8;
    case ChallengeRank.Formiddable:
      return 4;
    case ChallengeRank.Extreme:
      return 2;
    case ChallengeRank.Epic:
      return 1;
    default:
      throw new TypeError(`Expected rank to be of type ChallengeRank`);
  }
}
