import { useEffect } from "react";


export interface PortRequestResult {
  success: boolean
}

export interface IQromaPageSerialListener {
  onData: (data: Uint8Array) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onPortRequestResult: ((requestResult: PortRequestResult) => void);
}

export interface IQromaPageSerial {
  // requestPort(): any
  sendBytes(data: Uint8Array): void
  sendString(data: string): void
  getIsConnected(): boolean
  startMonitoring(): void
  stopMonitoring(): void
  listen(listener: IQromaPageSerialListener): () => void
  unsubscribe(listener: IQromaPageSerialListener): void
}

// export interface IQromaPageSerial extends IQromaPageSerialInternal {
//   unsubscribe(): void
// }


const qromaPageSerialContext = {
  // initialized: false,
  // port: null as any,
  // monitorOn: false,
  qromaPageSerial: undefined as IQromaPageSerial | undefined,
  initialized: false,
  port: null as any,
  monitorOn: false,
  // listeners: [] as IQromaPageSerialListener[]
};


const _createQromaPageSerial = (): IQromaPageSerial => {
  if (qromaPageSerialContext.qromaPageSerial !== undefined) {
    throw Error("qromaPageSerial already created");
  }

  if (!window) {
    throw Error("Not running in a browser");
  }

  console.log("useQromaCommWebSerial");
  const qNavigator: any = window.navigator;
  const qSerial = qNavigator.serial;

  console.log(qSerial);
  if (!qSerial) {
    throw new Error("Unable to get serial from window.navigator!");
  }

  useEffect(() => {

    const initPort = async() => {
      console.log("INITIALIZING CONTEXT - ")
      if (qromaPageSerialContext.initialized) {
        return;
      }
     
      qromaPageSerialContext.initialized = true;
    }
    initPort();
  });

  const listeners: IQromaPageSerialListener[] = [];

  const _onConnect = () => {
    listeners.forEach(l => {
      if (l.onConnect) {
        l.onConnect();
      }
    })
  }

  const _onDisconnect = () => {
    listeners.forEach(l => {
      if (l.onDisconnect) {
        l.onDisconnect();
      }
    })
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


  // let isConnected = false;
  if (!globalThis.qromaInitComplete) {
    console.log("INITIALIZING isConnected");
    globalThis.isConnected = false;
  }
  globalThis.qromaInitComplete = true;
  
  const getIsConnected = () => {
    console.log("GETTING isConnected: " + globalThis.isConnected);
    return globalThis.isConnected;
  }
  const setIsConnected = (c: boolean) => {
    console.log("SETTING isConnected: " + c);
    globalThis.isConnected = c;
    listeners.forEach(l => {
      if (l.onConnect) {
        l.onConnect();
      }
    })
  }

  const requestPort = async () => {
    // await initPort();
    
    console.log("In requestPort()");

    try {
      if (qromaPageSerialContext.port && globalThis.isConnected) {
        return qromaPageSerialContext.port;
      }

      console.log("Requesting port");
      const port = await qNavigator.serial.requestPort();
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

      qromaPageSerialContext.port = port;

      setIsConnected(true);
      listeners.forEach(l => {
        l.onPortRequestResult({success: true});
      });

      return port;
    } catch (e: any) {
      console.log("requestPort() failed");
      console.log(e);
      const portOpen = e.indexOf("port is already open") !== -1;

      console.log("IS PORT OPEN?");
      console.log(portOpen);

      listeners.forEach(l => {
        l.onPortRequestResult({success: false});
      });
    }
  }

  const sendBytes = async (data: Uint8Array) => {
    const port = await requestPort();
    console.log(port);
    const writer = port.writable.getWriter();

    await writer.write(data);
    writer.releaseLock();
  }

  const sendString = async (data: string) => {
    const encoder = new TextEncoder();
    const encoded = encoder.encode(data);
    await sendBytes(encoded);
  }

  // const startMonitoring = async (onData: (data: Uint8Array) => void) => {
  const startMonitoring = async () => {
    console.log("START MONITORING: startMonitoring");

    await requestPort();

    if (!getIsConnected()) {
      // throw new Error("Can't start monitor - no connection");
      return;
    }

    const port = qromaPageSerialContext.port!;
    qromaPageSerialContext.monitorOn = true;

    console.log(qromaPageSerialContext);
    console.log(port);
    console.log(port.readable);
    
    while (port.readable && qromaPageSerialContext.monitorOn) {
      const reader = port.readable.getReader();

      try {
        const { value, done } = await reader.read();
        if (done) {
          // |reader| has been canceled.
          qromaPageSerialContext.monitorOn = false;
          console.log("READER CANCELED")
          break;
        }

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
    qromaPageSerialContext.monitorOn = false;
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

  const listen = (listener: IQromaPageSerialListener): () => void => {
    listeners.push(listener);
    const removeListenerFunction = _createRemoveListenerFn(listener);
    return removeListenerFunction;
  }

  const unsubscribe = (listener: IQromaPageSerialListener) => {
    const removeListenerFunction = _createRemoveListenerFn(listener);
    removeListenerFunction();
  }

  return {
    // requestPort,
    sendBytes,
    sendString,
    getIsConnected,
    startMonitoring,
    stopMonitoring,
    listen,
    unsubscribe,
    // onData: (_: Uint8Array) => { },
  };
}

export const useQromaPageSerial = (): IQromaPageSerial => {

  if (!qromaPageSerialContext.qromaPageSerial) {
    const qromaPageSerial = _createQromaPageSerial();
    qromaPageSerialContext.qromaPageSerial = qromaPageSerial;
  }

  return qromaPageSerialContext.qromaPageSerial;

  // qromaPageSerialContext.listeners.push(listener);
  // console.log("qromaPageSerialContext.listeners PUSH - " + qromaPageSerialContext.listeners.length);
  
  // const removeListenerFunction = () => {
  //   qromaPageSerialContext.listeners = qromaPageSerialContext.listeners.filter(s => s !== listener);
  //   console.log("qromaPageSerialContext.listeners REMOVE - " + qromaPageSerialContext.listeners.length);
  // }
  
  // return {
  //   ...qromaPageSerialContext.qromaPageSerial,
  //   unsubscribe: removeListenerFunction,
  // };

  // if (!window) {
  //   throw Error("Not running in a browser");
  // }

  // console.log("useQromaCommWebSerial");
  // const qNavigator: any = window.navigator;
  // const qSerial = qNavigator.serial;

  // console.log(qSerial);
  // if (!qSerial) {
  //   throw new Error("Unable to get serial from window.navigator!");
  // }

  // useEffect(() => {

  //   const initPort = async() => {
  //     console.log("INITIALIZING CONTEXT - ")
  //     if (qromaWebSerialContext.initialized) {
  //       return;
  //     }
     
  //     qromaWebSerialContext.initialized = true;
  //   }
  //   initPort();
  // });

  // const _onConnect = () => {
  //   if (inputs.onConnect) {
  //     inputs.onConnect();
  //   }
  // }

  // const _onDisconnect = () => {
  //   if (inputs.onDisconnect) {
  //     inputs.onDisconnect();
  //   }
  // }

  // console.log("PREx USEEFFECT - LISTNERS");
  // useEffect(() => {
  //   console.log("USEEFFECT - LISTENERS");
  //   qSerial.addEventListener("connect", _onConnect)
  //   qSerial.addEventListener("disconnect", _onDisconnect)
  //   return () => {
  //     qSerial.removeEventListener("connect", _onConnect)
  //     qSerial.removeEventListener("disconnect", _onDisconnect)
  //   }
  // });
  // console.log("POST USEEFFECT - LISTNERS");


  // // let isConnected = false;
  // if (!globalThis.qromaInitComplete) {
  //   console.log("INITIALIZING isConnected");
  //   globalThis.isConnected = false;
  // }
  // globalThis.qromaInitComplete = true;
  
  // const getIsConnected = () => {
  //   console.log("GETTING isConnected: " + globalThis.isConnected);
  //   return globalThis.isConnected;
  // }
  // const setIsConnected = (c: boolean) => {
  //   console.log("SETTING isConnected: " + c);
  //   globalThis.isConnected = c;
  //   if (inputs.onConnect) {
  //     inputs.onConnect();
  //   }
  // }

  // const requestPort = async () => {
  //   // await initPort();
    
  //   console.log("In requestPort()");

  //   try {
  //     if (qromaWebSerialContext.port && globalThis.isConnected) {
  //       return qromaWebSerialContext.port;
  //     }

  //     console.log("Requesting port");
  //     const port = await qNavigator.serial.requestPort();
  //     // https://webserial.io/?vid=303a&pid=1001
  //     // const port = await qNavigator.serial.requestPort({filters: [{
  //     //   "usbProductId": 4097,
  //     //   "usbVendorId": 12346
  //     // }]});
  //     console.log("Port request complete");
  //     console.log(port);
  //     await port.open({baudRate: 115200});
  //     console.log("OPEN INFO");
  //     console.log(port.getInfo());
  //     console.log(port);

  //     qromaWebSerialContext.port = port;

  //     setIsConnected(true);
  //     inputs.onPortRequestResult({success: true});

  //     return port;
  //   } catch (e: any) {
  //     console.log("requestPort() failed");
  //     console.log(e);
  //     const portOpen = e.indexOf("port is already open") !== -1;

  //     console.log("IS PORT OPEN?");
  //     console.log(portOpen);

  //     inputs.onPortRequestResult({success: false});
  //   }
  // }

  // const sendBytes = async (data: Uint8Array) => {
  //   const port = await requestPort();
  //   console.log(port);
  //   const writer = port.writable.getWriter();

  //   await writer.write(data);
  //   writer.releaseLock();
  // }

  // const sendString = async (data: string) => {
  //   const encoder = new TextEncoder();
  //   const encoded = encoder.encode(data);
  //   await sendBytes(encoded);
  // }

  // // const startMonitoring = async (onData: (data: Uint8Array) => void) => {
  // const startMonitoring = async () => {
  //   console.log("START MONITORING: startMonitoring");

  //   await requestPort();

  //   if (!getIsConnected()) {
  //     // throw new Error("Can't start monitor - no connection");
  //     return;
  //   }

  //   const port = qromaWebSerialContext.port!;
  //   qromaWebSerialContext.monitorOn = true;

  //   console.log(qromaWebSerialContext);
  //   console.log(port);
  //   console.log(port.readable);
    
  //   while (port.readable && qromaWebSerialContext.monitorOn) {
  //     const reader = port.readable.getReader();

  //     try {
  //       const { value, done } = await reader.read();
  //       if (done) {
  //         // |reader| has been canceled.
  //         qromaWebSerialContext.monitorOn = false;
  //         console.log("READER CANCELED")
  //         break;
  //       }

  //       inputs.onData(value);
  //     } catch (error) {
  //       // Handle |error|...
  //     } finally {
  //       reader.releaseLock();
  //     }
  //   }

  //   console.log("DONE MONITORING: startMonitoring");
  // }

  // const stopMonitoring = () => {
  //   qromaWebSerialContext.monitorOn = false;
  // }

  // return {
  //   // requestPort,
  //   sendBytes,
  //   sendString,
  //   getIsConnected,
  //   startMonitoring,
  //   stopMonitoring,
  //   // onData: (_: Uint8Array) => { },
  // };
}