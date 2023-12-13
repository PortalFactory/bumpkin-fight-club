"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomState = exports.Trade = exports.Message = exports.Player = exports.Clothing = void 0;
const schema_1 = require("@colyseus/schema");
class Clothing extends schema_1.Schema {
}
exports.Clothing = Clothing;
__decorate([
    (0, schema_1.type)("string")
], Clothing.prototype, "body", void 0);
__decorate([
    (0, schema_1.type)("string")
], Clothing.prototype, "shirt", void 0);
__decorate([
    (0, schema_1.type)("string")
], Clothing.prototype, "pants", void 0);
__decorate([
    (0, schema_1.type)("string")
], Clothing.prototype, "hat", void 0);
__decorate([
    (0, schema_1.type)("string")
], Clothing.prototype, "suit", void 0);
__decorate([
    (0, schema_1.type)("string")
], Clothing.prototype, "onesie", void 0);
__decorate([
    (0, schema_1.type)("string")
], Clothing.prototype, "dress", void 0);
__decorate([
    (0, schema_1.type)("string")
], Clothing.prototype, "hair", void 0);
__decorate([
    (0, schema_1.type)("string")
], Clothing.prototype, "wings", void 0);
__decorate([
    (0, schema_1.type)("number")
], Clothing.prototype, "updatedAt", void 0);
class Player extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.clothing = new Clothing();
        this.inputQueue = [];
    }
}
exports.Player = Player;
__decorate([
    (0, schema_1.type)("string")
], Player.prototype, "sceneId", void 0);
__decorate([
    (0, schema_1.type)("number")
], Player.prototype, "farmId", void 0);
__decorate([
    (0, schema_1.type)("number")
], Player.prototype, "experience", void 0);
__decorate([
    (0, schema_1.type)("number")
], Player.prototype, "x", void 0);
__decorate([
    (0, schema_1.type)("number")
], Player.prototype, "y", void 0);
__decorate([
    (0, schema_1.type)("number")
], Player.prototype, "tick", void 0);
__decorate([
    (0, schema_1.type)("string")
], Player.prototype, "npc", void 0);
__decorate([
    (0, schema_1.type)("number")
], Player.prototype, "power", void 0);
__decorate([
    (0, schema_1.type)(Clothing)
], Player.prototype, "clothing", void 0);
class Message extends schema_1.Schema {
}
exports.Message = Message;
__decorate([
    (0, schema_1.type)("string")
], Message.prototype, "text", void 0);
__decorate([
    (0, schema_1.type)("string")
], Message.prototype, "sessionId", void 0);
__decorate([
    (0, schema_1.type)("number")
], Message.prototype, "farmId", void 0);
__decorate([
    (0, schema_1.type)("number")
], Message.prototype, "sentAt", void 0);
__decorate([
    (0, schema_1.type)("string")
], Message.prototype, "sceneId", void 0);
class Trade extends schema_1.Schema {
}
exports.Trade = Trade;
__decorate([
    (0, schema_1.type)("string")
], Trade.prototype, "text", void 0);
__decorate([
    (0, schema_1.type)("number")
], Trade.prototype, "sellerId", void 0);
__decorate([
    (0, schema_1.type)("number")
], Trade.prototype, "createdAt", void 0);
__decorate([
    (0, schema_1.type)("string")
], Trade.prototype, "tradeId", void 0);
__decorate([
    (0, schema_1.type)("number")
], Trade.prototype, "buyerId", void 0);
__decorate([
    (0, schema_1.type)("number")
], Trade.prototype, "boughtAt", void 0);
__decorate([
    (0, schema_1.type)("string")
], Trade.prototype, "sceneId", void 0);
class RoomState extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.players = new schema_1.MapSchema();
        this.messages = new schema_1.ArraySchema();
        this.trades = new schema_1.ArraySchema();
    }
}
exports.RoomState = RoomState;
__decorate([
    (0, schema_1.type)("number")
], RoomState.prototype, "mapWidth", void 0);
__decorate([
    (0, schema_1.type)("number")
], RoomState.prototype, "mapHeight", void 0);
__decorate([
    (0, schema_1.type)({ map: Player })
], RoomState.prototype, "players", void 0);
__decorate([
    (0, schema_1.type)({ array: Message })
], RoomState.prototype, "messages", void 0);
__decorate([
    (0, schema_1.type)({ array: Trade })
], RoomState.prototype, "trades", void 0);
