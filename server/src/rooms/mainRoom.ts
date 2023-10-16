import { Room, Client } from "colyseus";
import { IncomingMessage } from "http";

import { Bumpkin } from "../types/bumpkin";
import { connect, isConnected, getDatabase } from "../db/client";
import { logVisit } from "../db/logger";
import { Clothing, InputData, Message, RoomState, Player } from "./state/main";

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

    this.onMessage("load_player_data", async (client, input) => {
      this.loadPlayerData(client, input);
    });

    this.onMessage("quest_event", async (client, input) => {
      const player = this.state.players.get(client.sessionId);
      if (!player) return;
      if (!isConnected()) connect();

      const player_data = await this.playersCollection.findOne({
        farmId: player.farmId,
      });

      if (!player_data) return;
      if (!player_data.quests.season_1) player_data.quests.season_1 = {};
      if (!player_data.quests.season_2) player_data.quests.season_2 = {};

      player_data.quests = input;

      await this.playersCollection.updateOne(
        { farmId: player.farmId },
        { $set: player_data }
      );

      delete player_data._id;

      this.broadcast("player_data", player_data);
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
    client: Client<any>,
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
    await logVisit(auth.farmId);

    if (!isConnected()) {
      connect();
    }

    console.log(auth.farmId, " joined");
  }

  onLeave(client: Client, consented: boolean) {
    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

  async loadPlayerData(
    client: Client,
    {
      options,
      auth,
    }: {
      options: { x: number; y: number };
      auth: {
        bumpkin: Bumpkin;
        farmId: number;
        sceneId: string;
        experience: number;
      };
    }
  ) {
    const db_data = await this.playersCollection.findOne({
      farmId: auth.farmId,
    });

    this.farmConnections[auth.farmId] = client.sessionId;

    const player = new Player();
    player.x = options.x ?? 567;
    player.y = options.y ?? 770;
    player.farmId = auth.farmId;
    player.experience = auth.experience ?? 0;

    const clothing = auth.bumpkin.equipped;
    player.clothing.body = clothing.body;
    player.clothing.shirt = clothing.shirt;
    player.clothing.pants = clothing.pants;
    player.clothing.onesie = clothing.onesie;
    player.clothing.suit = clothing.suit;
    player.clothing.dress = clothing.dress;
    player.clothing.hat = clothing.hat;
    player.clothing.hair = clothing.hair;
    player.clothing.wings = clothing.wings;

    player.sceneId = auth.sceneId;

    this.state.players.set(client.sessionId, player);

    delete db_data._id;

    if (!db_data.assets) db_data.assets = [];
    if (!db_data.quests) db_data.quests = { season_1: {}, season_2: {} };

    this.broadcast("player_data", db_data);
  }
}
