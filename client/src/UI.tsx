import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

// @ts-ignore
import * as env from "env";

import { CommunityAPI } from "./Scene";
import { eventManager } from "./lib/event-manager";
import { NPCModal } from "./Components/NPCModal";
import { LostConnection } from "./Components/modals/LostConnection";
import { Notifications, notificationManager } from "./Components/Notification";
import { Dialogue } from "./Components/modals/Dialogue";
import { IsleIntroduction } from "./Components/modals/IsleIntroduction";
import { Banned } from "./Components/modals/Banned";
import { Loading } from "./Components/modals/Loading";

type Props = {
  scene: any;
};

export const UI: React.FC<Props> = ({ scene }) => {
  const [lostConnection, setLostConnection] = useState<boolean>(false);
  const [dialogueMessage, setDialogueMessage] = useState<string>("");
  const [showIntroduction, setShowIntroduction] = useState<boolean>(false);
  const [isBanned, setIsBanned] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Register listeners
    eventManager.on("lostConnection", lostConnectionListener);
    eventManager.on("backToSpawn", backToSpawnListener);
    eventManager.on("dialogue", dialogueListener);
    eventManager.on("banned", bannedListener);
    eventManager.on("loading", loadingListener);
    eventManager.on("unmountUI", unmountUIListener);

    const hasCompletedIntroduction = localStorage.getItem(
      env.COMMUNITY_ISLAND_ID + ".introduction"
    );

    if (!hasCompletedIntroduction) {
      setShowIntroduction(true);
      JSON.stringify(
        localStorage.setItem(env.COMMUNITY_ISLAND_ID + ".introduction", "true")
      );
    }
  }, []);

  const lostConnectionListener = () => {
    setLostConnection(true);
  };

  const backToSpawnListener = () => {
    scene.sendPlayerToSpawn();
  };

  const dialogueListener = (message: string, closeAfter?: number) => {
    setDialogueMessage(message);

    if (closeAfter) {
      setTimeout(() => {
        setDialogueMessage("");
      }, closeAfter);
    }
  };

  const bannedListener = () => {
    setIsBanned(true);
  };

  const loadingListener = (loading: boolean) => {
    if (isLoading === loading) return;
    setIsLoading(loading);
  };

  const unmountUIListener = () => {
    scene.unMountUI();
  };

  return (
    <>
      <NPCModal scene={scene} />
      <Notifications scene={scene} />
      <Dialogue scene={scene} message={dialogueMessage} onClose={() => {}} />

      {/* Static backdrop modal */}
      <Modal
        show={isBanned || isLoading || lostConnection || showIntroduction}
        centered
        backdrop="static"
      >
        {lostConnection && <LostConnection />}
        {isLoading && <Loading />}
        {isBanned && <Banned />}
        {showIntroduction && (
          <IsleIntroduction
            onClose={() => {
              setShowIntroduction(false);
            }}
          />
        )}
      </Modal>
    </>
  );
};
