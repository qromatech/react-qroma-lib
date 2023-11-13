import { Buffer } from 'buffer';
import { FieldInfo, IMessageType } from "@protobuf-ts/runtime"
import React, { useState } from "react"
import { MessageInputComponent } from "./proto-components/message-builder/MessageInputComponent"
import { MessageDataViewerComponent } from './proto-components/message-data-viewer/MessageDataViewerComponent';
import { IQromaAppWebSerial } from "./webserial/QromaAppWebSerial";
import { MyAppCommand } from "../../qroma-proto/hello-qroma";
import { QromaCommCommand, QromaCommResponse } from "../qroma-comm-proto/qroma-comm";
import { QcuCreateQromaCommAppCommandBytesMessageForAppCommand } from './QromaCommUtils';
import { convertBinaryToBase64 } from './utils';
import { IQromaPageSerial } from './webserial/QromaPageSerial';
// import { IUseQromaAppWebSerialInputs, useQromaAppWebSerial } from './webserial/QromaAppWebSerial';
// import { QromaCommResponse } from '../qroma-comm-proto/qroma-comm';


interface IQromaRequestFormProps<TCommand extends object, TResponse extends object> {
  requestMessageType: IMessageType<TCommand>
  responseMessageType: IMessageType<TResponse>
  // qromaWebSerial: IQromaAppWebSerial<TCommand>
  sendQromaAppCommand: (appCommand: TCommand) => void
  qromaPageSerial: IQromaPageSerial
}

export const QromaRequestForm = <TCommand extends object, TResponse extends object>(props: IQromaRequestFormProps<TCommand, TResponse>) => {
  const m = props.requestMessageType;

  // const [requestObject, setRequestObject] = useState(props.requestMessageType.create());
  const requestObject = props.requestMessageType.create();
  const [requestObjectDataJson, setRequestObjectDataJson] = useState(
    props.requestMessageType.toJson(props.requestMessageType.create())
  );

  // const [qromaCommCommand, setQromaCommCommand] = useState(QromaCommCommand.create());
  // const [requestB64, setRequestB64] = useState("");

  console.log("INIT OBJECT STATE");
  console.log(requestObjectDataJson);

  const onChange = (_: FieldInfo, newValue: any) => {
    console.log("REQUEST FORM CHANGE");
    console.log(newValue);

    const newRequestObjectDataJson = JSON.parse(JSON.stringify(newValue));
    setRequestObjectDataJson(newRequestObjectDataJson);

    console.log("newRequestObjectData");
    console.log(newRequestObjectDataJson);

    // const updatedQromaCommCommand = props.qromaWebSerial.createQromaCommMessageForAppCommand(newRequestObjectData);


    // const updatedQromaCommCommand = QcuCreateQromaCommAppCommandBytesMessageForAppCommand<TCommand>(newRequestObjectData, props.requestMessageType);
    // setQromaCommCommand(updatedQromaCommCommand);

    // const qromaMessageBytes = QromaCommCommand.toBinary(updatedQromaCommCommand);
    // const updatedRequestB64 = Buffer.from(qromaMessageBytes).toString('base64') + "\n";
    // setRequestB64(updatedRequestB64);
  }

  const sendRequest = async () => {
    console.log("SEND COMMAND");

    const requestObject = props.requestMessageType.fromJson(requestObjectDataJson);
    const result = await props.sendQromaAppCommand(requestObject);

    console.log("REQUEST SENT");
    console.log(result);
  }
  
  const startConnection = () => {
    console.log("START CONNECTION");
    props.qromaPageSerial.startMonitoring();
    console.log("CONNECTION STARTED: " + props.qromaPageSerial.getIsConnected());
  }

  const createQromaCommMessage = () => {
    console.log(props.requestMessageType);
    console.log(requestObjectDataJson);
    const requestObject = props.requestMessageType.fromJson(requestObjectDataJson);
    const qromaCommCommand = QcuCreateQromaCommAppCommandBytesMessageForAppCommand(requestObject, props.requestMessageType);
    // const qromaCommCommand = props.qromaWebSerial.createQromaCommMessageForAppCommand(requestObject);
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
      const newRequestObjectDataJson = JSON.parse(userJson);
      setRequestObjectDataJson(newRequestObjectDataJson);
    }
  }

  const promptUserForBase64QromaCommand = () => {
    const userB64 = prompt("Enter QromaComm command binary in Base64 to use for message");
    if (userB64) {
      const messageBytes = Buffer.from(userB64, 'base64');
      const qcc = QromaCommCommand.fromBinary(messageBytes);
      console.log(qcc);
      // const appCommand = props.requestMessageType.fromBinary(qcc.command.appCommandBytes);
      // console.log(appCommand);
    }
  }

  const promptUserForBase64QromaResponse = () => {
    const userB64 = prompt("Enter QromaComm response binary in Base64 to use for message");
    if (userB64) {
      const messageBytes = Buffer.from(userB64, 'base64');
      const qcr = QromaCommResponse.fromBinary(messageBytes);
      console.log(qcr);
      // const appResponse = props.responseMessageType.fromBinary(qcr.response.appResponseBytes);
      // console.log(appResponse);
    }
  }

  // const doSetUpdateProgressIndicatorTest = () => {
  //   // const qromaCommCommand = props.qromaWebSerial.createQromaCommMessageForAppCommand(requestObject);
  //   const qromaCommCommand = QcuCreateQromaCommMessageForAppCommand<TResponse>(requestObject, props.responseMessageType);
  //   console.log("qromaCommCommand");
  //   console.log(qromaCommCommand);
  // }
  
  console.log("QCC");
  // console.log(qromaCommCommand);

  const isQromaWebSerialConnected = props.qromaPageSerial.getIsConnected();
  console.log("isQromaWebSerialConnected: " + isQromaWebSerialConnected);

  // const requestObjectQromaCommCommand = QcuCreateQromaCommAppCommandBytesMessageForAppCommand(requestObjectData, props.requestMessageType);




  const requestObjectJsonDataToB64 = (data) => {
    const message = props.requestMessageType.fromJson(data);
    const appMessageBytes = props.requestMessageType.toBinary(message);
    const appCommandB64 = convertBinaryToBase64(appMessageBytes);
    return appCommandB64;
  }

  const requestObjectJsonDataToQromaCommAppMessage = (jsonData) => {
    const objectData = props.requestMessageType.fromJson(jsonData);
    const qromaCommCommand = QcuCreateQromaCommAppCommandBytesMessageForAppCommand<TCommand>(objectData, props.requestMessageType);
    console.log("HERE WE BE MESSAGE");
    console.log(objectData);
    console.log(qromaCommCommand);
    return JSON.stringify(QromaCommCommand.toJson(qromaCommCommand));  
  }

  const requestObjectJsonDataToQromaCommAppMessageB64 = (jsonData) => {
    const objectData = props.requestMessageType.fromJson(jsonData);
    const qromaCommCommand = QcuCreateQromaCommAppCommandBytesMessageForAppCommand<TCommand>(objectData, props.requestMessageType);
    console.log("HERE WE BE 64");
    const qcMessageBytes = QromaCommCommand.toBinary(qromaCommCommand);
    const qcCommandB64 = convertBinaryToBase64(qcMessageBytes);
    return qcCommandB64;
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
        App Command: {props.requestMessageType.toJsonString(props.requestMessageType.fromJson(requestObjectDataJson))}
      </div>
      <div>
        App Command B64: {requestObjectJsonDataToB64(requestObjectDataJson)}
      </div>
      <div>
        QC Command: {requestObjectJsonDataToQromaCommAppMessage(requestObjectDataJson)}
      </div>
      <div>
        QC Command B64: {requestObjectJsonDataToQromaCommAppMessageB64(requestObjectDataJson)}
      </div>
      
      {isQromaWebSerialConnected ? 
        <button onClick={() => sendRequest() }>Send Request</button> :
        <button onClick={() => startConnection() }>Start Connection!</button> 
      }
      <button onClick={() => createQromaCommMessage() }>Show Qroma Comm Message</button>
      <button onClick={() => promptUserForJson() }>Load from JSON</button>
      <button onClick={() => promptUserForBase64QromaCommand() }>Load QC Command from B64</button>
      <button onClick={() => promptUserForBase64QromaResponse() }>Load QC Response from B64</button>
      {/* <button onClick={() => doSetUpdateProgressIndicatorTest() }>Test</button> */}
      <MessageDataViewerComponent
        messageType={props.requestMessageType}
        messageData={requestObject}
        />
    </div>
  )
}