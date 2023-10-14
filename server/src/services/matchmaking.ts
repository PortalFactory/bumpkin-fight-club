function weightedRand(weights: number[]): number {
  const r = Math.random();
  let sum = 0;

  for (let i = 0; i < weights.length - 1; i++) {
    sum += weights[i];
    if (r <= sum)
      return i;
  }
}

export function fight(players: any[]): any {
  const [fPlayer, sPlayer] = players;
  const totalValue = fPlayer.value + sPlayer.value;
  const weights = [
    fPlayer.value / totalValue,
    sPlayer.value / totalValue
  ];

  const res = weightedRand(weights);

  return players[res];
}
