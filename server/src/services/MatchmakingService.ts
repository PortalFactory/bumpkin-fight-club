import { BumpinFightClubDB } from "../db/BumpkinFightClubDB";

export class MatchmakingService {
  constructor(private db: BumpinFightClubDB) {}

  fight(players: any[]): any {
    const [fPlayer, sPlayer] = players;
    const totalValue = fPlayer.value + sPlayer.value;
    const weights = [
      fPlayer.value / totalValue,
      sPlayer.value / totalValue
    ];

    const res = this.weightedRand(weights);

    return players[res];
  }

  private weightedRand(weights: number[]): number {
    const r = Math.random();
    let sum = 0;

    for (let i = 0; i < weights.length - 1; i++) {
      sum += weights[i];
      if (r <= sum)
        return i;
    }
  }
}
