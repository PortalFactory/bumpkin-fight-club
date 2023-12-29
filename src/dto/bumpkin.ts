import { Equipped } from "./wearables";

export type Bumpkin = {
  id: number;
  equipped: Equipped;
  tokenUri: string;
  experience: number;
  skills: Partial<Record<string, number>>;
  achievements?: Partial<Record<string, number>>;
  activity?: Partial<Record<string, number>>;
};
