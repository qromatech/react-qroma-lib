import React, { useState } from "react"
import { MessageType } from "@protobuf-ts/runtime";
import { QromaIoShowQromaFileAsMessageTypeUiComponent } from "./QromaIoShowQromaFileAsMessageTypeUiComponent";


interface IQromaIoShowQromaFileAsMessageTypeComponentProps<T extends object, U extends object> {
  fileMessageType: MessageType<U>
  filePath: string
}

export const QromaIoShowQromaFileAsMessageTypeComponent = <T extends object, U extends object>(
  props: IQromaIoShowQromaFileAsMessageTypeComponentProps<T, U>
) => {

  return (
    <QromaIoShowQromaFileAsMessageTypeUiComponent
      fileMessageType={props.fileMessageType}
      filePath={props.filePath}
      />
  )
}
