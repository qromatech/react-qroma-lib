import React, { useState } from "react"
import { Buffer } from 'buffer';
import { FieldInfo, IMessageType } from "@protobuf-ts/runtime"
import { MessageInputComponent } from "./proto-components/message-builder/MessageInputComponent"
import { MessageDataViewerComponent } from './proto-components/message-data-viewer/MessageDataViewerComponent';
import { IQromaAppWebSerial } from "./webserial/QromaAppWebSerial";
import { QromaCommCommand, QromaCommResponse } from "../qroma-comm-proto/qroma-comm";
import { convertBinaryToBase64 } from './utils';
import { QromaAppCommandLink } from './QromaAppCommandLink';


interface IQromaRequestFormProps<TCommand extends object, TResponse extends object> {
  requestMessageType: IMessageType<TCommand>
  responseMessageType: IMessageType<TResponse>
  qromaWebSerial: IQromaAppWebSerial<TCommand>
}


export const QromaRequestForm = <TCommand extends object, TResponse extends object>(props: IQromaRequestFormProps<TCommand, TResponse>) => {
  const m = props.requestMessageType;

  const [requestObject, setRequestObject] = useState(props.requestMessageType.create());
  const [requestObjectData, setRequestObjectData] = useState(
    props.requestMessageType.toJson(props.requestMessageType.create())
  );

  const [qromaCommCommand, setQromaCommCommand] = useState(QromaCommCommand.create());
  const [requestB64, setRequestB64] = useState("");

  console.log("INIT OBJECT STATE");
  console.log(requestObjectData);

  const onChange = (_: FieldInfo, newValue: any) => {
    console.log("REQUEST FORM CHANGE");
    console.log(newValue);

    const newRequestObjectData = JSON.parse(JSON.stringify(newValue));
    setRequestObjectData(newRequestObjectData);

    console.log("newRequestObjectData");
    console.log(newRequestObjectData);

    const updatedQromaCommCommand = props.qromaWebSerial.createQromaCommMessageForAppCommand(newRequestObjectData);
    setQromaCommCommand(updatedQromaCommCommand);

    try {
      const qromaMessageBytes = QromaCommCommand.toBinary(updatedQromaCommCommand);
      const updatedRequestB64 = Buffer.from(qromaMessageBytes).toString('base64') + "\n";
      setRequestB64(updatedRequestB64);
    } catch (e) {
      console.log("ERROR SETTING REQUEST B64");
      console.log(e)
    }
  }

  const sendRequest = async () => {
    console.log("SEND COMMAND");

    const requestObject = props.requestMessageType.fromJson(requestObjectData);
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
    console.log(requestObjectData);
    const requestObject = props.requestMessageType.fromJson(requestObjectData);
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

  const promptUserForJson = () => {
    const userJson = prompt("Enter JSON to use for message");
    if (userJson) {
      const newRequestObjectData = JSON.parse(userJson);
      setRequestObjectData(newRequestObjectData);
    }
  }

  const promptUserForBase64QromaCommand = () => {
    const userB64 = prompt("Enter QromaComm command binary in Base64 to use for message");
    if (userB64) {
      const messageBytes = Buffer.from(userB64, 'base64');
      const qcc = QromaCommCommand.fromBinary(messageBytes);
      console.log(qcc);
      const appCommand = props.requestMessageType.fromBinary(qcc.command.appCommandBytes);
      console.log(appCommand);
    }
  }

  const promptUserForBase64QromaResponse = () => {
    const userB64 = prompt("Enter QromaComm response binary in Base64 to use for message");
    if (userB64) {
      const messageBytes = Buffer.from(userB64, 'base64');
      const qcr = QromaCommResponse.fromBinary(messageBytes);
      console.log(qcr);
      const appResponse = props.responseMessageType.fromBinary(qcr.response.appResponseBytes);
      console.log(appResponse);
    }
  }

  const doSetUpdateProgressIndicatorTest = () => {
    // const myAppCommand: MyAppCommand = {
    //   command: {
    //     oneofKind: 'setUpdateProgressIndicator',
    //     setUpdateProgressIndicator: {
    //       indicatorChars: '.-',
    //     }
    //   }
    // };

    // console.log("MY APP COMMAND OUTPUT");
    // console.log(myAppCommand);

    // setRequestObjectData(MyAppCommand.toJson(myAppCommand));

    const qromaCommCommand = props.qromaWebSerial.createQromaCommMessageForAppCommand(requestObject);
    console.log("qromaCommCommand");
    console.log(qromaCommCommand);
  }
  
  console.log("QCC");
  console.log(qromaCommCommand);

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
    appCommandJsonStr = props.requestMessageType.toJsonString(props.requestMessageType.fromJson(requestObjectData));
  } catch (e) {
    console.log("ERROR SETTING APP COMMAND JSON STR");
    console.log(e);
  }

  let qcCommandJsonStr = "";
  try {
    qcCommandJsonStr = QromaCommCommand.toJsonString(qromaCommCommand);
  } catch (e) {
    console.log("ERROR SETTING APP COMMAND JSON STR");
    console.log(e);
  }

  return (
    <div>
      <MessageInputComponent
        requestMessageType={m}
        messageName="requestForm"
        typeName={m.typeName}
        fields={m.fields}
        onChange={onChange}
        key={m.typeName}
        />
      <div>
        App Command: {appCommandJsonStr}
      </div>
      <div>
        App Command B64: {requestObjectJsonDataToB64(requestObjectData)}
      </div>
      <div>
        App Command Link: <QromaAppCommandLink commandAsBase64={requestObjectJsonDataToB64(requestObjectData)} />
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
      <button onClick={() => promptUserForJson() }>Load from JSON</button>
      <button onClick={() => promptUserForBase64QromaCommand() }>Load QC Command from B64</button>
      <button onClick={() => promptUserForBase64QromaResponse() }>Load QC Response from B64</button>
      <button onClick={() => doSetUpdateProgressIndicatorTest() }>Test</button>
      <MessageDataViewerComponent
        messageType={props.requestMessageType}
        messageData={requestObject}
        />
    </div>
  )
}