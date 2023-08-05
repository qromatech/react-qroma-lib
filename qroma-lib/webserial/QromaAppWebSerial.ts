import { Buffer } from 'buffer';
import { PortRequestResult } from "./QromaWebSerial";
import { QromaCommCommand, QromaCommResponse } from '../../qroma-comm-proto/qroma-comm';
import { useQromaCommWebSerial } from './QromaCommWebSerial';
import { IMessageType } from '@protobuf-ts/runtime';


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
  // requestPort: () => any
  // startMonitoring: (onConnection: (success: boolean) => void) => void
  startMonitoring: () => void
  stopMonitoring: () => void
  getIsConnected: () => boolean
  // sendQromaCommCommand: (qcCommand: QromaCommCommand) => void
  sendQromaAppCommand: (appCommand: TCommand) => void
  createQromaCommMessageForAppCommand: (appCommand: TCommand) => QromaCommCommand
  // onQromaAppMessage: (appMessage: TResponse) => void
}


export const useQromaAppWebSerial = 
  <TCommand extends object, TResponse extends object>
(inputs: IUseQromaAppWebSerialInputs<TCommand, TResponse>): IQromaAppWebSerial<TCommand> => 
{

  if (!window) {
    throw Error("Not running in a browser");
  }


  const createQromaCommMessageForAppCommand = (appCommand: TCommand): QromaCommCommand => {
    if (inputs.commandMessageType === undefined) {
      throw Error("sendQromaAppCommand() failure - no commandMessageType provided on IUseQromaAppWebSerialInputs");
    }

    const appCommandType = Object.keys(appCommand)[0];
    const command = {
      command: {
        oneofKind: appCommandType,
        [appCommandType]: appCommand[appCommandType],
      }
    } as TCommand;
    // appCommand.oneofKind = Object.keys(appCommand)[0];

    console.log("APP COMMAND");
    console.log(command);
    // console.log(Object.keys(appCommand));
    // appCommand.command = appCommand;
    console.log("APP MESSAGE TYPE");
    console.log(inputs.commandMessageType);
    const appMessageJson = inputs.commandMessageType.toJson(command);
    console.log(appMessageJson);
    const appMessageBytes = inputs.commandMessageType.toBinary(command);
    console.log("BYTES DONE");
    console.log(appMessageBytes);
    // const parsed = inputs.commandMessageType.fromBinary(appMessageBytes);
    // console.log(parsed);

    const qromaCommCommand: QromaCommCommand = {
      command: {
        oneofKind: 'appCommandBytes',
        appCommandBytes: appMessageBytes,
      }
    }

    // const reportFileDataCommand: QromaCommCommand = {
    //   command: {
    //     oneofKind: 'fsCommand',
    //     fsCommand: {
    //       command: {
    //         oneofKind: 'reportFileDataCommand',
    //         reportFileDataCommand: {
    //           filename: filePath,
    //         }
    //       }
    //     }
    //   }
    // };

    console.log("QROMA COMM COMMAND READY");
    console.log(qromaCommCommand);
    console.log(appCommand);

    return qromaCommCommand;

    // const qromaMessageBytes = QromaCommCommand.toBinary(qromaCommCommand);

    // console.log(qromaMessageBytes);
    // const requestB64 = Buffer.from(qromaMessageBytes).toString('base64') + "\n";
    // console.log(requestB64);
    // console.log(requestB64.length);

    // return requestB64;
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

    // const qromaMessageBytes = QromaCommCommand.toBinary(qromaCommCommand);

    // console.log(qromaMessageBytes);
    // const requestB64 = Buffer.from(qromaMessageBytes).toString('base64') + "\n";
    // console.log(requestB64);
    // console.log(requestB64.length);

    qromaCommWebSerial.sendQromaCommCommand(qromaCommCommand);

    // const encoder = new TextEncoder();
    // const encoded = encoder.encode(requestB64);

    // const port = await qromaCommWebSerial.requestPort();
    // console.log(port);
    // const writer = port.writable.getWriter();
    // console.log("QromaAppWebSerial wrote to serial");
    // console.log(encoded);

    // await writer.write(encoded);
    // writer.releaseLock();
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
  const qromaCommWebSerial = useQromaCommWebSerial({
    onQromaCommResponse,
    onConnect: inputs.onConnect,
    onDisconnect: inputs.onDisconnect,
    onPortRequestResult,
  });


  return {
    // requestPort: qromaCommWebSerial.requestPort,
    startMonitoring: qromaCommWebSerial.startMonitoring,
    getIsConnected: qromaCommWebSerial.getIsConnected,
    stopMonitoring: qromaCommWebSerial.stopMonitoring,
    sendQromaAppCommand,
    createQromaCommMessageForAppCommand,
  };
}