import { Room, Client } from "colyseus";
import { IncomingMessage } from "http";

import { Bumpkin } from "../dto/bumpkin";
import { LoginParams } from "../dto/protocol";
import { onPlayerFightDb, onPlayerJoinDb } from "../db/db";
import { Clothing, InputData, Message, RoomState, Player } from "./state/main";
import { getPower } from "../services/wearable";
import { fight } from "../services/matchmaking";

const MAX_MESSAGES = 100;

export class MainRoom extends Room<RoomState> {
  fixedTimeStep = 1000 / 60;

  maxClients: number = 150;

  private pushMessage = (message: Message) => {
    this.state.messages.push(message);

    while (this.state.messages.length > MAX_MESSAGES) {
      this.state.messages.shift();
    }
  };

  onCreate(options: any) {
    console.log("room", this.roomId, "creating...");
    this.setState(new RoomState());

    this.onMessage(0, (client, input) => {
      // handle player input
      const player = this.state.players.get(client.sessionId);

      // enqueue input to user input buffer.
      player?.inputQueue.push(input);
    });

    this.onMessage("fight_request", async (client, input) => {
      const player = this.state.players.get(client.sessionId);

      if (player.fights < 1) return;

      const opponent = this.state.players.get(input.sessionId);

      const score = fight([player, opponent]);

      player.fights--;
      player.won += score >= 0 ? 1 : 0;
      player.lost += score < 0 ? 1 : 0;
      player.score += score;

      await onPlayerFightDb(player.farmId, score);
    });

    let elapsedTime = 0;
    this.setSimulationInterval((deltaTime) => {
      elapsedTime += deltaTime;

      while (elapsedTime >= this.fixedTimeStep) {
        elapsedTime -= this.fixedTimeStep;
        this.fixedTick(this.fixedTimeStep);
      }
    });
  }

  fixedTick(timeStep: number) {
    const velocity = 1.68;

    this.state.players.forEach((player, key) => {
      let input: InputData | undefined;

      // dequeue player inputs.
      while ((input = player.inputQueue.shift())) {
        if (input.x || input.y) {
          player.x = input.x;
          player.y = input.y;
        }

        if (input.sceneId) {
          player.sceneId = input.sceneId;
        }

        if (input.clothing) {
          player.clothing = new Clothing({
            body: input.clothing.body,
            shirt: input.clothing.shirt,
            pants: input.clothing.pants,
            onesie: input.clothing.onesie,
            wings: input.clothing.wings,
            suit: input.clothing.suit,
            dress: input.clothing.dress,
            hat: input.clothing.hat,
            hair: input.clothing.hair,
            updatedAt: Date.now(),
          });
        }

        player.tick = input.tick;

        if (input.text) {
          const message = new Message();
          message.sceneId = player.sceneId;
          message.text = input.text;
          message.sessionId = key;
          message.farmId = player.farmId;
          message.sentAt = Date.now();
          this.pushMessage(message);
        }
      }
    });
  }

  async onAuth(
    client: Client,
    options: {
      jwt: string;
      farmId: number;
      bumpkin: Bumpkin;
      sceneId: string;
      experience: number;
    },
    request?: IncomingMessage | undefined
  ) {
    return {
      bumpkin: options.bumpkin,
      farmId: options.farmId,
      sceneId: options.sceneId,
      experience: options.experience,
    };
  }

  async onJoin(
    client: Client,
    options: LoginParams,
    auth: {
      bumpkin: Bumpkin;
      farmId: number;
      sceneId: string;
      experience: number;
    }
  ) {
    this.loadPlayerData(client, options);
    await onPlayerJoinDb(auth.farmId);

    console.log(auth.farmId, " joined");
  }

  onLeave(client: Client, consented: boolean) {
    this.state.players.delete(client.sessionId);

    console.log("player left");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

  loadPlayerData(client: Client, params: LoginParams) {
    const player = new Player();
    player.sceneId = params.sceneId;
    player.farmId = params.farmId;
    player.experience = params.experience ?? 0;

    const equipped = params.bumpkin.equipped;
    player.clothing.background = equipped.background;
    player.clothing.body = equipped.body;
    player.clothing.coat = equipped.coat;
    player.clothing.dress = equipped.dress;
    player.clothing.hair = equipped.hair;
    player.clothing.hat = equipped.hat;
    player.clothing.necklace = equipped.necklace;
    player.clothing.onesie = equipped.onesie;
    player.clothing.pants = equipped.pants;
    player.clothing.secondaryTool = equipped.secondaryTool;
    player.clothing.shirt = equipped.shirt;
    player.clothing.shoes = equipped.shoes;
    player.clothing.suit = equipped.suit;
    player.clothing.tool = equipped.tool;
    player.clothing.wings = equipped.wings;

    player.power = getPower(equipped);

    this.state.players.set(client.sessionId, player);
  }
}
