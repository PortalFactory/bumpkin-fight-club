"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wearable = exports.WearableSchema = exports.Player = exports.PlayerSchema = void 0;
const mongoose_1 = require("mongoose");
// Player
exports.PlayerSchema = new mongoose_1.Schema({
    farmId: { type: Number, required: true },
    visitCount: { type: Number, required: true },
    wallet: { type: String, required: true },
    farm: { type: String, required: true },
});
exports.Player = (0, mongoose_1.model)('Player', exports.PlayerSchema);
exports.WearableSchema = new mongoose_1.Schema({
    item: { type: String, required: true },
    power: { type: Number, required: true },
});
exports.Wearable = (0, mongoose_1.model)('Wearable', exports.WearableSchema);
