import { Schema, model } from "mongoose";

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
