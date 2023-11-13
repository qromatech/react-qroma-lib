import { PortRequestResult } from "../QromaWebSerial";
import { QromaCommCommand, QromaCommResponse } from '../../../qroma-comm-proto/qroma-comm';
import { IMessageType } from '@protobuf-ts/runtime';
import { QcuCreateQromaCommMessageForAppCommand } from '../../QromaCommUtils';
import { useInitQromaCommWebSerial } from "../../QromaSiteApp";


export interface IUseQromaAppWebSerialInputs<TCommand extends object, TResponse extends object> {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onPortRequestResult: ((requestResult: PortRequestResult) => void);

  commandMessageType?: IMessageType<TCommand>
  responseMessageType: IMessageType<TResponse>

  onQromaCommResponse: (message: QromaCommResponse) => void;
  onQromaAppResponse: (appMessage: TResponse) => void;
}

export interface IQromaAppWebSerial<TCommand extends object> {
  startMonitoring: () => void
  stopMonitoring: () => void
  getIsConnected: () => boolean
  sendQromaAppCommand: (appCommand: TCommand) => void
  createQromaCommMessageForAppCommand: (appCommand: TCommand) => QromaCommCommand
}


export const useQromaAppWebSerial = 
  <TCommand extends object, TResponse extends object>
(inputs: IUseQromaAppWebSerialInputs<TCommand, TResponse>): IQromaAppWebSerial<TCommand> => 
{
  if (!window) {
    throw Error("Not running in a browser");
  }


  const createQromaCommMessageForAppCommand = (appCommand: TCommand): QromaCommCommand => {
    return QcuCreateQromaCommMessageForAppCommand(appCommand, inputs.commandMessageType);
  }

  const sendQromaAppCommand = async (appCommand: TCommand) => {
    if (inputs.commandMessageType === undefined) {
      throw Error("sendQromaAppCommand() failure - no commandMessageType provided on IUseQromaAppWebSerialInputs")
    }

    const appMessageBytes = inputs.commandMessageType.toBinary(appCommand);

    const qromaCommCommand: QromaCommCommand = {
      command: {
        oneofKind: 'appCommandBytes',
        appCommandBytes: appMessageBytes,
      }
    }

    qromaCommWebSerial.sendQromaCommCommand(qromaCommCommand);
  }

  const onQromaCommResponse = (qromaCommResponse: QromaCommResponse) => {
    console.log("QromaAppWebSerial - onData");
    console.log(qromaCommResponse);
    if (qromaCommResponse.response.oneofKind === 'appResponseBytes') {
      const appResponseBytes = qromaCommResponse.response.appResponseBytes;
      const appResponse = inputs.responseMessageType.fromBinary(appResponseBytes);
      console.log("APP RESPONSE");
      console.log(appResponse);
      if (appResponse === undefined) {
        console.log("UNDEFINED APP RESPONSE BYTES");
        console.log(appResponseBytes);
        return;
      }
      inputs.onQromaAppResponse(appResponse);
    }
  }

  const onPortRequestResult = (requestResult: PortRequestResult): void => {
    if (requestResult.success) {
      console.log("WEB SERIAL - PORT REQUEST SUCCESS");
      inputs.onPortRequestResult(requestResult);
    } else {
      console.log("WEB SERIAL - PORT REQUEST FAIL");
      inputs.onPortRequestResult(requestResult);
    }
  }

  console.log("CALLING useQromaCommWebSerial");
  // const qromaCommWebSerial = useQromaCommWebSerial({
  const qromaCommWebSerial = useInitQromaCommWebSerial({
    onQromaCommResponse,
    onConnect: inputs.onConnect,
    onDisconnect: inputs.onDisconnect,
    onPortRequestResult,
  });


  return {
    startMonitoring: qromaCommWebSerial.startMonitoring,
    getIsConnected: qromaCommWebSerial.getIsConnected,
    stopMonitoring: qromaCommWebSerial.stopMonitoring,
    sendQromaAppCommand,
    createQromaCommMessageForAppCommand,
  };
}