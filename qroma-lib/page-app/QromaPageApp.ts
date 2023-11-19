import { useState } from "react";
import { IQromaConnectionState, IQromaWebSerial, useQromaWebSerial } from "../webserial/QromaWebSerial";
import { IQromaAppMessageTypesRegistry, createQromaAppMessageTypesRegistry } from "./QromaAppMessageTypesRegistry";
import { MessageInfo } from "@protobuf-ts/runtime";


export interface IQromaPageApp {
  qromaPageSerial: IQromaWebSerial
  qromaConnectionState: IQromaConnectionState
  qromaAppMessageTypesRegistry: IQromaAppMessageTypesRegistry
}


export const _createQromaPageApp = (): IQromaPageApp => {  

  const [isConnected, setIsConnected] = useState(false);
  const [isPortConnected, setIsPortConnected] = useState(false);
  const [isMonitorOn, setIsMonitorOn] = useState(false);

  const [qromaAppMessageTypes, setQromaAppMessageTypes] = useState({} as Record<string, MessageInfo>);


  const onConnectionChange = (latestConnectionState: IQromaConnectionState) => {
    setIsConnected(latestConnectionState.isConnected);
    setIsPortConnected(latestConnectionState.isPortConnected);
    setIsMonitorOn(latestConnectionState.isMonitorOn);
  }

  const qromaPageSerial = useQromaWebSerial(() => { }, onConnectionChange);
  const qromaAppMessageTypesRegistry = createQromaAppMessageTypesRegistry(qromaAppMessageTypes, setQromaAppMessageTypes);

  return {
    qromaPageSerial,

    qromaConnectionState: {
      isConnected,
      isPortConnected,
      isMonitorOn,
    },

    qromaAppMessageTypesRegistry,
  };
}