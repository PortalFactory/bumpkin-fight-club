export interface Clothing {
  body: string;
  hat?: string;
  hair: string;
  shirt: string;
  pants: string;
  tool?: string;
}

export type DatabaseData = {
  farmId: number;
  visitCount: number;
  wallet: string;
  farm: string;
  canAccess: boolean;
  assets: Array<any>;
};
