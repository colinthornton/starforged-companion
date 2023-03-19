export const enum ChallengeTier {
  Troublesome,
  Dangerous,
  Formiddable,
  Extreme,
  Epic,
}

export const challengeTiers: ChallengeTier[] = [
  ChallengeTier.Troublesome,
  ChallengeTier.Dangerous,
  ChallengeTier.Formiddable,
  ChallengeTier.Extreme,
  ChallengeTier.Epic,
];

export function getChallengeTierName(tier: ChallengeTier) {
  switch (tier) {
    case ChallengeTier.Troublesome:
      return "troublesome";
    case ChallengeTier.Dangerous:
      return "dangerous";
    case ChallengeTier.Formiddable:
      return "formiddable";
    case ChallengeTier.Extreme:
      return "extreme";
    case ChallengeTier.Epic:
      return "epic";
    default:
      throw new TypeError(`Expected tier to be of type ChallengeTier`);
  }
}
