import wearables from "../db/wearables.json";
import { Equipped } from "../dto/bumpkin";

export function getPower(equipped: Equipped): number {
  const clothes = Object.values(equipped) as string[];
  const power = wearables.reduce(
    (result, current) =>
      clothes.indexOf(current.name) !== -1 ? (result += current.power) : result,
    0
  );

  return power;
}
