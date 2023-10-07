import React from "react";
import ReactDOM from "react-dom";
import Phaser from "phaser";

// @ts-ignore
import * as env from "env";

import { UI } from "./UI";
import { eventManager } from "./lib/event-manager";
import { Label } from "./components/common/Label";
import { CommunityModals, DatabaseData } from "./models/types";
import { CustomNPCs } from "./lib/npcs";
import { CustomObjects } from "./lib/objects";
import { CustomAudio, CustomAudios } from "./lib/audio";
import { CustomObject } from "./models/objects";
import { CustomNPC } from "./models/npcs";

// Repo URL
const REPO_URL = "https://0xsacul.github.io/valoria-isle/";

// Community API
export const CommunityAPI = new window.CommunityAPI({
  id: env.COMMUNITY_ISLAND_ID,
  apiKey: env.COMMUNITY_ISLAND_API_KEY,
});

let isLoaded = false;

export default class ExternalScene extends window.BaseScene {
  constructor() {
    super({
      name: env.COMMUNITY_ISLAND_ID,
      map: {
        tilesetUrl: REPO_URL + "tileset.png" + `?v=${Date.now()}`,
      },
      player: {
        spawn: {
          x: 567,
          y: 770,
        },
      },
      mmo: {
        enabled: true,
        url: env.SERVER_URL,
        roomId: env.COMMUNITY_ISLAND_ID,
        serverId: env.SERVER_ROOM_ID,
      },
    });
  }

  preload() {
    super.preload();

    CustomNPCs.forEach((npc: CustomNPC) => {
      if (npc.isAnimated) {
        this.load.spritesheet(
          npc.id + "NPC",
          REPO_URL + npc.spritesheet + `?v=${Date.now()}`,
          {
            frameWidth: npc.sheet.width,
            frameHeight: npc.sheet.height,
          }
        );
      } else {
        this.load.image(
          npc.id + "NPC",
          REPO_URL + npc.spritesheet + `?v=${Date.now()}`
        );
      }
    });

    CustomObjects.forEach((obj: CustomObject) => {
      if (obj.isAnimated) {
        this.load.spritesheet(
          obj.id + "Object",
          REPO_URL + obj.spritesheet + `?v=${Date.now()}`,
          {
            frameWidth: obj.sheet.width,
            frameHeight: obj.sheet.height,
          }
        );
      } else {
        this.load.image(
          obj.id + "Object",
          REPO_URL + obj.spritesheet + `?v=${Date.now()}`
        );
      }
    });

    CustomAudios.forEach((audio: CustomAudio) => {
      this.load.audio(audio.id, REPO_URL + audio.url + `?v=${Date.now()}`);
    });
  }

  create() {
    super.create();

    ReactDOM.render(
      React.createElement(UI, { scene: this }),
      document.getElementById("community-root")
    );

    CustomNPCs.forEach((npc) => {
      this.PlaceCustomNPC(npc);
    });

    CustomObjects.forEach((obj) => {
      this.PlaceCustomObject(obj);
    });

    // const ambient = this.sound.add("ambient");
    // ambient.setLoop(true);
    // ambient.setVolume(0.05);
    // ambient.play();
  }

  unMountUI() {
    ReactDOM.render(
      React.createElement("div", null, null),
      document.getElementById("community-root")
    );
  }

  update() {
    super.update();

    if (!isLoaded) {
      this.input.keyboard.enabled = false;
    }

    if (!this.playerDatalistener) {
      this.playerDatalistener = this.mmoService.state.context.server?.onMessage(
        "player_data",
        (data: DatabaseData) => {
          if (!isLoaded) {
            isLoaded = true;
            this.input.keyboard.enabled = true;
            eventManager.emit("loading", false);
          }

          this.updateUserData(data);
        }
      );
    }

    // if (!this.leaveListener) {
    //   this.leaveListener = this.mmoService.state.context.server?.onLeave(() => {
    //     console.error("Lost connection to server");
    //     eventManager.emit("lostConnection");
    //   });
    // }

    if (!this.idkWhyIHaveToListenToThis) {
      this.idkWhyIHaveToListenToThis =
        this.mmoService.state.context.server?.onMessage(
          "__playground_message_types",
          () => {}
        );
    }
  }

  PlaceCustomNPC(npc: CustomNPC) {
    const custom_npc = this.add.sprite(npc.x, npc.y, npc.id + "NPC");
    custom_npc.name = npc.id + "Object";
    if (npc.isAnimated) {
      if (!this.anims.anims.entries[npc.id + "_anim"]) {
        this.anims.create({
          key: npc.id + "_anim",
          frames: this.anims.generateFrameNumbers(npc.id + "NPC", {
            start: npc.sheet.frames?.start,
            end: npc.sheet.frames?.end,
          }),
          frameRate: npc.sheet.frames?.rate,
          repeat: -1,
        });
      }

      custom_npc.play(npc.id + "_anim", true);
    }
    custom_npc.setDepth(2);
    custom_npc.setInteractive();
    custom_npc.on("pointerover", () => {
      this.input.setDefaultCursor("pointer");
    });
    custom_npc.on("pointerout", () => {
      this.input.setDefaultCursor("default");
    });

    if (npc.modal) {
      custom_npc.on("pointerdown", () => {
        if (npc.id !== "boat" && this.CheckPlayerDistance(npc.x, npc.y)) return;

        window.openModal(npc.modal as CommunityModals);
      });
    } else {
      custom_npc.on("pointerdown", () => {
        if (npc.id !== "boat" && this.CheckPlayerDistance(npc.x, npc.y)) return;
        if (npc.onClick) npc.onClick();
      });
    }

    if (npc.name) {
      const label = new Label(this as any, npc.name);
      this.add.existing(label);
      label.setPosition(custom_npc.x, custom_npc.y - 15);
      label.setDepth(1);

      const npcBox = this.add.rectangle(
        custom_npc.x,
        custom_npc.y,
        25,
        25,
        0x000000,
        0
      );

      this.physics.add.existing(npcBox, true);
      this.physics.add.collider(this.currentPlayer, npcBox);
    }
  }

  PlaceCustomObject(obj: CustomObject) {
    const custom_obj = this.add.sprite(obj.x, obj.y, obj.id + "Object");
    custom_obj.name = obj.id + "Object";
    if (obj.isAnimated) {
      if (!this.anims.anims.entries[obj.id + "_anim"]) {
        this.anims.create({
          key: obj.id + "_anim",
          frames: this.anims.generateFrameNumbers(obj.id + "Object", {
            start: obj.sheet.frames?.start,
            end: obj.sheet.frames?.end,
          }),
          frameRate: obj.sheet.frames?.rate,
          repeat: obj.sheet.loop ? -1 : 0,
        });
      }

      if (!obj.hideByDefault && !obj.idle) {
        custom_obj.play(obj.id + "_anim", true);
      }
    }
    custom_obj.setDepth(2);

    if (obj.interactable) {
      custom_obj.setInteractive();
      custom_obj.on("pointerover", () => {
        this.input.setDefaultCursor("pointer");
      });
      custom_obj.on("pointerout", () => {
        this.input.setDefaultCursor("default");
      });
    }

    if (obj.modal) {
      custom_obj.on("pointerdown", () => {
        if (obj.id !== "boat" && this.CheckPlayerDistance(obj.x, obj.y)) return;

        window.openModal(obj.modal as CommunityModals);
      });
    } else {
      custom_obj.on("pointerdown", () => {
        if (obj.id !== "boat" && this.CheckPlayerDistance(obj.x, obj.y)) return;

        if (obj.onClick) obj.onClick();
      });
    }

    if (!obj.noCollision) {
      const objBox = this.add.rectangle(
        custom_obj.x,
        custom_obj.y + 10,
        25,
        35,
        0x000000,
        0
      );

      this.physics.add.existing(objBox, true);
      this.physics.add.collider(this.currentPlayer, objBox);
    }

    if (obj.hideByDefault) {
      custom_obj.setVisible(false);
    }
  }

  updateUserData(db_data: DatabaseData) {
    if (!db_data) {
      return;
    }

    if (db_data.farmId !== this.mmoService.state.context.farmId) {
      return;
    }

    if (db_data.canAccess === false) {
      eventManager.emit("banned");
      return;
    }

    const playerWardrobe = CommunityAPI.game.wardrobe;

    this.currentPlayer.db_data = db_data;

    this.updateUserMapSettings(db_data);
  }

  CheckPlayerDistance(x: number, y: number) {
    const player_distance = Phaser.Math.Distance.Between(
      this.currentPlayer.x,
      this.currentPlayer.y,
      x,
      y
    );
    return player_distance > 40;
  }

  PlaySound(sound_name: string, volume?: number) {
    const sound = this.sound.add(sound_name);
    if (!sound) return;

    if (this.currentSound) {
      this.currentSound.stop();
    }
    this.currentSound = sound;

    const ambient = this.sound.sounds.find(
      (sound: { key: string }) => sound.key === "ambient"
    ) as Phaser.Sound.WebAudioSound;
    ambient.pause();

    if (volume) sound.setVolume(volume);
    sound.play();

    sound.once("complete", () => {
      ambient.resume();
    });
  }

  updateUserMapSettings(db_data: DatabaseData) {}

  sendPlayerToSpawn() {
    eventManager.emit("dialogue", "");
    this.cameras.main.fadeOut(1000, 0, 0, 0);
    this.cameras.main.once(
      Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
      () => {
        this.currentPlayer.x = 567;
        this.currentPlayer.y = 770;
        setTimeout(() => {
          this.cameras.main.fadeIn(1000, 0, 0, 0);
        }, 1000);
      }
    );
  }

  killBudsPopup() {}
}

window.ExternalScene = ExternalScene;
