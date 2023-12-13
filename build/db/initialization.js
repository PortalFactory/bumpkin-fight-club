"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbWearablesInit = void 0;
const bumpkin_1 = require("../dto/bumpkin");
const models_1 = require("./models");
async function dbWearablesInit() {
    for (const item in bumpkin_1.ITEM_IDS) {
        await new models_1.Wearable({
            item,
            power: 0
        }).save();
    }
}
exports.dbWearablesInit = dbWearablesInit;
