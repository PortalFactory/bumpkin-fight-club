import { Player } from '../rooms/state/main';
import wearables from '../db/wearables.json'

export function getPower(player: Player): number {
    const clothing = Object.values(player.clothing) as string[];
    const power = wearables.reduce((result, current) =>
        clothing.indexOf(current.name) !== -1 ? result += current.power : result
    , 0);

    return power;
}
