import React, { useState } from "react"
import { MessageType } from "@protobuf-ts/runtime";
import { PortRequestResult, QromaCommResponse, useQromaAppWebSerial } from "../..";
import { IUseQromaAppWebSerialInputs } from "../webserial/QromaAppWebSerial";
import {useLocation} from '@docusaurus/router';
import { convertBase64ToBinary } from "../utils";
import { QcuCreateQromaCommMessageForAppCommand } from "../QromaCommUtils";


interface IQromaIoSendAppMessageComponentProps<T extends object, U extends object> {
  requestMessageType: MessageType<T>
  responseMessageType: MessageType<U>
}


export const QromaIoSendAppMessageComponent = <T extends object, U extends object>(
  props: IQromaIoSendAppMessageComponentProps<T, U>
) => {
  
  const [qromaAppResponse, setQromaAppResponse] = useState(props.responseMessageType.create());
  const [isPortConnected, setIsPortConnected] = useState(false);
  
  const inputs: IUseQromaAppWebSerialInputs<T, U> = {
    onQromaAppResponse: (appMessage: U) => {
      console.log("QromaIoSendAppMessageComponent - onQromaAppResponse!!");
      console.log(appMessage);
      setQromaAppResponse(appMessage);
    },
    onQromaCommResponse: (message: QromaCommResponse) => {
      console.log("QromaRequestForm - onQromaCommResponse!!");
      console.log(message);
    },
    commandMessageType: props.requestMessageType,
    responseMessageType: props.responseMessageType,
    onPortRequestResult: (requestResult: PortRequestResult) => {
      if (requestResult.success) {
        setIsPortConnected(true);
      } else {
        setIsPortConnected(false);
      }
    }
  }
  const qromaAppWebSerial = useQromaAppWebSerial(inputs);

  const location = useLocation();
  console.log(location);

  const hash: string = location.hash;
  const isValid = hash.startsWith("#/");

  if (!isValid) {
    return <div>
      Invalid Base 64 message path. Paths must start with <b>#/</b>.
    </div>
  }

  const b64Content = hash.substring(2);
  const messageBytes = convertBase64ToBinary(b64Content);

  const requestObject = props.requestMessageType.fromBinary(messageBytes);
  
  const qromaCommCommand = QcuCreateQromaCommMessageForAppCommand(requestObject, props.requestMessageType);
  console.log(qromaCommCommand);

  const sendRequest = async () => {
    console.log("SEND B64: " + b64Content);
    console.log("SEND OBJECT");
    console.log(requestObject);

    const result = await qromaAppWebSerial.sendQromaAppCommand(requestObject);

    console.log("REQUEST SENT");
    console.log(result);
  }

  const startConnection = () => {
    qromaAppWebSerial.startMonitoring();
  }

  const isQromaWebSerialConnected = qromaAppWebSerial.getConnectionState().isWebSerialConnected;

  let appCommandJsonStr = "";
  try {
    appCommandJsonStr = props.requestMessageType.toJsonString(requestObject);
  } catch (e) {
    console.log("ERROR SETTING APP COMMAND JSON STR");
    console.log(e);
  }
  
  return (
    <div>
      <div>App Command: {appCommandJsonStr}</div>

      <div>B64Content: {b64Content}</div>
      <div>Location: {location.pathname}</div>
      <div>Hash: <b>{location.hash}</b></div>
      <div>QromaIoSendAppMessageComponent!!!</div>
      {isQromaWebSerialConnected ? 
        <button onClick={() => sendRequest() }>Send App Message</button> :
        <button onClick={() => startConnection() }>Start Connection!</button> 
      }
      <div>
        App Response: {JSON.stringify(qromaAppResponse)}
      </div>
    </div>
  )
}
