import React, { useState } from "react"
import { FieldInfo, IMessageType, JsonObject } from "@protobuf-ts/runtime"
import { MessageAllFieldsInputComponent, OneofGroup } from "./MessageAllFieldsInputComponent"
// import { MessageAllFieldsDetailsComponent } from "./MessageAllFieldsDetailsComponent";


interface IMessageInputComponentProps<T extends object> {
  // requestMessageType: MessageType<T>
  requestMessageType: IMessageType<T>
  messageName: string
  typeName: string
  fields: readonly FieldInfo[]
  onChange: <T>(field: FieldInfo, newValue: T) => void
}


export const MessageInputComponent = <T extends object>(props: IMessageInputComponentProps<T>) => {

  const [requestObjectData, setRequestObjectData] = useState(
    props.requestMessageType.toJson(props.requestMessageType.create()) as JsonObject);


  const onMessageInputChange = (field: FieldInfo, newValue: any) => {
    console.log("onMessageInputChange - New value!!! ");
    console.log(field);
    console.log(newValue);

    const newRequestObjectData = JSON.parse(JSON.stringify(requestObjectData));
    console.log(requestObjectData);
    newRequestObjectData[field.name] = newValue;
    setRequestObjectData(newRequestObjectData);
    console.log(newRequestObjectData);

    props.onChange(field, newRequestObjectData);
  }

  const onOneofChange = (oneof: OneofGroup, oneofSelection: string, newValue: any) => {
    console.log("MessageInputComponent - onOneof")
    console.log(oneof);
    console.log(oneofSelection);
    console.log(newValue);

    // props.onChange()
  }

  const clearParentFieldValue = (fieldName: string) => {
    console.log("IN clearParentFieldValue");
    console.log(fieldName);
    console.log(requestObjectData);
    if (requestObjectData !== null) {
      const {[fieldName]: _, ...clearedObject} = requestObjectData;
      setRequestObjectData(clearedObject);
      console.log(clearedObject);
    }
  }

  
  return (
    <div>
      {props.messageName} [{props.typeName}] +++
      <MessageAllFieldsInputComponent
        messageTypeName={props.typeName}
        fields={props.fields}
        onChange={onMessageInputChange}
        onOneofChange={onOneofChange}
        clearParentFieldValue={clearParentFieldValue}
        />
    </div>

  )
}