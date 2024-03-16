import { Buffer } from 'buffer';
import { IQromaConnectionState, PortRequestResult } from "./QromaWebSerial";
import { QromaCommCommand, QromaCommResponse } from '../../qroma-comm-proto/qroma-comm';
import { useQromaCommWebSerial } from './QromaCommWebSerial';
import { QcuCreateQromaCommMessageForAppCommand } from '../QromaCommUtils';
import { QromaCoreCommand, QromaCoreResponse } from '../../qroma-comm-proto/qroma-core';


export interface IUseQromaCoreWebSerialInputs {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onPortRequestResult: ((requestResult: PortRequestResult) => void);

  // commandMessageType?: IMessageType<TCommand>
  // responseMessageType: IMessageType<TResponse>

  onQromaCoreResponse: (message: QromaCoreResponse) => void;
}

export interface IQromaCoreWebSerial {
  startMonitoring: () => void
  stopMonitoring: () => void
  getConnectionState: () => IQromaConnectionState
  sendQromaCoreCommand: (coreCommand: QromaCoreCommand) => void
  createQromaCommMessageForCoreCommand: (coreCommand: QromaCoreCommand) => QromaCommCommand
}


export const useQromaCoreWebSerial = (inputs: IUseQromaCoreWebSerialInputs): IQromaCoreWebSerial => 
{

  if (!window) {
    throw Error("Not running in a browser");
  }


  const createQromaCommMessageForCoreCommand = (coreCommand: QromaCoreCommand): QromaCommCommand => {
    // return QcuCreateQromaCommMessageForAppCommand(appCommand, inputs.commandMessageType);

    const qromaCommCommand: QromaCommCommand = {
      command: {
        oneofKind: 'coreCommand',
        coreCommand,
      }
    }
  
    console.log("QROMA COMM COMMAND FOR QROMA CORE READY");
    console.log(qromaCommCommand);
    console.log(coreCommand);
  
    return qromaCommCommand;
  }

  const sendQromaCoreCommand = async (coreCommand: QromaCoreCommand) => {
    // if (inputs.commandMessageType === undefined) {
    //   throw Error("sendQromaAppCommand() failure - no commandMessageType provided on IUseQromaAppWebSerialInputs")
    // }

    // const appMessageBytes = inputs.commandMessageType.toBinary(appCommand);

    const qromaCommCommand: QromaCommCommand = createQromaCommMessageForCoreCommand(coreCommand);

    qromaCommWebSerial.sendQromaCommCommand(qromaCommCommand);
  }

  const onQromaCommResponse = (qromaCommResponse: QromaCommResponse) => {
    console.log("QromaCoreWebSerial - onData");
    console.log(qromaCommResponse);
    if (qromaCommResponse.response.oneofKind === 'coreResponse') {
      // const appResponseBytes = qromaCommResponse.response.appResponseBytes;
      // const appResponse = inputs.responseMessageType.fromBinary(appResponseBytes);
      // console.log("APP RESPONSE");
      // console.log(appResponse);
      // if (appResponse === undefined) {
      //   console.log("UNDEFINED APP RESPONSE BYTES");
      //   console.log(appResponseBytes);
      //   return;
      // }
      // inputs.onQromaAppResponse(appResponse);

      const coreResponse = qromaCommResponse.response.coreResponse;
      console.log("CORE RESPONSE");
      console.log(coreResponse);
      inputs.onQromaCoreResponse(coreResponse);
    }
  }

  const onConnectionChange = (latestConnection: IQromaConnectionState) => {
    inputs.onPortRequestResult({success: latestConnection.isWebSerialConnected});
  }

  console.log("CALLING useQromaCoreWebSerial");
  const qromaCommWebSerial = useQromaCommWebSerial(
    onQromaCommResponse,
    onConnectionChange
  );


  return {
    startMonitoring: qromaCommWebSerial.startMonitoring,
    getConnectionState: qromaCommWebSerial.getConnectionState,
    stopMonitoring: qromaCommWebSerial.stopMonitoring,
    sendQromaCoreCommand,
    createQromaCommMessageForCoreCommand,
  };
}
