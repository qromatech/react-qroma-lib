import React from "react"
import { FieldInfo } from "@protobuf-ts/runtime"
import { MessageScalarFieldInputComponent } from "./MessageScalarFieldInputComponent"
import { MessageEnumFieldInputComponent } from "./MessageEnumFieldInputComponent"
import { MessageInputComponent } from "./MessageInputComponent"


interface IMessageSingleFieldInputComponentProps {
  messageValue: any
  field: FieldInfo
  onOneofFieldSelectionChange: (field: FieldInfo, newValue: any) => void
  onMemberValueChange: (field: FieldInfo, newValue: any) => void
}


export const MessageSingleFieldInputComponent = (props: IMessageSingleFieldInputComponentProps) => {
  const field = props.field;

  console.log("IN RENDER FOR MessageSingleFieldInputComponent")
  console.log(props)

  switch (field.kind) {
    case "scalar":
      return (
        <MessageScalarFieldInputComponent
          value={props.messageValue[field.name]}
          field={field}
          onChange={props.onChange}
          />
      )
    case "enum":
      const enumOnChange = (field: FieldInfo, newValue: any) => {
        console.log("ENUM ON CHANGE");
        console.log(newValue)
        props.onMemberValueChange(field, newValue)
        // props.onChange(field, newValue);
        // onEnumFieldChange
      }

      console.log("RENDERING ENUM COMP")
      return (
        <MessageEnumFieldInputComponent
          field={field}
          onEnumValueChange={enumOnChange}
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

      const updateMe = (fieldName: string, value: any) => {

      }

      // return (
      //   <>mfdsakljl</>
      // )

      return (
        <MessageInputComponent
          messageType={field.T()}
          messageValue={props.messageValue}
          // messageName={field.name}
          // typeName={field.T().typeName}
          fields={field.T().fields}
          updateParentObject={updateMe}
          // onChange={subMessageOnChange}
          // onChange={props.onChange}
          // onScalarValueChange={(field, newValue) => props.onChange(field, newValue)}
          // onEnumChange={(enumDef, enumValue) => { console.log("IN AN ENUM CHANGE")}}
          // onOneofChange={(oneofGroup, oneofSelection, newValue) => { }}
          />
      )
  }

  return (
    <div>
      UNCLASSIFIED: {field.name} [{field.kind}] - [{field.oneof}]
    </div>
  )
}