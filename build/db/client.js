"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabase = exports.isConnected = exports.disconnect = exports.connect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connect = async () => {
    await mongoose_1.default
        .connect(process.env.MONGO_URL, {
        dbName: process.env.DB_NAME,
    })
        .then(() => console.log("Connected to MongoDB"))
        .catch((err) => console.log(err));
};
exports.connect = connect;
const disconnect = async () => await mongoose_1.default.disconnect();
exports.disconnect = disconnect;
const isConnected = () => mongoose_1.default.connection.readyState === 1;
exports.isConnected = isConnected;
const getDatabase = () => mongoose_1.default.connection.db;
exports.getDatabase = getDatabase;
