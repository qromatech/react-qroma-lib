import React from "react"
import { FieldInfo } from "@protobuf-ts/runtime"
import { MessageScalarFieldInputComponent } from "./MessageScalarFieldInputComponent"
import { MessageEnumFieldInputComponent } from "./MessageEnumFieldInputComponent"
import { MessageInputComponent } from "./MessageInputComponent"


interface IMessageSingleFieldInputComponentProps {
  field: FieldInfo
  onChange: <T>(field: FieldInfo, newValue: T) => void
}


export const MessageSingleFieldInputComponent = (props: IMessageSingleFieldInputComponentProps) => {
  const field = props.field;

  switch (field.kind) {
    case "scalar":
      return (
        <MessageScalarFieldInputComponent
          field={field}
          onChange={props.onChange}
          />
      )
    case "enum":
      return (
        <MessageEnumFieldInputComponent
          field={field}
          onChange={props.onChange}
          />
      )
    case "message":
      // const subMessageOnChange = (subField: FieldInfo, newValue) => {
      //   console.log("SUBMESSAGE CHANGE: " + subField.name);
      //   console.log(newValue);
      //   const subValue = {
      //     // subField.name: newValue,
      //   };
      //   subValue[subField.name] = newValue;
      //   props.onChange(field, subValue);
      // };

      const subMessageOnChange = (subField: FieldInfo, newValue: any) => {
        console.log("SUBMESSAGE CHANGE: " + subField.name);
        console.log(newValue);
        // const subValue = {
        //   // subField.name: newValue,
        // };
        // subValue[subField.name] = newValue;
        props.onChange(field, newValue);
      };


      return (
        <MessageInputComponent
          requestMessageType={field.T()}
          messageName={field.name}
          typeName={field.T().typeName}
          fields={field.T().fields}
          onChange={subMessageOnChange}
          // onChange={props.onChange}
          />
      )
  }

  return (
    <div>
      UNCLASSIFIED: {field.name} [{field.kind}] - [{field.oneof}]
    </div>
  )
}