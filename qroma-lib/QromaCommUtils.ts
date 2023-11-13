import { IMessageType } from "@protobuf-ts/runtime";
import { QromaCommCommand } from "../qroma-comm-proto/qroma-comm";


export const QcuCreateQromaCommAppCommandBytesMessageForAppCommand = <TCommand extends object>(
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
  // appCommand.oneofKind = Object.keys(appCommand)[0];

  console.log("APP COMMAND");
  console.log(command);
  console.log(appCommand)
  console.log("APP MESSAGE TYPE");
  console.log(commandMessageType);
  console.log(appCommandType);
  const appMessageJson = commandMessageType.toJson(appCommand);
  console.log(appMessageJson);
  const appMessageBytes = commandMessageType.toBinary(appCommand);
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

  console.log("QROMA COMM COMMAND READY");
  console.log(qromaCommCommand);
  console.log(appCommand);

  return qromaCommCommand;
}
