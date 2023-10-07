export type NPCName = "";

export type CustomNPC = {
  id: string;
  x: number;
  y: number;
  name?: string;
  isAnimated: boolean;
  spritesheet: string;
  sheet: {
    frames?: {
      start: number;
      end: number;
      rate: number;
    };
    width: number;
    height: number;
  };
  modal?: {
    type: string;
    messages: {
      text: string;
      actions?: {
        text: string;
        cb: () => void;
      }[];
    }[];
  };
  onClick?: () => void;
};
