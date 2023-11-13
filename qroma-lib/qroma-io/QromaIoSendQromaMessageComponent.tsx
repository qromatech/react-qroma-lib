import React, { useState } from "react"
import { IQromaAppWebSerial } from "../webserial/QromaAppWebSerial";
import { IUseQromaCommWebSerialInputs, useQromaCommWebSerial } from "../webserial/QromaCommWebSerial";
import { QromaCommCommand, QromaCommResponse } from "../../qroma-comm-proto/qroma-comm";
import { PortRequestResult } from "../webserial/QromaWebSerial";
import { useLocation } from "@docusaurus/router";
import { convertBase64ToBinary } from "../utils";
import { useInitQromaCommWebSerial } from "../QromaSiteApp";


interface IQromaIoSendQromaMessageComponentProps<T extends object, U extends object> {
  qromaWebSerial: IQromaAppWebSerial<T>
}


export const QromaIoSendQromaMessageComponent = <T extends object, U extends object>(
  props: IQromaIoSendQromaMessageComponentProps<T, U>
) => {
  
  let latestResponse: QromaCommResponse | undefined = undefined;
  let _onConnection: ((success: boolean) => void) | undefined = undefined; 

  const setLatestResponse = (message: QromaCommResponse) => {
    latestResponse = message;
  }

  const onQromaCommResponse = (message: QromaCommResponse) => {
    setLatestResponse(message);
  }

  const onPortRequestResult = (requestResult: PortRequestResult) => {
    if (_onConnection !== undefined) {
      _onConnection(requestResult.success);
    }
  }

  const qromaCommWebSerialInputs: IUseQromaCommWebSerialInputs = {
    onQromaCommResponse,
    onConnect: () => { console.log("SERIAL CONNECTED"); },
    onDisconnect: () => { console.log("SERIAL DISCONNECTED"); },
    onPortRequestResult,
  }

  // const qromaCommWebSerial = useQromaCommWebSerial(qromaCommWebSerialInputs);
  const qromaCommWebSerial = useInitQromaCommWebSerial(qromaCommWebSerialInputs);
  
  const [isPortConnected, setIsPortConnected] = useState(false);

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

  const requestObject = QromaCommCommand.fromBinary(messageBytes);
  console.log("QROMA COMM COMMAND")
  console.log(requestObject)
  const requestObjectJsonStr = QromaCommCommand.toJsonString(requestObject);
  
  const sendRequest = async () => {
    console.log("SEND B64: " + b64Content);
    console.log("SEND OBJECT");
    console.log(requestObject);

    const result = await qromaCommWebSerial.sendQromaCommCommand(requestObject);

    console.log("REQUEST SENT");
    console.log(result);
  }

  const startConnection = () => {
    console.log("START CONNECTION");
    qromaCommWebSerial.startMonitoring();
    console.log("CONNECTION STARTED: " + qromaCommWebSerial.getIsConnected());
  }

  const isQromaWebSerialConnected = qromaCommWebSerial.getIsConnected();

  
  return (
    <div>
      <div>
        Serial Connected? { qromaCommWebSerial.getIsConnected() ? "Yes" : "No" } / { isPortConnected ? "Yes" : "No" }
      </div> 

      <div>B64Content: {b64Content}</div>
      <div>Location: {location.pathname}</div>
      <div>Hash: <b>{location.hash}</b></div>
      <div>JSON: {requestObjectJsonStr}</div>
      <div></div>
      {isQromaWebSerialConnected ? 
        <button onClick={() => sendRequest() }>Send Qroma Message</button> :
        <button onClick={() => startConnection() }>Start Connection!</button> 
      }
    </div>
  )
}
