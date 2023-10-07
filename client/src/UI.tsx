import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

// @ts-ignore
import * as env from "env";

import { CommunityAPI } from "./Scene";
import { eventManager } from "./lib/event-manager";
import { NPCModal } from "./components/NPCModal";
import { LostConnection } from "./components/modals/LostConnection";
import { Notifications, notificationManager } from "./components/Notification";
import { Dialogue } from "./components/modals/Dialogue";
import { IsleIntroduction } from "./components/modals/IsleIntroduction";
import { Banned } from "./components/modals/Banned";
import { Loading } from "./components/modals/Loading";

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
