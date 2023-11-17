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


export interface IQromaConnectionState {
  isConnected: boolean
  isPortConnected: boolean
  isMonitorOn: boolean
}

export interface IQromaWebSerial {
  sendBytes(data: Uint8Array): void
  sendString(data: string): void
  getConnectionState(): IQromaConnectionState
  startMonitoring(): void
  stopMonitoring(): void  
}


let _qromaWebSerial: IQromaWebSerial | undefined = undefined;



const subscriptions = [] as IUseQromaWebSerialInputs[];

const subscriberInputs = {
  onData: (data: Uint8Array) => {
    subscriptions.forEach(s => s.onData(data));
  },
  onConnect: () => {
    console.log("QPA ON CONNECT")
    subscriptions.forEach(s => {
      if (s.onConnect) {
        s.onConnect();
      }
    })
  },
  onDisconnect: () => {
    subscriptions.forEach(s => {
      if (s.onDisconnect) {
        s.onDisconnect();
      }
    })
  },
  onPortRequestResult: (requestResult: PortRequestResult) => {
    console.log("QPA onPortRequestResult")
    console.log(subscriptions)
    subscriptions.forEach(s => s.onPortRequestResult(requestResult));
  },
}


export const useQromaWebSerial = (subscriber: IUseQromaWebSerialInputs): IQromaWebSerial => {

  subscriptions.push(subscriber);
  console.log("NEED TO ACCOUNT FOR UNSUBSCRIBING")
  if (_qromaWebSerial !== undefined) {
    return _qromaWebSerial;
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

  const _connectionState: IQromaConnectionState = {
    isConnected: false,
    isPortConnected: false,
    isMonitorOn: false
  };

  const getConnectionState = () => {
    return {
      ..._connectionState,
    };
  }

  const _onConnect = () => {
    console.log("QWS _onConnect")
    _connectionState.isConnected = true;
    subscriberInputs.onConnect();
  }

  const _onDisconnect = () => {
    _connectionState.isConnected = false;
    subscriberInputs.onDisconnect();
  }

  console.log("ADDING EVENT LISTENERS");
  qSerial.addEventListener("connect", _onConnect)
  qSerial.addEventListener("disconnect", _onDisconnect)
  console.log("DONE ADDING EVENT LISTNERS");


  const requestPort = async () => {
    
    console.log("In requestPort()");

    try {
      if (qromaWebSerialContext.port && _connectionState.isConnected) {
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

      _connectionState.isConnected = true;
      subscriberInputs.onPortRequestResult({success: true});

      return port;
    } catch (e: any) {
      console.log("requestPort() failed");
      console.log(e);
      const portOpen = e.indexOf("port is already open") !== -1;

      console.log("IS PORT OPEN?");
      console.log(portOpen);

      subscriberInputs.onPortRequestResult({success: false});
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

  const startMonitoring = async () => {
    console.log("START MONITORING: startMonitoring");

    await requestPort();

    if (!getConnectionState().isConnected) {
      throw new Error("Can't start monitor - no connection");
      // return;
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

        subscriberInputs.onData(value);
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

  _qromaWebSerial = {
    sendBytes,
    sendString,

    getConnectionState,

    startMonitoring,
    stopMonitoring,

    // onData: (_: Uint8Array) => { },
  };

  return _qromaWebSerial;
}