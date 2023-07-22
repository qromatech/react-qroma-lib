import React from "react"
import { FieldInfo } from "@protobuf-ts/runtime"
import { MessageEnumFieldDetailsComponent } from "./MessageEnumFieldDetailsComponent"
import { MessageScalarFieldDetailsComponent } from "./MessageScalarFieldDetailsComponent"
import { MessageDetailsComponent } from "./MessageDetailsComponent"


export const MessageSingleFieldDetailsComponent = ({field}: {field: FieldInfo}) => {
  switch (field.kind) {
    case "scalar":
      return (
        <MessageScalarFieldDetailsComponent
          field={field}
          />
      )
    case "enum":
      return (
        <MessageEnumFieldDetailsComponent
          field={field}
          />
      )
    case "message":
      return (
        <MessageDetailsComponent
          typeName={field.T().typeName}
          fields={field.T().fields}
          />
      )
  }

  return (
    <div>
      UNCLASSIFIED: {field.name} [{field.kind}] - [{field.oneof}]
    </div>
  )
}