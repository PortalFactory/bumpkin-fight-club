"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tools_1 = __importDefault(require("@colyseus/tools"));
const monitor_1 = require("@colyseus/monitor");
const playground_1 = require("@colyseus/playground");
const express_basic_auth_1 = __importDefault(require("express-basic-auth"));
const mainRoom_1 = require("./rooms/mainRoom");
const client_1 = require("./db/client");
const initialization_1 = require("./db/initialization");
const basicAuthMiddleware = (0, express_basic_auth_1.default)({
    // list of users and passwords
    users: {
        admin: process.env.ADMIN_PASS,
    },
    // sends WWW-Authenticate header, which will prompt the user to fill
    // credentials in
    challenge: true,
});
exports.default = (0, tools_1.default)({
    initializeGameServer: (gameServer) => {
        gameServer.define("main", mainRoom_1.MainRoom);
    },
    initializeExpress: (app) => {
        if (process.env.NODE_ENV !== "production") {
            app.use("/", playground_1.playground);
        }
        else {
            app.get("/", (req, res) => {
                res.redirect(process.env.PLAYGROUND_URL);
            });
        }
        app.use("/admin", basicAuthMiddleware, (0, monitor_1.monitor)({
            columns: ["roomId", "name", "clients", "elapsedTime"],
        }));
    },
    beforeListen: async () => {
        await (0, client_1.connect)();
        const database = (0, client_1.getDatabase)();
        const wearablesCount = await database.collection("wearables").countDocuments();
        if (!wearablesCount)
            (0, initialization_1.dbWearablesInit)();
    },
});
