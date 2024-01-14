import { IMessageType } from "@protobuf-ts/runtime";
import { QromaCommCommand } from "../qroma-comm-proto/qroma-comm";


export const QcuCreateQromaCommMessageForAppCommand = <TCommand extends object>(
  appCommand: TCommand,
  commandMessageType?: IMessageType<TCommand>, 
): QromaCommCommand => {

  if (commandMessageType === undefined) {
    throw Error("sendQromaAppCommand() failure - no commandMessageType provided on IUseQromaAppWebSerialInputs");
  }

  console.log("RAW APP COMMAND")
  console.log(appCommand)

  try {
    const appMessageBytes = commandMessageType.toBinary(appCommand);
    console.log("BYTES DONE");
    console.log(appMessageBytes);
  
    const qromaCommCommand: QromaCommCommand = {
      command: {
        oneofKind: 'appCommandBytes',
        appCommandBytes: appMessageBytes,
      }
    }
  
    console.log("QROMA COMM COMMAND READY");
    console.log(qromaCommCommand);
    console.log(appCommand);
  
    return qromaCommCommand;
  
  } catch (e) {
    console.log("UNABLE TO JSON FROM COMMAND MESSAGE")
    console.log(e)
    return;
  }
}
