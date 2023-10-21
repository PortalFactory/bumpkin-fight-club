import React from "react";

// @ts-ignore
import * as env from "env";

import { InnerPanel } from "../common/Panel";

const sword = env.CLIENT_URL + "/assets/icons/sword.png";

interface Props {
  power: number;
}

export const PowerPanel: React.FC<Props> = ({ power }) => {
  return (
    <InnerPanel
      className="fixed top-2 flex items-center z-50 p-1"
      style={{
        left: 140,
      }}
    >
      <img
        src={sword}
        className="mr-2"
        style={{
          width: 26,
        }}
      />
      <div className="flex flex-col">
        <div className="text-sm font-bold">{power}</div>
      </div>
    </InnerPanel>
  );
};
