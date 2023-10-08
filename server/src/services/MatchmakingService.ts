import { BumpinFightClubDB } from "../db/BumpkinFightClubDB";

type FightResult = {
  win: any;
  lose: any;
};

export class MatchmakingService {
  constructor(private db: BumpinFightClubDB) {}

  fight(fPlayer: any, sPlayer: any): FightResult {
    const totalValue = fPlayer.value + sPlayer.value;
    const weights = [
      fPlayer.value * 100 / totalValue,
      sPlayer.value * 100 / totalValue
    ];
    const counts: number[] = [];

    Array.from({ length: 1000000 }, () => this.randomSample(weights)).forEach(value => counts[value]++);

    return counts[0] > counts[1] ? {
      win: fPlayer,
      lose: sPlayer
    } : {
      win: sPlayer,
      lose: fPlayer
    };
  }

  private randomSample(weights: number[]): number {
    let sample = Math.random() * weights.reduce((sum, weight) => sum + weight, 0);
    const value = weights.find(weight => (sample -= weight) < 0);
    return value;
  }
}
