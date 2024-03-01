import { sleep } from "../utils";

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
  isBrowserSupported: boolean

  sendBytes(data: Uint8Array): void
  sendString(data: string): void

  sendBytesInChunks(data: Uint8Array, chunkSize: number, sleepDurationInMs: number): Promise<void>

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

const _createDummyQromaWebSerial = (): IQromaWebSerial => {
  let shouldMonitor = false;

  return {
    isBrowserSupported: false,

    sendBytes: (data: Uint8Array) => console.log("Dummy Qroma Web Serial sendBytes() - " + data.length),
    sendString: (data: string) => console.log("Dummy Qroma Web Serial sendString() - " + data),
  
    startMonitoring: () => {
      console.log("Dummy Qroma Web Serial startMonitoring()"),
      shouldMonitor = true;
    },
    stopMonitoring: () => {
      console.log("Dummy Qroma Web Serial stopMonitoring()")
      shouldMonitor = false;
    },
  
    getConnectionState: () => {
      return {
        isWebSerialConnected: false,
        keepQromaMonitoringOn: shouldMonitor,
        isQromaMonitoringOn: false,
      }
    },
  
    unsubscribe: () => console.log("Dummy Qroma Web Serial unsubscribe()"),
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
  if (qNavigator.serial === undefined) {
    _qromaWebSerial = _createDummyQromaWebSerial();
    return _qromaWebSerial;
  }
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

  const sendBytesInChunks = async (data: Uint8Array, chunkSize: number, sleepDurationInMs: number): Promise<void> => {
    
    // Python equivalent this logic was based on
    //
    // bytes_to_send = file_bytes[:]
    // print(f"TO SEND: {len(bytes_to_send)} BYTES")
    // while len(bytes_to_send) > send_count:
    //     the_bytes = bytes_to_send[0:send_count]
    //     await qcio.send_bytes(the_bytes)
    //     bytes_to_send = bytes_to_send[send_count:]
    //     print("SLEEP")

    //     data = await qcio.read_bytes_until_timeout(sleep_duration)
    //     # await asyncio.sleep(sleep_duration)

    //     # print(f"LINE RECEIVED: {data}")
    //     text = data.decode('utf-8')
    //     lines = text.splitlines()
    //     print("")
    //     for l in lines:
    //         print(l)
    //     print("")

    // if len(bytes_to_send) > 0:
    //     await qcio.send_bytes(bytes_to_send)

    const chunks: Uint8Array[] = [];
    for (let i = 0; i < data.length; i += chunkSize) {
        chunks.push(data.subarray(i, i + chunkSize));
    }

    const port = await requestPort();
    console.log(port);
    const writer = port.writable.getWriter();

    for (let i = 0; i < chunks.length; i++) {
      await writer.write(data);
      await sleep(sleepDurationInMs);
    }

    writer.releaseLock();
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
    isBrowserSupported: true,
    
    sendBytes,
    sendString,
    sendBytesInChunks,

    startMonitoring,
    stopMonitoring,

    getConnectionState,

    unsubscribe,
  };

  return _qromaWebSerial;
}