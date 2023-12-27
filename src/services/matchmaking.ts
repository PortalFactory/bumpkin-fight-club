import { Player } from '../rooms/state/main';

function weightedRand(weights: number[]): number {
  const r = Math.random();
  let sum = 0;

  for (let i = 0; i < weights.length - 1; i++) {
    sum += weights[i];
    if (r <= sum)
      return i;
  }
}

export function fight(players: Player[]): number {
  const [fPlayer, sPlayer] = players;
  const totalValue = fPlayer.power + sPlayer.power;
  const weights = [
    fPlayer.power / totalValue,
    sPlayer.power / totalValue
  ];

  const res = weightedRand(weights);

  return res === 0 ? 100 : -100;
}
