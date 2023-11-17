import { Buffer } from 'buffer';
import { PortRequestResult, useQromaWebSerial } from "./QromaWebSerial";
import { QromaCommCommand, QromaCommResponse } from '../../qroma-comm-proto/qroma-comm';
import { useInitQromaWebSerial } from '../QromaSiteApp';


export interface IUseQromaCommWebSerialInputs {
  onQromaCommResponse: (message: QromaCommResponse) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onPortRequestResult: ((requestResult: PortRequestResult) => void);
}

export interface IQromaCommWebSerial {
  // requestPort: () => any
  startMonitoring: () => void
  getIsConnected(): boolean
  stopMonitoring: () => void
  sendQromaCommCommand: (qcCommand: QromaCommCommand) => void
}


export const useQromaCommWebSerial = (inputs: IUseQromaCommWebSerialInputs): IQromaCommWebSerial => {
  if (!window) {
    throw Error("Not running in a browser");
  }

  let rxBuffer = new Uint8Array();

  const setRxBuffer = (update: Uint8Array) => {
    rxBuffer = update;
  }

  const onData = (newData: Uint8Array) => {
    console.log("QromaCommWebSerial - onData");
    console.log(newData);

    let currentRxBuffer = new Uint8Array([...rxBuffer, ...newData]);

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
        console.log("RESPONSE --: " + b64String);
        const messageBytes = Buffer.from(b64String, 'base64');
        const response = QromaCommResponse.fromBinary(messageBytes);

        console.log("QromaCommWebSerial - onData has response");
        console.log(response);

        inputs.onQromaCommResponse(response);

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
      // onConnection(true);
    } catch (e) {
      console.log("COMM WEB SERIAL - ON CONNECTION FALSE");
      console.log(e);
    }
  }

  const sendQromaCommCommand = async (qcCommand: QromaCommCommand) => {
    if (!qromaWebSerial.getIsConnected()) {
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

  // const onPortRequestResult = (requestResult: PortRequestResult): void => {
  //   if (requestResult.success) {
  //     console.log("WEB SERIAL - PORT REQUEST SUCCESS");
  //     inputs.onPortRequestResult(requestResult);
  //   } else {
  //     console.log("WEB SERIAL - PORT REQUEST FAIL");
  //     inputs.onPortRequestResult(requestResult);
  //   }
  // }


  console.log("CALLING useQromaWebSerial");
  // const qromaWebSerial = useQromaWebSerial({
  const qromaWebSerial = useInitQromaWebSerial({
    onData,
    onConnect: inputs.onConnect,
    onDisconnect: inputs.onDisconnect,
    onPortRequestResult: inputs.onPortRequestResult,
  });

  return {
    // requestPort: qromaWebSerial.requestPort,
    startMonitoring: startMonitoring,
    getIsConnected: qromaWebSerial.getIsConnected,
    stopMonitoring: qromaWebSerial.stopMonitoring,
    sendQromaCommCommand,
  };
}