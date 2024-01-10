import React, { useState } from "react"
import { FieldInfo, IMessageType, JsonObject } from "@protobuf-ts/runtime"
import { MessageAllFieldsInputComponent } from "./MessageAllFieldsInputComponent"
import { OneofGroup } from "./defs"
import { MessageInputComponent } from "./MessageInputComponent"
// import { updateMessageOneofField } from "./builder_utils"
// import { MessageAllFieldsDetailsComponent } from "./MessageAllFieldsDetailsComponent";


interface IMessageInputComponentProps<T extends object> {
  // requestMessageType: MessageType<T>
  messageType: IMessageType<T>
  messageName: string
  // typeName: string
  // fields: readonly FieldInfo[]
  // onChange: <T>(field: FieldInfo, newValue: T) => void
  rootMessageValue: T
  onNewRootMessageValue: <T>(newRootMessageValue: T) => void
}


export const RootMessageComponent = <T extends object>(props: IMessageInputComponentProps<T>) => {

  // const [requestObjectData, setRequestObjectData] = useState(
  //   props.messageType.toJson(props.messageType.create()) as JsonObject);

  

  const onScalarValueChange = (field: FieldInfo, newValue: any) => {
    console.log("Root: onMessageInputChange - New value!!! ");
    console.log(field);
    console.log(newValue);

    const valueToSet = field.kind === 'enum' ? field.no : newValue;

    const requestObjectData = props.rootMessageValue;

    const newRequestObjectData = JSON.parse(JSON.stringify(requestObjectData));
    console.log(requestObjectData);
    newRequestObjectData[field.name] = valueToSet;
    // setRequestObjectData(newRequestObjectData);
    console.log("ROOT WITH NEW SCALAR VALUE")
    console.log(field)
    console.log(newRequestObjectData);

    props.onNewRootMessageValue(newRequestObjectData);
  }

  const onOneofChange = (oneof: OneofGroup, oneofSelection: string) => {
    console.log("Root: MessageInputComponent - onOneof")
    console.log(oneof);
    console.log(oneofSelection);

    const newRootMessageValue = updateMessageOneofField(props.rootMessageValue, oneof, oneofSelection);
    
    console.log("NEW ROOT MESSAGE TO SET")
    console.log(newRootMessageValue)
    
    // props.onNewRootMessageValue
  }

  const onEnumChange = (enumDef: any, enumStrValue: string, enumIntValue: number) => {
    console.log("Root: MESSAGE INPUT ON-ENUM-CHANGE")
    console.log(enumDef)
  }

  const updateParentOneofValue = (fieldName: string, value: any) => {
    console.log("UPDATING PARENT OBJECT")
    console.log(props.rootMessageValue)
    console.log(fieldName);
    console.log(value)
    props.rootMessageValue[fieldName] = value;
    props.onNewRootMessageValue(props.rootMessageValue)
  }

  const updateParentMemberValue = (fieldName: string, value: any) => {
    console.log("UPDATING PARENT MEMBER")
    console.log(props.rootMessageValue)
    console.log(fieldName);
    console.log(value)
    props.rootMessageValue[fieldName] = value;
    props.onNewRootMessageValue(props.rootMessageValue)
  }

  // const clearParentFieldValue = (fieldName: string) => {
  //   console.log("IN clearParentFieldValue");
  //   console.log(fieldName);
  //   console.log(requestObjectData);
  //   if (requestObjectData !== null) {
  //     const {[fieldName]: _, ...clearedObject} = requestObjectData;
  //     setRequestObjectData(clearedObject);
  //     console.log(clearedObject);
  //   }
  // }

  
  return (
    <div>
      {props.messageName} [{props.messageType.typeName}] +++
      {/* <MessageAllFieldsInputComponent
        messageTypeName={props.typeName}
        fields={props.fields}
        onChange={onMessageInputChange}
        onOneofChange={onOneofChange}
        onEnumChange={onEnumChange}
        clearParentFieldValue={clearParentFieldValue}
        /> */}
      <MessageInputComponent
        // messageName={props.messageType.typeName}
        messageType={props.messageType}
        messageValue={props.rootMessageValue}
        fields={props.messageType.fields}
        // onScalarValueChange={onScalarValueChange}
        // onOneofChange={onOneofChange}
        // onEnumChange={onEnumChange}
        updateParentOneofValue={updateParentOneofValue}
        updateParentMemberValue={updateParentMemberValue}
        // clearParentFieldValue={clearParentFieldValue}
        />
    </div>

  )
}