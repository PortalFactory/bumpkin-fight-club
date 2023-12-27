import { Bumpkin } from "./bumpkin";

export interface IPlayer {
  farmId: number;
  visitCount: number;
  wallet: string;
  farm: string;
  fights: number;
  won: number;
  lost: number;
  score: number;
}

export interface LoginParams {
  bumpkin: Bumpkin;
  farmId: number;
  experience: number;
}

export interface LoginData extends IPlayer {
  power: number;
  canAccess: boolean;
}
