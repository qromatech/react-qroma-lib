import { Buffer } from 'buffer';
import { IQromaConnectionState, PortRequestResult } from "./QromaWebSerial";
import { QromaCommCommand, QromaCommResponse } from '../../qroma-comm-proto/qroma-comm';
import { IMessageType } from '@protobuf-ts/runtime';
import { QcuCreateQromaCommMessageForAppCommand } from '../QromaCommUtils';
import { IQromaCommRxHandler, useQromaCommWebSerialRx } from './QromaCommWebSerialRx';
import { createDefaultQromaParser } from './QromaCommParser';


export interface IUseQromaAppWebSerialInputs<TCommand extends object, TResponse extends object> {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onPortRequestResult: ((requestResult: PortRequestResult) => void);

  commandMessageType?: IMessageType<TCommand>
  responseMessageType: IMessageType<TResponse>

  onQromaCommResponse: (message: QromaCommResponse) => void;
  onQromaAppResponse: (appMessage: TResponse) => void;
}

export interface IQromaAppRxHandler<TResponse extends object> {
  onAppRx: (rxBuffer: TResponse) => boolean // return true if the app considers this handled based on response
  // isRxComplete: () => boolean
  // hasTimeoutOccurred: () => boolean
  // onTimeout: () => void
}

export interface IQromaAppWebSerial<TCommand extends object, TResponse extends object> {
  startMonitoring: () => void
  stopMonitoring: () => void
  getConnectionState: () => IQromaConnectionState
  sendQromaAppCommand: (appCommand: TCommand) => void
  createQromaCommMessageForAppCommand: (appCommand: TCommand) => QromaCommCommand
  sendQromaAppCommandRx: (appCommand: TCommand, rxHandler: IQromaAppRxHandler<TResponse>, timeoutInMs: number) => Promise<void>
}


export const useQromaAppWebSerialRx = 
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

  const sendQromaAppCommandRx = async (appCommand: TCommand, rxHandler: IQromaAppRxHandler<TResponse>, timeoutInMs: number) => {
    const qromaCommCommand = createQromaCommMessageForAppCommand(appCommand);

    const expirationTime = Date.now() + timeoutInMs;
    let appResponse: TResponse | undefined;
    let handled = false;

    const dqp = createDefaultQromaParser("downloadRx");

    const checkForAppResult = (qromaCommResponse: QromaCommResponse): boolean => {

      console.log("CHECKING FOR APP RESULT");
      console.log(qromaCommResponse);

      if (qromaCommResponse.response.oneofKind === 'appResponseBytes') {
        const appResponseBytes = qromaCommResponse.response.appResponseBytes;

        try {
          appResponse = inputs.responseMessageType.fromBinary(appResponseBytes);
          if (appResponse === undefined) {
            console.log("sendQromaAppCommandRx - UNDEFINED APP RESPONSE BYTES");
            console.log(appResponseBytes);
            return;
          }

          console.log("PARSED APP RESPONSE")
          console.log(appResponse)
          
          // leave it up to rxHandler to decide if this is handled or not
          handled = rxHandler.onAppRx(appResponse);
        } catch (e) {
          console.log("APP RESPONSE PARSE ERR");
          console.log(e);
        }
      }
  
      return true;
    }

    const qromaCommRxHandler: IQromaCommRxHandler = {
      hasTimeoutOccurred: () => Date.now() > expirationTime,
      onTimeout: () => { console.log("IQromaCommRxHandler for QromaAppWebSerialRx timed out") },
      isRxComplete: () => appResponse !== undefined || Date.now() > expirationTime,
      onRx: (rxBuffer: Uint8Array) => {
        return dqp.parse(rxBuffer, checkForAppResult);
      },
    }

    await qromaCommWebSerial.sendQromaCommCommandRx(qromaCommCommand, qromaCommRxHandler);
  }

  const onQromaCommResponse = (qromaCommResponse: QromaCommResponse) => {
    console.log("SOME RESPONSE HERE")
    console.log(qromaCommResponse)
    if (qromaCommResponse.response.oneofKind === 'coreResponse') {
      if (qromaCommResponse.response.coreResponse.oneofKind === 'heartbeat') {
        // console.log("CORE HEARTBEAT: ", qromaCommResponse.response.coreResponse.response.heartbeat);
      }
    } else if (qromaCommResponse.response.oneofKind === 'appResponseBytes') {
      console.log("APP RESPONSE");
      const appResponseBytes = qromaCommResponse.response.appResponseBytes;
      console.log(appResponseBytes)
      console.log(inputs.responseMessageType)
      try {
        const appResponse = inputs.responseMessageType.fromBinary(appResponseBytes);
        // console.log(appResponse);
        if (appResponse === undefined) {
          console.log("UNDEFINED APP RESPONSE BYTES");
          console.log(appResponseBytes);
          return;
        }
        inputs.onQromaAppResponse(appResponse);
      } catch (e) {
        console.log("APP RESPONSE PARSE ERR");
        console.log(e);
      }
    }
  }

  const onConnectionChange = (latestConnection: IQromaConnectionState) => {
    inputs.onPortRequestResult({success: latestConnection.isWebSerialConnected});
  }

  console.log("CALLING useQromaCommWebSerialRx");
  const qromaCommWebSerial = useQromaCommWebSerialRx(
    // onQromaCommResponse,
    onConnectionChange
  );


  return {
    startMonitoring: qromaCommWebSerial.startMonitoring,
    getConnectionState: qromaCommWebSerial.getConnectionState,
    stopMonitoring: qromaCommWebSerial.stopMonitoring,
    sendQromaAppCommand,
    createQromaCommMessageForAppCommand,
    sendQromaAppCommandRx,
  };
}