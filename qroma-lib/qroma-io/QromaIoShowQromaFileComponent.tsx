import React, { useState } from "react"
import { MessageType } from "@protobuf-ts/runtime";
import { IQromaAppWebSerial } from "../webserial/QromaAppWebSerial";
import { QromaIoShowQromaFileUiComponent } from "./QromaIoShowQromaFileUiComponent";


interface IQromaIoShowQromaFileComponentProps<T extends object, U extends object> {
  responseMessageType: MessageType<U>
  qromaWebSerial: IQromaAppWebSerial<T>
}

export const QromaIoShowQromaFileComponent = <T extends object, U extends object>(
  props: IQromaIoShowQromaFileComponentProps<T, U>
) => {

  return (
    <QromaIoShowQromaFileUiComponent
      // qromaCommFileSystemApi={qromaCommFileSystemApi}
      />
  )
}
