import { npcModalManager } from "../components/NPCModal";
import { CustomObject } from "../models/objects";
import { eventManager } from "./event-manager";

export const CustomObjects: CustomObject[] = [
  {
    id: "boat",
    x: 520,
    y: 840,
    spritesheet: "/assets/objects/Boat.png",
    isAnimated: false,
    sheet: {
      width: 80,
      height: 48,
    },
    modal: {
      type: "speaking",
      messages: [
        {
          text: "Howdy young traveler! Jump in if you want to go home!",
          actions: [
            {
              text: "Go Home",
              cb: () => {
                eventManager.emit("unmountUI");
                window.history.back();
              },
            },
          ],
        },
      ],
    },
    noCollision: true,
    interactable: true,
  },
  {
    id: "boat_smoke",
    x: 480,
    y: 810,
    spritesheet: "/assets/objects/BoatSmoke.png",
    isAnimated: true,
    sheet: {
      frames: {
        start: 0,
        end: 29,
        rate: 10,
      },
      width: 24,
      height: 19,
      loop: true,
    },
    noCollision: true,
  },
  {
    id: "spawn_wooden_sign",
    x: 600,
    y: 730,
    spritesheet: "/assets/objects/WoodenSign.png",
    isAnimated: false,
    sheet: {
      width: 16,
      height: 15,
    },
    modal: {
      type: "speaking",
      messages: [
        {
          text: "Welcome to Community Island!",
        },
      ],
    },
    interactable: true,
    noCollision: true,
  },
];
