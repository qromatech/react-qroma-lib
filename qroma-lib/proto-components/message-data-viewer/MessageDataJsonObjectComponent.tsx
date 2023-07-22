import React from "react"
import { JsonObject } from "@protobuf-ts/runtime"
import { MessageDataJsonValueViewerComponent } from "./MessageDataJsonValueViewerComponent";


export const MessageDataJsonObjectComponent = ({obj}: {obj: JsonObject}) => {

  return (
    <ul>
      {
        Object.entries(obj).map(([key, value]) => (
          <li key={key}>
            <MessageDataJsonValueViewerComponent
              name={key}
              value={value}
              key={key}
              />
          </li>
        ))
      }
    </ul>
  )
}