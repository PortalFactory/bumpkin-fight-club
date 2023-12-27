import { Schema, model } from "mongoose";
import { IPlayer } from "../dto/protocol";

// Player

export const PlayerSchema = new Schema<IPlayer>({
  farmId: { type: Number, required: true },
  visitCount: { type: Number, required: true },
  wallet: { type: String, required: true },
  farm: { type: String, required: true },
  fights: { type: Number, required: true },
  won: { type: Number, required: true },
  lost: { type: Number, required: true },
  score: { type: Number, required: true },
});

export const Player = model<IPlayer>('Player', PlayerSchema);
