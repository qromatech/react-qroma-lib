import React from "react"
import { MessageDataJsonValueViewerComponent } from "./MessageDataJsonValueViewerComponent";
import { JsonValue } from "@protobuf-ts/runtime";


export const MessageDataJsonArrayComponent = ({arr}: {arr: JsonValue[]}) => {

  return (
    <li>
      {
        arr.map((x, index) => {
          return (
            <MessageDataJsonValueViewerComponent
              name={index.toString()}
              value={x} 
              />
          );
        })
      }
    </li>
  )
}