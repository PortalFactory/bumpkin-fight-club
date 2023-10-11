import React from "react";

// @ts-ignore
import * as env from "env";

import { Panel } from "../common/Panel";
import { Button } from "../common/Button";

const HumanDeath = env.CLIENT_URL + "/assets/other/HumanDeath.gif";

export const Banned: React.FC = () => {
  return (
    <Panel>
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-xxl">Oh no!</h1>
        <h2 className="text-xl">You've been banned from this island.</h2>
        <img src={HumanDeath} alt="Human Death" className="mt-4 mb-4" />
        <Button onClick={() => window.history.back()}>Go Home</Button>
      </div>
    </Panel>
  );
};
