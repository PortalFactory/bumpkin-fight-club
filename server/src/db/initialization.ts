import { ITEM_IDS } from "../types/bumpkin";
import { Wearable } from "./models";

export async function dbWearablesInit(): Promise<void> {
  for (const item in ITEM_IDS) {
    await new Wearable({
      item,
      power: 0
    }).save();
  }
}
