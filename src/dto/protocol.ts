import { Bumpkin } from "./bumpkin";

export interface IPlayer {
  farmId: number;
  visitCount: number;
  wallet: string;
  farm: string;
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
