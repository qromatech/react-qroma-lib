import { Buffer } from 'buffer';
import { IQromaConnectionState, IQromaWebSerial, useQromaWebSerial } from "./QromaWebSerial";
import { QromaCommCommand, QromaCommResponse } from '../../qroma-comm-proto/qroma-comm';
import { concatenateUint8Arrays, sleep } from '../utils';


export interface IQromaCommWebSerialRx {
  startMonitoring: () => void
  getConnectionState(): IQromaConnectionState
  stopMonitoring: () => void
  sendQromaCommCommand: (qcCommand: QromaCommCommand) => void
  sendQromaCommCommandRx: (qcCommand: QromaCommCommand, rxHandler: IQromaCommRxHandler) => Promise<void>
  monitorRx: (rxHandler: IQromaCommRxHandler) => Promise<void>
  qromaWebSerial: IQromaWebSerial
  unsubscribe: () => void
}

export interface IQromaCommRxHandler {
  onRx: (rxBuffer: Uint8Array) => Uint8Array
  isRxComplete: () => boolean
  hasTimeoutOccurred: () => boolean
  onTimeout: () => void
}


export const useQromaCommWebSerialRx = (
  // onQromaCommResponse: (message: QromaCommResponse) => boolean,
  onConnectionChange: (latestConnection: IQromaConnectionState) => void
): IQromaCommWebSerialRx => {
  if (!window) {
    throw Error("Not running in a browser");
  }

  let _rxBuffer = new Uint8Array();
  // const _qromaCommParser = createDefaultQromaParser("mainRx");
  let _qromaCommRxHandler: IQromaCommRxHandler | undefined;

  const setRxBuffer = (update: Uint8Array) => {
    console.log("SETTING RX BUFFER")
    console.log(update)
    _rxBuffer = update;
  }

  const onData = (newData: Uint8Array) => {
    console.log("QromaCommWebSerial RX - onData - " + newData.length + " bytes");
    console.log(_qromaCommRxHandler)
    // console.log(newData);

    // let currentRxBuffer = new Uint8Array([..._rxBuffer, ...newData]);
    let currentRxBuffer = concatenateUint8Arrays(_rxBuffer, newData);

    if (_qromaCommRxHandler) {
      console.log("QROMA COMM RX PARSING")
      // let lastReadLength = 0;
      // let toReadLength = currentRxBuffer.length;
      let remainingBuffer = currentRxBuffer;
      let lastRemainingBufferLength = remainingBuffer.length + 1;

      while (remainingBuffer.length < lastRemainingBufferLength) {
      // while (lastRemainingBufferLength < remainingBuffer.length) {
        console.log("ONRX DATA");
        console.log(remainingBuffer)
        lastRemainingBufferLength = remainingBuffer.length;
        remainingBuffer = _qromaCommRxHandler.onRx(remainingBuffer);
      } 

      setRxBuffer(remainingBuffer);
      console.log("FINISH QROMA COMM RX PARSING")
    } else {
      // console.log("QC WEBSERIAL RX - CLASSIC QROMA COMM PARSING")
      // // const remainingBuffer = _qromaCommParser.parse(currentRxBuffer, onQromaCommResponse);
      // // setRxBuffer(remainingBuffer);
      // console.log("FINISH QC WEBSERIAL RX - CLASSIC QROMA COMM PARSING")
      // // throw new Error("NOT DOING THIS HERE")
      // console.log("NOT DOING THIS HERE")
    }

    // console.log("QromaCommWebSerial RX - onData complete");
  }

  const startMonitoring = async () => {
    try {
      console.log("COMM WEB SERIAL - START");
      qromaWebSerial.startMonitoring();
      console.log("COMM WEB SERIAL - START - CONNECTED");
    } catch (e) {
      console.log("COMM WEB SERIAL - ON CONNECTION FALSE");
      console.log(e);
    }
  }

  const sendQromaCommCommand = async (qcCommand: QromaCommCommand) => {
    if (!qromaWebSerial.getConnectionState().isWebSerialConnected) {
      console.log("sendQromaCommCommand - CAN'T SEND COMMAND - NO CONNECTION");
      console.log(qcCommand);
      return;
    }

    const messageBytes = QromaCommCommand.toBinary(qcCommand);
    
    console.log(messageBytes);
    const requestB64 = Buffer.from(messageBytes).toString('base64') + "\n";
    console.log(requestB64);
    console.log(requestB64.length);

    await qromaWebSerial.sendString(requestB64);
  }

  const _enterRxMode = (rxHandler: IQromaCommRxHandler) => {
    _qromaCommRxHandler = rxHandler;
    console.log("ENTER RX MODE", _qromaCommRxHandler);
  }

  const _exitRxMode = () => {
    _qromaCommRxHandler = undefined;
    console.log("EXIT RX MODE", _qromaCommRxHandler);
  }

  const sendQromaCommCommandRx = async (qcCommand: QromaCommCommand, rxHandler: IQromaCommRxHandler): Promise<void> => {
    if (!qromaWebSerial.getConnectionState().isWebSerialConnected) {
      console.log("sendQromaCommCommand - CAN'T SEND COMMAND - NO CONNECTION");
      console.log(qcCommand);
      return;
    }

    if (_qromaCommRxHandler !== undefined) {
      const errMsg = "_qromaCommRxHandler already assigned - not handling";
      console.log(errMsg);
      throw new Error(errMsg);
    }

    const messageBytes = QromaCommCommand.toBinary(qcCommand);
    
    console.log(messageBytes);
    const requestB64 = Buffer.from(messageBytes).toString('base64') + "\n";
    console.log(requestB64);
    console.log(requestB64.length);

    _enterRxMode(rxHandler);

    qromaWebSerial.sendString(requestB64);

    while (!rxHandler.isRxComplete() &&
           !rxHandler.hasTimeoutOccurred())
    {
      await sleep(25);
    }

    _exitRxMode();
  }

  const monitorRx = async (rxHandler: IQromaCommRxHandler): Promise<void> => {
    _enterRxMode(rxHandler);

    while (!rxHandler.isRxComplete() &&
           !rxHandler.hasTimeoutOccurred())
    {
      await sleep(25);
    }

    _exitRxMode();
  }


  console.log("RX CALLING useQromaWebSerial");
  const qromaWebSerial = useQromaWebSerial(
    onData,
    onConnectionChange,
  );

  return {
    startMonitoring: startMonitoring,
    getConnectionState: qromaWebSerial.getConnectionState,
    stopMonitoring: qromaWebSerial.stopMonitoring,
    sendQromaCommCommand,
    sendQromaCommCommandRx,
    monitorRx,
    qromaWebSerial,
    unsubscribe: qromaWebSerial.unsubscribe,
  };
}