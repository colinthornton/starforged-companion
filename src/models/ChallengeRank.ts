export const enum ChallengeRank {
  Troublesome,
  Dangerous,
  Formiddable,
  Extreme,
  Epic,
}

export const challengeRanks: ChallengeRank[] = [
  ChallengeRank.Troublesome,
  ChallengeRank.Dangerous,
  ChallengeRank.Formiddable,
  ChallengeRank.Extreme,
  ChallengeRank.Epic,
];

export function getChallengeRankName(tier: ChallengeRank) {
  switch (tier) {
    case ChallengeRank.Troublesome:
      return "troublesome";
    case ChallengeRank.Dangerous:
      return "dangerous";
    case ChallengeRank.Formiddable:
      return "formiddable";
    case ChallengeRank.Extreme:
      return "extreme";
    case ChallengeRank.Epic:
      return "epic";
    default:
      throw new TypeError(`Expected tier to be of type ChallengeRank`);
  }
}
