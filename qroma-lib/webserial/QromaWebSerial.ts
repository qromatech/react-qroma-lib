import { useEffect } from "react";


const qromaWebSerialContext = {
  initialized: false,
  port: null as any,
  monitorOn: false,
};


export interface PortRequestResult {
  success: boolean
}

export interface IUseQromaWebSerialInputs {
  onData: (data: Uint8Array) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onPortRequestResult: ((requestResult: PortRequestResult) => void);
}

export interface IQromaWebSerial {
  // requestPort(): any
  sendBytes(data: Uint8Array): void
  sendString(data: string): void
  getIsConnected(): boolean
  startMonitoring(): void
  stopMonitoring(): void  
}


export const useQromaWebSerial = (inputs: IUseQromaWebSerialInputs): IQromaWebSerial => {

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
      if (qromaWebSerialContext.initialized) {
        return;
      }
     
      qromaWebSerialContext.initialized = true;
    }
    initPort();
  });

  const _onConnect = () => {
    if (inputs.onConnect) {
      inputs.onConnect();
    }
  }

  const _onDisconnect = () => {
    if (inputs.onDisconnect) {
      inputs.onDisconnect();
    }
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
  }

  const requestPort = async () => {
    // await initPort();
    
    console.log("In requestPort()");

    try {
      if (qromaWebSerialContext.port && globalThis.isConnected) {
        return qromaWebSerialContext.port;
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

      qromaWebSerialContext.port = port;

      setIsConnected(true);
      inputs.onPortRequestResult({success: true});

      return port;
    } catch (e: any) {
      console.log("requestPort() failed");
      console.log(e);
      const portOpen = e.indexOf("port is already open") !== -1;

      console.log("IS PORT OPEN?");
      console.log(portOpen);

      inputs.onPortRequestResult({success: false});
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

    const port = qromaWebSerialContext.port!;
    qromaWebSerialContext.monitorOn = true;

    console.log(qromaWebSerialContext);
    console.log(port);
    console.log(port.readable);
    
    while (port.readable && qromaWebSerialContext.monitorOn) {
      const reader = port.readable.getReader();

      try {
        const { value, done } = await reader.read();
        if (done) {
          // |reader| has been canceled.
          qromaWebSerialContext.monitorOn = false;
          console.log("READER CANCELED")
          break;
        }

        inputs.onData(value);
      } catch (error) {
        // Handle |error|...
      } finally {
        reader.releaseLock();
      }
    }

    console.log("DONE MONITORING: startMonitoring");
  }

  const stopMonitoring = () => {
    qromaWebSerialContext.monitorOn = false;
  }

  return {
    // requestPort,
    sendBytes,
    sendString,
    getIsConnected,
    startMonitoring,
    stopMonitoring,
    // onData: (_: Uint8Array) => { },
  };
}