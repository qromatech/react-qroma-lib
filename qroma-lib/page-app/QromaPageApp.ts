import { useState } from "react";
import { IQromaConnectionState, IQromaWebSerial, PortRequestResult, useQromaWebSerial } from "../webserial/QromaWebSerial";


export interface IQromaPageApp {
  qromaPageSerial: IQromaWebSerial
  // qromaCommFileExplorer: IQromaCommFileExplorer
  qromaConnectionState: IQromaConnectionState
  // getQromaConnectionState: () => IQromaConnectionState
}


export const _createQromaPageApp = (): IQromaPageApp => {  

  const [isConnected, setIsConnected] = useState(false);
  const [isPortConnected, setIsPortConnected] = useState(false);
  const [isMonitorOn, setIsMonitorOn] = useState(false);

  // const inputs: IUseQromaWebSerialInputs = {
  //   onData: () => { },
  //   onConnect: () => { setIsConnected(true); },
  //   onDisconnect: () => { 
  //     setIsConnected(false); 
  //     setIsMonitorOn(false);
  //   },
  //   onPortRequestResult: (requestResult: PortRequestResult) => {
  //     if (requestResult.success) {
  //       setIsMonitorOn(true);
  //     }
  //   }
  // };
  const onConnectionChange = (latestConnectionState: IQromaConnectionState) => {
    setIsConnected(latestConnectionState.isConnected);
    setIsPortConnected(latestConnectionState.isPortConnected);
    setIsMonitorOn(latestConnectionState.isMonitorOn);
  }

  const qromaPageSerial = useQromaWebSerial(() => { }, onConnectionChange);

  return {
    qromaPageSerial,
    // getQromaConnectionState: qromaPageSerial.getConnectionState,

    qromaConnectionState: {
      isConnected,
      isPortConnected,
      isMonitorOn,
    }
    // qromaCommFileExplorer,
  };
}