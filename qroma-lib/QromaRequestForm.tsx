// import { Buffer } from 'buffer';
import { FieldInfo, IMessageType } from "@protobuf-ts/runtime"
import React, { useState } from "react"
import { MessageInputComponent } from "./proto-components/message-builder/MessageInputComponent"
import { MessageDataViewerComponent } from './proto-components/message-data-viewer/MessageDataViewerComponent';
import { IQromaAppWebSerial } from "./webserial/QromaAppWebSerial";
// import { IUseQromaAppWebSerialInputs, useQromaAppWebSerial } from './webserial/QromaAppWebSerial';
// import { QromaCommResponse } from '../qroma-comm-proto/qroma-comm';


interface IQromaRequestFormProps<TCommand extends object, TResponse extends object> {
  requestMessageType: IMessageType<TCommand>
  responseMessageType: IMessageType<TResponse>
  qromaWebSerial: IQromaAppWebSerial<TCommand>
}

export const QromaRequestForm = <TCommand extends object, TResponse extends object>(props: IQromaRequestFormProps<TCommand, TResponse>) => {
  const m = props.requestMessageType;

  const [requestObject, _] = useState(props.requestMessageType.create());
  const [requestObjectData, setRequestObjectData] = useState(
    props.requestMessageType.toJson(props.requestMessageType.create()));

  console.log("INIT OBJECT STATE");
  console.log(requestObjectData);

  const onChange = (_: FieldInfo, newValue: any) => {
    console.log("REQUEST FORM CHANGE");
    console.log(newValue);

    // const x = {
    //   setLightColor: {
    //     r: '3'
    //   }
    // }

    const newRequestObjectData = JSON.parse(JSON.stringify(newValue));
    // const newRequestObjectData = JSON.parse(JSON.stringify(x));
    setRequestObjectData(newRequestObjectData);
  }

  
  // const inputs: IUseQromaAppWebSerialInputs<TCommand, TResponse> = {
  //   onQromaAppResponse: (appMessage: TResponse) => {
  //     console.log("QromaRequestForm - onQromaAppResponse");
  //     console.log(appMessage);
  //   },
  //   onQromaCommResponse: (message: QromaCommResponse) => {
  //     console.log("QromaRequestForm - onQromaCommResponse");
  //     console.log(message);
  //   },
  //   commandMessageType: props.requestMessageType,
  //   responseMessageType: props.responseMessageType,
  //   onPortRequestResult: () => { console.log("PORT REQUEST COMPLETE") }
  // }
  // const qromaWebSerial = useQromaAppWebSerial(inputs);
  
  const sendRequest = async () => {
    console.log("SEND COMMAND");

    const requestObject = props.requestMessageType.fromJson(requestObjectData);
    const result = await props.qromaWebSerial.sendQromaAppCommand(requestObject);

    console.log("REQUEST SENT");
    console.log(result);
  }
  
  return (
    <div>
      {/* Qroma Request Form: {props.requestMessageType.typeName}
      <button onClick={() => qromaWebSerial.startMonitoring() }>START MONITORING</button> */}

      {/* <MessageInputComponent
        requestMessageType={m}
        messageName="requestForm"
        typeName={m.typeName}
        fields={m.fields}
        onChange={onChange}
        key={m.typeName}
        /> */}
      <MessageInputComponent
        requestMessageType={m}
        messageName="requestForm"
        typeName={m.typeName}
        fields={m.fields}
        onChange={onChange}
        key={m.typeName}
        />
      <button onClick={() => sendRequest() }>Send Request</button>
      <MessageDataViewerComponent
        messageType={props.requestMessageType}
        messageData={requestObject}
        />
      <div>
        {props.requestMessageType.toJsonString(props.requestMessageType.fromJson(requestObjectData))}
      </div>
    </div>
  )
}
