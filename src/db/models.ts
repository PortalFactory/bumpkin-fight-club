import { Schema, model } from "mongoose";
import { IPlayer } from "../dto/protocol";

// Player

export const PlayerSchema = new Schema<IPlayer>({
  farmId: { type: Number, required: true },
  visitCount: { type: Number, required: true },
  wallet: { type: String, required: true },
  farm: { type: String, required: true },
});

export const Player = model<IPlayer>('Player', PlayerSchema);
