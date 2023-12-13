"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logVisit = void 0;
const client_1 = require("./client");
const Alchemy_1 = require("../web3/Alchemy");
const logVisit = async (farmId) => {
    if (!(0, client_1.isConnected)())
        await (0, client_1.connect)();
    const database = (0, client_1.getDatabase)();
    const playersCollection = database.collection("players");
    const existingPlayer = await playersCollection.findOne({ farmId });
    const blockchainFarm = await (0, Alchemy_1.getFarm)(farmId);
    if (existingPlayer) {
        await playersCollection.updateOne({ farmId }, {
            $inc: { visitCount: 1 },
            $set: {
                wallet: blockchainFarm.wallet_address,
                farm: blockchainFarm.farm_address,
            },
        });
    }
    else {
        await playersCollection.insertOne({
            farmId,
            visitCount: 1,
            wallet: blockchainFarm.wallet_address,
            farm: blockchainFarm.farm_address,
        });
    }
};
exports.logVisit = logVisit;
