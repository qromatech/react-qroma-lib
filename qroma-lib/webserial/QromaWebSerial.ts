
const qromaWebSerialContext = {
  initialized: false,
  port: null as any,
};


export interface PortRequestResult {
  success: boolean
}


export interface IQromaConnectionState {
  isWebSerialConnected: boolean
  keepQromaMonitoringOn: boolean
  isQromaMonitoringOn: boolean
}

export interface IQromaWebSerial {
  sendBytes(data: Uint8Array): void
  sendString(data: string): void

  startMonitoring(): void
  stopMonitoring(): void  

  getConnectionState(): IQromaConnectionState

  unsubscribe: () => void
}


let _qromaWebSerial: IQromaWebSerial | undefined = undefined;



interface IQromaWebSerialSubscription {
  onData: (data: Uint8Array) => void
  onConnectionChange?: (latestConnectionState: IQromaConnectionState) => void
}

const subscriptions = [] as IQromaWebSerialSubscription[];

const subscriberInputs = {
  onData: (data: Uint8Array) => {
    subscriptions.forEach(s => {
      try {
        s.onData(data);
      } catch (e) {
        console.log("SUBSCRIBER EXCEPTION - ON DATA");
        console.log(e);
      }
    });
  },
  onConnectionChange: (latestConnectionState: IQromaConnectionState) => {
    subscriptions.forEach(s => {
      if (s.onConnectionChange) {
        try {
          s.onConnectionChange(latestConnectionState);
        } catch (e) {
          console.log("SUBSCRIBER EXCEPTION - ON CONNECTION CHANGE");
          console.log(e);
        }
      }
    });
  }
}


export const useQromaWebSerial = (
  onData: (data: Uint8Array) => void, 
  onConnectionChange: (latestConnectionState: IQromaConnectionState) => void
): IQromaWebSerial => {

  const newSubscription = {
    onData,
    onConnectionChange,
  };
  subscriptions.push(newSubscription);
  
  const unsubscribe = () => {
    const index = subscriptions.indexOf(newSubscription, 0);
    const toRemove = subscriptions[index];

    console.log(`UNSUBSCRIBING SUBSCRIPTION - INDEX ${index}`);
    console.log(toRemove);

    if (index > -1) {
      subscriptions.splice(index, 1);
    }
  }

  if (_qromaWebSerial !== undefined) {
    return {
      ..._qromaWebSerial,
      unsubscribe,
    };
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
    isWebSerialConnected: false,
    keepQromaMonitoringOn: false,
    isQromaMonitoringOn: false,
  };

  const updateConnectionState = (newState: IQromaConnectionState) => {
    _connectionState.isWebSerialConnected = newState.isWebSerialConnected;
    _connectionState.keepQromaMonitoringOn = newState.keepQromaMonitoringOn;
    _connectionState.isQromaMonitoringOn = newState.isQromaMonitoringOn;

    subscriberInputs.onConnectionChange({
      ..._connectionState
    });
  }

  const getConnectionState = () => {
    return {
      ..._connectionState,
    };
  }

  const _onConnect = () => {
    console.log("QWS _onConnect")
    updateConnectionState({
      ..._connectionState,
      isWebSerialConnected: true,
    });
  }

  const _onDisconnect = () => {
    updateConnectionState({
      ..._connectionState,
      isWebSerialConnected: false,
    });
  }

  console.log("ADDING EVENT LISTENERS");
  qSerial.addEventListener("connect", _onConnect)
  qSerial.addEventListener("disconnect", _onDisconnect)
  console.log("DONE ADDING EVENT LISTNERS");


  const requestPort = async () => {
    
    console.log("In requestPort()");

    try {
      if (qromaWebSerialContext.port && _connectionState.isWebSerialConnected) {
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

      updateConnectionState({
        ..._connectionState,
        isWebSerialConnected: true
      });

      return port;
    } catch (e: any) {
      console.log("requestPort() failed");
      console.log(e);
      const portOpen = e.indexOf("port is already open") !== -1;

      console.log("IS PORT OPEN?");
      console.log(portOpen);

      updateConnectionState({
        ..._connectionState,
        isWebSerialConnected: false
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

  const startMonitoring = async () => {
    console.log("START MONITORING: startMonitoring");

    await requestPort();

    if (!getConnectionState().isWebSerialConnected) {
      throw new Error("Can't start monitor - no webserial connection");
    }

    const port = qromaWebSerialContext.port!;
      updateConnectionState({
        ..._connectionState,
        keepQromaMonitoringOn: true
      });

    console.log(qromaWebSerialContext);
    console.log(port);
    console.log(port.readable);
    
    while (port.readable && 
           _connectionState.isWebSerialConnected &&
           _connectionState.keepQromaMonitoringOn) 
    {
      updateConnectionState({
        ..._connectionState,
        isQromaMonitoringOn: true,
      });


      const reader = port.readable.getReader();

      try {
        const { value, done } = await reader.read();
        if (done) {
          // |reader| has been canceled.
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

    updateConnectionState({
      ..._connectionState,
      isQromaMonitoringOn: false,
    });

    console.log("DONE MONITORING: startMonitoring");
  }

  const stopMonitoring = () => {
    updateConnectionState({
      ..._connectionState,
      keepQromaMonitoringOn: false,
    });
  }

  _qromaWebSerial = {
    sendBytes,
    sendString,

    startMonitoring,
    stopMonitoring,

    getConnectionState,

    unsubscribe,
  };

  return _qromaWebSerial;
}