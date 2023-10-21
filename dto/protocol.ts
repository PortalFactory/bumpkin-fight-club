import { Bumpkin } from "./bumpkin";

export interface IPlayer {
  farmId: number;
  visitCount: number;
  wallet: string;
  farm: string;
}

export interface LoginParams {
  x: number;
  y: number;
  bumpkin: Bumpkin;
  farmId: number;
  sceneId: string;
  experience: number;
}

export interface LoginData extends IPlayer {
  power: number;
  canAccess: boolean;
}
