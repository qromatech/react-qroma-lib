import { Buffer } from 'buffer';
import { IQromaConnectionState, IQromaWebSerial, PortRequestResult, useQromaWebSerial } from "./QromaWebSerial";
import { QromaCommCommand, QromaCommResponse } from '../../qroma-comm-proto/qroma-comm';


export interface IQromaCommWebSerialRx {
  startMonitoring: () => void
  getConnectionState(): IQromaConnectionState
  stopMonitoring: () => void
  sendQromaCommCommand: (qcCommand: QromaCommCommand) => void
  sendQromaCommCommandRx: (qcCommand: QromaCommCommand, rxHandler: IQromaCommandRxHandler) => void
  qromaWebSerial: IQromaWebSerial
}

export interface IQromaCommandRxHandler {

}


export const useQromaCommWebSerialRx = (
  onQromaCommResponse: (message: QromaCommResponse) => void,
  onConnectionChange: (latestConnection: IQromaConnectionState) => void
): IQromaCommWebSerialRx => {
  if (!window) {
    throw Error("Not running in a browser");
  }

  let _rxBuffer = new Uint8Array();
  let _qromaCommandRxHandler: IQromaCommandRxHandler | undefined;

  const setRxBuffer = (update: Uint8Array) => {
    _rxBuffer = update;
  }

  const onData = (newData: Uint8Array) => {
    console.log("QromaCommWebSerial - onData");
    console.log(newData);

    let currentRxBuffer = new Uint8Array([..._rxBuffer, ...newData]);

    let firstNewLineIndex = 0;

    while (firstNewLineIndex !== -1) {

      let firstNewLineIndex = currentRxBuffer.findIndex(x => x === 10);

      if (firstNewLineIndex === -1) {
        setRxBuffer(currentRxBuffer);
        return;
      }

      if (firstNewLineIndex === 0) {
        currentRxBuffer = currentRxBuffer.slice(1, currentRxBuffer.length);
        continue;
      }

      try {
        const b64Bytes = currentRxBuffer.slice(0, firstNewLineIndex);
        currentRxBuffer = currentRxBuffer.slice(firstNewLineIndex, currentRxBuffer.length);

        const b64String = new TextDecoder().decode(b64Bytes);
        console.log("RESPONSE: " + b64String);
        const messageBytes = Buffer.from(b64String, 'base64');
        const response = QromaCommResponse.fromBinary(messageBytes);

        console.log("QromaCommWebSerial - onData has response");
        console.log(response);

        onQromaCommResponse(response);

      } catch (e) {
        // console.log("CAUGHT ERROR");
        // console.log(e);
      }
    }
    setRxBuffer(currentRxBuffer);
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

  const _enterRxMode = (rxHandler: IQromaCommandRxHandler) => {
    _qromaCommandRxHandler = rxHandler;

  }

  const _exitRxMode = () => {
    _qromaCommandRxHandler = undefined;
  }

  const sendQromaCommCommandRx = async (qcCommand: QromaCommCommand, rxHandler: IQromaCommandRxHandler) => {
    if (!qromaWebSerial.getConnectionState().isWebSerialConnected) {
      console.log("sendQromaCommCommand - CAN'T SEND COMMAND - NO CONNECTION");
      console.log(qcCommand);
      return;
    }

    if (_qromaCommandRxHandler !== undefined) {
      const errMsg = "_qromaCommandRxHandler already assigned - not handling";
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

    _exitRxMode();
  }


  console.log("CALLING useQromaWebSerial");
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