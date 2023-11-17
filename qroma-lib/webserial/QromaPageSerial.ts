import { useCallback, useEffect, useState } from "react";
import { IQromaCommRxInputs, createQromaCommRx } from "./processors/QromaCommRx";
import { QromaCommResponse } from "../../qroma-comm-proto/qroma-comm";


export interface PortRequestResult {
  success: boolean
}

export interface IQromaPageSerialListener {
  onData: (data: Uint8Array) => void;
  // onConnect?: () => void;
  // onDisconnect?: () => void;
  // onPortRequestResult: ((requestResult: PortRequestResult) => void);
}

export interface IQromaCommListener {
  onQromaCommResponse: (message: QromaCommResponse) => void;
}

export interface IQromaAppListener {

}

export interface IQromaPageSerial {
  isInitialized: boolean
  isConnected: boolean
  isPortConnected: boolean
  isMonitorOn: boolean
  latestPortRequestResult: PortRequestResult

  // requestPort(): any
  sendBytes(data: Uint8Array): void
  sendString(data: string): void
  // getIsConnected(): boolean
  // getIsPortConnected(): boolean
  
  startMonitoring(): void
  stopMonitoring(): void

  subscribeSerialRx(listener: IQromaPageSerialListener): () => void
  subscribeQromaCommRx(listener: IQromaCommListener): () => void
  // subscribeQromaAppRx(listener: IQromaAppListener): () => void
  // unsubscribe(listener: IQromaPageSerialListener): void
}


// const qromaPageSerialContext = {
//   qromaPageSerial: undefined as IQromaPageSerial | undefined,
//   initialized: false,
//   port: null as any,
//   monitorOn: false,
// };

const internalState = {
  port: undefined as any,
  qromaInitComplete: false,
};


export const _createQromaPageSerial = (): IQromaPageSerial => {  

  console.log("PRE HOOKS")
  const [isConnected, setIsConnected] = useState(false);
  const [isPortConnected, setIsPortConnected] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [latestPortRequestResult, setLatestPortRequestResult] = useState({success: false} as PortRequestResult);

  // const [requestedPort, setRequestedPort] = useState(undefined);
  const [isMonitorOn, setIsMonitorOn] = useState(false);

  console.log("POST HOOKS")

  // if (qromaPageSerialContext.qromaPageSerial !== undefined) {
  //   throw Error("qromaPageSerial already created");
  // }

  if (!window) {
    throw Error("Not running in a browser");
  }

  console.log("_createQromaPageSerial");
  const qNavigator: any = window.navigator;
  const qSerial = qNavigator.serial;

  console.log(qSerial);
  if (!qSerial) {
    throw new Error("Unable to get serial from window.navigator!");
  }

  useEffect(() => {

    const initPort = async() => {
      console.log("INITIALIZING CONTEXT - ")
      if (isInitialized) {
        return;
      }
     
      setIsInitialized(true);
    }
    initPort();
  });

  const listeners: IQromaPageSerialListener[] = [];

  const _onConnect = () => {
    console.log("setIsConnected(true);");
    setIsConnected(true);
  }

  const _onDisconnect = () => {
    setIsConnected(false);
    setIsPortConnected(false);
  }

  console.log("PREx USEEFFECT - LISTNERS");
  useEffect(() => {
    console.log("USEEFFECT - LISTENERS");
    qSerial.addEventListener("connect", _onConnect)
    qSerial.addEventListener("disconnect", _onDisconnect)
    return () => {
      qSerial.removeEventListener("connect", _onConnect)
      qSerial.removeEventListener("disconnect", _onDisconnect)
    }
  });
  console.log("POST USEEFFECT - LISTNERS");


  // if (!globalThis.qromaInitComplete) {
  //   console.log("INITIALIZING isConnected");
  //   globalThis.isConnected = false;
  // }
  // globalThis.qromaInitComplete = true;

  // const getIsConnected = () => isConnected;
  // const getIsPortConnected = () => isPortConnected;

  
  // const getIsConnected = () => {
  //   console.log("GETTING isConnected: " + globalThis.isConnected);
  //   return globalThis.isConnected;
  // }
  // const setIsConnected = (c: boolean) => {
  //   console.log("SETTING isConnected: " + c);
  //   globalThis.isConnected = c;
  //   listeners.forEach(l => {
  //     if (l.onConnect) {
  //       l.onConnect();
  //     }
  //   })
  // }

  const requestPort = async (): Promise<{success: boolean, port: any}> => {
    // await initPort();
    
    console.log("In requestPort()");

    try {
      if (internalState.port !== undefined && isConnected) {
        console.log("requestPort() - HAS PORT");
        return {
          success: true,
          port: internalState.port,
        };
      }

      console.log("requestPort() - NOT HAS PORT");
      console.log(internalState.port);
      console.log(isConnected)

      console.log("Requesting port");
      const port = await qSerial.requestPort();
      // https://webserial.io/?vid=303a&pid=1001
      // const port = await qNavigator.serial.requestPort({filters: [{
      //   "usbProductId": 4097,
      //   "usbVendorId": 12346
      // }]});
      console.log("Port request complete");
      console.log(port);
      await port.open({baudRate: 115200});
      console.log("OPEN INFO");
      console.log(port.getInfo());
      console.log(port);

      internalState.port = port;
      // setRequestedPort(port);

      setIsConnected(true);
      // _onConnect();

      // listeners.forEach(l => {
      //   l.onPortRequestResult({success: true});
      // });

      return {
        port,
        success: true,
      };
    } catch (e: any) {
      console.log("requestPort() failed");
      console.log(e);
      const portOpen = e.indexOf("port is already open") !== -1;

      console.log("IS PORT OPEN?");
      console.log(portOpen);

      // listeners.forEach(l => {
      //   l.onPortRequestResult({success: false});
      // });
      setLatestPortRequestResult({success: false});
    }

    return {
      port: undefined,
      success: false,
    };
  }


  const sendBytes = async (data: Uint8Array) => {
    const {success, port} = await requestPort();
    console.log(port);
    const writer = port.writable.getWriter();

    // const writer = requestedPort.writable.getWriter();

    await writer.write(data);
    writer.releaseLock();
  }


  const sendString = async (data: string) => {
    const encoder = new TextEncoder();
    const encoded = encoder.encode(data);
    await sendBytes(encoded);
  }


  const startMonitoring = async () => {
    console.log("START MONITORING: startMonitoring");

    const {success, port} = await requestPort();

    if (!success) {
      throw new Error("Can't start monitor - no connection");
    }

    // const port = qromaPageSerialContext.port!;
    // qromaPageSerialContext.monitorOn = true;
    setIsMonitorOn(true);
    let keepMonitoring = true;

    // console.log(qromaPageSerialContext);
    console.log("REQUESTEDPORT STATUS")
    console.log(port);
    console.log(port.readable);
    
    while (port.readable && keepMonitoring) {
      console.log("READING")
      const reader = port.readable.getReader();
      console.log("HAS READER")

      try {
        const { value, done } = await reader.read();
        if (done) {
          // |reader| has been canceled.
          // qromaPageSerialContext.monitorOn = false;
          setIsMonitorOn(false);
          keepMonitoring = false;
          console.log("READER CANCELED")
          break;
        }

        console.log("LISTENER COUNT");
        console.log(listeners)
        listeners.forEach(l => l.onData(value));
      } catch (error) {
        // Handle |error|...
      } finally {
        reader.releaseLock();
      }
    }

    console.log("DONE MONITORING: startMonitoring");
  }


  const stopMonitoring = () => {
    // qromaPageSerialContext.monitorOn = false;
    setIsMonitorOn(false);
  }


  const _createRemoveListenerFn = (listener: IQromaPageSerialListener) => {
    const removeListenerFunction = () => {
      const listenerIndex = listeners.indexOf(listener);
      if (listenerIndex >= 0) {
        console.log("qromaPageSerialContext.listeners REMOVE - " + listeners.length);
        listeners.splice(listenerIndex, 1);
      } else {
        console.log("qromaPageSerialContext.listeners - NOT REMOVED - " + listeners.length);
      }
    }
    return removeListenerFunction;
  }


  const subscribeSerialRx = (listener: IQromaPageSerialListener): () => void => {
    listeners.push(listener);
    const unsubscribeFunction = _createRemoveListenerFn(listener);
    return unsubscribeFunction;
  }


  const subscribeQromaCommRx = (listener: IQromaCommListener): () => void => {
    console.log("QROMA PAGE SERIAL - subscribeQromaCommRx")
    const qromaCommRx = createQromaCommRx(listener.onQromaCommResponse);
    const onNewData = (data: Uint8Array) => {
      qromaCommRx.addNewSerialData(data);
    }
    const dataListener: IQromaPageSerialListener = {
      onData: onNewData
    };

    const unsubscribeFn = subscribeSerialRx(dataListener);
    return unsubscribeFn;
  }


  // const subscribeQromaAppRx = (listener: IQromaAppListener): () => void => {

  // }

  return {
    isInitialized,
    isConnected,
    isPortConnected,
    isMonitorOn,
    latestPortRequestResult,

    // requestPort,
    sendBytes,
    sendString,

    startMonitoring,
    stopMonitoring,

    subscribeSerialRx,
    subscribeQromaCommRx,
    // subscribeQromaAppRx,

    // unsubscribe,
    // onData: (_: Uint8Array) => { },
  };
}

// export const useQromaPageSerial = (): IQromaPageSerial => {

//   if (!qromaPageSerialContext.qromaPageSerial) {
//     const qromaPageSerial = _createQromaPageSerial();
//     qromaPageSerialContext.qromaPageSerial = qromaPageSerial;
//   }

//   return qromaPageSerialContext.qromaPageSerial;
// }
