import { IMessageType } from "@protobuf-ts/runtime";
import { QromaCommCommand } from "../qroma-comm-proto/qroma-comm";


export const QcuCreateQromaCommMessageForAppCommand = <TCommand extends object>(
  appCommand: TCommand,
  commandMessageType?: IMessageType<TCommand>, 
): QromaCommCommand => {

  if (commandMessageType === undefined) {
    throw Error("sendQromaAppCommand() failure - no commandMessageType provided on IUseQromaAppWebSerialInputs");
  }

  const appCommandType = Object.keys(appCommand)[0];
  const command = {
    command: {
      oneofKind: appCommandType,
      [appCommandType]: appCommand[appCommandType],
    }
  } as TCommand;

  console.log("APP COMMAND");
  console.log(command);
  console.log("APP MESSAGE TYPE");
  console.log(commandMessageType);
  const appMessageJson = commandMessageType.toJson(command);
  console.log(appMessageJson);
  const appMessageBytes = commandMessageType.toBinary(command);
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
}
