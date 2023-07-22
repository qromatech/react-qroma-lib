import React, { useState } from "react"
import { MessageType } from "@protobuf-ts/runtime";
import { MessageDataViewerComponent } from "./proto-components/message-data-viewer/MessageDataViewerComponent";
import { IUseQromaAppWebSerialInputs, useQromaAppWebSerial } from "./webserial/QromaAppWebSerial";
import { PortRequestResult } from "./webserial/QromaWebSerial";
import { QromaCommResponse } from "../qroma-comm-proto/qroma-comm";


interface IQromaCommMonitorProps<T extends object> {
  messageType: MessageType<T>
}

export const QromaCommMonitor = <T extends object>(props: IQromaCommMonitorProps<T>) => {
  
  const [messageData, setMessageData] = useState(props.messageType.create());

  const onQromaCommResponse = (message: QromaCommResponse) => {
    console.log("QromaCommMonitor - onQromaCommResponse");
    console.log(message);
  };

  const onQromaAppResponse = (appMessage: T) => {
    console.log("QromaCommMonitor - onQromaAppResponse");
    setMessageData(appMessage);
  }

  const webSerialInputs: IUseQromaAppWebSerialInputs<T, T> = {
    onPortRequestResult: (requestResult: PortRequestResult) => { console.log("PORT REQUEST RESULT " + requestResult.success) },
    commandMessageType: props.messageType,
    responseMessageType: props.messageType,
    onQromaCommResponse,
    onQromaAppResponse,
  };
  const webSerial = useQromaAppWebSerial(webSerialInputs);

  if (webSerial === null) {
    return (
      <>
      Serial not supported
      </>
    )
  }
  
  return (
    <div>
      Qroma comm monitor
      <button onClick={async () => {
        const port = await webSerial.requestPort();
        console.log("PORT");
        console.log(port);
        webSerial.startMonitoring();
      }}>
        Start monitor
      </button>
      <button onClick={() => {
        webSerial.stopMonitoring();
      }}>
        Stop monitor
      </button>
      
      <MessageDataViewerComponent
        messageType={props.messageType}
        messageData={messageData}
        />
    </div>
  )
}