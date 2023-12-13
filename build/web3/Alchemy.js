"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFarm = void 0;
const web3_1 = __importDefault(require("web3"));
const FarmABI_1 = require("./FarmABI");
const web3 = new web3_1.default(new web3_1.default.providers.HttpProvider(process.env.ALCHEMY_URL));
async function getFarm(farmId) {
    if (!farmId) {
        return { error: "Invalid farm id" };
    }
    const farmContract = new web3.eth.Contract(FarmABI_1.FarmABI, process.env.FARM_CONTRACT);
    let farm = await farmContract.methods.getFarm(farmId).call();
    return {
        farm_id: farm.tokenId,
        farm_address: farm.account,
        wallet_address: farm.owner,
    };
}
exports.getFarm = getFarm;
