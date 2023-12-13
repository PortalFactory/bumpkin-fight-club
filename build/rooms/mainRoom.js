"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainRoom = void 0;
const colyseus_1 = require("colyseus");
const client_1 = require("../db/client");
const logger_1 = require("../db/logger");
const main_1 = require("./state/main");
const MAX_MESSAGES = 100;
class MainRoom extends colyseus_1.Room {
    constructor() {
        super(...arguments);
        this.fixedTimeStep = 1000 / 60;
        this.maxClients = 150;
        this.database = (0, client_1.getDatabase)();
        this.playersCollection = this.database.collection("players");
        this.pushMessage = (message) => {
            this.state.messages.push(message);
            while (this.state.messages.length > MAX_MESSAGES) {
                this.state.messages.shift();
            }
        };
        // Farm ID > sessionId
        this.farmConnections = {};
    }
    onCreate(options) {
        console.log("room", this.roomId, "creating...");
        this.setState(new main_1.RoomState());
        // set map dimensions
        (this.state.mapWidth = 600), (this.state.mapHeight = 600);
        this.onMessage(0, (client, input) => {
            // handle player input
            const player = this.state.players.get(client.sessionId);
            // enqueue input to user input buffer.
            player?.inputQueue.push(input);
        });
        this.onMessage("login", async (client, input) => {
            this.loadPlayerData(client, input);
        });
        this.onMessage("fight_request", async (client, input) => { });
        this.onMessage("fight_confirm", async (client, input) => { });
        this.onMessage("fight_reject", async (client, input) => { });
        let elapsedTime = 0;
        this.setSimulationInterval((deltaTime) => {
            elapsedTime += deltaTime;
            while (elapsedTime >= this.fixedTimeStep) {
                elapsedTime -= this.fixedTimeStep;
                this.fixedTick(this.fixedTimeStep);
            }
        });
    }
    fixedTick(timeStep) {
        const velocity = 1.68;
        this.state.players.forEach((player, key) => {
            let input;
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
                    player.clothing = new main_1.Clothing({
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
                    const message = new main_1.Message();
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
    async onAuth(client, options, request) {
        return {
            bumpkin: options.bumpkin,
            farmId: options.farmId,
            sceneId: options.sceneId,
            experience: options.experience,
        };
    }
    async onJoin(client, options, auth) {
        // TODO: Get rid of this shit
        await (0, logger_1.logVisit)(auth.farmId);
        console.log(auth.farmId, " joined");
    }
    onLeave(client, consented) {
        this.state.players.delete(client.sessionId);
    }
    onDispose() {
        console.log("room", this.roomId, "disposing...");
    }
    async loadPlayerData(client, params) {
        const dbPlayer = await this.playersCollection.findOne({
            farmId: params.farmId,
        });
        this.farmConnections[params.farmId] = client.sessionId;
        const player = new main_1.Player();
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
        const power = 100; // TODO: Count from DB
        player.power = power;
        player.sceneId = params.sceneId;
        this.state.players.set(client.sessionId, player);
        delete dbPlayer._id;
        this.broadcast("login", {
            canAccess: true,
            ...dbPlayer,
            power,
        });
    }
}
exports.MainRoom = MainRoom;
