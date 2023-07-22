import React from "react"
import { JsonObject, JsonValue, typeofJsonValue } from "@protobuf-ts/runtime"
import { MessageDataJsonObjectComponent } from "./MessageDataJsonObjectComponent"
import { MessageDataJsonArrayComponent } from "./MessageDataJsonArrayComponent";


export const MessageDataJsonValueViewerComponent = ({name, value}: {name: string, value: JsonValue}) => {

  switch (typeofJsonValue(value)) {
    case 'object':
      return (
        <>
          {name}
          <MessageDataJsonObjectComponent
            obj={value as JsonObject}
            />
        </>
      )

    case 'array':
      return (
        <>
          {name}
          <MessageDataJsonArrayComponent
            arr={value as JsonValue[]}
            />
        </>
      )

    default:
      // do nothing
  }
  
  return (
    <>
      <div>
        {name}: {value?.valueOf().toString()}
      </div>
    </>
  )
}