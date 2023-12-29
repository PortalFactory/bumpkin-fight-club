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
  sceneId: string;
  bumpkin: Bumpkin;
  farmId: number;
  experience: number;
}

export interface LoginData extends IPlayer {
  power: number;
  canAccess: boolean;
}

export type RankData = {
    id: number;
    count: number;
    rank?: number;
  };

export interface LeaderboardData {
    topTen: RankData[];
    farmRankingDetails?: RankData[];
}
