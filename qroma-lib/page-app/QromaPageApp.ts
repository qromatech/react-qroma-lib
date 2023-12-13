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

  const [isWebSerialConnected, setIsWebSerialConnected] = useState(false);
  const [keepQromaMonitoringOn, setKeepQromaMonitoringOn] = useState(false);
  const [isQromaMonitoringOn, setIsQromaMonitoringOn] = useState(false);

  const [qromaAppMessageTypes, setQromaAppMessageTypes] = useState({} as Record<string, MessageInfo>);


  const onConnectionChange = (latestConnectionState: IQromaConnectionState) => {
    setIsWebSerialConnected(latestConnectionState.isWebSerialConnected);
    setKeepQromaMonitoringOn(latestConnectionState.keepQromaMonitoringOn);
    setIsQromaMonitoringOn(latestConnectionState.isQromaMonitoringOn);
  }

  const qromaPageSerial = useQromaWebSerial(() => { }, onConnectionChange);
  const qromaAppMessageTypesRegistry = createQromaAppMessageTypesRegistry(qromaAppMessageTypes, setQromaAppMessageTypes);

  return {
    qromaPageSerial,

    qromaConnectionState: {
      isWebSerialConnected,
      keepQromaMonitoringOn,
      isQromaMonitoringOn,
    },

    qromaAppMessageTypesRegistry,
  };
}