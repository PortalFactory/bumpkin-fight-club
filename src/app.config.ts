import config from "@colyseus/tools";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";
import basicAuth from "express-basic-auth";

import { MainRoom } from "./rooms/mainRoom";
import { connect, getDatabase } from "./db/client";
import { CronJob } from 'cron';
import { leaderboardDb, resetDailyFightsDb } from './db/db';

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

    app.get(
        "/leaderboards",
        async (req, res) => {
            const farmId = +req.query.farmId;

            if (!farmId || isNaN(farmId)) {
                res.status(400).send('Wrong farmId');
                return;
            }

            const leaderboard = await leaderboardDb(farmId);
            res.send(leaderboard);
        }
      );
  },

  beforeListen: async () => {
    await connect();

    const job = CronJob.from({
        cronTime: '0 0 0 * * *',
        onTick: () => resetDailyFightsDb(),
        start: true,
        timeZone: 'utc'
    });
  },
});
