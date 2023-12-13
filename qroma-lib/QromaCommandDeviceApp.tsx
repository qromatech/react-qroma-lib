import React, { useState } from "react"
import { MessageType } from "@protobuf-ts/runtime";
import { IUseQromaAppWebSerialInputs, PortRequestResult, QromaCommResponse, QromaRequestForm, useQromaAppWebSerial } from "..";


interface IQromaCommandDeviceAppProps<T extends object, U extends object> {
  requestMessageType: MessageType<T>
  responseMessageType: MessageType<U>
}


export const QromaCommandDeviceApp = <T extends object, U extends object>(props: IQromaCommandDeviceAppProps<T, U>) => {
  
  const [qromaAppResponse, setQromaAppResponse] = useState(props.responseMessageType.create());
  const [isPortConnected, setIsPortConnected] = useState(false);

  const inputs: IUseQromaAppWebSerialInputs<T, U> = {
    onQromaAppResponse: (appMessage: U) => {
      console.log("QromaRequestForm - onQromaAppResponse!!");
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
      console.log("PORT REQUEST RESULT");
      console.log(requestResult);
      if (requestResult.success) {
        setIsPortConnected(true);
      } else {
        setIsPortConnected(false);
      }
    }
  }
  const qromaAppWebSerial = useQromaAppWebSerial(inputs);

  const isConnected = qromaAppWebSerial.getConnectionState().isWebSerialConnected;
  
  return (
    <>
      {props.requestMessageType.typeName} => {props.responseMessageType.typeName}

      <div>
        Serial Connected? { isConnected ? "Yes" : "No" } / { isPortConnected ? "Yes" : "No" }
      </div> 

      <QromaRequestForm
        requestMessageType={props.requestMessageType}
        responseMessageType={props.responseMessageType}
        qromaWebSerial={qromaAppWebSerial}
        />

      <div>
        QC Response: 
      </div>
      <div>
        App Response: {JSON.stringify(qromaAppResponse)}
      </div>
{/* 
      <QromaCommMonitor
        responseMessageType={props.responseMessageType}
        qromaWebSerial={qromaWebSerial}
        /> */}
    </>
  )
}