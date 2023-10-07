export type CustomObject = {
  id: string;
  x: number;
  y: number;
  spritesheet: string;
  sheet: {
    frames?: {
      start: number;
      end: number;
      rate: number;
    };
    width: number;
    height: number;
    loop?: boolean;
  };
  isAnimated: boolean;
  idle?: boolean;
  onClick?: () => void;
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
  noCollision?: boolean;
  interactable?: boolean;
  hideByDefault?: boolean;
};
