import React from "react"
import { IMessageType } from "@protobuf-ts/runtime"
import { MessageDataJsonValueViewerComponent } from "./MessageDataJsonValueViewerComponent"


interface IMessageDataViewerComponentProps<T extends object> {
  messageType: IMessageType<T>
  messageData: T
}


export const MessageDataViewerComponent = <T extends object>(props: IMessageDataViewerComponentProps<T>) => {

  const messageJson = props.messageType.toJson(props.messageData);
  if (!messageJson) {
    return <div>
      Invalid data to convert to JSON for {props.messageType.typeName}
    </div>
  }

  return (
    <MessageDataJsonValueViewerComponent
      name={''}
      value={messageJson}
      />
  )
}