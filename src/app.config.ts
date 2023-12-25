import config from "@colyseus/tools";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";
import basicAuth from "express-basic-auth";

import { MainRoom } from "./rooms/mainRoom";
import { connect, getDatabase } from "./db/client";

const basicAuthMiddleware = basicAuth({
  // list of users and passwords
  users: {
    admin: process.env.ADMIN_PASS,
  },
  // sends WWW-Authenticate header, which will prompt the user to fill
  // credentials in
  challenge: true,
});

export default config({
  initializeGameServer: (gameServer) => {
    gameServer.define("main", MainRoom);
  },

  initializeExpress: (app) => {
    if (process.env.NODE_ENV !== "production") {
      app.use("/", playground);
    } else {
      app.get("/", (req, res) => {
        res.redirect(process.env.PLAYGROUND_URL);
      });
    }

    app.use(
      "/admin",
      basicAuthMiddleware,
      monitor({
        columns: ["roomId", "name", "clients", "elapsedTime"],
      })
    );
  },

  beforeListen: async () => {
    await connect();
  },
});
