import React, { useState, useEffect } from "react";

// @ts-ignore
import * as env from "env";

import { InnerPanel } from "../common/Panel";

export type NotificationIcons = "Success";

type Notification = {
  icon?: NotificationIcons;
  title: string;
  description: string;
};

interface Props {
  scene: any;
}

class NotificationManager {
  private listener?: (notification: Notification, isShown: boolean) => void;

  public notification = (notification: Notification) => {
    if (this.listener) {
      this.listener(notification, true);
    }
  };

  public listen(cb: (notification: Notification, isShown: boolean) => void) {
    this.listener = cb;
  }
}

export const notificationManager = new NotificationManager();

export const Notifications: React.FC<Props> = ({ scene }) => {
  const [notification, setNotification] = useState<Notification>();

  useEffect(() => {
    notificationManager.listen((notification) => {
      setNotification(notification);
      scene.PlaySound("success", 0.2);

      setTimeout(() => {
        setNotification(undefined);
      }, 10000);
    });
  }, []);

  const getIcon = (icon: NotificationIcons) => {
    switch (icon) {
      case "Success":
        return env.CLIENT_URL + "/assets/icons/Success.gif";
    }
  };

  return (
    <>
      {notification && (
        <InnerPanel className="fixed top-2 left-1/2 -translate-x-1/2 flex items-center z-50 ease-in-out p-2">
          {notification.icon && (
            <img src={getIcon(notification.icon)} className="w-10 mr-1 ml-2" />
          )}
          <div className="flex flex-col">
            <div className="text-sm font-bold">{notification.title}</div>
            <div className="text-xxs">{notification.description}</div>
          </div>
        </InnerPanel>
      )}
    </>
  );
};