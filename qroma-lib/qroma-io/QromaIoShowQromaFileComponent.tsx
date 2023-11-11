import React, { useState } from "react"
import { MessageType } from "@protobuf-ts/runtime";
// import { MessageDataViewerComponent } from "./proto-components/message-data-viewer/MessageDataViewerComponent";
// import { IQromaAppWebSerial, IUseQromaAppWebSerialInputs, useQromaAppWebSerial } from "./webserial/QromaAppWebSerial";
// import { PortRequestResult } from "./webserial/QromaWebSerial";
// import { QromaCommResponse } from "../qroma-comm-proto/qroma-comm";
import { IQromaAppWebSerial } from "../webserial/QromaAppWebSerial";


interface IQromaIoShowQromaFileComponentProps<T extends object, U extends object> {
  responseMessageType: MessageType<U>
  qromaWebSerial: IQromaAppWebSerial<T>
}

export const QromaIoShowQromaFileComponent = <T extends object, U extends object>(
  props: IQromaIoShowQromaFileComponentProps<T, U>
) => {
  
  return (
    <div>QromaIoShowQromaFileComponent!!!</div>
  )
}
