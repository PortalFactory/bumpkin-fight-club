import { Interpreter } from "xstate";
import { Client, Room } from "colyseus.js";

import ExternalScene from "../Scene";
import { Bumpkin } from "@dto/bumpkin";

declare global {
  interface Window {
    BaseScene: any;
    createToast: (toast: CommunityToast) => void;
    openModal: (modal: CommunityModal) => void;
    closeModal: () => void;
    CommunityAPI: CommunityAPIConstructor;
    ExternalScene: typeof ExternalScene;
  }
}

type CommunityToast = {
  id: string;
  text: string;
  item?: string;
};

export type CommunityModal = {
  type: "speaking" | "loading";
  messages?: {
    text: string;
    actions?: { text: string; cb: () => void }[];
  }[];
};

type CommunityAPICallRecord = Record<string, number>;

interface CommunityAPICall {
  metadata: string;
  wearables?: CommunityAPICallRecord;
  items?: CommunityAPICallRecord;
}

interface CommunityAPI {
  mint: (mint: CommunityAPICall) => Promise<void>;
  burn: (burn: CommunityAPICall) => Promise<void>;
  game: {
    inventory: Partial<Record<string, number>>;
    wardrobe: Partial<Record<string, number>>;
  };
  user: {
    farmId: number;
  };
}

interface CommunityAPIConstructor {
  new (config: { id: string; apiKey: string }): CommunityAPI;
}

export type MachineInterpreter = Interpreter<
  MMOContext,
  any,
  MMOEvent,
  any,
  any
>;

export interface MMOContext {
  jwt: string;
  farmId: number;
  bumpkin: Bumpkin;
  client?: Client;
  // availableServers: Server[];
  server?: Room<ExternalScene> | undefined;
  serverId: string;
  initialSceneId: string;
  experience: number;
  isCommunity?: boolean;
  moderation: Moderation;
}

export type Moderation = {
  muted: {
    mutedAt: number;
    mutedBy: number;
    reason: string;
    mutedUntil: number;
  }[];
  kicked: {
    kickedAt: number;
    kickedBy: number;
    reason: string;
  }[];
};

export type PickServer = {
  type: "PICK_SERVER";
  serverId: string;
};

export type ConnectEvent = {
  type: "CONNECT";
  url: string;
  serverId: string;
};

export type MMOEvent =
  | PickServer
  | { type: "CONTINUE" }
  | { type: "DISCONNECTED" }
  | { type: "RETRY" }
  | ConnectEvent;
