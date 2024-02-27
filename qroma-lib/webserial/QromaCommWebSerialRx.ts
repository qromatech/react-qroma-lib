import { Buffer } from 'buffer';
import { IQromaConnectionState, IQromaWebSerial, PortRequestResult, useQromaWebSerial } from "./QromaWebSerial";
import { QromaCommCommand, QromaCommResponse } from '../../qroma-comm-proto/qroma-comm';
import { createDefaultQromaParser } from './QromaCommParser';
import { sleep } from '../utils';


export interface IQromaCommWebSerialRx {
  startMonitoring: () => void
  getConnectionState(): IQromaConnectionState
  stopMonitoring: () => void
  sendQromaCommCommand: (qcCommand: QromaCommCommand) => void
  sendQromaCommCommandRx: (qcCommand: QromaCommCommand, rxHandler: IQromaCommRxHandler) => void
  qromaWebSerial: IQromaWebSerial
}

export interface IQromaCommRxHandler {
  onRx: (rxBuffer: Uint8Array) => Uint8Array
  isRxComplete: () => boolean
  hasTimeoutOccurred: () => boolean
  onTimeout: () => void
}


export const useQromaCommWebSerialRx = (
  onQromaCommResponse: (message: QromaCommResponse) => void,
  onConnectionChange: (latestConnection: IQromaConnectionState) => void
): IQromaCommWebSerialRx => {
  if (!window) {
    throw Error("Not running in a browser");
  }

  let _rxBuffer = new Uint8Array();
  const _qromaCommParser = createDefaultQromaParser();
  let _qromaCommRxHandler: IQromaCommRxHandler | undefined;

  const setRxBuffer = (update: Uint8Array) => {
    _rxBuffer = update;
  }

  const onData = (newData: Uint8Array) => {
    console.log("QromaCommWebSerial RX - onData");
    console.log(newData);

    let currentRxBuffer = new Uint8Array([..._rxBuffer, ...newData]);

    if (_qromaCommRxHandler) {
      console.log("QROMA COMM RX PARSING")
      _qromaCommRxHandler.onRx(currentRxBuffer);
    } else {
      console.log("CLASSIC QROMA COMM PARSING")
      const remainingBuffer = _qromaCommParser.parse(currentRxBuffer, onQromaCommResponse);
      setRxBuffer(remainingBuffer);  
    }




    // let currentRxBuffer = new Uint8Array([..._rxBuffer, ...newData]);
    // let firstNewLineIndex = 0;

    // while (firstNewLineIndex !== -1) {

    //   let firstNewLineIndex = currentRxBuffer.findIndex(x => x === 10);

    //   if (firstNewLineIndex === -1) {
    //     setRxBuffer(currentRxBuffer);
    //     return;
    //   }

    //   if (firstNewLineIndex === 0) {
    //     currentRxBuffer = currentRxBuffer.slice(1, currentRxBuffer.length);
    //     continue;
    //   }

    //   try {
    //     const b64Bytes = currentRxBuffer.slice(0, firstNewLineIndex);
    //     currentRxBuffer = currentRxBuffer.slice(firstNewLineIndex, currentRxBuffer.length);

    //     const b64String = new TextDecoder().decode(b64Bytes);
    //     console.log("RESPONSE: " + b64String);
    //     const messageBytes = Buffer.from(b64String, 'base64');
    //     const response = QromaCommResponse.fromBinary(messageBytes);

    //     console.log("QromaCommWebSerial - onData has response");
    //     console.log(response);

    //     onQromaCommResponse(response);

    //   } catch (e) {
    //     // console.log("CAUGHT ERROR");
    //     // console.log(e);
    //   }
    // }
    // setRxBuffer(currentRxBuffer);

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

  const sendQromaCommCommandRx = async (qcCommand: QromaCommCommand, rxHandler: IQromaCommRxHandler) => {
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
    qromaWebSerial,
  };
}