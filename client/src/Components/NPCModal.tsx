import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

import { NPCName } from "../models/npcs";

class NPCModalManager {
  private listener?: (npc: NPCName, isOpen: boolean) => void;
  private preventCloseListener?: (value: boolean) => void;

  public open(npc: NPCName) {
    if (this.listener) {
      this.listener(npc, true);
    }
  }

  public listen(cb: (npc: NPCName, isOpen: boolean) => void) {
    this.listener = cb;
  }

  public preventClose(value: boolean) {
    if (this.preventCloseListener) {
      this.preventCloseListener(value);
    }
  }

  public listenPreventClose(cb: (value: boolean) => void) {
    this.preventCloseListener = cb;
  }
}

export const npcModalManager = new NPCModalManager();

type Props = {
  scene: any;
};

export const NPCModal: React.FC<Props> = ({ scene }) => {
  const [npc, setNpc] = useState<NPCName>();
  const [preventClose, setPreventClose] = useState<boolean>(false);

  useEffect(() => {
    npcModalManager.listen((npc) => {
      setPreventClose(false);
      setNpc(npc);
    });

    npcModalManager.listenPreventClose((value) => {
      setPreventClose(value);
    });
  }, []);

  const closeModal = () => {
    setNpc(undefined);
  };

  return (
    <Modal
      show={!!npc}
      centered
      onHide={closeModal}
      backdrop={preventClose ? "static" : true}
    ></Modal>
  );
};
