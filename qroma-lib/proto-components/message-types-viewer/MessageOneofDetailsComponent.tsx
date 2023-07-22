import { FieldInfo } from "@protobuf-ts/runtime"
import React from "react"
import { MessageSingleFieldDetailsComponent } from "./MessageSingleFieldDetailsComponent"

export const MessageOneofDetailsComponent = ({oneofName, fields}: {oneofName: string, fields: FieldInfo[]}) => {

  return (
    <>
      {oneofName} [oneof]
      <ul>
        {
          fields.map(f => (
            <MessageSingleFieldDetailsComponent
              field={f}
              key={f.name}
              />
          ))
        }
      </ul>
    </>
  )
}