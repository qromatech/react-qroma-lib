import { useState } from "react";
import { IQromaWebSerial, IUseQromaWebSerialInputs, PortRequestResult, useQromaWebSerial } from "../webserial/QromaWebSerial";


export interface IQromaPageApp {
  qromaPageSerial: IQromaWebSerial
  // qromaCommFileExplorer: IQromaCommFileExplorer
  qromaConnectionState: IQromaConnectionState
}

export interface IQromaConnectionState {
  isConnected: boolean
  isPortConnected: boolean
  isMonitorOn: boolean
}


export const _createQromaPageApp = (): IQromaPageApp => {  


  const [isConnected, setIsConnected] = useState(false);
  const [isPortConnected, setIsPortConnected] = useState(false);
  const [isMonitorOn, setIsMonitorOn] = useState(false);

  const inputs: IUseQromaWebSerialInputs = {
    onData: () => { },
    onConnect: () => { setIsConnected(true); },
    onDisconnect: () => { 
      setIsConnected(false); 
      setIsMonitorOn(false);
    },
    onPortRequestResult: (requestResult: PortRequestResult) => {
      if (requestResult.success) {
        setIsMonitorOn(true);
      }
    }
  };

  const qromaPageSerial = useQromaWebSerial(inputs);

  return {
    qromaPageSerial,
    qromaConnectionState: {
      isConnected,
      isPortConnected,
      isMonitorOn,
    }
    // qromaCommFileExplorer,
  };
}