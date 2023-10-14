import { Schema, model } from "mongoose";

// Player

export interface IPlayer {
  farmId: string;
  visitCount: number;
  wallet: string;
  farm: string;
}

export const PlayerSchema = new Schema<IPlayer>({
  farmId: { type: String, required: true },
  visitCount: { type: Number, required: true },
  wallet: { type: String, required: true },
  farm: { type: String, required: true },
});

export const Player = model<IPlayer>('Player', PlayerSchema);

// Wearable

export interface IWearable {
  item: string;
  power: number;
}

export const WearableSchema = new Schema<IWearable>({
  item: { type: String, required: true },
  power: { type: Number, required: true },
});

export const Wearable = model<IWearable>('Wearable', WearableSchema);
