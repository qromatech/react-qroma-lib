import React from "react"
import {useLocation} from '@docusaurus/router';
import { IQromaConnectionState, QromaCommCommand, QromaCommResponse, useQromaCommWebSerial } from "../..";
import { convertBase64ToBinary } from "../utils";


interface IQromaIoSendQromaCommMessageComponentProps { }


export const QromaIoSendQromaCommMessageComponent = (
  props: IQromaIoSendQromaCommMessageComponentProps
) => {

  console.log("HERE... QromaIoSendQromaCommMessageComponent")

  const onQromaCommResponse = (message: QromaCommResponse) => {
    console.log("onQromaCommResponse")
    console.log(message)
  }

  const onConnectionChange = (latestConnection: IQromaConnectionState) => {
    console.log("onConnectionChange")
    console.log(latestConnection)    
  }


  const qromaCommWebSerial = useQromaCommWebSerial(onQromaCommResponse, onConnectionChange);

 
  const location = useLocation();
  console.log(location);

  const hash: string = location.hash;
  const isValid = hash.startsWith("#/");

  if (!isValid) {
    return (
      <div>
        Invalid Base 64 message path. Paths must start with <b>#/</b>.
      </div>
    )
  }

  const b64Content = hash.substring(2);
  const theCommandBytes = convertBase64ToBinary(b64Content);

  const theCommand = QromaCommCommand.fromBinary(theCommandBytes);

  if (theCommand === undefined) {
    return (
      <div>
        Could not convert Base 64 to valid QromaCommCommand object.
      </div>
    )
  }

  const commandJsonStr = QromaCommCommand.toJsonString(theCommand);

  const sendRequest = async () => {
    console.log("SEND B64: " + b64Content);

    const result = await qromaCommWebSerial.sendQromaCommCommand(theCommand);

    console.log("REQUEST SENT");
    console.log(result);
  }

  const startConnection = () => {
    qromaCommWebSerial.startMonitoring();
  }

  const isConnected = qromaCommWebSerial.getConnectionState().isWebSerialConnected;
  const isQromaWebSerialConnected = qromaCommWebSerial.getConnectionState().isWebSerialConnected;

  
  return (
    <div>
      <div>
        Serial Connected? { isConnected ? "Yes" : "No" } / { isQromaWebSerialConnected ? "Yes" : "No" }
      </div> 

      <div>B64Content: {b64Content}</div>
      <div>Location: {location.pathname}</div>
      <div>Hash: <b>{location.hash}</b></div>
      <div>JSON: {commandJsonStr}</div>
      {isQromaWebSerialConnected ? 
        <button onClick={() => sendRequest() }>Send Qroma Comm Message</button> :
        <button onClick={() => startConnection() }>Start Connection!</button> 
      }
    </div>
  )
}
