import { Room, Client } from "colyseus";
import { IncomingMessage } from "http";

import { Bumpkin } from "@dto/bumpkin";
import { IPlayer, LoginParams } from "@dto/protocol";
import { getDatabase } from "../db/client";
import { logVisit } from "../db/logger";
import { Clothing, InputData, Message, RoomState, Player } from "./state/main";
import { WithId } from "mongodb";

const MAX_MESSAGES = 100;

export class MainRoom extends Room<RoomState> {
  fixedTimeStep = 1000 / 60;

  maxClients: number = 150;

  private database = getDatabase();
  private playersCollection = this.database.collection("players");

  private pushMessage = (message: Message) => {
    this.state.messages.push(message);

    while (this.state.messages.length > MAX_MESSAGES) {
      this.state.messages.shift();
    }
  };

  // Farm ID > sessionId
  private farmConnections: Record<number, string> = {};

  onCreate(options: any) {
    console.log("room", this.roomId, "creating...");
    this.setState(new RoomState());

    // set map dimensions
    (this.state.mapWidth = 600), (this.state.mapHeight = 600);

    this.onMessage(0, (client, input) => {
      // handle player input
      const player = this.state.players.get(client.sessionId);

      // enqueue input to user input buffer.
      player?.inputQueue.push(input);
    });

    this.onMessage("login", async (client, input: LoginParams) => {
      this.loadPlayerData(client, input);
    });

    this.onMessage("fight_request", async (client, input) => {});

    this.onMessage("fight_confirm", async (client, input) => {});

    this.onMessage("fight_reject", async (client, input) => {});

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
    options: { x: number; y: number },
    auth: {
      bumpkin: Bumpkin;
      farmId: number;
      sceneId: string;
      experience: number;
    }
  ) {
    // TODO: Get rid of this shit
    await logVisit(auth.farmId);

    console.log(auth.farmId, " joined");
  }

  onLeave(client: Client, consented: boolean) {
    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

  async loadPlayerData(client: Client, params: LoginParams) {
    const dbPlayer = await this.playersCollection.findOne<WithId<IPlayer>>({
      farmId: params.farmId,
    });

    this.farmConnections[params.farmId] = client.sessionId;

    const player = new Player();
    player.x = params.x ?? 567;
    player.y = params.y ?? 770;
    player.farmId = params.farmId;
    player.experience = params.experience ?? 0;

    const clothing = params.bumpkin.equipped;
    player.clothing.body = clothing.body;
    player.clothing.shirt = clothing.shirt;
    player.clothing.pants = clothing.pants;
    player.clothing.onesie = clothing.onesie;
    player.clothing.suit = clothing.suit;
    player.clothing.dress = clothing.dress;
    player.clothing.hat = clothing.hat;
    player.clothing.hair = clothing.hair;
    player.clothing.wings = clothing.wings;
    player.power = 100; // TODO: Count from DB

    player.sceneId = params.sceneId;

    this.state.players.set(client.sessionId, player);

    delete dbPlayer._id;

    this.broadcast("login", dbPlayer);
  }
}
