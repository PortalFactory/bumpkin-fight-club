"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fight = void 0;
function weightedRand(weights) {
    const r = Math.random();
    let sum = 0;
    for (let i = 0; i < weights.length - 1; i++) {
        sum += weights[i];
        if (r <= sum)
            return i;
    }
}
function fight(players) {
    const [fPlayer, sPlayer] = players;
    const totalValue = fPlayer.value + sPlayer.value;
    const weights = [
        fPlayer.value / totalValue,
        sPlayer.value / totalValue
    ];
    const res = weightedRand(weights);
    return players[res];
}
exports.fight = fight;
