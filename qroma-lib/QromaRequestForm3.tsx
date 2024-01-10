import React, { useState } from "react"
import { Buffer } from 'buffer';
import { FieldInfo, IMessageType } from "@protobuf-ts/runtime"
// import { MessageInputComponent } from "./proto-components/message-builder/MessageInputComponent"
import { MessageDataViewerComponent } from './proto-components/message-data-viewer/MessageDataViewerComponent';
import { IQromaAppWebSerial } from "./webserial/QromaAppWebSerial";
import { QromaCommCommand, QromaCommResponse } from "../qroma-comm-proto/qroma-comm";
import { convertBinaryToBase64 } from './utils';
import { QromaAppCommandLink } from './QromaAppCommandLink';
import { RootMessageComponent } from "./proto-components/message-builder/RootMessageComponent";
import { createMessageInstanceWithDefaultValues, createPopulatedMessageObject } from "./proto-components/message-builder/builder_utils";
import { MyAppCommand } from "./proto-components/message-builder/hello-qroma";
import { QromaPbRootMessageComponent } from "./proto-components/message-builder/QromaPbRootMessageComponent";


interface IQromaRequestFormProps<TCommand extends object, TResponse extends object> {
  requestMessageType: IMessageType<TCommand>
  responseMessageType: IMessageType<TResponse>
  qromaWebSerial: IQromaAppWebSerial<TCommand>
}


export const QromaRequestForm3 = <TCommand extends object, TResponse extends object>(props: IQromaRequestFormProps<TCommand, TResponse>) => {
  const m = props.requestMessageType;
  console.log("REQUEST MESSAGE TYPE");
  console.log(m)

  // const [requestObject, setRequestObject] = useState(props.requestMessageType.create());
  // const [requestObjectData, setRequestObjectData] = useState(
  //   props.requestMessageType.toJson(props.requestMessageType.create())
  // );

  // const [rootMessage, setRootMessage] = useState(createMessageInstanceWithDefaultValues(props.requestMessageType));
  // const [rootMessage, setRootMessage] = useState(createMessageInstanceWithDefaultValues(MyAppCommand));
  const [rootMessage, setRootMessage] = useState(createPopulatedMessageObject(MyAppCommand));
  

  console.log("JSON-ING")
  console.log(rootMessage);

  // const [rootMessageJson, setRootMessageJson] = useState(props.requestMessageType.toJson(rootMessage));
  const rootMessageJson = MyAppCommand.toJson(rootMessage);
  console.log("DONE JSON-ING")
  console.log(rootMessageJson)

  // const [qromaCommCommand, setQromaCommCommand] = useState(QromaCommCommand.create());
  // const [requestB64, setRequestB64] = useState("");

  console.log("ROOT MESSAGE STATE");
  console.log(rootMessage);

  const qromaCommCommand = props.qromaWebSerial.createQromaCommMessageForAppCommand(rootMessage);
  const qromaMessageBytes = QromaCommCommand.toBinary(qromaCommCommand);
  const requestB64 = Buffer.from(qromaMessageBytes).toString('base64') + "\n";

  const onNewRootMessageValue = (newRootMessageValue: any) => {
    console.log("SETTING NEW ROOT MESSAGE VALUE");
    console.log(newRootMessageValue);

    setRootMessage(newRootMessageValue);

    const newRequestObjectData = JSON.parse(JSON.stringify(newRootMessageValue));
    setRootMessage(newRequestObjectData);

    console.log("newRequestObjectData");
    console.log(newRequestObjectData);
  }

  const sendRequest = async () => {
    console.log("SEND COMMAND");

    const requestObject = props.requestMessageType.fromJson(rootMessageJson);
    const result = await props.qromaWebSerial.sendQromaAppCommand(requestObject);

    console.log("REQUEST SENT");
    console.log(result);
  }
  
  const startConnection = () => {
    console.log("START CONNECTION");
    props.qromaWebSerial.startMonitoring();
  }

  const createQromaAppMessage = () => {
    console.log(props.requestMessageType);
    console.log(rootMessageJson);
    const requestObject = props.requestMessageType.fromJson(rootMessageJson);
    const qromaCommCommand = props.qromaWebSerial.createQromaCommMessageForAppCommand(requestObject);
    console.log(qromaCommCommand);

    const qromaMessageBytes = QromaCommCommand.toBinary(qromaCommCommand);

    console.log(qromaMessageBytes);
    const requestB64 = Buffer.from(qromaMessageBytes).toString('base64') + "\n";
    console.log("APP MESSAGE B64");
    console.log(requestB64);
    console.log(requestB64.length);

    console.log("REQUEST TO QROMA B64");
    console.log(requestObject);
  }

  const isQromaWebSerialConnected = props.qromaWebSerial.getConnectionState().isWebSerialConnected;
  console.log("isQromaWebSerialConnected: " + isQromaWebSerialConnected);

  const requestObjectJsonDataToB64 = (data) => {
    const message = props.requestMessageType.fromJson(data);
    const appMessageBytes = props.requestMessageType.toBinary(message);
    const appCommandB64 = convertBinaryToBase64(appMessageBytes);
    return appCommandB64;
  }

  let appCommandJsonStr = "";
  try {
    appCommandJsonStr = props.requestMessageType.toJsonString(props.requestMessageType.fromJson(rootMessageJson));
  } catch (e) {
    console.log("ERROR SETTING APP COMMAND JSON STR");
    console.log(e);
  }

  let qcCommandJsonStr = "";
  try {
    qcCommandJsonStr = QromaCommCommand.toJsonString(qromaCommCommand);
  } catch (e) {
    console.log("ERROR SETTING QROMA COMM APP COMMAND JSON STR");
    console.log(e);
  }

  console.log("ROOT MESSAGE VALUE")
  console.log(rootMessage)

  return (
    <div>
      <QromaPbRootMessageComponent
        messageType={m}
        messageName="rootMessage"
        // typeName={m.typeName}
        // fields={m.fields}
        // onChange={onChange}
        rootMessageValue={rootMessage}
        onNewRootMessageValue={onNewRootMessageValue}
        key={m.typeName}
        />
      <div>
        App Command: {appCommandJsonStr}
      </div>
      <div>
        App Command B64: {requestObjectJsonDataToB64(rootMessageJson)}
      </div>
      <div>
        App Command Link: <QromaAppCommandLink commandAsBase64={requestObjectJsonDataToB64(rootMessageJson)} />
      </div>
      <div>
        QC Command: {qcCommandJsonStr}
      </div>
      <div>
        QC Command B64: [{requestB64}]
      </div>
      
      {isQromaWebSerialConnected ? 
        <button onClick={() => sendRequest() }>Send Request</button> :
        <button onClick={() => startConnection() }>Start Connection!</button> 
      }
      <button onClick={() => createQromaAppMessage() }>Show Qroma Comm Message</button>
      <MessageDataViewerComponent
        messageType={props.requestMessageType}
        messageData={rootMessage}
        />
    </div>
  )
}